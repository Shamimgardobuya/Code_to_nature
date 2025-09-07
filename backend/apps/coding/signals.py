from datetime import datetime
from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import CodingSession
from apps.users.models import Profile


@receiver(post_save, sender=CodingSession)
def add_locked_credits(sender, instance, created, **kwargs):
    """Updates locked_credits when user is awarded credits from coding"""
    if created:
        profile = instance.user
        profile.locked_credits += instance.credits_awarded
        profile.save()


@receiver(post_save, sender=Profile)
def create_github_coding_session(sender, instance, created, **kwargs):
    """Signal to create coding session daily"""
    if instance.github_username:
        today = instance.coding_sessions.filter(
            source='github',
            created_at__date=datetime.today().date()
        ).exists()
        if not today:
            CodingSession.objects.create(
                user=instance,
                source='github'
            )
