<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useColorStore } from '@/stores/color';

const colorStore = useColorStore();

interface Node {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
  pinned: boolean;
}

interface Connection {
  from: number;
  to: number;
  broken: boolean;
}

const canvasRef = ref<HTMLCanvasElement>();
const headerHeight = 100;
const footerHeight = 100;
const width = ref(window.innerWidth);
const height = ref(window.innerHeight - headerHeight - footerHeight);
const nodes = ref<Node[]>([]);
const connections = ref<Connection[]>([]);
const mouse = ref({ x: 0, y: 0, down: false });
const gridSpacing = 50;
const breakDistance = 60;
const springStrength = 0.05;
const damping = 0.9;

const ctx = computed(() => canvasRef.value?.getContext('2d'));

const createNet = () => {
  nodes.value = [];
  connections.value = [];

  const cols = Math.ceil(width.value / gridSpacing);
  const rows = Math.ceil(height.value / gridSpacing);

  // Create nodes
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const x = col * gridSpacing;
      const y = row * gridSpacing;
      const pinned = row === 0; // Pin top row

      nodes.value.push({
        x,
        y,
        originalX: x,
        originalY: y,
        vx: 0,
        vy: 0,
        pinned
      });
    }
  }

  // Create connections
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const index = row * (cols + 1) + col;

      // Horizontal connection
      if (col < cols) {
        connections.value.push({
          from: index,
          to: index + 1,
          broken: false
        });
      }

      // Vertical connection
      if (row < rows) {
        connections.value.push({
          from: index,
          to: index + (cols + 1),
          broken: false
        });
      }

      // Diagonal connections for stability
      if (col < cols && row < rows) {
        connections.value.push({
          from: index,
          to: index + (cols + 1) + 1,
          broken: false
        });
        connections.value.push({
          from: index + 1,
          to: index + (cols + 1),
          broken: false
        });
      }
    }
  }
};

const updateNodes = () => {
  nodes.value.forEach((node, i) => {
    if (node.pinned) return;

    // Apply gravity
    node.vy += 0.2;

    // Check if mouse is breaking connections
    if (mouse.value.down) {
      const dx = node.x - mouse.value.x;
      const dy = node.y - mouse.value.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 30) {
        // Break nearby connections
        connections.value.forEach(conn => {
          if ((conn.from === i || conn.to === i) && !conn.broken) {
            const otherNode = nodes.value[conn.from === i ? conn.to : conn.from];
            const connDist = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + 
              Math.pow(node.y - otherNode.y, 2)
            );
            if (connDist < breakDistance) {
              conn.broken = true;
            }
          }
        });

        // Push node away from mouse
        node.vx += (dx / dist) * 5;
        node.vy += (dy / dist) * 5;
      }
    }

    // Apply spring forces from connections
    connections.value.forEach(conn => {
      if (conn.broken) return;
      
      if (conn.from === i || conn.to === i) {
        const other = nodes.value[conn.from === i ? conn.to : conn.from];
        const dx = other.x - node.x;
        const dy = other.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const targetDist = gridSpacing;

        if (dist > breakDistance) {
          conn.broken = true;
        } else {
          const force = (dist - targetDist) * springStrength;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }
      }
    });

    // Apply velocity
    node.vx *= damping;
    node.vy *= damping;
    node.x += node.vx;
    node.y += node.vy;

    // Keep in bounds
    if (node.x < 0) { node.x = 0; node.vx *= -0.5; }
    if (node.x > width.value) { node.x = width.value; node.vx *= -0.5; }
    if (node.y > height.value) { node.y = height.value; node.vy *= -0.5; }
  });
};

const draw = () => {
  if (!ctx.value) return;

  // Clear with dark theme background
  const hsl = colorStore.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (hsl) {
    const h = hsl[1];
    ctx.value.fillStyle = `hsl(${h}, 50%, 5%)`;
  } else {
    ctx.value.fillStyle = '#000';
  }
  ctx.value.fillRect(0, 0, width.value, height.value);

  // Draw connections
  connections.value.forEach(conn => {
    if (conn.broken) return;

    const from = nodes.value[conn.from];
    const to = nodes.value[conn.to];

    ctx.value!.beginPath();
    ctx.value!.moveTo(from.x, from.y);
    ctx.value!.lineTo(to.x, to.y);
    ctx.value!.strokeStyle = colorStore.color;
    ctx.value!.lineWidth = 2;
    ctx.value!.stroke();
  });

  // Draw nodes
  nodes.value.forEach(node => {
    ctx.value!.beginPath();
    ctx.value!.arc(node.x, node.y, 3, 0, Math.PI * 2);
    ctx.value!.fillStyle = colorStore.color;
    ctx.value!.fill();
  });
};

const animate = () => {
  updateNodes();
  draw();
  requestAnimationFrame(animate);
};

const handleMouseMove = (event: MouseEvent) => {
  const rect = canvasRef.value?.getBoundingClientRect();
  if (rect) {
    mouse.value.x = event.clientX - rect.left;
    mouse.value.y = event.clientY - rect.top;
  }
};

const handleMouseDown = () => {
  mouse.value.down = true;
};

const handleMouseUp = () => {
  mouse.value.down = false;
};

const handleClick = () => {
  const colors = [
    'hsl(0, 100%, 50%)',    // Red
    'hsl(120, 100%, 50%)',  // Green
    'hsl(240, 100%, 50%)',  // Blue
    'hsl(60, 100%, 50%)',   // Yellow
    'hsl(300, 100%, 50%)',  // Magenta
    'hsl(180, 100%, 50%)',  // Cyan
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  colorStore.setColor(randomColor);
};

const handleResize = () => {
  width.value = window.innerWidth;
  height.value = window.innerHeight - headerHeight - footerHeight;
  createNet();
};

onMounted(() => {
  createNet();
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('resize', handleResize);
  animate();
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mousedown', handleMouseDown);
  window.removeEventListener('mouseup', handleMouseUp);
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <canvas
    ref="canvasRef"
    :width="width"
    :height="height"
    class="net-canvas"
    @click="handleClick"
  ></canvas>
</template>

<style scoped>
.net-canvas {
  position: fixed;
  top: 100px;
  left: 0;
  width: calc(100% - 0px);
  height: calc(100% - 200px);
  z-index: -1;
  cursor: crosshair;
}
</style>