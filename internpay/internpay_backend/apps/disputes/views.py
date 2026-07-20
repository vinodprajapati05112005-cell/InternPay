from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.common.choices import UserRole
from apps.disputes.models import Dispute
from apps.disputes.permissions import IsDisputePartyOrAdmin
from apps.disputes.serializers import AuditLogSerializer, DisputeCreateSerializer, DisputeResolveSerializer, DisputeSerializer
from apps.disputes.services import create_dispute, get_assigned_disputes, get_completed_disputes, get_dispute_history, resolve_dispute
from apps.judges.models import Judge
from apps.submissions.models import Submission
from internpay.utils.responses import success_response


class DisputeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Dispute.objects.select_related("contract", "submission", "filed_by", "assigned_judge")
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if user.is_superuser or user.role == UserRole.ADMIN:
            return qs
        if user.role == UserRole.JUDGE:
            return qs.filter(assigned_judge__user=user)
        if user.role == UserRole.COMPANY:
            return qs.filter(contract__company__user=user)
        if user.role == UserRole.STUDENT:
            return qs.filter(contract__student__user=user)
        return qs.none()

    def list(self, request, *args, **kwargs):
        serializer = DisputeSerializer(self.get_queryset(), many=True)
        return success_response(data=serializer.data, message="Disputes retrieved successfully")

    def retrieve(self, request, *args, **kwargs):
        serializer = DisputeSerializer(self.get_object())
        return success_response(data=serializer.data, message="Dispute retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = DisputeCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dispute = create_dispute(filed_by=request.user, validated_data=serializer.validated_data, request=request)
        return success_response(
            data=DisputeSerializer(dispute).data,
            message="Dispute created successfully",
            status_code=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], url_path="resolve")
    def resolve(self, request, id=None):
        dispute = self.get_object()
        serializer = DisputeResolveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if not dispute.assigned_judge:
            return success_response(
                message="A judge must be assigned before resolution",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        if dispute.assigned_judge.user_id != request.user.id and not (request.user.is_superuser or request.user.role == UserRole.ADMIN):
            return success_response(
                message="You are not assigned to this dispute",
                status_code=status.HTTP_403_FORBIDDEN,
            )
        judge = dispute.assigned_judge
        dispute = resolve_dispute(dispute=dispute, judge=judge, validated_data=serializer.validated_data, request=request)
        return success_response(
            data=DisputeSerializer(dispute).data,
            message="Dispute resolved successfully",
        )

    @action(detail=False, methods=["get"], url_path="assigned")
    def assigned(self, request):
        judge = get_object_or_404(Judge, user=request.user)
        return success_response(
            data=get_assigned_disputes(judge),
            message="Assigned disputes retrieved successfully",
        )

    @action(detail=False, methods=["get"], url_path="completed")
    def completed(self, request):
        judge = get_object_or_404(Judge, user=request.user)
        return success_response(
            data=get_completed_disputes(judge),
            message="Completed disputes retrieved successfully",
        )

    @action(detail=False, methods=["get"], url_path="history")
    def history(self, request):
        judge = get_object_or_404(Judge, user=request.user)
        return success_response(
            data=get_dispute_history(judge),
            message="Decision history retrieved successfully",
        )
