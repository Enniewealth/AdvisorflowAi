from django.contrib import admin

from .models import EducationContent


@admin.register(EducationContent)
class EducationContentAdmin(admin.ModelAdmin):
    list_display = ("title", "language", "category", "is_published", "updated_at")
    list_filter = ("language", "category", "is_published")
    search_fields = ("title", "content")
