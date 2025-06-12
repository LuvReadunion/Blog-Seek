import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import SearchResult from '../pages/SearchResult.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import UserProfile from '../pages/UserProfile.vue'
import Upload from '../pages/Upload.vue'
import Favourites from '../pages/Favourites.vue'
import Follings from '../pages/Follings.vue'
import EditProfile from '../pages/EditProfile.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/search', name: 'SearchResult',  component: SearchResult },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/user-profile', name: 'UserProfile', component: UserProfile },
  { path: '/upload', name: 'Upload',  component: Upload },
  { path: '/favourites', name: 'Favourites', component: Favourites },
  { path: '/follings', name: 'Follings', component: Follings },
  { path: '/edit-profile', name: 'EditProfile', component: EditProfile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
