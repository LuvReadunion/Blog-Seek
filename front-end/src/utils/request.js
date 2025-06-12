import { message } from 'ant-design-vue';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://154.44.31.8:8000', // 后端地址
  timeout: 5000,
});

// 请求拦截器：自动附带 token
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


export default instance;

export function downloadFile(fileName) { //下载Windows桌面版
  const fileUrl = './desktop/' + fileName; // 文件的URL地址
  window.open(fileUrl);
}
