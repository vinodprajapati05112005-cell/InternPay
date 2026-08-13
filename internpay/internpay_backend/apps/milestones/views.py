from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.common.choices import ContractStatus, UserRole
from apps.contracts.models import Contract
from apps.contracts.serializers import ContractDetailSerializer
from apps.milestones.models import Milestone
from apps.milestones.permissions import IsMilestoneParticipantOrAdmin
from apps.milestones.serializers import MilestoneSerializer, MilestoneWriteSerializer
from apps.milestones.services import create_milestone, release_milestone_payment, update_milestone
from internpay.utils.responses import success_response


class MilestoneReleaseSerializer(serializers.Serializer):
    transaction_hash = serializers.CharField(required=False, allow_blank=True)
    reference = serializers.CharField(required=False, allow_blank=True)


class MilestoneViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Milestone.objects.select_related("contract", "contract__company", "contract__student", "contract__judge")
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if user.is_superuser or user.role == UserRole.ADMIN:
            return qs
        if user.role == UserRole.COMPANY:
            return qs.filter(contract__company__user=user)
        if user.role == UserRole.STUDENT:
            return qs.filter(contract__student__user=user)
        if user.role == UserRole.JUDGE:
            return qs.filter(contract__judge__user=user)
        return qs.none()

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return MilestoneWriteSerializer
        return MilestoneSerializer

    def list(self, request, *args, **kwargs):
        serializer = MilestoneSerializer(self.get_queryset(), many=True)
        return success_response(data=serializer.data, message="Milestones retrieved successfully")

    def retrieve(self, request, *args, **kwargs):
        serializer = MilestoneSerializer(self.get_object())
        return success_response(data=serializer.data, message="Milestone retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = MilestoneWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contract_id = serializer.validated_data.pop("contract_id", None)
        contract = None
        if contract_id:
            contract = get_object_or_404(Contract, id=contract_id)
        else:
            from rest_framework.exceptions import ValidationError

            raise ValidationError({"contract_id": "contract_id is required."})
        milestone = create_milestone(contract, serializer.validated_data)
        return success_response(
            data=MilestoneSerializer(milestone).data,
            message="Milestone created successfully",
            status_code=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        milestone = self.get_object()
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return success_response(message="Only companies can edit milestones.", status_code=status.HTTP_403_FORBIDDEN)
        if milestone.contract.status not in {ContractStatus.DRAFT, ContractStatus.PENDING}:
            return success_response(message="Cannot edit milestones on an active or funded contract.", status_code=status.HTTP_400_BAD_REQUEST)
        serializer = MilestoneWriteSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        milestone = update_milestone(milestone, serializer.validated_data)
        return success_response(data=MilestoneSerializer(milestone).data, message="Milestone updated successfully")

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        milestone = self.get_object()
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return success_response(message="Only companies can delete milestones.", status_code=status.HTTP_403_FORBIDDEN)
        if milestone.contract.status not in {ContractStatus.DRAFT, ContractStatus.PENDING}:
            return success_response(message="Cannot delete milestones on an active or funded contract.", status_code=status.HTTP_400_BAD_REQUEST)
        milestone.delete()
        return success_response(message="Milestone deleted successfully")

    @action(detail=True, methods=["post"], url_path="release")
    def release_action(self, request, id=None):
        milestone = self.get_object()
        if request.user.role != UserRole.COMPANY and not request.user.is_superuser:
            return success_response(message="Only companies can release milestone funds.", status_code=status.HTTP_403_FORBIDDEN)

        serializer = MilestoneReleaseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        contract, milestone = release_milestone_payment(
            milestone,
            actor=request.user,
            transaction_hash=serializer.validated_data.get("transaction_hash", ""),
            reference=serializer.validated_data.get("reference", ""),
        )

        return success_response(
            data={
                "contract": ContractDetailSerializer(contract).data,
                "milestone": MilestoneSerializer(milestone).data,
            },
            message="Milestone payment released successfully",
        )
