from django.contrib import admin

from apps.milestones.models import Milestone


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ("title", "contract", "amount", "deadline", "status", "order", "created_at")
    search_fields = ("title", "contract__title")
    list_filter = ("status",)
