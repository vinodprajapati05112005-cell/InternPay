from __future__ import annotations

from decimal import Decimal

from django.utils import timezone
from rest_framework import serializers

from apps.common.amounts import AMOUNT_DECIMAL_PLACES, AMOUNT_MAX_DIGITS
from apps.common.choices import ContractStatus, MilestoneStatus
from apps.common.serializers import BaseModelSerializer
from apps.common.validators import validate_future_deadline, validate_positive_amount
from apps.contracts.models import Contract


class ContractMilestoneInputSerializer(serializers.Serializer):
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


class ContractWriteSerializer(BaseModelSerializer):
    milestones = ContractMilestoneInputSerializer(many=True, required=False)
    student_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    judge_id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = Contract
        fields = [
            "id",
            "title",
            "description",
            "student_id",
            "judge_id",
            "requirements",
            "total_amount",
            "currency",
            "deadline",
            "notes",
            "milestones",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_total_amount(self, value):
        validate_positive_amount(value)
        return value

    def validate_deadline(self, value):
        if value:
            validate_future_deadline(value)
        return value

    def validate(self, attrs):
        milestones = attrs.get("milestones") or []
        total_amount = attrs.get("total_amount")
        if milestones and total_amount is not None:
            milestone_total = sum(Decimal(str(item["amount"])) for item in milestones)
            if milestone_total != Decimal(str(total_amount)):
                raise serializers.ValidationError(
                    {"milestones": "Milestone amounts must equal the total amount."}
                )
        return attrs


class ContractMilestoneSummarySerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    amount = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES)
    deadline = serializers.DateTimeField()
    order = serializers.IntegerField()
    status = serializers.CharField()


class ContractDetailSerializer(BaseModelSerializer):
    company = serializers.SerializerMethodField()
    student = serializers.SerializerMethodField()
    judge = serializers.SerializerMethodField()
    milestones = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    judge_name = serializers.SerializerMethodField()
    milestone_count = serializers.SerializerMethodField()
    completed_milestones = serializers.SerializerMethodField()
    progress_percent = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        fields = [
            "id",
            "company",
            "student",
            "judge",
            "company_name",
            "student_name",
            "judge_name",
            "title",
            "description",
            "requirements",
            "total_amount",
            "currency",
            "funded_amount",
            "released_amount",
            "status",
            "deadline",
            "dispute_deadline",
            "funded_at",
            "cancelled_at",
            "completed_at",
            "archived_at",
            "chain_reference",
            "notes",
            "metadata",
            "milestones",
            "milestone_count",
            "completed_milestones",
            "progress_percent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_company(self, obj):
        company = obj.company
        return {
            "id": str(company.id),
            "company_name": company.company_name,
            "company_website": company.company_website,
            "company_industry": company.company_industry,
        }

    def get_company_name(self, obj):
        return obj.company.company_name or obj.company.user.get_full_name() or obj.company.user.email

    def get_student(self, obj):
        if not obj.student:
            return None
        student = obj.student
        return {
            "id": str(student.id),
            "institution_name": student.institution_name,
            "course_name": student.course_name,
        }

    def get_student_name(self, obj):
        if not obj.student:
            return None
        student = obj.student
        profile_name = student.institution_name or student.user.get_full_name() or student.user.email
        return profile_name

    def get_judge(self, obj):
        if not obj.judge:
            return None
        judge = obj.judge
        return {
            "id": str(judge.id),
            "judge_display_name": judge.judge_display_name,
            "specialization": judge.specialization,
        }

    def get_judge_name(self, obj):
        if not obj.judge:
            return None
        judge = obj.judge
        return judge.judge_display_name or judge.user.get_full_name() or judge.user.email

    def get_milestones(self, obj):
        qs = obj.milestones.all().order_by("order")
        if not qs.exists():
            from apps.milestones.models import Milestone
            Milestone.objects.create(
                contract=obj,
                title=obj.title,
                description=obj.description or f"Deliverables for {obj.title}",
                amount=obj.total_amount,
                deadline=obj.deadline,
                order=1,
            )
            qs = obj.milestones.all().order_by("order")
        return ContractMilestoneSummarySerializer(qs, many=True).data

    def get_milestone_count(self, obj):
        return obj.milestones.count()

    def get_completed_milestones(self, obj):
        return obj.milestones.filter(status=MilestoneStatus.APPROVED).count()

    def get_progress_percent(self, obj):
        total = obj.milestones.count()
        if not total:
            return 0
        completed = obj.milestones.filter(status=MilestoneStatus.APPROVED).count()
        return round((completed / total) * 100, 2)


class ContractDashboardSerializer(serializers.Serializer):
    total_contracts = serializers.IntegerField()
    active_contracts = serializers.IntegerField()
    funded_contracts = serializers.IntegerField()
    disputed_contracts = serializers.IntegerField()
    completed_contracts = serializers.IntegerField()
    cancelled_contracts = serializers.IntegerField()
    total_value = serializers.DecimalField(max_digits=AMOUNT_MAX_DIGITS, decimal_places=AMOUNT_DECIMAL_PLACES)
    recent_contracts = serializers.ListField(child=serializers.DictField())


class ContractAssignStudentSerializer(serializers.Serializer):
    student_id = serializers.CharField()


class ContractAddMilestonesSerializer(serializers.Serializer):
    milestones = ContractMilestoneInputSerializer(many=True)


class ContractCancelSerializer(serializers.Serializer):
    reason = serializers.CharField(required=False, allow_blank=True)
