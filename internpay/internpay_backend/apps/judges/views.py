from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.judges.models import Judge
from apps.judges.permissions import IsJudgeUser
from apps.judges.serializers import JudgeDashboardSerializer, JudgeDecisionHistorySerializer, JudgeSerializer
from apps.judges.services import get_decision_history, get_judge_dashboard, update_judge_profile
from internpay.utils.responses import success_response


class JudgeProfileAPIView(APIView):
    permission_classes = [IsAuthenticated, IsJudgeUser]

    def get_judge(self, request):
        return get_object_or_404(Judge, user=request.user)

    def get(self, request):
        return success_response(
            data=JudgeSerializer(self.get_judge(request)).data,
            message="Judge profile retrieved successfully",
        )

    def patch(self, request):
        judge = self.get_judge(request)
        serializer = JudgeSerializer(judge, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        judge = update_judge_profile(judge, serializer.validated_data)
        return success_response(
            data=JudgeSerializer(judge).data,
            message="Judge profile updated successfully",
        )

    def put(self, request):
        return self.patch(request)


class JudgeDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated, IsJudgeUser]

    def get(self, request):
        judge = get_object_or_404(Judge, user=request.user)
        payload = JudgeDashboardSerializer(get_judge_dashboard(judge)).data
        return success_response(
            data=payload,
            message="Judge dashboard retrieved successfully",
        )


class JudgeDecisionHistoryAPIView(APIView):
    permission_classes = [IsAuthenticated, IsJudgeUser]

    def get(self, request):
        judge = get_object_or_404(Judge, user=request.user)
        payload = JudgeDecisionHistorySerializer(get_decision_history(judge), many=True).data
        return success_response(
            data=payload,
            message="Judge decision history retrieved successfully",
        )
