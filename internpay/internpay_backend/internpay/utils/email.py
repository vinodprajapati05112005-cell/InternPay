from __future__ import annotations

from django.conf import settings
from django.core.mail import send_mail


def send_plain_email(subject: str, message: str, recipients: list[str], fail_silently: bool = True) -> int:
    if not recipients:
        return 0
    sender = getattr(settings, "DEFAULT_FROM_EMAIL", None) or "noreply@internpay.local"
    return send_mail(subject, message, sender, recipients, fail_silently=fail_silently)


def frontend_link(path: str) -> str:
    base_url = getattr(settings, "FRONTEND_URL", "") or getattr(settings, "SITE_URL", "")
    return f"{base_url.rstrip('/')}/{path.lstrip('/')}"
