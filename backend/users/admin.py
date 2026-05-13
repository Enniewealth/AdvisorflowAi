from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class AdvisorUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("AdvisorFlow", {"fields": ("name", "role", "agency_name", "subscription_status")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("AdvisorFlow", {"fields": ("name", "email", "role", "agency_name")}),
    )
    list_display = ("email", "name", "agency_name", "role", "subscription_status", "is_staff")
    search_fields = ("email", "name", "agency_name")
    ordering = ("email",)
