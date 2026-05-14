from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from reminders.models import Reminder
from rest_framework.test import APIClient

from .models import Client


class ClientApiTests(TestCase):
    def test_client_create_accepts_blank_optional_policy_start_date(self):
        advisor = get_user_model().objects.create_user(
            email="client-api@example.com",
            password="AdvisorFlow@2026!",
            name="Client API Advisor",
        )
        api_client = APIClient()
        api_client.force_authenticate(user=advisor)

        response = api_client.post(
            reverse("clients-list"),
            data={
                "full_name": "Ifeoma Nwosu",
                "phone_number": "08030000004",
                "email": "",
                "insurance_provider": "Leadway",
                "policy_type": "Health insurance",
                "policy_start_date": None,
                "expiry_date": str(date.today() + timedelta(days=14)),
                "notes": "",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Client.objects.filter(advisor=advisor).count(), 1)
        self.assertEqual(Reminder.objects.filter(advisor=advisor).count(), 3)
