import json
from pathlib import Path

from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

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


class RegisterNewUser(APIView):
    # Creates a new user account from Google login data.
    def post(self,request):
        username = request.data.get("username")
        email = request.data.get("email")
        name = request.data.get("name")
        
        # Register the user with default password.
        try:
            user  = User.objects.create_user(
                username = username,
                password = "random123",
                email = email,
                first_name = name,
            )
            user.save()
            print("{} created successfully".format(user.username))
            return Response({"message":"User created"})
        except:
            return Response({"message":"User creation failed or user already exists"})

class greeting(APIView):
    # Sends a personalized greeting to authenticated users.
    permission_classes = ( IsAuthenticated, )

    def get(self,request):
        content = {'message': 'Hello, {}!'.format(request.user.first_name)}
        return Response(content)
    
