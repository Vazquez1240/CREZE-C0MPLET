## Introducción

Este backend fue realizado para una prueba tecnica y cuenta con conexión a AWS, esto con la finalidad
de que los archivos que se suban (PDF, docxs, iso, etc) se guarden en un bucket dentro del mismo aws.
Este backend esta realizado con Django rest framework.

El como funciona es que el archivo llega desde el frontend (Ya sea uno o varios) una vez que se obtienen los archivos
se va fragmentando el archivo en varias partes y a cada parte se le va asignando un ID unico (Veremos mas adelante para
que nos servira este ID) este es un ejemplo de como se ve la iteración para asignar el ID unico a cada fragmento

```
for i, chunk in enumerate(self.chunkify(file, fragment_size)):
    chunk_io = BytesIO(chunk)
    fragment_name = f"{file_name}_part_{i}"
    fragment_keys.append(fragment_name)
    s3_client.upload_fileobj(chunk_io, settings.AWS_S3_BUCKET_NAME, fragment_name)

```

Cada fragmento se va añadiendo a una lista donde se guardara  los fragmentos de cada archivo, por decir si tenemos dos
archivos primero se hace la iteracion sobre el archivo y luego con el for que vemos en el codigo vamos a iterar para 
poder desfragmentar este archivo y ponerle un indicador unico.

como nos podemos dar cuenta en esta linea `s3_client.upload_fileobj(chunk_io, settings.AWS_S3_BUCKET_NAME, fragment_name)`
mandamos al bucket cada fragmento, entonces, en el bucket va a existir esos fragmentos, depues de que ya se haya desfragmentado
por completo el archivo se dispone a mandar a llamar la funcion lambda que esta en AWS y esto con el fin de que la funcion
mediante los IDs de los fragmentos reconstruya el archivo y quede completo.


```
lambda_payload = {
    'bucket': settings.AWS_S3_BUCKET_NAME,
    'fragments': fragment_keys,
    'final_file_name': file_name,
}
```

Aqui estamos declarando una variable que contiene los parametros que la funcion necesita para poder trabajar el archivo
como el nombre de los fragmentos, el nombre final del archivo el nombre del bucket

y despues de eso se invoca a la funcion:
```
lambda_response = lambda_client.invoke(
    FunctionName=f'{settings.AWS_S3_LAMBDA_NAME}',
    InvocationType='RequestResponse',
    Payload=json.dumps(lambda_payload)
)
```

la función nos retornara una respuesta que convertiremos a JSON:
 
`lambda_result = json.loads(lambda_response['Payload'].read())`

Despues solo verificamos que AWS no nos retorno un error y que todo salio correcto:

```
if 'error' in lambda_result or 'errorType' in lambda_result:
    return Response({'error': lambda_result['errorMessage']}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

Si todo salio correcto solo vamos a guardar en el en nuestra base de datos lo mas importante para nosotros

```
url_documento = lambda_result['url']
encoded_url_documento = quote(url_documento, safe=":/")

serializer = self.get_serializer(data={
    'file_name': file_name,
    'original_size': file.size,
    'status': 'Uploaded',
    'url_document': encoded_url_documento,
    'user': request.user.id,
    'name_document': file.name
})

serializer.is_valid(raise_exception=True)
self.perform_create(serializer)

responses.append(serializer.data)
```

Como podemos ver primero obtenemos la url del documento y la encodeamos ya que viene en texto plano despues
guardamos lo que es el nombre del archivo, su tamaño original, el estado en el que se encuentra en este caso damos por 
entendido que ya esta arriba y por defecto es uploaded, la url del documento ya encondeada, el user que lo subio y por
ultimo el nombre del documento.

Verificamos que todo sea valido para el serializador y creamos el objeto, al final el responses.append es porque 
guardamos la respuesta de todos los archivos (si es que son varios)


Al final esto es lo que hace internamente el backend, si se quisiera clonar el repositorio para poder utilzarse vamos a 
pasar a la siguiente sección.

## Instalación y ejecución

Para poder instalar y ejecutar el backend vamos a crear un nuevo directorio donde se va almacenar el proyecto.

```
mkdir nombre_proyecto

cd nombre_proyecto
```

despues haremos este comando

```
git clone https://github.com/Vazquez1240/CREZE-C0MPLET.git
```

Despues vamos a navegar hasta la carpeta del backend ya que ahorita el frontend y el backedn esta en un mismo proyecto

```
cd CREZE

cd backend

cd CREZE

```

Aqui ya estamos parados en la raiz del proyecto, y procedemos a hacer la instalación de las dependencias

> **Nota:** Se recomienda utilizar anaconda como entorno virtual esto para evitar que las dependencias
> se instalen de manera global, pero tambien se puede usar python3 -m venv  nombre_entorno

Si se escogi la opcion de venv para activar el entorno virtual vamos a hacer el siguiente comando si es MacOs o alguna 
distribución de linux

`source  nombre_entorno/bin/activate`

y en caso de windows seria de la siguiente manera

`env/Scripts/activate`

despues ya que tenemos instalado y activo el entorno virtual, vamos a hacer el siguiente comando

`pip install -r requirements.txt`

con esto se nos instalaran todas las librerias necesarias para poder correr el backend


ya que se instalaron vamos a crear un archivo .env en la raiz del proyecto (donde se encuentra el manage.py) esto porque
el backend esta utilizando variables de entorno.

Se dejara un ejemplo de como se debe de ver el archivo .env

```
SIGNING_KEY='XXXXXXXXXXXXXX'
AWS_ACCESS_KEY_ID='XXXXXXXXXXXXXX'
AWS_SECRET_ACCESS_KEY='XXXXXXXXXXXXXX'
AWS_S3_BUCKET_NAME = 'nombre de tu bucket'
AWS_S3_LAMBDA_NAME = 'nombre de la funcion lambda que se creo'
AWS_S3_REGION = 'la region de tu cuenta'
```

como opcional puedes incluir la dirección de tu base de datos pero se tiene que si no encuentra esa varibiale de entorno 
cree una sqlite por defecto:

```
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///db.sqlite')
```

con esto solamente nos quedaria hacer los siguientes comandos (cabe recalcar que todo los comandos que se corran se va a 
tener que utilizar dotenv para poder cargar las variables de entorno y que el archivo settings pueda leerlas) :

```
dotenv run python manage.py makemigratinons 

dotenv run python manage.py migrate

dotenv run python manage.py createsuperuser

dotenv run python manage.py runserver
```

y con esto ya se estara corriendo el proyecto en [localhost:8000](http://localhost:8000/)
