import boto3
import json
from io import BytesIO
from CREZE import settings
from .models import User, Documento
from .serializers import UserSerializer, DocumentSerializer
from rest_framework.parsers import JSONParser
from .permissions import IsAuthenticatedAndObjUserOrIsStaff
from rest_framework import exceptions
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken, TokenBackendError
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
import urllib.parse
from rest_framework_simplejwt.tokens import UntypedToken
from usuarios.managers import CustomRefreshToken
from rest_framework.decorators import action

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

class Logout(viewsets.ViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticatedAndObjUserOrIsStaff]
    parser_classes = [MultiPartParser, FormParser]
    http_method_names = ['post', 'options', 'head']

    def create(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = CustomRefreshToken(refresh_token)
            token.blacklist()

            return Response({'token': 'Delete token'}, status=status.HTTP_205_RESET_CONTENT)

        except TokenError as e:
            return Response({'error':'El token ya se encuentra en la lista negra'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RegisterViewSet(viewsets.ViewSet):
    http_method_names = ['post', 'options', 'head']
    permission_classes = [AllowAny]

    def create(self, request):
        print(request.data['username'],' data')
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
    permission_classes = [AllowAny]

    def create(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

            refresh = CustomRefreshToken(refresh_token)
            print('pasando')
            refresh.verify()
            access_token = refresh.get_new_access_token()  # Obtiene un nuevo access token

            data = {
                'access': access_token,
                'refresh': str(refresh)
            }
            return Response(data, status=status.HTTP_200_OK)
        except TokenError as e:
             return Response({'error': 'Refresh token is invalid.'},
                                status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': f'Unexpected error occurred: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


class TokenVerifyViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def verify(self, request):
        token = request.data.get('token')
        try:
            UntypedToken(token)
        except InvalidToken as e:
            print('Invalid token error:', e)
            return Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except TokenError as e:
            print('Token error:', e)
            return Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print('General error:', e)
            return Response({'detail': 'Unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'detail': 'Token is valid'}, status=status.HTTP_200_OK)

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticatedAndObjUserOrIsStaff]
    parser_classes = [MultiPartParser, FormParser]
    http_method_names = ['post', 'options', 'head', 'get', 'delete']

    def get_queryset(self):
        if self.request.user.is_superuser or self.request.user.is_staff:
            return Documento.objects.all()
        elif self.request.user.is_authenticated:
            return Documento.objects.filter(user=self.request.user)
        else:
            raise exceptions.PermissionDenied('Forbidden')

    def create(self, request, *args, **kwargs):
        archivos = request.FILES.getlist('file')
        if not archivos:
            return Response({"error": "Files are required"}, status=status.HTTP_400_BAD_REQUEST)



        fragment_size = 1024 * 1024  # 1 MB
        s3_client = boto3.client('s3',
                                 aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                 aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                 region_name='us-east-2'
                                 )
        responses = []

        for file in archivos:
            file_name = file.name

            if Documento.objects.filter(file_name=file_name, user=request.user.id).exists():
                return Response({
                    'nombre': ['Ya existe un archivo con ese nombre!'],
                    'archivo': [f'{file_name}']
                }, status=status.HTTP_400_BAD_REQUEST)

            fragment_keys = []  # Para almacenar los nombres de los fragmentos

            for i, chunk in enumerate(self.chunkify(file, fragment_size)):
                print('entrando al for')
                chunk_io = BytesIO(chunk)
                fragment_name = f"{file_name}_part_{i}"
                s3_client.upload_fileobj(chunk_io, settings.AWS_S3_BUCKET_NAME, fragment_name)

            lambda_client = boto3.client('lambda', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
            lambda_payload = {
                'bucket': settings.AWS_S3_BUCKET_NAME,
                'fragments': fragment_keys,
                'final_file_name': file_name
            }

            lambda_response = lambda_client.invoke(
                FunctionName=f'{settings.AWS_S3_LAMBDA_NAME}',
                InvocationType='RequestResponse',
                Payload=json.dumps(lambda_payload)
            )
            lambda_result = json.loads(lambda_response['Payload'].read())

            if 'error' in lambda_result:
                return Response({'error': lambda_result['error']}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            url_documento = lambda_result['url']

            serializer = self.get_serializer(data={
                'file_name': file_name,
                'original_size': file.size,
                'status': 'Uploaded',
                'url_document': url_documento,
                'user': request.user.id,
                'name_document': file.name
            })

            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            responses.append(serializer.data)

        return Response(responses, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        documento = self.get_object()

        if documento.user != request.user and not request.user.is_staff:
            return Response({'error': 'No tienes permiso para eliminar este documento.'}, status=status.HTTP_403_FORBIDDEN)


        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                 aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        try:
            s3_client.delete_object(Bucket=settings.AWS_S3_BUCKET_NAME, Key=documento.file_name)
        except Exception as e:
            return Response({'error': f'Error al eliminar el archivo: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        documento.delete()

        return Response({'message': 'Documento eliminado exitosamente.'}, status=status.HTTP_204_NO_CONTENT)

    def chunkify(self, file, size):
        while True:
            chunk = file.read(size)
            if not chunk:
                break
            yield chunk

