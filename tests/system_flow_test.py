import unittest
import requests
import json

API_BASE = "http://127.0.0.1:8000/api"
USERNAME = "nauytest13"
PASSWORD = "savepw123"
NEW_BIO = "系统测试成功啦！"
SEARCH_KEYWORD = "TCP三次握手"

class SystemTest(unittest.TestCase):
    def setUp(self):
        self.session = requests.Session()
        self.token = None
        self.user_id = None
        self.blog_ids = []

    def test_full_flow(self):
        # 注册
        print("\n【注册用户】")
        res = self.session.post(f"{API_BASE}/users/", json={
            "username": USERNAME,
            "password": PASSWORD
        })
        if res.status_code == 400 and "用户名已存在" in res.text:
            print("用户已存在，跳过注册")
        else:
            self.assertEqual(res.status_code, 201, "注册失败")
            self.user_id = res.json().get("id")
            print("注册成功")

        # 登录
        print("\n【登录】")
        res = self.session.post(f"{API_BASE}/login/", json={
            "username": USERNAME,
            "password": PASSWORD
        })
        # print("登录失败响应:", res.status_code, res.text)
        self.assertEqual(res.status_code, 200, "登录失败")
        data = res.json()
        self.token = data.get("token")
        self.assertIsNotNone(self.token, "未获取到 token")
        print(f"登录成功，token: {self.token}")

        headers = {"Authorization": f"Token {self.token}"}

        # 搜索
        print("\n【搜索博客】")
        res = self.session.get(f"{API_BASE}/blogs/search/", params={"query": SEARCH_KEYWORD})
        self.assertEqual(res.status_code, 200, "搜索失败")
        blogs = res.json()
        self.assertIsInstance(blogs, list, "搜索结果不是列表")
        self.blog_ids = [blog["id"] for blog in blogs[:5]]
        print(f"搜索到 {len(blogs)} 条博客，准备收藏前 {len(self.blog_ids)} 条")

        # 收藏前5条
        for i, blog_id in enumerate(self.blog_ids):
            print(f"\n【收藏博客{i+1}】ID: {blog_id}")
            res = self.session.post(f"{API_BASE}/users/follow/", headers=headers, json={"blog_id": blog_id})
            self.assertEqual(res.status_code, 200, "收藏失败")
            print(f"收藏成功: {res.json()}")

        # 获取收藏列表
        print("\n【获取收藏列表】")
        res = self.session.get(f"{API_BASE}/users/followed_blogs/", headers=headers)
        self.assertEqual(res.status_code, 200, "获取收藏列表失败")
        favorites = res.json()
        print(f"收藏博客共 {len(favorites)} 条")

        # 取消前3条
        unfav_ids = self.blog_ids[:3]
        for i, blog_id in enumerate(unfav_ids):
            print(f"\n【取消收藏博客{i+1}】ID: {blog_id}")
            res = self.session.post(f"{API_BASE}/users/unfollow/", headers=headers, json={"blog_id": blog_id})
            self.assertEqual(res.status_code, 200, "取消收藏失败")
            print(f"取消成功: {res.json()}")

        # 获取用户信息
        print("\n【获取用户信息】")
        print(self.user_id)
        res = self.session.get(f"{API_BASE}/users/{self.user_id}/", headers=headers)
        # print("失败响应:", res.status_code, res.text)
        self.assertEqual(res.status_code, 200, "获取用户信息失败")
        user_info = res.json()
        print(f"当前简介: {user_info.get('bio')}")

        # 修改简介
        print("\n【修改简介】")
        res = self.session.patch(f"{API_BASE}/users/{self.user_id}/", headers=headers, json={"bio": NEW_BIO})
        # print("失败响应:", res.status_code, res.text)
        self.assertEqual(res.status_code, 200, "修改简介失败")
        print(f"修改成功，新简介: {res.json().get('bio')}")

    def tearDown(self):
        self.session.close()


if __name__ == '__main__':
    unittest.main(verbosity=2)
