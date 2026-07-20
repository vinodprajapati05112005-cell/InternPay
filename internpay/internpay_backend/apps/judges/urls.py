from django.urls import path

from apps.judges.views import JudgeDashboardAPIView, JudgeDecisionHistoryAPIView, JudgeProfileAPIView

urlpatterns = [
    path("judges/profile/", JudgeProfileAPIView.as_view(), name="judge-profile"),
    path("judges/dashboard/", JudgeDashboardAPIView.as_view(), name="judge-dashboard"),
    path("judges/decision-history/", JudgeDecisionHistoryAPIView.as_view(), name="judge-decision-history"),
]
