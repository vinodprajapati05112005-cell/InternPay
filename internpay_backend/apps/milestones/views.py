from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated

from apps.common.choices import UserRole
from apps.contracts.models import Contract
from apps.milestones.models import Milestone
from apps.milestones.permissions import IsMilestoneParticipantOrAdmin
from apps.milestones.serializers import MilestoneSerializer, MilestoneWriteSerializer
from apps.milestones.services import create_milestone, update_milestone
from internpay.utils.responses import success_response


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
        serializer = MilestoneWriteSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        milestone = update_milestone(milestone, serializer.validated_data)
        return success_response(data=MilestoneSerializer(milestone).data, message="Milestone updated successfully")

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        milestone = self.get_object()
        milestone.delete()
        return success_response(message="Milestone deleted successfully")
