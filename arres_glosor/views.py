import json

from datetime import datetime, timedelta
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.db.models import Max
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse


from .models import User, Exercise

def index(request):

    exercises = Exercise.objects.all().order_by('-time_last_edited')


    return render(request, "arres_glosor/index.html", {
        "exercises": exercises
    })

def register_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        confirmation = request.POST.get("confirmation")

        # Check for empty fields
        if not username or username.strip() == "":
            return render(request, "arres_glosor/register.html", {
                "message": "Användarnamn kan inte vara tomt."
            })
        if not password:
            return render(request, "arres_glosor/register.html", {
                "message": "Lösenord krävs."
            })
        if not confirmation:
            return render(request, "arres_glosor/register.html", {
                "message": "Bekräftelse av lösenord krävs."
            })

        # Ensure passwords match
        if password != confirmation:
            return render(request, "arres_glosor/register.html", {
                "message": "Lösenorden måste vara samma."
            })

        # Attempt to create a new user
        try:
            user = User.objects.create_user(username=username, password=password)
            user.save()
        except IntegrityError as e:
            return render(request, "arres_glosor/register.html", {
                "message": "Användarnamnet är redan upptaget."
            })

        login(request, user)  # Ensure you are using the Django login function
        return HttpResponseRedirect(reverse("index"))

    return render(request, "arres_glosor/register.html")

def login_view(request):
    if request.method =="POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "arres_glosor/login.html", {
                "message": "Ogiltigt användarnamn och/eller lösenord."
            })

    return render(request, "arres_glosor/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


swedish_months = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"]

def create_exercise(request):
    if request.method =="POST":
        creator = request.user

        data = json.loads(request.body)
        exercise_name = data.get("exercise_name")
        language1 = data.get("language1")
        language2 = data.get("language2")

        now = datetime.now()
        adjusted_time = now + timedelta(hours=1)
        formatted_time = f"{adjusted_time.day} {swedish_months[adjusted_time.month - 1]}, {adjusted_time.year}, {adjusted_time.strftime('%H:%M')}"

        translations_list = []

        exercise = Exercise(creator=creator, exercise_name=exercise_name, language1=language1, language2=language2, formatted_time_last_edited=formatted_time, translations=translations_list)
        exercise.save()

        max_id = Exercise.objects.aggregate(Max('id'))['id__max']


        return JsonResponse({"status": "success", "message": "Exercise created successfully!", "next_id": max_id})



    return render(request, "arres_glosor/create_exercise.html")


def edit(request, id):

    try:
        exercise = Exercise.objects.get(id=id)
    except Exercise.DoesNotExist:
            return render(request, "arres_glosor/error.html", {
                "error": "Invalid id",
                "message": "Exercise with that id not found."
            })

    if request.user != exercise.creator:
        return HttpResponseRedirect(reverse("index"))

    return render(request, "arres_glosor/edit.html", {
        "exercise": exercise
    })



def exercise_save(request):
    if request.method =="POST":
        data = json.loads(request.body)
        id = data.get("id")
        exercise_name = data.get("exercise_name")
        language1 = data.get("language1")
        language2 = data.get("language2")

        exercise = Exercise.objects.get(id=id)

        if exercise.exercise_name != exercise_name or exercise.language1 != language1 or exercise.language2 != language2:
            now = datetime.now()
            adjusted_time = now + timedelta(hours=1)
            formatted_time = f"{adjusted_time.day} {swedish_months[adjusted_time.month - 1]}, {adjusted_time.year}, {adjusted_time.strftime('%H:%M')}"
            exercise.formatted_time_last_edited = formatted_time

            exercise.exercise_name = exercise_name
            exercise.language1 = language1
            exercise.language2 = language2

            exercise.save()


        return JsonResponse({"status": "success", "message": "Exercise updated successfully!"})


def exercise_add(request):
    if request.method =="POST":
        data = json.loads(request.body)
        id = data.get("id")
        glosa_language1 = data.get("glosa_language1")
        glosa_language2 = data.get("glosa_language2")

        exercise = Exercise.objects.get(id=id)

        new_translation = {"language1": glosa_language1, "language2": glosa_language2}
        exercise.translations.append(new_translation)

        now = datetime.now()
        adjusted_time = now + timedelta(hours=1)
        formatted_time = f"{adjusted_time.day} {swedish_months[adjusted_time.month - 1]}, {adjusted_time.year}, {adjusted_time.strftime('%H:%M')}"
        exercise.formatted_time_last_edited = formatted_time

        exercise.save()

        return JsonResponse({"status": "success", "message": "Glosor added successfully!"})


def exercise_delete(request):
    if request.method =="POST":
        data = json.loads(request.body)
        id = data.get("id")

        exercise = Exercise.objects.get(id=id)

        exercise.delete()

        return JsonResponse({"status": "success", "message": "Exercise deleted successfully!"})


def translation_delete(request):
    if request.method =="POST":
        data = json.loads(request.body)
        id = data.get("id")
        index = data.get("index")

        exercise = Exercise.objects.get(id=id)

        translations = exercise.translations

        translations.pop(int(index))

        exercise.translations = translations

        now = datetime.now()
        adjusted_time = now + timedelta(hours=1)
        formatted_time = f"{adjusted_time.day} {swedish_months[adjusted_time.month - 1]}, {adjusted_time.year}, {adjusted_time.strftime('%H:%M')}"
        exercise.formatted_time_last_edited = formatted_time

        exercise.save()

        return JsonResponse({"status": "success", "message": "Translation deleted successfully!"})


def overview(request, id):

    try:
        exercise = Exercise.objects.get(id=id)
    except Exercise.DoesNotExist:
            return render(request, "arres_glosor/error.html", {
                "error": "Invalid id",
                "message": "Exercise with that id not found."
            })

    return render(request, "arres_glosor/overview.html", {
        "exercise": exercise
    })

def exercise(request, id):
    try:
        exercise = Exercise.objects.get(id=id)
    except Exercise.DoesNotExist:
            return render(request, "arres_glosor/error.html", {
                "error": "Invalid id",
                "message": "Exercise with that id not found."
            })

    change_language = request.GET.get('change_language', 'false')

    if change_language == "true":
        placeholder = exercise.language1
        exercise.language1 = exercise.language2
        exercise.language2 = placeholder

        return render(request, "arres_glosor/exercise.html", {
            "exercise": exercise,
            "switched": "True"
        })

    return render(request, "arres_glosor/exercise.html", {
        "exercise": exercise,
        "switched": "False"
    })


def display_profile(request, username):
    try:
        user = User.objects.get(username=username)
    except Exercise.DoesNotExist:
            return render(request, "arres_glosor/error.html", {
                "error": "Invalid username",
                "message": "User with that username not found."
            })

    user_exercises = Exercise.objects.filter(creator=user)

    return render(request, "arres_glosor/profile.html", {
        "user_username": user.username,
        "user_exercises": user_exercises
    })



def custom_404(request, exception):
    return HttpResponseRedirect(reverse("error"), {
        "error": "Invalid username",
        "message": "User with that username not found."
    })
