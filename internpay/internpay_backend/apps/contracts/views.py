from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.common.choices import UserRole, ContractStatus
from apps.contracts.services import (
    add_milestones,
    assign_student,
    cancel_contract,
    create_contract,
    delete_contract,
    fund_contract,
    get_contract_dashboard,
    update_contract,
    resolve_student,
    pause_contract,
    unpause_contract,
)
from apps.contracts.models import Contract
from apps.contracts.serializers import (
    ContractAddMilestonesSerializer,
    ContractAssignStudentSerializer,
    ContractCancelSerializer,
    ContractDashboardSerializer,
    ContractDetailSerializer,
    ContractWriteSerializer,
)
from apps.students.models import Student
from apps.companies.models import Company
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
            from django.db.models import Q
            return qs.filter(
                Q(judge__user=user) |
                Q(disputes__assigned_judge__user=user)
            ).distinct()
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
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return Response({"success": False, "message": "Only companies can create contracts."}, status=status.HTTP_403_FORBIDDEN)
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
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return Response({"success": False, "message": "Only companies can update contracts."}, status=status.HTTP_403_FORBIDDEN)
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
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return Response({"success": False, "message": "Only companies can delete contracts."}, status=status.HTTP_403_FORBIDDEN)
        delete_contract(contract)
        return success_response(message="Contract deleted successfully")

    @action(detail=True, methods=["post"], url_path="assign-student")
    def assign_student_action(self, request, id=None):
        contract = self.get_object()
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return Response({"success": False, "message": "Only companies can assign students to contracts."}, status=status.HTTP_403_FORBIDDEN)
        serializer = ContractAssignStudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = resolve_student(serializer.validated_data["student_id"])
        if not student:
            raise serializers.ValidationError({"student_id": "Student could not be resolved by UUID, email, or wallet address."})
        contract = assign_student(contract, student)
        return success_response(
            data=ContractDetailSerializer(contract).data,
            message="Student assigned successfully",
        )

    @action(detail=True, methods=["post"], url_path="milestones")
    def add_milestones_action(self, request, id=None):
        contract = self.get_object()
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return Response({"success": False, "message": "Only companies can manage milestones."}, status=status.HTTP_403_FORBIDDEN)
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
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return Response({"success": False, "message": "Only companies can cancel contracts."}, status=status.HTTP_403_FORBIDDEN)
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
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return Response({"success": False, "message": "Only companies can fund contracts."}, status=status.HTTP_403_FORBIDDEN)
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

    @action(detail=True, methods=["post"], url_path="accept")
    def accept_action(self, request, id=None):
        contract = self.get_object()
        if request.user.role != UserRole.STUDENT and not request.user.is_superuser:
            return Response({"success": False, "message": "Only students can accept contracts."}, status=status.HTTP_403_FORBIDDEN)
        if not contract.student or contract.student.user != request.user:
            return Response({"success": False, "message": "You are not the assigned student for this contract."}, status=status.HTTP_403_FORBIDDEN)
        if contract.status != ContractStatus.PENDING:
            raise serializers.ValidationError("Only pending contracts can be accepted.")

        contract.status = ContractStatus.ACTIVE
        contract.save(update_fields=["status", "updated_at"])

        from apps.common.services import create_audit_log, create_notification
        create_audit_log(actor=request.user, action="contract_accepted", target=contract, summary=f"Accepted contract {contract.title}")
        create_notification(
            user=contract.company.user,
            title="Contract accepted by student",
            message=f"Student {request.user.get_full_name() or request.user.email} has accepted your contract: {contract.title}",
            notification_type="CONTRACT_UPDATE",
            channel="BOTH",
        )
        return success_response(
            data=ContractDetailSerializer(contract).data,
            message="Contract accepted successfully",
        )

    @action(detail=True, methods=["post"], url_path="reject")
    def reject_action(self, request, id=None):
        contract = self.get_object()
        if request.user.role != UserRole.STUDENT and not request.user.is_superuser:
            return Response({"success": False, "message": "Only students can reject contracts."}, status=status.HTTP_403_FORBIDDEN)
        if not contract.student or contract.student.user != request.user:
            return Response({"success": False, "message": "You are not the assigned student for this contract."}, status=status.HTTP_403_FORBIDDEN)
        if contract.status != ContractStatus.PENDING:
            raise serializers.ValidationError("Only pending contracts can be rejected.")

        contract.status = ContractStatus.REJECTED
        contract.save(update_fields=["status", "updated_at"])

        from apps.common.services import create_audit_log, create_notification
        create_audit_log(actor=request.user, action="contract_rejected", target=contract, summary=f"Rejected contract {contract.title}")
        create_notification(
            user=contract.company.user,
            title="Contract rejected by student",
            message=f"Student {request.user.get_full_name() or request.user.email} has rejected your contract: {contract.title}",
            notification_type="CONTRACT_UPDATE",
            channel="BOTH",
        )
        return success_response(
            data=ContractDetailSerializer(contract).data,
            message="Contract rejected successfully",
        )

    @action(detail=False, methods=["get"], url_path="dashboard")
    def dashboard(self, request):
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return Response({"success": False, "message": "Only companies can access the company dashboard."}, status=status.HTTP_403_FORBIDDEN)
        company = get_object_or_404(Company, user=request.user)
        payload = ContractDashboardSerializer(get_contract_dashboard(company)).data
        return success_response(
            data=payload,
            message="Contract dashboard retrieved successfully",
        )

    @action(detail=True, methods=["post"], url_path="pause")
    def pause_action(self, request, id=None):
        contract = self.get_object()
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return Response({"success": False, "message": "Only companies can pause contracts."}, status=status.HTTP_403_FORBIDDEN)
        contract = pause_contract(contract)
        
        from apps.common.services import create_audit_log
        create_audit_log(actor=request.user, action="contract_paused", target=contract, summary=f"Paused contract {contract.title}")
        
        return success_response(
            data=ContractDetailSerializer(contract).data,
            message="Contract paused successfully",
        )

    @action(detail=True, methods=["post"], url_path="unpause")
    def unpause_action(self, request, id=None):
        contract = self.get_object()
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return Response({"success": False, "message": "Only companies can unpause contracts."}, status=status.HTTP_403_FORBIDDEN)
        contract = unpause_contract(contract)
        
        from apps.common.services import create_audit_log
        create_audit_log(actor=request.user, action="contract_unpaused", target=contract, summary=f"Unpaused contract {contract.title}")
        
        return success_response(
            data=ContractDetailSerializer(contract).data,
            message="Contract unpaused successfully",
        )
