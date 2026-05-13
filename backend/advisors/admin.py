from django.contrib import admin

from .models import Activity


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("advisor", "action", "message", "created_at")
    list_filter = ("action", "created_at")
    search_fields = ("advisor__email", "message")
