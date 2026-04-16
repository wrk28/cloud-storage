#from django.shortcuts import render

from rest_framework import viewsets
from api_app.models import User
from api_app.serializers import UserSerializer

class UsersModelViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
