from rest_framework.permissions import BasePermission
from rest_framework import status
from django.contrib.auth.models import User
from api.models import File


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or request.user.is_superuser
    

class IsAdminOrAuthor(BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, User):
            return request.user == obj
        elif isinstance(obj, File):
            return request.user.id == obj.user_id
        else:
            return False



