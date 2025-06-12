from .faiss_searcher import faiss_searcher
from .models import Blog
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from .serializer import BlogSerializer, UserSerializer, ChangePasswordSerializer
from .permissions import IsSelf
from django.contrib.auth import get_user_model

User = get_user_model()

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
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def list(self, request):
        queryset = Blog.objects.all().order_by('-id')[:5]

        # TZH 序列化前 5 条数据
        serializer = self.get_serializer(queryset, many=True)

        # TZH 返回前 5 条结果
        return Response(serializer.data) 


    # TZH detail=False 表示不需要传入主键
    # TZH methods=['get'] 表示只支持 GET 请求
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        GET /api/blogs/search/?query=关键词
        返回：最多10条最相近的博客列表
        """
        q = request.query_params.get('query', '').strip()
        if not q:
            return Response({'detail': '请提供 query 参数'}, status=400)
        
        if len(q) > 50:
            return Response({'detail': 'query 参数长度不能超过50个字符'}, status=400)
            
        print("现在开始检索")
        # TZH 执行检索，返回 Blog ID 列表
        ids = faiss_searcher.Search(q)
        print("检索完成")

        # TZH 批量拉取博客数据
        blogs = list(Blog.objects.filter(id__in=ids))
        
        # TZH 将博客 ID 映射到博客对象
        blog_map = {b.id: b for b in blogs}

        # TZH 根据检索结果的 ID 顺序排列博客对象
        ordered = [blog_map[i] for i in ids if i in blog_map]

        # TZH 序列化并返回
        serializer = BlogSerializer(ordered, many=True)
        return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    """
    用户增删改查接口：
      GET    /api/users/           → list               不需要token
      POST   /api/users/           → create（注册）      不需要token
      GET    /api/users/{pk}/      → retrieve           不需要token
      PUT    /api/users/{pk}/      → update             需要token
      PATCH  /api/users/{pk}/      → partial_update     需要token
      DELETE /api/users/{pk}/      → destroy            需要token
    用户关注/取消关注博客的接口（针对当前登录用户）：
      POST  /api/users/follow/           payload: {"blog_id": <int>}       需要token
      POST  /api/users/unfollow/         payload: {"blog_id": <int>}       需要token
      GET   /api/users/followed_blogs/   获取当前登录用户关注的所有博客       需要token
    用户更改密码的接口：
      POST   /api/users/change_password/    修改密码     需要 token
    """
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer

    # TZH 设置认证方式
    authentication_classes = [TokenAuthentication]

    # TZH 设置所有操作必须经过认证
    permission_classes = [IsAuthenticated, IsSelf]

    # TZH 在注册新用户时允许不需要认证
    def get_permissions(self):
        # TZH 如果是注册新用户(create) 允许不需要认证操作
        if self.action == 'create':
            return [AllowAny()]

        # TZH 如果想要获取所有的用户 或者 获得单个用户信息
        if self.action in  ['list', 'retrieve']:
            return [AllowAny()]

        # TZH 其他动作都需要认证
        return [IsAuthenticated(), IsSelf()]

    # TZH detail=True 表示需要传入主键
    # TZH methods=['post'] 表示只支持 POST 请求
    # TZH 关注博客的接口
    @action(detail=False, methods=['post'])
    def follow(self, request):
        # TZH 确定用户对象
        user = request.user

        # TZH 确定收藏的博客对象 id
        blog_id = request.data.get('blog_id')

        # TZH 检查请求 body 中是否提供了 blog_id
        if blog_id is None:
            return Response({'detail': '请在请求 body 中提供 blog_id'}, status=400)
        # TZH 检查 blog_id 对应的博客是否存在
        try:
            blog = Blog.objects.get(pk=blog_id)
        except Blog.DoesNotExist:
            return Response({'detail': '指定的 blog_id 不存在'}, status=404)
        
        # TZH 检查用户是否已经关注该博客
        if blog.followers.filter(id=user.id).exists():
            return Response({'detail': '您已关注该博客'}, status=400)

        # TZH 将该博客加入该用户的关注列表
        blog.followers.add(user)
        return Response({'detail': f'用户 {user.username} 已关注 博客 "{blog.title}"'})

    # TZH detail=True 表示需要传入主键
    # TZH methods=['post'] 表示只支持 POST 请求
    # TZH 取消关注博客的接口
    @action(detail=False, methods=['post'])
    def unfollow(self, request):
        # TZH 确定用户对象
        user = request.user

        # TZH 确定取消关注的博客对象 id
        blog_id = request.data.get('blog_id')

        # TZH 检查请求 body 中是否提供了 blog_id
        if blog_id is None:
            return Response({'detail': '请在请求 body 中提供 blog_id'}, status=400)

        # TZH 检查 blog_id 对应的博客是否存在
        try:
            blog = Blog.objects.get(pk=blog_id)
        except Blog.DoesNotExist:
            return Response({'detail': '指定的 blog_id 不存在'}, status=404)

        # TZH 检查用户是否关注该博客
        if not blog.followers.filter(id=user.id).exists():
            return Response({'detail': '您尚未关注该博客'}, status=400)

        # TZH 将该博客从该用户的关注列表中移除
        blog.followers.remove(user)
        return Response({'detail': f'用户 {user.username} 已取消关注 博客 "{blog.title}"'})

    # TZH detail=True 表示需要传入主键
    # TZH methods=['post'] 表示只支持 GET 请求
    # TZH 获取用户关注的所有博客列表接口
    @action(detail=False, methods=['get'])
    def followed_blogs(self, request):
        # TZH 确定用户对象
        user = request.user
        
        # TZH 获取该用户关注的所有博客
        blogs = user.followed_blogs.all()

        # TZH 序列化博客列表
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

        # TZH 判断 old_password 是否正确
        if serializer.is_valid():

            # TZH 调用 save 函数保存新密码
            serializer.save()
            return Response({'detail': '密码修改成功'}, status=200)
        return Response({'detail': '原本密码错误'}, status=400)
    
