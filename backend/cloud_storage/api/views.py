from django.contrib.auth.models import User
from django.db.models import Count, Sum
from django.conf import settings
from django.http import FileResponse
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from api.models import File
from api.permissions import IsAdminUser, IsAdminOrAuthor
from api.serializers import UserListSerializer, UserPatchSerializer, \
    FileListSerializer, FilePatchSerializer, FileUploadSerializer
from api.lib.services import delete_file_from_storage, delete_user_files
import os
import logging

logger = logging.getLogger(__name__);

class UserView(APIView):

    #permission_classes = [IsAdminUser, IsAuthenticated]

    def get(self, request):
        users = User.objects.annotate(
            file_count=Count('file'),
            total_size=Sum('file__size'))
        serializer = UserListSerializer(users, many=True)
        data = serializer.data
        logger.info("info: Getting user list")
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
        except User.DoesNotExist as e:
            logger.error(f"Error: {e}")
            return Response({
                'message': 'User is not found',
                'status': 'error'
            },
            status=status.HTTP_404_NOT_FOUND)
        if user.is_superuser:
            logger.warning("Warning: Trying to delete superuser")
            return Response({
                'message': 'Forbidden',
                'status': 'error'
            },
            status=status.HTTP_403_FORBIDDEN)
        user.delete()
        try:
            delete_user_files(user_id)
        except RuntimeError as e:
            logger.error(f"Error: {e}")
            return Response({
                "message": f"Error when delete user, {e}",
                "status": "error"
                },
            status=status.HTTP_409_CONFLICT)
        logger.info("Info: Deleting user record")
        return Response({
            'message': 'User record was deleted',
            'status': 'success'
        },
        status=status.HTTP_200_OK)

    def patch(self, request):
        user_id = request.query_params.get('user_id');
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist as e:
            logger.error(f"Error: {e}")
            return Response({
                'message': 'User is not found',
                'status': 'error'
            },
            status=status.HTTP_404_NOT_FOUND)
        if user.is_superuser:
            logger.warning("Warning: Trying to delete superuser")
            return Response({
                'message': 'Forbidden',
                'status': 'error'
            },
            status=status.HTTP_403_FORBIDDEN)
        serializer = UserPatchSerializer(user, request.data, partial=True)
        if serializer.is_valid():
            logger.info("Info: Changing user status")
            serializer.save()
            return Response(serializer.data)
        else:
            logger.error(f"Error: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FileView(APIView):

    #permission_classes = [IsAuthenticated, IsAdminOrAuthor]

    def get(self, request):
        user_id = request.query_params.get('user_id');
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist as e:
            logger.error(f"Error: {e}")
            return Response({
                'message': 'User is not found',
                'status': 'error'
            },
            status=status.HTTP_404_NOT_FOUND)
        #self.check_object_permissions(request, self, user)
        files = File.objects.filter(user=user_id)
        serializer = FileListSerializer(files, many=True)
        data = serializer.data
        logger.info("Info: Getting file list")
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
            #self.check_object_permissions(request, self, file)
        except File.DoesNotExist as e:
            logger.error(f"Error: {e}")
            return Response({
                'message': 'File is not found',
                'status': 'error'
            },
            status=status.HTTP_404_NOT_FOUND)
        path = file.path
        try:
            delete_file_from_storage(path)
        except RuntimeError as e:
            logger.error(f"Error: {e}")
            return Response({
                "message": f"Error when delete file, {e}", 
                "status": "error"}, 
                status=status.HTTP_409_CONFLICT)
        file.delete()
        logger.info("Info: Deliting file")
        return Response({
            'message': 'File was deleted',
            'status': 'success'
        },
        status=status.HTTP_200_OK)

    def patch(self, request):
        file_id = request.query_params.get('file_id');
        try:
            file = File.objects.get(pk=file_id)
            #self.check_object_permissions(request, self, file)
        except File.DoesNotExist as e:
            logger.error(f"Error: {e}")
            return Response({
                'message': 'File is not found',
                'status': 'error'
            },
            status=status.HTTP_404_NOT_FOUND)
        serializer = FilePatchSerializer(file, request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info("Info: Changing file description")
            return Response(serializer.data)
        else:
            logger.error(f"Error: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FileUploadView(APIView):

    #permission_classes = [IsAuthenticated]

    def post(self, request):
        import uuid
        user = request.user.id
        file = request.FILES.get('file')
        name = request.data.get('file_name')
        description = request.data.get('description')
        path = settings.MEDIA_DIR + str(uuid.uuid4())[:6] + '_' + name
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
            logger.info("Info: Uploading file")
            return Response({"messagge": "success", "status": "success"}, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Error: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class FileDownloadView(APIView):

    #permission_classes = [IsAuthenticated, IsAdminOrAuthor]

    def get(self, request):
        file_id = request.query_params.get('file_id')
        try:
            file = File.objects.get(pk=file_id)
            #self.check_object_permissions(request, self, file)
        except File.DoesNotExist as e:
            logger.error(f"Error: {e}")
            return Response({
                'message': 'File is not found',
                'status': 'error'
            },
            status=status.HTTP_404_NOT_FOUND)
        path = file.path
        name = file.name
        if os.path.exists(path):
            file.last_download = timezone.now()
            file.save()
            response = FileResponse(open(path, 'rb'), as_attachment=True, filename=name)
            logger.info("Info: Downloading file")
            return response
        else:
            logger.error(f"Error: Cannot find the file")
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
            logger.info("Info: Downloading file with a link")
            return response
        else:
            logger.error(f"Error: Cannot find the file")
            return Response({
                'message': 'File not found',
                'status': 'error'
            }, status=status.HTTP_404_NOT_FOUND)
