from api.views import HealthCheckView, PublicApiRootView
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("", PublicApiRootView.as_view(), name="api_root_public"),
    path("healthz/", HealthCheckView.as_view(), name="health_check"),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
]
