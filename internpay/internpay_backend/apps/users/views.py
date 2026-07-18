from __future__ import annotations

from django.contrib.auth import logout as django_logout
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from apps.users.models import User
from apps.users.serializers import (
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    LogoutSerializer,
    PermissionsSerializer,
    ProfileSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    TokenRefreshSerializer,
)
from apps.users.services import (
    authenticate_and_issue_tokens,
    build_user_payload,
    change_password,
    create_user_account,
    reset_password,
    role_permissions,
    revoke_refresh_token,
    send_password_reset_email,
    verify_email,
    verify_refresh_token_is_active,
)
from internpay.utils.responses import success_response


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, tokens, _ = create_user_account(validated_data=serializer.validated_data, request=request)
        return success_response(
            data={
                "user": build_user_payload(user),
                "tokens": tokens,
            },
            message="Account created successfully",
            status_code=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        tokens = authenticate_and_issue_tokens(user, request=request)
        return success_response(
            data={
                "user": build_user_payload(user),
                "tokens": tokens,
            },
            message="Login successful",
        )


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        revoke_refresh_token(serializer.validated_data["refresh_token"], request=request)
        django_logout(request)
        return success_response(message="Logged out successfully")


class RefreshTokenAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = verify_refresh_token_is_active(serializer.validated_data["refresh_token"])
        revoke_refresh_token(serializer.validated_data["refresh_token"], request=request)
        tokens = authenticate_and_issue_tokens(user, request=request)
        return success_response(
            data=tokens,
            message="Token refreshed successfully",
        )


class ForgotPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(email__iexact=serializer.validated_data["email"]).first()
        if user:
            send_password_reset_email(user)
        return success_response(message="If the email exists, reset instructions have been sent.")


class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = reset_password(
            serializer.validated_data["uid"],
            serializer.validated_data["token"],
            serializer.validated_data["new_password"],
        )
        return success_response(
            data={"user_id": str(user.id)},
            message="Password reset successfully",
        )


class VerifyEmailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        user = verify_email(uidb64, token)
        return success_response(
            data={"email": user.email, "verified": True},
            message="Email verified successfully",
        )


class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = change_password(
            request.user,
            serializer.validated_data["current_password"],
            serializer.validated_data["new_password"],
        )
        return success_response(
            data={"user_id": str(user.id)},
            message="Password changed successfully",
        )


class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return success_response(
            data=ProfileSerializer(request.user).data,
            message="Profile retrieved successfully",
        )

    def patch(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return success_response(
            data=ProfileSerializer(user).data,
            message="Profile updated successfully",
        )

    def put(self, request):
        return self.patch(request)


class PermissionsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payload = PermissionsSerializer(
            {
                "role": request.user.role,
                "permissions": role_permissions(request.user.role),
            }
        ).data
        return success_response(
            data=payload,
            message="Permissions retrieved successfully",
        )
