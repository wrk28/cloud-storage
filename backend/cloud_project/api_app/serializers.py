from rest_framework import serializers
from api_app.models import User, File

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'login', 'name', 'email', 'password_hash', 'is_admin', 'creaded_at', 'updated_at']

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'storage', 'link', 'description', 'creaded_at', 'updated_at']