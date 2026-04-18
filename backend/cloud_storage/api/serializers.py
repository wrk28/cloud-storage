from rest_framework import serializers
from api.models import User, File

class UserListSerializer(serializers.ModelSerializer):
    file_count = serializers.IntegerField(read_only=True)
    total_size = serializers.IntegerField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'file_count', 'total_size']

class UserPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'is_staff']

class FileListSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'user', 'name', 'storage', 'link', 'description', 'size',  'when_uploaded', 'last_download']

class FilePatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'description']

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'user', 'name', 'storage', 'link', 'description', 'size']
