<script setup lang="ts">
import TheFireworks from '../components/TheFireworks.vue'
import TheBubbles from '../components/TheBubbles.vue'
import TheConstellation from '../components/TheConstellation.vue'
import TheMatrix from '../components/TheMatrix.vue'
import { useModeStore } from '@/stores/mode'
import { type Mode, MODES } from '@/types/modeConstants';
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
  <main class="main" :class="{ 'constellation-mode': modeStore.mode === MODES.CONSTELLATION }">
    <h1
      class="bungee"
      :style="{
        color: modeStore.mode === MODES.CONSTELLATION ? undefined : '#fff',
        'text-shadow': modeStore.mode === MODES.CONSTELLATION 
          ? 'none'
          : `-2px -2px 0 ${themeColor}, 2px -2px 0 ${themeColor}, -2px 2px 0 ${themeColor}, 2px 2px 0 ${themeColor}`,
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
    <TheFireworks v-if="modeStore.mode === MODES.FIREWORKS" />
    <TheBubbles v-else-if="modeStore.mode === MODES.BUBBLES" />
    <TheConstellation v-else-if="modeStore.mode === MODES.CONSTELLATION" />
    <TheMatrix v-else-if="modeStore.mode === MODES.MATRIX" />
  </main>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  position: relative;

  .bungee {
    user-select: none;
    font-size: 100px;
    font-family: 'Bungee';
    color: #fff;
    text-align: center;
    position: relative;
    z-index: 1;

    .letter {
      display: inline-block;
      transition: transform 0.2s ease;
    }
  }

  &.constellation-mode .bungee {
    background: linear-gradient(
      90deg,
      #667eea 0%,
      #764ba2 20%,
      #f093fb 40%,
      #4facfe 60%,
      #00f2fe 80%,
      #667eea 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: galaxyShift 8s linear infinite;
    filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5))
            drop-shadow(0 0 20px rgba(118, 75, 162, 0.3))
            drop-shadow(0 0 30px rgba(79, 172, 254, 0.2));
  }

  @keyframes galaxyShift {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: 200% center;
    }
  }

  @media (max-width: 750px) {
    .bungee {
      font-size: 50px;
    }
  }
}
</style>
