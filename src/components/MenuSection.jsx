import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { FULL_MENU_ITEMS } from '../data/coffeeData';
import './MenuSection.css';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.56,
      delay: Math.min(index * 0.08, 0.32),
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function MenuSection({ onViewFullMenu, onQuickAdd }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [updateScrollButtons]);

  const scrollTrackBy = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.max(240, Math.round(el.clientWidth * 0.65));
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section id="menu" className="menu">
      <div className="container">
        <div className="menu__layout">
          {/* Left Intro Column */}
          <motion.div
            className="menu__intro"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-eyebrow">
              <span className="eyebrow-underline">Our Menu</span>
            </div>

            <h2 className="menu__heading">
              Crafted
              <br />
              with Passion
            </h2>

            <p className="menu__desc">
              From classic espresso to creamy lattes, explore our delicious range.
            </p>

            <button type="button" className="btn-gold" onClick={onViewFullMenu}>
              <span>View Full Menu</span>
              <ArrowRight size={17} className="btn-arrow" strokeWidth={2.4} />
            </button>
          </motion.div>

          {/* Right Horizontal Scroll Showcase */}
          <div className="menu__carousel">
            <div className="menu__controls">
              <span className="menu__scroll-hint">Scroll sideways to explore all brews</span>
              <div className="menu__nav-arrows">
                <button
                  type="button"
                  className="menu__arrow-btn"
                  onClick={() => scrollTrackBy(-1)}
                  disabled={!canScrollLeft}
                  aria-label="Scroll menu left"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="menu__arrow-btn"
                  onClick={() => scrollTrackBy(1)}
                  disabled={!canScrollRight}
                  aria-label="Scroll menu right"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <motion.div
              ref={trackRef}
              className="menu__cards-track"
              onScroll={updateScrollButtons}
              tabIndex={0}
              aria-label="Coffee menu items horizontal scroll"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
            >
              {FULL_MENU_ITEMS.map((item, idx) => (
                <motion.article
                  key={item.id}
                  className="menu-card"
                  custom={idx}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    transition: { type: 'spring', stiffness: 320, damping: 24 },
                  }}
                  onClick={() => onQuickAdd(item)}
                >
                  <div className="menu-card__media">
                    <img src={item.image} alt={item.name} className="menu-card__img" />
                    <button
                      type="button"
                      className="menu-card__add-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(item);
                      }}
                      aria-label={`Add ${item.name} to order`}
                      title={`Add ${item.name}`}
                    >
                      <Plus size={16} strokeWidth={2.5} />
                    </button>
                  </div>

                  <h3 className="menu-card__title">{item.name}</h3>
                  <p className="menu-card__price">₹{item.price}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
