<template>
  <AppHeader/>
  <div class = "search-box">
    <div style="display: flex; margin-top: 2px;">
      <a-input-search
        v-model:value="keyword" 
        placeholder="输入关键词搜索..."
        enter-button="Search"
        size="large"
        @input="onInput"
        @paste="onPaste"
        @search="searchAndUpdate(keyword)"
      />
    </div>
    
  </div>


  <div v-if="true" >
    <a-row gutter="[16,16]">
      <a-col ::sm="24" :md="24" :lg="24" :xl="12" :xxl="12"
         v-for= "item in results" :key="item.id">
        <!-- :style="{ backgroundImage: `linear-gradient(to left, rgba(241, 255, 241, 0.35), rgba(248, 248, 255, 0.95) 60%), linear-gradient(to bottom, rgba(255, 255, 0, 0.1), rgba(0, 0, 255, 0.1)), url(${item.cover})`, 'background-size': 'cover' }" -->
        <div class="blog-card"  >
            <div class = "blog-content">
              <!-- 左侧主内容区域 -->
              <div class="left-content">
                <!-- 作者信息，已作废
                <div class="author-info">
                  <a-avatar :src="item.avatar" />
                  <span class="author-name">{{ item.author }}</span>
                  <div class="author-name">用户名</div>
                </div> -->
                
                <div class = "blog-title" @click="goToBlog(item.url)">{{ item.title }}</div>
              
                <div class = "blog-url">{{ item.url }}</div>
                <!-- <div class = "blog-desc">这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述</div> -->
                <div class = "blog-desc">{{ item.description }}</div>
              

                <div class="tags-box">
                  <span
                    v-for="(tag, index) in (item.tags || []).slice(0, 6)"
                    :key="index"
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- 右侧收藏区域 -->
              <div class = "right-content">
                <div class="sidebar">
                  <a-button type="collect"
                    :type="item.isFavorite ? 'danger' : 'default'"
                    @click="toggleFavorite(item)"
                    size="large"
                    :icon="item.isFavorite ? h(StarFilled) : h(StarOutlined)"
                    :style="{ color: item.isFavorite ? '#fadb14' : '#aaa' }"
                  />
                  <div class="date">{{item.date}}</div>
                </div>
              </div>
              
            </div>

          </div>
      </a-col>
    </a-row>
  </div>

  <div v-else style="margin-top: 20px;">
    暂无搜索结果。
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import request from '@/utils/request';
import { goToBlog, goToSearch } from '@/utils/routers';
import { message } from 'ant-design-vue';
import { StarOutlined, StarFilled } from '@ant-design/icons-vue';
import { h } from 'vue';
import AppHeader from '@/components/AppHeader.vue';

const route = useRoute();
const keyword = ref('');
const results = ref([]);
const defaultCover = new URL('@/assets/default-cover.jpg', import.meta.url).href;

const followedBlogIds = ref(new Set()) // 存储已收藏博客ID集合
const MAX_LENGTH = 100

/** 计算字符长度（中英文都算 1 个） */
function getCharLength(str) {
  return Array.from(str).length
}

// 限制输入并弹窗提示
function onInput(e) {
  const val = e.target.value
  if (getCharLength(val) > MAX_LENGTH) {
    const truncated = Array.from(val).slice(0, MAX_LENGTH).join('')
    e.target.value = truncated
    keyword.value = truncated
    message.error(`最多输入 ${MAX_LENGTH} 个字符`)
  }
}
/** 粘贴时也限制长度 */
function onPaste(e) {
  const pasteText = e.clipboardData.getData('text')
  const combined = keyword.value + pasteText

  if (getCharLength(combined) > MAX_LENGTH) {
    e.preventDefault() // 阻止粘贴
    message.error(`粘贴内容过长，最多输入 ${MAX_LENGTH} 个字符`)
  }
}


onMounted(() => {
  keyword.value = route.query.keyword || 'default';
  if (!keyword.value) {
    message.warning('未提供搜索关键词，将加载默认数据');
  }
  console.log('组件挂载完成，可以操作 DOM 了');
  fetchResults();
  fetchFollowedBlogs()
});

//Luv add
function searchAndUpdate(keyword) {
  goToSearch(keyword);  //查询
  fetchResults(); //获取结果以刷新
}

async function fetchFollowedBlogs() {
  try {
    const res = await request.get('/api/users/followed_blogs/')
    followedBlogIds.value = new Set(res.data.map(blog => blog.id))
  } catch (error) {
    console.error('获取收藏博客失败', error)
  }
}

async function fetchResults() {
  try {
    const response = await request.get('/api/blogs/search/', {
      params: { query: keyword.value },
    });
    results.value = response.data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      date: item.date,
      tags: item.tags, 
      url: item.url,
      author: item.author,
      isFavorite: followedBlogIds.value.has(item.id),
    }));

  } catch (error) {
    console.error('搜索请求失败：', error);
  }
}

async function toggleFavorite(item) {
  try {
    const blogId = item.id
    if (!item.isFavorite) {
      await request.post('/api/users/follow/', { blog_id: blogId })
      item.isFavorite = true
      followedBlogIds.value.add(blogId)
      message.success('已收藏')
    } else {
      await request.post('/api/users/unfollow/', { blog_id: blogId })
      item.isFavorite = false
      followedBlogIds.value.delete(blogId)
      message.success('已取消收藏')
    }
  } catch (error) {
    message.error('操作失败，请重试')
    console.error('收藏/取消失败:', error)
  }
}

function setDefaultCover(event) {
  event.target.src = defaultCover;
}

</script>

<style>
.search-box {
  display: flex;
  gap: 16px;
  margin: 12px 12px 8px 0px;
  padding: 20px;
  width: 100%;
  background-color: var(--color-background-light);
  flex-wrap: wrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
