<!-- AppHeader.vue -->
<template>
  <a-layout-header class="header">
    <div class="logo" @click="goToHome"></div>
    <div class="auth-buttons download">
    <a-dropdown>
      <div class="login-regis-buttons">
        <DesktopOutlined /> 桌面版下载
      </div>
      <template #overlay>
        <a-menu>
          <a-button class="login-regis-buttons" type="link" @click="downloadFile('BS-Windows.zip')">
            <WindowsOutlined /> Windows
          </a-button>
          <a-button class="login-regis-buttons" type="link" @click="downloadFile('BS-MacOS.zip')">
            <AppleOutlined /> MacOS
          </a-button>
          <a-menu-divider />
        </a-menu>
      </template>
    </a-dropdown>
    </div>

    <div class="auth-buttons">
      
      <template v-if="!isLoggedIn">
        <a-button class="login-regis-buttons" type="link" @click="goToLogin">
          <LoginOutlined /> 登录
        </a-button>
        <a-button class="login-regis-buttons" type="link" @click="goToRegister">
          <UserAddOutlined /> 注册
        </a-button>
      </template>
      
      <template v-else>
        <a-dropdown>
          <UserAvatar/>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="goToUser">个人中心</a-menu-item>
              <a-menu-divider />
              <a-menu-item @click="logout">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      
    </div>
    
  </a-layout-header>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { DesktopOutlined, WindowsOutlined, AppleOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons-vue'
import { goToLogin, goToRegister, goToHome, goToUser, clear } from '@/utils/routers.js';
import { downloadFile } from '@/utils/request.js';
import UserAvatar from '@/components/UserAvatar.vue';

const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.token)


const logout = () => {
  clear()
  userStore.logout()
  location.reload()        // 刷新页面，使组件状态重置为未登录

}

</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height:auto ;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  background-color: var(--color-background-light);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.download{
  padding: 5px;
  margin-left: auto;
  margin-right: 1%;
  /*margin-top: 0.6%;*/
}

</style>
