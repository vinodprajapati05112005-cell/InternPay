from __future__ import annotations

from decimal import Decimal
from pathlib import Path

from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from django.utils.translation import gettext_lazy as _


def validate_positive_amount(value):
    if value is None or Decimal(str(value)) <= 0:
        raise ValidationError(_("Amount must be greater than zero."))


def validate_future_deadline(value):
    if value is None:
        raise ValidationError(_("Deadline is required."))
    from django.utils import timezone

    if value <= timezone.now():
        raise ValidationError(_("Deadline must be in the future."))


def validate_http_url(value):
    if not value:
        return value
    validator = URLValidator(schemes=["http", "https"])
    validator(value)
    return value


def validate_file_upload(file_obj, max_size_mb: int = 25, allowed_extensions: tuple[str, ...] = ()):
    if file_obj is None:
        raise ValidationError(_("File is required."))
    size_mb = file_obj.size / (1024 * 1024)
    if size_mb > max_size_mb:
        raise ValidationError(_(f"File size exceeds {max_size_mb}MB."))
    if allowed_extensions:
        suffix = Path(file_obj.name).suffix.lower().lstrip(".")
        if suffix not in allowed_extensions:
            raise ValidationError(_(f"Unsupported file type: .{suffix}"))


def validate_password_strength(value):
    if len(value or "") < 8:
        raise ValidationError(_("Password must be at least 8 characters long."))


def validate_wallet_address(value):
    if value:
        import re
        pattern = re.compile(r"^0x[a-fA-F0-9]{40}$")
        if not pattern.match(str(value)):
            raise ValidationError(_("Invalid Ethereum wallet address format."))

