from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


class User(AbstractUser):
    pass

class Exercise(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise_name = models.CharField(max_length=32)
    language1 = models.CharField(max_length=32)
    language2 = models.CharField(max_length=32)
    time_last_edited = models.DateTimeField(auto_now=True)
    formatted_time_last_edited = models.CharField(max_length=32)
    translations = models.JSONField(blank=True, null=True)
