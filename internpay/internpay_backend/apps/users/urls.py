from django.urls import path

from apps.users.views import (
    ChangePasswordAPIView,
    ForgotPasswordAPIView,
    LoginAPIView,
    LogoutAPIView,
    PermissionsAPIView,
    ProfileAPIView,
    RegisterAPIView,
    RefreshTokenAPIView,
    ResetPasswordAPIView,
    VerifyEmailAPIView,
)

urlpatterns = [
    path("auth/register/", RegisterAPIView.as_view(), name="register"),
    path("auth/login/", LoginAPIView.as_view(), name="login"),
    path("auth/logout/", LogoutAPIView.as_view(), name="logout"),
    path("auth/refresh/", RefreshTokenAPIView.as_view(), name="refresh"),
    path("auth/forgot-password/", ForgotPasswordAPIView.as_view(), name="forgot-password"),
    path("auth/reset-password/", ResetPasswordAPIView.as_view(), name="reset-password"),
    path("auth/verify-email/<str:uidb64>/<str:token>/", VerifyEmailAPIView.as_view(), name="verify-email"),
    path("auth/change-password/", ChangePasswordAPIView.as_view(), name="change-password"),
    path("auth/profile/", ProfileAPIView.as_view(), name="profile"),
    path("auth/permissions/", PermissionsAPIView.as_view(), name="permissions"),
]
