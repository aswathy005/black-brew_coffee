import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'framer-motion';

/**
 * Reusable Counter component that counts up smoothly when entering the viewport.
 *
 * @param {number} target - Numerical target value (e.g., 8, 45000, 100000)
 * @param {number} duration - Animation duration in seconds (default: 2)
 * @param {string} prefix - Optional prefix text (e.g., "$")
 * @param {string} suffix - Optional suffix text (e.g., "+", "k")
 * @param {boolean} formatNumber - Whether to format with thousand commas (default: true)
 * @param {string} className - Additional CSS classes
 */
export function Counter({
  target,
  duration = 2,
  prefix = '',
  suffix = '',
  formatNumber = true,
  className = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    if (shouldReduceMotion) {
      setDisplayValue(target);
      return;
    }

    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, target, duration, shouldReduceMotion]);

  const formatted = formatNumber
    ? displayValue.toLocaleString()
    : displayValue.toString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default Counter;

