import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger once safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Auto-refresh triggers when fonts and window load completely
  if (typeof document !== 'undefined') {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }
}

// React 19 / SSR-safe useLayoutEffect
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * useReveal
 * Custom hook for GSAP ScrollTrigger reveals with React StrictMode safety.
 *
 * @param {Object} options Configuration options
 * @param {('up'|'down'|'left'|'right'|'none')} [options.direction='up'] Direction of entrance
 * @param {number} [options.distance=50] Travel distance in pixels
 * @param {number} [options.duration=0.9] Animation duration in seconds
 * @param {number} [options.delay=0] Delay before start in seconds
 * @param {number} [options.stagger=0] Stagger duration between children in seconds
 * @param {boolean} [options.once=true] Only trigger animation once
 * @param {string} [options.start='top 85%'] ScrollTrigger start position
 * @param {string|null} [options.selector=null] Target child elements selector
 * @param {boolean} [options.clipPath=false] Enable curtain clip-path image reveal
 * @param {boolean} [options.scale=false] Enable subtle scale reveal (e.g. 1.08 -> 1)
 * @param {React.RefObject} [customRef=null] Optional existing ref to bind to
 * @returns {React.RefObject} Ref to attach to the animated element or container
 */
export function useReveal(options = {}, customRef = null) {
  const localRef = useRef(null);
  const targetRef = customRef || localRef;

  const {
    direction = 'up',
    distance = 50,
    duration = 0.9,
    delay = 0,
    stagger = 0,
    once = true,
    start = 'top 85%',
    selector = null,
    clipPath = false,
    scale = false,
  } = options;

  useIsomorphicLayoutEffect(() => {
    const el = targetRef.current;
    if (!el) return undefined;

    // Accessibility check: skip all animations if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Instantly make elements visible without transitions
      const targets = selector ? el.querySelectorAll(selector) : [el];
      targets.forEach((node) => {
        gsap.set(node, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          clipPath: 'none',
          clearProps: 'all',
        });
      });
      return undefined;
    }

    const isMobile = window.innerWidth <= 768;
    const effectiveDistance = isMobile ? Math.min(distance, 30) : distance;
    const effectiveDuration = isMobile ? Math.min(duration, 0.7) : duration;

    // Convert horizontal slides to vertical 'up' on mobile for optimal mobile UX
    let effectiveDirection = direction;
    if (isMobile && (direction === 'left' || direction === 'right')) {
      effectiveDirection = 'up';
    }

    // Determine initial transform vectors
    let fromX = 0;
    let fromY = 0;

    switch (effectiveDirection) {
      case 'up':
        fromY = effectiveDistance;
        break;
      case 'down':
        fromY = -effectiveDistance;
        break;
      case 'left':
        fromX = effectiveDistance;
        break;
      case 'right':
        fromX = -effectiveDistance;
        break;
      case 'none':
      default:
        fromX = 0;
        fromY = 0;
        break;
    }

    // Scope GSAP timeline with gsap.context for React StrictMode cleanup
    const ctx = gsap.context(() => {
      const targets = selector ? el.querySelectorAll(selector) : el;

      if (!targets || (targets instanceof NodeList && targets.length === 0)) {
        return;
      }

      if (clipPath) {
        // Image clip-path reveal: inset(0 0 100% 0) -> inset(0 0 0% 0) with scale
        gsap.set(targets, {
          clipPath: 'inset(0 0 100% 0 round 20px)',
          scale: 1.15,
          opacity: 0.4,
          willChange: 'clip-path, transform, opacity',
        });

        gsap.to(targets, {
          clipPath: 'inset(0 0 0% 0 round 20px)',
          scale: 1,
          opacity: 1,
          duration: effectiveDuration,
          delay,
          ease: 'power3.out',
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        });
      } else {
        // Standard transform & opacity reveal
        const initialVars = {
          opacity: 0,
          x: fromX,
          y: fromY,
          willChange: 'transform, opacity',
        };
        if (scale) initialVars.scale = 0.94;

        gsap.set(targets, { ...initialVars });

        const toVars = {
          opacity: 1,
          x: 0,
          y: 0,
          duration: effectiveDuration,
          delay,
          ease: 'power3.out',
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        };

        if (scale) toVars.scale = 1;

        if (stagger > 0 && (targets instanceof NodeList || Array.isArray(targets))) {
          toVars.stagger = stagger;
        }

        gsap.to(targets, toVars);
      }
    }, el);

    return () => ctx.revert();
  }, [
    direction,
    distance,
    duration,
    delay,
    stagger,
    once,
    start,
    selector,
    clipPath,
    scale,
  ]);

  return targetRef;
}

/**
 * TextSplitReveal Component
 * Renders words wrapped in overflow-hidden spans with staggered upward entrance.
 */
export function TextSplitReveal({
  text,
  className = '',
  as: Component = 'span',
  delay = 0,
  stagger = 0.05,
  start = 'top 85%',
}) {
  const containerRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      const words = el.querySelectorAll('.tsr-word');
      gsap.set(words, { y: 0, opacity: 1, clearProps: 'all' });
      return undefined;
    }

    const ctx = gsap.context(() => {
      const words = el.querySelectorAll('.tsr-word');
      gsap.set(words, { y: '100%', opacity: 0, willChange: 'transform, opacity' });

      gsap.to(words, {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        delay,
        stagger,
        ease: 'power3.out',
        clearProps: 'willChange',
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        },
      });
    }, el);

    return () => ctx.revert();
  }, [delay, stagger, start]);

  const words = typeof text === 'string' ? text.split(/\s+/) : [];

  return React.createElement(
    Component,
    { ref: containerRef, className: `tsr-container ${className}` },
    words.map((word, idx) =>
      React.createElement(
        'span',
        {
          key: `${word}-${idx}`,
          style: {
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'bottom',
            marginRight: '0.28em',
          },
        },
        React.createElement(
          'span',
          {
            className: 'tsr-word',
            style: {
              display: 'inline-block',
            },
          },
          word
        )
      )
    )
  );
}

/**
 * Reveal Wrapper Component
 * Declarative component wrapper for useReveal.
 */
export function Reveal({ children, className = '', as: Component = 'div', ...options }) {
  const ref = useReveal(options);
  return React.createElement(Component, { ref, className }, children);
}
