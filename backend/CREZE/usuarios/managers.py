from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken as BaseRefreshToken
from rest_framework.exceptions import AuthenticationFailed


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if not password:
            password = BaseUserManager.make_random_password(self)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except InvalidToken as e:
            if 'refresh' in str(e):
                raise AuthenticationFailed('Refresh token is invalid or expired. Please log in again.')
            else:
                raise AuthenticationFailed('Access token is invalid. Please refresh your token.')
        except TokenError as e:
            raise AuthenticationFailed(f'Token error: {str(e)}')
        except Exception as e:
            raise AuthenticationFailed(f'Error processing token: {str(e)}')


class CustomRefreshToken(BaseRefreshToken):
    def verify(self):
        try:
            super().verify()
        except TokenError as e:
            if 'refresh' in str(e):
                raise TokenError('Refresh token is invalid or expired. Please log in again.')
            else:
                raise TokenError(f'Token error: {str(e)}')

    def get_new_access_token(self):
        try:
            access_token = self.access_token
            return str(access_token)
        except TokenError as e:
            raise TokenError(f'Error generating new access token: {str(e)}')
