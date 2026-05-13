from clients.views import ClientViewSet
from django.urls import include, path
from education.views import EducationContentViewSet
from reminders.views import ReminderViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import (
    LoginView,
    LogoutView,
    MeView,
    PasswordResetConfirmView,
    PasswordResetView,
    RegisterView,
)

from .views import DashboardView, HealthCheckView


router = DefaultRouter()
router.register("clients", ClientViewSet, basename="clients")
router.register("reminders", ReminderViewSet, basename="reminders")
router.register("education", EducationContentViewSet, basename="education")

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="api_health_check"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", MeView.as_view(), name="me"),
    path("auth/password-reset/", PasswordResetView.as_view(), name="password_reset"),
    path(
        "auth/password-reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("", include(router.urls)),
]
