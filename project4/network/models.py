from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField('User', related_name="followed_users", blank=True)
    followers = models.ManyToManyField('User', related_name="following_users", blank=True)
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.username,
            "followers": [user.username for user in self.followers.all()],
            "following": [user.username for user in self.following.all()]
        }



class Post(models.Model):
    content = models.CharField(max_length=280)
    creator = models.ForeignKey('User', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField('User', related_name='like')

    def __str__(self):
        return f"{self.creator} said: {self.content}"

    def serialize(self):
        return {
            "id": self.id,
            "creator": self.creator.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": [user.username for user in self.likes.all()]
        }