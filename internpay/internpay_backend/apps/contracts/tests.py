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
        self.student_user.wallet_address = "0x1111111111111111111111111111111111111111"
        self.student_user.save(update_fields=["wallet_address"])

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

    def test_assign_student_accepts_wallet_address(self):
        contract = Contract.objects.create(
            company=self.company,
            title="Draft Contract",
            description="Draft contract description",
            total_amount=Decimal("1000.00"),
        )

        self.client.force_authenticate(user=self.company_user)
        response = self.client.post(
            f"/api/contracts/{contract.id}/assign-student/",
            {"student_id": self.student_user.wallet_address},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["student"]["wallet_address"], self.student_user.wallet_address)
        contract.refresh_from_db()
        self.assertEqual(contract.student_id, self.student.id)


class ContractIdentityResolutionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.company_user = User.objects.create_user(
            email="create-company@example.com",
            password="StrongPass123!",
            first_name="Create",
            last_name="Company",
            role=UserRole.COMPANY,
        )
        self.company = self.company_user.company_profile
        self.company.company_name = "Create Co"
        self.company.save()

        self.student_user = User.objects.create_user(
            email="create-student@example.com",
            password="StrongPass123!",
            first_name="Create",
            last_name="Student",
            role=UserRole.STUDENT,
        )
        self.student = self.student_user.student_profile
        self.student.institution_name = "Create University"
        self.student.save()
        self.student_user.wallet_address = "0x2222222222222222222222222222222222222222"
        self.student_user.save(update_fields=["wallet_address"])

        self.judge_user = User.objects.create_user(
            email="judge@example.com",
            password="StrongPass123!",
            first_name="Judge",
            last_name="Wallet",
            role=UserRole.JUDGE,
        )
        self.judge = self.judge_user.judge_profile
        self.judge.judge_display_name = "Judge Wallet"
        self.judge.save()
        self.judge_user.wallet_address = "0x3333333333333333333333333333333333333333"
        self.judge_user.save(update_fields=["wallet_address"])

    def test_create_contract_accepts_student_and_judge_wallet_addresses(self):
        self.client.force_authenticate(user=self.company_user)
        now = timezone.now()
        deadline = now + timedelta(days=7)
        milestone_deadline = now + timedelta(days=1)
        payload = {
            "title": "Wallet Identity Contract",
            "description": "Creates contract using wallet addresses.",
            "requirements": ["Wallet resolution"],
            "deadline": deadline.isoformat(),
            "currency": "ETH",
            "total_amount": "0.010000",
            "notes": "Wallet resolution test",
            "student_id": self.student_user.wallet_address,
            "judge_id": self.judge_user.wallet_address,
            "milestones": [
                {
                    "title": "Wallet milestone",
                    "description": "Resolve judge and student by wallet.",
                    "amount": "0.010000",
                    "deadline": milestone_deadline.isoformat(),
                    "order": 1,
                }
            ],
        }

        response = self.client.post("/api/contracts/", payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["student"]["wallet_address"], self.student_user.wallet_address)
        self.assertEqual(response.data["data"]["judge"]["wallet_address"], self.judge_user.wallet_address)

    def test_create_contract_requires_judge_identity(self):
        self.client.force_authenticate(user=self.company_user)
        now = timezone.now()
        payload = {
            "title": "Missing Judge Contract",
            "description": "Judge is required.",
            "requirements": ["Judge required"],
            "deadline": (now + timedelta(days=7)).isoformat(),
            "currency": "ETH",
            "total_amount": "0.010000",
            "notes": "Judge missing test",
            "student_id": self.student_user.wallet_address,
            "judge_id": "",
            "milestones": [
                {
                    "title": "Judge milestone",
                    "description": "Should not create without judge.",
                    "amount": "0.010000",
                    "deadline": (now + timedelta(days=1)).isoformat(),
                    "order": 1,
                }
            ],
        }

        response = self.client.post("/api/contracts/", payload, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("judge_id", response.data["errors"])


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
        student_user = User.objects.create_user(
            email="precision-student@example.com",
            password="StrongPass123!",
            role=UserRole.STUDENT,
        )
        student_user.wallet_address = "0x4444444444444444444444444444444444444444"
        student_user.save(update_fields=["wallet_address"])
        judge_user = User.objects.create_user(
            email="precision-judge@example.com",
            password="StrongPass123!",
            role=UserRole.JUDGE,
        )
        judge_user.wallet_address = "0x5555555555555555555555555555555555555555"
        judge_user.save(update_fields=["wallet_address"])

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
            "student_id": student_user.wallet_address,
            "judge_id": judge_user.wallet_address,
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
