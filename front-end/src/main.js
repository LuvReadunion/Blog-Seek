import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/es/style';
import './assets/main.css';
import { createPinia } from 'pinia';
import AppHeader from './components/AppHeader.vue'


const pinia = createPinia();
createApp(App).use(router).use(Antd).use(pinia).use(AppHeader).mount('#app');
