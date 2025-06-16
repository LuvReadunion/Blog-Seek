# 格式：ok
# 样例：ok
# 由于有重复用户名的限制，所以每次测试后需要对样例进行更新，防止下次测试异常

import unittest
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/users/"

register_test_cases = [
    {
        "name": "正常注册",
        "input": {"username": "@.+-_Ww2", "password": "123456", "bio": "我是测试用户"},
        "expected": {"id": "exists"}  # 仅检查是否含有id字段即可
    },
    {
        "name": "重复用户名注册",
        "input": {"username": "@.+-_Ww2", "password": "123456", "bio": "重复测试"},
        "expected": {"username": ["A user with that username already exists."]}
    },
    {
        "name": "缺少用户名",
        "input": {"password": "123456", "bio": "缺用户名"},
        "expected": {"username": ['This field is required.']}
    },
    {
        "name": "用户名为空串",
        "input": {"username": "", "password": "123456", "bio": "用户名为空串"},
        "expected": {"username": ['This field may not be blank.']}
    },
    {
        "name": "用户名为多个空格",
        "input": {"username": "       ", "password": "123456", "bio": "用户名为多个空格"},
        "expected": {"username": ['This field may not be blank.']}
    },
    {
        "name": "缺少密码",
        "input": {"username": "newuser", "bio": "缺密码"},
        "expected": {"password": ["This field is required."]}
    },
    {
        "name": "用户名非法字符",
        "input": {"username": "user!#的用户名", "password": "123456", "bio": "非法用户名"},
        "expected": {
            "username": [
                "Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters."
            ]
        }
    },
    {
        "name": "用户名长度为149（合法）",
        "input": {"username": "f"*149, "password": "123456", "bio": "我的用户名有149个字符"},
        "expected": {"id": "exists"}
    },
    {
        "name": "用户名长度为150（边界值）",
        "input": {"username": "f"*150, "password": "123456", "bio": "我的用户名有150个字符"},
        "expected": {"id": "exists"}
    },
    {
        "name": "用户名长度为151（非法）",
        "input": {"username": "f"*151, "password": "123456", "bio": "我的用户名有151个字符"},
        "expected": {
            "username": ["Ensure this field has no more than 150 characters."]
        }
    },
    {
        "name": "超长乱码密码",
        "input": {
            "username": "long_wrodpssaa", "password": "！@#￥%……&*（）——+{|：“《》？！12345qwertyik我的密码✋🏻"*100, "bio": "我的密码又长又复杂！"
            },
        "expected": {"id": "exists"}
    }
]

def create_register_test_function(case):
    def test(self):
        print(f"\n输入: {json.dumps(case['input'], ensure_ascii=False)}")

        response = requests.post(
            BASE_URL,
            json=case["input"],
            headers={"Content-Type": "application/json"}
        )

        try:
            data = response.json()
        except Exception:
            self.fail(f"响应不是合法 JSON 格式: {response.text}")

        print(f"实际输出: {json.dumps(data, ensure_ascii=False)}")

        if "expected" in case:
            print(f"期望输出: {json.dumps(case['expected'], ensure_ascii=False)}")
            if case["expected"] == {"id": "exists"}:
                self.assertIn("id", data, "响应中未包含字段 'id'")
            else:
                self.assertEqual(data, case["expected"],
                                 f"期望={case['expected']}，实际={data}")
        print("用例通过")

    return test

class TestRegisterAPI(unittest.TestCase):
    pass

for idx, case in enumerate(register_test_cases):
    test_func = create_register_test_function(case)
    test_name = f"test_case_{idx+1}_{case['name'].replace(' ', '_')}"
    setattr(TestRegisterAPI, test_name, test_func)

if __name__ == '__main__':
    unittest.main(verbosity=2)
