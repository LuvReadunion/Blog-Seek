<template>
  <AppHeader />
  <div class="list-page">
    
    <div class="section">
      <h2>我的关注</h2>
      <a-list :data-source="followings" bordered>
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
              :title="item.name"
              :description="item.bio"
              :avatar="item.avatar"
            />
            <template #actions>
              <a-button danger type="text" @click="unfollow(item.id)">取消关注</a-button>
            </template>
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

// 示例关注数据
const followings = ref([
  { id: 1, name: '张三', bio: '热爱算法与后端开发', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 2, name: '李四', bio: '专注于前端与Vue生态', avatar: 'https://i.pravatar.cc/150?img=5' },
]);

const unfollow = (id) => {
  followings.value = followings.value.filter(user => user.id !== id);
  message.success('已取消关注');
};
</script>

<style scoped>
.list-page {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
}
</style>
