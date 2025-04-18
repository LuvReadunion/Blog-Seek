<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="greetings">
    <h1 class="yellow">{{ msg }}</h1>
    <h3>
      欢迎来到博客搜素引擎(Demo)。
    </h3>
    <h3>
      请在下方输入查找关键词：
    </h3>
    <!-- 以下是回答 -->
    <ul>
      <li v-for="(ans, index) in answers" :key="index" style="display:block">
        {{index}}-{{ans.title}}-{{ans.url}}
      </li>
    </ul>

    <form action="">
      <input type="text" placeholder="待输入" v-model="inputQuestion.keyword"> <br>
    </form>
    <button type="submit" @click="Submit()">询问</button> <br>
    
  </div>
</template>

<!-- 在外面就没事 -->
//import {getAnswer, postQuestion} from '../api/api.js'

<script>
//import {getAnswer, postQuestion} from '../api/api.js'
export default {
  name: 'Home',
  data () {
    return {
      answers: [
        {title: 'test', url: 't'},
        {title: 'test2', url: 't2'}
      ],
      //形式上的question
      inputQuestion: {
        "keyword": "",
      }
    }
  },
  methods: {
    //从后端获得回答
    loadAnswer() {
      //调用API
      //getAnswer().then(response => {
      //  this.answers = response.data
      //})
    },
    //提交问题请求到后端
    Submit () {
      //调用API
      postQuestion(this.inputQuestion.keyword).then(response => {
        console.log(response)
        this.loadAnswer()
      })
    }
  },
  created: function () {
    this.loadAnswer()
  }
}
</script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

/* 输入框 */
input {
  margin: 15px;
  weight: 300px;
  height: 160px;
  border: 3px solid rgb(89, 200, 255);
  border-radius: 5px;
  font-size: 1.2rem;
  text-indent: 10px;
}

button {
  margin: 15px;
  weight: 80px;
  height: 50px;
  font-size: 1.2rem;
  border: 3px solid rgb(157, 255, 30);
  border-radius: 5px;
  background-color:rgba(255, 251, 139, 0.63);
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
