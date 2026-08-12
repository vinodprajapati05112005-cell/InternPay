from __future__ import annotations

from rest_framework import serializers

from apps.common.amounts import AMOUNT_DECIMAL_PLACES, AMOUNT_MAX_DIGITS
from apps.common.serializers import BaseModelSerializer
from apps.students.models import Student


class StudentSerializer(BaseModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "user",
            "institution_name",
            "course_name",
            "graduation_year",
            "portfolio_url",
            "skills",
            "bio",
            "verification_status",
            "is_verified",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "verification_status", "is_verified", "created_at", "updated_at"]


class StudentDashboardSerializer(serializers.Serializer):
    total_contracts = serializers.IntegerField()
    active_contracts = serializers.IntegerField()
    submitted_work = serializers.IntegerField()
    approved_submissions = serializers.IntegerField()
    rejected_submissions = serializers.IntegerField()
    pending_payments = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES)
    recent_submissions = serializers.ListField(child=serializers.DictField())


class StudentContractSummarySerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    status = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES)
    funded_amount = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES)
    released_amount = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES)
    company_name = serializers.CharField(required=False, allow_blank=True)
    deadline = serializers.DateTimeField(required=False, allow_null=True)
    milestone_count = serializers.IntegerField(required=False)
    completed_milestones = serializers.IntegerField(required=False)
    progress_percent = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    created_at = serializers.DateTimeField()


class StudentPaymentSerializer(serializers.Serializer):
    contract_id = serializers.CharField()
    contract_title = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES)
    funded_amount = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES)
    released_amount = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES)
    pending_amount = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES)
    status = serializers.CharField()
