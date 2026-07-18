from django.contrib import admin

from apps.disputes.models import AuditLog, Dispute


@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ("contract", "submission", "filed_by", "assigned_judge", "reason", "status", "decision", "resolved_at")
    search_fields = ("contract__title", "filed_by__email", "assigned_judge__user__email")
    list_filter = ("status", "decision")


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("action", "summary", "actor", "content_type", "object_id", "created_at")
    search_fields = ("summary", "action", "actor__email")
    list_filter = ("action",)
