from __future__ import annotations

from django.core.exceptions import ValidationError


def validate_notification_payload(data: dict):
    if not data.get("title"):
        raise ValidationError("title is required.")
    if not data.get("message"):
        raise ValidationError("message is required.")
