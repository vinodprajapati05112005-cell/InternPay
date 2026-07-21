from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from decimal import Decimal

from apps.common.choices import UserRole, ContractStatus, MilestoneStatus, SubmissionStatus
from apps.companies.models import Company
from apps.students.models import Student
from apps.contracts.models import Contract
from apps.milestones.models import Milestone
from apps.submissions.models import Submission
from apps.submissions.services import create_submission
from rest_framework.exceptions import ValidationError

User = get_user_model()

class SubmissionValidationTests(TestCase):
    def setUp(self):
        # Create company
        self.company_user = User.objects.create_user(
            email="company@example.com",
            password="StrongPass123!",
            first_name="Company",
            last_name="Owner",
            role=UserRole.COMPANY
        )
        self.company = self.company_user.company_profile
        self.company.company_name = "Example Corp"
        self.company.save()

        # Create student A
        self.student_user_a = User.objects.create_user(
            email="student_a@example.com",
            password="StrongPass123!",
            first_name="Student",
            last_name="A",
            role=UserRole.STUDENT
        )
        self.student_a = self.student_user_a.student_profile

        # Create student B (unassigned)
        self.student_user_b = User.objects.create_user(
            email="student_b@example.com",
            password="StrongPass123!",
            first_name="Student",
            last_name="B",
            role=UserRole.STUDENT
        )
        self.student_b = self.student_user_b.student_profile

        # Create contract for student A
        self.contract = Contract.objects.create(
            company=self.company,
            student=self.student_a,
            title="E2E Validation Contract",
            description="Testing contract submission validations",
            total_amount=Decimal("100.00"),
            status=ContractStatus.ACTIVE,
            deadline=timezone.now() + timezone.timedelta(days=5)
        )

        # Create milestone 1 (eligible)
        self.milestone1 = Milestone.objects.create(
            contract=self.contract,
            title="Milestone 1",
            description="Complete the task",
            amount=Decimal("50.00"),
            deadline=timezone.now() + timezone.timedelta(days=5),
            order=1,
            status=MilestoneStatus.PENDING
        )

        # Create milestone 2 (eligible)
        self.milestone2 = Milestone.objects.create(
            contract=self.contract,
            title="Milestone 2",
            description="Complete task 2",
            amount=Decimal("50.00"),
            deadline=timezone.now() + timezone.timedelta(days=5),
            order=2,
            status=MilestoneStatus.PENDING
        )

        # Create a separate contract + milestone for student B
        self.other_contract = Contract.objects.create(
            company=self.company,
            student=self.student_b,
            title="Other Student Contract",
            description="Another student's contract",
            total_amount=Decimal("20.00"),
            status=ContractStatus.ACTIVE,
            deadline=timezone.now() + timezone.timedelta(days=5)
        )
        self.other_milestone = Milestone.objects.create(
            contract=self.other_contract,
            title="Other Milestone",
            description="Description B",
            amount=Decimal("20.00"),
            deadline=timezone.now() + timezone.timedelta(days=5),
            order=1,
            status=MilestoneStatus.PENDING
        )

    def test_successful_submission(self):
        """Test Test 1: Normal flow - successful work submission"""
        data = {
            "contract_id": str(self.contract.id),
            "milestone_id": str(self.milestone1.id),
            "github_url": "https://github.com/student/repo",
            "demo_url": "https://demo.example.com"
        }
        submission = create_submission(student=self.student_a, validated_data=data)
        self.assertEqual(submission.contract, self.contract)
        self.assertEqual(submission.milestone, self.milestone1)
        self.assertEqual(submission.student, self.student_a)

    def test_unassigned_freelancer_rejected(self):
        """Test Test 4: Freelancer B tries to submit work for Freelancer A's contract"""
        data = {
            "contract_id": str(self.contract.id),
            "milestone_id": str(self.milestone1.id),
            "github_url": "https://github.com/student/repo"
        }
        with self.assertRaises(ValidationError) as ctx:
            create_submission(student=self.student_b, validated_data=data)
        self.assertIn("You are not assigned to this contract", str(ctx.exception))

    def test_wrong_milestone_belongs_to_other_contract(self):
        """Test Test 3: Freelancer tries to submit using a milestone belonging to another contract"""
        data = {
            "contract_id": str(self.contract.id),
            "milestone_id": str(self.other_milestone.id),
            "github_url": "https://github.com/student/repo"
        }
        with self.assertRaises(ValidationError) as ctx:
            create_submission(student=self.student_a, validated_data=data)
        self.assertIn("This milestone does not belong to the specified contract", str(ctx.exception))

    def test_duplicate_submission_prevented(self):
        """Test Test 5: Freelancer submits the same milestone twice"""
        data1 = {
            "contract_id": str(self.contract.id),
            "milestone_id": str(self.milestone1.id),
            "github_url": "https://github.com/student/repo"
        }
        create_submission(student=self.student_a, validated_data=data1)
        
        data2 = {
            "contract_id": str(self.contract.id),
            "milestone_id": str(self.milestone1.id),
            "github_url": "https://github.com/student/repo"
        }
        with self.assertRaises(ValidationError) as ctx:
            create_submission(student=self.student_a, validated_data=data2)
        self.assertIn("This milestone already has a submission", str(ctx.exception))

    def test_milestone_approved_status_rejected(self):
        """Test that submission is blocked if milestone is already approved"""
        self.milestone1.status = MilestoneStatus.APPROVED
        self.milestone1.save()
        
        data = {
            "contract_id": str(self.contract.id),
            "milestone_id": str(self.milestone1.id),
            "github_url": "https://github.com/student/repo"
        }
        with self.assertRaises(ValidationError) as ctx:
            create_submission(student=self.student_a, validated_data=data)
        self.assertIn("This milestone has already been approved", str(ctx.exception))

    def test_milestone_cancelled_status_rejected(self):
        """Test that submission is blocked if milestone is cancelled"""
        self.milestone1.status = MilestoneStatus.CANCELLED
        self.milestone1.save()
        
        data = {
            "contract_id": str(self.contract.id),
            "milestone_id": str(self.milestone1.id),
            "github_url": "https://github.com/student/repo"
        }
        with self.assertRaises(ValidationError) as ctx:
            create_submission(student=self.student_a, validated_data=data)
        self.assertIn("This milestone has been cancelled", str(ctx.exception))

    def test_inactive_contract_rejected(self):
        """Test that submission is blocked if contract is not active"""
        self.contract.status = ContractStatus.PENDING
        self.contract.save()
        
        data = {
            "contract_id": str(self.contract.id),
            "milestone_id": str(self.milestone1.id),
            "github_url": "https://github.com/student/repo"
        }
        with self.assertRaises(ValidationError) as ctx:
            create_submission(student=self.student_a, validated_data=data)
        self.assertIn("You cannot submit work for a contract that is not active", str(ctx.exception))

