# Generated by Django 5.1.2 on 2024-12-23 08:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("arres_glosor", "0007_exercise_language1_exercise_language2"),
    ]

    operations = [
        migrations.AlterField(
            model_name="exercise",
            name="language1",
            field=models.CharField(max_length=32),
        ),
        migrations.AlterField(
            model_name="exercise",
            name="language2",
            field=models.CharField(max_length=32),
        ),
    ]
