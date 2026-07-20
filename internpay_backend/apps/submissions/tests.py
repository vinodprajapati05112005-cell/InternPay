from django.contrib.auth import get_user_model
from django.test import TestCase


User = get_user_model()


class SubmissionSmokeTests(TestCase):
    def test_module_imports(self):
        self.assertTrue(User is not None)
