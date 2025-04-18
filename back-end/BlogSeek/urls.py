# TZH BlogSeek.urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from BlogSeek import views #TZH
from BlogSeek.views import get_search, show_search # TZH

# TZH 配置路由映射
router = DefaultRouter()
router.register('BlogSeek', views.BlogViewSet)

urlpatterns = [
    path('BlogSeek/', get_search),   # TZH
    path('BlogSeek/answer/', show_search),   # TZH
]
