from django.db import models
from apps.users import models as UserModel
# Create your models here.
class OutdoorActivity(models.Model):
#     * Create OutdoorActivity model (user, type, duration, verification\_proof, status).
# * Serializer + viewset for submitting activity.
# * Simple verification stub (auto-approve for now).

    user = models.ForeignKey(UserModel, null=False, on_delete=models.PROTECT)
    duration = models.IntegerField(null=False)
    verification_proof = models.ImageField(upload_to='activities/', null=False)
    statuses = [
        'PENDING' , 'pending',
        'VERIFIED' , 'verified',
        'REJECTED', 'rejected'
    ]
    status = models.CharField(choices=statuses, default='PENDING')
    approved_on = models.DateTimeField(null=True)
    