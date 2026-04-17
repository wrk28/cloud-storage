from django.db import models


class User(models.Model):
    login = models.CharField(max_length=50, null=False)
    first_name = models.CharField(max_length=50, null=False)
    last_name = models.CharField(max_length=50, null=False)
    email = models.CharField(max_length=50, null=False)
    password_hash = models.CharField(max_length=255, null=True)
    is_admin = models.BooleanField()

class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    name = models.CharField(max_length=50, null=False)
    storage = models.CharField(max_length=255, null=False)
    link = models.CharField(max_length=50, null=True)
    description = models.CharField(max_length=255, null=True)
    size = models.IntegerField(null=True)
    uploaded = models.DateTimeField(null=False)
    last_download = models.DateField(null=True)



