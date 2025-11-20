<script setup lang="ts">
import { ref } from 'vue'
import LiamCartoon from '../assets/images/LiamCartoon.jpg'
import LiamCV from '../assets/files/LiamCavensCV.pdf'
import { type Mode } from '@/types/modeConstants';
import { useModeStore } from '@/stores/mode';

const modeStore = useModeStore();
const updateMode = (newMode: Mode) => modeStore.setMode(newMode);

defineProps({
  themeColor: String
})

const modeArray = ref<Mode[]>(['fireworks', 'bubbles', 'constellation', 'matrix']);
const previousMode = ref<Mode>('fireworks'); // Store the last active mode

// When we click change mode, we will cycle to the next item in the modeArray
const changeMode = () => {
  const currentMode = modeStore.mode;
  
  // If currently off, don't cycle, just keep it off
  if (currentMode === 'off') return;
  
  const currentModeIndex = modeArray.value.indexOf(currentMode);
  const nextModeIndex = (currentModeIndex + 1) % modeArray.value.length;
  const nextMode = modeArray.value[nextModeIndex];
  updateMode(nextMode);
  previousMode.value = nextMode;
}

const toggleMode = () => {
  if (modeStore.mode === 'off') {
    // Turn back on to a random mode
    const randomIndex = Math.floor(Math.random() * modeArray.value.length);
    const randomMode = modeArray.value[randomIndex];
    updateMode(randomMode);
    previousMode.value = randomMode;
  } else {
    // Turn off and remember current mode
    previousMode.value = modeStore.mode;
    updateMode('off');
  }
}

const getNextModeName = () => {
  const currentMode = modeStore.mode;
  if (currentMode === 'off') return 'Off';
  return currentMode.charAt(0).toUpperCase() + currentMode.slice(1);
}

</script>

<template>
  <header class="header">
    <img class="header-img" :src="LiamCartoon" alt="LCImage" />

    <div class="header-titles">
      <h2 :style="{ 'text-decoration-color': themeColor }">Liam Cavens</h2>
      <p>Software developer</p>
    </div>
    <div class="change-mode">
      <button @click="toggleMode()" class="toggle-button">
        {{ modeStore.mode === 'off' ? 'Turn On' : 'Turn Off' }} Canvas
      </button>
      <button @click="changeMode()">{{ getNextModeName() }}</button>
    </div>
    <div class="header-links">
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
      text-decoration: underline;
      transition: all 0.3s ease-in-out 0s;
    }

    h2,
    p {
      margin: 0;
    }
  }

  &-links {
    margin-left: auto;

    .link {
      text-decoration: none;
      position: relative;
      transition: all 0.3s ease-in-out 0s;
      font-weight: 600;
    }
  }
}

.change-mode {
  margin: 20px;
  display: flex;
  gap: 10px;

  button {
    width: 120px;
    padding: 8px 16px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    background-color: #707070;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #909090;
    }

    &.toggle-button {
      width: 140px;
    }
  }
}
</style>
