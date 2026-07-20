from __future__ import annotations

import json
import os
from datetime import timedelta
from decimal import Decimal

import requests
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.common.choices import AIAnalysisStatus, AIRecommendation, ContractStatus, MilestoneStatus, NotificationType, SubmissionStatus
from apps.common.services import create_notification, normalize_score, recommendation_from_score
from apps.submissions.models import AIReport


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
    contract = submission.contract
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
        "explanation": "Fallback heuristic evaluation used because OpenAI credentials were not available.",
        "status": "COMPLETED",
        "model_version": "heuristic-fallback-v1",
        "raw_response": {"source": "fallback"},
    }


def _call_openai(prompt: str) -> dict:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        raise ValidationError("OpenAI API key is not configured.")

    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    response = requests.post(
        f"{base_url}/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": model,
            "messages": [
                {"role": "system", "content": "You are a strict JSON-only evaluator for InternPay."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
            "response_format": {"type": "json_object"},
        },
        timeout=60,
    )
    response.raise_for_status()
    body = response.json()
    content = body["choices"][0]["message"]["content"]
    parsed = json.loads(content) if isinstance(content, str) else content
    parsed["model_version"] = model
    parsed["raw_response"] = body
    return parsed


def _normalize_report(data: dict) -> dict:
    code_score = normalize_score(data.get("code_score"))
    design_score = normalize_score(data.get("design_score"))
    requirement_score = normalize_score(data.get("requirement_score"))
    functionality_score = normalize_score(data.get("functionality_score"))
    overall_score = normalize_score(data.get("overall_score", round((code_score + design_score + requirement_score + functionality_score) / 4)))
    recommendation = data.get("recommendation") or recommendation_from_score(overall_score)
    if recommendation not in {choice[0] for choice in AIRecommendation.choices}:
        recommendation = recommendation_from_score(overall_score)

    return {
        "code_score": code_score,
        "design_score": design_score,
        "requirement_score": requirement_score,
        "functionality_score": functionality_score,
        "overall_score": overall_score,
        "strengths": data.get("strengths") or [],
        "weaknesses": data.get("weaknesses") or [],
        "recommendation": recommendation,
        "explanation": data.get("explanation", ""),
        "status": data.get("status", "COMPLETED"),
        "model_version": data.get("model_version", "internpay-ai"),
        "raw_response": data.get("raw_response", {}),
    }


@transaction.atomic
def evaluate_submission_with_ai(*, submission, request=None, force: bool = False) -> AIReport:
    if not force and hasattr(submission, "ai_report"):
        return submission.ai_report

    prompt = build_prompt(submission)
    try:
        payload = _normalize_report(_call_openai(prompt))
    except Exception:
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
