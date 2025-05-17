from .faiss_searcher import faiss_searcher
from .models import Blog
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializer import BlogSerializer

class BlogViewSet(viewsets.ModelViewSet):
    """
    增删改查 接口：
      GET    /api/blogs/         
      POST   /api/blogs/            → create
      GET    /api/blogs/blog_id/    → retrieve
      PUT    /api/blogs/blog_id/    → update
      PATCH  /api/blogs/blog_id/    → partial_update
      DELETE /api/blogs/blog_id/    → destroy
    搜索接口：
      GET /api/blogs/search/?query=关键词
    """
    queryset = Blog.objects.all().order_by('id')
    serializer_class = BlogSerializer

    # TZH detail=False 表示不需要传入主键
    # TZH methods=['get'] 表示只支持 GET 请求
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        GET /api/blogs/search/?query=关键词
        返回：最多6条最相近的博客列表
        """
        q = request.query_params.get('query', '').strip()
        if not q:
            return Response({'detail': '请提供 query 参数'}, status=400)

        # TZH 执行检索，返回 Blog ID 列表
        ids = faiss_searcher.Search(q)

        # TZH 批量拉取博客数据
        blogs = list(Blog.objects.filter(id__in=ids))

        # TZH 将博客 ID 映射到博客对象
        blog_map = {b.id: b for b in blogs}

        # TZH 根据检索结果的 ID 顺序排列博客对象
        ordered = [blog_map[i] for i in ids if i in blog_map]

        # TZH 序列化并返回
        serializer = BlogSerializer(ordered, many=True)
        return Response(serializer.data)