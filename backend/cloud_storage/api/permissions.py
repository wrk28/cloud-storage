from rest_framework.permissions import BasePermission
from rest_framework import status


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or request.user.is_superuser
    

class IsAdminOrAuthor:
    @staticmethod
    def check_user(request, user_id):
        if request.user.id == user_id:
            return True
        else:
            return False
        
    message = {
            'message': 'Forbidden, not admin or author',
            'status': 'error'
            }
    
    status = status.HTTP_403_FORBIDDEN


