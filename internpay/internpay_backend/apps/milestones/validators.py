from __future__ import annotations

from django.core.exceptions import ValidationError


def validate_milestone_payload(data: dict):
    if not data.get("title"):
        raise ValidationError("Milestone title is required.")
    if not data.get("description"):
        raise ValidationError("Milestone description is required.")
