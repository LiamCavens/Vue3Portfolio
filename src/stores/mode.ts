import { ref } from 'vue'
import { defineStore } from 'pinia';
import { type Mode, MODES } from '@/types/modeConstants';

export const useModeStore = defineStore('mode', () => {
  const mode = ref<Mode>(MODES.FIREWORKS)
  function setMode(newMode: Mode) {
    mode.value = newMode
  }

  return { mode, setMode }
})
