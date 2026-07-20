from __future__ import annotations

from django.utils import timezone

from apps.notifications.models import Notification


def create_notification(*, user, title: str, message: str, notification_type: str = "GENERAL", channel: str = "IN_APP", payload: dict | None = None, target_url: str | None = None):
    from apps.common.services import create_notification as common_create_notification

    return common_create_notification(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        channel=channel,
        payload=payload or {},
        target_url=target_url,
    )


def mark_notifications_read(user, notification_ids: list[str] | None = None):
    qs = Notification.objects.filter(user=user, is_read=False)
    if notification_ids:
        qs = qs.filter(id__in=notification_ids)
    updated = qs.update(is_read=True, read_at=timezone.now(), delivery_status="READ")
    return updated


def get_unread_count(user) -> int:
    return Notification.objects.filter(user=user, is_read=False).count()
