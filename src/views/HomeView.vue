<script setup lang="ts">
import TheFireworks from '../components/TheFireworks.vue'
import TheBubbles from '../components/TheBubbles.vue'
import { useModeStore } from '@/stores/mode'

const modeStore = useModeStore()

const props = defineProps({
  themeColor: String
})
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
      Liam Cavens
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
