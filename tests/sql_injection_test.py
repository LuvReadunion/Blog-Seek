import unittest
import requests
import json

BASE_SEARCH_URL = "http://127.0.0.1:8000/api/blogs/search/"
BASE_LOGIN_URL = "http://127.0.0.1:8000/api/login/"

class TestSQLInjectionDeleteUser(unittest.TestCase):

    def test_injection_deletes_user(self):
        # 构造 SQL 注入 payload（限制在 50 字符内）
        # 注意：此注入字符串为测试用途，应在安全环境中运行
        injection_payload = "';DELETE FROM users WHERE id=18;--"
        print(f"\n注入 payload: {injection_payload}")

        # 步骤 1：触发搜索接口
        search_resp = requests.get(BASE_SEARCH_URL, params={"query": injection_payload})
        print(f"搜索接口响应状态码: {search_resp.status_code}")

        try:
            data = search_resp.json()
        except Exception:
            self.fail(f"响应不是合法 JSON 格式: {search_resp.text}")

        simplified = [
            {k: item.get(k) for k in ["id", "title"] if k in item}
            for item in data
        ]
        print(f"响应输出（部分字段）: {json.dumps(simplified, ensure_ascii=False)}")

        # 接受 200 或 400 等为有效响应
        self.assertIn(search_resp.status_code, [200, 400, 500], "搜索接口未正确响应")

        # 步骤 2：尝试使用 id 为 18 的用户登录
        login_data = {
            "username": "nauy",
            "password": "123456"
        }
        login_resp = requests.post(BASE_LOGIN_URL, json=login_data)
        print(f"登录响应状态码: {login_resp.status_code}")
        print(f"登录响应内容: {login_resp.text}")

        # 如果登录失败（非 200），可能说明用户被删除，存在注入风险
        self.assertEqual(
            login_resp.status_code, 200,
            "检测到潜在 SQL 注入漏洞：通过 search query 删除了用户 ID 18"
        )

        print("测试通过：系统未被注入删除用户")

if __name__ == '__main__':
    unittest.main(verbosity=2)
