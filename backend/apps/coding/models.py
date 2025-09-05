from django.db import models
from apps.users.models import Profile
from datetime import timedelta


# Create your models here.
class CodingSession(models.Model):
    """Model for user's coding sessions"""
    SOURCE_CHOICES = [
        ('manual', 'Manual Entry'),
        ('github', 'GitHub'),
    ]
    user = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='coding_sessions'
    )
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField()
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    credits_awarded = models.IntegerField(default=0)

    @property
    def duration(self):
        """Daily Coding Duration"""
        if self.start_time and self.end_time and self.end_time >= self.start_time:
            return self.end_time - self.start_time
        return None

    @property
    def tracking_source(self):
        """Source from which coding session is tracked daily,
        Either manual entry or git profile commits
        """
        return self.source
      
    def award_credits(self):
        """Credits are awarded based on coding duration"""
        if self.duration is None:
            return 0
        total_minutes = self.duration.total_seconds() / 60
        interval_of_30_mins = total_minutes // 30
        
        credits = int(interval_of_30_mins * 5)
        return credits
          
      
    def save(self, *args, **kwargs):
      """Save coding session with credits"""
      self.credits_awarded = self.award_credits()
      
      super().save(*args, **kwargs)
