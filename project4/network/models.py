from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass



class Post(models.Model):
    content = models.CharField(max_length=280)
    creator = models.ForeignKey('User', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name='like')

    def __str__(self):
        return f"{self.creator} said: {self.content}"

    def serialize(self):
        return {
            "id": self.id,
            "creator": self.creator,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": [user.username for user in self.likes.all()]
        }