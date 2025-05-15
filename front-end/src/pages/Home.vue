<template>
  <!-- 顶部栏 -->
  <a-layout-header class="header">
    <div class="logo" @click="goToHome()">
      <img :src="BlogSeekIcon" alt="BlogSeek Logo" class="logo-icon" @click="goToHome"/>
    </div>
    <div class="auth-buttons">
        <a-button class="login-regis-buttons" type="link" @click="goToLogin">
          <LoginOutlined /> 登录
        </a-button>
        <a-button class="login-regis-buttons" type="link" @click="goToRegister">
          <UserAddOutlined /> 注册
        </a-button>
      </div>
  </a-layout-header>

  <!-- 页面内容区 -->
  <a-layout-content class = "searchBox " >
    <span class="title">Blog Seek</span>
    <span class="subtitle">博采众长</span>
    <div style="display: flex; margin-top: 16px;  ">
      <a-input-search v-model:value = "keyword" placeholder="输入关键词搜索..." 
      enterButton ="Search" size = "large" @search="goToSearch(keyword, searchType)"/>
    </div>

      <a-radio-group v-model:value="searchType" style = "margin-top: 20px; ">
        <a-radio value = "blog" class = "radio-buttons">搜索博客</a-radio>
        <a-radio value = "user" class = "radio-buttons">搜索用户</a-radio>
      </a-radio-group>
  </a-layout-content>
</template>

<script setup>
  import BlogSeekIcon from '@/assets/BlogSeek.svg';
  import { goToLogin, goToRegister, goToHome, goToSearch } from '@/utils/routers.js';
  import { SearchOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons-vue';
</script>

<script>
export default {
  name: 'Home',
  components: {
    SearchOutlined,
    LoginOutlined,
    UserAddOutlined,
  },
  data() {
    return {
      keyword: '',
      searchType: 'blog',
    };
  },
};
</script>

<style >

.searchBox {
  text-align: center;
  margin: 200px auto;
  place-items: center;
  width: 100%;
  max-width: 600px;
  color: var(--color-background);
  background-color: var(--color-background-light);
  padding: 40px;
  border-radius: 20px;
  
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>