from __future__ import annotations

from rest_framework import exceptions, status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


def _error_message(exc: Exception) -> str:
    if isinstance(exc, exceptions.NotAuthenticated):
        return "Authentication required"
    if isinstance(exc, exceptions.AuthenticationFailed):
        return "Invalid authentication credentials"
    if isinstance(exc, exceptions.PermissionDenied):
        return "You do not have permission to perform this action"
    if isinstance(exc, exceptions.NotFound):
        return "Resource not found"
    if isinstance(exc, exceptions.ValidationError):
        return "Validation failed"
    return "Request failed"


def exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    if response is None:
        return Response(
            {
                "success": False,
                "message": "Server error",
                "errors": {"detail": "An unexpected error occurred."},
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    message = _error_message(exc)
    response.data = {
        "success": False,
        "message": message,
        "errors": response.data,
    }
    return response
