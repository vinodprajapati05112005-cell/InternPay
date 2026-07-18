from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.common.choices import UserRole
from apps.companies.models import Company
from apps.contracts.models import Contract
from apps.contracts.serializers import (
    ContractAddMilestonesSerializer,
    ContractAssignStudentSerializer,
    ContractCancelSerializer,
    ContractDashboardSerializer,
    ContractDetailSerializer,
    ContractWriteSerializer,
)
from apps.contracts.services import add_milestones, assign_student, cancel_contract, create_contract, delete_contract, fund_contract, get_contract_dashboard, update_contract
from apps.students.models import Student
from internpay.utils.responses import success_response


class ContractFundSerializer(serializers.Serializer):
    transaction_hash = serializers.CharField(required=False, allow_blank=True)
    reference = serializers.CharField(required=False, allow_blank=True)


class ContractViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Contract.objects.select_related("company", "student", "judge").prefetch_related("milestones")
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if user.is_superuser or user.role == UserRole.ADMIN:
            return qs
        if user.role == UserRole.COMPANY:
            return qs.filter(company__user=user)
        if user.role == UserRole.STUDENT:
            return qs.filter(student__user=user)
        if user.role == UserRole.JUDGE:
            return qs.filter(judge__user=user)
        return qs.none()

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return ContractWriteSerializer
        return ContractDetailSerializer

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return success_response(
            data=serializer.data,
            message="Contracts retrieved successfully",
        )

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return success_response(
            data=serializer.data,
            message="Contract retrieved successfully",
        )

    def create(self, request, *args, **kwargs):
        serializer = ContractWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        company = get_object_or_404(Company, user=request.user)
        contract = create_contract(company=company, validated_data=serializer.validated_data)
        return success_response(
            data=ContractDetailSerializer(contract).data,
            message="Contract created successfully",
            status_code=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = ContractWriteSerializer(contract, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        contract = update_contract(contract, serializer.validated_data)
        return success_response(
            data=ContractDetailSerializer(contract).data,
            message="Contract updated successfully",
        )

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        contract = self.get_object()
        delete_contract(contract)
        return success_response(message="Contract deleted successfully")

    @action(detail=True, methods=["post"], url_path="assign-student")
    def assign_student_action(self, request, id=None):
        contract = self.get_object()
        serializer = ContractAssignStudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = get_object_or_404(Student, id=serializer.validated_data["student_id"])
        contract = assign_student(contract, student)
        return success_response(
            data=ContractDetailSerializer(contract).data,
            message="Student assigned successfully",
        )

    @action(detail=True, methods=["post"], url_path="milestones")
    def add_milestones_action(self, request, id=None):
        contract = self.get_object()
        serializer = ContractAddMilestonesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        add_milestones(contract, serializer.validated_data["milestones"])
        contract.refresh_from_db()
        return success_response(
            data=ContractDetailSerializer(contract).data,
            message="Milestones added successfully",
        )

    @action(detail=True, methods=["post"], url_path="cancel")
    def cancel_action(self, request, id=None):
        contract = self.get_object()
        serializer = ContractCancelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contract = cancel_contract(contract, serializer.validated_data.get("reason", ""))
        return success_response(
            data=ContractDetailSerializer(contract).data,
            message="Contract cancelled successfully",
        )

    @action(detail=True, methods=["post"], url_path="fund")
    def fund_action(self, request, id=None):
        contract = self.get_object()
        serializer = ContractFundSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contract = fund_contract(
            contract,
            transaction_hash=serializer.validated_data.get("transaction_hash", ""),
            reference=serializer.validated_data.get("reference", ""),
        )
        return success_response(
            data=ContractDetailSerializer(contract).data,
            message="Contract funded successfully",
        )

    @action(detail=False, methods=["get"], url_path="dashboard")
    def dashboard(self, request):
        company = get_object_or_404(Company, user=request.user)
        payload = ContractDashboardSerializer(get_contract_dashboard(company)).data
        return success_response(
            data=payload,
            message="Contract dashboard retrieved successfully",
        )
