import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FULL_MENU_ITEMS } from '../data/coffeeData';
import { MenuCard } from '../components/MenuCard';
import './MenuSection.css';

// Register GSAP ScrollTrigger plugin once safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Duplicate items to create an endless seamless horizontal auto-scroll loop
const DISPLAY_ITEMS = [...FULL_MENU_ITEMS, ...FULL_MENU_ITEMS];

export function MenuSection({ onViewFullMenu, onQuickAdd }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const resumeTimerRef = useRef(null);

  // Scroll parallax for left intro column
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const introParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [24, -24]
  );

  // 1. STAGGERED ENTRANCE VIA GSAP + SCROLLTRIGGER
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setHasEntered(true);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll('.menu-card');
    const headingElements = section.querySelectorAll('.menu__intro-animate');

    const isMobile = window.innerWidth <= 768;
    const yOffset = isMobile ? 40 : 60;
    const staggerTime = isMobile ? 0.08 : 0.12;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 95%',
          toggleActions: 'play none none none',
          once: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            // Once triggered, allow auto-scroll to resume smoothly after entrance completes
            setTimeout(() => setHasEntered(true), 900);
          },
        },
      });

      // Section heading and subtitle fade up first, before the cards
      if (headingElements.length) {
        tl.from(headingElements, {
          opacity: 0,
          y: 28,
          duration: 0.68,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }

      // Staggered 3D entrance for menu cards
      tl.from(
        cards,
        {
          opacity: 0,
          y: yOffset,
          scale: 0.95,
          rotateX: 8,
          duration: 0.8,
          ease: 'power3.out',
          stagger: {
            each: staggerTime,
            grid: 'auto',
            from: 'start',
          },
          // Clear props so hover tilt and custom transforms have 100% control
          clearProps: 'opacity,scale,rotateX',
        },
        headingElements.length ? '-=0.35' : 0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Refresh ScrollTrigger when images load so trigger calculations stay 100% accurate
  const handleImageLoad = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  // Track button states for manual arrows
  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [updateScrollButtons]);

  // Track viewport intersection for auto-scroll
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Continuous seamless auto-scroll (activates after entrance and pauses on hover)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (shouldReduceMotion) return;

    let rafId;
    let lastTime = performance.now();

    const animate = (now) => {
      const delta = Math.min(now - lastTime, 50);
      lastTime = now;

      if (!isPaused && isInView && hasEntered) {
        const px = (38 * delta) / 1000;
        track.scrollLeft += px;

        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused, isInView, hasEntered, shouldReduceMotion]);

  // Manual scroll buttons
  const handleManualScroll = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);

    const step = Math.max(240, Math.round(el.clientWidth * 0.65));
    el.scrollBy({ left: direction * step, behavior: 'smooth' });

    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 3200);
  };

  const handleTouchStart = () => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleTouchEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2200);
  };

  return (
    <section id="menu" ref={sectionRef} className="menu" aria-label="Coffee Menu">
      <div className="container">
        <div className="menu__layout">
          {/* Left Intro Column */}
          <motion.div className="menu__intro" style={{ y: introParallaxY }}>
            <div className="section-eyebrow menu__intro-animate">
              <span className="eyebrow-underline">Our Menu</span>
            </div>

            <h2 className="menu__heading menu__intro-animate">
              Crafted
              <br />
              with Passion
            </h2>

            <p className="menu__desc menu__intro-animate">
              From classic espresso to creamy lattes, explore our delicious range.
            </p>

            <div className="menu__intro-animate">
              <button type="button" className="btn-gold" onClick={onViewFullMenu}>
                <span>View Full Menu</span>
                <ArrowRight size={17} className="btn-arrow" strokeWidth={2.4} />
              </button>
            </div>
          </motion.div>

          {/* Right Horizontal Scroll Showcase with 3D Tilt Cards */}
          <div className="menu__carousel">
            <div className="menu__controls">
              <span className="menu__scroll-hint">
                <span className={`menu__auto-pulse ${isPaused ? 'menu__auto-pulse--paused' : ''}`} />
                {isPaused ? 'Paused · Hover off to resume' : 'Auto-scrolling · Hover to pause'}
              </span>
              <div className="menu__nav-arrows">
                <button
                  type="button"
                  className="menu__arrow-btn"
                  onClick={() => handleManualScroll(-1)}
                  disabled={!canScrollLeft}
                  aria-label="Scroll menu left"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="menu__arrow-btn"
                  onClick={() => handleManualScroll(1)}
                  disabled={!canScrollRight}
                  aria-label="Scroll menu right"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div
              ref={trackRef}
              className="menu__cards-track"
              onScroll={updateScrollButtons}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              tabIndex={0}
              aria-label="Coffee menu items horizontal showcase"
            >
              {DISPLAY_ITEMS.map((item, idx) => (
                <MenuCard
                  key={`${item.id}-${idx}`}
                  item={item}
                  onQuickAdd={onQuickAdd}
                  onImageLoad={handleImageLoad}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MenuSection;
