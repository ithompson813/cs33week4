# Generated by Django 3.2.4 on 2021-07-25 19:41

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0006_delete_test'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='following',
            field=models.ManyToManyField(related_name='followed_users', to=settings.AUTH_USER_MODEL),
        ),
    ]
