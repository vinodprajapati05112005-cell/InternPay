from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.common.choices import UserRole
from apps.companies.models import Company


User = get_user_model()


class CompanyModelTests(TestCase):
    def test_company_str(self):
        user = User.objects.create_user(
            email="company@example.com",
            password="StrongPass123!",
            first_name="Comp",
            last_name="Any",
            role=UserRole.COMPANY,
        )
        company = user.company_profile
        company.company_name = "Example Co"
        company.save()
        self.assertEqual(str(company), "Example Co")
