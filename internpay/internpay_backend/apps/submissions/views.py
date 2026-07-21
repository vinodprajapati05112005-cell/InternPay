from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.common.choices import UserRole
from apps.contracts.models import Contract
from apps.milestones.models import Milestone
from apps.submissions.models import Submission
from apps.submissions.permissions import IsSubmissionPartyOrAdmin
from apps.submissions.serializers import (
    AIReportSerializer,
    SubmissionCreateSerializer,
    SubmissionDetailSerializer,
    SubmissionListSerializer,
    SubmissionUpdateSerializer,
)
from apps.submissions.services import create_submission, delete_submission, get_submission_report, update_submission
from apps.students.models import Student
from internpay.utils.responses import success_response


class SubmissionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Submission.objects.select_related("contract", "milestone", "student").prefetch_related("files")
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if user.is_superuser or user.role == UserRole.ADMIN:
            return qs
        if user.role == UserRole.STUDENT:
            return qs.filter(student__user=user)
        if user.role == UserRole.COMPANY:
            return qs.filter(contract__company__user=user)
        if user.role == UserRole.JUDGE:
            from django.db.models import Q
            return qs.filter(
                Q(contract__judge__user=user) |
                Q(dispute__assigned_judge__user=user) |
                Q(contract__disputes__assigned_judge__user=user)
            ).distinct()
        return qs.none()

    def list(self, request, *args, **kwargs):
        serializer = SubmissionListSerializer(self.get_queryset(), many=True)
        return success_response(data=serializer.data, message="Submissions retrieved successfully")

    def retrieve(self, request, *args, **kwargs):
        serializer = SubmissionDetailSerializer(self.get_object())
        return success_response(data=serializer.data, message="Submission retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = SubmissionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = get_object_or_404(Student, user=request.user)
        submission = create_submission(student=student, validated_data=serializer.validated_data, request=request)
        return success_response(
            data=SubmissionDetailSerializer(submission).data,
            message="Submission created successfully",
            status_code=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        submission = self.get_object()
        serializer = SubmissionUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = update_submission(submission=submission, validated_data=serializer.validated_data, request=request)
        return success_response(
            data=SubmissionDetailSerializer(submission).data,
            message="Submission updated successfully",
        )

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        submission = self.get_object()
        delete_submission(submission)
        return success_response(message="Submission deleted successfully")

    @action(detail=True, methods=["get"], url_path="report")
    def report(self, request, id=None):
        submission = self.get_object()
        report = get_submission_report(submission)
        if report is None:
            return success_response(data={}, message="Report is not available yet", status_code=status.HTTP_202_ACCEPTED)
        return success_response(
            data=AIReportSerializer(report).data,
            message="AI report retrieved successfully",
        )
