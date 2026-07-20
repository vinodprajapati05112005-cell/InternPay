from django.contrib import admin

from apps.judges.models import Judge


@admin.register(Judge)
class JudgeAdmin(admin.ModelAdmin):
    list_display = ("judge_display_name", "user", "verification_status", "is_verified", "rating", "total_resolved_disputes")
    search_fields = ("judge_display_name", "user__email", "specialization", "license_number")
    list_filter = ("verification_status", "is_verified")
