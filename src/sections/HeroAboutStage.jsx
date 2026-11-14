import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import aboutBeansImg from '../assets/images/about-beans.jpg';
import './HeroAboutStage.css';

export function HeroAboutStage({ children }) {
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [useFallbackOnly, setUseFallbackOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Cinematic Background Scroll Parallax: Background moves slower than scroll
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end start'],
  });

  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['0%', '16%']
  );
  const mediaScale = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [1, 1.06]
  );
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.75], [0.35, 0.62]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluateEnv = () => {
      setIsMobile(mobileQuery.matches);
      const saveData = Boolean(navigator.connection && navigator.connection.saveData);
      if (motionQuery.matches || saveData) {
        setUseFallbackOnly(true);
      } else {
        setUseFallbackOnly(false);
      }
    };

    evaluateEnv();
    mobileQuery.addEventListener('change', evaluateEnv);
    motionQuery.addEventListener('change', evaluateEnv);

    return () => {
      mobileQuery.removeEventListener('change', evaluateEnv);
      motionQuery.removeEventListener('change', evaluateEnv);
    };
  }, []);

  useEffect(() => {
    if (useFallbackOnly || !videoRef.current) return;

    const videoEl = videoRef.current;
    videoEl.muted = true;
    videoEl.defaultMuted = true;

    const playPromise = videoEl.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Fallback smoothly to static photography if autoplay is blocked
        setUseFallbackOnly(true);
      });
    }
  }, [useFallbackOnly]);

  return (
    <div ref={stageRef} className="hero-about-stage">
      <motion.div
        className="hero-about-stage__media"
        style={{ y: mediaY, scale: mediaScale }}
        aria-hidden="true"
      >
        <img
          src={aboutBeansImg}
          alt=""
          className="hero-about-stage__fallback"
          loading="eager"
        />

        {!useFallbackOnly && (
          <video
            ref={videoRef}
            className={`hero-about-stage__video ${
              videoReady ? 'hero-about-stage__video--ready' : ''
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload={isMobile ? 'metadata' : 'auto'}
            poster={aboutBeansImg}
            onCanPlay={() => setVideoReady(true)}
            onPlaying={() => setVideoReady(true)}
            onError={() => setUseFallbackOnly(true)}
          >
            <source src="/videos/coffeebeans.mp4" type="video/mp4" />
          </video>
        )}

        <div className="hero-about-stage__overlay" />
        <motion.div
          className="hero-about-stage__scrim"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>

      <div className="hero-about-stage__content">{children}</div>
    </div>
  );
}

export default HeroAboutStage;

