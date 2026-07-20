from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from django.views.static import serve

from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="InternPay API",
        default_version="v1",
        description="AI-powered escrow verification API for InternPay",
        contact=openapi.Contact(email="support@internpay.local"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

spa_view = TemplateView.as_view(template_name="index.html")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("apps.common.urls")),
    path("api/", include("apps.users.urls")),
    path("api/", include("apps.companies.urls")),
    path("api/", include("apps.students.urls")),
    path("api/", include("apps.judges.urls")),
    path("api/", include("apps.contracts.urls")),
    path("api/", include("apps.milestones.urls")),
    path("api/", include("apps.submissions.urls")),
    path("api/", include("apps.ai_engine.urls")),
    path("api/", include("apps.disputes.urls")),
    path("api/", include("apps.notifications.urls")),
    path("v1/api/", include("apps.common.urls")),
    path("v1/api/", include("apps.users.urls")),
    path("v1/api/", include("apps.companies.urls")),
    path("v1/api/", include("apps.students.urls")),
    path("v1/api/", include("apps.judges.urls")),
    path("v1/api/", include("apps.contracts.urls")),
    path("v1/api/", include("apps.milestones.urls")),
    path("v1/api/", include("apps.submissions.urls")),
    path("v1/api/", include("apps.ai_engine.urls")),
    path("v1/api/", include("apps.disputes.urls")),
    path("v1/api/", include("apps.notifications.urls")),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="swagger-ui"),
    path("swagger.json", schema_view.without_ui(cache_timeout=0), name="swagger-json"),
    path("openapi.json", schema_view.without_ui(cache_timeout=0), name="openapi-json"),
    re_path(r"^(?P<path>[^/]+\.[^/]+)$", serve, {"document_root": settings.STATIC_ROOT}),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += [
    path("", spa_view, name="frontend-home"),
    re_path(
        r"^(?!api(?:/|$)|admin(?:/|$)|swagger(?:/|$)|openapi\.json$|swagger\.json$|static(?:/|$)|media(?:/|$)).*$",
        spa_view,
        name="frontend-route",
    ),
]
