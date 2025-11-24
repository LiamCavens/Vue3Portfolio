<script setup lang="ts">
import { ref, nextTick, onMounted, computed } from 'vue'
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

const activeTab = ref(5) // Start with the most recent (rightmost)
const tabsContainer = ref<HTMLElement | null>(null)
const activeImageIndex = ref(0)
const isFullscreen = ref(false)

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

// Load portfolio items from JSON file
const portfolioItems = ref<PortfolioItem[]>(portfolioData)

// Get images for current project
const currentProjectImages = computed(() => {
  const project = portfolioItems.value[activeTab.value]
  if (!project.imageFolder) return []
  return getProjectImages(project.imageFolder)
})

const selectTab = async (index: number) => {
  activeTab.value = index
  activeImageIndex.value = 0 // Reset image index when changing projects
  await nextTick()
  scrollToActiveTab()
}

const scrollToActiveTab = () => {
  if (!tabsContainer.value) return
  
  const activeTabElement = tabsContainer.value.children[activeTab.value] as HTMLElement
  if (!activeTabElement) return
  
  // Calculate the offset needed to center the active tab
  const containerCenter = tabsContainer.value.offsetWidth / 2
  const tabOffsetLeft = activeTabElement.offsetLeft
  const tabWidth = activeTabElement.offsetWidth
  const tabCenter = tabOffsetLeft + (tabWidth / 2)
  const offset = containerCenter - tabCenter
  
  tabsContainer.value.style.transform = `translateX(${offset}px)`
  tabsContainer.value.style.transition = 'transform 0.5s ease'
}

const nextProject = async () => {
  if (activeTab.value < portfolioItems.value.length - 1) {
    activeTab.value++
    activeImageIndex.value = 0 // Reset image index
    await nextTick()
    scrollToActiveTab()
  }
}

const previousProject = async () => {
  if (activeTab.value > 0) {
    activeTab.value--
    activeImageIndex.value = 0 // Reset image index
    await nextTick()
    scrollToActiveTab()
  }
}

// Image carousel functions
const nextImage = () => {
  if (activeImageIndex.value < currentProjectImages.value.length - 1) {
    activeImageIndex.value++
  }
}

const previousImage = () => {
  if (activeImageIndex.value > 0) {
    activeImageIndex.value--
  }
}

const openFullscreen = () => {
  isFullscreen.value = true
}

const closeFullscreen = () => {
  isFullscreen.value = false
}

// Center the initial tab on mount
onMounted(() => {
  // Use setTimeout to ensure DOM is fully rendered
  setTimeout(() => {
    scrollToActiveTab()
  }, 100)
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

    <div class="timeline-container">
      <!-- Timeline tabs -->
      <div class="timeline-tabs-wrapper">
        <div class="timeline-tabs" ref="tabsContainer">
          <button
            v-for="(item, index) in portfolioItems"
            :key="item.id"
            class="timeline-tab"
            :class="{ active: activeTab === index }"
            @click="selectTab(index)"
          >
            <span class="tab-year">{{ item.year }}</span>
            <span class="tab-title">{{ item.tabTitle }}</span>
          </button>
        </div>
      </div>

      <!-- Carousel content -->
      <div class="carousel">
        <button 
          class="carousel-nav prev" 
          @click="previousProject"
          :disabled="activeTab === 0"
        >
          ‹
        </button>

        <div class="carousel-content">
          <transition name="slide" mode="out-in">
            <div :key="activeTab" class="project-card">
              <!-- Image Carousel -->
              <div v-if="currentProjectImages.length > 0" class="project-image">
                <div class="image-carousel">
                  <button 
                    v-if="currentProjectImages.length > 1"
                    class="image-nav prev" 
                    @click="previousImage"
                    :disabled="activeImageIndex === 0"
                  >
                    ‹
                  </button>
                  
                  <div class="image-container" @click="openFullscreen">
                    <img 
                      :src="currentProjectImages[activeImageIndex]" 
                      :alt="`${portfolioItems[activeTab].title} screenshot ${activeImageIndex + 1}`"
                    />
                    <div class="fullscreen-hint">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                      </svg>
                      Click to view fullscreen
                    </div>
                  </div>
                  
                  <button 
                    v-if="currentProjectImages.length > 1"
                    class="image-nav next" 
                    @click="nextImage"
                    :disabled="activeImageIndex === currentProjectImages.length - 1"
                  >
                    ›
                  </button>
                  
                  <div v-if="currentProjectImages.length > 1" class="image-indicators">
                    <span 
                      v-for="(img, index) in currentProjectImages" 
                      :key="index"
                      class="indicator"
                      :class="{ active: index === activeImageIndex }"
                      @click="activeImageIndex = index"
                    ></span>
                  </div>
                </div>
              </div>
              
              <div class="project-details">
                <h2>{{ portfolioItems[activeTab].title }}</h2>
                <span class="project-year">{{ portfolioItems[activeTab].year }}</span>
                <p class="project-description">{{ portfolioItems[activeTab].description }}</p>
                
                <div class="project-tech">
                  <span 
                    v-for="tech in portfolioItems[activeTab].technologies" 
                    :key="tech"
                    class="tech-tag"
                  >
                    {{ tech }}
                  </span>
                </div>

                <div class="project-links">
                  <a 
                    v-if="portfolioItems[activeTab].githubUrl" 
                    :href="portfolioItems[activeTab].githubUrl || undefined" 
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
                    v-if="portfolioItems[activeTab].liveUrl" 
                    :href="portfolioItems[activeTab].liveUrl || undefined" 
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link live"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    {{ portfolioItems[activeTab].liveUrlName || 'Live Demo' }}
                  </a>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <button 
          class="carousel-nav next" 
          @click="nextProject"
          :disabled="activeTab === portfolioItems.length - 1"
        >
          ›
        </button>
      </div>
    </div>

    <!-- Fullscreen Image Modal -->
    <div v-if="isFullscreen" class="fullscreen-modal" @click="closeFullscreen">
      <button class="close-fullscreen" @click="closeFullscreen">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <button 
        v-if="currentProjectImages.length > 1"
        class="fullscreen-nav prev" 
        @click.stop="previousImage"
        :disabled="activeImageIndex === 0"
      >
        ‹
      </button>
      
      <img 
        :src="currentProjectImages[activeImageIndex]" 
        :alt="`${portfolioItems[activeTab].title} screenshot ${activeImageIndex + 1}`"
        @click.stop
      />
      
      <button 
        v-if="currentProjectImages.length > 1"
        class="fullscreen-nav next" 
        @click.stop="nextImage"
        :disabled="activeImageIndex === currentProjectImages.length - 1"
      >
        ›
      </button>
      
      <div v-if="currentProjectImages.length > 1" class="fullscreen-indicators">
        <span 
          v-for="(img, index) in currentProjectImages" 
          :key="index"
          class="indicator"
          :class="{ active: index === activeImageIndex }"
          @click.stop="activeImageIndex = index"
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

.timeline-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.timeline-tabs-wrapper {
  position: relative;
  overflow: hidden;
  margin-bottom: 40px;
  
  /* Fade masks on left and right edges */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100px;
    pointer-events: none;
    z-index: 2;
  }
  
  &::before {
    left: 0;
    background: linear-gradient(to right, #2d2d2d 0%, transparent 100%);
  }
  
  &::after {
    right: 0;
    background: linear-gradient(to left, #2d2d2d 0%, transparent 100%);
  }
}

.timeline-tabs {
  display: flex;
  justify-content: flex-start;
  gap: 15px;
  padding: 10px 20px;
  position: relative;
  
  /* Smooth transition for sliding */
  transition: transform 0.5s ease;
}

.timeline-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 25px;
  background-color: rgba(32, 178, 170, 0.1);
  border: 2px solid rgba(32, 178, 170, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;

  .tab-year {
    font-size: 0.9rem;
    color: #5fd4cc;
    font-weight: 600;
    margin-bottom: 5px;
  }

  .tab-title {
    font-size: 0.85rem;
    color: #c7c7c7;
  }

  &:hover {
    background-color: rgba(32, 178, 170, 0.2);
    border-color: rgba(32, 178, 170, 0.5);
    transform: translateY(-2px);
  }

  &.active {
    background-color: rgba(32, 178, 170, 0.3);
    border-color: #20b2aa;
    box-shadow: 0 0 20px rgba(32, 178, 170, 0.4);

    .tab-year {
      color: #20b2aa;
    }

    .tab-title {
      color: #fff;
      font-weight: 600;
    }
  }
}

.carousel {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;

  &-nav {
    background-color: rgba(32, 178, 170, 0.2);
    border: 2px solid rgba(32, 178, 170, 0.4);
    color: #5fd4cc;
    font-size: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &:hover:not(:disabled) {
      background-color: rgba(32, 178, 170, 0.3);
      border-color: #20b2aa;
      transform: scale(1.1);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &-content {
    flex: 1;
    overflow: hidden;
    min-height: 500px;
    display: flex;
    align-items: center;
  }
}

.project-card {
  background: linear-gradient(135deg, rgba(32, 178, 170, 0.1) 0%, rgba(13, 45, 45, 0.6) 100%);
  border: 2px solid rgba(32, 178, 170, 0.3);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  display: grid;
  gap: 30px;
  height: 500px;
  width: 100%;

  // Use 2 columns when images exist, 1 column when no images
  &:has(.project-image) {
    grid-template-columns: 1fr 1fr;
  }
  
  &:not(:has(.project-image)) {
    grid-template-columns: 1fr;
    max-width: 800px;
    margin: 0 auto;
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

  .carousel-content {
    min-height: 600px;
  }

  .project-card {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
    height: auto;
    min-height: 400px;
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

  .timeline-tabs {
    gap: 8px;
    margin-bottom: 25px;
  }

  .timeline-tab {
    padding: 10px 15px;
    min-width: 100px;

    .tab-year {
      font-size: 0.8rem;
    }

    .tab-title {
      font-size: 0.75rem;
    }
  }

  .carousel {
    gap: 10px;

    &-nav {
      width: 40px;
      height: 40px;
      font-size: 1.5rem;
    }
  }

  .project-card {
    padding: 15px;
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

  .timeline-tabs {
    gap: 5px;
  }

  .timeline-tab {
    padding: 8px 12px;
    min-width: 80px;

    .tab-year {
      font-size: 0.7rem;
    }

    .tab-title {
      font-size: 0.7rem;
    }
  }

  .carousel-nav {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }

  .project-card {
    padding: 12px;
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
