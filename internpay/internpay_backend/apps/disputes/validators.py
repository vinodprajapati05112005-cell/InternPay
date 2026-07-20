from __future__ import annotations

from django.core.exceptions import ValidationError


def validate_dispute_payload(data: dict):
    if not data.get("submission_id"):
        raise ValidationError("submission_id is required.")
    if not data.get("reason"):
        raise ValidationError("reason is required.")
    if not data.get("description"):
        raise ValidationError("description is required.")
