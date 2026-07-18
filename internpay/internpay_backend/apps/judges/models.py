from __future__ import annotations

from django.conf import settings
from django.db import models

from apps.common.choices import VerificationStatus
from apps.common.models import BaseModel


class Judge(BaseModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="judge_profile",
    )
    judge_display_name = models.CharField(max_length=255, blank=True, default="")
    specialization = models.CharField(max_length=255, blank=True, default="")
    years_experience = models.PositiveIntegerField(null=True, blank=True)
    license_number = models.CharField(max_length=100, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    rating = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    total_resolved_disputes = models.PositiveIntegerField(default=0)
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
        db_index=True,
    )
    is_verified = models.BooleanField(default=False, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=["verification_status", "is_verified"]),
            models.Index(fields=["judge_display_name"]),
        ]

    def __str__(self) -> str:
        return self.judge_display_name or self.user.get_full_name() or self.user.email
