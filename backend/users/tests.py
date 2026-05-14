from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient


class RegistrationApiTests(TestCase):
    def test_advisor_can_register_with_valid_details(self):
        response = self.client.post(
            reverse("register"),
            data={
                "name": "Saheed Eniola",
                "email": "eniola@example.com",
                "agency_name": "Uniquenny",
                "password": "AdvisorFlow@2026!",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            get_user_model().objects.filter(email="eniola@example.com").exists()
        )

    def test_registration_returns_specific_password_errors(self):
        response = self.client.post(
            reverse("register"),
            data={
                "name": "Saheed Eniola",
                "email": "weak-password@example.com",
                "agency_name": "Uniquenny",
                "password": "password",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("password", response.json())

    def test_registration_rejects_duplicate_email_case_insensitively(self):
        get_user_model().objects.create_user(
            email="eniola@example.com",
            password="AdvisorFlow@2026!",
            name="Saheed Eniola",
        )

        response = self.client.post(
            reverse("register"),
            data={
                "name": "Saheed Eniola",
                "email": "ENIOLA@example.com",
                "agency_name": "Uniquenny",
                "password": "AdvisorFlow@2026!",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()["email"],
            ["An advisor account with this email already exists."],
        )

    def test_profile_update_rejects_duplicate_email(self):
        User = get_user_model()
        first_user = User.objects.create_user(
            email="first@example.com",
            password="AdvisorFlow@2026!",
            name="First Advisor",
        )
        User.objects.create_user(
            email="second@example.com",
            password="AdvisorFlow@2026!",
            name="Second Advisor",
        )
        api_client = APIClient()
        api_client.force_authenticate(user=first_user)

        response = api_client.patch(
            reverse("me"),
            data={"email": "SECOND@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()["email"],
            ["An advisor account with this email already exists."],
        )

    def test_login_accepts_case_insensitive_email(self):
        get_user_model().objects.create_user(
            email="advisor@example.com",
            password="AdvisorFlow@2026!",
            name="Advisor",
        )

        response = self.client.post(
            reverse("login"),
            data={
                "email": "ADVISOR@example.com",
                "password": "AdvisorFlow@2026!",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.json())
        self.assertIn("refresh", response.json())

    def test_login_returns_clear_message_for_missing_account(self):
        response = self.client.post(
            reverse("login"),
            data={
                "email": "missing@example.com",
                "password": "AdvisorFlow@2026!",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 401)
        self.assertIn("No advisor account was found", response.json()["detail"])
