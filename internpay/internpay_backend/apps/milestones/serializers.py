from __future__ import annotations

from rest_framework import serializers

from apps.common.amounts import AMOUNT_DECIMAL_PLACES, AMOUNT_MAX_DIGITS
from apps.common.serializers import BaseModelSerializer
from apps.common.validators import validate_future_deadline, validate_positive_amount
from apps.milestones.models import Milestone


class MilestoneSerializer(BaseModelSerializer):
    submission_id = serializers.SerializerMethodField()

    class Meta:
        model = Milestone
        fields = [
            "id",
            "contract",
            "title",
            "description",
            "amount",
            "deadline",
            "order",
            "status",
            "submitted_at",
            "approved_at",
            "rejected_at",
            "rejection_reason",
            "submission_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "contract", "status", "submitted_at", "approved_at", "rejected_at", "created_at", "updated_at", "submission_id"]

    def get_submission_id(self, obj):
        submission = getattr(obj, "submission", None)
        return str(submission.id) if submission else None


class MilestoneWriteSerializer(serializers.Serializer):
    contract_id = serializers.UUIDField(required=False)
    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    amount = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES)
    deadline = serializers.DateTimeField()
    order = serializers.IntegerField(required=False, min_value=1)

    def validate_amount(self, value):
        validate_positive_amount(value)
        return value

    def validate_deadline(self, value):
        validate_future_deadline(value)
        return value
