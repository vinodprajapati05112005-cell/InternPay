from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


User = get_user_model()


class UserAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_student(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "email": "student@example.com",
                "password": "StrongPass123!",
                "password_confirm": "StrongPass123!",
                "first_name": "Stu",
                "last_name": "Dent",
                "role": "STUDENT",
                "institution_name": "InternPay University",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(email="student@example.com").exists())
