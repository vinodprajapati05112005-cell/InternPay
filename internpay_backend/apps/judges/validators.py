from __future__ import annotations

from django.core.exceptions import ValidationError


def validate_judge_payload(data: dict):
    if data.get("years_experience") is not None and data["years_experience"] < 0:
        raise ValidationError("Years of experience cannot be negative.")
