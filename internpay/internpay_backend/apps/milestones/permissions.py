from rest_framework.permissions import BasePermission

from apps.common.choices import UserRole


class IsMilestoneParticipantOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.role == UserRole.ADMIN:
            return True
        contract = obj.contract
        if user.role == UserRole.COMPANY and contract.company.user_id == user.id:
            return True
        if user.role == UserRole.STUDENT and contract.student and contract.student.user_id == user.id:
            return True
        if user.role == UserRole.JUDGE and contract.judge and contract.judge.user_id == user.id:
            return True
        return False
