from .models import CustomUser, Profile
from rest_framework import serializers


class CustomerUserSerializer(serializers.ModelSerializer):
    """Customer User serializer"""
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'password', 'username', 'profile_pic_url']
        read_only_fields = ['profile_pic_url']
        extra_kwargs = {
            "password": {"write_only": True},
            "username": {"required": False},
        }

    def create(self, validated_data):
        """Create User"""
        user = CustomUser(
            email=validated_data['email'],
            username=validated_data['email'].split('@')[0]
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    """Profile Serializer"""
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    profile_pic_url = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = [
            'id',
            'user_id',
            'user',
            'profile_pic',
            'github_username',
            'github_token',
            'eco_credits',
            'locked_credits',
            'current_streak',
            'longest_streak',
            'friends',
            'profile_pic_url'
        ]
        read_only_fields = ['user', 'profile_pic_url']
    
    def get_profile_pic_url(self, obj):
        return obj.profile_pic.url

    def update(self, instance, validated_data):
        """Update profile"""
        friends = validated_data.pop('friends', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if friends is not None:
            instance.friends.set(friends)
        return instance
