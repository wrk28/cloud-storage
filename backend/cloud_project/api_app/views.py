from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status
from api_app.models import User
from api_app.serializers import UserSerializer

class UserModelViewSet(APIView):

    permission_classes = [IsAdminUser, IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        data = serializer.data
        return Response({
            'data': data,
            'message': 'Get data successfully',
            'status': 'Success'
        },
        status=status.HTTP_200_OK)
        
    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            Response({
                'message': 'User is not found',
                'status': 'error'
            },
            status=status.HTTP_404_NOT_FOUND)
        user.delete()
        Response({
            'message': 'User record was deleted',
            'status': 'success'
        },
        status=status.HTTP_200_OK)

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            Response({
                'message': 'User is not found',
                'status': 'error'
            },
            status=status.HTTP_404_NOT_FOUND)
        is_admin = request.data.get('is_admin')
        if isinstance(is_admin, bool):
            user.is_admin = is_admin
            user.save()
            Response({
                'message': 'User admin staus was updated',
                'status': 'success'
            },
            status=status.HTTP_200_OK)
        else:
            Response({
                'message': 'Admin status must be bool type',
                'status': 'error'
            },
            status=status.HTTP_400_BAD_REQUEST)


    

