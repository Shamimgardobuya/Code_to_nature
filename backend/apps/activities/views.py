from django.shortcuts import render
from .serializers import ActivitiesSerializer
from .models import Activity
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.users.models import CustomUser
from datetime import datetime
from .tasks import unlock_credits
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticated

# Create your views here.

class ActivitiesViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitiesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Normal users only see their own activities.
        Admins see all activities.
        """
        user = self.request.user
        if user.is_staff: 
            return Activity.objects.all()
        return Activity.objects.filter(user=user)
    
    def perform_create(self, serializer):
        """ Assign the user who created the activity. """
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """ Override to customize the response format. """
        response = super().create(request, *args, **kwargs)
        return Response(
            {
                "success": True,
                "data": response.data
            },
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'], permission_classes = [IsAdminUser])#custom viewset function
    def verify_activity(self, request, pk=None):
        """ Custom action to verify an activity. Only admins can perform this action. """
        try:
            activity = self.get_object()
            statuses = ['PENDING', 'REJECTED'] #do not verify an already verified activity
            if activity.status in statuses:
                activity.status = 'VERIFIED' #assigning new value of status
                activity.verified_on = datetime.now()
                activity.save()
                
                unlock_credits(activity.id) #performs unlocking the credit
                serializer = self.get_serializer(activity)

                return Response(
                            {"success": True, 
                             "data": serializer.data
                             },
                            status=status.HTTP_201_CREATED,
                )
            return Response(
                            {"success": True,
                             "data": serializer.data
                             },
                            status=status.HTTP_400_BAD_REQUEST,
                )
            
        except Exception as e:
            return Response(
                            {"error occurred": str(e)}
            )