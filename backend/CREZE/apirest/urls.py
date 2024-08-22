from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

drf_router = routers.DefaultRouter()

app_name = 'apirest'

urlpatterns = [
    # Incluye las URLs específicas para JWT de la app usuarios
    path('users', include('usuarios.urls')),  # Esto incluirá todas las URLs definidas en usuarios/urls.py
    # URLs del router
    path('', include(drf_router.urls)),  # Incluye las URLs del router
]

urlpatterns += drf_router.urls