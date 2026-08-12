from __future__ import annotations

from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from apps.common.amounts import AMOUNT_DECIMAL_PLACES, AMOUNT_MAX_DIGITS
from apps.common.choices import DisputeDecision, DisputeReason, DisputeStatus
from apps.common.models import BaseModel


class Dispute(BaseModel):
    contract = models.ForeignKey(
        "contracts.Contract",
        on_delete=models.CASCADE,
        related_name="disputes",
    )
    submission = models.OneToOneField(
        "submissions.Submission",
        on_delete=models.CASCADE,
        related_name="dispute",
    )
    filed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="filed_disputes",
    )
    assigned_judge = models.ForeignKey(
        "judges.Judge",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_disputes",
    )
    reason = models.CharField(max_length=50, choices=DisputeReason.choices, db_index=True)
    description = models.TextField()
    evidence = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=30, choices=DisputeStatus.choices, default=DisputeStatus.OPEN, db_index=True)
    decision = models.CharField(max_length=50, choices=DisputeDecision.choices, blank=True, default="")
    decision_reason = models.TextField(blank=True, default="")
    split_percentage = models.PositiveIntegerField(null=True, blank=True)
    dispute_deadline = models.DateTimeField(null=True, blank=True, db_index=True)
    resolved_at = models.DateTimeField(null=True, blank=True, db_index=True)
    transaction_hash = models.CharField(max_length=255, blank=True, default="")
    resolution_amount = models.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES, default=0)
    judge_reward = models.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES, default=0)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["assigned_judge", "status"]),
        ]

    def __str__(self) -> str:
        return f"Dispute for {self.contract.title}"


class AuditLog(BaseModel):
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )
    action = models.CharField(max_length=100, db_index=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True)
    object_id = models.CharField(max_length=64, null=True, blank=True, db_index=True)
    content_object = GenericForeignKey("content_type", "object_id")
    summary = models.CharField(max_length=255)
    changes = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        indexes = [
            models.Index(fields=["action", "created_at"]),
        ]

    def __str__(self) -> str:
        return self.summary
