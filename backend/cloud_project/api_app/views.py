from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from django.db.models import Count, Sum
from api_app.serializers import UserListSerializer, UserPatchSerializer
from api_app.permissions import IsStaffUser

class UserView(APIView):

    #permission_classes = [IsStaffUser, IsAuthenticated]


    def get(self, request):
        #users = User.objects.all()
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
        id = request.query_params.get('id');

        try:
            user = User.objects.get(pk=id)
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
        return Response({
            'message': 'User record was deleted',
            'status': 'success'
        },
        status=status.HTTP_200_OK)


    def patch(self, request):
        id = request.query_params.get('id');
        try:
            user = User.objects.get(pk=id)
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
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)


    

