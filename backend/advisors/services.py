from .models import Activity


def log_activity(advisor, action, message, metadata=None):
    return Activity.objects.create(
        advisor=advisor,
        action=action,
        message=message,
        metadata=metadata or {},
    )
