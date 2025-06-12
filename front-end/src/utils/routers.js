import router from '@/router';
import { message } from 'ant-design-vue';

export function fire() {
  //烟花特效
  firework({
    excludeElements: ["a"],
    particles: [
      {
        shape: "circle",
        move: "emit",
        easing: "easeOutExpo",
        colors: [
          "rgba(55, 65, 255, 0.29)",
          "rgba(146, 63, 255, 0.39)",
          "rgba(94, 82, 255, 0.43)",
          "rgba(30, 236, 255, 0.21)",
        ],
        number: 10,
        duration: [1200, 1600],
        shapeOptions: {
          radius: [14, 32],
        },
      },
      {
        shape: "star",
        move: "emit",
        colors: [
          "rgba(86, 19, 255, 0.92)",
        ],
        number: 5,
        duration: 900,
        shapeOptions: {
          radius: 10,
          spikes: 4,
        }
      },
      {
        "shape": "polygon",
        "move": ["diffuse","rotate"],
        "easing": "easeOutExpo",
        "colors": ["#FFF"],
        "number": 1,
        "duration": [1200, 1800],
        "shapeOptions": {
          "radius": 20,
          "alpha": 0.5,
          "lineWidth": 6,
          "sides": 5
        }
      },
      {
        "shape": "star",
        "move": ["diffuse","rotate"],
        "easing": "easeOutExpo",
        "colors": ["#FFF"],
        "number": 1,
        "duration": [1200, 1800],
        "shapeOptions": {
          "radius": 20,
          "alpha": 0.5,
          "lineWidth": 6,
          "spikes": 5
        }
      },
      {
        "shape": "circle",
        "move": ["diffuse","rotate"],
        "easing": "easeOutExpo",
        "colors": ["#FFF"],
        "number": 1,
        "duration": [1200, 1800],
        "shapeOptions": {
          "radius": 20,
          "alpha": 0.5,
          "lineWidth": 6
        }
      }
    ]
  });
}

export function goToLogin() {
  router.push('/login');
}

export function goToRegister() {
  router.push('/register');
}

export function goToHome() {
  router.push({path:'/'});
}

export function goToUser() {
  router.push({path:'/user-profile'});
}

export function goToUpload(){
  router.push({path:'/upload'});
}

export function goToFavorites(){
  router.push({path:'/favourites'});
}
export function goToFollowings(){
  router.push({path:'/follings'});
}
export function goToEditProfile(){
  router.push({path:'/edit-profile'});
}

export function goToSearch(keyword) {
  if (keyword.trim()) { 
    router.push({ path: '/search', 
      query: { keyword: keyword } });
  } else {
    message.warning('请输入搜索关键词');
  }
}

export function goToBlog(url) {
  window.open(url, '_blank');
}

export function clear() {
  router.go(0);
  router.clearRoutes();
  router.go(0);
}