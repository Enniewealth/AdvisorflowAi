from rest_framework import serializers

from .models import Reminder


class ReminderSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source="client.full_name", read_only=True)
    client_phone = serializers.CharField(source="client.phone_number", read_only=True)
    policy_type = serializers.CharField(source="client.policy_type", read_only=True)
    expiry_date = serializers.DateField(source="client.expiry_date", read_only=True)
    reminder_type_display = serializers.CharField(source="get_reminder_type_display", read_only=True)

    class Meta:
        model = Reminder
        fields = (
            "id",
            "client",
            "client_name",
            "client_phone",
            "policy_type",
            "expiry_date",
            "reminder_date",
            "reminder_type",
            "reminder_type_display",
            "message",
            "status",
            "sent_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "client_name",
            "client_phone",
            "policy_type",
            "expiry_date",
            "reminder_type",
            "reminder_type_display",
            "message",
            "sent_at",
            "created_at",
            "updated_at",
        )
