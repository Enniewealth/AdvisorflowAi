from advisors.models import Activity
from advisors.services import log_activity
from rest_framework import viewsets

from reminders.services import sync_reminders_for_client

from .models import Client
from .serializers import ClientSerializer


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer

    def get_queryset(self):
        queryset = Client.objects.filter(advisor=self.request.user)
        search = self.request.query_params.get("search")
        status_filter = self.request.query_params.get("status")
        if search:
            queryset = queryset.filter(full_name__icontains=search)
        if status_filter == "active":
            queryset = queryset.filter(is_active=True)
        elif status_filter == "inactive":
            queryset = queryset.filter(is_active=False)
        return queryset

    def perform_create(self, serializer):
        client = serializer.save(advisor=self.request.user)
        sync_reminders_for_client(client)
        log_activity(
            self.request.user,
            Activity.Action.CLIENT_CREATED,
            f"Added {client.full_name}'s {client.policy_type} policy.",
            {"client_id": client.id},
        )

    def perform_update(self, serializer):
        previous_expiry = self.get_object().expiry_date
        client = serializer.save()
        if previous_expiry != client.expiry_date:
            sync_reminders_for_client(client)
            action = Activity.Action.RENEWAL_ADDED
            message = f"Updated renewal date for {client.full_name}."
        else:
            action = Activity.Action.CLIENT_UPDATED
            message = f"Updated {client.full_name}'s client profile."
        log_activity(self.request.user, action, message, {"client_id": client.id})

    def perform_destroy(self, instance):
        name = instance.full_name
        log_activity(
            self.request.user,
            Activity.Action.CLIENT_DELETED,
            f"Deleted {name}'s client profile.",
            {"client_id": instance.id},
        )
        instance.delete()
