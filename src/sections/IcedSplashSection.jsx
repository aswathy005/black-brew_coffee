import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import {
  Snowflake,
  ShoppingBag,
  Sparkles,
  Clock,
  MoveHorizontal,
  Droplets,
} from 'lucide-react';
import { Reveal } from '../components/animations/Reveal';
import { FEATURED_MENU_ITEMS } from '../data/coffeeData';
import icedGlassImg from '../assets/images/iced-coffee-glass.webp';
import './IcedSplashSection.css';

const COLD_BREW_ITEM = FEATURED_MENU_ITEMS.find((i) => i.id === 'cold-brew') || {
  id: 'cold-brew',
  name: 'Cold Brew',
  price: 140,
};

// 16 Dynamic Flying Coffee & Cream Droplets for liquid overflow physics
const DROPLETS = [
  { id: 1, targetX: -140, targetY: -110, size: 10, maxScale: 1.4, peakProgress: 0.52 },
  { id: 2, targetX: -85, targetY: -160, size: 13, maxScale: 1.5, peakProgress: 0.50 },
  { id: 3, targetX: -190, targetY: -65, size: 8, maxScale: 1.2, peakProgress: 0.54 },
  { id: 4, targetX: -50, targetY: -195, size: 11, maxScale: 1.6, peakProgress: 0.49 },
  { id: 5, targetX: 60, targetY: -180, size: 12, maxScale: 1.5, peakProgress: 0.51 },
  { id: 6, targetX: 110, targetY: -140, size: 14, maxScale: 1.4, peakProgress: 0.53 },
  { id: 7, targetX: 165, targetY: -75, size: 9, maxScale: 1.3, peakProgress: 0.55 },
  { id: 8, targetX: -110, targetY: -80, size: 7, maxScale: 1.1, peakProgress: 0.52 },
  { id: 9, targetX: 85, targetY: -95, size: 8, maxScale: 1.2, peakProgress: 0.53 },
  { id: 10, targetX: -25, targetY: -220, size: 9, maxScale: 1.3, peakProgress: 0.48 },
  { id: 11, targetX: 20, targetY: -210, size: 10, maxScale: 1.4, peakProgress: 0.50 },
  { id: 12, targetX: -160, targetY: -35, size: 6, maxScale: 1.0, peakProgress: 0.56 },
  { id: 13, targetX: 140, targetY: -40, size: 7, maxScale: 1.0, peakProgress: 0.57 },
  { id: 14, targetX: 0, targetY: -170, size: 11, maxScale: 1.5, peakProgress: 0.51 },
  // Overflow splash droplets
  { id: 15, targetX: -120, targetY: 45, size: 10, maxScale: 1.3, peakProgress: 0.78 },
  { id: 16, targetX: 125, targetY: 48, size: 11, maxScale: 1.35, peakProgress: 0.80 },
];

// 5 Viscous Cascading Overflow Drips that stream down the glass facets as liquid overflows
const OVERFLOW_DRIPS = [
  { id: 'drip-1', left: '16%', width: 7, maxHeight: 190, range: [0.58, 0.82] },
  { id: 'drip-2', left: '30%', width: 9, maxHeight: 270, range: [0.61, 0.85] },
  { id: 'drip-3', left: '48%', width: 10, maxHeight: 310, range: [0.64, 0.88] },
  { id: 'drip-4', left: '68%', width: 8, maxHeight: 240, range: [0.66, 0.90] },
  { id: 'drip-5', left: '82%', width: 6, maxHeight: 170, range: [0.68, 0.92] },
];

export function IcedSplashSection({ onQuickAdd, onExploreMenu }) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  // 1. Entrance Animation: When reaching this section on scroll,
  // the iced coffee glass slides down smoothly from the top and stabilizes
  const { scrollYProgress: entranceProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start 18%'],
  });

  const smoothEntrance = useSpring(entranceProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  const glassEntranceY = useTransform(smoothEntrance, [0, 1], [-260, 0]);
  const glassEntranceOpacity = useTransform(smoothEntrance, [0, 0.45], [0, 1]);
  const glassEntranceScale = useTransform(smoothEntrance, [0, 1], [0.86, 1]);

  // 2. Main Section Scroll Runway (Smooth scroll-linked liquid physics)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 35%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 26,
    restDelta: 0.001,
  });

  // 3. Horizontal Drag & Scroll Control: Move the glass left and right freely in 3D
  const glassX = useMotionValue(0);
  const smoothGlassX = useSpring(glassX, {
    stiffness: 120,
    damping: 24,
  });

  // 3D Y-axis tilt based on horizontal position (-240px to +240px maps to -40° to +40°)
  const glassRotateY = useTransform(smoothGlassX, [-240, 240], [-38, 38]);
  const sheenShiftX = useTransform(smoothGlassX, [-240, 240], [-60, 60]);

  // 4. Falling 3D Ice Cubes Transform (4 Staggered crystal cubes plunging in)
  const ice1Y = useTransform(smoothProgress, [0.08, 0.32, 0.44], [-340, 15, 38]);
  const ice1X = useTransform(smoothProgress, [0.08, 0.32], [-45, -18]);
  const ice1Rot = useTransform(smoothProgress, [0.08, 0.44], [-55, 18]);
  const ice1Opacity = useTransform(smoothProgress, [0.05, 0.12, 0.65, 0.85], [0, 1, 1, 0.6]);

  const ice2Y = useTransform(smoothProgress, [0.12, 0.36, 0.48], [-390, 20, 44]);
  const ice2X = useTransform(smoothProgress, [0.12, 0.36], [35, 14]);
  const ice2Rot = useTransform(smoothProgress, [0.12, 0.48], [65, -16]);
  const ice2Opacity = useTransform(smoothProgress, [0.09, 0.16, 0.68, 0.88], [0, 1, 1, 0.6]);

  const ice3Y = useTransform(smoothProgress, [0.16, 0.40, 0.52], [-350, 25, 50]);
  const ice3X = useTransform(smoothProgress, [0.16, 0.40], [-12, -2]);
  const ice3Rot = useTransform(smoothProgress, [0.16, 0.52], [-30, 28]);
  const ice3Opacity = useTransform(smoothProgress, [0.13, 0.20, 0.70, 0.90], [0, 1, 1, 0.6]);

  const ice4Y = useTransform(smoothProgress, [0.20, 0.44, 0.56], [-410, 10, 32]);
  const ice4X = useTransform(smoothProgress, [0.20, 0.44], [22, 6]);
  const ice4Rot = useTransform(smoothProgress, [0.20, 0.56], [45, -22]);
  const ice4Opacity = useTransform(smoothProgress, [0.17, 0.24, 0.72, 0.92], [0, 1, 1, 0.65]);

  // Shockwave ring on ice impact
  const rippleScale = useTransform(smoothProgress, [0.30, 0.48], [0.3, 2.2]);
  const rippleOpacity = useTransform(smoothProgress, [0.30, 0.34, 0.48], [0, 0.85, 0]);

  // 5. MILK POUR STREAM ANIMATION (Silky milk pours in from above)
  const milkStreamOpacity = useTransform(
    smoothProgress,
    [0.30, 0.36, 0.60, 0.68],
    [0, 1, 1, 0]
  );
  const milkStreamScaleY = useTransform(
    smoothProgress,
    [0.30, 0.38, 0.65],
    [0, 1, 1]
  );

  // Milk impact ripple at the liquid surface
  const milkRippleScale = useTransform(smoothProgress, [0.36, 0.60], [0.3, 2.0]);
  const milkRippleOpacity = useTransform(
    smoothProgress,
    [0.36, 0.40, 0.60],
    [0, 0.85, 0]
  );

  // Marbled milk infusion inside the glass (Cold brew blends into rich caramel cream)
  const marbledSwirlOpacity = useTransform(
    smoothProgress,
    [0.36, 0.48, 0.90],
    [0, 0.88, 0.95]
  );

  // 6. GLASS OVERFLOW ANIMATION (Liquid rises to brim & cascades down)
  // Frothy overflow foam crown expands past the glass rim
  const overflowCrownScale = useTransform(
    smoothProgress,
    [0.55, 0.70, 0.88],
    [0, 1.15, 1.05]
  );
  const overflowCrownOpacity = useTransform(
    smoothProgress,
    [0.55, 0.62, 0.92, 1],
    [0, 1, 1, 0.92]
  );

  // Chill vapor / frost mist billows around the overflowing glass
  const chillMistOpacity = useTransform(
    smoothProgress,
    [0.50, 0.66, 0.92],
    [0, 0.72, 0.55]
  );
  const chillMistScale = useTransform(smoothProgress, [0.50, 0.92], [0.8, 1.25]);

  // Listen for horizontal wheel scrolling to tilt/slide glass
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > 2) {
        e.preventDefault();
        const current = glassX.get();
        const next = Math.max(-220, Math.min(220, current - e.deltaX * 1.3));
        glassX.set(next);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [glassX]);

  // Ambient mouse parallax
  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left - rect.width / 2) * 0.04;
    const ny = (e.clientY - rect.top - rect.height / 2) * 0.04;
    setMouseParallax({ x: nx, y: ny });
  };

  return (
    <section
      id="iced-splash"
      ref={containerRef}
      className="iced-splash"
      aria-label="Interactive 3D Artisanal Cold Brew Splash and Overflow"
      onMouseMove={handleMouseMove}
    >
      {/* Pinned Sticky Track: Stays pinned while ice drops, milk pours, and liquid overflows */}
      <div className="iced-splash__sticky-track">
        {/* Ambient Dark & Gold Lighting */}
        <div className="iced-splash__ambient-glow" aria-hidden="true" />
        <div className="iced-splash__grid-overlay" aria-hidden="true" />

        <div className="container iced-splash__inner">
          {/* LEFT COLUMN: Editorial Typography & Actions */}
          <div className="iced-splash__content">
            <Reveal delay={0.05}>
              <div className="iced-splash__badge">
                <span className="iced-splash__badge-line" />
                <span className="iced-splash__badge-text">
                  <Snowflake size={13} className="iced-splash__badge-icon" />
                  SIGNATURE COLD EXPERIENCE
                </span>
                <span className="iced-splash__badge-line" />
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <h2 className="iced-splash__title">
                <span className="iced-splash__title-white">Cold Brew</span>
                <span className="iced-splash__title-gold">
                  Splash &amp; Overflow<span className="iced-splash__title-dot">.</span>
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="iced-splash__desc">
                Scroll down to drop crystalline 3D ice cubes, pour fresh velvety milk,
                and watch our artisanal single-origin cold brew fill to the brim and
                cascade over the glass in pure liquid motion!
              </p>
            </Reveal>

            {/* 3 Craft Metric Pills */}
            <div className="iced-splash__metrics">
              <div className="iced-splash__metric-item">
                <Snowflake size={15} className="iced-splash__metric-icon" />
                <div className="iced-splash__metric-text">
                  <span className="iced-splash__metric-val">-2°C</span>
                  <span className="iced-splash__metric-lbl">Chilled Core</span>
                </div>
              </div>
              <div className="iced-splash__metric-item">
                <Droplets size={15} className="iced-splash__metric-icon" />
                <div className="iced-splash__metric-text">
                  <span className="iced-splash__metric-val">Fresh Pour</span>
                  <span className="iced-splash__metric-lbl">Velvety Milk</span>
                </div>
              </div>
              <div className="iced-splash__metric-item">
                <Sparkles size={15} className="iced-splash__metric-icon" />
                <div className="iced-splash__metric-text">
                  <span className="iced-splash__metric-val">Overflow</span>
                  <span className="iced-splash__metric-lbl">Rich Foam Rim</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="iced-splash__actions">
              <motion.button
                type="button"
                className="btn-gold iced-splash__order-btn"
                onClick={() => onQuickAdd && onQuickAdd(COLD_BREW_ITEM)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <ShoppingBag size={17} />
                <span>Order Cold Brew • ₹140</span>
              </motion.button>

              {onExploreMenu && (
                <button
                  type="button"
                  className="iced-splash__link-btn"
                  onClick={onExploreMenu}
                >
                  Explore Cold Menu &rarr;
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Programmatic 3D Glass, Falling Ice, Milk Pour & Overflow */}
          <div
            ref={stageRef}
            className={`iced-splash__stage ${isDragging ? 'iced-splash__stage--dragging' : ''}`}
            title="Drag horizontally to move and rotate the glass in 3D!"
          >
            {/* Backlight Halo behind glass */}
            <div className="iced-splash__glass-halo" aria-hidden="true" />

            {/* Chill Frost Mist rising as liquid overflows */}
            <motion.div
              className="iced-splash__chill-mist"
              style={{
                opacity: shouldReduceMotion ? 0.3 : chillMistOpacity,
                scale: shouldReduceMotion ? 1 : chillMistScale,
              }}
              aria-hidden="true"
            />

            {/* Interactive Drag Hint Pill */}
            <div className="iced-splash__drag-hint">
              <MoveHorizontal size={13} />
              <span>Drag or Swipe ↔ to Tilt Glass</span>
            </div>

            {/* Entrance Carrier: Slides down smoothly from the top on scroll */}
            <motion.div
              className="iced-splash__entrance-carrier"
              style={{
                y: shouldReduceMotion ? 0 : glassEntranceY,
                opacity: shouldReduceMotion ? 1 : glassEntranceOpacity,
                scale: shouldReduceMotion ? 1 : glassEntranceScale,
              }}
            >
              {/* 3D Glass Container with free Horizontal Drag & Scroll */}
              <motion.div
                className="iced-splash__3d-glass-wrapper"
                drag="x"
                dragConstraints={{ left: -220, right: 220 }}
                dragElastic={0.25}
                style={{
                  x: smoothGlassX,
                  rotateY: shouldReduceMotion ? 0 : glassRotateY,
                  rotateX: shouldReduceMotion ? 0 : mouseParallax.y * -0.5,
                }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
              >
                {/* Dynamic Specular Glass Sheen */}
                <motion.div
                  className="iced-splash__specular-sheen"
                  style={{ x: sheenShiftX }}
                  aria-hidden="true"
                />

                {/* 1. Falling 3D Crystal Ice Cubes */}
                <div className="iced-splash__ice-stage" aria-hidden="true">
                  <motion.div
                    className="iced-splash__ice-cube iced-splash__ice-cube--1"
                    style={{
                      y: shouldReduceMotion ? 15 : ice1Y,
                      x: ice1X,
                      rotate: shouldReduceMotion ? 0 : ice1Rot,
                      opacity: shouldReduceMotion ? 1 : ice1Opacity,
                    }}
                  >
                    <div className="ice-cube-face ice-cube-front" />
                    <div className="ice-cube-face ice-cube-top" />
                    <div className="ice-cube-face ice-cube-side" />
                    <div className="ice-cube-reflection" />
                  </motion.div>

                  <motion.div
                    className="iced-splash__ice-cube iced-splash__ice-cube--2"
                    style={{
                      y: shouldReduceMotion ? 20 : ice2Y,
                      x: ice2X,
                      rotate: shouldReduceMotion ? 0 : ice2Rot,
                      opacity: shouldReduceMotion ? 1 : ice2Opacity,
                    }}
                  >
                    <div className="ice-cube-face ice-cube-front" />
                    <div className="ice-cube-face ice-cube-top" />
                    <div className="ice-cube-face ice-cube-side" />
                    <div className="ice-cube-reflection" />
                  </motion.div>

                  <motion.div
                    className="iced-splash__ice-cube iced-splash__ice-cube--3"
                    style={{
                      y: shouldReduceMotion ? 25 : ice3Y,
                      x: ice3X,
                      rotate: shouldReduceMotion ? 0 : ice3Rot,
                      opacity: shouldReduceMotion ? 1 : ice3Opacity,
                    }}
                  >
                    <div className="ice-cube-face ice-cube-front" />
                    <div className="ice-cube-face ice-cube-top" />
                    <div className="ice-cube-face ice-cube-side" />
                    <div className="ice-cube-reflection" />
                  </motion.div>

                  <motion.div
                    className="iced-splash__ice-cube iced-splash__ice-cube--4"
                    style={{
                      y: shouldReduceMotion ? 10 : ice4Y,
                      x: ice4X,
                      rotate: shouldReduceMotion ? 0 : ice4Rot,
                      opacity: shouldReduceMotion ? 1 : ice4Opacity,
                    }}
                  >
                    <div className="ice-cube-face ice-cube-front" />
                    <div className="ice-cube-face ice-cube-top" />
                    <div className="ice-cube-face ice-cube-side" />
                    <div className="ice-cube-reflection" />
                  </motion.div>
                </div>

                {/* Shockwave Ice Impact Ripple */}
                <motion.div
                  className="iced-splash__impact-ring"
                  style={{
                    scale: shouldReduceMotion ? 1 : rippleScale,
                    opacity: shouldReduceMotion ? 0 : rippleOpacity,
                  }}
                  aria-hidden="true"
                />

                {/* 2. SILKY MILK STREAM POURING IN FROM ABOVE */}
                <motion.div
                  className="iced-splash__milk-stream-wrapper"
                  style={{
                    opacity: shouldReduceMotion ? 0 : milkStreamOpacity,
                    scaleY: shouldReduceMotion ? 0 : milkStreamScaleY,
                  }}
                  aria-hidden="true"
                >
                  <MilkStreamSvg />
                </motion.div>

                {/* Milk Impact Ripple at the rim */}
                <motion.div
                  className="iced-splash__milk-ripple-ring"
                  style={{
                    scale: shouldReduceMotion ? 1 : milkRippleScale,
                    opacity: shouldReduceMotion ? 0 : milkRippleOpacity,
                  }}
                  aria-hidden="true"
                />

                {/* Cutout Iced Coffee Glass (Lightweight WebP) */}
                <div className="iced-splash__glass-body">
                  <img
                    src={icedGlassImg}
                    alt="Artisanal Iced Coffee in a Faceted Glass with Ice Cubes and Swirling Milk"
                    className="iced-splash__glass-img"
                    draggable={false}
                    loading="lazy"
                  />

                  {/* Marbled Cream Infusion Swirl inside glass */}
                  <motion.div
                    className="iced-splash__marbled-swirl-overlay"
                    style={{ opacity: shouldReduceMotion ? 0.7 : marbledSwirlOpacity }}
                    aria-hidden="true"
                  />
                </div>

                {/* 3. SPECTACULAR GLASS OVERFLOW (Rim Foam & Cascading Drips) */}
                <div className="iced-splash__overflow-stage" aria-hidden="true">
                  {/* Frothy Overflow Foam Crown */}
                  <motion.div
                    className="iced-splash__overflow-crown-wrap"
                    style={{
                      scaleY: shouldReduceMotion ? 1 : overflowCrownScale,
                      opacity: shouldReduceMotion ? 1 : overflowCrownOpacity,
                    }}
                  >
                    <OverflowCrownSvg />
                  </motion.div>

                  {/* Cascading Liquid Drips Running Down Outer Glass Facets */}
                  <div className="iced-splash__drips-layer">
                    {OVERFLOW_DRIPS.map((drip) => {
                      const dripHeight = useTransform(
                        smoothProgress,
                        drip.range,
                        [0, drip.maxHeight]
                      );
                      const dripOpacity = useTransform(
                        smoothProgress,
                        [drip.range[0], drip.range[0] + 0.04, 0.94, 1],
                        [0, 1, 1, 0.92]
                      );

                      return (
                        <motion.div
                          key={drip.id}
                          className="iced-splash__drip-stream"
                          style={{
                            left: drip.left,
                            width: drip.width,
                            height: shouldReduceMotion ? drip.maxHeight * 0.7 : dripHeight,
                            opacity: shouldReduceMotion ? 1 : dripOpacity,
                          }}
                        >
                          <div className="iced-splash__drip-head" />
                          <div className="iced-splash__drip-bead" />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. 16 Flying Espresso-Cream Overflow Droplets */}
                <div className="iced-splash__droplets-stage" aria-hidden="true">
                  {DROPLETS.map((drop) => {
                    const dropProgress = [
                      0.44,
                      drop.peakProgress,
                      drop.peakProgress + 0.12,
                      0.84,
                    ];
                    return (
                      <motion.div
                        key={`droplet-${drop.id}`}
                        className="iced-splash__droplet-sphere"
                        style={{
                          width: drop.size,
                          height: drop.size,
                          x: useTransform(
                            smoothProgress,
                            dropProgress,
                            [0, drop.targetX * 0.7, drop.targetX, drop.targetX * 1.1]
                          ),
                          y: useTransform(
                            smoothProgress,
                            dropProgress,
                            [0, drop.targetY, drop.targetY + 25, drop.targetY + 65]
                          ),
                          scale: useTransform(
                            smoothProgress,
                            dropProgress,
                            [0.2, drop.maxScale, drop.maxScale * 0.7, 0]
                          ),
                          opacity: useTransform(
                            smoothProgress,
                            dropProgress,
                            [0, 1, 0.85, 0]
                          ),
                        }}
                      />
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Instruction Indicators */}
        <div className="iced-splash__scroll-indicator" aria-hidden="true">
          <div className="iced-splash__scroll-mouse">
            <div className="iced-splash__scroll-dot" />
          </div>
          <span className="iced-splash__scroll-text">
            Scroll to Drop Ice, Pour Milk &amp; Overflow · Drag ↔ to Tilt Glass
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * Silky Milk Pour Stream SVG with glossy fluid highlights.
 */
function MilkStreamSvg() {
  return (
    <svg viewBox="0 0 100 340" className="iced-splash__milk-svg" fill="none">
      <defs>
        <linearGradient id="milkStreamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.84" />
          <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.98" />
          <stop offset="65%" stopColor="#FFFDF7" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#EAD8BE" stopOpacity="0.75" />
        </linearGradient>
        <filter id="milkGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#FFFFFF" floodOpacity="0.45" />
        </filter>
      </defs>
      {/* Stream body with natural liquid curve */}
      <path
        d="M 44 0 C 42 70 40 140 45 220 C 47 270 46 310 43 340 L 59 340 C 56 310 55 270 57 220 C 62 140 60 70 58 0 Z"
        fill="url(#milkStreamGrad)"
        filter="url(#milkGlow)"
      />
      {/* Glossy specular line */}
      <path
        d="M 50 0 C 48 70 47 140 50 220 C 52 270 51 310 49 340"
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * Frothy Overflow Cream Rim Foam Crown SVG.
 */
function OverflowCrownSvg() {
  return (
    <svg viewBox="0 0 340 110" className="iced-splash__overflow-crown-svg" fill="none">
      <defs>
        <linearGradient id="overflowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="30%" stopColor="#F7E7CE" />
          <stop offset="68%" stopColor="#C8842A" />
          <stop offset="100%" stopColor="#4A2608" />
        </linearGradient>
        <filter id="overflowShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#FFC928" floodOpacity="0.38" />
        </filter>
      </defs>
      {/* Rich foamy cream cascading over rim */}
      <path
        d="M 28 48 
           C 48 24 78 16 108 30 
           C 134 14 168 12 194 26 
           C 218 14 254 16 278 32 
           C 304 26 324 42 316 62 
           C 300 82 284 92 258 88 
           C 238 100 214 104 188 86 
           C 164 104 134 100 114 84 
           C 88 96 64 90 44 74 
           C 24 66 16 56 28 48 Z"
        fill="url(#overflowGrad)"
        filter="url(#overflowShadow)"
      />
      {/* Specular froth bubbles */}
      <circle cx="115" cy="36" r="7" fill="#FFFFFF" opacity="0.82" />
      <circle cx="152" cy="26" r="10" fill="#FFFFFF" opacity="0.92" />
      <circle cx="196" cy="30" r="8" fill="#FFFFFF" opacity="0.88" />
      <circle cx="236" cy="33" r="6" fill="#FFFFFF" opacity="0.78" />
    </svg>
  );
}

export default IcedSplashSection;
