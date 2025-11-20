<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { useColorStore } from '@/stores/color'

const colorStore = useColorStore()
const canvasRef = ref()
const width = ref(window.innerWidth)
const height = ref(window.innerHeight)
const ctx = computed(() => canvasRef.value?.getContext('2d'))
const bubbles = ref<Bubble[]>([])
const mouse = reactive({ x: 0, y: 0 })

interface Bubble {
  x: number
  y: number
  update: () => void
  draw: () => void
}

const animate = () => {
  requestAnimationFrame(animate)
  ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  bubbles.value.forEach((bubble) => {
    bubble.update()
  })
}

const populateBubbles = () => {
  for (let i = 0; i < 500; i++) {
    let radius = Math.random() * 3 + 1
    let x = Math.random() * (canvasRef.value.width - radius * 2.5) + radius
    let y = Math.random() * (canvasRef.value.height - radius * 2.5) + radius
    let speedX = Math.random() * 1
    let speedY = Math.random() * 1

    bubbles.value.push(Circle(x, y, radius, speedX, speedY))
  }
}

const Circle = (
  x: number,
  y: number,
  radius = 10,
  speedX = 5,
  speedY = 5,
  maxRadius = 30
): Bubble => {
  let circleX = x
  let circleY = y
  let circleRadius = radius
  let circleSpeedX = speedX
  let circleSpeedY = speedY
  let circleMaxRadius = maxRadius
  let circleMinRadius = radius

  const draw = () => {
    //desenha o circulo
    ctx.value.beginPath()
    ctx.value.strokeStyle = colorStore.color;
    ctx.value.fillStyle = colorStore.color;
    ctx.value.arc(circleX, circleY, circleRadius, 0, Math.PI * 2, false)
    ctx.value.stroke()
    ctx.value.fill()
    ctx.value.closePath()
  }

  const update = () => {
    if (circleX + circleRadius > canvasRef.value.width || circleX - circleRadius < 0) {
      circleSpeedX = -circleSpeedX
    }
    if (circleY + circleRadius > canvasRef.value.height || circleY - circleRadius < 0) {
      circleSpeedY = -circleSpeedY
    }
    circleX += circleSpeedX
    circleY += circleSpeedY

    if (
      mouse.x - circleX < 50 &&
      mouse.x - circleX > -50 &&
      mouse.y - circleY < 50 &&
      mouse.y - circleY > -50
    ) {
      if (circleRadius < circleMaxRadius) {
        circleRadius += 1
      }
    } else if (circleRadius > circleMinRadius) {
      circleRadius -= 1
    }

    draw()
  }

  return {
    x: circleX,
    y: circleY,
    update,
    draw
  }
}

const updateMousePosition = (event: MouseEvent) => {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect()
    mouse.x = event.clientX - rect.left
    mouse.y = event.clientY - rect.top
  }
}

const onResize = () => {
  width.value = window.innerWidth
  height.value = window.innerHeight
  if (canvasRef.value) {
    canvasRef.value.width = width.value
    canvasRef.value.height = height.value
  }
}

const clearCanvas = () => {
  if (ctx.value) {
    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.value.fillRect(0, 0, width.value, height.value)
  }
}

onMounted(() => {
  if (canvasRef.value) {
    canvasRef.value.width = width.value
    canvasRef.value.height = height.value
    populateBubbles()
    animate()
  }

  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', updateMousePosition)
})

onUnmounted(() => {
  console.log('unmounted bubbles');
  window.removeEventListener('resize', onResize);
  clearCanvas();
})
</script>

<template>
  <div class="canvasBox" :style="`height: 100%; width: 100%;`">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.canvasBox {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  overflow: hidden;
}
</style>
