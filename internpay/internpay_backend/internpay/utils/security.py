from __future__ import annotations

import hashlib
import hmac
from typing import Any

from django.utils.crypto import get_random_string


def hash_token(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def safe_compare_token(raw_value: str, hashed_value: str) -> bool:
    return hmac.compare_digest(hash_token(raw_value), hashed_value)


def generate_reference(prefix: str) -> str:
    return f"{prefix}_{get_random_string(16).lower()}"


def get_client_ip(request: Any) -> str | None:
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")
