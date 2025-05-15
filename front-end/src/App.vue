<template>
  <router-view />
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#012c51',
      },
    }"
  >
  </a-config-provider>
</template>

<script>
export default {
  name: 'App',
};
</script>
