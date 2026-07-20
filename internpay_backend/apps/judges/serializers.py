from __future__ import annotations

from rest_framework import serializers

from apps.common.serializers import BaseModelSerializer
from apps.judges.models import Judge


class JudgeSerializer(BaseModelSerializer):
    class Meta:
        model = Judge
        fields = [
            "id",
            "user",
            "judge_display_name",
            "specialization",
            "years_experience",
            "license_number",
            "bio",
            "rating",
            "total_resolved_disputes",
            "verification_status",
            "is_verified",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "rating", "total_resolved_disputes", "verification_status", "is_verified", "created_at", "updated_at"]


class JudgeDashboardSerializer(serializers.Serializer):
    assigned_disputes = serializers.IntegerField()
    completed_disputes = serializers.IntegerField()
    open_disputes = serializers.IntegerField()
    average_resolution_hours = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_approved = serializers.IntegerField()
    total_rejected = serializers.IntegerField()
    total_partial = serializers.IntegerField()
    recent_decisions = serializers.ListField(child=serializers.DictField())


class JudgeDecisionHistorySerializer(serializers.Serializer):
    dispute_id = serializers.CharField()
    submission_id = serializers.CharField()
    contract_title = serializers.CharField()
    decision = serializers.CharField()
    resolved_at = serializers.DateTimeField()
    reasoning = serializers.CharField()
