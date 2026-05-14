from datetime import date, timedelta

from clients.models import Client
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from reminders.models import Reminder
from reminders.services import sync_reminders_for_client
from rest_framework.test import APIClient


class PublicEndpointTests(TestCase):
    def test_root_endpoint_returns_service_metadata(self):
        response = self.client.get(reverse("api_root_public"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")
        self.assertEqual(response.json()["name"], "AdvisorFlow AI API")

    def test_health_endpoints_are_public(self):
        root_health = self.client.get(reverse("health_check"))
        api_health = self.client.get(reverse("api_health_check"))

        self.assertEqual(root_health.status_code, 200)
        self.assertEqual(api_health.status_code, 200)
        self.assertEqual(root_health.json(), {"status": "ok"})
        self.assertEqual(api_health.json(), {"status": "ok"})


class AuthenticatedDashboardTests(TestCase):
    def test_dashboard_returns_metrics_for_authenticated_advisor(self):
        advisor = get_user_model().objects.create_user(
            email="dashboard@example.com",
            password="AdvisorFlow@2026!",
            name="Dashboard Advisor",
        )
        client = Client.objects.create(
            advisor=advisor,
            full_name="Amina Yusuf",
            phone_number="08030000005",
            insurance_provider="AXA Mansard",
            policy_type="Motor insurance",
            expiry_date=date.today() + timedelta(days=5),
        )
        sync_reminders_for_client(client)
        api_client = APIClient()
        api_client.force_authenticate(user=advisor)

        response = api_client.get(reverse("dashboard"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["metrics"]["total_clients"], 1)
        self.assertEqual(payload["metrics"]["active_policies"], 1)
        self.assertEqual(payload["metrics"]["expiring_policies"], 1)
        self.assertGreaterEqual(payload["metrics"]["upcoming_renewals"], 1)
        self.assertIn("recent_activity", payload)

    def test_dashboard_is_protected(self):
        response = self.client.get(reverse("dashboard"))

        self.assertEqual(response.status_code, 401)

    def test_core_endpoints_are_scoped_to_authenticated_advisor(self):
        first_advisor = get_user_model().objects.create_user(
            email="first-dashboard@example.com",
            password="AdvisorFlow@2026!",
            name="First Advisor",
        )
        second_advisor = get_user_model().objects.create_user(
            email="second-dashboard@example.com",
            password="AdvisorFlow@2026!",
            name="Second Advisor",
        )
        Client.objects.create(
            advisor=second_advisor,
            full_name="Hidden Client",
            phone_number="08030000006",
            insurance_provider="Leadway",
            policy_type="Life insurance",
            expiry_date=date.today() + timedelta(days=20),
        )
        api_client = APIClient()
        api_client.force_authenticate(user=first_advisor)

        response = api_client.get(reverse("clients-list"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["results"], [])

    def test_reminder_manual_create_is_disabled_but_trigger_action_works(self):
        advisor = get_user_model().objects.create_user(
            email="reminder-dashboard@example.com",
            password="AdvisorFlow@2026!",
            name="Reminder Advisor",
        )
        client = Client.objects.create(
            advisor=advisor,
            full_name="Due Client",
            phone_number="08030000007",
            insurance_provider="NEM",
            policy_type="Health insurance",
            expiry_date=date.today(),
        )
        sync_reminders_for_client(client)
        api_client = APIClient()
        api_client.force_authenticate(user=advisor)

        create_response = api_client.post(
            reverse("reminders-list"),
            data={
                "client": client.id,
                "reminder_date": str(date.today()),
                "status": Reminder.Status.PENDING,
            },
            format="json",
        )
        trigger_response = api_client.post(reverse("reminders-trigger-due"))

        self.assertEqual(create_response.status_code, 405)
        self.assertEqual(trigger_response.status_code, 200)
