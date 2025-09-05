from rest_framework import viewsets, permissions
from .serializers import CustomerUserSerializer
from .models import CustomUser

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomerUserSerializer
    permission_classes = [permissions.AllowAny]
