# Generated by Django 5.0 on 2024-08-22 05:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0002_documento'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='documentos',
            field=models.ManyToManyField(blank=True, related_name='usuarios', to='usuarios.documento'),
        ),
    ]
