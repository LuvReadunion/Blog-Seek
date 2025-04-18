<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>开源</template>

    全开源的开发项目，欢迎加入我们！
    <br>
    <br>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>实用</template>

    旨在开发真正实用的学习工具。
    <br>
    <br>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>轻量</template>

    简单而快速的博客搜索：
    <br>
    在右侧输入关键词并点击“询问”按钮便可以快速得到结果。
    <br>
    <br>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>AI问答</template>

    提供在线的AI问答功能。
    <br>
    目前还未实现。(悲)
    <br>
    <br>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>关注</template>
    
    注册账号获取关注和收藏功能。
    <br>
    上传你的博客地址成为Blog-Seek社群的一位站长！
    <br>
    目前还未实现。(悲)
    <br>
  </WelcomeItem>
</template>
