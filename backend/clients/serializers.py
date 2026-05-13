from django.utils import timezone
from rest_framework import serializers

from .models import Client


class ClientSerializer(serializers.ModelSerializer):
    days_until_expiry = serializers.SerializerMethodField()
    renewal_status = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = (
            "id",
            "full_name",
            "phone_number",
            "email",
            "insurance_provider",
            "policy_type",
            "policy_start_date",
            "expiry_date",
            "notes",
            "is_active",
            "days_until_expiry",
            "renewal_status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "days_until_expiry", "renewal_status", "created_at", "updated_at")

    def get_days_until_expiry(self, obj):
        return (obj.expiry_date - timezone.localdate()).days

    def get_renewal_status(self, obj):
        days = self.get_days_until_expiry(obj)
        if days < 0:
            return "expired"
        if days == 0:
            return "due_today"
        if days <= 7:
            return "expiring_soon"
        return "active"
