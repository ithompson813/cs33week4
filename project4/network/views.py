from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
import json
from django.http import JsonResponse
from django.core.paginator import Paginator

from .models import User, Post


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@login_required
def new_post(request):

    # get info from html form
    content = request.POST.get("content")
    creator = request.POST.get("creator")

    # find user object from username
    creator = User.objects.get(username=creator)

    # create and save post object
    post = Post(creator=creator, content=content)
    post.save()

    # return user to index page
    return HttpResponseRedirect(reverse("index"))


def posts(request, posts):

    # return JSON data for all posts
    if posts == 'all':

        # track all posts
        posts = Post.objects.all()

        # order by post timestamp
        posts = posts.order_by("-timestamp").all()


    # return JSON data only for posts that the user follows
    if posts == 'following':

        # get list of followed users
        followed_users = request.user.following.all()

        # use list to filter posts
        posts = Post.objects.filter(creator__in=followed_users)   

    if posts == 'profile':

        # get posts only created by current user
        posts = Post.objects.filter(creator=request.user)

    if posts:
        return JsonResponse([post.serialize() for post in posts], safe=False)
        
    
    else:
        return JsonResponse({"error": "No Posts Found"}, status=400)


# the get user path returns a serialized view of the user
def get_user(request, user):
    user = User.objects.get(username=user)
    return JsonResponse(user.serialize())



def prof_posts(request, user):

    # get posts only created by current user
    user = User.objects.get(username=user)
    posts = Post.objects.filter(creator=user)


    # pass JSON data
    if posts:
        return JsonResponse([post.serialize() for post in posts], safe=False)
    
    else:
        return JsonResponse({"error": "No Posts Found"}, status=400)



@login_required
@csrf_exempt
def follow(request):

    data = json.loads(request.body)
    user = User.objects.get(username = data['user']['name'])
    current_user = User.objects.get(username = data['current_user'])
    
    current_user.following.add(user)
    user.followers.add(current_user)

    return HttpResponse("ye")


@login_required
@csrf_exempt
def unfollow(request):

    data = json.loads(request.body)
    user = User.objects.get(username = data['user']['name'])
    current_user = User.objects.get(username = data['current_user'])
    
    current_user.following.remove(user)
    user.followers.remove(current_user)

    return HttpResponse("he")


@login_required
@csrf_exempt
def edit(request):

    data = json.loads(request.body)
    post = Post.objects.get(id=data['post'])
    post.content = data['content']
    post.save()

    return HttpResponse("he")


  
@login_required
@csrf_exempt
def like(request):  

    data = json.loads(request.body)
    post = Post.objects.get(id = data['post']['id'])
    user = User.objects.get(username = data['user'])
    
    if data['user'] in data['post']['likes']:
        post = Post.objects.get(id = data['post']['id'])
        post.likes.remove(user)
    else:
        post.likes.add(user)

    print(data)

    return HttpResponse("he")