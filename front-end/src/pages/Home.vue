<template>
  <!-- 顶部栏 -->
  <AppHeader/>

  <!-- 页面内容区 -->
  <a-layout-content class = "searchBox " >
    <span class="title">Blog Seek</span>
    <span class="subtitle">博采众长</span>
    <div style="display: flex; margin-top: 16px;  ">
      <a-input-search v-model:value = "keyword" placeholder="输入关键词搜索..." 
      enterButton ="Search" size = "large" @search="goToSearch(keyword)"/>
    </div>

  </a-layout-content>
</template>

<script setup>
  import AppHeader from '@/components/AppHeader.vue';
  import { goToSearch } from '@/utils/routers.js';
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