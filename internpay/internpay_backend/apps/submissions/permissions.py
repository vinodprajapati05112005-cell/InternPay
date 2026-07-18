from rest_framework.permissions import BasePermission

from apps.common.choices import UserRole


class IsSubmissionPartyOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.role == UserRole.ADMIN:
            return True
        if obj.student.user_id == user.id:
            return True
        if obj.contract.company.user_id == user.id:
            return True
        if obj.contract.judge and obj.contract.judge.user_id == user.id:
            return True
        return False
