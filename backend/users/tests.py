from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse


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
