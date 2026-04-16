from django.urls import path
from api_app.views import ListUsers

urlpatterns = [
    path('users/', ListUsers.as_view())
]