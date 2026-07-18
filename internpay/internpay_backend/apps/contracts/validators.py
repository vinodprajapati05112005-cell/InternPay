from __future__ import annotations

from django.core.exceptions import ValidationError


def validate_contract_payload(data: dict):
    if not data.get("title"):
        raise ValidationError("Contract title is required.")
    if not data.get("description"):
        raise ValidationError("Contract description is required.")
