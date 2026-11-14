import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ArrowRight } from 'lucide-react';

import flyingBeansImg from '../../assets/images/flying-beans.jpg';
import coffeeGrindImg from '../../assets/images/coffee-grind.jpg';
import espressoExtractionImg from '../../assets/images/espresso-extraction.jpg';
import finalCupImg from '../../assets/images/final-cup.png';

import './CoffeeStory3D.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 4 Cinematic Storytelling Scenes
const SCENES = [
  {
    titlePrefix: 'The Origin:',
    titleGold: 'Highland Arabica.',
    tagline:
      'Highland Arabica beans selected at peak maturity, roasted to reveal rich chocolate and hazelnut notes.',
  },
  {
    titlePrefix: 'The Grind:',
    titleGold: 'Precision Burr.',
    tagline:
      'Precision burrs fracture whole beans into velvety grounds, unlocking essential aromatic oils.',
  },
  {
    titlePrefix: 'The Extraction:',
    titleGold: '9-Bar Golden Crema.',
    tagline:
      'High-pressure 9-bar infusion extracts a rich, viscous stream of espresso crowned with golden crema.',
  },
  {
    titlePrefix: 'The Reveal:',
    titleGold: 'Black & Brew Signature.',
    tagline:
      'Crafted to perfection - velvety crema, rising steam, and an unforgettable coffee experience.',
  },
];

/**
 * Common Vertex Shader for Image Planes
 */
const planeVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Scene 1 Fragment Shader (Whole Coffee Beans):
 * Soft feathered edge vignette + seamless obsidian (#080808) blending
 */
const scene1FragmentShader = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 tex = texture2D(uTexture, uv);

    // Soft feathered edge vignette to eliminate all visible rectangular borders
    float edgeX = smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);
    float edgeY = smoothstep(0.0, 0.12, uv.y) * smoothstep(1.0, 0.88, uv.y);
    float vignette = edgeX * edgeY * smoothstep(0.56, 0.28, length(uv - 0.5));

    // Blend seamlessly into obsidian #080808
    vec3 obsidian = vec3(0.0314, 0.0314, 0.0314);
    vec3 col = mix(obsidian, tex.rgb, vignette);

    gl_FragColor = vec4(col, vignette * uOpacity);
  }
`;

/**
 * Scene 2 Fragment Shader (Artisanal Grinding):
 * Dark brown background suppression to match #080808 + soft vignette
 */
const scene2FragmentShader = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 tex = texture2D(uTexture, uv);

    // Color grade: crush dark brown background tones to #080808
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    if (lum < 0.14) {
      tex.rgb = mix(vec3(0.0314, 0.0314, 0.0314), tex.rgb, lum / 0.14);
    }

    // Soft feathered edge vignette
    float edgeX = smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);
    float edgeY = smoothstep(0.0, 0.12, uv.y) * smoothstep(1.0, 0.88, uv.y);
    float vignette = edgeX * edgeY * smoothstep(0.56, 0.28, length(uv - 0.5));

    vec3 obsidian = vec3(0.0314, 0.0314, 0.0314);
    vec3 col = mix(obsidian, tex.rgb, vignette);

    gl_FragColor = vec4(col, vignette * uOpacity);
  }
`;

/**
 * Scene 3 Fragment Shader (Espresso Extraction):
 * Soft feathered edge vignette + warm obsidian blending
 */
const scene3FragmentShader = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 tex = texture2D(uTexture, uv);

    // Soft feathered edge vignette
    float edgeX = smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);
    float edgeY = smoothstep(0.0, 0.12, uv.y) * smoothstep(1.0, 0.88, uv.y);
    float vignette = edgeX * edgeY * smoothstep(0.56, 0.28, length(uv - 0.5));

    vec3 obsidian = vec3(0.0314, 0.0314, 0.0314);
    vec3 col = mix(obsidian, tex.rgb, vignette);

    gl_FragColor = vec4(col, vignette * uOpacity);
  }
`;

/**
 * Scene 4 Fragment Shader (Final Coffee Reveal):
 * Right-side brown gradient suppression into #080808 + feathered edges
 */
const scene4FragmentShader = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 tex = texture2D(uTexture, uv);

    // Suppress warm brown gradient on the right (uv.x > 0.58) so it melts into #080808
    if (uv.x > 0.58) {
      float brownSuppress = smoothstep(0.58, 0.95, uv.x);
      tex.rgb = mix(tex.rgb, vec3(0.0314, 0.0314, 0.0314), brownSuppress * 0.75);
    }

    // Soft feathered edge vignette
    float edgeX = smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);
    float edgeY = smoothstep(0.0, 0.12, uv.y) * smoothstep(1.0, 0.88, uv.y);
    float vignette = edgeX * edgeY * smoothstep(0.56, 0.29, length(uv - 0.5));

    vec3 obsidian = vec3(0.0314, 0.0314, 0.0314);
    vec3 col = mix(obsidian, tex.rgb, vignette);

    gl_FragColor = vec4(col, vignette * uOpacity);
  }
`;

/**
 * CoffeeStory3D Component
 * Pure image animation: Fly-through camera tunnel, smooth transitions, scale push-in & parallax.
 * All particle systems, steam overlays, and decorative meshes removed.
 */
export function CoffeeStory3D({ onExploreReserve, scrollDistance = '+=600%' }) {
  const pinContainerRef = useRef(null);
  const canvasRef = useRef(null);

  const [activeScene, setActiveScene] = useState(0);
  const activeSceneRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Scroll Progress Lerping Refs
  const scrollTargetProgress = useRef(0);
  const scrollSmoothProgress = useRef(0);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseSmooth = useRef({ x: 0, y: 0 });

  // Detect Reduced Motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const handler = (e) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  // Three.js Scene Setup & Animation Loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const pinContainer = pinContainerRef.current;
    if (!canvas || !pinContainer) return;

    let width = pinContainer.clientWidth || window.innerWidth;
    let height = pinContainer.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // 1. Scene & Obsidian Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.046);

    // 2. Camera (Tunnel Fly-Through)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, -0.38, 4.0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x080808, 1);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // 4. Lights (Warm Tones Only)
    const ambientLight = new THREE.AmbientLight(0x382214, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    dirLight.position.set(4, 6, 8);
    scene.add(dirLight);

    // Group shifted down ~0.38 units so 3D content sits nicely below HUD text
    const sceneGroup = new THREE.Group();
    sceneGroup.position.y = -0.38;
    scene.add(sceneGroup);

    // 5. Texture Loading
    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const loadTexture = (url) =>
      new Promise((resolve) => {
        textureLoader.load(url, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.generateMipmaps = true;
          tex.anisotropy = maxAnisotropy;
          resolve(tex);
        });
      });

    let texturesLoaded = false;
    let cleanupDisposables = [];

    // Aspect calculation helper to ensure planes cover viewport
    const calculatePlaneSize = (imgAspect) => {
      const dist = 4.0;
      const vFov = (camera.fov * Math.PI) / 180;
      const vHeight = 2 * dist * Math.tan(vFov / 2);
      const vWidth = vHeight * (width / height);

      let pWidth, pHeight;
      if (vWidth / vHeight > imgAspect) {
        pWidth = vWidth * 1.06;
        pHeight = (vWidth / imgAspect) * 1.06;
      } else {
        pHeight = vHeight * 1.06;
        pWidth = vHeight * imgAspect * 1.06;
      }
      return { width: pWidth, height: pHeight };
    };

    // Meshes for the 4 Scene Image Planes
    let mesh1, mesh2, mesh3, mesh4;

    Promise.all([
      loadTexture(flyingBeansImg),
      loadTexture(coffeeGrindImg),
      loadTexture(espressoExtractionImg),
      loadTexture(finalCupImg),
    ]).then(([tex1, tex2, tex3, tex4]) => {
      texturesLoaded = true;
      setIsLoading(false);
      cleanupDisposables.push(tex1, tex2, tex3, tex4);

      // ======================================================================
      // SCENE 1: Whole Coffee Beans (Plane at Z = 0)
      // ======================================================================
      const size1 = calculatePlaneSize(956 / 720);
      const geom1 = new THREE.PlaneGeometry(size1.width, size1.height);
      const mat1 = new THREE.ShaderMaterial({
        vertexShader: planeVertexShader,
        fragmentShader: scene1FragmentShader,
        uniforms: {
          uTexture: { value: tex1 },
          uOpacity: { value: 1 },
        },
        transparent: true,
        depthWrite: false,
      });
      mesh1 = new THREE.Mesh(geom1, mat1);
      mesh1.position.set(0, 0, 0);
      sceneGroup.add(mesh1);
      cleanupDisposables.push(geom1, mat1);

      // ======================================================================
      // SCENE 2: Artisanal Grinding (Plane at Z = -6)
      // ======================================================================
      const size2 = calculatePlaneSize(512 / 512);
      const geom2 = new THREE.PlaneGeometry(size2.width, size2.height);
      const mat2 = new THREE.ShaderMaterial({
        vertexShader: planeVertexShader,
        fragmentShader: scene2FragmentShader,
        uniforms: {
          uTexture: { value: tex2 },
          uOpacity: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
      });
      mesh2 = new THREE.Mesh(geom2, mat2);
      mesh2.position.set(0, 0, -6);
      sceneGroup.add(mesh2);
      cleanupDisposables.push(geom2, mat2);

      // ======================================================================
      // SCENE 3: Espresso Extraction (Plane at Z = -12)
      // ======================================================================
      const size3 = calculatePlaneSize(1200 / 1200);
      const geom3 = new THREE.PlaneGeometry(size3.width, size3.height);
      const mat3 = new THREE.ShaderMaterial({
        vertexShader: planeVertexShader,
        fragmentShader: scene3FragmentShader,
        uniforms: {
          uTexture: { value: tex3 },
          uOpacity: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
      });
      mesh3 = new THREE.Mesh(geom3, mat3);
      mesh3.position.set(0, 0, -12);
      sceneGroup.add(mesh3);
      cleanupDisposables.push(geom3, mat3);

      // ======================================================================
      // SCENE 4: Final Coffee Reveal (Plane at Z = -18)
      // ======================================================================
      const size4 = calculatePlaneSize(1280 / 1280);
      const geom4 = new THREE.PlaneGeometry(size4.width, size4.height);
      const mat4 = new THREE.ShaderMaterial({
        vertexShader: planeVertexShader,
        fragmentShader: scene4FragmentShader,
        uniforms: {
          uTexture: { value: tex4 },
          uOpacity: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
      });
      mesh4 = new THREE.Mesh(geom4, mat4);
      mesh4.position.set(0, 0, -18);
      sceneGroup.add(mesh4);
      cleanupDisposables.push(geom4, mat4);

      // Refresh ScrollTrigger once textures are initialized
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    });

    // 6. GSAP ScrollTrigger Pinned Animation
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinContainer,
        start: 'top top',
        end: scrollDistance,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollTargetProgress.current = self.progress;
        },
      });
    }, pinContainer);

    // 7. Mouse Move Parallax Listener
    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseTarget.current.x = nx;
      mouseTarget.current.y = ny;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 8. Visibility / Viewport Observer to pause render loop when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(pinContainer);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 9. Resize Listener
    const handleResize = () => {
      if (!pinContainer || !canvas) return;
      width = pinContainer.clientWidth || window.innerWidth;
      height = pinContainer.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2));

      // Resize plane geometries to ensure complete cover
      if (mesh1 && mesh2 && mesh3 && mesh4) {
        const s1 = calculatePlaneSize(956 / 720);
        mesh1.geometry.dispose();
        mesh1.geometry = new THREE.PlaneGeometry(s1.width, s1.height);

        const s2 = calculatePlaneSize(512 / 512);
        mesh2.geometry.dispose();
        mesh2.geometry = new THREE.PlaneGeometry(s2.width, s2.height);

        const s3 = calculatePlaneSize(1200 / 1200);
        mesh3.geometry.dispose();
        mesh3.geometry = new THREE.PlaneGeometry(s3.width, s3.height);

        const s4 = calculatePlaneSize(1280 / 1280);
        mesh4.geometry.dispose();
        mesh4.geometry = new THREE.PlaneGeometry(s4.width, s4.height);
      }
    };
    window.addEventListener('resize', handleResize);

    // 10. Main Animation & Render Loop
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible || !texturesLoaded) return;

      // Lerp Scroll Progress (smooth transition)
      scrollSmoothProgress.current +=
        (scrollTargetProgress.current - scrollSmoothProgress.current) * 0.08;
      const p = Math.min(1.0, Math.max(0.0, scrollSmoothProgress.current));

      // Lerp Mouse Parallax
      mouseSmooth.current.x += (mouseTarget.current.x - mouseSmooth.current.x) * 0.05;
      mouseSmooth.current.y += (mouseTarget.current.y - mouseSmooth.current.y) * 0.05;

      // Camera Fly-Through Tunnel Interpolation
      // Scene 1: Z=0 | Scene 2: Z=-6 | Scene 3: Z=-12 | Scene 4: Z=-18
      let targetCamZ;
      if (p < 0.25) {
        const t = p / 0.25;
        targetCamZ = THREE.MathUtils.lerp(4.0, -2.0, t);
      } else if (p < 0.5) {
        const t = (p - 0.25) / 0.25;
        targetCamZ = THREE.MathUtils.lerp(-2.0, -8.0, t);
      } else if (p < 0.75) {
        const t = (p - 0.5) / 0.25;
        targetCamZ = THREE.MathUtils.lerp(-8.0, -14.0, t);
      } else {
        const t = (p - 0.75) / 0.25;
        targetCamZ = THREE.MathUtils.lerp(-14.0, -14.2, t);
      }

      camera.position.z = targetCamZ;
      camera.position.x = mouseSmooth.current.x * 0.32;
      camera.position.y = -0.38 - mouseSmooth.current.y * 0.22;
      camera.lookAt(0, -0.38, targetCamZ - 4.0);

      // Active Scene Calculation (0, 1, 2, 3)
      const curScene = Math.min(3, Math.floor(p * 4));
      if (curScene !== activeSceneRef.current) {
        activeSceneRef.current = curScene;
        setActiveScene(curScene);
      }

      // ----------------------------------------------------------------------
      // SCENE 1 UPDATE: Whole Beans Image Plane
      // ----------------------------------------------------------------------
      if (mesh1) {
        const op1 = p < 0.18 ? 1.0 : Math.max(0, 1.0 - (p - 0.18) / 0.09);
        mesh1.material.uniforms.uOpacity.value = op1;
        mesh1.scale.setScalar(1.0 + Math.min(1.0, p / 0.25) * 0.12);
        mesh1.rotation.y = mouseSmooth.current.x * 0.08;
        mesh1.rotation.x = -mouseSmooth.current.y * 0.06;
      }

      // ----------------------------------------------------------------------
      // SCENE 2 UPDATE: Artisanal Grinding Image Plane
      // ----------------------------------------------------------------------
      if (mesh2) {
        const localP = Math.min(1.0, Math.max(0.0, (p - 0.22) / 0.26));
        const op2 =
          THREE.MathUtils.smoothstep(p, 0.18, 0.26) *
          (1.0 - THREE.MathUtils.smoothstep(p, 0.46, 0.54));

        mesh2.material.uniforms.uOpacity.value = op2;
        mesh2.scale.setScalar(0.96 + localP * 0.12);
        mesh2.rotation.y = mouseSmooth.current.x * 0.07;
        mesh2.rotation.x = -mouseSmooth.current.y * 0.05;
      }

      // ----------------------------------------------------------------------
      // SCENE 3 UPDATE: Espresso Extraction Image Plane
      // ----------------------------------------------------------------------
      if (mesh3) {
        const localP = Math.min(1.0, Math.max(0.0, (p - 0.48) / 0.24));
        const op3 =
          THREE.MathUtils.smoothstep(p, 0.46, 0.54) *
          (1.0 - THREE.MathUtils.smoothstep(p, 0.7, 0.78));

        mesh3.material.uniforms.uOpacity.value = op3;
        mesh3.scale.setScalar(0.96 + localP * 0.12);
        mesh3.rotation.y =
          THREE.MathUtils.lerp(-0.06, 0.06, localP) + mouseSmooth.current.x * 0.06;
        mesh3.rotation.x = -mouseSmooth.current.y * 0.05;
      }

      // ----------------------------------------------------------------------
      // SCENE 4 UPDATE: Final Coffee Reveal Image Plane
      // ----------------------------------------------------------------------
      if (mesh4) {
        const localP = THREE.MathUtils.smoothstep(p, 0.72, 0.88);
        const op4 = THREE.MathUtils.smoothstep(p, 0.7, 0.8);

        mesh4.material.uniforms.uOpacity.value = op4;
        mesh4.scale.setScalar(THREE.MathUtils.lerp(0.94, 1.0, localP));
        mesh4.rotation.y = mouseSmooth.current.x * 0.05;
        mesh4.rotation.x = -mouseSmooth.current.y * 0.04;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 11. Cleanup and Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();

      ctx.revert();

      cleanupDisposables.forEach((item) => {
        if (item && typeof item.dispose === 'function') {
          item.dispose();
        }
      });

      if (renderer) {
        renderer.dispose();
      }
    };
  }, [prefersReducedMotion, scrollDistance]);

  const activeSceneData = SCENES[activeScene] || SCENES[0];

  // Prefers-Reduced-Motion Accessible Fallback
  if (prefersReducedMotion) {
    return (
      <div className="coffee-story-reduced">
        {SCENES.map((scene, idx) => {
          const imgs = [flyingBeansImg, coffeeGrindImg, espressoExtractionImg, finalCupImg];
          return (
            <div key={idx} className="coffee-story-reduced__scene">
              <h2 className="coffee-hud__title">
                {scene.titlePrefix}
                <span className="hud-gold-italic">{scene.titleGold}</span>
              </h2>
              <p className="coffee-hud__tagline">{scene.tagline}</p>
              <img
                src={imgs[idx]}
                alt={scene.titleGold}
                className="coffee-story-reduced__img"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="coffee-story">
      <div ref={pinContainerRef} className="coffee-story__pin">
        {/* Three.js Canvas */}
        <canvas ref={canvasRef} className="coffee-story__canvas" />

        {/* Ambient Top & Bottom Vignette Gradients */}
        <div className="coffee-story__gradient-top" aria-hidden="true" />
        <div className="coffee-story__gradient-bottom" aria-hidden="true" />

        {/* Brewing / Loading Screen */}
        {isLoading && (
          <div className="coffee-story__loader" aria-live="polite">
            <div className="coffee-story__spinner" />
            <span className="coffee-story__loader-text">Brewing Experience...</span>
          </div>
        )}

        {/* DOM HUD Overlay */}
        <div className="coffee-story__hud">
          {/* Top HUD: Clean Dynamic Title & Tagline */}
          <div className="coffee-hud__top">
            <div key={activeScene} className="coffee-hud__copy">
              <h2 className="coffee-hud__title">
                {activeSceneData.titlePrefix}
                <span className="hud-gold-italic">{activeSceneData.titleGold}</span>
              </h2>
              <p className="coffee-hud__tagline">{activeSceneData.tagline}</p>

              {/* Scene 4 Call to Action */}
              {activeScene === 3 && (
                <div className="coffee-hud__cta">
                  <button
                    type="button"
                    className="coffee-hud__cta-btn"
                    onClick={onExploreReserve}
                    aria-label="Explore Reserve Menu"
                  >
                    <span>Explore Reserve Menu</span>
                    <ArrowRight size={18} strokeWidth={2.4} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom HUD: Clean Scroll Hint */}
          <div className="coffee-hud__bottom coffee-hud__bottom--clean">
            <div className="coffee-hud__scroll-hint" aria-hidden="true">
              <span>Scroll to Transform</span>
              <ChevronDown size={15} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoffeeStory3D;
