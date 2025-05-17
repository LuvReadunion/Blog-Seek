# TZH BlogSeek.urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from BlogSeek import views #TZH

# TZH 配置默认路由
router = DefaultRouter()
router.register(r'blogs', views.BlogViewSet, basename='blog')

urlpatterns = [
    # TZH 访问博客列表的接口
    # RESTful 增删改查 和 search 接口:
    # GET    /api/blogs/           获取博客列表
    # POST   /api/blogs/           新增一篇博客
    # GET    /api/blogs/{pk}/      获取指定博客详情
    # PUT    /api/blogs/{pk}/      更新指定博客全部内容
    # PATCH  /api/blogs/{pk}/      更新指定博客部分内容
    # DELETE /api/blogs/{pk}/      删除指定博客
    # GET    /api/blogs/search/?query=xxx  向量检索，返回最相似的6篇博客  

    path('', include(router.urls)),
]
