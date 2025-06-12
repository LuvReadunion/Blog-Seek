
<template>

  <div>
    <a-avatar v-if="user" size="large" :style="{ backgroundColor: avatarColor }">
      {{ user.username?.charAt(0) || 'U' }}
    </a-avatar>
    <a-avatar v-else size="large" icon="user" />
  </div>
</template>

<script setup>
import { WindowsOutlined, AppleOutlined } from '@ant-design/icons-vue'
import { downloadFile } from '@/utils/request.js';

const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;
const avatarColor = localStorage.getItem('avatarColor') || '#999';  // fallback color
</script>
