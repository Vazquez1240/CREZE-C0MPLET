# Proyecto CREZE - Sistema de Gestión e Ingesta de Documentos

Bienvenido al repositorio del proyecto **CREZE**. Este proyecto es una solución full-stack compuesta por un backend construído en **Django REST Framework (DRF)** integrado con servicios **AWS (S3 y Lambda)** para el almacenamiento y procesamiento distribuido de archivos por fragmentos (chunks), y un frontend moderno desarrollado en **React** con **TypeScript**, **MobX** y **Tailwind CSS**.

---

## 📐 Arquitectura General del Sistema

```
+------------------+         +--------------------------+         +----------------------------+
|                  |  HTTP   |                          |  Boto3  |                            |
|  Frontend React  | ------->|   Backend Django REST    | ------->|   AWS S3 Bucket (Chunks)   |
| (TypeScript/MobX)| <-------|        Framework         | <-------|                            |
+------------------+         +--------------------------+         +----------------------------+
                                          |                                     |
                                          | Invoke Lambda                       | Merges Chunks
                                          v                                     v
                             +--------------------------+         +----------------------------+
                             |   AWS Lambda Function    | ------->|  Archivo Reconstruído en   |
                             |   (Reconstrucción)       |         |         AWS S3             |
                             +--------------------------+         +----------------------------+
```

### Componentes Principales:
1. **Frontend (`frontend/creze-frontend`)**:
   - Interfaz de usuario construida con React 18, TypeScript, Tailwind CSS y componentes UI (MUI, Headless UI, Framer Motion).
   - Manejo de estado con MobX (`useUserData` para autenticación y `useDocsStores` para archivos).
   - Comunicación con la API backend a través de Axios.

2. **Backend (`backend/CREZE`)**:
   - Desarrollado con Python y Django REST Framework.
   - Autenticación JWT utilizando `djangorestframework-simplejwt` con rotación y blacklist de tokens de refresco.
   - Auditoría de modelos utilizando `django-auditlog`.
   - Documentación interactiva OpenAPI/Swagger mediante `drf-spectacular`.

3. **Integración AWS (S3 & Lambda)**:
   - **Carga en Fragmentos (Chunk Upload)**: Archivos subidos por el usuario son segmentados en fragmentos de 20 MB y subidos a S3.
   - **Reconstrucción asíncrona/vía Lambda**: Se invoca una función de AWS Lambda pasándole las llaves de los fragmentos, la cual los concatena en un único archivo final en S3 y devuelve la URL accesible.

---

## 📁 Estructura del Repositorio

```
.
├── backend/
│   └── CREZE/                # Código fuente del proyecto Django DRF
│       ├── apirest/          # Configuración de rutas principales API REST
│       ├── usuarios/         # App de usuarios, modelos, serializers, views y viewsets
│       ├── CREZE/            # Configuración global Django (settings, urls, wsgi/asgi)
│       ├── manage.py         # Script de gestión de Django
│       ├── requirements.txt  # Dependencias de Python
│       └── Dockerfile        # Dockerfile para contenedorización del backend
├── frontend/
│   └── creze-frontend/       # Código fuente de la aplicación React
│       ├── public/           # Archivos públicos y favicon
│       ├── src/
│       │   ├── api/          # Cliente HTTP y llamadas API REST
│       │   ├── components/   # Componentes reusables de React (Auth, Dashboard, etc.)
│       │   ├── pages/        # Páginas de la aplicación (Home, Main, Registro, Error)
│       │   ├── stores/       # Stores de MobX para estado global
│       │   └── App.js        # Configuración de rutas principales de React
│       ├── package.json      # Dependencias y scripts de Node.js
│       └── tailwind.config.js# Configuración de Tailwind CSS
├── README.md                 # Documentación general del repositorio
└── DOCUMENTACION_DETALLADA.md# Documentación técnica completa y detallada
```

---

## 🚀 Guía de Instalación y Ejecución Local

### Prerrequisitos
- **Python 3.10+**
- **Node.js 16+** y **npm**
- Cuenta de **AWS** configurada con S3 y Lambda (para entorno de producción o integración completa).

---

### 1. Configuración del Backend

1. Navega al directorio del backend:
   ```bash
   cd backend/CREZE
   ```

2. Crea y activa un entorno virtual de Python:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # En Linux/macOS
   # o en Windows: venv\Scripts\activate
   ```

3. Instala las dependencias del proyecto:
   ```bash
   pip install -r requirements.txt
   ```

4. Crea un archivo `.env` en la raíz del backend (`backend/CREZE/.env`) con las siguientes variables:
   ```env
   SECRET_KEY='django-insecure-tu-clave-secreta'
   SIGNING_KEY='tu-clave-para-jwt'
   AWS_ACCESS_KEY_ID='TU_AWS_ACCESS_KEY_ID'
   AWS_SECRET_ACCESS_KEY='TU_AWS_SECRET_ACCESS_KEY'
   AWS_S3_BUCKET_NAME='nombre-de-tu-bucket-s3'
   AWS_S3_LAMBDA_NAME='nombre-de-tu-funcion-lambda'
   AWS_S3_REGION='us-east-1'
   DATABASE_URL='sqlite:///db.sqlite'
   ```

5. Aplica las migraciones de base de datos y crea un superusuario (opcional):
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. Inicia el servidor de desarrollo del backend:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

   El backend estará disponible en `http://localhost:8000/`.

---

### 2. Configuración del Frontend

1. Navega al directorio del frontend:
   ```bash
   cd frontend/creze-frontend
   ```

2. Instala las dependencias con npm:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en `frontend/creze-frontend/.env`:
   ```env
   REACT_APP_URL_BACKEND_DRF='http://localhost:8000'
   ```

4. Inicia la aplicación en modo desarrollo:
   ```bash
   npm start
   ```

   El frontend estará disponible en `http://localhost:3000/`.

---

## 📚 Documentación Técnica Detallada

Para consultar la documentación técnica completa, con especificación de endpoints REST, esquemas de solicitud/respuesta, arquitectura de MobX y detalle del flujo AWS S3/Lambda, revisa el archivo:

👉 **[DOCUMENTACION_DETALLADA.md](./DOCUMENTACION_DETALLADA.md)**
