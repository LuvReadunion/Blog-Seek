from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import numpy as np
import faiss
import json
from .models import Blog
from sentence_transformers import SentenceTransformer
from rest_framework import viewsets
from .serializer import BlogSerializer
from django.core.cache import cache
import hashlib

# TZH 序列化 Json 文件
class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

# TZH 定义 Faiss 类，实现数据查找
class FaissSearch():
    def __init__(self):
        self.model = None
        self.index = None
        self.id_map = {}

    def Initialize(self):
        # TZH 初始化将文本转成向量的模型
        self.model = SentenceTransformer('BAAI/bge-large-zh')

        # TZH 从数据库获取所有数据
        blogs = Blog.objects.all()

        titles = []
        for blog in blogs:
            titles.append(blog.title)

        # TZH 将文本转化成向量
        embed_vectors = self.model.encode(titles)   # Shape(num_contents, dim=384)
        embed_vectors = np.array(embed_vectors).astype('float32')

        # TZH 构建 Faiss 索引
        dim = embed_vectors.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(embed_vectors)

        # TZH 创建 Faiss 索引到数据库索引映射
        self.id_map = {}
        for i, blog in enumerate(blogs):
            self.id_map[i] = blog.id

faiss_searcher = FaissSearch()
faiss_searcher.Initialize()

# def show_home(request):
#     response_text = (
#         '''
#         Visit link:
#         \thttp://127.0.0.1:8000/search/?query='anything you want to search'
#         \t(e.g: http://127.0.0.1:8000/search/?query=I like sunny day)
#         you can view faiss result
#         ---------------------------------------------------
#         I want to pass cet-6 pray for me
#         '''
#     )

#     # TZH 为了避免 HttpResponse 不显示换行和空格
#     return HttpResponse(response_text, content_type='text/plain')

temp = {}

def get_search(request):
    # # Get query from URL
    # query_text = request.GET.get('query', 'I love IU')

    if request.method == "POST":
        # TZH 处理 POST 请求
        data = json.loads(request.body)
        query_text = data.get('keyword')
    else:
        # TZH 处理 GET 请求
        query_text = request.GET.get('query')
        
    query_embed_vector = faiss_searcher.model.encode([query_text])
    query_embed_vector = np.array(query_embed_vector).astype('float32')

    # TZH 返回最接近的 K 个向量索引和距离
    k = 6
    distances, indices = faiss_searcher.index.search(query_embed_vector, k)

    # TZH 将 Faiss 索引映射为数据库索引
    results = []
    for i in range(k):
        blog_id = faiss_searcher.id_map[indices[0][i]]
        closest_blog = Blog.objects.get(id=blog_id)
        result = {
            "title": closest_blog.title,
            "url": closest_blog.url,
        }
        results.append(result)

    # blog_id = faiss_searcher.id_map[indices[0][0]]
    # closest_blog = Blog.objects.get(id=blog_id)

    # response_data = {
    #     'title': closest_blog.title,
    #     'url': closest_blog.url,
    # }

    # 打印存储的数据
    # print(f"Storing to session: {response_data}, Type: {type(response_data)}")

    # request.session['search_result'] = response_data 

    response_msg = {
        'msg': 'Visit at http://localhost:8000/api/BlogSeek/answer' 
    }

    # temp['title'] = response_data['title']
    # temp['url'] = response_data['url']
    temp['results'] = results

    return JsonResponse(response_msg)

def show_search(request):
    # result = request.session.get('search_result')
    print(f"Showing data: {temp}, Type: {type(temp)}")

    # print(f"Retrieved from session: {result}, Type: {type(result)}")
    return JsonResponse(temp)
    #return JsonResponse(res)


