from rest_framework import generics, status
from api.auth.serializers import RegisterSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.views import APIView


class RegisterView(generics.CreateAPIView):
    serializer = RegisterSerializer


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username');
        password = request.data.get('password');
        user = authenticate(request=request, username=username, password=password)
        if user is not None:
            login(request, user);
            return Response({
                "message": "Success login",
                "status": "Success"
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "message": "Incalid credentials",
                "status": "error"
            }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({
                "message": "Success logot",
                "status": "Success"
            }, status=status.HTTP_200_OK)


