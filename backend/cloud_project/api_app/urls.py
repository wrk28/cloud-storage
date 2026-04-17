from django.urls import path
from api_app.views import UserView


urlpatterns = [
    path('users/', UserView.as_view()),
]