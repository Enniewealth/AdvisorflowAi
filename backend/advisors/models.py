from django.conf import settings
from django.db import models


class Activity(models.Model):
    class Action(models.TextChoices):
        CLIENT_CREATED = "client_created", "Client created"
        CLIENT_UPDATED = "client_updated", "Client updated"
        CLIENT_DELETED = "client_deleted", "Client deleted"
        RENEWAL_ADDED = "renewal_added", "Renewal added"
        REMINDER_TRIGGERED = "reminder_triggered", "Reminder triggered"

    advisor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="activities"
    )
    action = models.CharField(max_length=40, choices=Action.choices)
    message = models.CharField(max_length=255)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name_plural = "activities"

    def __str__(self):
        return self.message
