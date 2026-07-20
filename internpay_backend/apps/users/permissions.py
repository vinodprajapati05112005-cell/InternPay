from rest_framework.permissions import BasePermission

from apps.common.choices import UserRole


class IsSelfOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser or user.role == UserRole.ADMIN:
            return True
        return getattr(obj, "id", None) == getattr(user, "id", None)
