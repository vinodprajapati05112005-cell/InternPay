from django.contrib import admin

from apps.submissions.models import AIReport, Submission, SubmissionFile


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ("contract", "milestone", "student", "status", "submitted_at", "evaluated_at")
    search_fields = ("contract__title", "student__institution_name", "milestone__title")
    list_filter = ("status",)


@admin.register(SubmissionFile)
class SubmissionFileAdmin(admin.ModelAdmin):
    list_display = ("submission", "original_name", "file_type", "file_size", "created_at")
    search_fields = ("original_name", "submission__contract__title")


@admin.register(AIReport)
class AIReportAdmin(admin.ModelAdmin):
    list_display = ("submission", "overall_score", "recommendation", "status", "evaluated_at")
    search_fields = ("submission__contract__title",)
    list_filter = ("recommendation", "status")
