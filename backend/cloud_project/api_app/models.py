from django.db import models
from django.contrib.auth.models import User


class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    name = models.CharField(max_length=50, null=False)
    storage = models.CharField(max_length=255, null=False)
    link = models.CharField(max_length=50, null=True)
    description = models.CharField(max_length=255, null=True)
    size = models.IntegerField(null=True)
    when_uploaded = models.DateTimeField(null=False, auto_now_add=True)
    last_download = models.DateTimeField(null=True)
