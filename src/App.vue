<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import { useColorStore } from '@/stores/color' // Adjust the path as needed

const colorStore = useColorStore()
const themeColor = ref(colorStore.color)

watch(
  () => colorStore.color,
  (newColor) => {
    themeColor.value = newColor
    document.documentElement.style.setProperty('--selectColor', newColor)
  },
  { immediate: true }
)
</script>

<template>
  <TheHeader :themeColor="themeColor" />

  <RouterView :themeColor="themeColor" />

  <TheFooter :themeColor="themeColor" />
</template>

<style scoped lang="scss"></style>
