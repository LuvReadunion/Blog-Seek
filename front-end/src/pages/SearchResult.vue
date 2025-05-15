<template>
  <a-layout-header class="header">
    <div class="logo" @click="goToHome()"></div>

    <span style="display: flex; margin-top: 16px;  ">
      <a-input-search v-model:value = "keyword" placeholder="输入关键词搜索..." 
      enterButton ="Search" size = "large" @search="goToSearch(keyword, searchType)"/>
    </span>
      <a-radio-group v-model:value="searchType" style = "margin-top: 20px; ">
        <a-radio value = "blog" class = "radio-buttons">搜索博客</a-radio>
        <a-radio value = "user" class = "radio-buttons">搜索用户</a-radio>
      </a-radio-group>

    <div class="auth-buttons">
        <a-button class="login-regis-buttons" type="link" @click="goToLogin">
          <LoginOutlined /> 登录
        </a-button>
        <a-button class="login-regis-buttons" type="link" @click="goToRegister">
          <UserAddOutlined /> 注册
        </a-button>
      </div>
  </a-layout-header>

  <div v-if="true" >
    <a-row gutter="[16,16]">
      <a-col :span="24" v-for="item in results" :key="item.id">
        <a-card class = "result-item">
          <template #cover>
            <span><img alt="封面" :src="item.cover" class = "cover" style="width: 250px;"/></span>
          </template>

          <template #extra>
            <a-button type="collect"
              :type="item.isFavorite ? 'danger' : 'default'"
              @click="toggleFavorite(item)"
              size="large"
              :icon="item.isFavorite ? h(StarFilled) : h(StarOutlined)"
              :style="{ color: item.isFavorite ? '#fadb14' : '#aaa' }"
            />
          </template>
          <span >
            <div class="author-info">
              <a-avatar :src="item.avatar" />
              <span class="author-name">{{ item.author }}</span>
            </div>
            <div class = "article_info"  @click="goToBlog(item.url)">
              <a-card-meta
                :title="item.title"
                :description="item.description"
              />
            </div>
            
          </span>
          
        </a-card>
      </a-col>
    </a-row>
  </div>

  <div v-else style="margin-top: 20px;">
    暂无搜索结果。
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import axios from 'axios';
import { goToHome, goToLogin, goToRegister, goToSearch, goToBlog} from '@/utils/routers';
import request from '@/utils/request';
import { message } from 'ant-design-vue';
import { SearchOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons-vue';
import { StarOutlined, StarFilled } from '@ant-design/icons-vue';
import { h } from 'vue';


const route = useRoute();
const keyword = ref('');
const searchType = ref('');
const results = ref([]);

onMounted(() => {
  keyword.value = route.query.keyword || 'default';
  searchType.value = route.query.type || 'blog';
  if (!keyword.value) {
    message.warning('未提供搜索关键词，将加载默认数据');
  }
  console.log('组件挂载完成，可以操作 DOM 了');
  fetchResults();
});

onBeforeRouteUpdate((to, from, next) => {
  keyword.value = to.query.keyword || '';
  fetchResults();
  next();
});

async function fetchResults() {
  try {
    const response = await request.get('/blogs/search/', {
      params: { query: keyword.value },
    });
    console.log(response)
    results.value = response.data.map(item => ({
      id: item.id,
      title: item.title,
      description: `作者：${item.author}，标签：${item.tags.join(', ')}`,
      url: item.url,
      author: item.author,
      avatar: `https://i.pravatar.cc/150?u=${item.author}`, // 用作者生成头像
      cover: 'https://via.placeholder.com/150',  // 如果后端提供封面图可以替换掉
      isFavorite: false,  // 默认未收藏
    }));
  } catch (error) {
    message.error('搜索失败，请稍后重试');
    console.error(error);
  }
}

function toggleFavorite(item) {
  item.isFavorite = !item.isFavorite;
  message.success(item.isFavorite ? '已收藏' : '已取消收藏');
}
</script>

<style>
.cover {
  max-height: 200px;
}
.result-item {
  display: flex;
  margin: 20px;
  height: auto;
  background-color: var(--color-background-light);
}
.author-info  {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: var(--color-text);
  font-size: 20px;
}

.author-info .author-name {
  margin-left: 10px;
}
.article_info .ant-card-meta-title {
  font-size: 25px;
  font-weight: bold;
  color: var(--color-text);
}
.article_info .ant-card-meta-description {
  font-size: 15px;
  color: var(--color-text);
}
.blog-link {
  margin-top: 10px;
}
</style>
