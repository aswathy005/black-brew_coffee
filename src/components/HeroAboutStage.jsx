import React, { useEffect, useRef, useState } from 'react';
import aboutBeansImg from '../assets/images/about-beans.jpg';
import './HeroAboutStage.css';

export function HeroAboutStage({ children }) {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [useFallbackOnly, setUseFallbackOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
        // Fallback smoothly to static photography if autoplay is blocked (e.g. Low Power Mode)
        setUseFallbackOnly(true);
      });
    }
  }, [useFallbackOnly]);

  return (
    <div className="hero-about-stage">
      <div className="hero-about-stage__media" aria-hidden="true">
        <img
          src={aboutBeansImg}
          alt=""
          className="hero-about-stage__fallback"
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
        <div className="hero-about-stage__scrim" />
        <div className="hero-about-stage__bridge" />
      </div>

      <div className="hero-about-stage__content">{children}</div>
    </div>
  );
}

