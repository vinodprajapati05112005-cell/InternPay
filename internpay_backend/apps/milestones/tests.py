from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from datetime import timedelta

from apps.common.choices import UserRole
from apps.companies.models import Company
from apps.contracts.models import Contract
from apps.milestones.models import Milestone


User = get_user_model()


class MilestoneModelTests(TestCase):
    def test_milestone_str(self):
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
        milestone = Milestone.objects.create(
            contract=contract,
            title="Design",
            description="Design phase",
            amount=500,
            deadline=timezone.now() + timedelta(days=1),
        )
        self.assertIn("Design", str(milestone))
