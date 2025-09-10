from datetime import timedelta
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
import logging
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from .serializers import CodingSessionSerializer
from .models import CodingSession
from apps.users.renderers import BooleanRenderer
from apps.users.models import Profile


logger = logging.getLogger(__name__)


# Create your views here.
class CodingViewSet(viewsets.ModelViewSet):
    queryset = CodingSession.objects.all()
    serializer_class = CodingSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [BooleanRenderer, JSONRenderer, BrowsableAPIRenderer]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user']

    
    @action(
        detail=False,
        methods=['post'],
        url_path='daily-github-task',
        permission_classes = [permissions.AllowAny]
    )
    def create_daily_github_coding_session(self, request):
        """Create coding session daily for all profiles with GitHub usernames."""
        secret = request.headers.get("X-Task-Key")
        if secret != settings.GITHUB_TASK_SECRET:
            return Response({"status": "forbidden"}, status=status.HTTP_403_FORBIDDEN)

        today = timezone.localdate()
        profiles = Profile.objects.exclude(github_username="").exclude(github_username__isnull=True)
        created_count = 0

        for profile in profiles:
            logger.info(f"Checking profile {profile.pk} ({profile.github_username})")

            session, created = CodingSession.objects.get_or_create(
                user=profile,
                source="github",
                created_at__date=today,
                defaults={"duration": timedelta()}
            )

            try:
                duration = session.get_duration_from_github() or session.duration or timedelta()
                session.duration = duration
                session.save()
                created_count += 1
                logger.info(f"Created session for {profile.pk}")
            except Exception as e:
                logger.error(f"Error for {profile.pk}: {e}")

        return Response({"status": "success", "created": created_count})
