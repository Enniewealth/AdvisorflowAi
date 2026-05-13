from rest_framework import serializers

from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    action_display = serializers.CharField(source="get_action_display", read_only=True)

    class Meta:
        model = Activity
        fields = ("id", "action", "action_display", "message", "metadata", "created_at")
        read_only_fields = fields
