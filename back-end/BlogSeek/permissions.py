# permissions.py

from rest_framework.permissions import BasePermission

class IsSelf(BasePermission):
    # TZH 只有自己或 is_superuser=True 的管理员才能操作。
    def has_object_permission(self, request, view, obj):
        # 超级管理员可自由操作，普通用户只能操作自己
        # PATCH /api/users/3/中 obj 就是 user_id = 3 的 User 实例
        # request.user 是当前登录用户的 User 实例(Token 对应用户)
        return request.user.is_superuser or obj == request.user
