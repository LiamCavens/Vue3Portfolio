<script setup lang="ts">
import { ref, watch } from 'vue'
import TheFireworks from '../components/TheFireworks.vue'
import { useColorStore } from '@/stores/color'; // Adjust the path as needed

const colorStore = useColorStore();
const themeColor = ref(colorStore.color);

watch(
  () => colorStore.color, 
  (newColor) => {
    themeColor.value = newColor;
  }
);

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
    <TheFireworks />
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
