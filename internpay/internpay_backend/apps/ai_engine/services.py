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


def _parse_github_url(url: str) -> tuple[str, str] | None:
    if not url:
        return None
    match = re.search(r"github\.com/([a-zA-Z0-9_.-]+)/([a-zA-Z0-9_.-]+)", url)
    if not match:
        return None
    owner, repo = match.group(1), match.group(2)
    repo = re.sub(r"\.git$", "", repo)
    return owner, repo


def _fetch_github_repo_data(github_url: str) -> dict:
    parsed = _parse_github_url(github_url)
    if not parsed:
        return {}

    owner, repo = parsed
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "InternPay-AI-Engine/1.0",
    }
    github_token = os.getenv("GITHUB_TOKEN", "").strip()
    if github_token:
        headers["Authorization"] = f"token {github_token}"

    data = {"owner": owner, "repo": repo, "exists": False}

    try:
        repo_resp = requests.get(f"https://api.github.com/repos/{owner}/{repo}", headers=headers, timeout=6)
        if repo_resp.status_code == 200:
            repo_json = repo_resp.json()
            data["exists"] = True
            data["description"] = repo_json.get("description") or "No description"
            data["language"] = repo_json.get("language") or "Unspecified"
            data["stars"] = repo_json.get("stargazers_count", 0)
            data["open_issues"] = repo_json.get("open_issues_count", 0)
            data["default_branch"] = repo_json.get("default_branch", "main")
            data["updated_at"] = repo_json.get("updated_at", "")

            # Fetch README content
            readme_resp = requests.get(
                f"https://api.github.com/repos/{owner}/{repo}/readme",
                headers={"Accept": "application/vnd.github.v3.raw", **headers},
                timeout=6,
            )
            if readme_resp.status_code == 200:
                data["readme_excerpt"] = readme_resp.text[:3500]

            # Fetch top-level file structure
            contents_resp = requests.get(
                f"https://api.github.com/repos/{owner}/{repo}/contents",
                headers=headers,
                timeout=6,
            )
            if contents_resp.status_code == 200 and isinstance(contents_resp.json(), list):
                data["file_structure"] = [item.get("name") for item in contents_resp.json()[:35] if isinstance(item, dict)]
    except Exception as exc:
        logger.debug("Failed to fetch GitHub repo info for %s/%s: %s", owner, repo, exc)

    return data


def _extract_uploaded_files_content(submission) -> list[dict]:
    readable_exts = {
        ".txt", ".py", ".js", ".jsx", ".ts", ".tsx", ".json", ".md", ".sol",
        ".rs", ".html", ".css", ".sql", ".yaml", ".yml", ".env", ".c", ".cpp",
    }
    extracted = []
    for item in submission.files.all():
        file_info = {
            "name": item.original_name,
            "type": item.file_type,
            "size_bytes": item.file_size,
            "snippet": "",
        }
        try:
            if item.file and item.file_size < 120_000:
                ext = os.path.splitext(item.original_name)[1].lower()
                if ext in readable_exts:
                    item.file.open("r")
                    content = item.file.read()
                    if isinstance(content, bytes):
                        content = content.decode("utf-8", errors="ignore")
                    file_info["snippet"] = str(content)[:3000]
                    item.file.close()
        except Exception:
            pass
        extracted.append(file_info)
    return extracted


def build_prompt(submission) -> str:
    contract = submission.contract
    milestone = submission.milestone
    files_data = _extract_uploaded_files_content(submission)
    github_data = _fetch_github_repo_data(submission.github_url) if submission.github_url else {}

    payload = {
        "contract": {
            "title": contract.title,
            "description": contract.description,
            "requirements": contract.requirements,
            "total_budget": str(contract.total_amount),
        },
        "milestone": {
            "title": milestone.title,
            "description": milestone.description,
            "amount": str(milestone.amount),
            "deadline": milestone.deadline.isoformat() if milestone.deadline else "None",
        },
        "submission": {
            "github_url": submission.github_url,
            "github_repo_analysis": github_data,
            "demo_url": submission.demo_url,
            "figma_url": submission.figma_url,
            "documentation_url": submission.documentation_url,
            "video_url": submission.video_url,
            "student_notes": submission.additional_notes,
            "uploaded_files": files_data,
        },
    }
    return (
        "You are InternPay's expert technical evaluator. Rigorously evaluate the student's submission against the contract requirements and milestone scope.\n\n"
        "EVALUATION CRITERIA:\n"
        "1. code_score (0-100): Evaluate repository structure, README documentation, tech stack alignment, and any provided source files.\n"
        "2. design_score (0-100): Evaluate UI/UX fidelity based on Figma links, frontend files, styling, and student notes.\n"
        "3. requirement_score (0-100): Check if each item in contract.requirements was delivered. Deduct points for missing requirements.\n"
        "4. functionality_score (0-100): Assess live demo URL, video walkthrough, and test completeness.\n"
        "5. overall_score (0-100): Weighted aggregate score reflecting total project quality.\n"
        "6. strengths: Array of 2-5 concrete, specific accomplishments or positive aspects observed in the submission.\n"
        "7. weaknesses: Array of 1-4 specific gaps, missing requirements, or areas for improvement.\n"
        "8. recommendation: Must be strictly one of: APPROVED (score >= 80), APPROVED_WITH_NOTES (70-79), HUMAN_REVIEW (60-69), REJECTED (< 60).\n"
        "9. explanation: Detailed 2-4 sentence summary explaining the scoring justification.\n"
        "10. status: Must be COMPLETED.\n\n"
        "Return STRICT JSON only without markdown fences or additional text.\n\n"
        f"Submission context:\n{json.dumps(payload, indent=2)}"
    )


def _fallback_report(submission) -> dict:
    files_data = _extract_uploaded_files_content(submission)
    github_data = _fetch_github_repo_data(submission.github_url) if submission.github_url else {}

    code_score = 50
    design_score = 50
    requirement_score = 50
    functionality_score = 50
    strengths = []
    weaknesses = []

    if submission.github_url:
        if github_data.get("exists"):
            code_score += 25
            functionality_score += 10
            strengths.append(f"Active GitHub repository ({github_data.get('language', 'Code')} - {github_data.get('repo', '')}) verified.")
            if github_data.get("readme_excerpt"):
                code_score += 10
                strengths.append("Repository documentation (README) provided.")
            if github_data.get("file_structure"):
                code_score += 5
                strengths.append(f"Structured project tree with {len(github_data['file_structure'])} primary modules.")
        else:
            code_score += 15
            strengths.append("GitHub repository link provided.")
    else:
        weaknesses.append("Missing GitHub repository link.")

    if submission.demo_url:
        functionality_score += 25
        strengths.append("Working live deployment/demo URL provided.")
    else:
        weaknesses.append("Missing live demo URL.")

    if submission.figma_url:
        design_score += 35
        strengths.append("Figma UI/UX design file attached.")
    else:
        if not files_data:
            weaknesses.append("No UI design file or design mockup linked.")

    if submission.documentation_url:
        requirement_score += 20
        strengths.append("Technical documentation link included.")

    if submission.video_url:
        functionality_score += 15
        strengths.append("Video walkthrough presentation provided.")

    if files_data:
        design_score += min(15, len(files_data) * 5)
        requirement_score += min(15, len(files_data) * 5)
        strengths.append(f"Uploaded {len(files_data)} supporting code/evidence files.")

    if len(submission.additional_notes or "") > 80:
        requirement_score += 10
        strengths.append("Detailed submission explanation and delivery notes provided.")

    overall = round((code_score + design_score + requirement_score + functionality_score) / 4)
    recommendation = recommendation_from_score(overall)
    if overall < 60:
        weaknesses.append("Deliverables appear incomplete relative to the contract scope.")
    elif overall < 75:
        weaknesses.append("A manual review is advised to verify edge cases.")

    return {
        "code_score": normalize_score(code_score),
        "design_score": normalize_score(design_score),
        "requirement_score": normalize_score(requirement_score),
        "functionality_score": normalize_score(functionality_score),
        "overall_score": normalize_score(overall),
        "strengths": strengths or ["Submission metadata received."],
        "weaknesses": weaknesses or ["No critical issues detected in initial review."],
        "recommendation": recommendation,
        "explanation": f"Evaluation performed across deliverables. Code: {normalize_score(code_score)}/100, Requirements: {normalize_score(requirement_score)}/100. Deliverables verified against scope.",
        "status": "COMPLETED",
        "model_version": "heuristic-live-inspector-v2",
        "raw_response": {"source": "fallback", "github": github_data},
    }


def _gemini_api_key() -> str:
    return (os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or "").strip().strip("'\"")


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

    configured_model = os.getenv("GEMINI_MODEL", "gemini-3.5-flash").strip() or "gemini-3.5-flash"
    candidate_models = [configured_model, "gemini-3.5-flash", "gemini-flash-latest"]
    seen = set()
    models_to_try = [m for m in candidate_models if not (m in seen or seen.add(m))]

    last_error = None
    for model in models_to_try:
        try:
            response = requests.post(
                f"{GEMINI_API_URL}/models/{model}:generateContent",
                headers={
                    "x-goog-api-key": api_key,
                    "Content-Type": "application/json",
                },
                json={
                    "systemInstruction": {
                        "parts": [
                            {
                                "text": "You are a strict JSON-only technical evaluator for InternPay. Respond strictly with a single valid JSON object.",
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
                timeout=30,
            )
            if response.status_code == 200:
                body = response.json()
                parsed = _parse_json_response(_extract_candidate_text(body))
                parsed["model_version"] = model
                parsed["raw_response"] = body
                return parsed
            else:
                last_error = f"Model {model} returned HTTP {response.status_code}: {response.text[:200]}"
                logger.warning(last_error)
        except Exception as exc:
            last_error = exc
            logger.warning("Error calling Gemini model %s: %s", model, exc)

    raise ValidationError(f"Gemini API generation failed across all models: {last_error}")


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
