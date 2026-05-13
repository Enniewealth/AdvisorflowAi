from django.conf import settings
from django.db import models


class Client(models.Model):
    advisor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="clients"
    )
    full_name = models.CharField(max_length=180)
    phone_number = models.CharField(max_length=40)
    email = models.EmailField(blank=True)
    insurance_provider = models.CharField(max_length=160)
    policy_type = models.CharField(max_length=120)
    policy_start_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(db_index=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("expiry_date", "full_name")
        indexes = [
            models.Index(fields=["advisor", "expiry_date"]),
            models.Index(fields=["advisor", "is_active"]),
        ]

    def __str__(self):
        return f"{self.full_name} - {self.policy_type}"
