# 格式：ok
# 样例：ok

import unittest
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/users"
TOKEN = "6f5431bc3037d128e66bb9ce456f1d90266755eb"  # 替换为真实有效的 Token
BLOG_ID = 3  # 请替换为你系统中确实存在的博客 ID

follow_test_cases = [
    {
        "name": "关注博客",
        "method": "POST",
        "endpoint": "/follow/",
        "data": {"blog_id": BLOG_ID},
        "expected_key": "detail",
        "expect_contains": "已关注"
    },
    {
        "name": "重复关注同一博客",
        "method": "POST",
        "endpoint": "/follow/",
        "data": {"blog_id": BLOG_ID},
        "expect_status": 400,
        "expected_key": "detail",
        "expect_contains": "已关注"  # 或者你系统中的实际提示，如“已关注”、“重复操作”
    },
    {
        "name": "获取关注的博客",
        "method": "GET",
        "endpoint": "/followed_blogs/",
        "data": None,
        "expected_blog_id": BLOG_ID,
        "print_result_fields": ["id", "title"]
    },
    {
        "name": "取消关注博客",
        "method": "POST",
        "endpoint": "/unfollow/",
        "data": {"blog_id": BLOG_ID},
        "expected_key": "detail",
        "expect_contains": "已取消关注"
    },
    {
        "name": "取消未关注的博客",
        "method": "POST",
        "endpoint": "/unfollow/",
        "data": {"blog_id": BLOG_ID},
        "expect_status": 400,
        "expected_key": "detail",
        "expect_contains": "未关注"  # 或你系统返回的提示
    }
]

def create_follow_test_function(case):
    def test(self):
        url = BASE_URL + case["endpoint"]
        headers = {
            "Authorization": f"Token {TOKEN}",
            "Content-Type": "application/json"
        }

        print(f"\n请求方式: {case['method']}")
        print(f"请求地址: {url}")
        print(f"请求数据: {json.dumps(case['data'], ensure_ascii=False) if case['data'] else '无'}")

        if case["method"] == "GET":
            response = requests.get(url, headers=headers)
        else:
            response = requests.post(url, headers=headers, json=case["data"])

        expected_status = case.get("expect_status", 200)
        print(f"期望状态码: {expected_status}")
        self.assertEqual(response.status_code, expected_status,
                         f"状态码不是 {expected_status}: {response.status_code}")

        try:
            result = response.json()
        except Exception:
            self.fail(f"响应不是 JSON 格式: {response.text}")

        print("实际输出: ", end="")
        if case.get("print_result_fields") and isinstance(result, list):
            simplified = [
                {k: blog.get(k) for k in case["print_result_fields"] if k in blog}
                for blog in result
            ]
            print(json.dumps(simplified, ensure_ascii=False))
        else:
            print(json.dumps(result, ensure_ascii=False))

        if case["name"] == "获取关注的博客":
            blog_id = case["expected_blog_id"]
            print(f"验证是否包含 blog_id={blog_id}")
            matched = any(blog.get("id") == blog_id for blog in result)
            self.assertTrue(matched, f"未找到 blog_id={blog_id} 的博客")
        else:
            key = case.get("expected_key")
            if key:
                print(f"验证字段 `{key}` 包含 `{case['expect_contains']}`")
                self.assertIn(key, result)
                self.assertIn(case["expect_contains"], result[key])
        print("用例通过")
    return test

class TestFollowAPI(unittest.TestCase):
    pass

for idx, case in enumerate(follow_test_cases):
    test_func = create_follow_test_function(case)
    test_name = f"test_case_{idx+1}_{case['name'].replace(' ', '_')}"
    setattr(TestFollowAPI, test_name, test_func)

if __name__ == '__main__':
    unittest.main(verbosity=2)
