# Vue 3 Portfolio

🌐 **Live Site:** [liamcavens.co.uk](https://liamcavens.co.uk/)

An interactive portfolio website built with Vue 3, TypeScript, and HTML5 Canvas featuring multiple dynamic background modes.

## ✨ Features

### Interactive Canvas Modes
- 🎆 **Fireworks** - Click to launch colorful fireworks with dual-color explosions
- 🫧 **Bubbles** - Interactive bubbles that grow when you hover over them
- ⭐ **Constellation** - Particles that connect and follow your mouse with a space gradient text effect
- 🌧️ **Matrix** - Digital rain with splash effects and dynamic background theming

### Dynamic Theming
- Color theme updates based on fireworks explosions
- Click to change colors in Constellation and Matrix modes
- Synchronized header, footer, and text colors across all modes

### Additional Features
- Responsive design for mobile and desktop
- Smooth letter hover animations on the main title
- Downloadable CV
- Social media links (GitHub, LinkedIn, Email)

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **HTML5 Canvas** - Interactive animations
- **Vite** - Build tool and dev server
- **SCSS** - Styling

## 📦 Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── TheBubbles.vue
│   ├── TheConstellation.vue
│   ├── TheFireworks.vue
│   ├── TheMatrix.vue
│   ├── TheHeader.vue
│   └── TheFooter.vue
├── views/              # Page components
│   └── HomeView.vue
├── stores/             # Pinia state management
│   ├── color.ts
│   └── mode.ts
├── types/              # TypeScript type definitions
│   └── modeConstants.ts
├── router/             # Vue Router configuration
│   └── index.ts
└── assets/             # Static assets
    ├── fonts/
    ├── images/
    └── files/
```

## 🎨 Canvas Modes Explained

### Fireworks Mode
- Click anywhere to launch fireworks
- Auto mode generates fireworks every 300 frames
- Light-colored fireworks add contrasting colors
- Dark-colored fireworks add lighter variants
- Updates global theme color on explosion

### Bubbles Mode
- 500 interactive bubbles floating across the screen
- Bubbles expand when mouse hovers over them
- Smooth physics-based movement with edge collision

### Constellation Mode
- 100 particles with connection lines
- Particles attracted to mouse cursor
- Dynamic space gradient text effect
- Click to randomize theme color

### Matrix Mode
- Digital rain with Katakana, Latin, and numeric characters
- Realistic water droplet splash effects at footer
- Background color adapts to current theme
- Click to change rain color

## 🚀 Deployment

This project is deployed at [liamcavens.co.uk](https://liamcavens.co.uk/)

Built with ❤️ using Vue 3 and Canvas
