from datetime import timedelta

from advisors.models import Activity
from advisors.services import log_activity
from django.core.mail import send_mail
from django.utils import timezone

from .models import Reminder


def _message_for(client, reminder_type):
    if reminder_type == Reminder.ReminderType.BEFORE_EXPIRY:
        return f"{client.full_name}'s {client.policy_type} policy expires in 7 days."
    if reminder_type == Reminder.ReminderType.ON_EXPIRY:
        return f"{client.full_name}'s {client.policy_type} policy expires today."
    return f"{client.full_name}'s {client.policy_type} policy has expired. Follow up to avoid lost commission."


def sync_reminders_for_client(client):
    schedule = {
        Reminder.ReminderType.BEFORE_EXPIRY: client.expiry_date - timedelta(days=7),
        Reminder.ReminderType.ON_EXPIRY: client.expiry_date,
        Reminder.ReminderType.AFTER_EXPIRY: client.expiry_date + timedelta(days=1),
    }
    reminders = []
    for reminder_type, reminder_date in schedule.items():
        reminder, _ = Reminder.objects.update_or_create(
            client=client,
            reminder_type=reminder_type,
            defaults={
                "advisor": client.advisor,
                "reminder_date": reminder_date,
                "message": _message_for(client, reminder_type),
                "status": Reminder.Status.PENDING,
                "sent_at": None,
            },
        )
        reminders.append(reminder)
    return reminders


def trigger_due_reminders(today=None, advisor=None):
    today = today or timezone.localdate()
    reminders = Reminder.objects.select_related("advisor", "client").filter(
        reminder_date__lte=today,
        status=Reminder.Status.PENDING,
        client__is_active=True,
    )
    if advisor is not None:
        reminders = reminders.filter(advisor=advisor)
    sent_count = 0
    for reminder in reminders:
        send_mail(
            subject="AdvisorFlow renewal reminder",
            message=(
                f"{reminder.message}\n\n"
                f"Client phone: {reminder.client.phone_number}\n"
                f"Provider: {reminder.client.insurance_provider}\n"
                f"Expiry date: {reminder.client.expiry_date}"
            ),
            from_email=None,
            recipient_list=[reminder.advisor.email],
            fail_silently=True,
        )
        reminder.status = Reminder.Status.SENT
        reminder.sent_at = timezone.now()
        reminder.save(update_fields=["status", "sent_at", "updated_at"])
        log_activity(
            reminder.advisor,
            Activity.Action.REMINDER_TRIGGERED,
            reminder.message,
            {"client_id": reminder.client_id, "reminder_id": reminder.id},
        )
        sent_count += 1
    return sent_count
