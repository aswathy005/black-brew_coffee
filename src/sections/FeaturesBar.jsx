import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Coffee, Smile, Heart } from 'lucide-react';
import { Reveal } from '../components/animations/Reveal';
import './FeaturesBar.css';

const FEATURES = [
  {
    icon: Leaf,
    title: 'Premium Beans',
    subtitle: '100% Fresh',
  },
  {
    icon: Coffee,
    title: 'Expertly Brewed',
    subtitle: 'with Love',
  },
  {
    icon: Smile,
    title: 'Cozy Ambience',
    subtitle: 'Feel at Home',
  },
  {
    icon: Heart,
    title: 'A Space for You',
    subtitle: 'Work, Relax, Enjoy',
  },
];

const barVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.11,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
};

export function FeaturesBar() {
  const barRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: barRef,
    offset: ['start end', 'center center'],
  });
  const barScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const barY = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return (
    <section
      id="features"
      ref={barRef}
      className="features-section"
      aria-label="Our Signature Promises"
    >
      <div className="container">
        <Reveal selector=".feature-item" stagger={0.12} distance={36} duration={0.8}>
          <motion.div
            className="features-bar"
            style={{ scale: barScale, y: barY }}
          >
            {FEATURES.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="feature-item"
                >
                  <div className="feature-item__icon" aria-hidden="true">
                    <IconComponent size={22} strokeWidth={1.75} />
                  </div>
                  <div className="feature-item__text">
                    <h3 className="feature-item__title">{feature.title}</h3>
                    <p className="feature-item__sub">{feature.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

export default FeaturesBar;

