from django.urls import path
from api_app.views import UserView, FileView, FileUploadView, FileDownloadView


urlpatterns = [
    path('users/', UserView.as_view()),
    path('files/', FileView.as_view()),
    path('upload/', FileUploadView.as_view()),
    path('download/', FileDownloadView.as_view())
]