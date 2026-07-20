from __future__ import annotations

from django.conf import settings
from django.db import models

from apps.common.choices import VerificationStatus
from apps.common.models import BaseModel


class Student(BaseModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )
    institution_name = models.CharField(max_length=255, blank=True, default="")
    course_name = models.CharField(max_length=255, blank=True, default="")
    graduation_year = models.PositiveIntegerField(null=True, blank=True)
    portfolio_url = models.URLField(blank=True, default="")
    skills = models.JSONField(default=list, blank=True)
    bio = models.TextField(blank=True, default="")
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
            models.Index(fields=["institution_name"]),
        ]

    def __str__(self) -> str:
        return self.institution_name or self.user.get_full_name() or self.user.email
