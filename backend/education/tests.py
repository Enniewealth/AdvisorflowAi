from django.test import TestCase
from django.urls import reverse

from .models import EducationContent
from .seed_data import SEED_CONTENT


class EducationContentTests(TestCase):
    def test_seeded_content_is_available_publicly(self):
        response = self.client.get(reverse("education-list"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        results = payload["results"] if isinstance(payload, dict) else payload
        self.assertGreaterEqual(len(results), len(SEED_CONTENT))
        self.assertEqual(EducationContent.objects.filter(is_published=True).count(), len(SEED_CONTENT))

    def test_language_and_category_filters_work(self):
        response = self.client.get(
            reverse("education-list"),
            {"language": "english", "category": "insurance_basics"},
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        results = payload["results"] if isinstance(payload, dict) else payload
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["language"], "english")
        self.assertEqual(results[0]["category"], "insurance_basics")
