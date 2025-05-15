
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
import axios from 'axios'
import { message } from 'ant-design-vue'
import BlogSeekIcon from '@/assets/BlogSeek.svg';
import { goToRegister, goToHome } from '@/utils/routers.js';

const router = useRouter()
const form = ref({ username: '', password: '' })
const loading = ref(false)

const onSubmit = async () => {
  if (!form.value.username || !form.value.password) {
    message.warning('请填写用户名和密码')
    return
  }
  loading.value = true
  try {
    await axios.post('/api/login', form.value)
    message.success('登录成功')
    router.push('/')
  } catch (error) {
    message.error('登录失败：' + (error.response?.data?.message || '请重试'))
  } finally {
    loading.value = false
  }
}

</script>

<style >
</style>
