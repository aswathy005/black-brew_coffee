import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { Reveal } from '../components/animations/Reveal';
import heroCoffeeImg from '../assets/images/hero-coffee.jpg';
import coldBrewImg from '../assets/images/menu-cold-brew.jpg';
import cappuccinoImg from '../assets/images/menu-cappuccino.jpg';
import caramelLatteImg from '../assets/images/menu-caramel-latte.jpg';
import './CardFanOutSection.css';

const FAN_CARDS = [
  {
    id: 'velvet-espresso',
    name: 'Velvet Double Espresso',
    tag: 'Single-Origin Chikmagalur',
    price: 110,
    image: heroCoffeeImg,
    badge: 'Signature Crema',
    notes: 'Dark Cacao · Golden Crema · Intense',
    roast: 'Dark Roast',
    desktop: { x: -370, y: 36, rotate: -14 },
    mobile: { x: -115, y: 18, rotate: -11 },
  },
  {
    id: 'cold-brew',
    name: '18-Hour Cold Brew',
    tag: 'Slow Steeped Overnight',
    price: 140,
    image: coldBrewImg,
    badge: 'Zero Bitterness',
    notes: 'Low Acidity · Smooth Cacao · Crisp',
    roast: 'Slow Extraction',
    desktop: { x: -125, y: -12, rotate: -5 },
    mobile: { x: -38, y: -8, rotate: -4 },
  },
  {
    id: 'cappuccino',
    name: 'Rosetta Cappuccino',
    tag: 'Artisanal Micro-Foam',
    price: 150,
    image: cappuccinoImg,
    badge: 'Barista Choice',
    notes: 'Velvety Foam · Sweet Milk · Balanced',
    roast: 'Medium Roast',
    desktop: { x: 125, y: -12, rotate: 5 },
    mobile: { x: 38, y: -8, rotate: 4 },
  },
  {
    id: 'caramel-latte',
    name: 'Golden Caramel Latte',
    tag: 'House Salted Caramel',
    price: 180,
    image: caramelLatteImg,
    badge: 'Customer Favorite',
    notes: 'Salted Caramel · Fluffy Cream · Rich',
    roast: 'Signature Blend',
    desktop: { x: 370, y: 36, rotate: 14 },
    mobile: { x: 115, y: 18, rotate: 11 },
  },
];

export function CardFanOutSection({ onQuickAdd }) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track scroll through the container: cards fan out smoothly as the section scrolls into view
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'center 45%'],
  });

  // Smooth out the scroll progress for a buttery card spread
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Fast, natural fan-out: spreads immediately as user scrolls towards the cards
  const spreadFactor = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Header and background dynamic transforms
  const headerScale = useTransform(smoothProgress, [0, 0.5], [0.95, 1]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.25], [0.8, 1]);
  const ambientGlowScale = useTransform(smoothProgress, [0, 1], [0.85, 1.2]);

  return (
    <section ref={containerRef} className="fanout-container" id="fanout-section">
      <div className="fanout-sticky">
        {/* Ambient Golden Glow Backdrop */}
        <motion.div
          className="fanout__ambient-glow"
          style={{ scale: ambientGlowScale }}
          aria-hidden="true"
        />

        {/* Section Header */}
        <motion.div
          className="fanout__header"
          style={{ scale: headerScale, opacity: headerOpacity }}
        >
          <Reveal delay={0.05}>
            <div className="section-eyebrow">
              <span className="eyebrow-underline">The Reserve</span>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <h2 className="fanout__title">
              Crafted for Connoisseurs:
              <br />
              <span className="fanout__title-highlight">The Signature Fan-Out</span>
            </h2>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="fanout__subtitle">
              Scroll down to fan out our master-crafted coffee collection.
            </p>
          </Reveal>

          <svg
            className="fanout__swish"
            viewBox="0 0 150 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <motion.path
              d="M4 13C45 4 105 2 146 8.5"
              stroke="#FFC928"
              strokeWidth="2.6"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </motion.div>

        {/* The Card Fan Deck Stage */}
        <div className="fanout-stage">
          <div className="fanout-deck">
            {FAN_CARDS.map((item, idx) => {
              const offsets = isMobile ? item.mobile : item.desktop;

              return (
                <FanCardItem
                  key={item.id}
                  item={item}
                  index={idx}
                  offsets={offsets}
                  spreadFactor={spreadFactor}
                  isHovered={hoveredIndex === idx}
                  onHoverStart={() => setHoveredIndex(idx)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  onQuickAdd={onQuickAdd}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom Interactive Scroll Indicator */}
        <div className="fanout__footer">
          <motion.div
            className="fanout__cue-badge"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={14} className="fanout__sparkle" />
            <span>Scroll to fan out · Tap card to order</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Individual animated card that fans out along an arc as scroll progresses.
 */
function FanCardItem({
  item,
  index,
  offsets,
  spreadFactor,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onQuickAdd,
}) {
  const stackOffset = (index - 1.5) * 6;
  const stackRotate = (index - 1.5) * 2;

  const x = useTransform(spreadFactor, [0, 1], [stackOffset, offsets.x]);
  const y = useTransform(spreadFactor, [0, 1], [0, offsets.y]);
  const rotate = useTransform(spreadFactor, [0, 1], [stackRotate, offsets.rotate]);
  const scale = useTransform(spreadFactor, [0, 1], [0.93, 1]);

  return (
    <motion.div
      className={`fanout-card-wrap ${isHovered ? 'fanout-card-wrap--hovered' : ''}`}
      style={{
        x,
        y,
        rotate: isHovered ? 0 : rotate,
        scale: isHovered ? 1.07 : scale,
        zIndex: isHovered ? 30 : index + 1,
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <article className="fanout-card">
        {/* Top Accent Bar */}
        <div className="fanout-card__shine-bar" />

        {/* Card Header */}
        <div className="fanout-card__header">
          <span className="fanout-card__badge">{item.badge}</span>
          <span className="fanout-card__price">₹{item.price}</span>
        </div>

        {/* Coffee Image Container */}
        <div className="fanout-card__media">
          <img src={item.image} alt={item.name} className="fanout-card__img" loading="lazy" />
          <span className="fanout-card__roast-pill">{item.roast}</span>
        </div>

        {/* Card Info */}
        <div className="fanout-card__body">
          <h3 className="fanout-card__name">{item.name}</h3>
          <p className="fanout-card__tag">{item.tag}</p>
          <p className="fanout-card__notes">{item.notes}</p>
        </div>

        {/* Card Action */}
        <div className="fanout-card__footer">
          <button
            type="button"
            className="fanout-card__btn"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(item);
            }}
          >
            <span>Order Now</span>
            <Plus size={15} strokeWidth={2.6} />
          </button>
        </div>
      </article>
    </motion.div>
  );
}

export default CardFanOutSection;

