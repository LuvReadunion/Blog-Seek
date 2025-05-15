<template>
  <a-layout-header class="header">
    <div class="logo" @click="goToHome()">
      <img :src="BlogSeekIcon" alt="BlogSeek Logo" class="logo-icon" />
    </div>
  </a-layout-header>

  <div class="form-container">
    <h1 style="color: var(--color-heading); margin-bottom: 20px;">注册</h1>
    <a-form :model="form" @submit.prevent="onSubmit" layout="vertical">
      <a-form-item >
        <div style="color: var(--color-heading); text-align: left; margin-bottom: 10px;">用户名</div>
        <a-input size = "large" v-model:value="form.username" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item >
        <div style="color: var(--color-heading); text-align: left; margin-bottom: 10px;">密码</div>
        <a-input-password size = "large" v-model:value="form.password" placeholder="请输入密码" />
      </a-form-item>
      <a-form-item >
        <div style="color: var(--color-heading); text-align: left; margin-bottom: 10px;">确认密码</div>
        <a-input-password size = "large" v-model:value="form.confirmPassword" placeholder="请再次输入密码" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">注册</a-button>
      </a-form-item>
      <a-form-item>
        <a @click="goToLogin()" class="login-regis-buttons">已有账号？去登录</a>
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
  import { goToLogin, goToHome } from '@/utils/routers.js';

  const router = useRouter()
  const form = ref({ username: '', password: '', confirmPassword: '' })
  const loading = ref(false)
  
  const onSubmit = async () => {
    if (!form.value.username || !form.value.password || !form.value.confirmPassword) {
      message.warning('请填写完整信息')
      return
    }
    if (form.value.password !== form.value.confirmPassword) {
      message.warning('两次密码输入不一致')
      return
    }
    loading.value = true
    try {
      await axios.post('/api/register', {
        username: form.value.username,
        password: form.value.password
      })
      message.success('注册成功，请登录')
      router.push('/login')
    } catch (error) {
      message.error('注册失败：' + (error.response?.data?.message || '请重试'))
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style >
  </style>
  