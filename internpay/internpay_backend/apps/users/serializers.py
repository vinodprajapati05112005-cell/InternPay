from __future__ import annotations

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from apps.common.choices import UserRole
from apps.common.validators import validate_password_strength
from apps.users.models import User


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    password_confirm = serializers.CharField(write_only=True, trim_whitespace=False)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    phone_number = serializers.CharField(max_length=30, required=False, allow_blank=True)
    wallet_address = serializers.CharField(max_length=42, required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=UserRole.choices)

    def validate_wallet_address(self, value):
        if value:
            from apps.common.validators import validate_wallet_address
            from django.core.exceptions import ValidationError as DjangoValidationError
            try:
                validate_wallet_address(value)
            except DjangoValidationError as e:
                raise serializers.ValidationError(e.message)
        return value


    company_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    company_website = serializers.URLField(required=False, allow_blank=True)
    company_registration_number = serializers.CharField(max_length=100, required=False, allow_blank=True)
    company_industry = serializers.CharField(max_length=150, required=False, allow_blank=True)
    company_address = serializers.CharField(max_length=255, required=False, allow_blank=True)

    institution_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    course_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    graduation_year = serializers.IntegerField(required=False, allow_null=True)
    portfolio_url = serializers.URLField(required=False, allow_blank=True)
    skills = serializers.ListField(child=serializers.CharField(max_length=100), required=False)
    bio = serializers.CharField(required=False, allow_blank=True)

    judge_display_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    specialization = serializers.CharField(max_length=255, required=False, allow_blank=True)
    years_experience = serializers.IntegerField(required=False, allow_null=True)
    license_number = serializers.CharField(max_length=100, required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_password(self, value):
        validate_password_strength(value)
        validate_password(value)
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})

        role = attrs["role"]
        if role == UserRole.COMPANY and not attrs.get("company_name"):
            raise serializers.ValidationError({"company_name": "Company name is required for company accounts."})
        if role == UserRole.STUDENT and not attrs.get("institution_name"):
            raise serializers.ValidationError({"institution_name": "Institution name is required for student accounts."})
        if role == UserRole.JUDGE and not attrs.get("judge_display_name"):
            raise serializers.ValidationError({"judge_display_name": "Display name is required for judge accounts."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm", None)
        password = validated_data.pop("password")
        profile_data = {
            key: validated_data.pop(key, None)
            for key in [
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
        }
        user = User.objects.create_user(password=password, **validated_data)
        return {"user": user, "profile_data": profile_data}


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        user = authenticate(
            request=self.context.get("request"),
            username=attrs["email"],
            password=attrs["password"],
        )
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is disabled.")
        attrs["user"] = user
        return attrs


class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()


class TokenRefreshSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password_confirm = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password_confirm"]:
            raise serializers.ValidationError({"new_password_confirm": "Passwords do not match."})
        validate_password_strength(attrs["new_password"])
        validate_password(attrs["new_password"])
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password_confirm = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password_confirm"]:
            raise serializers.ValidationError({"new_password_confirm": "Passwords do not match."})
        validate_password_strength(attrs["new_password"])
        validate_password(attrs["new_password"])
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    company_name = serializers.CharField(required=False, allow_blank=True)
    company_website = serializers.URLField(required=False, allow_blank=True)
    company_registration_number = serializers.CharField(required=False, allow_blank=True)
    company_industry = serializers.CharField(required=False, allow_blank=True)
    company_address = serializers.CharField(required=False, allow_blank=True)
    institution_name = serializers.CharField(required=False, allow_blank=True)
    course_name = serializers.CharField(required=False, allow_blank=True)
    graduation_year = serializers.IntegerField(required=False, allow_null=True)
    portfolio_url = serializers.URLField(required=False, allow_blank=True)
    skills = serializers.ListField(child=serializers.CharField(max_length=100), required=False)
    bio = serializers.CharField(required=False, allow_blank=True)
    judge_display_name = serializers.CharField(required=False, allow_blank=True)
    specialization = serializers.CharField(required=False, allow_blank=True)
    years_experience = serializers.IntegerField(required=False, allow_null=True)
    license_number = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "wallet_address",
            "avatar",
            "role",
            "is_email_verified",
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
            "profile",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "email", "role", "is_email_verified", "created_at", "updated_at", "profile"]

    def get_profile(self, obj):
        try:
            if obj.role == UserRole.COMPANY:
                profile = obj.company_profile
                return {
                    "id": str(profile.id),
                    "company_name": profile.company_name,
                    "company_website": profile.company_website,
                    "company_registration_number": profile.company_registration_number,
                    "company_industry": profile.company_industry,
                    "company_address": profile.company_address,
                    "verification_status": profile.verification_status,
                }
            if obj.role == UserRole.STUDENT:
                profile = obj.student_profile
                return {
                    "id": str(profile.id),
                    "institution_name": profile.institution_name,
                    "course_name": profile.course_name,
                    "graduation_year": profile.graduation_year,
                    "portfolio_url": profile.portfolio_url,
                    "skills": profile.skills,
                    "bio": profile.bio,
                    "verification_status": profile.verification_status,
                }
            if obj.role == UserRole.JUDGE:
                profile = obj.judge_profile
                return {
                    "id": str(profile.id),
                    "judge_display_name": profile.judge_display_name,
                    "specialization": profile.specialization,
                    "years_experience": profile.years_experience,
                    "license_number": profile.license_number,
                    "bio": profile.bio,
                    "rating": profile.rating,
                    "verification_status": profile.verification_status,
                }
        except AttributeError:
            return {}
        return {}

    def update(self, instance, validated_data):
        profile_fields = {
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
        }
        from apps.users.services import update_profile

        update_profile(
            instance,
            {
                key: value
                for key, value in validated_data.items()
                if key in profile_fields or key in {"first_name", "last_name", "phone_number", "avatar", "wallet_address"}
            },
        )
        return instance



class PermissionsSerializer(serializers.Serializer):
    role = serializers.CharField()
    permissions = serializers.ListField(child=serializers.CharField())
