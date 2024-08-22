import boto3
from io import BytesIO
from CREZE import settings
from .models import User, Documento
from .serializers import UserSerializer, DocumentSerializer
from rest_framework.parsers import JSONParser
from .permissions import IsAuthenticatedAndObjUserOrIsStaff
from rest_framework import exceptions
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken, TokenBackendError
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser


class UserViewSet(viewsets.ModelViewSet):
    parser_classes = [JSONParser]
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedAndObjUserOrIsStaff]
    http_method_names = ['get', 'options', 'head']

    # Define the queryset
    queryset = User.objects.all()

    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()
        elif self.request.user.is_staff:
            return User.objects.all()
        elif self.request.user.is_authenticated:
            return User.objects.filter(pk=self.request.user.pk)
        else:
            raise exceptions.PermissionDenied('Forbidden')

class RegisterViewSet(viewsets.ViewSet):
    http_method_names = ['post', 'options', 'head']
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'status': '201'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AuthTokenViewset(viewsets.ViewSet):
    http_method_names = ['post', 'options', 'head']
    permission_classes = [AllowAny]

    def create(self, request):
        view = TokenObtainPairView.as_view()
        try:
            response = view(request._request)
            data = response.data
            if 'refresh' in data and 'access' in data:
                return Response({
                    'refresh': data['refresh'],
                    'access': data['access'],
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid response from token view'}, status=status.HTTP_400_BAD_REQUEST)
        except TokenError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except InvalidToken as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except TokenBackendError as e:
            return Response({'error': 'Token backend error'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class TokenRefreshViewSet(viewsets.ViewSet):
    http_method_names = ['post', 'options', 'head']
    permission_classes = [AllowAny]


    def create(self, request):
        view = TokenRefreshView.as_view()
        try:
            response = view(request._request)
            data = response.data

            if 'access' in data:
                return Response({
                    'access': data['access'],
                    'refresh': data['refresh'],
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid response from token view',
                    'details': data
                }, status=status.HTTP_400_BAD_REQUEST)
        except TokenError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticatedAndObjUserOrIsStaff]
    parser_classes = [MultiPartParser, FormParser]
    http_method_names = ['post', 'options', 'head', 'get']

    def get_queryset(self):
        if self.request.user.is_superuser or self.request.user.is_staff:
            return Documento.objects.all()
        elif self.request.user.is_authenticated:
            return Documento.objects.filter(user=self.request.user)
        else:
            raise exceptions.PermissionDenied('Forbidden')


    def create(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "File is required"}, status=status.HTTP_400_BAD_REQUEST)

        fragment_size = 1024 * 1024  # 1 MB
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                 aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)

        file_name = file.name

        for i, chunk in enumerate(self.chunkify(file, fragment_size)):
            chunk_io = BytesIO(chunk)
            fragment_name = f"{file_name}_part_{i}"
            s3_client.upload_fileobj(chunk_io, settings.AWS_S3_BUCKET_NAME, fragment_name)

        serializer = self.get_serializer(data={
            'file_name': file_name,
            'original_size': file.size,
            'status': 'Uploaded',
            'user': request.user.id
        })
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def chunkify(self, file, size):
        while True:
            chunk = file.read(size)
            if not chunk:
                break
            yield chunk
