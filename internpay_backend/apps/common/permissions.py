from __future__ import annotations

from rest_framework.permissions import BasePermission

from apps.common.choices import UserRole


class IsRole(BasePermission):
    allowed_roles: tuple[str, ...] = ()

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and (user.is_superuser or user.role in self.allowed_roles))


class IsAdminRole(IsRole):
    allowed_roles = (UserRole.ADMIN,)


class IsCompanyRole(IsRole):
    allowed_roles = (UserRole.COMPANY,)


class IsStudentRole(IsRole):
    allowed_roles = (UserRole.STUDENT,)


class IsJudgeRole(IsRole):
    allowed_roles = (UserRole.JUDGE,)


class IsCompanyOrAdmin(IsRole):
    allowed_roles = (UserRole.COMPANY, UserRole.ADMIN)


class IsStudentOrAdmin(IsRole):
    allowed_roles = (UserRole.STUDENT, UserRole.ADMIN)


class IsJudgeOrAdmin(IsRole):
    allowed_roles = (UserRole.JUDGE, UserRole.ADMIN)
