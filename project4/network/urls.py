
from django.urls import path

from . import views
# from django.urls import include, path

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new_post", views.new_post, name="new_post"),
    path("follow", views.follow, name="follow"),

    # API Routes
    path("posts/<str:posts>", views.posts, name="posts"),
    path("user/<str:user>", views.get_user, name="get_user"),
    path("prof_posts/<str:user>", views.prof_posts, name="prof_posts"),

]
