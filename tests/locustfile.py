from locust import HttpUser, task, between

class SearchUser(HttpUser):
    wait_time = between(1, 2)  # 每个用户间隔1-2秒发请求

    @task
    def search_blog(self):
        self.client.get("/api/blogs/search/?query=TCP三次握手")