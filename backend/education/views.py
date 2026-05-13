from rest_framework import permissions, viewsets

from .models import EducationContent
from .serializers import EducationContentSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == "admin"


class EducationContentViewSet(viewsets.ModelViewSet):
    serializer_class = EducationContentSerializer
    permission_classes = (IsAdminOrReadOnly,)

    def get_queryset(self):
        queryset = EducationContent.objects.filter(is_published=True)
        language = self.request.query_params.get("language")
        category = self.request.query_params.get("category")
        if language:
            queryset = queryset.filter(language=language)
        if category:
            queryset = queryset.filter(category=category)
        return queryset
