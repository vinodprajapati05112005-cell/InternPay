from django.contrib import admin

from apps.students.models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("institution_name", "user", "verification_status", "is_verified", "graduation_year", "created_at")
    search_fields = ("institution_name", "user__email", "course_name")
    list_filter = ("verification_status", "is_verified")
