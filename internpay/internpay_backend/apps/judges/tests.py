from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.common.choices import UserRole
from apps.judges.models import Judge


User = get_user_model()


class JudgeModelTests(TestCase):
    def test_judge_str(self):
        user = User.objects.create_user(
            email="judge@example.com",
            password="StrongPass123!",
            first_name="Jud",
            last_name="Ge",
            role=UserRole.JUDGE,
        )
        judge = user.judge_profile
        judge.judge_display_name = "Judge Judy"
        judge.save()
        self.assertEqual(str(judge), "Judge Judy")
