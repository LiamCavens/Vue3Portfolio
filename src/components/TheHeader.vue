<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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
const previousMode = ref<Mode>('fireworks');
const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectMode = (mode: Mode) => {
  updateMode(mode);
  previousMode.value = mode;
  dropdownOpen.value = false;
};

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

const getCurrentModeName = () => {
  const currentMode = modeStore.mode;
  if (currentMode === 'off') return 'Off';
  return currentMode.charAt(0).toUpperCase() + currentMode.slice(1);
}

const getModeName = (mode: Mode) => {
  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const dropdown = document.querySelector('.mode-dropdown');
  if (dropdown && !dropdown.contains(event.target as Node)) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header class="header">
    <img class="header-img" :src="LiamCartoon" alt="LCImage" />

    <div class="header-titles">
      <h2 :style="{ 'text-decoration-color': themeColor }">Liam Cavens</h2>
      <p>Software developer</p>
    </div>

    <div class="change-mode">
      <div class="mode-dropdown">
        <button 
          @click.stop="toggleDropdown"
          :disabled="modeStore.mode === 'off'"
        >
          {{ getCurrentModeName() }}
          <span class="dropdown-arrow">▼</span>
        </button>
        <div v-if="dropdownOpen && modeStore.mode !== 'off'" class="dropdown-menu">
          <button 
            v-for="mode in modeArray" 
            :key="mode"
            class="dropdown-item"
            :class="{ active: modeStore.mode === mode }"
            @click="selectMode(mode)"
          >
            {{ getModeName(mode) }}
          </button>
        </div>
      </div>
      <button @click="toggleMode" class="toggle-button">
        {{ modeStore.mode === 'off' ? 'Turn On' : 'Turn Off' }} Canvas
      </button>
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
  position: relative;

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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
      background-color: #909090;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.toggle-button {
      width: 100%;
    }
  }
}

.mode-dropdown {
  position: relative;
}

.dropdown-arrow {
  font-size: 0.7rem;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background-color: #404040;
  border: 1px solid #606060;
  border-radius: 4px;
  overflow: hidden;
  min-width: 120px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.dropdown-item {
  width: 100%;
  background: transparent;
  border: none;
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: left;
  color: #c7c7c7;
  display: block;

  &:hover {
    background-color: #606060;
    color: #fff;
  }

  &.active {
    font-weight: 700;
    background-color: #505050;
    color: #fff;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #505050;
  }
}
</style>
