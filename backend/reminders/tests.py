from datetime import date, timedelta

from clients.models import Client
from django.contrib.auth import get_user_model
from django.test import TestCase

from .models import Reminder
from .services import sync_reminders_for_client, trigger_due_reminders


class ReminderScheduleTests(TestCase):
    def test_sync_creates_three_policy_reminders(self):
        advisor = get_user_model().objects.create_user(
            email="advisor@example.com",
            password="strong-password-123",
            name="Test Advisor",
        )
        expiry_date = date.today() + timedelta(days=14)
        client = Client.objects.create(
            advisor=advisor,
            full_name="Ada Okeke",
            phone_number="08030000000",
            insurance_provider="Leadway",
            policy_type="Motor insurance",
            expiry_date=expiry_date,
        )

        sync_reminders_for_client(client)

        reminders = Reminder.objects.filter(client=client)
        self.assertEqual(reminders.count(), 3)
        self.assertTrue(
            reminders.filter(
                reminder_type=Reminder.ReminderType.BEFORE_EXPIRY,
                reminder_date=expiry_date - timedelta(days=7),
            ).exists()
        )
        self.assertTrue(
            reminders.filter(
                reminder_type=Reminder.ReminderType.ON_EXPIRY,
                reminder_date=expiry_date,
            ).exists()
        )
        self.assertTrue(
            reminders.filter(
                reminder_type=Reminder.ReminderType.AFTER_EXPIRY,
                reminder_date=expiry_date + timedelta(days=1),
            ).exists()
        )

    def test_manual_trigger_is_scoped_to_advisor(self):
        first_advisor = get_user_model().objects.create_user(
            email="first@example.com",
            password="strong-password-123",
            name="First Advisor",
        )
        second_advisor = get_user_model().objects.create_user(
            email="second@example.com",
            password="strong-password-123",
            name="Second Advisor",
        )
        today = date.today()
        first_client = Client.objects.create(
            advisor=first_advisor,
            full_name="Ayo Balogun",
            phone_number="08030000001",
            insurance_provider="AIICO",
            policy_type="Life insurance",
            expiry_date=today,
        )
        second_client = Client.objects.create(
            advisor=second_advisor,
            full_name="Musa Bello",
            phone_number="08030000002",
            insurance_provider="Custodian",
            policy_type="Health insurance",
            expiry_date=today,
        )
        sync_reminders_for_client(first_client)
        sync_reminders_for_client(second_client)

        sent_count = trigger_due_reminders(today=today, advisor=first_advisor)

        self.assertEqual(sent_count, 2)
        self.assertEqual(
            Reminder.objects.filter(advisor=first_advisor, status=Reminder.Status.SENT).count(),
            2,
        )
        self.assertEqual(
            Reminder.objects.filter(advisor=second_advisor, status=Reminder.Status.PENDING).count(),
            3,
        )
