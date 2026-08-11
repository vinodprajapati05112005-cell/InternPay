from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.common.choices import ContractStatus, UserRole
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


class ContractAssignStudentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.company_user = User.objects.create_user(
            email="company@example.com",
            password="StrongPass123!",
            first_name="Comp",
            last_name="Any",
            role=UserRole.COMPANY,
        )
        self.company = self.company_user.company_profile
        self.company.company_name = "Example Co"
        self.company.save()

        self.student_user = User.objects.create_user(
            email="student@example.com",
            password="StrongPass123!",
            first_name="Stu",
            last_name="Dent",
            role=UserRole.STUDENT,
        )
        self.student = self.student_user.student_profile
        self.student.institution_name = "InternPay University"
        self.student.save()

    def test_assign_student_returns_editable_error_for_active_contract(self):
        contract = Contract.objects.create(
            company=self.company,
            student=self.student,
            title="Active Contract",
            description="Active contract description",
            total_amount=Decimal("1000.00"),
            status=ContractStatus.ACTIVE,
        )

        self.client.force_authenticate(user=self.company_user)
        response = self.client.post(
            f"/api/contracts/{contract.id}/assign-student/",
            {"student_id": self.student_user.email},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("Only draft or pending contracts can be assigned.", response.data["message"])
