from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.students.models import Student
from apps.students.permissions import IsStudentUser
from apps.students.serializers import (
    StudentContractSummarySerializer,
    StudentDashboardSerializer,
    StudentPaymentSerializer,
    StudentSerializer,
)
from apps.students.services import get_student_contracts, get_student_dashboard, get_student_payments, update_student_profile
from internpay.utils.responses import success_response


class StudentProfileAPIView(APIView):
    permission_classes = [IsAuthenticated, IsStudentUser]

    def get_student(self, request):
        return get_object_or_404(Student, user=request.user)

    def get(self, request):
        return success_response(
            data=StudentSerializer(self.get_student(request)).data,
            message="Student profile retrieved successfully",
        )

    def patch(self, request):
        student = self.get_student(request)
        serializer = StudentSerializer(student, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        student = update_student_profile(student, serializer.validated_data)
        return success_response(
            data=StudentSerializer(student).data,
            message="Student profile updated successfully",
        )

    def put(self, request):
        return self.patch(request)


class StudentDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated, IsStudentUser]

    def get(self, request):
        student = get_object_or_404(Student, user=request.user)
        payload = StudentDashboardSerializer(get_student_dashboard(student)).data
        return success_response(
            data=payload,
            message="Student dashboard retrieved successfully",
        )


class StudentContractsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsStudentUser]

    def get(self, request):
        student = get_object_or_404(Student, user=request.user)
        payload = StudentContractSummarySerializer(get_student_contracts(student), many=True).data
        return success_response(
            data=payload,
            message="Student contracts retrieved successfully",
        )


class StudentPaymentsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsStudentUser]

    def get(self, request):
        student = get_object_or_404(Student, user=request.user)
        payload = StudentPaymentSerializer(get_student_payments(student), many=True).data
        return success_response(
            data=payload,
            message="Student payment status retrieved successfully",
        )
