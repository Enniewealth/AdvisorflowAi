from django.db import migrations

from education.seed_data import SEED_CONTENT


def seed_education_content(apps, schema_editor):
    EducationContent = apps.get_model("education", "EducationContent")
    for title, language, category, content in SEED_CONTENT:
        EducationContent.objects.update_or_create(
            title=title,
            language=language,
            category=category,
            defaults={"content": content, "is_published": True},
        )


def unseed_education_content(apps, schema_editor):
    EducationContent = apps.get_model("education", "EducationContent")
    for title, language, category, _content in SEED_CONTENT:
        EducationContent.objects.filter(
            title=title,
            language=language,
            category=category,
        ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("education", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_education_content, unseed_education_content),
    ]
