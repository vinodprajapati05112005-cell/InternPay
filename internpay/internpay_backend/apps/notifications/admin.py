from django.contrib import admin

from apps.notifications.models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "notification_type", "channel", "is_read", "delivery_status", "created_at")
    search_fields = ("title", "message", "user__email")
    list_filter = ("notification_type", "channel", "is_read")
