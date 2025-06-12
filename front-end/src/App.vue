<template>
  <router-view />
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#012c51',
      },
    }"
  >
  </a-config-provider>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { fire } from '@/utils/routers.js';

//烟花
fire()

const userStore = useUserStore()

onMounted(() => {
  userStore.restoreLogin()
})
</script>

<script>
export default {
  name: 'App',
};
</script>
