from django.urls import path

from apps.ai_engine.views import AIHealthAPIView, ReevaluateSubmissionAPIView

urlpatterns = [
    path("ai/health/", AIHealthAPIView.as_view(), name="ai-health"),
    path("ai/submissions/<uuid:submission_id>/evaluate/", ReevaluateSubmissionAPIView.as_view(), name="ai-evaluate-submission"),
]
