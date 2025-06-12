from django.apps import AppConfig
import os
import threading

class BlogseekConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'BlogSeek'

    # TZH 初始化加载 faiss_searcher
    def ready(self):
        # TZH 保证只会在主线程中初始化一次（监控进程不会初始化）
        if os.environ.get("RUN_MAIN") == "true":
            from .faiss_searcher import faiss_searcher

            # TZH daemon=True 表示主线程结束后子线程也会结束
            threading.Thread(target=faiss_searcher.Initialize, daemon=True).start()

        