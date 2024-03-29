<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useColorStore } from '@/stores/color';

const colorStore = useColorStore();
const updateColor = (newColor: string) => colorStore.setColor(newColor);

interface Particle {
  x: number
  y: number
  dead: boolean
  move: () => void
  draw: () => void
}

interface Seed {
  x: number
  y: number
  dead: boolean
  move: () => void
  draw: () => void
  explode: () => void
}

const canvasRef = ref()
const width = ref(window.innerWidth)
const height = ref(window.innerHeight)
const seedAmount = ref(0)
const seeds = ref<Seed[]>([])
const particles = ref<Particle[]>([])
const auto = ref(true);

const ctx = computed(() => canvasRef.value?.getContext('2d'))

const clearCanvas = () => {
  if (ctx.value) {
    ctx.value.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.value.fillRect(0, 0, width.value, height.value)
  }
}

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const circle = (x: number, y: number, radius: number): void => {
  if (ctx.value) {
    ctx.value.beginPath()
    ctx.value.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.value.closePath()
  }
}

const loop = () => {
  if (ctx.value) {
    clearCanvas()
    ctx.value.globalCompositeOperation = 'lighter'

    seeds.value.forEach((seed, i) => {
      if (!seed.dead) {
        seed.move()
        seed.draw()
      } else {
        seeds.value.splice(i, 1)
      }
    })

    particles.value.forEach((particle, i) => {
      if (!particle.dead) {
        particle.move()
        particle.draw()
      } else {
        particles.value.splice(i, 1)
      }
    })

    if (auto.value && seedAmount.value % 300 === 0) {
      const seed = createSeed(
        randomInt(20, width.value - 20),
        window.innerHeight - 100,
        randomInt(175, 185),
        [randomInt(0, 359), '100%', '50%']
      )
      seeds.value.push(seed)
    }

    ctx.value.globalCompositeOperation = 'destination-out'
    requestAnimationFrame(loop)
    seedAmount.value++
  }
}

const createSeed = (x: number, y: number, angle: number, color: [number, string, string]): Seed => {
  const acceleration = 0.05
  const radius = 3
  const [h, s, l] = color
  const finalColor = `hsla(${h}, ${s}, ${l}, 1)`
  let speed = 2
  let dead = false

  const seed = {
    x,
    y,
    dead,
    move: () => {
      if (seed.y > randomInt(100, 400)) {
        speed += acceleration
        seed.x += speed * Math.sin((Math.PI / 180) * angle)
        seed.y += speed * Math.cos((Math.PI / 180) * angle)
      } else if (!dead) {
        seed.explode()
        seed.dead = true
      }
    },
    draw: () => {
      if (ctx.value) {
        ctx.value.fillStyle = finalColor
        circle(seed.x, seed.y, radius)
        ctx.value.fill()
      }
    },
    explode: () => {
      for (let i = 0; i < 359; i += 4) {
        const particle = createFirework(seed.x, seed.y, i + randomInt(-200, 200) / 100, [h, s, l])
        particles.value.push(particle)
      }
      updateColor(finalColor);
    }
  }

  return seed
}

const createFirework = (
  x: number,
  y: number,
  angle: number,
  color: [number, string, string]
): Particle => {
  const angleOffset = randomInt(-20, 20) / 100
  const radius = 1
  const acceleration = -0.005
  const gravity = 0.0
  let opacity = 1
  let finalColor = `hsla(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`
  let verticalSpeed = 0
  let speed = randomInt(195, 205) / 100
  let targetAngle = angle
  let positionX = x
  let positionY = y

  const firework = {
    x,
    y,
    dead: false,
    move: () => {
      if (opacity > 0) {
        if (speed > 0) {
          speed += acceleration
        }
        targetAngle += angleOffset
        opacity -= 0.005
        finalColor = `hsla(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`
        verticalSpeed += gravity
        positionX += speed * Math.sin((Math.PI / 180) * targetAngle)
        positionY += speed * Math.cos((Math.PI / 180) * targetAngle) + verticalSpeed
      } else if (!firework.dead) {
        firework.dead = true
      }
    },
    draw: () => {
      if (ctx.value) {
        ctx.value.fillStyle = finalColor
        circle(positionX, positionY, radius)
        ctx.value.fill()
      }
    }
  }

  return firework
}

onMounted(() => {
  if (canvasRef.value) {
    canvasRef.value.width = width.value
    canvasRef.value.height = height.value
    loop()
  }

  const onClick = () => {
    const seed = createSeed(
      randomInt(20, width.value - 20),
      window.innerHeight - 100,
      randomInt(175, 185),
      [randomInt(0, 359), '100%', '50%']
    )
    seeds.value.push(seed)
  }
  window.addEventListener('click', onClick)

  const onResize = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
    if (canvasRef.value) {
      canvasRef.value.width = width.value
      canvasRef.value.height = height.value
    }
    clearCanvas()
  }
  window.addEventListener('resize', onResize)

  watch(
    () => [width.value, height.value],
    () => {
      clearCanvas()
    }
  )

  onUnmounted(() => {
    window.removeEventListener('click', onClick)
    window.removeEventListener('resize', onResize)
  })
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
