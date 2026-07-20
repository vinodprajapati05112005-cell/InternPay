from rest_framework.routers import DefaultRouter

from apps.disputes.views import DisputeViewSet

router = DefaultRouter()
router.register(r"disputes", DisputeViewSet, basename="disputes")

urlpatterns = router.urls
