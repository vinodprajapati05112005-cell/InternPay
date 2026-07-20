from __future__ import annotations

from django.conf import settings
from django.db import models

from apps.common.choices import VerificationStatus
from apps.common.models import BaseModel


class Company(BaseModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="company_profile",
    )
    company_name = models.CharField(max_length=255, blank=True, default="")
    company_website = models.URLField(blank=True, default="")
    company_registration_number = models.CharField(max_length=100, blank=True, default="")
    company_industry = models.CharField(max_length=150, blank=True, default="")
    company_address = models.CharField(max_length=255, blank=True, default="")
    description = models.TextField(blank=True, default="")
    team_size = models.PositiveIntegerField(null=True, blank=True)
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
            models.Index(fields=["company_name"]),
        ]

    def __str__(self) -> str:
        return self.company_name or self.user.get_full_name() or self.user.email
