from django.test import TestCase
from django.urls import reverse


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
