# 格式：ok
# 样例：ing

import unittest
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/users/"

# Token 示例
admin_token = "e29f37d983b3d5e7e8075a443b6b22912d2db005"
user_token = "6f5431bc3037d128e66bb9ce456f1d90266755eb"
invalid_token = "invalidtoken123"

user_info_test_cases = [
    {
        "name": "获取用户资料-合法Token",
        "method": "GET",
        "url": BASE_URL + "1/",
        "token": user_token,
        "expected_key": "username"
    },
    {
        "name": "获取用户资料-非法Token",
        "method": "GET",
        "url": BASE_URL + "1/",
        "token": invalid_token,
        "expected": {"detail": "Invalid token."},
        "expected_status": 401
    },
    {
        "name": "获取不存在用户资料",
        "method": "GET",
        "url": BASE_URL + "10086/",
        "token": admin_token,
        "expected": {"detail":"No User matches the given query."},
        "expected_status": 404
    },
    {
        "name": "获取所有用户-管理员",
        "method": "GET",
        "url": BASE_URL,
        "token": admin_token,
        "expect_list": True
    },
    {
        "name": "获取所有用户-普通用户",
        "method": "GET",
        "url": BASE_URL,
        "token": user_token,
        "expect_list": True 
    },
    {
        "name": "普通用户修改自己信息",
        "method": "PATCH",
        "url": BASE_URL + "1/",
        "token": user_token,
        "patch_data": {"bio": "你好这是我新改的简介，我是一名喜欢Natalie的人"},
        "expected_bio": "你好这是我新改的简介，我是一名喜欢Natalie的人"
    },
    {
        "name": "修改简介为空",
        "method": "PATCH",
        "url": BASE_URL + "1/",
        "token": user_token,
        "patch_data": {"bio": ""},
        "expected_bio": ""
    },
    {
        "name": "修改简介（499）",
        "method": "PATCH",
        "url": BASE_URL + "1/",
        "token": user_token,
        "patch_data": {"bio": "a"*499},
        "expected_bio": "a"*499
    },
    {
        "name": "修改简介（500）",
        "method": "PATCH",
        "url": BASE_URL + "1/",
        "token": user_token,
        "patch_data": {"bio": "a"*500},
        "expected_bio": "a"*500
    },
    {
        "name": "修改简介（501）",
        "method": "PATCH",
        "url": BASE_URL + "1/",
        "token": user_token,
        "patch_data": {"bio": "a"*501},
        "expected_status": 400,
        "expected": {'bio': ['Ensure this field has no more than 500 characters.']}
    },
    {
        "name": "修改简介（乱码）",
        "method": "PATCH",
        "url": BASE_URL + "1/",
        "token": user_token,
        "patch_data": {"bio": "！@#￥%……&*（）——+{}：“|》？《12简介qweQW😎"},
        "expected_bio": "！@#￥%……&*（）——+{}：“|》？《12简介qweQW😎"
    },
    {
        "name": "普通用户修改他人信息",
        "method": "PATCH",
        "url": BASE_URL + "2/",
        "token": user_token,
        "patch_data": {"bio": "不该允许"},
        "expected": {"detail": "You do not have permission to perform this action."},
        "expected_status": 403
    },
    {
        "name": "管理员修改用户信息",
        "method": "PATCH",
        "url": BASE_URL + "1/",
        "token": admin_token,
        "patch_data": {"bio": "由管理员改的"},
        "expected_bio": "由管理员改的"
    }
]

def create_userinfo_test_function(case):
    def test(self):
        print(f"\n请求 URL: {case['url']}")
        headers = {
            "Authorization": f"Token {case['token']}",
            "Content-Type": "application/json"
        }

        data = json.dumps(case.get("patch_data", {})) if case["method"] in ["PATCH", "PUT"] else None

        response = requests.request(case["method"], case["url"], headers=headers, data=data)

        expected_status = case.get("expected_status", 200)
        self.assertEqual(response.status_code, expected_status,
                         f"状态码不符合预期，期望={expected_status}，实际={response.status_code}")

        try:
            resp_data = response.json()
        except Exception:
            self.fail(f"响应不是合法 JSON 格式: {response.text}")

        print(f"实际输出: {json.dumps(resp_data, ensure_ascii=False)}")

        if "expected" in case:
            print(f"期望输出: {json.dumps(case['expected'], ensure_ascii=False)}")
            self.assertEqual(resp_data, case["expected"],
                             f"匹配失败：期望={case['expected']} 实际={resp_data}")

        if "expected_key" in case:
            print(f"期望输出包含字段: '{case['expected_key']}'")
            self.assertIn(case["expected_key"], resp_data)

        if case.get("expect_list"):
            print("期望响应为用户列表")
            self.assertIsInstance(resp_data, list)
            self.assertGreater(len(resp_data), 0)

        if "expected_bio" in case:
            print(f"期望bio字段为: '{case['expected_bio']}'")
            self.assertEqual(resp_data.get("bio"), case["expected_bio"],
                             f"bio 字段不符合预期: 实际={resp_data.get('bio')}")

        print("用例通过")
    return test

class TestUserInfoAPI(unittest.TestCase):
    pass

for idx, case in enumerate(user_info_test_cases):
    test_func = create_userinfo_test_function(case)
    test_name = f"test_case_{idx+1}_{case['name'].replace(' ', '_')}"
    setattr(TestUserInfoAPI, test_name, test_func)

if __name__ == '__main__':
    unittest.main(verbosity=2)
