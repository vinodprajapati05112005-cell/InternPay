from __future__ import annotations

import json
import logging
import os
import re
from datetime import timedelta

import requests
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.common.choices import AIAnalysisStatus, AIRecommendation, ContractStatus, MilestoneStatus, NotificationType, SubmissionStatus
from apps.common.services import create_notification, normalize_score, recommendation_from_score
from apps.submissions.models import AIReport

logger = logging.getLogger(__name__)

GEMINI_API_URL = os.getenv("GEMINI_API_URL", "https://generativelanguage.googleapis.com/v1beta").rstrip("/")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip() or "gemini-2.5-flash"

_JSON_FENCE_RE = re.compile(r"^```(?:json)?\s*|\s*```$", re.IGNORECASE | re.MULTILINE)


def build_prompt(submission) -> str:
    contract = submission.contract
    milestone = submission.milestone
    files = [
        {
            "name": item.original_name,
            "type": item.file_type,
            "size": item.file_size,
        }
        for item in submission.files.all()
    ]
    payload = {
        "contract": {
            "title": contract.title,
            "description": contract.description,
            "requirements": contract.requirements,
            "total_amount": str(contract.total_amount),
        },
        "milestone": {
            "title": milestone.title,
            "description": milestone.description,
            "amount": str(milestone.amount),
            "deadline": milestone.deadline.isoformat(),
        },
        "submission": {
            "github_url": submission.github_url,
            "demo_url": submission.demo_url,
            "figma_url": submission.figma_url,
            "documentation_url": submission.documentation_url,
            "video_url": submission.video_url,
            "additional_notes": submission.additional_notes,
            "files": files,
        },
    }
    return (
        "You are InternPay's AI evaluator. Assess the submitted project against the contract requirements and milestone scope.\n"
        "Return JSON only with these keys: code_score, design_score, requirement_score, functionality_score, overall_score, strengths, weaknesses, recommendation, explanation, status.\n"
        "Scores must be integers from 0 to 100. strengths and weaknesses must be arrays of strings. recommendation must be one of APPROVED, APPROVED_WITH_NOTES, HUMAN_REVIEW, REJECTED. status must be COMPLETED or FAILED.\n"
        "Do not add markdown, code fences, or extra commentary.\n\n"
        f"Submission payload:\n{json.dumps(payload, indent=2)}"
    )


def _fallback_report(submission) -> dict:
    files = list(submission.files.all())
    code_score = 60
    design_score = 55
    requirement_score = 58
    functionality_score = 60
    strengths = []
    weaknesses = []

    if submission.github_url:
        code_score += 20
        functionality_score += 5
        strengths.append("Source repository provided.")
    else:
        weaknesses.append("Missing GitHub repository link.")

    if submission.demo_url:
        functionality_score += 15
        strengths.append("Live demo provided.")
    else:
        weaknesses.append("Missing demo link.")

    if submission.figma_url:
        design_score += 20
        strengths.append("Design reference provided.")

    if submission.documentation_url:
        requirement_score += 10
        strengths.append("Documentation link included.")

    if submission.video_url:
        functionality_score += 10
        strengths.append("Video walkthrough included.")

    if files:
        design_score += min(10, len(files) * 2)
        requirement_score += min(10, len(files) * 2)
        strengths.append("Supporting files uploaded.")

    if len(submission.additional_notes or "") > 80:
        requirement_score += 5
        strengths.append("Detailed submission notes provided.")

    overall = round((code_score + design_score + requirement_score + functionality_score) / 4)
    recommendation = recommendation_from_score(overall)
    if overall < 60:
        weaknesses.append("Submission appears incomplete or underdocumented.")
    elif overall < 70:
        weaknesses.append("A human reviewer should verify edge cases and completeness.")
    elif overall < 80:
        weaknesses.append("Minor polish or documentation gaps detected.")

    return {
        "code_score": normalize_score(code_score),
        "design_score": normalize_score(design_score),
        "requirement_score": normalize_score(requirement_score),
        "functionality_score": normalize_score(functionality_score),
        "overall_score": normalize_score(overall),
        "strengths": strengths or ["Submission metadata received."],
        "weaknesses": weaknesses or ["No major issues detected in fallback review."],
        "recommendation": recommendation,
        "explanation": "Fallback heuristic evaluation used because the Gemini API was unavailable or returned an invalid response.",
        "status": "COMPLETED",
        "model_version": "heuristic-fallback-v1",
        "raw_response": {"source": "fallback"},
    }


def _gemini_api_key() -> str:
    return (os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or "").strip()


def _extract_candidate_text(body: dict) -> str:
    candidates = body.get("candidates") or []
    if not candidates:
        feedback = body.get("promptFeedback") or body.get("prompt_feedback")
        raise ValidationError(f"Gemini returned no candidates. Prompt feedback: {feedback!r}")

    parts = candidates[0].get("content", {}).get("parts", [])
    texts = [part.get("text", "") for part in parts if isinstance(part, dict) and part.get("text")]
    text = "\n".join(texts).strip()
    if not text:
        raise ValidationError("Gemini returned an empty response.")
    return text


def _parse_json_response(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = _JSON_FENCE_RE.sub("", cleaned).strip()

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start == -1 or end == -1 or end <= start:
            raise
        data = json.loads(cleaned[start : end + 1])

    if not isinstance(data, dict):
        raise ValidationError("Gemini response must be a JSON object.")
    return data


def _normalize_string_list(value) -> list[str]:
    if not value:
        return []
    if isinstance(value, list):
        return [str(item).strip() for item in value if item not in (None, "") and str(item).strip()]
    if isinstance(value, str):
        return [value.strip()] if value.strip() else []
    return [str(value).strip()] if str(value).strip() else []


def _call_gemini(prompt: str) -> dict:
    api_key = _gemini_api_key()
    if not api_key:
        raise ValidationError("Gemini API key is not configured.")

    response = requests.post(
        f"{GEMINI_API_URL}/models/{GEMINI_MODEL}:generateContent",
        headers={
            "x-goog-api-key": api_key,
            "Content-Type": "application/json",
        },
        json={
            "systemInstruction": {
                "parts": [
                    {
                        "text": "You are a strict JSON-only evaluator for InternPay. Respond only with valid JSON.",
                    }
                ]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}],
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "response_mime_type": "application/json",
            },
        },
        timeout=60,
    )
    response.raise_for_status()
    body = response.json()
    parsed = _parse_json_response(_extract_candidate_text(body))
    parsed["model_version"] = GEMINI_MODEL
    parsed["raw_response"] = body
    return parsed


def _normalize_report(data: dict) -> dict:
    code_score = normalize_score(data.get("code_score"))
    design_score = normalize_score(data.get("design_score"))
    requirement_score = normalize_score(data.get("requirement_score"))
    functionality_score = normalize_score(data.get("functionality_score"))
    overall_score = normalize_score(
        data.get("overall_score", round((code_score + design_score + requirement_score + functionality_score) / 4))
    )

    recommendation = str(data.get("recommendation") or recommendation_from_score(overall_score)).upper()
    if recommendation not in {choice[0] for choice in AIRecommendation.choices}:
        recommendation = recommendation_from_score(overall_score)

    status = str(data.get("status") or "COMPLETED").upper()
    if status not in {choice[0] for choice in AIAnalysisStatus.choices}:
        status = "COMPLETED"

    return {
        "code_score": code_score,
        "design_score": design_score,
        "requirement_score": requirement_score,
        "functionality_score": functionality_score,
        "overall_score": overall_score,
        "strengths": _normalize_string_list(data.get("strengths")),
        "weaknesses": _normalize_string_list(data.get("weaknesses")),
        "recommendation": recommendation,
        "explanation": data.get("explanation", ""),
        "status": status,
        "model_version": data.get("model_version", GEMINI_MODEL),
        "raw_response": data.get("raw_response", {}),
    }


@transaction.atomic
def evaluate_submission_with_ai(*, submission, request=None, force: bool = False) -> AIReport:
    if not force and hasattr(submission, "ai_report"):
        return submission.ai_report

    prompt = build_prompt(submission)
    try:
        payload = _normalize_report(_call_gemini(prompt))
    except Exception as exc:
        logger.warning("Gemini evaluation failed for submission %s: %s", submission.pk, exc, exc_info=True)
        payload = _fallback_report(submission)

    report, _ = AIReport.objects.update_or_create(
        submission=submission,
        defaults={
            "code_score": payload["code_score"],
            "design_score": payload["design_score"],
            "requirement_score": payload["requirement_score"],
            "functionality_score": payload["functionality_score"],
            "overall_score": payload["overall_score"],
            "strengths": payload["strengths"],
            "weaknesses": payload["weaknesses"],
            "recommendation": payload["recommendation"],
            "explanation": payload["explanation"],
            "raw_response": payload["raw_response"],
            "status": payload["status"],
            "model_version": payload["model_version"],
            "evaluated_at": timezone.now(),
        },
    )

    submission.evaluated_at = report.evaluated_at
    submission.status = {
        AIRecommendation.APPROVED: SubmissionStatus.APPROVED,
        AIRecommendation.APPROVED_WITH_NOTES: SubmissionStatus.APPROVED_WITH_NOTES,
        AIRecommendation.HUMAN_REVIEW: SubmissionStatus.HUMAN_REVIEW,
        AIRecommendation.REJECTED: SubmissionStatus.REJECTED,
    }.get(report.recommendation, SubmissionStatus.HUMAN_REVIEW)
    submission.save(update_fields=["evaluated_at", "status", "updated_at"])

    contract = submission.contract
    contract.status = ContractStatus.SUBMITTED
    contract.dispute_deadline = report.evaluated_at + timedelta(hours=24)
    contract.save(update_fields=["status", "dispute_deadline", "updated_at"])

    submission.milestone.status = MilestoneStatus.SUBMITTED
    submission.milestone.submitted_at = submission.submitted_at
    submission.milestone.save(update_fields=["status", "submitted_at", "updated_at"])

    create_notification(
        user=submission.contract.company.user,
        title="AI report ready",
        message=f"The AI evaluation for {submission.contract.title} is ready.",
        notification_type=NotificationType.AI_REPORT_READY,
        channel="BOTH",
        payload={"submission_id": str(submission.id), "overall_score": report.overall_score},
    )
    return report
