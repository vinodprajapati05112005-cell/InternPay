from __future__ import annotations

from django.db import models

from apps.common.choices import MilestoneStatus
from apps.common.models import BaseModel


class Milestone(BaseModel):
    contract = models.ForeignKey(
        "contracts.Contract",
        on_delete=models.CASCADE,
        related_name="milestones",
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    deadline = models.DateTimeField()
    order = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=30, choices=MilestoneStatus.choices, default=MilestoneStatus.PENDING, db_index=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["order", "created_at"]
        constraints = [
            models.UniqueConstraint(fields=["contract", "order"], name="unique_milestone_order_per_contract"),
        ]
        indexes = [
            models.Index(fields=["contract", "status"]),
            models.Index(fields=["deadline", "status"]),
        ]

    def __str__(self) -> str:
        return f"{self.contract.title} - {self.title}"
