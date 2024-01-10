<script setup lang="ts">
import { ref, watch } from 'vue'
import LiamCartoon from '../assets/images/LiamCartoon.jpg'
import LiamCV from '../assets/files/LiamCavensCV.pdf'
import { useColorStore } from '@/stores/color' // Adjust the path as needed
// import { RouterLink, RouterView } from 'vue-router'

const colorStore = useColorStore()
const themeColor = ref(colorStore.color)

watch(
  () => colorStore.color,
  (newColor) => {
    themeColor.value = newColor
  }
)
</script>

<template>
  <header class="header">
    <img class="header-img" :src="LiamCartoon" alt="LCImage" />

    <div class="header-titles" :style="{ color: themeColor }">
      <h2 :style="{ 'text-decoration-color': themeColor }">Liam Cavens</h2>
      <p>Software developer</p>
    </div>
    <div class="header-links">
      <!-- <a class="link" @click="modeChange('cssPhoto')">CSS Photo Filters</a> -->
      <a class="link" :style="{ color: themeColor }" :href="LiamCV" download>Download CV</a>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  z-index: 10;
  height: 100px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #c7c7c7;
  background-color: #505050;

  &-img {
    height: 80px;
    border-radius: 50%;
    margin: 10px;
    cursor: pointer;
  }

  &-titles {
    display: flex;
    flex-direction: column;

    h2 {
      cursor: pointer;
    }

    h2,
    p {
      margin: 0;
    }
  }

  &-links {
    margin-left: auto;
  }
}
</style>
