from rest_framework import serializers
from .models import Activity
from datetime import date
from cloudinary.utils import cloudinary_url
class ActivitiesSerializer(serializers.ModelSerializer):
    verification_proof_url = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['id','duration', 'verification_proof','status', 'location', 'activity_date', 'description', 'activity', 'verified_on', 'verification_proof_url']
        read_only_fields= ['id', 'verified_on', 'status', 'verification_proof_url']
        
    def validate_verification_proof(self, value):
        max_size = 2 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError('Image size too large')
            
        allowed_mime_types = ['image/jpeg', 'image/png']
        if value.content_type not in allowed_mime_types:
            raise serializers.ValidationError('Only png or jpeg formats are allowed')
            
            
        from PIL import Image
        img = Image.open(value)
        if img.width > 2000 or img.height > 2000:
            raise serializers.ValidationError("Image dimensions too large")

        return value
    
    def get_verification_proof_url(self, obj):
        return obj.verification_proof.url
                    
    def validate_activity_date(self, value):
        if value > date.today():
            raise serializers.ValidationError("Cannot add an activity of a future date")
        return value