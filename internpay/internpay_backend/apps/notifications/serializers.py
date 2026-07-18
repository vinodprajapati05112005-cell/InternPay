from __future__ import annotations

from rest_framework import serializers

from apps.common.serializers import BaseModelSerializer
from apps.notifications.models import Notification


class NotificationSerializer(BaseModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "user",
            "title",
            "message",
            "notification_type",
            "channel",
            "payload",
            "target_url",
            "delivery_status",
            "is_read",
            "read_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class NotificationMarkReadSerializer(serializers.Serializer):
    notification_ids = serializers.ListField(child=serializers.UUIDField(), required=False)
