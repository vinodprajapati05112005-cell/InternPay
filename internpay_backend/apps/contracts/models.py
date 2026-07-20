from __future__ import annotations

from django.db import models

from apps.common.choices import ContractStatus
from apps.common.models import BaseModel


class Contract(BaseModel):
    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="contracts",
    )
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.SET_NULL,
        related_name="contracts",
        null=True,
        blank=True,
    )
    judge = models.ForeignKey(
        "judges.Judge",
        on_delete=models.SET_NULL,
        related_name="contracts",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
    requirements = models.JSONField(default=list, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=8, default="USD")
    funded_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    released_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=30, choices=ContractStatus.choices, default=ContractStatus.DRAFT, db_index=True)
    deadline = models.DateTimeField(null=True, blank=True)
    dispute_deadline = models.DateTimeField(null=True, blank=True)
    funded_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    archived_at = models.DateTimeField(null=True, blank=True)
    chain_reference = models.CharField(max_length=255, blank=True, default="")
    metadata = models.JSONField(default=dict, blank=True)
    notes = models.TextField(blank=True, default="")

    class Meta:
        indexes = [
            models.Index(fields=["company", "status"]),
            models.Index(fields=["student", "status"]),
            models.Index(fields=["created_at", "status"]),
        ]

    def __str__(self) -> str:
        return self.title
