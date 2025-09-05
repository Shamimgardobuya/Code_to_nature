from .models import CustomUser, Profile
from rest_framework import serializers

class CustomerUserSerializer(serializers.ModelSerializer):
    """Customer User serializer"""
    class Meta:
        model = CustomUser
        fields = ['email', 'password']
        
    def create(self, validated_data):
        """Create User"""
        user = CustomUser(
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
