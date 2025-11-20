<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useColorStore } from '@/stores/color';

const colorStore = useColorStore();

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  draw: () => void;
  update: () => void;
}

const canvasRef = ref<HTMLCanvasElement>();
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
const particles = ref<Particle[]>([]);
const mouse = ref({ x: 0, y: 0 });
const connectionDistance = 150;
const mouseInfluence = 200;
const particleCount = 100;

const ctx = computed(() => canvasRef.value?.getContext('2d'));

const createParticle = (): Particle => {
  const x = Math.random() * width.value;
  const y = Math.random() * height.value;
  const vx = (Math.random() - 0.5) * 2;
  const vy = (Math.random() - 0.5) * 2;
  const radius = Math.random() * 2 + 1;

  const particle = {
    x,
    y,
    vx,
    vy,
    radius,
    draw: () => {
      if (ctx.value) {
        ctx.value.beginPath();
        ctx.value.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.value.fillStyle = colorStore.color;
        ctx.value.fill();
        ctx.value.closePath();
      }
    },
    update: () => {
      // Mouse attraction
      const dx = mouse.value.x - particle.x;
      const dy = mouse.value.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseInfluence) {
        const force = (mouseInfluence - distance) / mouseInfluence;
        particle.vx += (dx / distance) * force * 0.2;
        particle.vy += (dy / distance) * force * 0.2;
      }

      // Apply velocity
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Damping
      particle.vx *= 0.95;
      particle.vy *= 0.95;

      // Keep small base velocity
      if (Math.abs(particle.vx) < 0.5) particle.vx += (Math.random() - 0.5) * 0.1;
      if (Math.abs(particle.vy) < 0.5) particle.vy += (Math.random() - 0.5) * 0.1;

      // Bounce off edges
      if (particle.x < 0 || particle.x > width.value) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(width.value, particle.x));
      }
      if (particle.y < 0 || particle.y > height.value) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(height.value, particle.y));
      }
    }
  };

  return particle;
};

const drawConnections = () => {
  if (!ctx.value) return;

  for (let i = 0; i < particles.value.length; i++) {
    for (let j = i + 1; j < particles.value.length; j++) {
      const dx = particles.value[i].x - particles.value[j].x;
      const dy = particles.value[i].y - particles.value[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        const opacity = 1 - distance / connectionDistance;
        ctx.value.beginPath();
        ctx.value.strokeStyle = `${colorStore.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.value.lineWidth = opacity * 2;
        ctx.value.moveTo(particles.value[i].x, particles.value[i].y);
        ctx.value.lineTo(particles.value[j].x, particles.value[j].y);
        ctx.value.stroke();
        ctx.value.closePath();
      }
    }
  }
};

const animate = () => {
  if (!ctx.value) return;

  // Fill with solid black background first
  ctx.value.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.value.fillRect(0, 0, width.value, height.value);
  
  // Add semi-transparent layer for trail effect
  ctx.value.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.value.fillRect(0, 0, width.value, height.value);

  drawConnections();

  particles.value.forEach(particle => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animate);
};

const handleMouseMove = (event: MouseEvent) => {
  mouse.value.x = event.clientX;
  mouse.value.y = event.clientY;
};

const handleClick = () => {
  // Generate a random hue between 0-359 for space-like colors
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
};

onMounted(() => {
  if (canvasRef.value) {
    canvasRef.value.width = width.value;
    canvasRef.value.height = height.value;
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.value.push(createParticle());
  }

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', handleResize);
  window.addEventListener('click', handleClick);
  animate();
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('click', handleClick);
});
</script>

<template>
  <canvas
    ref="canvasRef"
    :width="width"
    :height="height"
    class="constellation-canvas"
  ></canvas>
</template>

<style scoped>
.constellation-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: #000;
}
</style>