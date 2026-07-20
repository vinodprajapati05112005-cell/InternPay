from django.urls import path

from apps.common.views import HealthCheckAPIView, RootAPIView

urlpatterns = [
    path("", RootAPIView.as_view(), name="root"),
    path("health/", HealthCheckAPIView.as_view(), name="health"),
]
