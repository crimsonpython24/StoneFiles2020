# Generated by Django 3.0.8 on 2020-07-23 09:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='title',
            field=models.CharField(max_length=50, verbose_name='title'),
        ),
    ]
