from __future__ import annotations

from rest_framework import serializers


class AIReevaluateSerializer(serializers.Serializer):
    force = serializers.BooleanField(required=False, default=False)
