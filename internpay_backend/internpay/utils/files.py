from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from django.utils.text import slugify


def _build_upload_path(folder: str, filename: str) -> str:
    path = Path(filename)
    stem = slugify(path.stem) or "file"
    suffix = path.suffix.lower()
    return f"uploads/{folder}/{stem}-{uuid4().hex}{suffix}"


def avatar_upload_path(instance, filename: str) -> str:
    return _build_upload_path("avatars", filename)


def submission_upload_path(instance, filename: str) -> str:
    return _build_upload_path("submissions", filename)


def dispute_upload_path(instance, filename: str) -> str:
    return _build_upload_path("disputes", filename)
