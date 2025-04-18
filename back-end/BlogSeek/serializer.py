# 序列化 Json 文件
from rest_framework import serializers

from BlogSeek.models import Blog

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'