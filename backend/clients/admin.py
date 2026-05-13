from django.contrib import admin

from .models import Client


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("full_name", "advisor", "insurance_provider", "policy_type", "expiry_date", "is_active")
    list_filter = ("insurance_provider", "policy_type", "is_active", "expiry_date")
    search_fields = ("full_name", "phone_number", "email", "advisor__email")
