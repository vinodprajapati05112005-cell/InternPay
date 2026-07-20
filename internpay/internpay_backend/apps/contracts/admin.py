from django.contrib import admin

from apps.contracts.models import Contract


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "student", "status", "total_amount", "funded_amount", "released_amount", "created_at")
    search_fields = ("title", "company__company_name", "student__institution_name")
    list_filter = ("status",)
