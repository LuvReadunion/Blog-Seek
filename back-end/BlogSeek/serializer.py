# 序列化 Json 文件
from rest_framework import serializers
from .models import Blog, Tag

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
        fields = ['id','title','url','author','date','tags']

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

