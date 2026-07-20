from django.contrib import admin

from apps.companies.models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("company_name", "user", "verification_status", "is_verified", "team_size", "created_at")
    search_fields = ("company_name", "user__email", "company_registration_number")
    list_filter = ("verification_status", "is_verified")
