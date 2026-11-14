import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger once safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Refresh ScrollTrigger when web fonts are loaded
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  // Refresh ScrollTrigger on window full load (catches late-loading assets/iframes)
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
}

/**
 * Custom hook for reusable scroll-triggered reveal animations.
 * Built with GSAP ScrollTrigger, useLayoutEffect, and gsap.context() for React StrictMode.
 *
 * @param {Object} options
 * @param {'up'|'down'|'left'|'right'} [options.direction='up'] - Direction of entry
 * @param {number} [options.distance=50] - Travel distance in pixels (reduced to 30px on mobile)
 * @param {number} [options.duration=0.9] - Duration in seconds (reduced to 0.7s on mobile)
 * @param {number} [options.delay=0] - Delay in seconds
 * @param {number} [options.stagger=0] - Stagger interval for children
 * @param {string} [options.selector] - CSS selector for staggered children (e.g. '.reveal-item')
 * @param {boolean} [options.once=true] - Trigger once only (toggleActions: 'play none none none')
 * @param {string} [options.start='top 85%'] - ScrollTrigger start position
 * @param {boolean} [options.clip=false] - Clip-path wipe reveal with subtle scale
 * @param {boolean} [options.split=false] - Text split reveal from behind an overflow mask
 * @param {boolean} [options.underline=false] - Animate title underline expansion from width 0 to 100%
 * @param {string} [options.trigger] - Optional custom trigger selector or element
 * @returns {React.RefObject} ref - Attach to the container element
 */
export function useReveal({
  direction = 'up',
  distance = 50,
  duration = 0.9,
  delay = 0,
  stagger = 0,
  selector = null,
  once = true,
  start = 'top 85%',
  clip = false,
  split = false,
  underline = false,
  trigger = null,
} = {}) {
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Accessibility: Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, clearProps: 'all' });
      if (selector) {
        gsap.set(el.querySelectorAll(selector), { opacity: 1, x: 0, y: 0, clearProps: 'all' });
      }
      return;
    }

    const isMobile = window.innerWidth <= 768;
    const effectiveDistance = isMobile ? 30 : distance;
    const effectiveDuration = isMobile ? 0.7 : duration;

    // Mobile fallback: Replace horizontal slide with fade-up for smoother scrolling
    let effectiveDirection = direction;
    if (isMobile && (direction === 'left' || direction === 'right')) {
      effectiveDirection = 'up';
    }

    // Determine initial transform offsets
    let initX = 0;
    let initY = 0;
    if (effectiveDirection === 'up') initY = effectiveDistance;
    if (effectiveDirection === 'down') initY = -effectiveDistance;
    if (effectiveDirection === 'left') initX = -effectiveDistance;
    if (effectiveDirection === 'right') initX = effectiveDistance;

    const triggerElement = trigger || el;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start,
          toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          invalidateOnRefresh: true,
        },
      });

      // 1. Clip-path Image Wipe Reveal
      if (clip) {
        gsap.set(el, {
          clipPath: 'inset(0% 0% 100% 0%)',
          scale: 1.18,
          opacity: 0,
          willChange: 'transform, clip-path, opacity',
        });

        tl.to(el, {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          opacity: 1,
          duration: effectiveDuration,
          delay,
          ease: 'power3.out',
          clearProps: 'willChange',
        });
        return;
      }

      // 2. Text Split Reveal (words masked behind overflow: hidden containers)
      if (split) {
        const words = el.querySelectorAll('.split-word');
        if (words.length > 0) {
          gsap.set(words, {
            y: '105%',
            opacity: 0,
            willChange: 'transform, opacity',
          });

          tl.to(words, {
            y: '0%',
            opacity: 1,
            duration: effectiveDuration * 0.85,
            delay,
            stagger: 0.05,
            ease: 'power3.out',
            clearProps: 'willChange',
          });

          // Optional underline after title text finishes
          if (underline) {
            const lines = el.querySelectorAll('.eyebrow-underline, .title-underline');
            if (lines.length > 0) {
              gsap.set(lines, { scaleX: 0, transformOrigin: 'left center' });
              tl.to(
                lines,
                {
                  scaleX: 1,
                  duration: 0.55,
                  ease: 'power2.out',
                },
                '-=0.15'
              );
            }
          }
          return;
        }
      }

      // 3. Target Child Selector Reveal (with stagger)
      if (selector) {
        const targets = el.querySelectorAll(selector);
        if (targets.length > 0) {
          gsap.set(targets, {
            opacity: 0,
            x: initX,
            y: initY,
            willChange: 'transform, opacity',
          });

          tl.to(targets, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: effectiveDuration,
            delay,
            stagger: stagger || 0.1,
            ease: 'power3.out',
            clearProps: 'willChange',
          });

          // Optional underline
          if (underline) {
            const lines = el.querySelectorAll('.eyebrow-underline, .title-underline');
            if (lines.length > 0) {
              gsap.set(lines, { scaleX: 0, transformOrigin: 'left center' });
              tl.to(
                lines,
                {
                  scaleX: 1,
                  duration: 0.55,
                  ease: 'power2.out',
                },
                '-=0.2'
              );
            }
          }
          return;
        }
      }

      // 4. Default Container / Single Element Reveal
      gsap.set(el, {
        opacity: 0,
        x: initX,
        y: initY,
        willChange: 'transform, opacity',
      });

      tl.to(el, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: effectiveDuration,
        delay,
        ease: 'power3.out',
        clearProps: 'willChange',
      });

      // Optional title underline growth from width 0 to 100%
      if (underline) {
        const lines = el.querySelectorAll('.eyebrow-underline, .title-underline');
        if (lines.length > 0) {
          gsap.set(lines, { scaleX: 0, transformOrigin: 'left center' });
          tl.to(
            lines,
            {
              scaleX: 1,
              duration: 0.55,
              ease: 'power2.out',
            },
            '-=0.2'
          );
        }
      }
    }, el);

    return () => ctx.revert();
  }, [
    direction,
    distance,
    duration,
    delay,
    stagger,
    selector,
    once,
    start,
    clip,
    split,
    underline,
    trigger,
  ]);

  return elementRef;
}

export default useReveal;

