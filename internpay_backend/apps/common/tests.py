from django.test import TestCase
from rest_framework.test import APIRequestFactory

from apps.common.views import HealthCheckAPIView


class CommonSmokeTests(TestCase):
    def test_health_endpoint(self):
        request = APIRequestFactory().get("/api/health/")
        response = HealthCheckAPIView.as_view()(request)
        self.assertEqual(response.status_code, 200)
