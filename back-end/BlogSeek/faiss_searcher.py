# faiss_searcher.py
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from BlogSeek.models import Blog
import os
import pickle

class FaissSearch:
    # TZH 定义静态文件路径
    INDEX_PATH     = "models/faiss.index"
    IDMAP_PATH     = "models/faiss_id_map.pkl"
    EMBEDS_PATH    = "models/faiss_embeds.npy"

    def __init__(self):
        self.model = SentenceTransformer('moka-ai/m3e-base')
        self.index = None
        self.id_map = {}
        self._initialized = False

    def Initialize(self):
        if self._initialized:
            return

        # TZH 如果索引 映射文件都存在 直接从磁盘加载
        if os.path.exists(self.INDEX_PATH) and os.path.exists(self.IDMAP_PATH):
            print("从磁盘加载 FAISS 索引和 id_map …")
            self.index  = faiss.read_index(self.INDEX_PATH)
            self.id_map = pickle.load(open(self.IDMAP_PATH, 'rb'))

            # TZH 设置初始化完成
            self._initialized = True
            print("加载完成")
            return

        # TZH 否则需要重新初始化
        self._rebuild()

    def _rebuild(self):
        # TZH 确保只初始化一次
        if self._initialized:
            return

        print("FaissSearch 初始化中...")

        # TZH 获取所有博客标题
        blogs = []
        # mode = 'test'  # or 'prod' (production)
        mode = 'prod'
        if mode == 'test':
            print('测试数据量：50 (如果当前不是在进行测试，请在faiss_searcher.py中修改mode改为prod)') # mode 在上方
            blogs = Blog.objects.all()[:50]   # PYL: 只取前50篇博客做测试
        else:
            blogs = Blog.objects.all()
        titles = [b.title for b in blogs]
        vectors = []

        print(f"获取到 {len(titles)} 篇博客标题")

        # TZH 串行生成向量  PYL:无法并行
        count = 0
        print("开始生成向量并构建索引...")
        for title in titles:
            # TZH 生成向量
            vector = self.model.encode(title)
            vectors.append(vector)

            count += 1
            if count % 100 == 0:
                print(f"已处理 {count} 篇博客标题")

        embed_vectors = np.array(vectors).astype('float32')
        dim = embed_vectors.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(embed_vectors)

        # TZH 建立索引映射
        self.id_map = {}
        for i, blog in enumerate(blogs):
            self.id_map[i] = blog.id
        
        # TZH 持久化到磁盘
        print("持久化索引到磁盘…")
        faiss.write_index(self.index, self.INDEX_PATH)

        with open(self.IDMAP_PATH, 'wb') as f:
            pickle.dump(self.id_map, f)

        np.save(self.EMBEDS_PATH, embed_vectors, allow_pickle=False)

        # TZH 设置初始化成功
        self._initialized = True
        print("FaissSearch 初始化完成")

    def Search(self, query: str):
        print(f"开始检索：{query}")

        if not self._initialized:
            print("FaissSearch 未初始化，正在初始化...")
            self.Initialize()

        print("FaissSearch 已初始化，开始执行搜索...")
        # TZH 返回前 k 个结果
        k = 30

        print(f"查询转换为向量：{query}")
        # TZH 将查询转换为向量
        query_embed_vector = self.model.encode([query])

        query_embed_vector = np.array(query_embed_vector).astype('float32')

        print("开始执行 Faiss 搜索...")
        # TZH 执行搜索
        distances, indices = self.index.search(query_embed_vector, k)
        print(f"搜索完成，找到 {len(indices[0])} 个结果")
        
        # TZH 返回 blog id 列表
        return [ self.id_map.get(idx) for idx in indices[0] if idx in self.id_map ]

# TZH 创建 FaissSearch 实例
faiss_searcher = FaissSearch()
faiss_searcher.Initialize()


