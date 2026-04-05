"""
Load exercise data from exercise.json into the database
"""
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nutrition_app.settings')
django.setup()

from main_app.models import Exercise

# Load exercises from JSON file
with open('exercise.json', 'r') as f:
    exercises_data = json.load(f)

# Clear existing exercises
Exercise.objects.all().delete()

# Add data from JSON
for exercise_data in exercises_data:
    # Add default saved=False if not in JSON
    if 'saved' not in exercise_data:
        exercise_data['saved'] = False
    
    exercise = Exercise.objects.create(**exercise_data)
    print(f"Created: {exercise.name} - {exercise.muscle}")

print(f"\nSuccessfully loaded {Exercise.objects.count()} exercises!")

