import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useColorStore = defineStore('color', () => {
  const color = ref('hsla(210, 100%, 50%, 1)');
  function setColor(newColor: string) {
    color.value = newColor;
  }

  return { color, setColor }
})
