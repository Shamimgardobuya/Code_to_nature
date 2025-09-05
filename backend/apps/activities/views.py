from django.shortcuts import render
from .serializers import ActivitiesSerializer
from .models import Activity
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.users.models import CustomUser


# Create your views here.

class ActivitiesViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitiesSerializer
    
    @action(detail=True, methods=['post'])
    def verify_activity(self, request):
        activity = self.get_object()
        activity.status = 'VERIFIED'
        activity.user = request.user
        activity.save()

        serializer = self.get_serializer(activity)

        return Response(
                    {"message": f"Activity verified successfully, {serializer.data}"},
                    status=status.HTTP_201_CREATED,
        )