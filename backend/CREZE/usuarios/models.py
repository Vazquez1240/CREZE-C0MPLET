from email.policy import default

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
from django.contrib.auth.models import Group as OriginalGroup
from django.db.models.signals import pre_delete, post_save
from .managers import CustomUserManager
from django.contrib.auth.validators import UnicodeUsernameValidator
from auditlog.registry import auditlog
from django.conf import settings
from rest_framework.authtoken.models import Token

username_validator = UnicodeUsernameValidator()


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    safe_delete = models.BooleanField(default=False)
    username = models.CharField(
        "username",
        max_length=150,
        help_text="Requerido. 150 caracteres o menos. Solo letras, dígitos y @/./+/-/_",
        validators=[username_validator],
        error_messages={
            "unique": "Ya existe un usuario con ese nombre de usuario.",
        },
    )
    documentos = models.ManyToManyField('Documento', related_name='usuarios', blank=True)


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()

    @property
    def nombre_completo(self):
        try:
            return self.nombre_completo
        except:
            return self.email

    def __str__(self):
        return self.nombre_completo

    @staticmethod
    @receiver(pre_delete, sender='usuarios.User')
    def safe_delete_usuario(sender, instance, **kwargs):
        instance.safe_delete = True
        instance.save()

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

class Group(OriginalGroup):
    class Meta:
        proxy = True
        verbose_name = "Grupo"
        verbose_name_plural = "Grupos"


class Documento(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    original_size = models.PositiveIntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    url_document = models.URLField(blank=True)
    status = models.CharField(max_length=20, default='Pending')

    class Meta:
        constraints = [models.UniqueConstraint(fields=('user', 'file_name'), name='unique_document')]
        verbose_name = 'Documento'
        verbose_name_plural = 'Documentos'

auditlog.register(User)
auditlog.register(Group)
