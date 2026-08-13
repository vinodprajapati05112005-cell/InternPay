from __future__ import annotations

from rest_framework import serializers

from apps.common.serializers import BaseModelSerializer
from apps.common.validators import validate_http_url, validate_file_upload
from apps.submissions.models import AIReport, Submission, SubmissionFile


class SubmissionFileSerializer(BaseModelSerializer):
    class Meta:
        model = SubmissionFile
        fields = ["id", "submission", "file", "file_type", "original_name", "file_size", "created_at", "updated_at"]
        read_only_fields = ["id", "submission", "file_type", "original_name", "file_size", "created_at", "updated_at"]


class AIReportSerializer(BaseModelSerializer):
    class Meta:
        model = AIReport
        fields = [
            "id",
            "submission",
            "code_score",
            "design_score",
            "requirement_score",
            "functionality_score",
            "overall_score",
            "strengths",
            "weaknesses",
            "recommendation",
            "explanation",
            "raw_response",
            "status",
            "model_version",
            "evaluated_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class SubmissionCreateSerializer(serializers.Serializer):
    contract_id = serializers.UUIDField()
    milestone_id = serializers.UUIDField()
    github_url = serializers.URLField(required=False, allow_blank=True)
    demo_url = serializers.URLField(required=False, allow_blank=True)
    figma_url = serializers.URLField(required=False, allow_blank=True)
    documentation_url = serializers.URLField(required=False, allow_blank=True)
    video_url = serializers.URLField(required=False, allow_blank=True)
    additional_notes = serializers.CharField(required=False, allow_blank=True)
    transaction_hash = serializers.CharField(required=False, allow_blank=True)
    files = serializers.ListField(child=serializers.FileField(), required=False)

    def validate(self, attrs):
        for field in ["github_url", "demo_url", "figma_url", "documentation_url", "video_url"]:
            if attrs.get(field):
                validate_http_url(attrs[field])
        files = attrs.get("files") or []
        for file in files:
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
        return attrs


class SubmissionUpdateSerializer(serializers.Serializer):
    github_url = serializers.URLField(required=False, allow_blank=True)
    demo_url = serializers.URLField(required=False, allow_blank=True)
    figma_url = serializers.URLField(required=False, allow_blank=True)
    documentation_url = serializers.URLField(required=False, allow_blank=True)
    video_url = serializers.URLField(required=False, allow_blank=True)
    additional_notes = serializers.CharField(required=False, allow_blank=True)
    transaction_hash = serializers.CharField(required=False, allow_blank=True)
    files = serializers.ListField(child=serializers.FileField(), required=False)

    def validate(self, attrs):
        for field in ["github_url", "demo_url", "figma_url", "documentation_url", "video_url"]:
            if attrs.get(field):
                validate_http_url(attrs[field])
        files = attrs.get("files") or []
        for file in files:
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
        return attrs


class SubmissionDetailSerializer(BaseModelSerializer):
    files = SubmissionFileSerializer(many=True, read_only=True)
    ai_report = AIReportSerializer(read_only=True)
    contract_title = serializers.SerializerMethodField()
    milestone_title = serializers.SerializerMethodField()
    milestone_order = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    contract_status = serializers.SerializerMethodField()
    milestone_status = serializers.SerializerMethodField()
    contract_metadata = serializers.SerializerMethodField()
    ai_score = serializers.SerializerMethodField()
    ai_recommendation = serializers.SerializerMethodField()
    links = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = [
            "id",
            "contract",
            "milestone",
            "student",
            "contract_title",
            "milestone_title",
            "milestone_order",
            "student_name",
            "company_name",
            "contract_status",
            "milestone_status",
            "contract_metadata",
            "github_url",
            "demo_url",
            "figma_url",
            "documentation_url",
            "video_url",
            "additional_notes",
            "status",
            "submitted_at",
            "evaluated_at",
            "transaction_hash",
            "ai_score",
            "ai_recommendation",
            "links",
            "files",
            "ai_report",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_contract_title(self, obj):
        return obj.contract.title

    def get_milestone_title(self, obj):
        return obj.milestone.title

    def get_milestone_order(self, obj):
        return obj.milestone.order

    def get_student_name(self, obj):
        return obj.student.user.get_full_name() or obj.student.user.email

    def get_company_name(self, obj):
        return obj.contract.company.company_name or obj.contract.company.user.get_full_name() or obj.contract.company.user.email

    def get_contract_status(self, obj):
        return obj.contract.status

    def get_milestone_status(self, obj):
        return obj.milestone.status

    def get_contract_metadata(self, obj):
        return obj.contract.metadata or {}

    def get_ai_score(self, obj):
        report = getattr(obj, "ai_report", None)
        return report.overall_score if report else None

    def get_ai_recommendation(self, obj):
        report = getattr(obj, "ai_report", None)
        return report.recommendation if report else None

    def get_links(self, obj):
        payload = {
            "github": obj.github_url,
            "demo": obj.demo_url,
            "figma": obj.figma_url,
            "documentation": obj.documentation_url,
            "video": obj.video_url,
        }
        return {key: value for key, value in payload.items() if value}


class SubmissionListSerializer(serializers.ModelSerializer):
    contract_title = serializers.SerializerMethodField()
    milestone_title = serializers.SerializerMethodField()
    milestone_order = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    ai_score = serializers.SerializerMethodField()
    ai_recommendation = serializers.SerializerMethodField()
    links = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = [
            "id",
            "contract",
            "milestone",
            "student",
            "contract_title",
            "milestone_title",
            "milestone_order",
            "student_name",
            "company_name",
            "status",
            "submitted_at",
            "evaluated_at",
            "ai_score",
            "ai_recommendation",
            "links",
            "created_at",
        ]
        read_only_fields = fields

    def get_contract_title(self, obj):
        return obj.contract.title

    def get_milestone_title(self, obj):
        return obj.milestone.title

    def get_milestone_order(self, obj):
        return obj.milestone.order

    def get_student_name(self, obj):
        return obj.student.user.get_full_name() or obj.student.user.email

    def get_company_name(self, obj):
        return obj.contract.company.company_name or obj.contract.company.user.get_full_name() or obj.contract.company.user.email

    def get_ai_score(self, obj):
        report = getattr(obj, "ai_report", None)
        return report.overall_score if report else None

    def get_ai_recommendation(self, obj):
        report = getattr(obj, "ai_report", None)
        return report.recommendation if report else None

    def get_links(self, obj):
        payload = {
            "github": obj.github_url,
            "demo": obj.demo_url,
            "figma": obj.figma_url,
            "documentation": obj.documentation_url,
            "video": obj.video_url,
        }
        return {key: value for key, value in payload.items() if value}
