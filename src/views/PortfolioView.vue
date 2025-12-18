<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import LiamCV from '../assets/files/LiamCavensCV.pdf'
import portfolioData from '../data/portfolio.json'

interface PortfolioItem {
  id: number
  title: string
  tabTitle: string
  year: string
  description: string
  technologies: string[]
  imageFolder: string | null
  githubUrl: string | null
  liveUrl: string | null
  liveUrlName: string | null
}

defineProps({
  themeColor: String
})

const activeImageIndexes = ref<Record<number, number>>({})
const isFullscreenData = ref<{ open: boolean; projectId: number; imageIndex: number }>({
  open: false,
  projectId: 0,
  imageIndex: 0
})
const activeProjectId = ref<number | null>(null)

// Function to import all images from a folder
const getProjectImages = (folderName: string | null) => {
  if (!folderName) return []
  
  try {
    const images = import.meta.glob('@/assets/images/**/*.(png|jpg|jpeg|gif|svg|webp)', { eager: true })
    const projectImages: string[] = []
    
    for (const path in images) {
      if (path.includes(`/images/${folderName}/`)) {
        projectImages.push((images[path] as { default: string }).default)
      }
    }
    
    return projectImages.sort()
  } catch (error) {
    console.error('Error loading images:', error)
    return []
  }
}

// Load portfolio items from JSON file (reversed to show newest first)
const portfolioItems = ref<PortfolioItem[]>([...portfolioData].reverse())

// Get images for a specific project
const getImagesForProject = (projectId: number) => {
  const project = portfolioItems.value.find(p => p.id === projectId)
  if (!project || !project.imageFolder) return []
  return getProjectImages(project.imageFolder)
}

// Scroll to a specific project
const scrollToProject = (projectId: number) => {
  const element = document.getElementById(`project-${projectId}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Image carousel functions
const nextImage = (projectId: number) => {
  const images = getImagesForProject(projectId)
  const currentIndex = activeImageIndexes.value[projectId] || 0
  if (currentIndex < images.length - 1) {
    activeImageIndexes.value[projectId] = currentIndex + 1
  }
}

const previousImage = (projectId: number) => {
  const currentIndex = activeImageIndexes.value[projectId] || 0
  if (currentIndex > 0) {
    activeImageIndexes.value[projectId] = currentIndex - 1
  }
}

const openFullscreen = (projectId: number, imageIndex: number) => {
  isFullscreenData.value = {
    open: true,
    projectId,
    imageIndex
  }
}

const closeFullscreen = () => {
  isFullscreenData.value.open = false
}

const nextImageFullscreen = () => {
  const images = getImagesForProject(isFullscreenData.value.projectId)
  if (isFullscreenData.value.imageIndex < images.length - 1) {
    isFullscreenData.value.imageIndex++
  }
}

const previousImageFullscreen = () => {
  if (isFullscreenData.value.imageIndex > 0) {
    isFullscreenData.value.imageIndex--
  }
}

const currentFullscreenImages = computed(() => {
  return getImagesForProject(isFullscreenData.value.projectId)
})

// Intersection Observer to track active project
const observerCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
      const projectId = entry.target.id.replace('project-', '')
      activeProjectId.value = parseInt(projectId)
    }
  })
}

onMounted(() => {
  const observer = new IntersectionObserver(observerCallback, {
    root: null,
    rootMargin: '-20% 0px -20% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1]
  })

  portfolioItems.value.forEach(item => {
    const element = document.getElementById(`project-${item.id}`)
    if (element) {
      observer.observe(element)
    }
  })

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>

<template>
  <main class="portfolio">
    <div class="portfolio-header">
      <h1 class="portfolio-title">PORTFOLIO</h1>
      <a class="download-cv-btn" :href="LiamCV" download>
        Download CV
      </a>
    </div>

    <div class="portfolio-container">
      <!-- Quick Navigation List -->
      <nav class="project-nav">
        <ul>
          <li v-for="item in portfolioItems" :key="item.id">
            <button 
              @click="scrollToProject(item.id)" 
              class="nav-button"
              :class="{ active: activeProjectId === item.id }"
            >
              <span class="nav-year">{{ item.year }}</span>
              <span class="nav-title">{{ item.tabTitle }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- Scrollable Projects List -->
      <div class="projects-scroll">
        <div 
          v-for="item in portfolioItems" 
          :key="item.id" 
          :id="`project-${item.id}`"
          class="project-card"
        >
          <!-- Image Carousel -->
          <div v-if="getImagesForProject(item.id).length > 0" class="project-image">
            <div class="image-carousel">
              <button 
                v-if="getImagesForProject(item.id).length > 1"
                class="image-nav prev" 
                @click="previousImage(item.id)"
                :disabled="(activeImageIndexes[item.id] || 0) === 0"
              >
                ‹
              </button>
              
              <div class="image-container" @click="openFullscreen(item.id, activeImageIndexes[item.id] || 0)">
                <img 
                  :src="getImagesForProject(item.id)[activeImageIndexes[item.id] || 0]" 
                  :alt="`${item.title} screenshot ${(activeImageIndexes[item.id] || 0) + 1}`"
                />
                <div class="fullscreen-hint">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  </svg>
                  Click to view fullscreen
                </div>
              </div>
              
              <button 
                v-if="getImagesForProject(item.id).length > 1"
                class="image-nav next" 
                @click="nextImage(item.id)"
                :disabled="(activeImageIndexes[item.id] || 0) === getImagesForProject(item.id).length - 1"
              >
                ›
              </button>
              
              <div v-if="getImagesForProject(item.id).length > 1" class="image-indicators">
                <span 
                  v-for="(img, index) in getImagesForProject(item.id)" 
                  :key="index"
                  class="indicator"
                  :class="{ active: index === (activeImageIndexes[item.id] || 0) }"
                  @click="activeImageIndexes[item.id] = index"
                ></span>
              </div>
            </div>
          </div>
          
          <div class="project-details">
            <h2>{{ item.title }}</h2>
            <span class="project-year">{{ item.year }}</span>
            <p class="project-description">{{ item.description }}</p>
            
            <div class="project-tech">
              <span 
                v-for="tech in item.technologies" 
                :key="tech"
                class="tech-tag"
              >
                {{ tech }}
              </span>
            </div>

            <div class="project-links">
              <a 
                v-if="item.githubUrl" 
                :href="item.githubUrl || undefined" 
                target="_blank"
                rel="noopener noreferrer"
                class="project-link github"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Code
              </a>
              <a 
                v-if="item.liveUrl" 
                :href="item.liveUrl || undefined" 
                target="_blank"
                rel="noopener noreferrer"
                class="project-link live"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                {{ item.liveUrlName || 'Live Demo' }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Image Modal -->
    <div v-if="isFullscreenData.open" class="fullscreen-modal" @click="closeFullscreen">
      <button class="close-fullscreen" @click="closeFullscreen">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <button 
        v-if="currentFullscreenImages.length > 1"
        class="fullscreen-nav prev" 
        @click.stop="previousImageFullscreen"
        :disabled="isFullscreenData.imageIndex === 0"
      >
        ‹
      </button>
      
      <img 
        :src="currentFullscreenImages[isFullscreenData.imageIndex]" 
        :alt="`Screenshot ${isFullscreenData.imageIndex + 1}`"
        @click.stop
      />
      
      <button 
        v-if="currentFullscreenImages.length > 1"
        class="fullscreen-nav next" 
        @click.stop="nextImageFullscreen"
        :disabled="isFullscreenData.imageIndex === currentFullscreenImages.length - 1"
      >
        ›
      </button>
      
      <div v-if="currentFullscreenImages.length > 1" class="fullscreen-indicators">
        <span 
          v-for="(img, index) in currentFullscreenImages" 
          :key="index"
          class="indicator"
          :class="{ active: index === isFullscreenData.imageIndex }"
          @click.stop="isFullscreenData.imageIndex = index"
        ></span>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.portfolio {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  overflow-y: auto;

  &-header {
    text-align: center;
    margin-bottom: 40px;
  }

  &-title {
    font-size: 3.5rem;
    font-family: 'Bungee';
    background: linear-gradient(90deg, #20b2aa, #5fd4cc, #20b2aa);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: tealShift 3s linear infinite;
    margin-bottom: 20px;
    filter: drop-shadow(0 0 20px rgba(32, 178, 170, 0.5));
  }

  @keyframes tealShift {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: 200% center;
    }
  }

  .download-cv-btn {
    display: inline-block;
    padding: 12px 30px;
    font-size: 16px;
    font-weight: 600;
    color: #0a1f1f;
    background-color: #20b2aa;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 15px rgba(32, 178, 170, 0.3);

    &:hover {
      background-color: #5fd4cc;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(32, 178, 170, 0.5);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.portfolio-container {
  max-width: 1400px;
  width: auto;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
  padding: 0 20px;
  align-items: start;
}

.project-nav {
  position: sticky;
  top: 20px;
  background: linear-gradient(135deg, rgba(32, 178, 170, 0.1) 0%, rgba(13, 45, 45, 0.6) 100%);
  border: 2px solid rgba(32, 178, 170, 0.3);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  h3 {
    color: #20b2aa;
    font-size: 1.2rem;
    margin: 0 0 15px 0;
    font-family: 'Bungee';
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    margin: 0;
  }

  .nav-button {
    width: 100%;
    background-color: rgba(32, 178, 170, 0.1);
    border: 2px solid rgba(32, 178, 170, 0.3);
    border-radius: 8px;
    padding: 12px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .nav-year {
      font-size: 0.75rem;
      color: #5fd4cc;
      font-weight: 600;
    }

    .nav-title {
      font-size: 0.85rem;
      color: #c7c7c7;
      font-weight: 500;
    }

    &:hover {
      background-color: rgba(32, 178, 170, 0.2);
      border-color: rgba(32, 178, 170, 0.5);
      transform: translateX(5px);

      .nav-title {
        color: #fff;
      }
    }

    &.active {
      background-color: rgba(32, 178, 170, 0.3);
      border-color: #20b2aa;
      border-width: 3px;

      .nav-year {
        color: #20b2aa;
      }

      .nav-title {
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

.projects-scroll {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-bottom: 40px;
}

.project-card {
  background: linear-gradient(135deg, rgba(32, 178, 170, 0.1) 0%, rgba(13, 45, 45, 0.6) 100%);
  border: 2px solid rgba(32, 178, 170, 0.3);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  display: grid;
  gap: 30px;
  scroll-margin-top: 20px;

  // Use 2 columns when images exist, 1 column when no images
  &:has(.project-image) {
    grid-template-columns: 1fr 1fr;
  }
  
  &:not(:has(.project-image)) {
    grid-template-columns: 1fr;
  }
}

.project-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  .image-carousel {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .image-container {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transition: transform 0.3s ease;
      }

      &:hover img {
        transform: scale(1.02);
      }

      .fullscreen-hint {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: #5fd4cc;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 0.75rem;
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0;
        transition: opacity 0.3s ease;

        svg {
          width: 16px;
          height: 16px;
        }
      }

      &:hover .fullscreen-hint {
        opacity: 1;
      }
    }

    .image-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(32, 178, 170, 0.2);
      border: 2px solid rgba(32, 178, 170, 0.4);
      color: #5fd4cc;
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      padding-bottom: 5px;

      &.prev {
        left: 10px;
      }

      &.next {
        right: 10px;
      }

      &:hover:not(:disabled) {
        background-color: rgba(32, 178, 170, 0.3);
        border-color: #20b2aa;
      }

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }

    .image-indicators {
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 2;

      .indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: rgba(95, 212, 204, 0.3);
        border: 1px solid rgba(32, 178, 170, 0.5);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background-color: rgba(95, 212, 204, 0.5);
        }

        &.active {
          background-color: #20b2aa;
          width: 24px;
          border-radius: 4px;
        }
      }
    }
  }
}

.project-details {
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    font-size: 2rem;
    color: #20b2aa;
    margin: 0;
    font-family: 'Bungee';
  }

  .project-year {
    font-size: 1rem;
    color: #5fd4cc;
    font-weight: 600;
  }

  .project-description {
    color: #c7c7c7;
    line-height: 1.6;
    margin-bottom: 25px;
  }
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;

  .tech-tag {
    background-color: rgba(32, 178, 170, 0.2);
    color: #5fd4cc;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid rgba(32, 178, 170, 0.4);
  }
}

.project-links {
  display: flex;
  gap: 15px;
  margin-top: auto;

  .project-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 2px solid rgba(32, 178, 170, 0.4);

    &.github {
      background-color: rgba(32, 178, 170, 0.1);
      color: #5fd4cc;

      &:hover {
        background-color: rgba(32, 178, 170, 0.2);
        border-color: #20b2aa;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(32, 178, 170, 0.3);
      }
    }

    &.live {
      background-color: #20b2aa;
      color: #0a1f1f;
      border-color: #20b2aa;

      &:hover {
        background-color: #5fd4cc;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(32, 178, 170, 0.5);
      }
    }

    svg {
      flex-shrink: 0;
    }
  }
}

// Fullscreen Modal
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    cursor: default;
  }

  .close-fullscreen {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: rgba(32, 178, 170, 0.2);
    border: 2px solid rgba(32, 178, 170, 0.4);
    color: #5fd4cc;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    &:hover {
      background-color: rgba(32, 178, 170, 0.3);
      border-color: #20b2aa;
      transform: rotate(90deg);
    }
  }

  .fullscreen-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(32, 178, 170, 0.2);
    border: 2px solid rgba(32, 178, 170, 0.4);
    color: #5fd4cc;
    font-size: 3rem;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    &.prev {
      left: 30px;
    }

    &.next {
      right: 30px;
    }

    &:hover:not(:disabled) {
      background-color: rgba(32, 178, 170, 0.3);
      border-color: #20b2aa;
      transform: translateY(-50%) scale(1.1);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  .fullscreen-indicators {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 10;

    .indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: rgba(95, 212, 204, 0.3);
      border: 2px solid rgba(32, 178, 170, 0.5);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(95, 212, 204, 0.6);
        transform: scale(1.2);
      }

      &.active {
        background-color: #20b2aa;
        width: 32px;
        border-radius: 6px;
      }
    }
  }
}

// Slide transition
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// Responsive styles
@media (max-width: 1100px) {
  .portfolio-container {
    grid-template-columns: 200px 1fr;
  }

  .project-nav {
    .nav-button {
      padding: 10px;

      .nav-year {
        font-size: 0.7rem;
      }

      .nav-title {
        font-size: 0.8rem;
      }
    }
  }
}

@media (max-width: 900px) {
  .portfolio {
    padding: 30px 15px;

    &-title {
      font-size: 2.5rem;
    }

    .download-cv-btn {
      padding: 10px 24px;
      font-size: 14px;
    }
  }

  .portfolio-container {
    grid-template-columns: 1fr;
    padding: 0 15px;
    width: auto;
  }

  .project-nav {
    display: none;
  }

  .project-card {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;

    .project-details {
      order: 1;
    }

    .project-image {
      order: 2;
      width: 100%;
      min-height: 300px;
    }
  }

  .project-details h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 750px) {
  .portfolio {
    padding: 20px 10px;

    &-title {
      font-size: 2rem;
      margin-bottom: 15px;
    }

    .download-cv-btn {
      padding: 8px 20px;
      font-size: 12px;
    }
  }

  .portfolio-container {
    padding: 0 10px;
    width: auto;
  }

  .projects-scroll {
    gap: 30px;
  }

  .project-card {
    padding: 15px;

    .project-image {
      min-height: 250px;
    }
  }

  .project-details h2 {
    font-size: 1.3rem;
  }

  .project-tech .tech-tag {
    font-size: 0.75rem;
    padding: 5px 10px;
  }
}

@media (max-width: 480px) {
  .portfolio {
    padding: 15px 8px;

    &-title {
      font-size: 1.5rem;
    }
  }

  .portfolio-container {
    padding: 0 8px;
    width: auto;
  }

  .project-card {
    padding: 12px;

    .project-image {
      min-height: 200px;
    }
  }

  .project-details {
    h2 {
      font-size: 1.1rem;
    }

    .project-year {
      font-size: 0.85rem;
    }

    .project-description {
      font-size: 0.85rem;
    }
  }
}
</style>
