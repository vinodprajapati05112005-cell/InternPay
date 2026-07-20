from __future__ import annotations

from django.core.exceptions import ValidationError


def validate_submission_payload(data: dict):
    if not data.get("contract_id"):
        raise ValidationError("contract_id is required.")
    if not data.get("milestone_id"):
        raise ValidationError("milestone_id is required.")
