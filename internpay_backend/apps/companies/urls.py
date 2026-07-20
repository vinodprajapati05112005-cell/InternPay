from django.urls import path

from apps.companies.views import CompanyDashboardAPIView, CompanyProfileAPIView

urlpatterns = [
    path("companies/profile/", CompanyProfileAPIView.as_view(), name="company-profile"),
    path("companies/dashboard/", CompanyDashboardAPIView.as_view(), name="company-dashboard"),
]
