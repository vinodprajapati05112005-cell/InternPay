from django.core.exceptions import ValidationError

from apps.common.choices import UserRole


def validate_role_data(role: str, data: dict):
    if role == UserRole.COMPANY and not data.get("company_name"):
        raise ValidationError("Company name is required.")
    if role == UserRole.STUDENT and not data.get("institution_name"):
        raise ValidationError("Institution name is required.")
    if role == UserRole.JUDGE and not data.get("judge_display_name"):
        raise ValidationError("Judge display name is required.")
