# BLACK & BREW — Luxury Coffee House Website

A luxury, cinematic coffee house website built with **React 19**, **Vite**, **Framer Motion**, **Lenis**, and **Lucide React**.

---

## ☕ Key Features & Interactive Architecture

1. **Brand Identity & Aesthetic**
   - Signature Dark & Gold theme: `#080808` obsidian background, `#141414` warm charcoal, and `#FFC928` artisanal gold.
   - Cinematic typography featuring *Playfair Display* (luxury serif), *Plus Jakarta Sans* (modern sans), and *Satisfy* (handwritten script).

2. **Scroll Dynamics & Animations**
   - **Lenis Smooth Scrolling**: Synced with `requestAnimationFrame` for buttery page momentum.
   - **Pinned Coffee-Brown Progress Beam**: `#6F4E37` gradient indicator tracks reading progress.
   - **Floating Coffee Bean Decorations**: Ambient 3D beans with scroll-linked rotation and Y-axis movement.
   - **Hero Parallax**: Headline moves and fades upwards; background video moves with depth parallax.
   - **Sticky "Our Story" Chapter Scroll**: 3 cross-fading story chapters with `<Counter>` milestone stats (8+ Years, 45,000+ Regulars, 100,000+ Cups).
   - **The Signature Fan-Out**: Deck of reserve cards fan out along an arc as user scrolls into the section.
   - **Luxury 3D Showcase**: Rotating golden pedestal with steam and sensory tasting card.
   - **Programmatic 3D Cold Brew Splash**: Zero-video interactive cold brew glass with draggable 3D tilt, vertical scroll-triggered ice cube tumble, and coffee splash eruption.
   - **Seamless Menu Carousel**: Continuous auto-scrolling with hover-pause and manual arrow controls.
   - **Smart Navigation Bar**: Hides on scroll down, reveals on scroll up (`useMotionValueEvent`), with backdrop blur and active section tracking.
   - **Circular Scroll-To-Top Button**: Circular SVG progress ring tracking scroll completion.

3. **Interactive Modals**
   - **Order Modal**: Express pickup ordering bag with live cart increments and total tally.
   - **Gallery Modal**: Masonry visual journal with `<ClipReveal>` image wipe reveals.
   - **Video Modal**: Cinematic behind-the-roast film reel player.
   - **Story Modal**: Historic milestone timeline from 2018 micro-roastery to present.
   - **Location Modal**: Interactive reservation form with café address, operating hours, phone, and email.

---

## 📁 Project Structure

```
coffee/
├── public/
│   ├── favicon.svg
│   └── videos/
│       ├── coffeebeans.mp4            # Hero background video
│       └── gemini_generated_video.mp4 # Brand video modal reel
├── src/
│   ├── assets/
│   │   └── images/                    # WebP and JPEG photography
│   ├── components/
│   │   ├── animations/                # Reusable Framer Motion components
│   │   │   ├── ClipReveal.jsx         # Image wipe reveal
│   │   │   ├── Counter.jsx            # Animated viewport number ticker
│   │   │   ├── FloatingBeans.jsx      # Ambient floating coffee beans
│   │   │   ├── Reveal.jsx             # Fade-up on scroll
│   │   │   └── index.js               # Barrel exports
│   │   ├── BrandLogo.jsx              # Vector branding logo
│   │   ├── Footer.jsx / .css          # Footer links, social, and metadata
│   │   ├── Modals.jsx / .css          # Order, Gallery, Video, Story, Location modals
│   │   └── Navbar.jsx / .css          # Smart hide/reveal navigation
│   ├── data/
│   │   └── coffeeData.js              # Menu items, testimonials, gallery, café info
│   ├── sections/                      # Dedicated page section components
│   │   ├── AboutSection.jsx / .css
│   │   ├── CardFanOutSection.jsx / .css
│   │   ├── CtaBanner.jsx / .css
│   │   ├── FeaturesBar.jsx / .css
│   │   ├── HeroAboutStage.jsx / .css
│   │   ├── HeroSection.jsx / .css
│   │   ├── IcedSplashSection.jsx / .css
│   │   ├── LuxuryShowcaseSection.jsx / .css
│   │   ├── MenuSection.jsx / .css
│   │   └── TestimonialSection.jsx / .css
│   ├── styles/
│   │   ├── animations.css             # Keyframe animations (steam, glow, dots)
│   │   ├── global.css                 # Base resets, typography, container, buttons
│   │   └── tokens.css                 # CSS variables for colors, radii, shadows
│   ├── App.jsx                        # Root application orchestrator
│   └── main.jsx                       # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
Open `http://localhost:5173` (or the port specified by Vite) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

### Vercel Deployment
The project uses standard Vite scripts and static output in `dist/`. It deploys out-of-the-box on Vercel with zero extra configuration.
