from rest_framework import generics, status
from api.auth.serializers import RegisterSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from django.middleware.csrf import get_token


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class LoginView(APIView):

    def post(self, request):
        username = request.data.get('username');
        password = request.data.get('password');
        user = authenticate(request=request, username=username, password=password)
        if user is not None:
            login(request, user);
            user.last_login = timezone.now()
            user.save()
            csrf_token = get_token(request)
            return Response({
                "message": "success login",
                "status": "success",
                "auth": {
                    "username": user.username,
                    "is_admin": user.is_staff,
                    "is_authenticated": True,
                    "csrf_token": csrf_token,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "message": "Invalid credentials",
                "status": "error"
            }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({
                "message": "success logot",
                "status": "success"
            }, status=status.HTTP_200_OK)


