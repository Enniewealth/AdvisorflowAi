from django.core.management.base import BaseCommand

from education.models import EducationContent
from education.seed_data import SEED_CONTENT


class Command(BaseCommand):
    help = "Seed intentional insurance education content in English, Yoruba, Hausa, and Igbo."

    def handle(self, *args, **options):
        created = 0
        for title, language, category, content in SEED_CONTENT:
            _, was_created = EducationContent.objects.update_or_create(
                title=title,
                language=language,
                category=category,
                defaults={"content": content, "is_published": True},
            )
            created += int(was_created)
        self.stdout.write(self.style.SUCCESS(f"Seeded education content. Created {created} new item(s)."))
