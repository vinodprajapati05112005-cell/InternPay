from decimal import Decimal
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
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


class ContractDashboardTests(TestCase):
    def test_company_dashboard_returns_summary(self):
        user = User.objects.create_user(
            email="dashboard-company@example.com",
            password="StrongPass123!",
            role=UserRole.COMPANY,
        )
        company = user.company_profile
        Contract.objects.create(
            company=company,
            title="Dashboard contract",
            description="Dashboard coverage",
            total_amount=Decimal("250.00"),
        )

        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get("/api/contracts/dashboard/")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["total_contracts"], 1)
        self.assertEqual(response.data["data"]["total_value"], "250.000000")


class ContractCreatePrecisionTests(TestCase):
    def test_create_contract_preserves_fractional_amounts(self):
        client = APIClient()
        user = User.objects.create_user(
            email="precision-company@example.com",
            password="StrongPass123!",
            role=UserRole.COMPANY,
        )
        company = user.company_profile
        company.company_name = "Precision Co"
        company.save()

        client.force_authenticate(user=user)
        now = timezone.now()
        deadline = now + timedelta(days=7)
        milestone_deadline = now + timedelta(days=1)
        payload = {
            "title": "Fractional Precision Contract",
            "description": "Verifies 0.001 ETH amounts stay intact.",
            "requirements": ["Precision handling"],
            "deadline": deadline.isoformat(),
            "currency": "ETH",
            "total_amount": "0.001",
            "notes": "Fractional ETH test",
            "student_id": "",
            "judge_id": None,
            "milestones": [
                {
                    "title": "Tiny milestone",
                    "description": "A very small amount",
                    "amount": "0.001",
                    "deadline": milestone_deadline.isoformat(),
                    "order": 1,
                }
            ],
        }

        response = client.post("/api/contracts/", payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["data"]["total_amount"], "0.001000")
        self.assertEqual(response.data["data"]["milestones"][0]["amount"], "0.001000")

        contract = Contract.objects.get(id=response.data["data"]["id"])
        self.assertEqual(contract.total_amount, Decimal("0.001000"))
        self.assertEqual(contract.milestones.first().amount, Decimal("0.001000"))
