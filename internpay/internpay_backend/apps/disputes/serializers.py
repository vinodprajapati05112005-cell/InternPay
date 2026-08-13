from __future__ import annotations

from rest_framework import serializers

from apps.common.amounts import AMOUNT_DECIMAL_PLACES, AMOUNT_MAX_DIGITS
from apps.common.choices import DisputeDecision, DisputeReason
from apps.common.serializers import BaseModelSerializer
from apps.common.validators import validate_file_upload
from apps.disputes.models import AuditLog, Dispute


class EvidenceItemSerializer(serializers.Serializer):
    type = serializers.CharField(max_length=50)
    url = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    name = serializers.CharField(required=False, allow_blank=True)


class DisputeCreateSerializer(serializers.Serializer):
    submission_id = serializers.UUIDField()
    reason = serializers.ChoiceField(choices=DisputeReason.choices)
    description = serializers.CharField()
    evidence = EvidenceItemSerializer(many=True, required=False)
    evidence_files = serializers.ListField(child=serializers.FileField(), required=False)

    def validate_evidence_files(self, value):
        for file in value:
            validate_file_upload(
                file,
                max_size_mb=50,
                allowed_extensions=(
                    "pdf",
                    "zip",
                    "rar",
                    "7z",
                    "png",
                    "jpg",
                    "jpeg",
                    "gif",
                    "webp",
                    "svg",
                    "mp4",
                    "mov",
                    "webm",
                    "mkv",
                ),
            )
        return value


class DisputeResolveSerializer(serializers.Serializer):
    decision = serializers.ChoiceField(choices=DisputeDecision.choices)
    split_percentage = serializers.IntegerField(required=False, allow_null=True, min_value=1, max_value=99)
    reasoning = serializers.CharField()
    scores = serializers.DictField(child=serializers.IntegerField(), required=False)
    judge_reward = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES, required=False, allow_null=True)
    transaction_hash = serializers.CharField(required=False, allow_blank=True)


class DisputeSerializer(BaseModelSerializer):
    contract_title = serializers.SerializerMethodField()
    submission_title = serializers.SerializerMethodField()
    project_title = serializers.SerializerMethodField()
    filed_by_name = serializers.SerializerMethodField()
    assigned_judge_name = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    milestone_title = serializers.SerializerMethodField()
    disputed_amount = serializers.SerializerMethodField()
    ai_score = serializers.SerializerMethodField()

    class Meta:
        model = Dispute
        fields = [
            "id",
            "contract",
            "submission",
            "filed_by",
            "assigned_judge",
            "contract_title",
            "submission_title",
            "project_title",
            "filed_by_name",
            "assigned_judge_name",
            "company_name",
            "student_name",
            "milestone_title",
            "disputed_amount",
            "ai_score",
            "reason",
            "description",
            "evidence",
            "status",
            "decision",
            "decision_reason",
            "split_percentage",
            "dispute_deadline",
            "resolved_at",
            "transaction_hash",
            "resolution_amount",
            "judge_reward",
            "metadata",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_contract_title(self, obj):
        return obj.contract.title

    def get_submission_title(self, obj):
        return obj.submission.milestone.title

    def get_project_title(self, obj):
        return obj.contract.title

    def get_filed_by_name(self, obj):
        return obj.filed_by.get_full_name() or obj.filed_by.email

    def get_assigned_judge_name(self, obj):
        if not obj.assigned_judge:
            return None
        return obj.assigned_judge.judge_display_name or obj.assigned_judge.user.get_full_name() or obj.assigned_judge.user.email

    def get_company_name(self, obj):
        return obj.contract.company.company_name or obj.contract.company.user.get_full_name() or obj.contract.company.user.email

    def get_student_name(self, obj):
        student = obj.contract.student
        if not student:
            return None
        return student.user.get_full_name() or student.user.email

    def get_milestone_title(self, obj):
        return obj.submission.milestone.title

    def get_disputed_amount(self, obj):
        return obj.submission.milestone.amount

    def get_ai_score(self, obj):
        report = getattr(obj.submission, "ai_report", None)
        return report.overall_score if report else None


class AuditLogSerializer(BaseModelSerializer):
    class Meta:
        model = AuditLog
        fields = [
            "id",
            "actor",
            "action",
            "content_type",
            "object_id",
            "summary",
            "changes",
            "ip_address",
            "user_agent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
