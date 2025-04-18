from django.db import models

class Blog(models.Model):
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=300)
    




