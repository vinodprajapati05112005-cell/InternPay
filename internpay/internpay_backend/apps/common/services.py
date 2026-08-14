from __future__ import annotations

import logging
from typing import Any

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def create_audit_log(*, actor, action: str, target=None, summary: str = "", changes: dict | None = None, request=None):
    from apps.disputes.models import AuditLog

    content_type = None
    object_id = None
    if target is not None:
        content_type = ContentType.objects.get_for_model(target.__class__)
        object_id = getattr(target, "pk", None)

    return AuditLog.objects.create(
        actor=actor,
        action=action,
        content_type=content_type,
        object_id=object_id,
        summary=summary or action.replace("_", " ").title(),
        changes=changes or {},
        ip_address=getattr(request, "META", {}).get("REMOTE_ADDR") if request else None,
        user_agent=(getattr(request, "META", {}).get("HTTP_USER_AGENT") or "") if request else "",
    )


def create_notification(*, user, title: str, message: str, notification_type: str = "GENERAL", channel: str = "IN_APP", payload: dict | None = None, target_url: str | None = None):
    from apps.notifications.models import Notification

    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        channel=channel,
        payload=payload or {},
        target_url=target_url or "",
    )


def run_after_commit(callback, *, label: str = "side effect") -> None:
    def _wrapped():
        try:
            callback()
        except Exception:
            logger.exception("Failed to execute %s after commit", label)

    transaction.on_commit(_wrapped)



def send_email(subject: str, message: str, recipients: list[str], fail_silently: bool = True) -> int:
    if not recipients:
        return 0
    sender = getattr(settings, "DEFAULT_FROM_EMAIL", None) or "noreply@internpay.local"
    return send_mail(subject, message, sender, recipients, fail_silently=fail_silently)


def normalize_score(value: Any) -> int:
    try:
        score = int(round(float(value)))
    except (TypeError, ValueError):
        score = 0
    return max(0, min(100, score))


def recommendation_from_score(overall_score: int) -> str:
    if overall_score >= 80:
        return "APPROVED"
    if overall_score >= 70:
        return "APPROVED_WITH_NOTES"
    return "HUMAN_REVIEW"
