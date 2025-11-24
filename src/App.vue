<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import { useColorStore } from './stores/color'

const colorStore = useColorStore()
const route = useRoute()

// Teal color for portfolio page
const portfolioTeal = '#20b2aa'
const defaultColor = 'hsla(210, 100%, 50%, 1)'

// Set theme color based on route
watch(() => route.path, (newPath) => {
  if (newPath === '/portfolio') {
    colorStore.setColor(portfolioTeal)
  } else if (colorStore.color === portfolioTeal) {
    // Only reset if it's still the portfolio teal color
    colorStore.setColor(defaultColor)
  }
}, { immediate: true })

const themeColor = computed(() => colorStore.color)
</script>

<template>
  <div class="app-container">
    <TheHeader :theme-color="themeColor" />
    <RouterView :theme-color="themeColor" class="router-view" />
    <TheFooter :theme-color="themeColor" />
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
