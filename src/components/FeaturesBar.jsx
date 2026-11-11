import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Coffee, Smile, Heart } from 'lucide-react';
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
  return (
    <section id="features" className="features-section" aria-label="Our Signature Promises">
      <div className="container">
        <motion.div
          className="features-bar"
          variants={barVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {FEATURES.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="feature-item"
                variants={cardVariants}
              >
                <div className="feature-item__icon" aria-hidden="true">
                  <IconComponent size={22} strokeWidth={1.75} />
                </div>
                <div className="feature-item__text">
                  <h3 className="feature-item__title">{feature.title}</h3>
                  <p className="feature-item__sub">{feature.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

