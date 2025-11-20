<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import { useColorStore } from './stores/color'

const colorStore = useColorStore()
</script>

<template>
  <TheHeader :theme-color="colorStore.color" />
    <RouterView :theme-color="colorStore.color" />
  <TheFooter :theme-color="colorStore.color" />
</template>
