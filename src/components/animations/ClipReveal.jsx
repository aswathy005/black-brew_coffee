import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * Reusable ClipReveal component.
 * Reveals images or elements using an elegant clip-path wipe effect upon entering viewport.
 *
 * @param {React.ReactNode} children - Image or card element
 * @param {number} delay - Animation delay in seconds
 * @param {number} duration - Animation duration in seconds (default: 0.75)
 * @param {string} className - Additional CSS class name
 * @param {string} direction - 'up' | 'left' | 'right' | 'circle' (default: 'up')
 */
export function ClipReveal({
  children,
  delay = 0,
  duration = 0.75,
  className = '',
  direction = 'up',
  style = {},
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();

  // Clip path configurations
  const getClipPaths = () => {
    switch (direction) {
      case 'left':
        return {
          hidden: 'inset(0% 0% 0% 100%)',
          visible: 'inset(0% 0% 0% 0%)',
        };
      case 'right':
        return {
          hidden: 'inset(0% 100% 0% 0%)',
          visible: 'inset(0% 0% 0% 0%)',
        };
      case 'circle':
        return {
          hidden: 'circle(0% at 50% 50%)',
          visible: 'circle(100% at 50% 50%)',
        };
      case 'up':
      default:
        return {
          hidden: 'inset(100% 0% 0% 0%)',
          visible: 'inset(0% 0% 0% 0%)',
        };
    }
  };

  const clip = getClipPaths();

  if (shouldReduceMotion) {
    return (
      <motion.div
        ref={ref}
        className={className}
        style={style}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        overflow: 'hidden',
      }}
      initial={{
        clipPath: clip.hidden,
        opacity: 0,
      }}
      animate={
        isInView
          ? { clipPath: clip.visible, opacity: 1 }
          : { clipPath: clip.hidden, opacity: 0 }
      }
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default ClipReveal;

