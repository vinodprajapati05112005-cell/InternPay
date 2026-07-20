from __future__ import annotations

from apps.milestones.models import Milestone


def update_milestone(milestone: Milestone, data: dict) -> Milestone:
    for field in ["title", "description", "amount", "deadline", "order", "status", "rejection_reason"]:
        if field in data:
            setattr(milestone, field, data[field])
    milestone.save()
    return milestone


def create_milestone(contract, data: dict) -> Milestone:
    return Milestone.objects.create(contract=contract, **data)


def serialize_milestone_queryset(qs):
    from apps.milestones.serializers import MilestoneSerializer

    return MilestoneSerializer(qs, many=True).data
