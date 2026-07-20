from __future__ import annotations

from decimal import Decimal

from django.db.models import Count, Avg, Q
from django.utils import timezone

from apps.judges.models import Judge


def update_judge_profile(judge: Judge, data: dict) -> Judge:
    for field in [
        "judge_display_name",
        "specialization",
        "years_experience",
        "license_number",
        "bio",
    ]:
        if field in data:
            setattr(judge, field, data[field])
    judge.save()
    return judge


def get_judge_dashboard(judge: Judge) -> dict:
    from apps.disputes.models import Dispute

    qs = Dispute.objects.select_related("contract", "submission", "submission__milestone").filter(assigned_judge=judge)
    completed = qs.filter(status__in=["RESOLVED", "PARTIALLY_RESOLVED", "CLOSED"])
    recent = []
    for dispute in qs.order_by("-created_at")[:5]:
        recent.append(
            {
                "id": str(dispute.id),
                "submission_id": str(dispute.submission_id),
                "contract_id": str(dispute.contract_id),
                "contract_title": dispute.contract.title,
                "milestone_title": dispute.submission.milestone.title if dispute.submission and dispute.submission.milestone_id else None,
                "decision": dispute.decision,
                "status": dispute.status,
                "resolved_at": dispute.resolved_at,
                "created_at": dispute.created_at,
                "reason": dispute.reason,
            }
        )
    avg_hours = Decimal("0.00")
    if completed.exists():
        durations = []
        for dispute in completed.exclude(resolved_at__isnull=True):
            durations.append((dispute.resolved_at - dispute.created_at).total_seconds() / 3600)
        if durations:
            avg_hours = Decimal(str(sum(durations) / len(durations))).quantize(Decimal("0.01"))
    return {
        "assigned_disputes": qs.count(),
        "completed_disputes": completed.count(),
        "open_disputes": qs.filter(status__in=["OPEN", "ASSIGNED", "UNDER_REVIEW"]).count(),
        "average_resolution_hours": avg_hours,
        "total_approved": qs.filter(decision="RELEASE_PAYMENT").count(),
        "total_rejected": qs.filter(decision="REFUND_COMPANY").count(),
        "total_partial": qs.filter(decision="PARTIAL_PAYMENT").count(),
        "recent_decisions": recent,
    }


def get_decision_history(judge: Judge) -> list[dict]:
    from apps.disputes.models import Dispute

    payload = []
    for dispute in Dispute.objects.select_related("contract").filter(assigned_judge=judge, resolved_at__isnull=False).order_by("-resolved_at"):
        payload.append(
            {
                "dispute_id": str(dispute.id),
                "submission_id": str(dispute.submission_id),
                "contract_title": dispute.contract.title,
                "decision": dispute.decision,
                "resolved_at": dispute.resolved_at,
                "reasoning": dispute.decision_reason,
            }
        )
    return payload
