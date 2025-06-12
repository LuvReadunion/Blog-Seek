from django.db import models
# TZH 引入 django 自定义用户模型父类
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# TZH 定义 Tag 模型
class Tag(models.Model):
    # TZH 目的是同一标签仅存一次
    name = models.CharField(max_length=100, unique=True)

# TZH 定义自定义用户模型
class User(AbstractUser):
    bio = models.TextField(blank=True, default="", max_length=500)

# TZH 定义 Blog 模型
class Blog(models.Model):
    # TZH 博客标题
    title = models.CharField(max_length=500)

    # TZH 博客链接需要唯一
    url = models.URLField(max_length=500, unique=True)

    # TZH 博客作者需要有默认值
    author = models.CharField(max_length=100, default="", blank=True)

    # TZH 标签和博客多对多（一篇博客多个标签 同一标签也可以对应多个博客）
    tags = models.ManyToManyField(
        Tag,
        related_name="blogs",  # TZH 反向查询：tag.blogs.all()
        blank=True,
    )

    # TZH 关注该博客的用户（多对多）
    followers = models.ManyToManyField(
        settings.AUTH_USER_MODEL,       # TZH 引入用户模型
        related_name="followed_blogs",  # TZH 反向查询：user.followed_blogs.all()
        blank=True,
    )

    description = models.TextField(max_length=7000, default="", blank=True)

    date = models.TextField(max_length=20, default="", blank=True)