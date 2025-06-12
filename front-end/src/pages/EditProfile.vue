<template>
  <AppHeader/>

  <div class="form-container">
    <h1 style="color: var(--color-heading); margin-bottom: 20px;">修改信息</h1>
    <a-form :model="form" @submit.prevent="onSubmit" layout="vertical">
      <a-form-item >
        <div style="color: var(--color-heading); text-align: left; margin-bottom: 10px;">用户名</div>
        <a-input size = "large" v-model:value="form.username" :placeholder= "user.username" disabled/>
      </a-form-item>
      <a-form-item >
        <div style="color: var(--color-heading); text-align: left; margin-bottom: 10px;">个性签名</div>
        <a-input size = "large" v-model:value="form.bio" :placeholder= "user.bio" />
      </a-form-item>
      <!-- <a-form-item >
        <div style="color: var(--color-heading); text-align: left; margin-bottom: 10px;">密码</div>
        <a-input-password size = "large" v-model:value="form.password" placeholder="修改后的密码" />
      </a-form-item>
      <a-form-item >
        <div style="color: var(--color-heading); text-align: left; margin-bottom: 10px;">确认密码</div>
        <a-input-password size = "large" v-model:value="form.confirmPassword" placeholder="请再次输入密码" />
      </a-form-item> -->
      <a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import request from '@/utils/request';
  import { message } from 'ant-design-vue'
  import AppHeader from '@/components/AppHeader.vue';

  const router = useRouter()
  const form = ref({ username: '', password: '', confirmPassword: '' })
  const loading = ref(false)
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  const onSubmit = async () => {
  // if (form.value.password !== form.value.confirmPassword) {
  //   message.warning('两次密码输入不一致')
  //   return
  // }
  loading.value = true
  try {
    await request.patch('/api/users/' + user.id + '/', {
      // password: form.value.password,
      bio: form.value.bio,
    })
    message.success('修改成功')
    router.push('/user-profile')
  } catch (error) {
    message.error('修改失败：' + (error.response?.data?.username || '请重试'))
  } finally {
    loading.value = false
  }
}

  </script>
  
  