# Coding API Documentation

## API Docs Tested With Postman for Manual Input
***Register coding session**
NB: Ensure User is logged in and access token is set
POST http://localhost:8000/api/codingsessions/
Body
{
  "user": {id}, # replace with actual user id
  "duration": "01:30:00",
  "source": "manual"
}
Response
{
    "success": true,
    "data": {
        "user": {id},
        "duration": "01:30:00",
        "source": "manual",
        "created_at": "2025-09-07T17:10:29.123449Z",
        "credits_awarded": 15
    }
}

***Edit Coding Session***
PUT http://localhost:8000/api/codingsessions/{sessionid}
Body
{
  "user": {id}, # replace with actual user id
  "duration": "01:30:00",
  "source": "manual"
}
Response
{
    "success": true,
    "data": {
        "user": {id},
        "duration": "01:50:00",
        "source": "manual",
        "created_at": "2025-09-07T17:10:29.123449Z",
        "credits_awarded": 15
    }
}

PATCH http://localhost:8000/api/codingsessions/{sessionid}
Body
{
  "duration": "01:20:00"
}

Response
{
    "success": true,
    "data": {
        "user": {id},
        "duration": "01:20:00",
        "source": "manual",
        "created_at": "2025-09-07T17:10:29.123449Z",
        "credits_awarded": 10
    }
}
