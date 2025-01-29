# Generated by Django 4.2.18 on 2025-01-24 23:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('google_book_id', models.CharField(max_length=50, unique=True)),
                ('title', models.CharField(max_length=255)),
                ('author', models.TextField(blank=True, max_length=255, null=True)),
                ('published_date', models.CharField(blank=True, max_length=20, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('cover_image', models.URLField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserBook',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('read_status', models.CharField(choices=[('to-read', 'To Read'), ('read', 'Read')], max_length=20)),
                ('finished_date', models.DateTimeField(blank=True, null=True)),
                ('rating', models.IntegerField(blank=True, null=True)),
                ('review', models.TextField(blank=True, null=True)),
                ('added_at', models.DateField(auto_now_add=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.book')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'book')},
            },
        ),
        migrations.DeleteModel(
            name='Note',
        ),
        migrations.AddField(
            model_name='book',
            name='user',
            field=models.ManyToManyField(related_name='books', through='api.UserBook', to=settings.AUTH_USER_MODEL),
        ),
    ]
