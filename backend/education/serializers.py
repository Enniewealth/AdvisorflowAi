from rest_framework import serializers

from .models import EducationContent


class EducationContentSerializer(serializers.ModelSerializer):
    language_display = serializers.CharField(source="get_language_display", read_only=True)
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = EducationContent
        fields = (
            "id",
            "title",
            "language",
            "language_display",
            "category",
            "category_display",
            "content",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
