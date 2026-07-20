from __future__ import annotations

from django.core.exceptions import ValidationError

from apps.common.validators import validate_http_url


def validate_student_payload(data: dict):
    if data.get("portfolio_url"):
        validate_http_url(data["portfolio_url"])
    if data.get("graduation_year") is not None and data["graduation_year"] < 1900:
        raise ValidationError("Graduation year looks invalid.")
