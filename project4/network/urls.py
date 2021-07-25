
from django.urls import path

from . import views
# from django.urls import include, path

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    #path("new_post", views.new_post, name="new_post"),

    # API Routes
    path("post", views.new_post, name="new_post"),
   # path("posts/<int:post_id>", views.post, name="post"),
   # path("posts/<str:posts>", views.posts, name="posts") #todo

]
