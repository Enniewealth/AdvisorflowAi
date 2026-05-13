from django.conf import settings
from django.db import models


class Reminder(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Sent"
        DISMISSED = "dismissed", "Dismissed"

    class ReminderType(models.TextChoices):
        BEFORE_EXPIRY = "before_expiry", "7 days before expiry"
        ON_EXPIRY = "on_expiry", "On expiry date"
        AFTER_EXPIRY = "after_expiry", "After expiry"

    advisor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reminders"
    )
    client = models.ForeignKey("clients.Client", on_delete=models.CASCADE, related_name="reminders")
    reminder_date = models.DateField(db_index=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    reminder_type = models.CharField(max_length=30, choices=ReminderType.choices)
    message = models.CharField(max_length=255)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("reminder_date", "client__full_name")
        constraints = [
            models.UniqueConstraint(
                fields=["client", "reminder_type"],
                name="unique_client_reminder_type",
            )
        ]
        indexes = [
            models.Index(fields=["advisor", "reminder_date", "status"]),
        ]

    def __str__(self):
        return f"{self.client.full_name} - {self.get_reminder_type_display()}"
