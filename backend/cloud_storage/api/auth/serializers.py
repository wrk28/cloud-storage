from django.contrib.auth.models import User
from rest_framework import serializers
from re import match


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(slef, validate_data):
        user = User.objects.create_user(
            username=validate_data['username'],
            password=validate_data['password'],
            email=validate_data['email'],
            first_name=validate_data['first_name'],
            last_name=validate_data['last_name'],
        )
        return user
    
    def validate(self, data):
        print(data)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        username_pattern = r'^[A-Za-z][A-Za-z0-9]{3,19}$'
        email_pattern = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        password_pattern = r'^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};\'":\\|,.<>\/?]).{6,}$'
        if not self._check(username_pattern, username):
            raise serializers.ValidationError({"detail": "Error username validation"})   
        if not self._check(email_pattern, email):
            raise serializers.ValidationError({"detail": "Error email validation"})  
        if not self._check(password_pattern, password):
            raise serializers.ValidationError({"detail": "Error username validation"}) 
        return data

    def _check(self, pattern, value):        
        if match(pattern, value) is not None:
            return True