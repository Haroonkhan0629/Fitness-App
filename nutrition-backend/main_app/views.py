import json
from pathlib import Path
import time

from django.contrib.auth.models import User
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
import requests
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Exercise
from .serializers import *


def _load_exercise_templates_from_json():
    # Read starter exercises from exercise.json for public (logged-out) browsing.
    json_path = Path(__file__).resolve().parent.parent / "exercise.json"
    with json_path.open("r", encoding="utf-8") as file_obj:
        template_items = json.load(file_obj)

    sorted_items = sorted(template_items, key=lambda x: x.get("name", "").lower())
    normalized = []
    for idx, item in enumerate(sorted_items, start=1):
        normalized.append(
            {
                "id": -idx,
                "name": item.get("name", ""),
                "muscle": item.get("muscle", ""),
                "difficulty": item.get("difficulty", ""),
                "description": item.get("description", ""),
                "image": item.get("image", ""),
                "saved": bool(item.get("saved", False)),
            }
        )
    return normalized

@ensure_csrf_cookie
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def exercise_list(request):
    # Logged-out users read from exercise.json; logged-in users read only their own rows.
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = ExerciseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    mine_only = request.query_params.get("mine") == "1"

    if mine_only:
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        data = Exercise.objects.filter(owner=request.user).order_by('name')

        # First-time users receive a personal copy of starter template exercises from JSON.
        if not data.exists():
            templates = _load_exercise_templates_from_json()
            for template in templates:
                Exercise.objects.create(
                    name=template["name"],
                    muscle=template["muscle"],
                    difficulty=template["difficulty"],
                    description=template["description"],
                    image=template["image"],
                    saved=template["saved"],
                    owner=request.user,
                )
            data = Exercise.objects.filter(owner=request.user).order_by('name')

        serializer = ExerciseSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    return Response(_load_exercise_templates_from_json())

@ensure_csrf_cookie
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def exercise_detail(request, pk):
    # Updates or deletes a single exercise owned by the signed-in user.
    try:
        exercise = Exercise.objects.get(pk=pk, owner=request.user)
    
        if request.method == 'PUT':
            serializer = ExerciseSerializer(exercise, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            exercise.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    
    except Exercise.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@ensure_csrf_cookie
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def exercise_bookmark(request, pk):
    # Toggles bookmark status for an exercise owned by the signed-in user.
    try:
        exercise = Exercise.objects.get(pk=pk, owner=request.user)

        if request.method == 'PUT':
            exercise.saved = not exercise.saved
            exercise.save(update_fields=['saved'])
            return Response(status=status.HTTP_204_NO_CONTENT)


    except Exercise.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


class GoogleLogin(APIView):
    # Verifies Google's ID token before creating or reusing an account.
    def post(self, request):
        google_credential = request.data.get("credential")
        if not isinstance(google_credential, str) or not google_credential.strip():
            return Response(
                {"detail": "Google credential is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not settings.GOOGLE_CLIENT_ID:
            return Response(
                {"detail": "Google sign-in is not configured on the server"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            google_response = requests.get(
                "https://oauth2.googleapis.com/tokeninfo",
                params={"id_token": google_credential},
                timeout=5,
            )
        except requests.RequestException:
            return Response(
                {"detail": "Google authentication is temporarily unavailable"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        if google_response.status_code != status.HTTP_200_OK:
            response_status = (
                status.HTTP_401_UNAUTHORIZED
                if google_response.status_code < 500
                else status.HTTP_502_BAD_GATEWAY
            )
            return Response(
                {"detail": "Google access token is invalid or could not be verified"},
                status=response_status,
            )

        try:
            google_profile = google_response.json()
        except ValueError:
            return Response(
                {"detail": "Google returned an invalid authentication response"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        try:
            token_expiration = int(google_profile.get("exp", 0))
        except (TypeError, ValueError):
            token_expiration = 0

        google_id = google_profile.get("sub")
        google_email = google_profile.get("email") or ""
        if (
            google_profile.get("aud") != settings.GOOGLE_CLIENT_ID
            or google_profile.get("iss") not in {
                "accounts.google.com",
                "https://accounts.google.com",
            }
            or token_expiration <= time.time()
            or not isinstance(google_id, str)
            or not google_id
            or not google_email
            or google_profile.get("email_verified") not in (True, "true")
        ):
            return Response(
                {"detail": "Google credential is invalid for this application"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user, created = User.objects.get_or_create(
            username=google_id,
            defaults={
                "email": google_email,
                "first_name": google_profile.get("name") or "",
            },
        )
        if not created and user.email.casefold() != google_email.casefold():
            return Response(
                {"detail": "Google account does not match the existing account"},
                status=status.HTTP_409_CONFLICT,
            )
        if created:
            user.set_unusable_password()
            user.save(update_fields=["password"])

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "profile": {
                    "id": google_id,
                    "email": google_email,
                    "name": google_profile.get("name") or "",
                    "picture": google_profile.get("picture", ""),
                },
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class greeting(APIView):
    # Sends a personalized greeting to authenticated users.
    permission_classes = ( IsAuthenticated, )

    def get(self,request):
        content = {'message': 'Hello, {}!'.format(request.user.first_name)}
        return Response(content)
    
