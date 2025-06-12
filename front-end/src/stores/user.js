// stores/user.js
import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter()

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    token: '',
    username: '',
    avatarColor: '',
  }),
  actions: {
    // 生成一个伪随机颜色
    generateColor(username) {
      let hash = 0;
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
      }
      const color = `#${((hash >> 24) ^ (hash >> 16) ^ (hash >> 8) ^ hash) & 0xFFFFFF}`.padEnd(7, '0');
      return color;
    },

    login(token, userInfo) {
      this.id = userInfo.id
      this.token = token
      this.username = userInfo.username
      this.bios = userInfo.bios

      // 生成头像颜色（每次登录都不同）
      const avatarColor = this.generateColor(userInfo.username)
      this.avatarColor = avatarColor

      localStorage.setItem('token', token)
      localStorage.setItem('avatarColor', avatarColor)
      localStorage.setItem('user', JSON.stringify(userInfo))
    },
    
    logout() {
      this.token = ''
      this.username = ''
      this.id = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('avatarColor')
    },
    restoreLogin() {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      const avatarColor = localStorage.getItem('avatarColor')
      if (token && userStr) {
        const user = JSON.parse(userStr)
        this.token = token
        this.username = user.username
        this.id = user.id
        this.avatarColor = avatarColor
      }
    }
  }
})