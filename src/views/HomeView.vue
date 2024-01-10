<script setup lang="ts">
import { ref } from 'vue'
import TheFireworks from '../components/TheFireworks.vue'

const themeColor = ref('dodgerblue')
const changeColor = (color: string) => {
  themeColor.value = `hsla(${color})`
}

</script>

<template>
  <main class="main">
    <h1
      class="bungee"
      :style="{
        'text-shadow': `-2px -2px 0 ${themeColor}, 2px -2px 0 ${themeColor}, -2px 2px 0 ${themeColor}, 2px 2px 0 ${themeColor}`
      }"
    >
      Liam Cavens
    </h1>
    <TheFireworks @firework="changeColor" />
  </main>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;

  .bungee {
    user-select: none;
    font-size: 100px;
    font-family: 'Bungee';
    color: #fff;
    text-align: center;
  }

  @media (max-width: 750px) {
    .bungee {
      font-size: 50px;
    }
  }
}
</style>
