from django.conf import settings
from django.db import models
from cloudinary.models import CloudinaryField

def get_image_field(upload_to: str, null=False):
    """
    Returns an ImageField for dev or CloudinaryField for prod.
    """
    if getattr(settings, 'ENV', 'dev') == 'prod':
        return CloudinaryField(
            upload_to, 
            null=null, 
            folder=upload_to
            )
    return models.ImageField(upload_to=upload_to, null=null)
