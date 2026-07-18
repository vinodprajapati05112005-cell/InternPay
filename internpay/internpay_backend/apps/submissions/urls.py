from rest_framework.routers import DefaultRouter

from apps.submissions.views import SubmissionViewSet

router = DefaultRouter()
router.register(r"submissions", SubmissionViewSet, basename="submissions")

urlpatterns = router.urls
