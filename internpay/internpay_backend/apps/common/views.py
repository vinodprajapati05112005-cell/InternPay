from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from internpay.utils.responses import success_response


class HealthCheckAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return success_response(
            data={
                "status": "healthy",
            },
            message="InternPay backend is running",
        )


class RootAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return success_response(
            data={
                "service": "InternPay API",
                "version": "v1",
            },
            message="Welcome to InternPay",
        )
