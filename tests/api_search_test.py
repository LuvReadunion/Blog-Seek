# 格式：ok
# 样例：ok

import unittest
import requests
import json
# import sys
# import functools

# print = functools.partial(print, flush=True)    # 强制打印，防止有的测试样例没有输出成功

BASE_URL = "http://127.0.0.1:8000/api/blogs/search/"

# 测试用例
search_test_cases = [
    {
        "name": "中文关键词",
        "params": {"query": "分布式"},
        "print_result_fields": ["id", "title"],
        "expect_keyword_in_title": "分布式"
    },
    {
        "name": "英文关键词",
        "params": {"query": "linux"},
        "print_result_fields": ["id", "title"],
        "expect_keyword_in_title": "linux"
    },
    {
        "name": "含符号数字关键词",
        "params": {"query": "123多线程？！。@%=*&……￥#《>"},
        "print_result_fields": ["id", "title"],
        "expect_keyword_in_title": "多线程"
    },
    {
        "name": "含表情符号关键词",
        "params": {"query": "数据库☹️"},
        "print_result_fields": ["id", "title"],
        "expect_keyword_in_title": "数据库"
    },
    {
        "name": "含空格关键词",
        "params": {"query": "  操 作 系 统    "},
        "print_result_fields": ["id", "title"],
        "expect_keyword_in_title": "操作系统"
    },
    {
        "name": "空关键词",
        "params": {"query": ""},
        "expect_status": 400, 
        "expected_json": {"detail": "请提供 query 参数"}  
    },
    {
        "name": "多个空格关键词",
        "params": {"query": "           "},
        "expect_status": 400, 
        "expected_json": {"detail": "请提供 query 参数"}  
    },
    {
        "name": "关键词长度为49个字符（合法）",
        "params": {"query": "a" * 49},
        "expect_status": 200,
        "print_result_fields": ["id", "title"]
    },
    {
        "name": "关键词长度为50个字符（边界值）",
        "params": {"query": "a" * 50},
        "expect_status": 200,
        "print_result_fields": ["id", "title"]
    },
    {
        "name": "关键词长度为51个字符（非法）",
        "params": {"query": "a" * 51},
        "expect_status": 400,
        "expected_json": {"detail": "query 参数长度不能超过50个字符"} 
    }
]

def create_search_test_function(case):
    def test(self):
        print(f"\n查询参数: {json.dumps(case['params'], ensure_ascii=False)}")

        response = requests.get(BASE_URL, params=case["params"])

        expected_status = case.get("expect_status", 200)
        print(f"期望状态码: {expected_status}")
        self.assertEqual(response.status_code, expected_status,
                         f"状态码不是 {expected_status}: {response.status_code}")

        # if expected_status != 200:
        #     print(f"非 200 状态码响应：{response.text}")

        try:
            data = response.json()
        except Exception:
            self.fail(f"响应不是合法 JSON 格式: {response.text}")

        if "print_result_fields" in case and isinstance(data, list):
            simplified = [
                {k: item.get(k) for k in case["print_result_fields"] if k in item}
                for item in data
            ]
            print(f"实际输出（部分字段）: {json.dumps(simplified, ensure_ascii=False)}")
        else:
            print(f"实际输出: {json.dumps(data, ensure_ascii=False)}")

        if "expect_keyword_in_title" in case:
            keyword = case["expect_keyword_in_title"].lower()
            matched = any(keyword in item.get("title", "").lower() for item in data)
            print(f"期望至少一条 title 包含关键词: {keyword}")
            self.assertTrue(matched, f"没有任何一条 title 包含关键词: {keyword}")

        if "expected_json" in case:
            print(f"期望输出: {json.dumps(case['expected_json'], ensure_ascii=False)}")
            self.assertEqual(data, case["expected_json"], "响应内容不符合预期")

        print("用例通过")

    return test

class TestSearchAPI(unittest.TestCase):
    pass

for idx, case in enumerate(search_test_cases):
    test_func = create_search_test_function(case)
    test_name = f"test_case_{idx+1}_{case['name'].replace(' ', '_')}"
    setattr(TestSearchAPI, test_name, test_func)

if __name__ == '__main__':
    unittest.main(verbosity=2)
