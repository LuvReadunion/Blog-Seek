<template>
  <AppHeader />
  <div class="list-page">
    
    <div class="section">
      <h2>我的收藏</h2>
      <a-list :data-source="favorites" bordered>
        <template #renderItem="{ item }">
          <a-list-item @click="goToBlog(item.url)">
            <a-list-item-meta
              :title="item.title"
              :description="item.description"
            />
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import { message } from 'ant-design-vue';

const favorites = ref([
  { title: '并行程序设计 学习笔记', description: '关于并行算法与MPI的研究', url: '/blog/1' },
  { title: '贪心算法分析', description: '常见贪心策略的讲解', url: '/blog/2' },
]);

const goToBlog = (url) => {
  window.location.href = url;
};
</script>

<style scoped>
.list-page {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
}
</style>
