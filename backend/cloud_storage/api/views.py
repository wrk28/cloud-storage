from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from api.models import File
from django.db.models import Count, Sum
from api.serializers import UserListSerializer, UserPatchSerializer, FileListSerializer, FilePatchSerializer, FileUploadSerializer
from api.permissions import IsStaffUser
from django.conf import settings
from django.http import FileResponse
from django.utils import timezone
import os
from pathlib import Path


class UserView(APIView):

    #permission_classes = [IsStaffUser, IsAuthenticated]

    def get(self, request):
        users = User.objects.annotate(
            file_count=Count('file'),
            total_size=Sum('file__size'))
        serializer = UserListSerializer(users, many=True)
        data = serializer.data
        return Response({
            'data': data,
            'message': 'Get data successfully',
            'status': 'success'
        },
        status=status.HTTP_200_OK)
        
        
    def delete(self, request):
        user_id = request.query_params.get('user_id');
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({
                'message': 'User is not found',
                'status': 'error'
            },
            status=status.HTTP_404_NOT_FOUND)
        if user.is_superuser:
            return Response({
                'message': 'Forbidden',
                'status': 'error'
            },
            status=status.HTTP_403_FORBIDDEN)
        user.delete()
        try:
            _delete_user_files(user_id)
        except RuntimeError as e:
            return Response({
                "message": f"Error when delete user, {e}",
                "status": "error"
                },
            status=status.HTTP_409_CONFLICT)
        return Response({
            'message': 'User record was deleted',
            'status': 'success'
        },
        status=status.HTTP_200_OK)


    def patch(self, request):
        user_id = request.query_params.get('user_id');
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({
                'message': 'User is not found',
                'status': 'error'
            },
            status=status.HTTP_404_NOT_FOUND)
        if user.is_superuser:
            return Response({
                'message': 'Forbidden',
                'status': 'error'
            },
            status=status.HTTP_403_FORBIDDEN)
        serializer = UserPatchSerializer(user, request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FileView(APIView):

    #permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get('user_id');
        files = File.objects.filter(user=user_id)
        serializer = FileListSerializer(files, many=True)
        data = serializer.data
        return Response({
            'data': data,
            'message': 'Get data successfully',
            'status': 'success'
        },
        status=status.HTTP_200_OK)
            

    def delete(self, request):
        file_id = request.query_params.get('file_id')
        try:
            file = File.objects.get(pk=file_id)
        except File.DoesNotExist:
            return Response({
                'message': 'File is not found',
                'status': 'error'
            },
            status=status.HTTP_404_NOT_FOUND)
        path = file.path
        try:
            _delete_file_from_storage(path)
        except RuntimeError as e:
            return Response({
                "message": f"Error when delete file, {e}", 
                "status": "error"}, 
                status=status.HTTP_409_CONFLICT)
        file.delete()
        return Response({
            'message': 'File was deleted',
            'status': 'success'
        },
        status=status.HTTP_200_OK)


    def patch(self, request):
        file_id = request.query_params.get('file_id');
        try:
            file = File.objects.get(pk=file_id)
        except File.DoesNotExist:
            return Response({
                'message': 'File is not found',
                'status': 'error'
            },
            status=status.HTTP_404_NOT_FOUND)
        serializer = FilePatchSerializer(file, request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FileUploadView(APIView):

    def post(self, request):
        import uuid
        user = request.query_params.get('user_id')
        file = request.FILES.get('file')
        name = str(uuid.uuid4())[:6] + '_' + request.data.get('file_name')
        description = request.data.get('description')
        path = settings.MEDIA_DIR + name
        link = str(uuid.uuid4())[:8]
        size = file.size
        with open(path, 'wb+') as p:
            for chunk in file.chunks():   
                p.write(chunk)
        data = {
            'user': user,
            'name': name,
            'path': path,
            'link': link,
            'description': description,
            'size': size
        }
        serializer = FileUploadSerializer(data=data)
        if serializer.is_valid():
            serializer.save();
            return Response({"messagge": "Success", "status": "success"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class FileDownloadView(APIView):

    def get(self, request):
        file_id = request.query_params.get('file_id')
        file = File.objects.get(pk=file_id)
        path = file.path
        name = file.name
        if os.path.exists(path):
            file.last_download = timezone.now()
            file.save()
            response = FileResponse(open(path, 'rb'), as_attachment=True, filename=name)
            return response
        else:
            return Response({
                'message': 'File not found',
                'status': 'error'
            }, status=status.HTTP_404_NOT_FOUND)
        
class FileExternalDownload(APIView):
    def get(self, request):
        link = request.query_params.get('link')
        file = File.objects.get(link=link)
        path = file.path
        name = file.name
        if os.path.exists(path):
            file.last_download = timezone.now()
            file.save()
            response = FileResponse(open(path, 'rb'), as_attachment=True, filename=name)
            return response
        else:
            return Response({
                'message': 'File not found',
                'status': 'error'
            }, status=status.HTTP_404_NOT_FOUND)


def _delete_file_from_storage(path):
    folder_path = Path(settings.MEDIA_DIR).resolve()
    file_path = Path(path).resolve()
    if not os.path.exists(path):
        raise RuntimeError("File not found")
    if not file_path.relative_to(folder_path):
        raise RuntimeError("Wrong path")
    os.remove(path)


def _delete_user_files(user_id):
        path_list = list(File.objects.values_list('path', flat=True))
        print(path_list)
        File.objects.filter(user_id=user_id).delete();
        for path in path_list:
            _delete_file_from_storage(path)



    

