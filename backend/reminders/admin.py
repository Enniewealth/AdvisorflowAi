from django.contrib import admin

from .models import Reminder


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ("client", "advisor", "reminder_date", "reminder_type", "status", "sent_at")
    list_filter = ("status", "reminder_type", "reminder_date")
    search_fields = ("client__full_name", "advisor__email", "message")
