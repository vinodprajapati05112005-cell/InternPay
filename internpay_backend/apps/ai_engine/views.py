from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.common.choices import UserRole
from apps.ai_engine.serializers import AIReevaluateSerializer
from apps.ai_engine.services import evaluate_submission_with_ai
from apps.submissions.models import Submission
from apps.submissions.serializers import AIReportSerializer
from internpay.utils.responses import success_response


class AIHealthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return success_response(
            data={"status": "ready"},
            message="AI engine is ready",
        )


class ReevaluateSubmissionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, submission_id):
        serializer = AIReevaluateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = get_object_or_404(Submission, id=submission_id)
        if not (
            request.user.is_superuser
            or request.user.role == UserRole.ADMIN
            or submission.student.user_id == request.user.id
            or submission.contract.company.user_id == request.user.id
            or (submission.contract.judge and submission.contract.judge.user_id == request.user.id)
        ):
            return success_response(message="You are not allowed to evaluate this submission", status_code=403)
        report = evaluate_submission_with_ai(submission=submission, request=request, force=serializer.validated_data["force"])
        return success_response(
            data=AIReportSerializer(report).data,
            message="Submission evaluated successfully",
        )
