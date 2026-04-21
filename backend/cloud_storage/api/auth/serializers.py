from django.contrib.auth.models import User
from rest_framework import serializers
from re import match


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name', 'is_staff')

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
        username = data.get('username')
        username_pattern = r'^[A-Za-z][A-Za-z0-9]{3,19}$'
        self._check(username_pattern, username, "Error username validation")   
        
        email = data.get('email')
        email_pattern = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        self._check(email_pattern, email, "Error email validation")  

        password = data.get('password')
        password_pattern = r'^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};\'":\\|,.<>\/?]).{6,}$'
        self._check(password_pattern, password, "Error password validation") 
        return data

    def _check(self, pattern, value, message):        
        if match(pattern, value) is None:
            raise serializers.ValidationError({"detail": f"{message}"})