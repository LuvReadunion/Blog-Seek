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
    <h2 class="yellow">博采众长</h2>
    <h3>
      欢迎来到博客搜索引擎。
    </h3>
    <h3>
      请在下方输入查找关键词：
    </h3>
    
    <form action="">
      <input type="text" placeholder="待输入" v-model="inputQuestion.keyword"> <br>
    </form>
    <button type="submit" @click="Submit()">询问</button> ←点击它<br>

    <!-- 以下是回答 -->
    <h4> 点击跳转： </h4>
    <h3>
    <a id="r0" href="" target="_blank" rel="nofollow"> {{answers.results[0].title}} </a>  <br>
    <a id="r1" href="" target="_blank" rel="nofollow"> {{answers.results[1].title}} </a>  <br>
    <a id="r2" href="" target="_blank" rel="nofollow"> {{answers.results[2].title}} </a>  <br>
    <a id="r3" href="" target="_blank" rel="nofollow"> {{answers.results[3].title}} </a>  <br>
    <a id="r4" href="" target="_blank" rel="nofollow"> {{answers.results[4].title}} </a>  <br>
    <a id="r5" href="" target="_blank" rel="nofollow"> {{answers.results[5].title}} </a>  <br>
    </h3>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'Home',
  data () {
    return {
      answers: {
        results:[
        {title: 'I', url: 'http://google.com/'},
        {title: 'LOVE', url: 'http://google.com/'},
        {title: 'S', url: 'http://google.com/'},
        {title: 'Y', url: 'http://google.com/'},
        {title: 'S', url: 'http://google.com/'},
        {title: 'U', url: 'http://google.com/'}
        ]
      },
      //形式上的question
      inputQuestion: {
        "keyword": "",
      }
    }
  },
  methods: {
    //从后端获得回答
    loadAnswer() {
      
      //目前是史山，不应该用服务器硬地址
      axios
      .get("http://154.44.31.8:8000/api/BlogSeek/answer/")
      .then((result) => {
        // result不是直接的返回结果
        console.log("数据：",result);
        // result.data才是真正的返回结果
        console.log("真正的数据：",result.data);
        this.answers = result.data;
        //更改显示
        document.getElementById("r0").href = this.answers.results[0].url;
        document.getElementById("r1").href = this.answers.results[1].url;
        document.getElementById("r2").href = this.answers.results[2].url;
        document.getElementById("r3").href = this.answers.results[3].url;
        document.getElementById("r4").href = this.answers.results[4].url;
        document.getElementById("r5").href = this.answers.results[5].url;
      })
      .catch((err) => {
        console.log(err);
      });

    },
    //提交问题请求到后端
    Submit () {
      
      axios
      .post("http://154.44.31.8:8000/api/BlogSeek/", {"keyword":this.inputQuestion.keyword})
      .then(res=>{
        console.log(res);
        this.loadAnswer();
      });

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
  font-size: 2.8rem;
  position: relative;
  //top: -10px;
}

h2 {
  font-size: 1.8rem;
  position: relative;
  top: -10px;
  text-align: center;
}

h3 {
  font-size: 1.2rem;
}

/* 输入框 */
input {
  margin: 10px;
  weight: 300px;
  height: 100px;
  border: 3px solid rgb(89, 200, 255);
  border-radius: 5px;
  font-size: 1.2rem;
  text-indent: 10px;
}

button {
  margin: 10px;
  weight: 80px;
  height: 50px;
  font-size: 1.2rem;
  border: 3px solid rgb(202, 255, 132);
  border-radius: 5px;
  background-color:rgba(255, 255, 255, 0.86);
  color:rgb(255, 22, 22);
}

ul {
  font-size: 1.3rem;
  margin: 0.2rem;
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
