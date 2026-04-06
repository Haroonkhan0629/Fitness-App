from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status 
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Exercise
from .serializers import *
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User

@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def exercise_list(request):
    # Logged-out users see template exercises; logged-in users see their own.
    if request.user.is_authenticated:
        data = Exercise.objects.filter(owner=request.user)

        # First-time users receive a personal copy of starter template exercises.
        if not data.exists():
            templates = Exercise.objects.filter(owner__isnull=True)
            for template in templates:
                Exercise.objects.create(
                    name=template.name,
                    muscle=template.muscle,
                    difficulty=template.difficulty,
                    description=template.description,
                    image=template.image,
                    saved=template.saved,
                    owner=request.user,
                )
            data = Exercise.objects.filter(owner=request.user)
    else:
        data = Exercise.objects.filter(owner__isnull=True)

    serializer = ExerciseSerializer(data, context={'request': request}, many=True)
    return Response(serializer.data)

@ensure_csrf_cookie
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def exercise_create(request):
    # Creates a new exercise owned by the signed-in user.
    serializer = ExerciseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(owner=request.user)
        return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    
