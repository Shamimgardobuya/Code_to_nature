from django.db import models
from apps.users.models import CustomUser
# Create your models here.
class Activity(models.Model):


    user = models.ForeignKey(CustomUser, null=False, on_delete=models.PROTECT)
    duration = models.IntegerField(null=False)
    verification_proof = models.ImageField(upload_to='activities/', null=False)
    statuses = [
        ('PENDING' , 'pending'),
        ('VERIFIED' , 'verified'),
        ('REJECTED', 'rejected')
    ]
    status = models.CharField(choices=statuses, default='PENDING')
    approved_on = models.DateTimeField(null=True)
    