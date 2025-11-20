<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useColorStore } from '@/stores/color';

const colorStore = useColorStore();

// Computed background color - very dark version of theme color
const backgroundColor = computed(() => {
  // Extract hue from the color store color (hsla format)
  const match = colorStore.color.match(/hsla\((\d+),/);
  if (match) {
    const hue = match[1];
    return `hsla(${hue}, 50%, 5%, 1)`; // Very dark, slight saturation
  }
  return 'rgba(0, 0, 0, 1)'; // Fallback to black
});

interface Drop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  opacity: number[];
}

interface Splash {
  x: number;
  y: number;
  vy: number; // vertical velocity
  vx: number; // horizontal velocity
  opacity: number;
  size: number;
}

const canvasRef = ref<HTMLCanvasElement>();
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
const drops = ref<Drop[]>([]);
const splashes = ref<Splash[]>([]);
const fontSize = 16;
const columns = ref(0);
const footerHeight = 100; // Height of the footer

// Matrix characters - mix of katakana, latin, and numbers
const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const ctx = computed(() => canvasRef.value?.getContext('2d'));

const createDrop = (columnIndex: number): Drop => {
  const charsInColumn = Math.floor(height.value / fontSize);
  const chars: string[] = [];
  const opacity: number[] = [];
  
  // Initialize with random characters
  for (let i = 0; i < charsInColumn; i++) {
    chars.push(matrixChars[Math.floor(Math.random() * matrixChars.length)]);
    opacity.push(0);
  }

  return {
    x: columnIndex * fontSize,
    y: Math.random() * -height.value, // Start above screen
    speed: Math.random() * 3 + 2, // Random speed between 2-5
    chars,
    opacity
  };
};

const createSplash = (x: number, y: number): Splash => {
  return {
    x,
    y,
    vy: -Math.random() * 3 - 2, // Initial upward velocity
    vx: (Math.random() - 0.5) * 2, // Small horizontal velocity
    opacity: 1,
    size: Math.random() * 2 + 1 // Small droplet size
  };
};

const drawDrop = (drop: Drop) => {
  if (!ctx.value) return;

  const currentRow = Math.floor(drop.y / fontSize);
  
  // Update character opacities for trailing effect
  for (let i = 0; i < drop.chars.length; i++) {
    const distanceFromHead = currentRow - i;
    
    if (distanceFromHead >= 0 && distanceFromHead < 20) {
      // Fade from bright to dark
      drop.opacity[i] = Math.max(0, 1 - (distanceFromHead / 20));
      
      // Occasionally change the character
      if (Math.random() > 0.95) {
        drop.chars[i] = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      }
    } else {
      drop.opacity[i] = 0;
    }
  }

  // Draw all visible characters in this column
  for (let i = 0; i < drop.chars.length; i++) {
    if (drop.opacity[i] > 0) {
      const yPos = i * fontSize;
      
      // Use color from color store with opacity
      ctx.value.fillStyle = `${colorStore.color.replace('1)', `${drop.opacity[i]})`)}`;
      
      // Brightest character at the head
      if (i === currentRow) {
        ctx.value.fillStyle = '#ffffff';
      }
      
      ctx.value.font = `${fontSize}px monospace`;
      ctx.value.fillText(drop.chars[i], drop.x, yPos);
    }
  }
};

const drawSplash = (splash: Splash) => {
  if (!ctx.value) return;

  ctx.value.beginPath();
  ctx.value.arc(splash.x, splash.y, splash.size, 0, Math.PI * 2);
  ctx.value.fillStyle = colorStore.color.replace('1)', `${splash.opacity})`);
  ctx.value.fill();
  ctx.value.closePath();
};

const animate = () => {
  if (!ctx.value) return;

  // First, fill with solid background color
  const match = colorStore.color.match(/hsla\((\d+),/);
  if (match) {
    const hue = match[1];
    ctx.value.fillStyle = `hsla(${hue}, 50%, 5%, 1)`;
  } else {
    ctx.value.fillStyle = 'rgba(0, 0, 0, 1)';
  }
  ctx.value.fillRect(0, 0, width.value, height.value);

  // Then add semi-transparent layer for trail effect
  if (match) {
    const hue = match[1];
    ctx.value.fillStyle = `hsla(${hue}, 50%, 5%, 0.05)`;
  } else {
    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.05)';
  }
  ctx.value.fillRect(0, 0, width.value, height.value);

  // Draw and update splashes
  splashes.value.forEach((splash, index) => {
    drawSplash(splash);
    
    // Apply physics
    splash.vy += 0.3; // Gravity
    splash.y += splash.vy;
    splash.x += splash.vx;
    splash.opacity -= 0.015;

    // Remove splash when it fades out or goes below footer
    if (splash.opacity <= 0 || splash.y > height.value - footerHeight + 10) {
      splashes.value.splice(index, 1);
    }
  });

  drops.value.forEach((drop, index) => {
    drawDrop(drop);
    drop.y += drop.speed;

    // Check if drop hits footer area
    const footerY = height.value - footerHeight;
    if (drop.y >= footerY && drop.y < footerY + drop.speed + 5) {
      // Create multiple small splash droplets when hitting footer
      for (let i = 0; i < 3; i++) {
        splashes.value.push(createSplash(drop.x + (Math.random() - 0.5) * 5, footerY));
      }
    }

    // Reset drop when it goes off screen
    if (drop.y > height.value + fontSize * 20) {
      drops.value[index] = createDrop(index);
    }
  });

  requestAnimationFrame(animate);
};

const handleClick = () => {
  // Generate a random hue for matrix rain color
  const hue = Math.floor(Math.random() * 360);
  const newColor = `hsla(${hue}, 100%, 50%, 1)`;
  colorStore.setColor(newColor);
};

const handleResize = () => {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
  
  if (canvasRef.value) {
    canvasRef.value.width = width.value;
    canvasRef.value.height = height.value;
  }

  // Recalculate columns
  columns.value = Math.floor(width.value / fontSize);
  drops.value = [];
  
  // Create new drops for each column
  for (let i = 0; i < columns.value; i++) {
    drops.value.push(createDrop(i));
  }
};

onMounted(() => {
  if (canvasRef.value) {
    canvasRef.value.width = width.value;
    canvasRef.value.height = height.value;
  }

  // Calculate number of columns
  columns.value = Math.floor(width.value / fontSize);

  // Initialize drops
  for (let i = 0; i < columns.value; i++) {
    const drop = createDrop(i);
    // Stagger starting positions
    drop.y = Math.random() * height.value - height.value;
    drops.value.push(drop);
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('click', handleClick);
  animate();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('click', handleClick);
});
</script>

<template>
  <canvas
    ref="canvasRef"
    :width="width"
    :height="height"
    class="matrix-canvas"
  ></canvas>
</template>

<style scoped>
.matrix-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: v-bind(backgroundColor);
  cursor: pointer;
}
</style>
