from __future__ import annotations

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.companies.models import Company
from apps.companies.serializers import CompanyDashboardSerializer, CompanySerializer
from apps.companies.services import get_company_dashboard, update_company_profile
from apps.companies.permissions import IsCompanyUser
from internpay.utils.responses import success_response


class CompanyProfileAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCompanyUser]

    def get_company(self, request):
        return get_object_or_404(Company, user=request.user)

    def get(self, request):
        return success_response(
            data=CompanySerializer(self.get_company(request)).data,
            message="Company profile retrieved successfully",
        )

    def patch(self, request):
        company = self.get_company(request)
        serializer = CompanySerializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        company = update_company_profile(company, serializer.validated_data)
        return success_response(
            data=CompanySerializer(company).data,
            message="Company profile updated successfully",
        )

    def put(self, request):
        return self.patch(request)


class CompanyDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCompanyUser]

    def get(self, request):
        company = get_object_or_404(Company, user=request.user)
        payload = CompanyDashboardSerializer(get_company_dashboard(company)).data
        return success_response(
            data=payload,
            message="Company dashboard retrieved successfully",
        )
