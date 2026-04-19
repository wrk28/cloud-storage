from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer:
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(slef, validate_data):
        user = User.objects.create_user(
            username=validate_data['username'],
            password=validate_data['password'],
            email=validate_data['email'],
            first_name=validate_data['first_name'],
            last_name=validate_data['last_name'],
        )
        return user