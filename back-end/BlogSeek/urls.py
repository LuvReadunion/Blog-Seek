# TZH BlogSeek.urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from BlogSeek import views #TZH
from rest_framework.authtoken.views import obtain_auth_token

# TZH 配置默认路由
router = DefaultRouter()
router.register(r'blogs', views.BlogViewSet, basename='blog')
router.register(r'users', views.UserViewSet, basename='user')

urlpatterns = [
    # TZH 访问博客列表的接口
    # 博客增删改查 和 search 接口:
    # GET    /api/blogs/           获取博客列表
    # POST   /api/blogs/           新增一篇博客
    # GET    /api/blogs/{pk}/      获取指定博客详情
    # PUT    /api/blogs/{pk}/      更新指定博客全部内容
    # PATCH  /api/blogs/{pk}/      更新指定博客部分内容
    # DELETE /api/blogs/{pk}/      删除指定博客
    # GET    /api/blogs/search/?query=xxx  向量检索，返回最相似的6篇博客  

    # TZH 访问用户列表的接口
    # 用户增删改查 接口:
    # GET    /api/users/                 获取用户列表
    # POST   /api/users/                 注册新用户（create）
    # GET    /api/users/{pk}/            获取指定用户详情（retrieve）
    # PUT    /api/users/{pk}/            更新指定用户全部信息（update）
    # PATCH  /api/users/{pk}/            更新指定用户部分信息（partial_update）
    # DELETE /api/users/{pk}/            删除指定用户（destroy）
    # 用户关注/取消关注博客的接口:
    # POST   /api/users/{pk}/follow/         payload: {"blog_id": <int>}        关注指定博客
    # POST   /api/users/{pk}/unfollow/       payload: {"blog_id": <int>}        取消关注指定博客
    # GET    /api/users/{pk}/followed_blogs/ 获取该用户关注的所有博客

    path('', include(router.urls)),
    # TZH 用户登录获取 token 的接口
    path('login/', obtain_auth_token),  # 获取 token 的接口
]
