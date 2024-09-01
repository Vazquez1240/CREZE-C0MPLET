from os.path import basename

from .viewsets import UserViewSet, AuthTokenViewset, TokenRefreshViewSet, DocumentViewSet, RegisterViewSet, TokenVerifyViewSet
from apirest.urls import drf_router
from django.urls import path

# Configuramos las urls de nuestra app usuarios
urlpatterns = [
]

drf_router.register(r'users', UserViewSet)
drf_router.register(r'login', AuthTokenViewset, basename='auth_token_login')
drf_router.register('refresh-token', TokenRefreshViewSet, basename='auth_token_refresh')
drf_router.register('document-upload', DocumentViewSet, basename='document_upload')
drf_router.register(r'register', RegisterViewSet, basename='user_register')
drf_router.register(r'/verify-token', TokenVerifyViewSet, basename='token_verify')

urlpatterns += drf_router.urls
