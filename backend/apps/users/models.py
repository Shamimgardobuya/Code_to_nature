from django.db import models
from django.contrib.auth.models import AbstractUser
from codetonature_project.image_field_storage import get_image_field

# Create your models here.
class CustomUser(AbstractUser):
    """Customer User model"""
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


class Profile(models.Model):
    """User Profile"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    profile_pic = get_image_field(
    "profiles", null=True
    )
    github_username = models.CharField(max_length=39, blank=True, null=True)
    github_token = models.UUIDField(blank=True, null=True)
    eco_credits = models.IntegerField(default=0)
    locked_credits = models.IntegerField(default=0)
    # streak tracks activities (to encourage users to take breaks,
    # activities unlock credits)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    friends = models.ManyToManyField('Profile', blank=True)

    def __str__(self):
        """Return Username"""
        return self.user.username

    def streak_validation(self):
        """Validates Streaks"""
        if (self.current_streak >= self.longest_streak):
            self.longest_streak = self.current_streak

    def credit_validation(self):
        if self.eco_credits < 0 or self.locked_credits < 0:
            return {"Credits must be positive integer"}
