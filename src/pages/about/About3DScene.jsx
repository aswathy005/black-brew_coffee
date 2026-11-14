import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createCoffeeBeanGeometry,
  createRoastedBeanMaterial,
  createRawBeanMaterial,
  createCoffeeCupGroup,
  createSteamSystem,
  createGrinderGroup,
  createPortafilterGroup,
  createEspressoStream,
  createGroundsParticles,
  createAmbientDustMotes,
  createPendantLampGroup,
} from './ProceduralCoffeeModels';

/**
 * About3DScene: Scroll-driven 3D WebGL Canvas for the BLACK & BREW About Us page.
 * Synchronizes camera movement, 3D object transformations, bean roasting,
 * grinding, and espresso extraction with the page's scroll progress (0.0 to 1.0).
 * Calibrated so all 3D actions in Chapters 1-6 are 100% visible and in-frustum.
 */
export function About3DScene({ scrollProgress = 0, currentStage = 0 }) {
  const canvasRef = useRef(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, and Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.04);

    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.1, 4.4);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Cinematic Lighting for Black & Yellow Luxury Theme
    const ambientLight = new THREE.AmbientLight(0xfff3db, 0.95);
    scene.add(ambientLight);

    // Warm golden key spotlight
    const keySpot = new THREE.SpotLight(0xffc928, 4.8);
    keySpot.position.set(3.5, 5.5, 4.2);
    keySpot.angle = Math.PI / 3.8;
    keySpot.penumbra = 0.55;
    keySpot.decay = 1.5;
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    scene.add(keySpot);

    // Cool rim light for edge definition
    const rimLight = new THREE.DirectionalLight(0x7598c0, 2.0);
    rimLight.position.set(-4.5, 3.5, -3.0);
    scene.add(rimLight);

    // Soft warm fill light from front-below
    const fillLight = new THREE.PointLight(0xffa834, 1.6, 14);
    fillLight.position.set(0, -1.0, 3.2);
    scene.add(fillLight);

    // 3. Signature Brand Yellow & Gold Coffee Cup
    const cupObject = createCoffeeCupGroup();
    cupObject.group.position.set(0, -0.45, 0);
    scene.add(cupObject.group);

    // 4. Steam Particles rising from the cup
    const steam = createSteamSystem(75);
    steam.points.position.set(0, -0.45, 0);
    scene.add(steam.points);

    // 5. Floating & Roasting Coffee Beans
    const beanGeom = createCoffeeBeanGeometry(0.38);
    const roastedMat = createRoastedBeanMaterial(0x22130a);
    const rawMat = createRawBeanMaterial();

    const BEAN_COUNT = 32;
    const beans = [];
    const beanGroup = new THREE.Group();
    beanGroup.name = 'FloatingBeansGroup';

    for (let i = 0; i < BEAN_COUNT; i++) {
      const mat = i % 2 === 0 ? roastedMat.clone() : rawMat.clone();
      const mesh = new THREE.Mesh(beanGeom, mat);
      mesh.castShadow = true;

      // Base home positions orbiting around the cup
      const angle = (i / BEAN_COUNT) * Math.PI * 2;
      const radius = 1.7 + Math.random() * 1.5;
      const baseY = -0.3 + (Math.random() - 0.5) * 1.6;
      const basePos = new THREE.Vector3(
        Math.cos(angle) * radius,
        baseY,
        Math.sin(angle) * radius
      );

      // Calibrated scattered positions for Chapter 2 (all within camera view)
      const scatterPos = new THREE.Vector3(
        (Math.random() - 0.5) * 6.5,
        (Math.random() - 0.5) * 3.8 + 0.3,
        (Math.random() - 0.5) * 3.0 + 0.5
      );

      mesh.position.copy(basePos);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      const rotSpeed = {
        x: (Math.random() - 0.5) * 0.016,
        y: (Math.random() - 0.5) * 0.022,
        z: (Math.random() - 0.5) * 0.016,
      };

      beans.push({
        mesh,
        basePos,
        scatterPos,
        rotSpeed,
        phase: Math.random() * Math.PI * 2,
        isRawOrigin: i % 2 !== 0,
      });

      beanGroup.add(mesh);
    }
    scene.add(beanGroup);

    // 6. Coffee Grinder Model (Chapter 3: Art of Coffee)
    const grinderObject = createGrinderGroup();
    grinderObject.group.position.set(-0.75, 1.35, 0);
    grinderObject.group.scale.set(0.78, 0.78, 0.78);
    grinderObject.group.visible = false;
    scene.add(grinderObject.group);

    // 7. Portafilter Model (Chapter 3)
    const portafilterObject = createPortafilterGroup();
    portafilterObject.group.position.set(-0.75, 0.45, 0);
    portafilterObject.group.scale.set(0.72, 0.72, 0.72);
    portafilterObject.group.visible = false;
    scene.add(portafilterObject.group);

    // 8. Ground Coffee shower particles (from grinder to portafilter)
    const grounds = createGroundsParticles(85);
    grounds.points.position.set(-0.75, 0.55, 0.25);
    grounds.points.visible = false;
    scene.add(grounds.points);

    // 9. Golden Espresso Stream (pours from portafilter into cup)
    const espressoStream = createEspressoStream();
    espressoStream.streamMesh.position.set(-0.75, 0.0, 0);
    espressoStream.streamMesh.visible = false;
    scene.add(espressoStream.streamMesh);

    // 10. Ambient Cafe Floating Dust Motes (Chapter 5: Experience)
    const dustMotes = createAmbientDustMotes(125);
    scene.add(dustMotes.points);

    // 11. Warm Pendant Lamp (Chapter 5) - lowered so it hangs right above cup
    const lamp = createPendantLampGroup();
    lamp.position.set(0.75, 1.35, 0);
    lamp.visible = false;
    scene.add(lamp);

    // 12. Polished Oak Bar Counter Surface (under cup)
    const tableGeom = new THREE.CylinderGeometry(4.5, 4.5, 0.25, 48);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x0f0a06, // dark espresso-stained oak
      roughness: 0.38,
      metalness: 0.2,
    });
    const table = new THREE.Mesh(tableGeom, tableMat);
    table.position.set(0, -0.65, 0);
    table.receiveShadow = true;
    scene.add(table);

    // Tracking / Smooth Interpolation State
    const camTarget = new THREE.Vector3(0, 0.3, 0);
    let targetCamPos = new THREE.Vector3(0, 1.1, 4.4);
    let targetCupPos = new THREE.Vector3(0, -0.45, 0);
    let targetCupRotY = 0;
    let targetCupRotX = 0;
    let targetCupScale = 1.0;

    // Handle Window Resizing
    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', handleResize);

    // Animation & Scroll Physics Loop
    let animId;
    let clock = new THREE.Clock();

    function renderLoop() {
      animId = requestAnimationFrame(renderLoop);
      const elapsedTime = clock.getElapsedTime();
      const p = Math.max(0, Math.min(1, scrollRef.current)); // 0.0 to 1.0

      // -------------------------------------------------------------
      // SCROLL-DRIVEN STATE INTERPOLATION ACROSS 6 CHAPTERS
      // -------------------------------------------------------------

      if (p < 0.18) {
        // CHAPTER 1: CINEMATIC HERO (0.00 - 0.18)
        // Camera centered, Yellow & Gold Cup rotating gently with scroll, steam rising
        const sub = p / 0.18;
        targetCamPos.set(0, 1.1 + sub * 0.15, 4.4 - sub * 0.3);
        camTarget.set(0, 0.3, 0);
        targetCupPos.set(0, -0.45, 0);
        targetCupRotY = sub * Math.PI * 0.9;
        targetCupRotX = 0;
        targetCupScale = 1.0;

        cupObject.group.visible = true;
        grinderObject.group.visible = false;
        portafilterObject.group.visible = false;
        espressoStream.streamMesh.visible = false;
        grounds.points.visible = false;
        lamp.visible = false;
        steam.points.visible = true;
        steam.points.position.set(0, -0.45, 0);

        // Beans in orbiting positions
        beans.forEach((b) => {
          b.mesh.position.lerp(b.basePos, 0.08);
          if (b.isRawOrigin) {
            b.mesh.material.color.setHex(0x22130a);
          }
        });
      } else if (p < 0.36) {
        // CHAPTER 2: OUR STORY – HOW IT BEGAN (0.18 - 0.36)
        // Scattered beans start wide & green in full view, converge and roast to dark chocolate
        const sub = (p - 0.18) / 0.18; // 0 to 1

        targetCamPos.set(
          Math.sin(sub * 1.1) * 1.2,
          1.4 + sub * 0.4,
          4.5 - sub * 0.3
        );
        camTarget.set(0, 0.2, 0);
        targetCupPos.set(0, -0.45, 0);
        targetCupRotY = Math.PI * 0.9 + sub * Math.PI * 0.7;
        targetCupRotX = 0;
        targetCupScale = 0.4 + sub * 0.6; // cup reveals as beans converge

        cupObject.group.visible = true;
        grinderObject.group.visible = false;
        portafilterObject.group.visible = false;
        espressoStream.streamMesh.visible = false;
        grounds.points.visible = false;
        lamp.visible = false;
        steam.points.visible = sub > 0.4;
        steam.points.position.set(0, -0.45, 0);

        // Bean convergence & color roasting transformation
        beans.forEach((b) => {
          const currentPos = new THREE.Vector3().lerpVectors(
            b.scatterPos,
            b.basePos,
            Math.min(1, sub * 1.1)
          );
          b.mesh.position.lerp(currentPos, 0.1);

          // Roasting color transition: green (0x629c42) -> golden amber (0xd47c22) -> dark roast (0x24140b)
          if (b.isRawOrigin) {
            if (sub < 0.5) {
              const t = sub * 2.0;
              b.mesh.material.color.lerpColors(
                new THREE.Color(0x629c42),
                new THREE.Color(0xd47c22),
                t
              );
            } else {
              const t = (sub - 0.5) * 2.0;
              b.mesh.material.color.lerpColors(
                new THREE.Color(0xd47c22),
                new THREE.Color(0x24140b),
                t
              );
            }
          }
        });
      } else if (p < 0.54) {
        // CHAPTER 3: OUR PASSION – THE ART OF COFFEE (0.36 - 0.54)
        // Grinder, Portafilter, Espresso Stream & Cup fully visible on the left side
        const sub = (p - 0.36) / 0.18; // 0 to 1

        targetCamPos.set(0.2, 0.95, 4.0);
        camTarget.set(-0.6, 0.25, 0);

        const craftX = -0.75;
        targetCupPos.set(craftX, -0.45, 0);
        targetCupRotY = sub * Math.PI * 1.8;
        targetCupRotX = 0;
        targetCupScale = 0.95;

        cupObject.group.visible = true;
        grinderObject.group.visible = true;
        portafilterObject.group.visible = true;
        lamp.visible = false;

        // Position 3D Grinder in upper-left
        grinderObject.group.position.set(craftX, 1.35, 0);
        grinderObject.burrMesh.rotation.y = elapsedTime * 14.0; // spinning burrs

        // Ground shower active when grinder is running
        grounds.points.visible = sub > 0.12 && sub < 0.7;
        grounds.points.position.set(craftX, 0.55, 0.25);
        if (grounds.points.visible) {
          grounds.update();
        }

        // Portafilter locks into place below grinder chute
        portafilterObject.group.position.set(craftX, 0.45, 0);
        portafilterObject.group.rotation.y = Math.PI / 4 + sub * (Math.PI / 3);

        // Espresso stream pours from portafilter into cup
        if (sub > 0.4 && sub < 0.96) {
          espressoStream.streamMesh.visible = true;
          espressoStream.streamMesh.position.set(craftX, 0.0, 0);
          cupObject.cremaMesh.scale.set(
            0.65 + (sub - 0.4) * 0.7,
            1,
            0.65 + (sub - 0.4) * 0.7
          );
        } else {
          espressoStream.streamMesh.visible = false;
        }

        steam.points.visible = true;
        steam.points.position.set(craftX, -0.45, 0);

        // Beans funnel into grinder hopper
        beans.forEach((b, idx) => {
          if (idx < 14) {
            const funnelPos = new THREE.Vector3(
              craftX + Math.sin(elapsedTime * 2 + idx) * 0.22,
              1.65 - ((idx * 0.1 + elapsedTime * 0.6) % 1.1),
              Math.cos(elapsedTime * 2 + idx) * 0.22
            );
            b.mesh.position.lerp(funnelPos, 0.1);
          } else {
            b.mesh.position.lerp(b.basePos, 0.06);
          }
        });
      } else if (p < 0.72) {
        // CHAPTER 4: OUR QUALITY – FROM BEAN TO CUP (0.54 - 0.72)
        // Camera orbits cup; cup tilts forward to highlight the crema & latte art
        const sub = (p - 0.54) / 0.18; // 0 to 1

        targetCamPos.set(
          -0.6 + sub * 1.2,
          1.1 + Math.sin(sub * Math.PI) * 0.3,
          3.8 - Math.cos(sub * Math.PI) * 0.3
        );
        camTarget.set(0, 0.1, 0);
        targetCupPos.set(0, -0.25, 0);
        targetCupRotY = sub * Math.PI * 2.4;
        targetCupRotX = 0.28; // tilt cup forward so crema is prominent
        targetCupScale = 1.05;

        grinderObject.group.visible = false;
        portafilterObject.group.visible = false;
        espressoStream.streamMesh.visible = false;
        grounds.points.visible = false;
        lamp.visible = false;

        cupObject.group.visible = true;
        cupObject.cremaMesh.scale.set(1, 1, 1);
        steam.points.visible = true;
        steam.points.position.set(0, -0.25, 0);

        beans.forEach((b) => {
          b.mesh.position.lerp(b.basePos, 0.08);
          b.mesh.material.color.setHex(0x22130a);
        });
      } else if (p < 0.88) {
        // CHAPTER 5: OUR EXPERIENCE – THE SANCTUARY (0.72 - 0.88)
        // Warm cafe ambience, pendant lamp suspended directly over the cup on the right side
        const sub = (p - 0.72) / 0.16; // 0 to 1

        targetCamPos.set(-0.25, 0.85, 4.0);
        camTarget.set(0.65, 0.2, 0);

        const cafeX = 0.75;
        targetCupPos.set(cafeX, -0.45, 0);
        targetCupRotY = Math.PI * 2.4 + sub * Math.PI * 0.6;
        targetCupRotX = 0;
        targetCupScale = 1.0;

        grinderObject.group.visible = false;
        portafilterObject.group.visible = false;
        espressoStream.streamMesh.visible = false;
        grounds.points.visible = false;
        lamp.visible = true;

        // Lamp hangs directly above the cup on the right side
        lamp.position.set(cafeX, 1.35, 0);

        // Golden dust motes and warm lighting
        dustMotes.material.opacity = 0.75;
        keySpot.intensity = 5.4;

        steam.points.visible = true;
        steam.points.position.set(cafeX, -0.45, 0);

        beans.forEach((b) => {
          b.mesh.position.lerp(b.basePos, 0.08);
        });
      } else {
        // CHAPTER 6: OUR PROMISE – EVERY CUP MATTERS (0.88 - 1.00)
        // Grand finale: Brand Yellow & Gold Cup centered in spotlight with halo ring of orbiting beans
        const sub = (p - 0.88) / 0.12; // 0 to 1

        targetCamPos.set(0, 0.8, 3.5);
        camTarget.set(0, 0.2, 0);
        targetCupPos.set(0, -0.2, 0);
        targetCupRotY = Math.PI * 3.0 + sub * Math.PI * 0.5;
        targetCupRotX = 0.15;
        targetCupScale = 1.1;

        grinderObject.group.visible = false;
        portafilterObject.group.visible = false;
        espressoStream.streamMesh.visible = false;
        grounds.points.visible = false;
        lamp.visible = false;

        keySpot.intensity = 5.6;
        keySpot.position.set(0, 5.5, 3.2);

        steam.points.visible = true;
        steam.points.position.set(0, -0.2, 0);

        // Beans orbit in an elegant halo ring around the yellow cup
        beans.forEach((b, idx) => {
          const haloAngle = (idx / BEAN_COUNT) * Math.PI * 2 + elapsedTime * 0.4;
          const haloPos = new THREE.Vector3(
            Math.cos(haloAngle) * 2.05,
            -0.05 + Math.sin(haloAngle * 2) * 0.22,
            Math.sin(haloAngle) * 2.05
          );
          b.mesh.position.lerp(haloPos, 0.09);
        });
      }

      // Smooth camera and cup physics
      camera.position.lerp(targetCamPos, 0.08);
      camera.lookAt(camTarget);

      cupObject.group.position.lerp(targetCupPos, 0.085);
      cupObject.group.scale.setScalar(
        THREE.MathUtils.lerp(cupObject.group.scale.x, targetCupScale, 0.085)
      );

      cupObject.group.rotation.y = THREE.MathUtils.lerp(
        cupObject.group.rotation.y,
        targetCupRotY + (!prefersReducedMotion ? Math.sin(elapsedTime * 0.8) * 0.05 : 0),
        0.085
      );
      cupObject.group.rotation.x = THREE.MathUtils.lerp(
        cupObject.group.rotation.x,
        targetCupRotX,
        0.085
      );

      // Continuous subtle ambient animations
      if (!prefersReducedMotion) {
        steam.update(elapsedTime);

        beans.forEach((b) => {
          b.mesh.rotation.x += b.rotSpeed.x;
          b.mesh.rotation.y += b.rotSpeed.y;
          b.mesh.rotation.z += b.rotSpeed.z;
        });

        dustMotes.update(elapsedTime);
      }

      renderer.render(scene, camera);
    }

    renderLoop();

    // Cleanup & Resource Disposal
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div className="about-3d-canvas-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="about-3d-canvas" />
      <div className="about-3d-vignette" />
    </div>
  );
}
export default About3DScene;

