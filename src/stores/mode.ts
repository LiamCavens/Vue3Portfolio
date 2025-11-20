import { ref } from 'vue'
import { defineStore } from 'pinia';
import { type ModeType } from '@/types/modeConstants';

export const useModeStore = defineStore('mode', () => {
  const mode = ref<ModeType>('bubbles')
  function setMode(newMode: ModeType) {
    mode.value = newMode
  }

  return { mode, setMode }
})
