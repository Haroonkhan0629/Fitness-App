from django.db import models
from django.contrib.auth.models import User

class Exercise(models.Model):
    # Stores exercise details that users can search, view, and save.

    name = models.CharField(max_length=50)
    muscle = models.CharField(max_length=20)
    difficulty = models.CharField(max_length=20)
    description = models.CharField(max_length=300)
    image = models.CharField(max_length=300)
    # Tracks whether the user has bookmarked this exercise.
    saved = models.BooleanField(default=False)
    # Owner of this exercise record; null rows are treated as starter templates.
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='exercises')

    def __str__(self):
        return self.name
