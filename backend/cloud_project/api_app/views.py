from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from api_app.serializers import UserSerializer
from api_app.permissions import IsStaffUser

class UserView(APIView):

    #permission_classes = [IsStaffUser, IsAuthenticated]


    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
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
        
        # is_staff = request.data.get('is_staff')

        serializer = UserSerializer(user, request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

        # if isinstance(is_staff, bool):
        #     user.is_staff = is_staff
        #     user.save()
        #     return Response({
        #         'message': 'User admin status was updated',
        #         'status': 'success'
        #     },
        #     status=status.HTTP_200_OK)
        # else:
        #     return Response({
        #         'message': 'Admin status must be bool type',
        #         'status': 'error'
        #     },
        #     status=status.HTTP_400_BAD_REQUEST)


    

