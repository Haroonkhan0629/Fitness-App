from rest_framework import serializers
from .models import Exercise

class ExerciseSerializer(serializers.ModelSerializer):
    # Converts Exercise data to JSON format for API responses.

    class Meta:
        model = Exercise
        fields = ("id", "name", "muscle", "difficulty", "description", "image", "saved")

