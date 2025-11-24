<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import { useColorStore } from './stores/color'

const colorStore = useColorStore()
</script>

<template>
  <div class="app-container">
    <TheHeader :theme-color="colorStore.color" />
    <RouterView :theme-color="colorStore.color" class="router-view" />
    <TheFooter :theme-color="colorStore.color" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
}

.router-view {
  flex: 1;
  overflow: hidden;
  position: relative;
}
</style>
