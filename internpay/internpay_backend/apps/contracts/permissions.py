from rest_framework.permissions import BasePermission

from apps.common.choices import UserRole


class IsCompanyOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return bool(user and user.is_authenticated and (user.role == UserRole.ADMIN or obj.company.user_id == user.id))


class IsContractPartyOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.role == UserRole.ADMIN:
            return True
        if obj.company.user_id == user.id:
            return True
        if obj.student and obj.student.user_id == user.id:
            return True
        if obj.judge and obj.judge.user_id == user.id:
            return True
        return False
