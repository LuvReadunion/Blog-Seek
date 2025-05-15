import router from '@/router';
import { message } from 'ant-design-vue';

export function goToLogin() {
  router.push('/login');
}

export function goToRegister() {
  router.push('/register');
}

export function goToHome() {
  router.push({path:'/'});
}

export function goToSearch(keyword, searchType) {
  if (keyword.trim()) {
    router.push({ path: '/search', query: { keyword: keyword, type: searchType } });
  } else {
    message.warning('请输入搜索关键词');
  }
}

export function goToBlog(url) {
  window.open(url, '_blank');
}