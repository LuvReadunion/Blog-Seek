
<template>
  <a-layout-header class="header">
    <div class="logo" @click="goToHome()">
      <img :src="BlogSeekIcon" alt="BlogSeek Logo" class="logo-icon" />
    </div>
  </a-layout-header>

  <div class="form-container">
    <h1 style="color: var(--color-heading); margin-bottom: 20px;">登录</h1>
    <a-form :model="form" @submit.prevent="onSubmit" layout="vertical">
      <a-form-item >
        <div style="color: var(--color-heading); text-align: left; margin-bottom: 10px;">用户名</div>
        <a-input size = "large" v-model:value="form.username" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item >
        <div style="color: var(--color-heading); text-align: left; margin-bottom: 10px;">密码</div>
        <a-input-password size = "large" v-model:value="form.password" placeholder="请输入密码" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">登录</a-button>
      </a-form-item>
      <a-form-item>
        <a @click="goToRegister()" class="login-regis-buttons">没有账号？立即注册</a>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import { message } from 'ant-design-vue'
import BlogSeekIcon from '@/assets/BlogSeek.svg'
import { goToRegister, goToHome, goToUser } from '@/utils/routers.js'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const form = ref({ username: '', password: '' })
const loading = ref(false)
const userStore = useUserStore()

const onSubmit = async () => {
  if (!form.value.username || !form.value.password) {
    message.warning('请填写用户名和密码')
    return
  }
  loading.value = true
  try {
    const response = await request.post('/api/login/', {
      username: form.value.username,
      password: form.value.password
    })
    const token = response.data.token
    
    // 使用 username 查找用户ID（先 list 用户列表）
    const userListRes = await request.get('/api/users/')
    console.log(userListRes)
    
    const matchedUser = userListRes.data.find(
      user => user.username === form.value.username
    )
    

    if (!matchedUser) throw new Error('用户不存在')

    const userId = matchedUser.id

    // 用 ID 获取用户信息（需 token）
    const userRes = await request.get(`/api/users/${userId}/`)


    userStore.login(token,{
      id: userRes.data.id,
      username: userRes.data.username,
      bio: userRes.data.bio,
    })

    message.success('登录成功')
    router.push('/')
  } catch (error) {
    message.error('登录失败：' + (error))
  } finally {
    loading.value = false
  }

}

</script>

<style >
</style>
