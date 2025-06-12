<template>
  <AppHeader/>
  <div v-if="user !== null " >
      <!-- 个人信息 -->
    <div class="profile-card blog-card " :bordered="false">
      <UserAvatar/>
      <div class="info">
        <div class="blog-title">{{ user.username }}</div>
        <p>{{ user.bio }}</p>
      </div>
      <a-button class='login-regis-buttons' type="link" @click="goToEditProfile">编辑资料</a-button>
    </div>
    
    <!-- Blog Actions & List -->
    <div class="followings-box" >
      <div class="blog-title">我的收藏</div>
      <div v-if="true" >
        <a-col v-for= "item in followings" :key="item.id">
          <div class="blog-card follings-style" >
              <div class = "blog-content">
                <!-- 左侧主内容区域 -->
                <div class="left-content">
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
                    <div class="date">2025-6-5</div>
                  </div>
                </div>
                
              </div>

            </div>
        </a-col>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { goToBlog, goToEditProfile, goToHome } from '@/utils/routers';
import { StarOutlined, StarFilled } from '@ant-design/icons-vue';
import { h } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import request from '@/utils/request'

const followings = ref([]);
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;
console.log(user)

onMounted(async () => {
  if(user !== null){
    try {
      const response = await request.get('/api/users/followed_blogs/');
      followings.value = response.data.map(item => ({
        id: item.id,
        title: item.title,
        tags: item.tags, 
        description: item.desc,
        url: item.url,
        author: item.author,
        isFavorite: true,
      }));
    } catch (error) {
      message.error('获取收藏列表失败：' + error);
    }
  }
  else{ //用户为空直接返回主页
    goToHome();
  }
});

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

</script>

<style scoped>
.follings-style {
  padding: 5px;
  height: 60%;
  border-color: var(--vt-c-divider);
}

.profile-card {
  flex-direction: column;
  align-items: center;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 30px;
  gap: 16px;
  width: 50%;
  max-width: 400px;
}

.profile-card .info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.followings-box {
  display: flex;
  flex: 1;
  margin: 10px;
  padding: 30px;
  min-width: 0;
  max-width: 95%;
  width: 100%;
  height: 90%;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: var(--color-background-light);
}

</style>
