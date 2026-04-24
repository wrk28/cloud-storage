from django.conf import settings
import os
from pathlib import Path
from api.models import File


def delete_file_from_storage(path):
    folder_path = Path(settings.MEDIA_DIR).resolve()
    file_path = Path(path).resolve()
    if not os.path.exists(path):
        raise RuntimeError("File not found")
    if not file_path.relative_to(folder_path):
        raise RuntimeError("Wrong path")
    os.remove(path)


def delete_user_files(user_id):
        path_list = list(File.objects.values_list('path', flat=True))
        File.objects.filter(user_id=user_id).delete();
        for path in path_list:
            delete_file_from_storage(path)