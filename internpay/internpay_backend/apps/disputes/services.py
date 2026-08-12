from __future__ import annotations

from datetime import timedelta
from decimal import Decimal
from pathlib import Path

from django.core.files.storage import default_storage
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.common.amounts import AMOUNT_QUANTUM
from apps.common.choices import ContractStatus, DisputeDecision, DisputeReason, DisputeStatus, NotificationType, SubmissionStatus, UserRole
from apps.common.services import create_audit_log, create_notification
from apps.disputes.models import Dispute
from internpay.utils.files import dispute_upload_path


def _serialize_evidence_files(files: list) -> list[dict]:
    serialized = []
    for file_obj in files or []:
        storage_path = dispute_upload_path(None, file_obj.name)
        saved_path = default_storage.save(storage_path, file_obj)
        serialized.append(
            {
                "type": "file",
                "name": file_obj.name,
                "path": saved_path,
                "size": getattr(file_obj, "size", 0) or 0,
            }
        )
    return serialized


def _eligible_judge():
    from apps.judges.models import Judge

    judge = (
        Judge.objects.filter(is_verified=True)
        .order_by("-rating", "total_resolved_disputes")
        .first()
    )
    if judge is None:
        judge = Judge.objects.order_by("-rating", "total_resolved_disputes").first()
    return judge


def _current_deadline(submission) -> timezone.datetime:
    contract_deadline = getattr(submission.contract, "dispute_deadline", None)
    if contract_deadline:
        return contract_deadline
    if getattr(submission, "evaluated_at", None):
        return submission.evaluated_at + timedelta(hours=24)
    return submission.submitted_at + timedelta(hours=24)


@transaction.atomic
def create_dispute(*, filed_by, validated_data: dict, request=None) -> Dispute:
    from apps.submissions.models import Submission

    evidence_files = validated_data.pop("evidence_files", [])
    submission_id = validated_data.pop("submission_id")
    submission = Submission.objects.select_related("contract", "student", "contract__company").filter(id=submission_id).first()
    if submission is None:
        raise ValidationError({"submission_id": "Submission not found."})

    is_party = filed_by.id in {
        getattr(submission.student, "user_id", None),
        getattr(submission.contract.company, "user_id", None),
    }
    if not is_party and not (filed_by.is_superuser or filed_by.role == UserRole.ADMIN):
        raise ValidationError({"submission_id": "Only contract parties can file a dispute."})

    deadline = _current_deadline(submission)
    if timezone.now() > deadline:
        raise ValidationError({"submission_id": "The dispute window has expired."})

    if hasattr(submission, "dispute"):
        raise ValidationError({"submission_id": "A dispute already exists for this submission."})

    evidence = list(validated_data.pop("evidence", []))
    evidence.extend(_serialize_evidence_files(evidence_files))

    dispute = Dispute.objects.create(
        contract=submission.contract,
        submission=submission,
        filed_by=filed_by,
        evidence=evidence,
        dispute_deadline=deadline,
        **validated_data,
    )

    judge = _eligible_judge()
    if judge is not None:
        dispute.assigned_judge = judge
        dispute.status = DisputeStatus.ASSIGNED
        dispute.save(update_fields=["assigned_judge", "status", "updated_at"])
        create_notification(
            user=judge.user,
            title="New dispute assigned",
            message=f"You have been assigned dispute for {submission.contract.title}.",
            notification_type=NotificationType.JUDGE_ASSIGNED,
            channel="BOTH",
        )

    submission.status = SubmissionStatus.DISPUTED
    submission.save(update_fields=["status", "updated_at"])
    submission.contract.status = ContractStatus.DISPUTED
    submission.contract.save(update_fields=["status", "updated_at"])

    create_audit_log(actor=filed_by, action="dispute_created", target=dispute, summary=f"Filed dispute for {submission.contract.title}")
    create_notification(
        user=submission.contract.company.user,
        title="Dispute created",
        message=f"A dispute was filed for {submission.contract.title}.",
        notification_type=NotificationType.DISPUTE_CREATED,
        channel="BOTH",
    )
    return dispute


@transaction.atomic
def resolve_dispute(*, dispute: Dispute, judge, validated_data: dict, request=None) -> Dispute:
    if judge is None:
        raise ValidationError({"detail": "A judge must be assigned before resolution."})
    if dispute.assigned_judge_id and dispute.assigned_judge_id != judge.id:
        raise ValidationError({"detail": "You are not assigned to this dispute."})

    decision = validated_data["decision"]
    reasoning = validated_data["reasoning"]
    split_percentage = validated_data.get("split_percentage")
    transaction_hash = validated_data.get("transaction_hash", "")

    contract_amount = Decimal(str(dispute.submission.milestone.amount))
    resolution_amount = Decimal("0.00")

    if decision == DisputeDecision.RELEASE_PAYMENT:
        resolution_amount = contract_amount
        # ==========================================
        # TODO FOR BLOCKCHAIN TEAM
        #
        # Release Payment
        #
        # releaseFunds(contract_id)
        #
        # Blockchain teammate should implement this.
        # ==========================================
        dispute.status = DisputeStatus.RESOLVED
    elif decision == DisputeDecision.REFUND_COMPANY:
        resolution_amount = Decimal("0.00")
        # ==========================================
        # TODO FOR BLOCKCHAIN TEAM
        #
        # Refund Company
        #
        # refundFunds(contract_id)
        #
        # Blockchain teammate should implement this.
        # ==========================================
        dispute.status = DisputeStatus.RESOLVED
    elif decision == DisputeDecision.PARTIAL_PAYMENT:
        split = Decimal(str(split_percentage or 50))
        resolution_amount = (contract_amount * split / Decimal("100")).quantize(AMOUNT_QUANTUM)
        # ==========================================
        # TODO FOR BLOCKCHAIN TEAM
        #
        # Execute Judge Decision On Chain
        #
        # Blockchain teammate should implement this.
        # ==========================================
        dispute.status = DisputeStatus.PARTIALLY_RESOLVED

    dispute.decision = decision
    dispute.decision_reason = reasoning
    dispute.split_percentage = split_percentage
    dispute.resolved_at = timezone.now()
    dispute.transaction_hash = transaction_hash
    dispute.resolution_amount = resolution_amount
    dispute.save()

    milestone = dispute.submission.milestone
    from apps.common.choices import MilestoneStatus
    if decision in {DisputeDecision.RELEASE_PAYMENT, DisputeDecision.PARTIAL_PAYMENT}:
        milestone.status = MilestoneStatus.APPROVED
    elif decision == DisputeDecision.REFUND_COMPANY:
        milestone.status = MilestoneStatus.REJECTED
    milestone.save(update_fields=["status", "updated_at"])

    contract = dispute.contract
    contract.released_amount = min(contract.total_amount, contract.released_amount + resolution_amount)
    all_done = not contract.milestones.exclude(
        status__in=[MilestoneStatus.APPROVED, MilestoneStatus.REJECTED, MilestoneStatus.CANCELLED]
    ).exists()
    if all_done:
        contract.status = ContractStatus.COMPLETED
        contract.completed_at = timezone.now()
    else:
        contract.status = ContractStatus.ACTIVE
    contract.save(update_fields=["released_amount", "status", "completed_at", "updated_at"])

    submission = dispute.submission
    submission.status = SubmissionStatus.RESOLVED
    submission.save(update_fields=["status", "updated_at"])

    judge.total_resolved_disputes += 1
    judge.save(update_fields=["total_resolved_disputes", "updated_at"])

    create_audit_log(actor=judge.user, action="dispute_resolved", target=dispute, summary=f"Resolved dispute for {contract.title}")
    create_notification(
        user=dispute.filed_by,
        title="Dispute resolved",
        message=f"Your dispute for {contract.title} has been resolved.",
        notification_type=NotificationType.DECISION_COMPLETED,
        channel="BOTH",
    )
    return dispute


def get_assigned_disputes(judge) -> list[dict]:
    from apps.common.choices import DisputeStatus
    Dispute.objects.filter(assigned_judge__isnull=True).update(assigned_judge=judge, status=DisputeStatus.ASSIGNED)
    qs = Dispute.objects.filter(assigned_judge=judge).select_related("contract", "submission").order_by("-created_at")
    payload = []
    for d in qs:
        payload.append({
            "id": str(d.id),
            "contract_id": str(d.contract_id),
            "contract_title": d.contract.title if d.contract else "Disputed Contract",
            "submission_id": str(d.submission_id) if d.submission_id else "",
            "reason": d.reason,
            "status": d.status,
            "decision": d.decision or "",
            "created_at": d.created_at,
            "resolved_at": d.resolved_at,
        })
    return payload


def get_completed_disputes(judge) -> list[dict]:
    return list(
        Dispute.objects.filter(assigned_judge=judge, resolved_at__isnull=False)
        .select_related("contract", "submission")
        .order_by("-resolved_at")
        .values("id", "contract_id", "submission_id", "decision", "status", "resolved_at")
    )


def get_dispute_history(judge) -> list[dict]:
    return list(
        Dispute.objects.filter(assigned_judge=judge)
        .select_related("contract", "submission")
        .order_by("-resolved_at", "-created_at")
        .values("id", "contract__title", "submission_id", "decision", "resolved_at", "decision_reason")
    )
