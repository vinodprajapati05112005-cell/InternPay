from __future__ import annotations

from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.common.choices import UserRole
from apps.companies.models import Company
from apps.judges.models import Judge
from apps.students.models import Student
from apps.users.models import User


@receiver(post_save, sender=User)
def ensure_role_profile(sender, instance: User, created: bool, **kwargs):
    if not created or instance.role == UserRole.ADMIN:
        return

    if instance.role == UserRole.COMPANY:
        Company.objects.get_or_create(
            user=instance,
            defaults={"company_name": instance.get_full_name() or instance.email},
        )
    elif instance.role == UserRole.STUDENT:
        Student.objects.get_or_create(
            user=instance,
            defaults={"institution_name": "", "course_name": ""},
        )
    elif instance.role == UserRole.JUDGE:
        Judge.objects.get_or_create(
            user=instance,
            defaults={"judge_display_name": instance.get_full_name() or instance.email},
        )
