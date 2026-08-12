from __future__ import annotations

from rest_framework import serializers

from apps.common.amounts import AMOUNT_DECIMAL_PLACES, AMOUNT_MAX_DIGITS
from apps.common.serializers import BaseModelSerializer
from apps.companies.models import Company


class CompanySerializer(BaseModelSerializer):
    class Meta:
        model = Company
        fields = [
            "id",
            "user",
            "company_name",
            "company_website",
            "company_registration_number",
            "company_industry",
            "company_address",
            "description",
            "team_size",
            "verification_status",
            "is_verified",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "verification_status", "is_verified", "created_at", "updated_at"]


class CompanyDashboardSerializer(serializers.Serializer):
    total_contracts = serializers.IntegerField()
    active_contracts = serializers.IntegerField()
    funded_contracts = serializers.IntegerField()
    completed_contracts = serializers.IntegerField()
    disputed_contracts = serializers.IntegerField()
    total_spent = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES)
    recent_contracts = serializers.ListField(child=serializers.DictField())
