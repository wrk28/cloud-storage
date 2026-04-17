from rest_framework import serializers
from api_app.models import User, File

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_staff']

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'storage', 'link', 'description', 'size',  'when_uploaded', 'last_download']