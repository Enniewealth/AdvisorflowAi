from django.utils import timezone
from rest_framework import decorators, response, viewsets

from .models import Reminder
from .serializers import ReminderSerializer
from .services import trigger_due_reminders


class ReminderViewSet(viewsets.ModelViewSet):
    serializer_class = ReminderSerializer
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_queryset(self):
        queryset = Reminder.objects.select_related("client").filter(advisor=self.request.user)
        status_filter = self.request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    @decorators.action(detail=False, methods=["post"], url_path="trigger-due")
    def trigger_due(self, request):
        count = trigger_due_reminders(timezone.localdate(), advisor=request.user)
        return response.Response({"triggered": count})
