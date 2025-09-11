from apps.users.models import CustomUser
from django.db import transaction
import logging
from datetime import timedelta


logger = logging.getLogger(__name__)

def time_in_hrs(t):
    delta = timedelta(hours=t.hour, minutes=t.minute, seconds=t.second)
    return delta.total_seconds() / 3600

def unlock_credits(activity_id):
    from .models import Activity
    activity = Activity.objects.get(id=activity_id)
    #guiding to points :     #1hr coding time = 10 points
    duration_in_hrs = time_in_hrs(activity.duration)
    user_profile =  activity.user.profile
    locked_credits =user_profile.locked_credits
    points_to_unlock = duration_in_hrs * 10
    #check activity verification status before update to prevent actions on other activities that have not verified
    try:
        if activity.status == 'VERIFIED':
            with transaction.atomic():#ensures to fully update or rollback
                #to not have more points than the locked credit and prevent neg values
                points_to_unlock = max(0, min(points_to_unlock, locked_credits)) 
                user_profile.locked_credits -= points_to_unlock  
                user_profile.eco_credits += points_to_unlock 
                user_profile.save()
                logger.info(f"Added eco-credits for user {user_profile} as {user_profile.eco_credits }")

    except Exception as e:
        logger.error(f"Error occurred {str(e)}")
        return(str(e))
    
    return points_to_unlock