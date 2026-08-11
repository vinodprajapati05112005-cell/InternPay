from __future__ import annotations

from rest_framework import exceptions, status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


def _extract_message(value) -> str:
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, list):
        for item in value:
            message = _extract_message(item)
            if message:
                return message
        return ""
    if isinstance(value, dict):
        for item in value.values():
            message = _extract_message(item)
            if message:
                return message
        return ""
    return str(value).strip() if value not in (None, "") else ""


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
        detail = getattr(exc, "detail", None)
        return _extract_message(detail) or "Validation failed"
    return "Request failed"


def exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    if response is None:
        import traceback
        print("UNHANDLED EXCEPTION IN VIEW:")
        traceback.print_exc()
        return Response(
            {
                "success": False,
                "message": "Server error",
                "errors": {"detail": "An unexpected error occurred."},
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    message = _error_message(exc)
    if isinstance(response.data, dict):
        detail = response.data.get("detail")
        if isinstance(detail, str) and detail.strip():
            message = detail.strip()
        elif message == "Validation failed":
            extracted = _extract_message(response.data)
            if extracted:
                message = extracted
    response.data = {
        "success": False,
        "message": message,
        "errors": response.data,
    }
    return response
