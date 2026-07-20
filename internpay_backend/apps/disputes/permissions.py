from rest_framework.permissions import BasePermission

from apps.common.choices import UserRole


class IsDisputePartyOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.role == UserRole.ADMIN:
            return True
        if obj.filed_by_id == user.id:
            return True
        if obj.contract.company.user_id == user.id:
            return True
        if obj.contract.student and obj.contract.student.user_id == user.id:
            return True
        if obj.assigned_judge and obj.assigned_judge.user_id == user.id:
            return True
        return False
