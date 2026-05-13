from django.db import models


class EducationContent(models.Model):
    class Language(models.TextChoices):
        ENGLISH = "english", "English"
        YORUBA = "yoruba", "Yoruba"
        HAUSA = "hausa", "Hausa"
        IGBO = "igbo", "Igbo"

    class Category(models.TextChoices):
        BASICS = "insurance_basics", "Insurance basics"
        POLICY = "policy_explanations", "Policy explanations"
        CLAIMS = "claims_guidance", "Claims guidance"
        TERMS = "terminology", "Insurance terminology"

    title = models.CharField(max_length=180)
    language = models.CharField(max_length=20, choices=Language.choices)
    category = models.CharField(max_length=40, choices=Category.choices)
    content = models.TextField()
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("category", "language", "title")
        indexes = [
            models.Index(fields=["language", "category", "is_published"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_language_display()})"
