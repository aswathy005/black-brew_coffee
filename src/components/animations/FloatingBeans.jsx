import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import './FloatingBeans.css';

const BEANS_DATA = [
  {
    id: 'bean-1',
    side: 'left',
    top: '18%',
    left: '3%',
    size: 38,
    yRange: [-40, 220],
    rotRange: [0, 320],
    opacity: 0.55,
  },
  {
    id: 'bean-2',
    side: 'right',
    top: '36%',
    right: '3.5%',
    size: 46,
    yRange: [60, -180],
    rotRange: [-30, 240],
    opacity: 0.6,
  },
  {
    id: 'bean-3',
    side: 'left',
    top: '58%',
    left: '2.5%',
    size: 42,
    yRange: [-80, 200],
    rotRange: [45, 360],
    opacity: 0.5,
  },
  {
    id: 'bean-4',
    side: 'right',
    top: '78%',
    right: '4%',
    size: 36,
    yRange: [40, -160],
    rotRange: [-60, 180],
    opacity: 0.55,
  },
];

function FloatingBeanItem({ bean, scrollYProgress, isMobile, shouldReduceMotion }) {
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile
      ? [bean.yRange[0] * 0.4, bean.yRange[1] * 0.4]
      : bean.yRange
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile
      ? [bean.rotRange[0] * 0.5, bean.rotRange[1] * 0.5]
      : bean.rotRange
  );

  const style = {
    position: 'absolute',
    top: bean.top,
    ...(bean.left ? { left: bean.left } : { right: bean.right }),
    width: isMobile ? bean.size * 0.75 : bean.size,
    height: isMobile ? bean.size * 0.75 * 1.35 : bean.size * 1.35,
    opacity: bean.opacity,
    pointerEvents: 'none',
    zIndex: 3,
  };

  if (shouldReduceMotion) {
    return (
      <div style={style} className="floating-bean" aria-hidden="true">
        <BeanSvg />
      </div>
    );
  }

  return (
    <motion.div
      style={{
        ...style,
        y,
        rotate,
      }}
      className="floating-bean"
      aria-hidden="true"
    >
      <BeanSvg />
    </motion.div>
  );
}

function BeanSvg() {
  return (
    <svg
      viewBox="0 0 32 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="floating-bean-svg"
    >
      <defs>
        <radialGradient
          id="beanBody"
          cx="30%"
          cy="30%"
          r="70%"
          fx="25%"
          fy="25%"
        >
          <stop offset="0%" stopColor="#4A250B" />
          <stop offset="45%" stopColor="#2E1404" />
          <stop offset="90%" stopColor="#140801" />
          <stop offset="100%" stopColor="#0A0400" />
        </radialGradient>
        <linearGradient id="beanGroove" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#110500" />
          <stop offset="50%" stopColor="#080200" />
          <stop offset="100%" stopColor="#1C0901" />
        </linearGradient>
      </defs>
      {/* Outer Bean Silhouette */}
      <path
        d="M16 2.5C8 2.5 2 9.5 2 22C2 34.5 8 41.5 16 41.5C24 41.5 30 34.5 30 22C30 9.5 24 2.5 16 2.5Z"
        fill="url(#beanBody)"
        stroke="rgba(255, 201, 40, 0.28)"
        strokeWidth="1.2"
      />
      {/* Curved Center Creep Groove */}
      <path
        d="M16 7C19.5 13.5 13.5 18 16 22C18.5 26 12.5 30.5 16 37"
        stroke="url(#beanGroove)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Subtle Specular Sheen */}
      <ellipse
        cx="11"
        cy="14"
        rx="4.5"
        ry="7"
        fill="rgba(255, 201, 40, 0.12)"
        transform="rotate(-15 11 14)"
      />
    </svg>
  );
}

/**
 * Floating coffee bean decorations with scroll-linked rotation and y-movement.
 * Fully responsive: reduces quantity and motion on mobile devices and prefers-reduced-motion.
 */
export function FloatingBeans() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Show only 2 beans on mobile to keep screen uncluttered
  const visibleBeans = isMobile ? BEANS_DATA.slice(0, 2) : BEANS_DATA;

  return (
    <div className="floating-beans-container" aria-hidden="true">
      {visibleBeans.map((bean) => (
        <FloatingBeanItem
          key={bean.id}
          bean={bean}
          scrollYProgress={scrollYProgress}
          isMobile={isMobile}
          shouldReduceMotion={shouldReduceMotion}
        />
      ))}
    </div>
  );
}

export default FloatingBeans;

