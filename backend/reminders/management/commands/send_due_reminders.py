from django.core.management.base import BaseCommand

from reminders.services import trigger_due_reminders


class Command(BaseCommand):
    help = "Send email notifications for due AdvisorFlow renewal reminders."

    def handle(self, *args, **options):
        count = trigger_due_reminders()
        self.stdout.write(self.style.SUCCESS(f"Triggered {count} reminder(s)."))
