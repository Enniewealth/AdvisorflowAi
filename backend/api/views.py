from datetime import timedelta

from advisors.models import Activity
from advisors.serializers import ActivitySerializer
from clients.models import Client
from django.db.models import Count
from django.utils import timezone
from reminders.models import Reminder
from reminders.serializers import ReminderSerializer
from rest_framework import response, views


class DashboardView(views.APIView):
    def get(self, request):
        today = timezone.localdate()
        next_week = today + timedelta(days=7)
        clients = Client.objects.filter(advisor=request.user)
        reminders = Reminder.objects.select_related("client").filter(advisor=request.user)

        activity = Activity.objects.filter(advisor=request.user)[:8]
        upcoming_reminders = reminders.filter(
            status=Reminder.Status.PENDING,
            reminder_date__lte=next_week,
        )[:8]

        policy_mix = (
            clients.values("policy_type")
            .annotate(total=Count("id"))
            .order_by("-total")[:5]
        )

        return response.Response(
            {
                "metrics": {
                    "total_clients": clients.count(),
                    "active_policies": clients.filter(is_active=True, expiry_date__gte=today).count(),
                    "expiring_policies": clients.filter(
                        is_active=True,
                        expiry_date__gt=today,
                        expiry_date__lte=next_week,
                    ).count(),
                    "upcoming_renewals": reminders.filter(
                        status=Reminder.Status.PENDING,
                        reminder_date__gte=today,
                        reminder_date__lte=next_week,
                    ).count(),
                    "expired_policies": clients.filter(is_active=True, expiry_date__lt=today).count(),
                },
                "policy_mix": list(policy_mix),
                "upcoming_reminders": ReminderSerializer(upcoming_reminders, many=True).data,
                "recent_activity": ActivitySerializer(activity, many=True).data,
            }
        )
