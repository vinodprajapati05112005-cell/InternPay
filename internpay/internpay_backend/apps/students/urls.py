from django.urls import path

from apps.students.views import StudentContractsAPIView, StudentDashboardAPIView, StudentPaymentsAPIView, StudentProfileAPIView

urlpatterns = [
    path("students/profile/", StudentProfileAPIView.as_view(), name="student-profile"),
    path("students/dashboard/", StudentDashboardAPIView.as_view(), name="student-dashboard"),
    path("students/contracts/", StudentContractsAPIView.as_view(), name="student-contracts"),
    path("students/payments/", StudentPaymentsAPIView.as_view(), name="student-payments"),
]
