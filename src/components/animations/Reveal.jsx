import React from 'react';
import { useReveal } from '../../hooks/useReveal';

/**
 * Reusable Reveal Component
 * Powered by GSAP ScrollTrigger, supporting directional fades, staggered children,
 * clip-path image reveals, and masked text splitting.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'up'|'down'|'left'|'right'} [props.direction='up'] - Animation direction
 * @param {number} [props.distance=50] - Travel distance in px (reduced to 30px on mobile)
 * @param {number} [props.duration=0.9] - Duration in seconds (reduced to 0.7s on mobile)
 * @param {number} [props.delay=0] - Delay in seconds
 * @param {number} [props.stagger=0] - Stagger interval for children
 * @param {string} [props.selector=null] - CSS selector for staggered children
 * @param {boolean} [props.once=true] - Play once only
 * @param {string} [props.start='top 85%'] - ScrollTrigger start trigger point
 * @param {boolean} [props.clip=false] - Clip-path wipe reveal
 * @param {boolean} [props.split=false] - Text split reveal
 * @param {boolean} [props.underline=false] - Line/underline growth animation
 * @param {string} [props.as='div'] - Element tag
 * @param {string} [props.className=''] - Additional class names
 * @param {Object} [props.style={}] - Inline styles
 */
export function Reveal({
  children,
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
  as: Component = 'div',
  className = '',
  style = {},
  ...rest
}) {
  const ref = useReveal({
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
  });

  return (
    <Component ref={ref} className={className} style={style} {...rest}>
      {children}
    </Component>
  );
}

export default Reveal;
