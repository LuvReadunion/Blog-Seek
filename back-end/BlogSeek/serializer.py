# 序列化 Json 文件
from rest_framework import serializers
from .models import Blog, Tag

from django.contrib.auth import get_user_model

# TZH 引入自定义用户模型
User = get_user_model()

# TZH 序列化 Tag 模型(SlugRelatedField的子类)
class TagField(serializers.SlugRelatedField):
    # TZH 当遇到不存在的 name 时 自动创建 Tag
    def to_internal_value(self, data):
        if not isinstance(data, str):
            self.fail('invalid')  # 不是字符串就报错

        # TZH 将 Tag 统一转换为小写
        data_lower = data.lower()
        tag, created = Tag.objects.get_or_create(name=data_lower)
        return tag
        
# TZH 序列化 Blog 模型
class BlogSerializer(serializers.ModelSerializer):
    # TZH 将 Tag 模型映射为 Tag 的 name 字段
    tags = TagField(
        queryset=Tag.objects.all(),
        slug_field='name',
        many=True,
        required=False,
        default=[],
    )

    class Meta:
        model = Blog
        fields = ['id','title','url','author','date','tags','description']

    # TZH 需要重写 create 方法
    # TZH 实现数据库没有当前 tags 字段则自动创建
    def create(self, validated_data):
        # TZH tags 字段单独处理
        tags = validated_data.pop('tags')

        # TZH 使用剩下的字段创建 Blog 实例
        blog = super().create(validated_data)

        # TZH 操作多对多管理器关联 tag
        blog.tags.set(tags)
        return blog

    
    # TZH 需要重写 update 方法(理由同上)
    def update(self, instance, validated_data):
        # TZH tags 字段单独处理
        tags = validated_data.pop('tags', None)

        # TZH 使用剩下的字段更新 Blog 实例
        blog = super().update(instance, validated_data)

        # TZH 操作多对多管理器关联 tag
        if tags is not None:
            blog.tags.set(tags)
        return blog

# TZH 序列化 User 模型
class UserSerializer(serializers.ModelSerializer):
    # TZH 密码字段只能从前端传向后端 不能从后端传向前端
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'bio']
        extra_kwargs = {
            'username': {'required': True}, # TZH 用户名必填
            'bio': {'required': False},     # TZH 简介可不填
        }

    # TZH 需要重写 create 方法
    # TZH 实现用户注册时自动加密密码
    def create(self, validated_data):
        # TZH 从 validated_data 中取出密码
        password = validated_data.pop('password')

        # TZH 用剩余的字段创建 User 实例 这里不直接保存到数据库
        user = User(**validated_data)

        # TZH 设置密码并加密(set_password会自动加密密码)
        user.set_password(password)
        user.save()
        return user

    # TZH 需要重写 update 方法
    # TZH 用户更新只能更新简介
    def update(self, instance, validated_data):
        if 'username' in validated_data:
            raise serializers.ValidationError({"username": "不允许修改用户名"})
        if 'password' in validated_data:
            raise serializers.ValidationError({"password": "请使用专门修改密码的接口"})
        
        return super().update(instance, validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    # TZH write_only=True 代表只能前端传向后端
    # TZH required=True 代表请求必须包含这个字段
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)

    # TZH 确认旧密码是否正确
    def validate_old_password(self, value):
        user = self.context['request'].user

        # TZH 将传入的旧密码进行哈希与数据库中的哈希进行对比
        if not user.check_password(value):
            raise serializers.ValidationError("当前密码不正确")
        return value

    # TZH 保存新密码
    def save(self):
        user = self.context['request'].user
        new_password = self.validated_data['new_password']

        # TZH 密码自动加密
        user.set_password(new_password)  
        user.save()
        return user
    