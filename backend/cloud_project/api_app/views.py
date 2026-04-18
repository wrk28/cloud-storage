from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from api_app.models import File
from django.db.models import Count, Sum
from api_app.serializers import UserListSerializer, UserPatchSerializer, FileListSerializer, FilePatchSerializer, FileUploadSerializer
from api_app.permissions import IsStaffUser
from django.conf import settings
from django.http import FileResponse


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
    

    def _delete_user_files(self, user_id):
        pass
        
        
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
        self._delete_user_files(user_id)
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
    

    def _delete_file_from_storage(self, file_id):
        pass


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
        self._delete_file_from_storage(file_id)
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
        storage = settings.MEDIA_DIR + name
        link = str(uuid.uuid4())[:8]
        size = file.size
        with open(storage, 'wb+') as p:
            for chunk in file.chunks():   
                p.write(chunk)
        data = {
            'user': user,
            'name': name,
            'storage': storage,
            'link': link,
            'description': description,
            'size': size
        }
        serializer = FileUploadSerializer(data=data)
        if serializer.is_valid():
            serializer.save();
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class FileDownloadView(APIView):

    def get(self, request):
        import os
        file_id = request.query_params.get('file_id')
        file = File.objects.get(pk=file_id)
        path = file.storage
        name = file.name
        if os.path.exists(path):
            response = FileResponse(open(path, 'rb'), as_attachment=True, filename=name)
            return response
        else:
            return Response({
                'message': 'File not found',
                'status': 'error'
            }, status=status.HTTP_404_NOT_FOUND)





    

