from __future__ import annotations

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationMarkReadSerializer, NotificationSerializer
from apps.notifications.services import get_unread_count, mark_notifications_read
from apps.common.choices import UserRole
from internpay.utils.responses import success_response


class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == UserRole.ADMIN:
            return Notification.objects.all()
        return Notification.objects.filter(user=user)

    def list(self, request, *args, **kwargs):
        serializer = NotificationSerializer(self.get_queryset(), many=True)
        return success_response(
            data={
                "notifications": serializer.data,
                "unread_count": get_unread_count(request.user),
            },
            message="Notifications retrieved successfully",
        )

    def retrieve(self, request, *args, **kwargs):
        notification = self.get_object()
        return success_response(
            data=NotificationSerializer(notification).data,
            message="Notification retrieved successfully",
        )

    @action(detail=True, methods=["post"], url_path="read")
    def read_notification(self, request, id=None):
        notification = self.get_object()
        mark_notifications_read(request.user, [str(notification.id)])
        notification.refresh_from_db()
        return success_response(
            data=NotificationSerializer(notification).data,
            message="Notification marked as read",
        )

    @action(detail=False, methods=["post"], url_path="read-all")
    def read_all(self, request):
        updated = mark_notifications_read(request.user)
        return success_response(
            data={"updated": updated},
            message="All notifications marked as read",
        )
