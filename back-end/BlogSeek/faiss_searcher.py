# faiss_searcher.py
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from BlogSeek.models import Blog

class FaissSearch:
    def __init__(self):
        self.model = None
        self.index = None
        self.id_map = {}
        self._initialized = False

    def Initialize(self):
        # TZH 确保只初始化一次
        if self._initialized:
            return

        # TZH 加载文本嵌入模型
        self.model = SentenceTransformer('BAAI/bge-large-zh')

        # TZH 获取所有博客标题
        blogs = Blog.objects.all()
        titles = [b.title for b in blogs]

        # TZH 生成向量并构建索引
        vectors = self.model.encode(titles)
        embed_vectors = np.array(vectors).astype('float32')
        dim = embed_vectors.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(embed_vectors)

        # TZH 建立索引映射
        self.id_map = {}
        for i, blog in enumerate(blogs):
            self.id_map[i] = blog.id
        
        # TZH 设置初始化标志
        self._initialized = True

    def Search(self, query: str):
        if not self._initialized:
            self.Initialize()

        # TZH 返回前 k 个结果
        k = 6

        # TZH 将查询转换为向量
        query_embed_vector = self.model.encode([query])
        query_embed_vector = np.array(query_embed_vector).astype('float32')

        # TZH 执行搜索
        distances, indices = self.index.search(query_embed_vector, k)
        
        # TZH 返回 blog id 列表
        return [ self.id_map.get(idx) for idx in indices[0] if idx in self.id_map ]

# TZH 创建 FaissSearch 实例
faiss_searcher = FaissSearch()


