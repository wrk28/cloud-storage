from django.urls import path
from api.auth.views import RegisterView, LoginView, LogoutView, get_csrf_token


urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('login/csrf/', get_csrf_token)
]