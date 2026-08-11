from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.common.choices import ContractStatus, UserRole
from apps.contracts.models import Contract
from apps.students.services import get_student_dashboard, get_student_payments
from apps.students.models import Student


User = get_user_model()


class StudentModelTests(TestCase):
    def test_student_str(self):
        user = User.objects.create_user(
            email="student@example.com",
            password="StrongPass123!",
            first_name="Stu",
            last_name="Dent",
            role=UserRole.STUDENT,
        )
        student = user.student_profile
        student.institution_name = "InternPay University"
        student.save()
        self.assertEqual(str(student), "InternPay University")


class StudentPaymentServiceTests(TestCase):
    def setUp(self):
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

    def test_payment_services_ignore_rejected_contracts(self):
        Contract.objects.create(
            company=self.company,
            student=self.student,
            title="Approved Contract",
            description="Approved contract description",
            total_amount=Decimal("1000.00"),
            funded_amount=Decimal("1000.00"),
            released_amount=Decimal("250.00"),
            status=ContractStatus.FUNDED,
        )
        Contract.objects.create(
            company=self.company,
            student=self.student,
            title="Rejected Contract",
            description="Rejected contract description",
            total_amount=Decimal("750.00"),
            status=ContractStatus.REJECTED,
        )

        payments = get_student_payments(self.student)
        dashboard = get_student_dashboard(self.student)

        self.assertEqual(len(payments), 1)
        self.assertEqual(payments[0]["contract_title"], "Approved Contract")
        self.assertEqual(payments[0]["pending_amount"], Decimal("750.00"))
        self.assertEqual(dashboard["pending_payments"], Decimal("750.00"))
