# 格式：ok
# 样例：ok

import unittest
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/login/"

test_cases = [
    {
        "name": "正确用户名 + 正确密码",
        "input": {"username": "ironman", "password": "1"},
        "expected_key": "token"
    },
    {
        "name": "非法用户名",
        "input": {"username": "ommy&", "password": "123456"},
        "expected": {"non_field_errors": ["Unable to log in with provided credentials."]}
    },
    {
        "name": "过长用户名",
        "input": {"username": "q"*151, "password": "123456"},
        "expected": {"non_field_errors": ["Unable to log in with provided credentials."]}
    },
    {
        "name": "用户名不存在",
        "input": {"username": "notexist", "password": "123456"},
        "expected": {"non_field_errors": ["Unable to log in with provided credentials."]}
    },
    {
        "name": "正确用户名 + 错误密码",
        "input": {"username": "ironman", "password": "wrongpw"},
        "expected": {"non_field_errors": ["Unable to log in with provided credentials."]}
    },
    {
        "name": "缺少用户名",
        "input": {"password": "123456"},
        "expected": {'username': ['This field is required.']}
    },
    {
        "name": "用户名为空",
        "input": {"username": "", "password": "123456"},
        "expected": {'username': ['This field may not be blank.']}
    },
    {
        "name": "缺少密码",
        "input": {"username": "ironman"},
        "expected": {'password': ['This field is required.']}
    }
    
]

def create_test_function(case):
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
            self.assertEqual(data, case["expected"],
                             f"匹配失败：期望={case['expected']} 实际={data}")
        elif "expected_key" in case:
            print(f"期望输出包含字段: '{case['expected_key']}'")
            self.assertIn(case["expected_key"], data,
                          f"响应中未找到期望字段 '{case['expected_key']}'")
        print("用例通过")

    return test

class TestLoginAPI(unittest.TestCase):
    pass

for idx, case in enumerate(test_cases):
    test_func = create_test_function(case)
    test_name = f"test_case_{idx+1} {case['name']}"
    setattr(TestLoginAPI, test_name, test_func)

if __name__ == '__main__':
    unittest.main(verbosity=2)
