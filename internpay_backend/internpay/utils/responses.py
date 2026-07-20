from rest_framework import status
from rest_framework.response import Response


def success_response(data=None, message="Success", status_code=status.HTTP_200_OK, headers=None):
    payload = {
        "success": True,
        "message": message,
        "data": data if data is not None else {},
    }
    return Response(payload, status=status_code, headers=headers)


def error_response(message="Request failed", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    payload = {
        "success": False,
        "message": message,
    }
    if errors is not None:
        payload["errors"] = errors
    return Response(payload, status=status_code)
