from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.common.choices import UserRole
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
