from rest_framework.permissions import BasePermission

from apps.common.choices import UserRole


class IsStudentUser(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role == UserRole.STUDENT)
