from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status 
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Exercise
from .serializers import *
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

@ensure_csrf_cookie
@api_view(['GET', 'POST'])
def exercise_list(request):
    # Returns all exercises or creates a new exercise.
    if request.method == 'GET':
        data = Exercise.objects.all()

        serializer = ExerciseSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ExerciseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@ensure_csrf_cookie
@api_view(['PUT', 'DELETE'])
def exercise_detail(request, pk):
    # Updates or deletes a single exercise by ID.
    try:
        exercise = Exercise.objects.get(pk=pk)
    
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
def exercise_bookmark(request, pk):
    # Toggles the saved status (bookmarks/unbookmarks) for an exercise.
    try:
        exercise = Exercise.objects.get(pk=pk)

        if request.method == 'PUT':
            # Save the exercise if not already saved.
            if (exercise.saved == False):
                serializer = ExerciseSerializer(exercise, data={"name": exercise.name, "muscle": exercise.muscle, "difficulty": exercise.difficulty, "description": exercise.description, "image": exercise.image, "saved": True}, context={'request': request})
                if serializer.is_valid():
                    serializer.save()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                # Unsave the exercise if already saved.
            elif (exercise.saved == True):
                serializer = ExerciseSerializer(exercise, data={"name": exercise.name, "muscle": exercise.muscle, "difficulty": exercise.difficulty, "description": exercise.description, "image": exercise.image, "saved": False}, context={'request': request})
                if serializer.is_valid():
                    serializer.save()
                    return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    
