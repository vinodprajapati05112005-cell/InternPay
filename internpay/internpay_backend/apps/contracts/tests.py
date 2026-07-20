from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.common.choices import UserRole
from apps.companies.models import Company
from apps.contracts.models import Contract


User = get_user_model()


class ContractModelTests(TestCase):
    def test_contract_str(self):
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
        contract = Contract.objects.create(company=company, title="Website Redesign", description="Build a website", total_amount=1000)
        self.assertEqual(str(contract), "Website Redesign")
