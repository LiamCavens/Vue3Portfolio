<script setup lang="ts">
import TheFireworks from '../components/TheFireworks.vue'
import TheBubbles from '../components/TheBubbles.vue'
import { useModeStore } from '@/stores/mode'
import { ref } from 'vue'

const modeStore = useModeStore()

defineProps({
  themeColor: String
})

const hoveredIndex = ref<number | null>(null)

const getLetterScale = (index: number) => {
  if (hoveredIndex.value === null) return 1
  
  const distance = Math.abs(index - hoveredIndex.value)
  
  if (distance === 0) return 1.2
  if (distance === 1) return 1.1
  if (distance === 2) return 1.05
  
  return 1
}
</script>

<template>
  <main class="main">
    <h1
      class="bungee"
      :style="{
        'text-shadow': `-2px -2px 0 ${themeColor}, 2px -2px 0 ${themeColor}, -2px 2px 0 ${themeColor}, 2px 2px 0 ${themeColor}`,
        transition: 'all 0.3s ease-in-out 0s'
      }"
    >
      <span 
        v-for="(letter, index) in 'Liam Cavens'" 
        :key="index" 
        class="letter"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
        :style="{ transform: `scale(${getLetterScale(index)})` }"
      >{{ letter }}</span>
    </h1>
    <TheFireworks v-if="modeStore.mode === 'fireworks'" />
    <TheBubbles v-else-if="modeStore.mode === 'bubbles'" />
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

    .letter {
      display: inline-block;
      transition: transform 0.2s ease;
    }
  }

  @media (max-width: 750px) {
    .bungee {
      font-size: 50px;
    }
  }
}

// .mode-buttons {
//   z-index: 100;
//   .mode-button {
//     background-color: #505050;
//     color: #fff;
//     border: none;
//     padding: 10px;

//     &:first-of-type {
//       border-bottom-left-radius: 10px;
//       padding-right: 10px;
//     }

//     &:last-of-type {
//       padding-left: 10px;
//       border-bottom-right-radius: 10px;
//     }
//   }
// }
</style>
