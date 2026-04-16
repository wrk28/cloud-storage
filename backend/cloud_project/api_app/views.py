#from django.shortcuts import render

from rest_framework import generics
from api_app.models import User
from api_app.serializers import UserSerializer

class ListUsers(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
