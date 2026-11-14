import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ChevronDown, ArrowRight } from 'lucide-react';

// Direct imports of the user's original image assets
import flyingBeansImg from '../assets/images/flying-beans.jpg';
import coffeeGrindImg from '../assets/images/coffee-grind.jpg';
import espressoExtractionImg from '../assets/images/espresso-extraction.jpg';
import heroCupImg from '../assets/images/hero2.png';

import './CoffeeTransformation.css';

// Register GSAP ScrollTrigger once safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 4 Storytelling Chapters matching client narrative
const STAGES = [
  { id: 'beans', label: '1. Whole Beans' },
  { id: 'grind', label: '2. Coffee Grinding' },
  { id: 'espresso', label: '3. Espresso Flow' },
  { id: 'cup', label: '4. Final Coffee' },
];

const STAGE_CONTENT = [
  {
    badge: 'SCENE 1 · WHOLE COFFEE BEANS',
    title: 'The Origin:',
    titleGold: 'Highland Arabica.',
    tagline: 'Highland Arabica beans selected at peak maturity, roasted to reveal rich chocolate and hazelnut notes.',
  },
  {
    badge: 'SCENE 2 · ARTISANAL GRINDING',
    title: 'The Grind:',
    titleGold: 'Precision Burr.',
    tagline: 'Precision burrs fracture whole beans into velvety grounds, unlocking essential aromatic oils.',
  },
  {
    badge: 'SCENE 3 · ESPRESSO EXTRACTION',
    title: 'The Extraction:',
    titleGold: '9-Bar Golden Crema.',
    tagline: 'High-pressure 9-bar infusion extracts a rich, viscous stream of espresso crowned with golden crema.',
  },
  {
    badge: 'SCENE 4 · THE MASTERPIECE',
    title: 'The Reveal:',
    titleGold: 'Black & Brew Signature.',
    tagline: 'Crafted to perfection — velvety crema, rising steam, and an unforgettable coffee experience.',
  },
];

/**
 * Creates soft-edge radial vignette alpha masks so rectangular photographs
 * blend 100% seamlessly into the dark obsidian #080808 background without hard borders.
 */
function createVignetteAlphaMap(aspectRatio = 1.0, width = 512, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  if (aspectRatio > 1) {
    ctx.scale(1.0, 1.0 / aspectRatio);
  } else {
    ctx.scale(aspectRatio, 1.0);
  }

  const radius = Math.min(width, height) * 0.48;
  const grad = ctx.createRadialGradient(0, 0, radius * 0.52, 0, 0, radius);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.72, '#ffffff');
  grad.addColorStop(1, '#000000');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Procedural Steam Particle Texture with soft Gaussian falloff
 */
function createSteamPuffTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255, 246, 225, 0.85)');
  grad.addColorStop(0.35, 'rgba(245, 220, 180, 0.35)');
  grad.addColorStop(1, 'rgba(200, 180, 150, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Fine Dark Coffee Powder Particle Texture
 */
function createGrindParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(16, 16, 1, 16, 16, 15);
  grad.addColorStop(0, 'rgba(65, 32, 14, 0.95)');
  grad.addColorStop(0.5, 'rgba(38, 18, 8, 0.85)');
  grad.addColorStop(1, 'rgba(12, 5, 2, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * CoffeeTransformation Component
 * Presentation-ready 3D scroll-driven coffee transformation experience using ONLY original assets.
 */
export function CoffeeTransformation({
  scrollDistance = '+=320%',
  onStageChange,
  onExploreMenu,
}) {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const progressFillRef = useRef(null);

  const [activeStage, setActiveStage] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const pinEl = pinRef.current;
    const canvas = canvasRef.current;
    if (!container || !pinEl || !canvas) return;

    // -------------------------------------------------------------------------
    // 1. THREE.JS SCENE, CAMERA & RENDERER SETUP
    // -------------------------------------------------------------------------
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.035);

    let width = pinEl.clientWidth || window.innerWidth;
    let height = pinEl.clientHeight || window.innerHeight;

    let initialFov = 45;
    if (width < 600) {
      initialFov = 56;
    } else if (width < 840) {
      initialFov = 50;
    }

    const camera = new THREE.PerspectiveCamera(initialFov, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 4.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // -------------------------------------------------------------------------
    // 2. WARM STUDIO LIGHTING (NO HARSH BLUES OR COLD COLORS)
    // -------------------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.95);
    scene.add(ambientLight);

    const keySpot = new THREE.SpotLight(0xffca45, 4.8);
    keySpot.position.set(3.2, 4.2, 4.0);
    keySpot.angle = Math.PI / 3.4;
    keySpot.penumbra = 0.6;
    keySpot.decay = 1.3;
    scene.add(keySpot);

    const rimLight = new THREE.DirectionalLight(0xffaa44, 2.2);
    rimLight.position.set(-4.0, 2.5, -2.5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xff9436, 1.4, 12);
    fillLight.position.set(0, -1.2, 3.2);
    scene.add(fillLight);

    // -------------------------------------------------------------------------
    // 3. LOAD THE USER'S EXACT 4 ORIGINAL IMAGE ASSETS
    // -------------------------------------------------------------------------
    const textureLoader = new THREE.TextureLoader();
    const loadedTextures = [];

    const loadTex = (url) => {
      const tex = textureLoader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      loadedTextures.push(tex);
      return tex;
    };

    const flyingBeansTex = loadTex(flyingBeansImg);
    const coffeeGrindTex = loadTex(coffeeGrindImg);
    const espressoExtractionTex = loadTex(espressoExtractionImg);
    const heroCupTex = loadTex(heroCupImg);

    // Soft border vignette masks matching each image's native aspect ratio
    const alpha16x9 = createVignetteAlphaMap(16 / 9, 512, 512);
    const alpha1x1 = createVignetteAlphaMap(1.0, 512, 512);
    loadedTextures.push(alpha16x9, alpha1x1);

    // Master Transformation Group
    const masterGroup = new THREE.Group();
    masterGroup.name = 'MasterGroup';
    scene.add(masterGroup);

    // -------------------------------------------------------------------------
    // 4. SCENE 1 (p: 0.00 -> 0.25): WHOLE COFFEE BEANS
    // Using original flying-beans.jpg (1024x576, ratio 1.778)
    // -------------------------------------------------------------------------
    const scene1 = new THREE.Group();
    scene1.name = 'Scene1_WholeBeans';
    masterGroup.add(scene1);

    // Native 16:9 proportion (5.33 x 3.00) with soft feathered border
    const s1Geom = new THREE.PlaneGeometry(5.33, 3.00);
    const s1Mat = new THREE.MeshBasicMaterial({
      map: flyingBeansTex,
      alphaMap: alpha16x9,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });
    const s1Mesh = new THREE.Mesh(s1Geom, s1Mat);
    s1Mesh.position.set(0, 0, 0);
    scene1.add(s1Mesh);

    // -------------------------------------------------------------------------
    // 5. SCENE 2 (p: 0.25 -> 0.50): COFFEE GRINDING
    // Using original coffee-grind.jpg (1024x1024, ratio 1.000)
    // Controlled, realistic grounds cascade (NO random golden sparkles)
    // -------------------------------------------------------------------------
    const scene2 = new THREE.Group();
    scene2.name = 'Scene2_CoffeeGrinding';
    scene2.visible = false;
    masterGroup.add(scene2);

    // Native 1:1 proportion (3.30 x 3.30) with circular vignette feathering
    const s2Geom = new THREE.PlaneGeometry(3.30, 3.30);
    const s2Mat = new THREE.MeshBasicMaterial({
      map: coffeeGrindTex,
      alphaMap: alpha1x1,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
    });
    const s2Mesh = new THREE.Mesh(s2Geom, s2Mat);
    s2Mesh.position.set(0, 0, 0);
    scene2.add(s2Mesh);

    // Realistic, controlled coffee grounds cascade (420 fine dark particles)
    const GRIND_PARTICLE_COUNT = 420;
    const grindParticleGeom = new THREE.BufferGeometry();
    const grindParticlePos = new Float32Array(GRIND_PARTICLE_COUNT * 3);
    const grindParticleData = [];

    for (let i = 0; i < GRIND_PARTICLE_COUNT; i++) {
      const spreadX = (Math.random() - 0.5) * 0.24;
      const spreadZ = (Math.random() - 0.5) * 0.16 + 0.15;
      const startY = 0.75 - Math.random() * 1.5;

      grindParticlePos[i * 3] = spreadX;
      grindParticlePos[i * 3 + 1] = startY;
      grindParticlePos[i * 3 + 2] = spreadZ;

      grindParticleData.push({
        baseX: spreadX,
        speedY: 0.024 + Math.random() * 0.032,
        jitter: Math.random() * Math.PI * 2,
      });
    }

    grindParticleGeom.setAttribute('position', new THREE.BufferAttribute(grindParticlePos, 3));

    const grindParticleTex = createGrindParticleTexture();
    loadedTextures.push(grindParticleTex);

    const grindParticleMat = new THREE.PointsMaterial({
      map: grindParticleTex,
      size: 0.22,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      color: 0xffffff,
    });
    const grindParticleSystem = new THREE.Points(grindParticleGeom, grindParticleMat);
    scene2.add(grindParticleSystem);

    // -------------------------------------------------------------------------
    // 6. SCENE 3 (p: 0.50 -> 0.75): ESPRESSO EXTRACTION
    // Using original espresso-extraction.jpg (1024x1024, ratio 1.000)
    // -------------------------------------------------------------------------
    const scene3 = new THREE.Group();
    scene3.name = 'Scene3_EspressoExtraction';
    scene3.visible = false;
    masterGroup.add(scene3);

    // Native 1:1 proportion (3.30 x 3.30) with circular vignette feathering
    const s3Geom = new THREE.PlaneGeometry(3.30, 3.30);
    const s3Mat = new THREE.MeshBasicMaterial({
      map: espressoExtractionTex,
      alphaMap: alpha1x1,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
    });
    const s3Mesh = new THREE.Mesh(s3Geom, s3Mat);
    s3Mesh.position.set(0, 0, 0);
    scene3.add(s3Mesh);

    // -------------------------------------------------------------------------
    // 7. SCENE 4 (p: 0.75 -> 1.00): FINAL COFFEE REVEAL & STEAM
    // Using original transparent hero2.png (4000x1999, exact ratio 2.001)
    // -------------------------------------------------------------------------
    const scene4 = new THREE.Group();
    scene4.name = 'Scene4_FinalCoffee';
    scene4.visible = false;
    masterGroup.add(scene4);

    // Ambient Golden Backlight Halo Bloom
    const haloGeom = new THREE.PlaneGeometry(4.8, 4.8);
    const haloCanvas = document.createElement('canvas');
    haloCanvas.width = 256;
    haloCanvas.height = 256;
    const hCtx = haloCanvas.getContext('2d');
    const hGrad = hCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    hGrad.addColorStop(0, 'rgba(255, 201, 40, 0.38)');
    hGrad.addColorStop(0.4, 'rgba(210, 110, 20, 0.16)');
    hGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    hCtx.fillStyle = hGrad;
    hCtx.fillRect(0, 0, 256, 256);
    const haloTex = new THREE.CanvasTexture(haloCanvas);
    loadedTextures.push(haloTex);

    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const haloMesh = new THREE.Mesh(haloGeom, haloMat);
    haloMesh.position.set(0, -0.05, -0.2);
    scene4.add(haloMesh);

    // Native 2:1 proportion (5.20 x 2.60) transparent PNG cup
    const s4Geom = new THREE.PlaneGeometry(5.20, 2.60);
    const s4Mat = new THREE.MeshBasicMaterial({
      map: heroCupTex,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
    });
    const s4Mesh = new THREE.Mesh(s4Geom, s4Mat);
    s4Mesh.position.set(0, -0.05, 0.0);
    scene4.add(s4Mesh);

    // 60 Realistic Rising Steam Particles
    const STEAM_COUNT = 60;
    const steamGeom = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(STEAM_COUNT * 3);
    const steamData = [];

    for (let i = 0; i < STEAM_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.55;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r + 0.15;
      const y = -0.1 + Math.random() * 1.8;

      steamPositions[i * 3] = x;
      steamPositions[i * 3 + 1] = y;
      steamPositions[i * 3 + 2] = z;

      steamData.push({
        vy: 0.007 + Math.random() * 0.011,
        phase: Math.random() * Math.PI * 2,
        baseX: x,
        baseZ: z,
      });
    }

    steamGeom.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

    const steamTex = createSteamPuffTexture();
    loadedTextures.push(steamTex);

    const steamMat = new THREE.PointsMaterial({
      map: steamTex,
      size: 0.65,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xfff4e0,
    });
    const steamSystem = new THREE.Points(steamGeom, steamMat);
    scene4.add(steamSystem);

    // -------------------------------------------------------------------------
    // 8. RENDER LOOP WITH NATURAL SCENE TRANSITIONS & 3D ROTATION
    // -------------------------------------------------------------------------
    let animId;
    const clock = new THREE.Clock();
    const scrollState = { progress: 0 };

    const render = () => {
      const elapsed = clock.getElapsedTime();
      const p = scrollState.progress;

      // Master subtle 3D parallax rotation with scroll
      masterGroup.rotation.y = -0.15 + p * 0.38;

      // -----------------------------------------------------------------------
      // SCENE 1 (p: 0.00 -> 0.25): WHOLE COFFEE BEANS
      // -----------------------------------------------------------------------
      if (p < 0.26) {
        scene1.visible = true;
        const t1 = Math.min(1.0, Math.max(0.0, p / 0.24));

        // Subtle 3D floating and natural tilt
        const floatY = Math.sin(elapsed * 1.4) * 0.035;
        const floatX = Math.cos(elapsed * 1.0) * 0.025;
        scene1.position.set(floatX, floatY, 0);

        scene1.rotation.y = -0.12 + t1 * 0.32;
        scene1.rotation.x = Math.sin(t1 * Math.PI) * 0.06;

        // Smooth exit fade
        if (p < 0.18) {
          s1Mat.opacity = 1.0;
          s1Mesh.scale.setScalar(1.0 + t1 * 0.06);
        } else {
          const exitT = (p - 0.18) / 0.07;
          s1Mat.opacity = Math.max(0.0, 1.0 - exitT);
          s1Mesh.scale.setScalar(1.06 - exitT * 0.08);
        }
      } else {
        scene1.visible = false;
        s1Mat.opacity = 0.0;
      }

      // -----------------------------------------------------------------------
      // SCENE 2 (p: 0.25 -> 0.50): COFFEE GRINDING & PARTICLES
      // -----------------------------------------------------------------------
      if (p >= 0.22 && p < 0.52) {
        scene2.visible = true;
        const t2 = Math.min(1.0, Math.max(0.0, (p - 0.22) / 0.28));

        // Smooth 3D tilt and rotation
        scene2.rotation.y = -0.15 + t2 * 0.30;
        scene2.rotation.x = Math.sin(t2 * Math.PI) * 0.05;

        // Smooth entrance & exit curve
        let s2Opacity = 0.0;
        if (t2 < 0.25) {
          s2Opacity = t2 / 0.25;
        } else if (t2 < 0.75) {
          s2Opacity = 1.0;
        } else {
          s2Opacity = 1.0 - (t2 - 0.75) / 0.25;
        }

        s2Mat.opacity = s2Opacity * 0.98;
        s2Mesh.scale.setScalar(0.95 + Math.sin(t2 * Math.PI) * 0.05);

        // Controlled realistic coffee grounds cascade
        grindParticleMat.opacity = s2Opacity * 0.88;
        const gPos = grindParticleGeom.attributes.position;
        for (let i = 0; i < GRIND_PARTICLE_COUNT; i++) {
          let py = gPos.getY(i);
          const data = grindParticleData[i];
          py -= data.speedY;

          // Recycle falling particles smoothly
          if (py < -0.85) {
            py = 0.75 + Math.random() * 0.1;
          }
          gPos.setY(i, py);
        }
        gPos.needsUpdate = true;
      } else {
        scene2.visible = false;
        s2Mat.opacity = 0.0;
        grindParticleMat.opacity = 0.0;
      }

      // -----------------------------------------------------------------------
      // SCENE 3 (p: 0.50 -> 0.75): ESPRESSO EXTRACTION
      // -----------------------------------------------------------------------
      if (p >= 0.47 && p < 0.77) {
        scene3.visible = true;
        const t3 = Math.min(1.0, Math.max(0.0, (p - 0.47) / 0.28));

        // Smooth 3D rotation
        scene3.rotation.y = -0.14 + t3 * 0.28;
        scene3.rotation.x = Math.sin(t3 * Math.PI) * 0.05;

        let s3Opacity = 0.0;
        if (t3 < 0.25) {
          s3Opacity = t3 / 0.25;
        } else if (t3 < 0.75) {
          s3Opacity = 1.0;
        } else {
          s3Opacity = 1.0 - (t3 - 0.75) / 0.25;
        }

        s3Mat.opacity = s3Opacity * 0.98;
        s3Mesh.scale.setScalar(0.95 + Math.sin(t3 * Math.PI) * 0.05);
      } else {
        scene3.visible = false;
        s3Mat.opacity = 0.0;
      }

      // -----------------------------------------------------------------------
      // SCENE 4 (p: 0.75 -> 1.00): FINAL COFFEE REVEAL & STEAM
      // -----------------------------------------------------------------------
      if (p >= 0.72) {
        scene4.visible = true;
        const t4 = Math.min(1.0, Math.max(0.0, (p - 0.72) / 0.16));
        const easeCup = Math.sin(t4 * Math.PI * 0.5);

        // Smooth 3D centering and lock
        scene4.rotation.y = -0.16 * (1.0 - easeCup);
        scene4.rotation.x = 0.04 * (1.0 - easeCup);

        s4Mat.opacity = easeCup;
        s4Mesh.scale.setScalar(0.92 + easeCup * 0.08);

        haloMat.opacity = easeCup * 0.45;
        haloMesh.scale.setScalar(0.94 + Math.sin(elapsed * 1.5) * 0.04);

        // Steam wisps rising naturally
        steamMat.opacity = Math.min(1.0, Math.max(0.0, (p - 0.76) / 0.14)) * 0.45;
        const sPos = steamGeom.attributes.position;
        for (let j = 0; j < STEAM_COUNT; j++) {
          let sy = sPos.getY(j);
          let sx = sPos.getX(j);
          let sz = sPos.getZ(j);
          const d = steamData[j];

          sy += d.vy;
          sx = d.baseX + Math.sin(elapsed * 1.8 + d.phase) * 0.04;
          sz = d.baseZ + Math.cos(elapsed * 1.4 + d.phase) * 0.03;

          if (sy > 1.8) {
            sy = -0.1;
            const a = Math.random() * Math.PI * 2;
            const r = Math.random() * 0.45;
            d.baseX = Math.cos(a) * r;
            d.baseZ = Math.sin(a) * r + 0.15;
          }

          sPos.setXYZ(j, sx, sy, sz);
        }
        sPos.needsUpdate = true;
      } else {
        scene4.visible = false;
        s4Mat.opacity = 0.0;
        haloMat.opacity = 0.0;
        steamMat.opacity = 0.0;
      }

      // Camera dolly on scroll
      camera.position.y = 0.2 - p * 0.25;
      camera.position.z = 4.8 - p * 0.2;
      camera.lookAt(0, -p * 0.12, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };
    render();

    // -------------------------------------------------------------------------
    // 9. GSAP SCROLLTRIGGER PIN CONTROLLER (SCRUB: 1)
    // -------------------------------------------------------------------------
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      ScrollTrigger.create({
        trigger: container,
        pin: pinEl,
        start: 'top top',
        end: scrollDistance,
        scrub: 1.0,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          scrollState.progress = p;

          let currentStageIdx = 0;
          if (p >= 0.75) {
            currentStageIdx = 3;
          } else if (p >= 0.50) {
            currentStageIdx = 2;
          } else if (p >= 0.25) {
            currentStageIdx = 1;
          } else {
            currentStageIdx = 0;
          }

          setActiveStage(currentStageIdx);
          setProgressPercent(Math.round(p * 100));

          if (progressFillRef.current) {
            progressFillRef.current.style.width = `${Math.round(p * 100)}%`;
          }

          if (onStageChange) {
            onStageChange(currentStageIdx, p);
          }
        },
      });
    }, container);

    // -------------------------------------------------------------------------
    // 10. RESPONSIVE RESIZE OBSERVER
    // -------------------------------------------------------------------------
    const handleResize = () => {
      if (!pinEl || !renderer || !camera) return;
      const w = pinEl.clientWidth;
      const h = pinEl.clientHeight;
      camera.aspect = w / h;

      if (w < 600) {
        camera.fov = 56;
      } else if (w < 840) {
        camera.fov = 50;
      } else {
        camera.fov = 45;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      const pr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pr);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(pinEl);

    // -------------------------------------------------------------------------
    // 11. CLEANUP ON UNMOUNT (ZERO MEMORY LEAKS)
    // -------------------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      ctx.revert();

      s1Geom.dispose();
      s1Mat.dispose();

      s2Geom.dispose();
      s2Mat.dispose();
      grindParticleGeom.dispose();
      grindParticleMat.dispose();

      s3Geom.dispose();
      s3Mat.dispose();

      haloGeom.dispose();
      haloMat.dispose();
      s4Geom.dispose();
      s4Mat.dispose();
      steamGeom.dispose();
      steamMat.dispose();

      loadedTextures.forEach((t) => t.dispose());

      renderer.dispose();
    };
  }, [scrollDistance, onStageChange]);

  const currentContent = STAGE_CONTENT[activeStage] || STAGE_CONTENT[0];

  return (
    <section ref={containerRef} className="coffee-transformation">
      <div ref={pinRef} className="coffee-transformation__pin">
        {/* Ambient Dark Obsidian & Warm Golden Glow Flares */}
        <div className="coffee-transformation__ambient" aria-hidden="true">
          <div className="coffee-transformation__flare coffee-transformation__flare--gold" />
          <div className="coffee-transformation__flare coffee-transformation__flare--espresso" />
        </div>

        {/* Responsive Three.js WebGL Canvas */}
        <canvas ref={canvasRef} className="coffee-transformation__canvas" />

        {/* Top Storytelling HUD */}
        <header className="coffee-transformation__hud">
          <div className="coffee-transformation__badge">
            <Sparkles size={13} />
            <span>{currentContent.badge}</span>
          </div>

          <h2 className="coffee-transformation__title">
            {currentContent.title}{' '}
            <span className="coffee-transformation__title--gold">
              {currentContent.titleGold}
            </span>
          </h2>

          <p className="coffee-transformation__tagline">
            {currentContent.tagline}
          </p>

          {/* 4-Scene Sequential Stepper */}
          <nav className="coffee-transformation__stages" aria-label="Transformation Stages">
            {STAGES.map((stage, idx) => (
              <React.Fragment key={stage.id}>
                <div
                  className={`coffee-transformation__stage-item ${
                    activeStage === idx ? 'coffee-transformation__stage-item--active' : ''
                  }`}
                >
                  <span className="coffee-transformation__stage-dot" />
                  <span>{stage.label}</span>
                </div>
                {idx < STAGES.length - 1 && (
                  <span className="coffee-transformation__stage-divider" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </nav>
        </header>

        {/* Scene 4 Interactive Call To Action */}
        {activeStage === 3 && (
          <div className="coffee-transformation__cta-box">
            <button
              type="button"
              className="coffee-transformation__btn-explore"
              onClick={onExploreMenu}
            >
              <span>Explore Reserve Menu</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Bottom Progress Cue */}
        <footer className="coffee-transformation__bottom-bar">
          <div className="coffee-transformation__progress-wrap">
            <span className="coffee-transformation__progress-label">
              SCENE {activeStage + 1} OF 4 · {progressPercent}%
            </span>
            <div className="coffee-transformation__progress-bar">
              <div ref={progressFillRef} className="coffee-transformation__progress-fill" />
            </div>
          </div>

          <div className="coffee-transformation__scroll-hint" aria-hidden="true">
            <span>Scroll to Transform</span>
            <ChevronDown size={14} />
          </div>
        </footer>
      </div>
    </section>
  );
}

export default CoffeeTransformation;
