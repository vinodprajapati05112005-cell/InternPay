from __future__ import annotations

from django.core.exceptions import ValidationError

from apps.common.validators import validate_http_url


def validate_company_payload(data: dict):
    if data.get("company_website"):
        validate_http_url(data["company_website"])
    if data.get("team_size") is not None and data["team_size"] < 1:
        raise ValidationError("Team size must be at least 1.")
