from django.urls import path
from api.views import UserView, FileView, \
    FileUploadView, FileDownloadView, FileExternalDownload, FilePreviewView


urlpatterns = [
    path('users/', UserView.as_view()),
    path('files/', FileView.as_view()),
    path('upload/', FileUploadView.as_view()),
    path('download/', FileDownloadView.as_view()),
    path('download/external/', FileExternalDownload.as_view()),
    path('preview/', FilePreviewView.as_view())
]