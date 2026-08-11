from __future__ import annotations

from datetime import datetime, timezone as dt_timezone

from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken as JWTRefreshToken

from apps.common.choices import UserRole
from apps.common.services import create_notification, run_after_commit, send_email
from apps.users.models import RefreshToken, User
from internpay.utils.email import frontend_link
from internpay.utils.security import get_client_ip, hash_token


def _profile_model_for_role(role: str):
    if role == UserRole.COMPANY:
        from apps.companies.models import Company

        return Company
    if role == UserRole.STUDENT:
        from apps.students.models import Student

        return Student
    if role == UserRole.JUDGE:
        from apps.judges.models import Judge

        return Judge
    return None


def _profile_defaults(role: str, user: User, profile_data: dict) -> dict:
    if role == UserRole.COMPANY:
        return {
            "company_name": profile_data.get("company_name") or user.get_full_name() or user.email,
            "company_website": profile_data.get("company_website", ""),
            "company_registration_number": profile_data.get("company_registration_number", ""),
            "company_industry": profile_data.get("company_industry", ""),
            "company_address": profile_data.get("company_address", ""),
        }
    if role == UserRole.STUDENT:
        return {
            "institution_name": profile_data.get("institution_name") or "",
            "course_name": profile_data.get("course_name", ""),
            "graduation_year": profile_data.get("graduation_year"),
            "portfolio_url": profile_data.get("portfolio_url", ""),
            "skills": profile_data.get("skills", []),
            "bio": profile_data.get("bio", ""),
        }
    if role == UserRole.JUDGE:
        return {
            "judge_display_name": profile_data.get("judge_display_name") or user.get_full_name() or user.email,
            "specialization": profile_data.get("specialization", ""),
            "years_experience": profile_data.get("years_experience"),
            "license_number": profile_data.get("license_number", ""),
            "bio": profile_data.get("bio", ""),
        }
    return {}


def build_user_payload(user: User) -> dict:
    from apps.users.serializers import ProfileSerializer

    return ProfileSerializer(user).data


@transaction.atomic
def create_user_account(*, validated_data: dict, request=None) -> tuple[User, dict, dict]:
    profile_keys = [
        "company_name",
        "company_website",
        "company_registration_number",
        "company_industry",
        "company_address",
        "institution_name",
        "course_name",
        "graduation_year",
        "portfolio_url",
        "skills",
        "bio",
        "judge_display_name",
        "specialization",
        "years_experience",
        "license_number",
    ]
    profile_data = validated_data.pop("profile_data", {})
    for key in profile_keys:
        if key in validated_data:
            profile_data[key] = validated_data.pop(key)
    password = validated_data.pop("password")
    validated_data.pop("password_confirm", None)
    user = User.objects.create_user(password=password, **validated_data)

    profile_model = _profile_model_for_role(user.role)
    if profile_model is not None:
        profile_defaults = _profile_defaults(user.role, user, profile_data)
        profile, _ = profile_model.objects.get_or_create(user=user, defaults=profile_defaults)
        for field, value in profile_defaults.items():
            setattr(profile, field, value)
        profile.save()

    tokens = issue_tokens_for_user(user, request=request)
    run_after_commit(lambda: send_verification_email(user), label="verification email")
    run_after_commit(
        lambda: create_notification(
            user=user,
            title="Welcome to InternPay",
            message="Your account has been created. Please verify your email to continue.",
            notification_type="EMAIL_VERIFICATION",
            channel="BOTH",
            payload={"role": user.role},
            target_url=frontend_link("/auth/login"),
        ),
        label="welcome notification",
    )
    return user, tokens, profile_data


def issue_tokens_for_user(user: User, request=None) -> dict:
    refresh = JWTRefreshToken.for_user(user)
    refresh_token = str(refresh)
    access_token = str(refresh.access_token)
    RefreshToken.objects.create(
        user=user,
        jti=str(refresh["jti"]),
        token_hash=hash_token(refresh_token),
        device_name=((request.headers.get("User-Agent", "") if request else "") or "")[:255],
        ip_address=get_client_ip(request) if request else None,
        expires_at=datetime.fromtimestamp(int(refresh["exp"]), tz=dt_timezone.utc),
    )
    return {
        "access": access_token,
        "refresh": refresh_token,
    }


def authenticate_and_issue_tokens(user: User, request=None) -> dict:
    return issue_tokens_for_user(user, request=request)


def revoke_refresh_token(refresh_token: str, request=None) -> None:
    try:
        token = JWTRefreshToken(refresh_token)
    except Exception as exc:
        raise ValidationError("Invalid refresh token.") from exc

    record = RefreshToken.objects.filter(jti=str(token["jti"])).first()
    if record is None:
        return
    record.revoked_at = timezone.now()
    record.save(update_fields=["revoked_at", "updated_at"])


def verify_refresh_token_is_active(refresh_token: str) -> User:
    try:
        token = JWTRefreshToken(refresh_token)
    except Exception as exc:
        raise ValidationError("Invalid refresh token.") from exc

    record = RefreshToken.objects.filter(jti=str(token["jti"])).first()
    if record is None or record.is_revoked:
        raise ValidationError("Refresh token is no longer active.")
    record.last_used_at = timezone.now()
    record.save(update_fields=["last_used_at", "updated_at"])
    user = User.objects.filter(id=token["user_id"], is_active=True).first()
    if user is None:
        raise ValidationError("User account not found.")
    return user


def send_verification_email(user: User):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    verify_url = frontend_link(f"/verify-email/{uid}/{token}")
    message = (
        f"Hello {user.get_full_name() or user.email},\n\n"
        f"Verify your email for InternPay: {verify_url}\n\n"
        "If you did not create this account, you can ignore this message."
    )
    send_email(
        subject="Verify your InternPay email",
        message=message,
        recipients=[user.email],
    )
    return token


def send_password_reset_email(user: User):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    reset_url = frontend_link(f"/reset-password/{uid}/{token}")
    message = (
        f"Hello {user.get_full_name() or user.email},\n\n"
        f"Reset your InternPay password: {reset_url}\n\n"
        "If you did not request a reset, ignore this email."
    )
    send_email(
        subject="Reset your InternPay password",
        message=message,
        recipients=[user.email],
    )
    create_notification(
        user=user,
        title="Password reset requested",
        message="We sent instructions to reset your password.",
        notification_type="PASSWORD_RESET",
        channel="EMAIL",
    )
    return token


def verify_email(uid: str, token: str) -> User:
    user_id = force_str(urlsafe_base64_decode(uid))
    user = User.objects.filter(pk=user_id).first()
    if user is None:
        raise ValidationError("Invalid verification link.")
    if not default_token_generator.check_token(user, token):
        raise ValidationError("Verification link is invalid or expired.")
    if not user.is_email_verified:
        user.is_email_verified = True
        user.save(update_fields=["is_email_verified", "updated_at"])
    return user


def reset_password(uid: str, token: str, new_password: str) -> User:
    user_id = force_str(urlsafe_base64_decode(uid))
    user = User.objects.filter(pk=user_id).first()
    if user is None:
        raise ValidationError("Invalid reset link.")
    if not default_token_generator.check_token(user, token):
        raise ValidationError("Reset link is invalid or expired.")
    user.set_password(new_password)
    user.save(update_fields=["password", "updated_at"])
    return user


def change_password(user: User, current_password: str, new_password: str) -> User:
    if not user.check_password(current_password):
        raise ValidationError("Current password is incorrect.")
    user.set_password(new_password)
    user.save(update_fields=["password", "updated_at"])
    return user


def update_profile(user: User, data: dict) -> User:
    for field in ["first_name", "last_name", "phone_number", "avatar", "wallet_address"]:
        if field in data:
            setattr(user, field, data[field])
    user.save()


    profile_model = _profile_model_for_role(user.role)
    if profile_model is None:
        return user

    profile = profile_model.objects.filter(user=user).first()
    if profile is None:
        profile = profile_model.objects.create(user=user)

    profile_fields = {
        UserRole.COMPANY: ["company_name", "company_website", "company_registration_number", "company_industry", "company_address"],
        UserRole.STUDENT: ["institution_name", "course_name", "graduation_year", "portfolio_url", "skills", "bio"],
        UserRole.JUDGE: ["judge_display_name", "specialization", "years_experience", "license_number", "bio"],
    }.get(user.role, [])

    for field in profile_fields:
        if field in data:
            setattr(profile, field, data[field])
    profile.save()
    return user


def role_permissions(role: str) -> list[str]:
    mapping = {
        UserRole.ADMIN: [
            "manage_users",
            "manage_companies",
            "manage_students",
            "manage_judges",
            "manage_contracts",
            "manage_disputes",
        ],
        UserRole.COMPANY: [
            "create_contracts",
            "update_contracts",
            "assign_students",
            "fund_contracts",
            "create_disputes",
            "view_reports",
        ],
        UserRole.STUDENT: [
            "view_assigned_contracts",
            "submit_work",
            "update_submission",
            "view_reports",
        ],
        UserRole.JUDGE: [
            "view_assigned_disputes",
            "resolve_disputes",
            "view_decision_history",
        ],
    }
    return mapping.get(role, [])
