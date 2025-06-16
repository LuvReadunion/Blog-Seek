<template>
  <!-- 顶部栏 -->
  <AppHeader />

  <!-- 页面内容区 -->
  <a-layout-content class="searchBox">
    <span class="title titleHover" @click="gotoITrandom()">Blog Seek</span>
    <span class="subtitle subtitleHover" @click="gotorandom()">博采众长</span>
    <div style="display: flex; margin-top: 16px;">
      <a-input-search
        v-model:value="keyword"
        placeholder="输入关键词搜索..."
        enter-button="Search"
        size="large"
        @input="onInput"
        @paste="onPaste"
        @search="goToSearch(keyword)"
      />
    </div>
  </a-layout-content>
  
  <!-- 左下角github地址 -->
  <span class="githubAddress" @click="goToBlog('https://github.com/LuvReadunion/Blog-Seek')" >github仓库: BlogSeek源代码</span>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import AppHeader from '@/components/AppHeader.vue'
import { goToBlog, goToSearch } from '@/utils/routers.js'
import { getITrandom } from '@/utils/randomtext.js'

const MAX_LENGTH = 100
const keyword = ref('')

/** 计算字符长度（中英文都算 1 个） */
function getCharLength(str) {
  return Array.from(str).length
}

/** 输入事件：超出时截断并提示 */
function onInput(e) {
  const val = e.target.value
  if (getCharLength(val) > MAX_LENGTH) {
    const truncated = Array.from(val).slice(0, MAX_LENGTH).join('')
    keyword.value = truncated
    message.error(`最多输入 ${MAX_LENGTH} 个字符`)
  } else {
    keyword.value = val
  }
}

/** 粘贴事件：粘贴前判断是否会超限，超限则阻止粘贴 */
function onPaste(e) {
  const pasteText = e.clipboardData.getData('text')
  const combined = keyword.value + pasteText
  if (getCharLength(combined) > MAX_LENGTH) {
    e.preventDefault()
    message.error(`粘贴内容过长，最多输入 ${MAX_LENGTH} 个字符`)
  }
}

/* 随机生成中文句子 */
function randomText(minLength, maxLength) {
  const simplifiedChineseStart = 0x4e00;
  const simplifiedChineseEnd = 0x9fbf;
  const textLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let generatedText = '';

  for (let i = 0; i < textLength; i++) {
    const randomUnicode = Math.floor(Math.random() * (simplifiedChineseEnd - simplifiedChineseStart + 1)) + simplifiedChineseStart;
    generatedText += String.fromCharCode(randomUnicode);
  }
  return generatedText;
}
function gotorandom() {
  const text = randomText(3, 7);
  goToSearch(text);
}
function gotoITrandom() {
  const text = getITrandom();
  goToSearch(text);
}
</script>

<style>
.searchBox {
  text-align: center;
  margin: 160px auto;
  place-items: center;
  width: 100%;
  max-width: 600px;
  color: var(--color-background);
  background-color: var(--color-background-light);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.titleHover{
  user-select:none;
}
.titleHover:hover{
  color: rgba(219, 13, 255, 0.913);
  user-select:none;
}
.subtitleHover{
  user-select:none;
}
.subtitleHover:hover{
  color: rgba(25, 48, 255, 0.924);
  text-shadow: 0 1px 4px rgba(255, 255, 72, 0.834);
  user-select:none;
}

.githubAddress{
  position: absolute;
  bottom: 1%;
  left: 1%;
  color: rgba(182, 183, 190, 0.942);
}
.githubAddress:hover{
  color: rgb(253, 255, 108);
  text-shadow: 0 1px 4px rgba(255, 129, 32, 0.2);
  user-select:none;
}

</style>
