from rest_framework.permissions import BasePermission
from rest_framework import status


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or request.user.is_superuser
    

class IsAdminOrAuthor:
    @staticmethod
    def check_user(self, request, user_id):
        if request.user == user_id:
            return True
        else:
            return False

    @staticmethod
    def check_file(self, request, file_id):
        if request.user == file_id:
            return True
        else:
            return False
        
    @property
    def message(self):
        return {
            'message': 'Forbidden',
            'status': 'error'
            }
    
    @property
    def status(self):
        return status.HTTP_403_FORBIDDEN


