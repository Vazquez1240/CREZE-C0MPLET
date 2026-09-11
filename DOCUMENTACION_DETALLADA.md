# DOCUMENTACIÓN TÉCNICA DETALLADA - PROYECTO CREZE

---

## 1. Visión General y Arquitectura del Sistema

El proyecto **CREZE** es una plataforma full-stack orientada a la ingesta, fragmentación, almacenamiento seguro en la nube y gestión de documentos pesados.

### Diagrama de Arquitectura de Ingesta y Reconstrucción de Archivos

```
+-----------------------------------------------------------------------------------+
|                                  CLIENTE (React)                                  |
|   1. Selecciona archivo(s)                                                       |
|   2. Envía FormData a POST /rest/v1/document-upload/                             |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                           BACKEND (Django REST Framework)                         |
|   1. Valida autenticación JWT y permisos del usuario.                            |
|   2. Verifica si el usuario ya posee un archivo con el mismo nombre.               |
|   3. Divide el archivo en partes de 20MB (Chunkify).                              |
|   4. Sube cada parte directamente al bucket S3 con nombres "{file_name}_part_{i}".|
|   5. Invoca la función AWS Lambda pasando el nombre del bucket, fragmentos        |
|      y nombre final.                                                              |
+-----------------------------------------------------------------------------------+
                       |                                         |
    (Sube fragmentos)  |                                         | (Invoca Lambda)
                       v                                         v
+-----------------------------------+             +---------------------------------+
|          AWS S3 BUCKET            |             |        AWS LAMBDA FUNCTION      |
|                                   |             |                                 |
| - archivo_part_0                  |             | 1. Descarga/combina fragmentos. |
| - archivo_part_1                  |             | 2. Guarda el archivo unificado  |
| - archivo_part_2                  |             |    en S3.                       |
|                                   |<------------| 3. Elimina fragmentos y genera  |
| - archivo.pdf (Reconstruído)      |   (Guarda   |    URL firmada/pública.         |
|                                   |  resultado) | 4. Devuelve payload JSON        |
|                                   |             |    al backend.                  |
+-----------------------------------+             +---------------------------------+
                                                                 |
                                                                 | (Respuesta de Lambda)
                                                                 v
+-----------------------------------------------------------------------------------+
|                           BACKEND (Django REST Framework)                         |
|   1. Recibe la URL del archivo de Lambda.                                         |
|   2. Guarda el registro en la base de datos (Modelo `Documento`).                  |
|   3. Retorna la respuesta HTTP 201 Created al cliente.                            |
+-----------------------------------------------------------------------------------+
```

---

## 2. Modelos de Datos (Database Schema)

El backend utiliza Django ORM con soporte para la app `usuarios`. Los modelos principales son:

### Modelo `User` (`usuarios.User`)
Hereda de `django.contrib.auth.models.AbstractUser`.

| Campo | Tipo | Restricciones / Descripción |
| :--- | :--- | :--- |
| `id` | AutoField | Clave Primaria. |
| `email` | EmailField | Único, utilizado como `USERNAME_FIELD` para autenticación. |
| `username` | CharField | Máx 150 caracteres, validado por `UnicodeUsernameValidator`. |
| `safe_delete` | BooleanField | Flag de borrado lógico (default: `False`). |
| `documentos` | ManyToManyField | Relación opcional con `Documento` (`related_name='usuarios'`). |

### Modelo `Documento` (`usuarios.Documento`)

| Campo | Tipo | Restricciones / Descripción |
| :--- | :--- | :--- |
| `id` | AutoField | Clave Primaria. |
| `user` | ForeignKey | Relación a `User` (on_delete=CASCADE). |
| `file_name` | CharField | Nombre del archivo guardado en S3 (máx 255 chars). |
| `name_document` | CharField | Nombre original del documento subido. |
| `original_size` | PositiveIntegerField | Tamaño en bytes del archivo. |
| `uploaded_at` | DateTimeField | Fecha y hora de creación (`auto_now_add=True`). |
| `url_document` | URLField | URL encoded para descargar el archivo en S3. |
| `status` | CharField | Estado del archivo (e.g. `'Uploaded'`, `'Pending'`). |

*Constraint Unico*: `UniqueConstraint(fields=('user', 'file_name'), name='unique_document')` para prevenir duplicados por usuario.

---

## 3. Especificación de Endpoints de la API REST

Todas las URLs base están prefijadas por `/rest/v1/`.

### Autenticación y Usuarios

#### 1. Registrar Usuario
- **Ruta**: `POST /rest/v1/register/`
- **Permisos**: `AllowAny`
- **Payload de Solicitud**:
  ```json
  {
    "username": "usuario123",
    "email": "usuario@ejemplo.com",
    "password": "PasswordSeguro123!",
    "password2": "PasswordSeguro123!"
  }
  ```
- **Respuesta Exitosa (201 Created)**:
  ```json
  {
    "status": "201"
  }
  ```

#### 2. Iniciar Sesión (Obtener JWT)
- **Ruta**: `POST /rest/v1/login/`
- **Permisos**: `AllowAny`
- **Payload de Solicitud**:
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "PasswordSeguro123!"
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "access": "<access_token_jwt>",
    "refresh": "<refresh_token_jwt>"
  }
  ```

#### 3. Refrescar Token de Acceso
- **Ruta**: `POST /rest/v1/refresh-token/`
- **Permisos**: `AllowAny`
- **Payload de Solicitud**:
  ```json
  {
    "refresh": "<refresh_token_jwt>"
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "access": "<nuevo_access_token_jwt>",
    "refresh": "<nuevo_refresh_token_jwt>"
  }
  ```

#### 4. Verificar Token
- **Ruta**: `POST /rest/v1/users/verify-token/verify/`
- **Permisos**: `AllowAny`
- **Payload de Solicitud**:
  ```json
  {
    "token": "<access_token_jwt>"
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "detail": "Token is valid"
  }
  ```

#### 5. Cerrar Sesión (Blacklist Refresh Token)
- **Ruta**: `POST /rest/v1/logout/`
- **Permisos**: `IsAuthenticatedAndObjUserOrIsStaff`
- **Header**: `Authorization: Bearer <access_token_jwt>`
- **Payload de Solicitud**:
  ```json
  {
    "refresh": "<refresh_token_jwt>"
  }
  ```
- **Respuesta Exitosa (205 Reset Content)**:
  ```json
  {
    "token": "Delete token"
  }
  ```

---

### Gestión de Documentos

#### 1. Subir Documento(s)
- **Ruta**: `POST /rest/v1/document-upload/`
- **Permisos**: `IsAuthenticated`
- **Header**: `Authorization: Bearer <access_token_jwt>`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: Archivo o lista de archivos binarios.
- **Respuesta Exitosa (201 Created)**:
  ```json
  [
    {
      "id": 1,
      "file_name": "reporte.pdf",
      "original_size": 10485760,
      "uploaded_at": "2023-10-24T12:00:00Z",
      "url_document": "https://bucket-name.s3.amazonaws.com/reporte.pdf",
      "status": "Uploaded",
      "name_document": "reporte.pdf",
      "user": 1
    }
  ]
  ```

#### 2. Listar Documentos
- **Ruta**: `GET /rest/v1/document-upload/?page=1`
- **Permisos**: `IsAuthenticated`
- **Header**: `Authorization: Bearer <access_token_jwt>`
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 1,
        "file_name": "reporte.pdf",
        "original_size": 10485760,
        "uploaded_at": "2023-10-24T12:00:00Z",
        "url_document": "https://bucket-name.s3.amazonaws.com/reporte.pdf",
        "status": "Uploaded",
        "name_document": "reporte.pdf",
        "user": 1
      }
    ]
  }
  ```

#### 3. Eliminar Documento
- **Ruta**: `DELETE /rest/v1/document-upload/{id}/`
- **Permisos**: `IsAuthenticated` (Propietario del documento o Staff)
- **Header**: `Authorization: Bearer <access_token_jwt>`
- **Respuesta Exitosa (204 No Content)**:
  ```json
  {
    "message": "Documento eliminado exitosamente."
  }
  ```

---

## 4. Arquitectura Frontend (React + MobX)

El frontend sigue una estructura modular y orientada a componentes.

### Estructura de Capas
- **`src/api/api.ts`**: Cliente de comunicación HTTP con Axios.
- **`src/stores/`**:
  - `userData.ts`: Tienda MobX para la sesión del usuario (`email`, `access_token`, `refresh_token`, estado de autenticación y sincronización con `localStorage`).
  - `UserDocs.ts`: Tienda MobX para gestionar la selección temporal de archivos subidos antes del envío al servidor.
- **`src/pages/`**:
  - `Home.tsx`: Landing page e inicio de sesión.
  - `Main.tsx`: Dashboard principal con rutas anidadas.
  - `Registro.tsx`: Formulario de registro de nuevo usuario.
  - `Error.tsx`: Página de error general.
- **`src/components/dashboard/`**:
  - `SubirArchivo/`: Componente Drag & Drop para seleccionar y cargar archivos.
  - `updateDocument.tsx`: Vista de historial y tabla de documentos subidos con opción de descarga y eliminación.

---

## 5. Pruebas y Calidad de Código

### Backend (Django)
Para ejecutar el suite de pruebas del backend:
```bash
cd backend/CREZE
python manage.py test
```

### Frontend (React)
Para ejecutar el runner de pruebas del frontend:
```bash
cd frontend/creze-frontend
CI=true npm test
```
