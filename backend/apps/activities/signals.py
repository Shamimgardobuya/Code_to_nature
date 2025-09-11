# apps/activities/signals.py

import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Activity  

logger = logging.getLogger(__name__)

# Points multiplier based on activity type
ACTIVITY_POINTS = {
    "family_meetup": 5,
    "hiking": 12,
    "walking": 8,
    "running": 15,
    "cycling": 20,
    "climbing": 25,
    "camping": 10,
    "gardening": 7,
    "other": 10,
}

@receiver(post_save, sender=Activity)
def unlock_credits_signal(sender, instance, created, **kwargs):
    """
    Unlock eco-credits for a user when an activity is verified.
    """
    activity = instance

    # Run only when the activity is updated (not created)
    if created:
        return

    if activity.status == "VERIFIED":
        try:
            with transaction.atomic():
                user_profile = activity.user.profile
                locked_credits = user_profile.locked_credits

                # duration in hours
                duration = activity.duration
                duration_in_hrs = duration.hour + duration.minute / 60 + duration.second / 3600

                # get multiplier (default 10 if activity not listed)
                multiplier = ACTIVITY_POINTS.get(activity.activity.lower(), 2)

                # calculate points
                points_to_unlock = duration_in_hrs * multiplier

                # Ensure valid unlocking (no negative or over-unlock)
                points_to_unlock = max(0, min(points_to_unlock, locked_credits))

                if points_to_unlock > 0:
                    user_profile.locked_credits -= points_to_unlock
                    user_profile.eco_credits += points_to_unlock
                    user_profile.save()

                    logger.info(
                        f"Unlocked {points_to_unlock} eco-credits for {user_profile.user.username} "
                        f"({activity.activity}, {duration_in_hrs:.2f} hrs)"
                    )
        except Exception as e:
            logger.error(f"Error unlocking credits: {str(e)}")

    elif activity.status == "REJECTED":
        # No credits are unlocked on rejection, just log the event
        logger.info(f"Activity {activity.id} rejected; no credits unlocked.")