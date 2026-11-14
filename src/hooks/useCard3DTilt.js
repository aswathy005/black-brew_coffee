import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * Custom hook for 3D card tilt, cursor-following glare, and lift.
 * Uses direct DOM manipulation and GSAP tweens (no setState on mousemove for 60fps performance).
 * Automatically disables on touch devices and when prefers-reduced-motion is active.
 *
 * @param {Object} options
 * @param {number} [options.maxTilt=8] - Maximum rotation in degrees on X and Y axes
 * @param {number} [options.lift=-10] - Vertical lift in pixels on hover
 * @returns {{ cardRef: React.RefObject, handleMouseMove: Function, handleMouseLeave: Function }}
 */
export function useCard3DTilt({ maxTilt = 8, lift = -10 } = {}) {
  const cardRef = useRef(null);
  const isTouchOrReducedRef = useRef(false);

  useEffect(() => {
    const checkMedia = () => {
      const isHoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      isTouchOrReducedRef.current = !isHoverCapable || prefersReducedMotion;
    };

    checkMedia();

    const mediaHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const mediaMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    mediaHover.addEventListener('change', checkMedia);
    mediaMotion.addEventListener('change', checkMedia);

    return () => {
      mediaHover.removeEventListener('change', checkMedia);
      mediaMotion.removeEventListener('change', checkMedia);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isTouchOrReducedRef.current) return;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt degrees between -maxTilt and +maxTilt
      const rotateX = -((y - centerY) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Update cursor glare CSS custom properties
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      card.style.setProperty('--glare-x', `${glareX}%`);
      card.style.setProperty('--glare-y', `${glareY}%`);
      card.style.setProperty('--glare-opacity', '1');

      // Smooth tilt and lift via GSAP without React re-render
      gsap.to(card, {
        rotateX,
        rotateY,
        y: lift,
        duration: 0.18,
        ease: 'power1.out',
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
        overwrite: 'auto',
      });
    },
    [maxTilt, lift]
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouchOrReducedRef.current) return;
    const card = cardRef.current;
    if (!card) return;

    // Fade out glare overlay
    card.style.setProperty('--glare-opacity', '0');

    // Smoothly reset tilt and lift to resting state
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  return {
    cardRef,
    handleMouseMove,
    handleMouseLeave,
  };
}

export default useCard3DTilt;

