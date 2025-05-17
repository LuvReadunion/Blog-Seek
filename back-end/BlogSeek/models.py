from django.db import models

# TZH 定义 Tag 模型
class Tag(models.Model):
    # TZH 目的是同一标签仅存一次
    name = models.CharField(max_length=50, unique=True)

# TZH 定义 Blog 模型
class Blog(models.Model):
    # TZH 博客标题
    title = models.CharField(max_length=100)

    # TZH 博客链接需要唯一
    url = models.URLField(max_length=300, unique=True)

    # TZH 博客作者需要有默认值
    author = models.CharField(max_length=100, default="", blank=True)

    # TZH 标签和博客多对多（一篇博客多个标签 同一标签也可以对应多个博客）
    tags = models.ManyToManyField(
        Tag,
        related_name="blogs",  # TZH 反向查询：tag.blogs.all()
        blank=True,
    )

    date = models.DateTimeField(auto_now_add=True)