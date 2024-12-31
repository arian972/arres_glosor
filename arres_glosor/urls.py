from django.urls import path
from . import views
from django.conf.urls import handler404
from arres_glosor.views import custom_404

handler404 = custom_404

urlpatterns = [
    path('', views.index, name='index'),
    path('registrera', views.register_view, name='register'),
    path('logga-in', views.login_view, name='login'),
    path("logga-ut", views.logout_view, name="logout"),
    path('skapa', views.create_exercise, name='create_exercise'),
    path('edit/id=<int:id>', views.edit, name='edit'),
    path('exercise_save', views.exercise_save, name='exercise_save'),
    path('exercise_add', views.exercise_add, name='exercise_add'),
    path('exercise_delete', views.exercise_delete, name='exercise_delete'),
    path('translation_delete', views.translation_delete, name='translation_delete'),
    path('oversikt/id=<int:id>', views.overview, name='overview'),
    path('ovning/id=<int:id>', views.exercise, name='exercise'),
    path('konto/<str:username>', views.display_profile, name='display_profile'),

]
