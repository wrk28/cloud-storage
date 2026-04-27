from rest_framework import generics, status
from api.auth.serializers import RegisterSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt

from django.views.generic.edit import FormView
from django.contrib.auth.forms import AuthenticationForm

from django.http import JsonResponse

class LoginView(FormView):
    form_class = AuthenticationForm
    template_name = 'login.html'
    success_url = '/'

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        # CSRF cookie is automatically set if middleware is enabled
        return response

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class LoginView(APIView):

    @csrf_exempt
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
                    "user_id": user.id,
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
    

def get_csrf_token(request):
    csrftoken = get_token(request)
    return JsonResponse({'csrftoken': csrftoken})


