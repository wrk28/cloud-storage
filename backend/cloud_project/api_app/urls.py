from django.urls import path
from api_app.views import UserView, FileView, FileUploadView, FileDownloadView


urlpatterns = [
    path('users/', UserView.as_view()),
    path('files/', FileView.as_view()),
    path('files/upload/', FileUploadView.as_view()),
    path('files/download/', FileDownloadView.as_view())
]