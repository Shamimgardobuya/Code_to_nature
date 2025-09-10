from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from .serializers import CustomerUserSerializer, ProfileSerializer
from .models import CustomUser, Profile
from .renderers import BooleanRenderer


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomerUserSerializer
    permission_classes = [permissions.AllowAny]
    renderer_classes = [BooleanRenderer, JSONRenderer, BrowsableAPIRenderer]


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [BooleanRenderer, JSONRenderer, BrowsableAPIRenderer]

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        """Return the current authenticated user's profile"""
        profile = request.user.profile
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
