from __future__ import annotations

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from apps.common.choices import ContractStatus, MilestoneStatus, NotificationType
from apps.common.services import create_audit_log, create_notification
from apps.milestones.models import Milestone


def update_milestone(milestone: Milestone, data: dict) -> Milestone:
    for field in ["title", "description", "amount", "deadline", "order", "status", "rejection_reason"]:
        if field in data:
            setattr(milestone, field, data[field])
    milestone.save()
    return milestone


def create_milestone(contract, data: dict) -> Milestone:
    return Milestone.objects.create(contract=contract, **data)


@transaction.atomic
def release_milestone_payment(
    milestone: Milestone,
    *,
    actor,
    transaction_hash: str = "",
    reference: str = "",
) -> tuple:
    contract = milestone.contract

    if contract.company.user != actor and not getattr(actor, "is_superuser", False):
        raise ValidationError({"detail": "Only the company can release milestone funds."})

    if milestone.status not in {MilestoneStatus.SUBMITTED, MilestoneStatus.UNDER_REVIEW}:
        raise ValidationError({"detail": "Only submitted milestones can be released."})

    if contract.status in {ContractStatus.CANCELLED, ContractStatus.COMPLETED, ContractStatus.ARCHIVED}:
        raise ValidationError({"detail": "This contract can no longer release funds."})

    milestone.status = MilestoneStatus.APPROVED
    milestone.approved_at = timezone.now()
    milestone.rejected_at = None
    milestone.rejection_reason = ""
    milestone.save(update_fields=["status", "approved_at", "rejected_at", "rejection_reason", "updated_at"])

    contract.released_amount = contract.released_amount + milestone.amount
    all_milestones_approved = not contract.milestones.exclude(status=MilestoneStatus.APPROVED).exists()
    if contract.released_amount >= contract.total_amount and all_milestones_approved:
        contract.status = ContractStatus.COMPLETED
        contract.completed_at = timezone.now()
    else:
        contract.status = ContractStatus.IN_PROGRESS

    metadata = dict(contract.metadata or {})
    release_history = list(metadata.get("milestone_releases", []))
    release_history.append(
        {
            "milestone_id": str(milestone.id),
            "milestone_order": milestone.order,
            "amount": str(milestone.amount),
            "transaction_hash": transaction_hash.strip(),
            "reference": reference.strip(),
            "released_at": timezone.now().isoformat(),
        }
    )
    metadata["milestone_releases"] = release_history
    contract.metadata = metadata

    update_fields = ["released_amount", "status", "metadata", "updated_at"]
    if contract.status == ContractStatus.COMPLETED:
        update_fields.append("completed_at")
    contract.save(update_fields=update_fields)

    create_audit_log(
        actor=actor,
        action="milestone_released",
        target=milestone,
        summary=f"Released {milestone.amount} for {contract.title} milestone {milestone.order}",
    )
    if contract.student:
        create_notification(
            user=contract.student.user,
            title="Milestone payment released",
            message=f"Payment for milestone {milestone.order} on {contract.title} has been released.",
            notification_type=NotificationType.CONTRACT_UPDATE,
            channel="BOTH",
            payload={
                "contract_id": str(contract.id),
                "milestone_id": str(milestone.id),
                "transaction_hash": transaction_hash.strip(),
                "reference": reference.strip(),
            },
        )

    return contract, milestone


def serialize_milestone_queryset(qs):
    from apps.milestones.serializers import MilestoneSerializer

    return MilestoneSerializer(qs, many=True).data
