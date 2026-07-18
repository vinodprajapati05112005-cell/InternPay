from rest_framework.routers import DefaultRouter

from apps.milestones.views import MilestoneViewSet

router = DefaultRouter()
router.register(r"milestones", MilestoneViewSet, basename="milestones")

urlpatterns = router.urls
