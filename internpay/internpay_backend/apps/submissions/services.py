from __future__ import annotations

from decimal import Decimal
import logging
from pathlib import Path

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.common.choices import ContractStatus, MilestoneStatus, NotificationType, SubmissionStatus
from apps.common.services import create_audit_log, create_notification, run_after_commit
from apps.submissions.models import AIReport, Submission, SubmissionFile

logger = logging.getLogger(__name__)


def _file_type_from_name(name: str) -> str:
    suffix = Path(name).suffix.lower().lstrip(".")
    if suffix in {"png", "jpg", "jpeg", "gif", "webp", "svg"}:
        return "IMAGE"
    if suffix in {"pdf"}:
        return "PDF"
    if suffix in {"zip", "rar", "7z"}:
        return "ARCHIVE"
    if suffix in {"mp4", "mov", "webm", "mkv"}:
        return "VIDEO"
    return "FILE"


def _store_files(submission: Submission, files: list) -> list[SubmissionFile]:
    stored = []
    for file_obj in files or []:
        stored.append(
            SubmissionFile.objects.create(
                submission=submission,
                file=file_obj,
                file_type=_file_type_from_name(file_obj.name),
                original_name=file_obj.name,
                file_size=getattr(file_obj, "size", 0) or 0,
            )
        )
    return stored


@transaction.atomic
def create_submission(*, student, validated_data: dict, request=None) -> Submission:
    from apps.milestones.models import Milestone

    files = validated_data.pop("files", [])
    contract_id = validated_data.pop("contract_id")
    milestone_id = validated_data.pop("milestone_id")

    from apps.contracts.models import Contract

    contract = Contract.objects.select_related("company", "student").filter(id=contract_id).first()
    if contract is None:
        raise ValidationError({"contract_id": "Contract not found."})

    if contract.student is None or contract.student_id != student.id:
        raise ValidationError({"contract_id": "You are not assigned to this contract."})

    if contract.status not in {
        ContractStatus.ACTIVE,
        ContractStatus.FUNDED,
        ContractStatus.IN_PROGRESS,
        ContractStatus.SUBMITTED,
    }:
        raise ValidationError({"contract_id": "You cannot submit work for a contract that is not active."})

    milestone = Milestone.objects.select_related("contract").filter(id=milestone_id).first()
    if milestone is None:
        raise ValidationError({"milestone_id": "Milestone not found."})

    if milestone.contract_id != contract.id:
        raise ValidationError({"milestone_id": "This milestone does not belong to the specified contract."})

    if milestone.status == MilestoneStatus.APPROVED:
        raise ValidationError({"milestone_id": "This milestone has already been approved."})

    if milestone.status == MilestoneStatus.CANCELLED:
        raise ValidationError({"milestone_id": "This milestone has been cancelled."})

    if hasattr(milestone, "submission"):
        raise ValidationError({"milestone_id": "This milestone already has a submission."})


    submission = Submission.objects.create(
        contract=contract,
        milestone=milestone,
        student=student,
        status=SubmissionStatus.SUBMITTED,
        **validated_data,
    )
    _store_files(submission, files)
    create_audit_log(actor=student.user, action="submission_created", target=submission, summary=f"Submitted work for {contract.title}")
    run_after_commit(
        lambda: create_notification(
            user=contract.company.user,
            title="New submission received",
            message=f"{student.user.get_full_name() or student.user.email} submitted work for {contract.title}.",
            notification_type=NotificationType.SUBMISSION_RECEIVED,
            channel="BOTH",
        ),
        label="submission notification",
    )

    contract.status = ContractStatus.SUBMITTED
    contract.save(update_fields=["status", "updated_at"])

    milestone.status = MilestoneStatus.SUBMITTED
    milestone.submitted_at = submission.submitted_at
    milestone.save(update_fields=["status", "submitted_at", "updated_at"])

    from apps.ai_engine.services import evaluate_submission_with_ai

    def _trigger_ai_evaluation():
        try:
            evaluate_submission_with_ai(submission=submission, request=request)
        except Exception as exc:
            logger.warning("Automatic AI evaluation failed on create_submission for %s: %s", submission.id, exc)

    run_after_commit(_trigger_ai_evaluation, label="AI evaluation")

    return submission


@transaction.atomic
def update_submission(*, submission: Submission, validated_data: dict, request=None) -> Submission:
    files = validated_data.pop("files", [])
    for field in ["github_url", "demo_url", "figma_url", "documentation_url", "video_url", "additional_notes"]:
        if field in validated_data:
            setattr(submission, field, validated_data[field])
    submission.status = SubmissionStatus.SUBMITTED
    submission.save()
    _store_files(submission, files)

    from apps.ai_engine.services import evaluate_submission_with_ai

    def _trigger_ai_reevaluation():
        try:
            evaluate_submission_with_ai(submission=submission, request=request, force=True)
        except Exception as exc:
            logger.warning("Automatic AI re-evaluation failed on update_submission for %s: %s", submission.id, exc)

    run_after_commit(_trigger_ai_reevaluation, label="AI evaluation")

    return submission


def delete_submission(submission: Submission) -> None:
    submission.delete()


def get_submission_report(submission: Submission) -> AIReport | None:
    try:
        return submission.ai_report
    except Exception:
        return None


def get_student_submissions(student) -> list[dict]:
    return list(
        Submission.objects.filter(student=student)
        .select_related("contract", "milestone")
        .order_by("-created_at")
        .values("id", "contract_id", "milestone_id", "status", "submitted_at", "evaluated_at")
    )


def serialize_submission_queryset(qs):
    from apps.submissions.serializers import SubmissionDetailSerializer

    return SubmissionDetailSerializer(qs, many=True).data
