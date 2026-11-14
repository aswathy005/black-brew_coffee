import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Coffee, Sparkles } from 'lucide-react';
import { Reveal } from '../components/animations/Reveal';
import { SplitText } from '../components/animations/SplitText';
import './FaqSection.css';

const FAQ_ITEMS = [
  {
    id: 'origin',
    number: '01',
    question: 'What makes BLACK & BREW single-origin coffee distinctive?',
    answer:
      'Our beans are cultivated at 1,850m elevation in rich volcanic Chikmagalur micro-lots. Every crop is directly sourced from multi-generational family farms, hand-harvested at peak ripeness, and drum-roasted in small batches every Tuesday to preserve natural notes of dark cacao, dried cherry, and wild jasmine honey.',
  },
  {
    id: 'cold-brew',
    number: '02',
    question: 'How is your signature 24-Hour Nitro Cold Brew crafted?',
    answer:
      'We steep coarse-milled heirloom beans in ice-cold triple-filtered water for a continuous 24 hours at 4°C. This slow extraction eliminates 65% of typical coffee acidity and delivers zero astringency. Right before serving, we infuse it with pure food-grade nitrogen to produce a rich, stout-like cascading microfoam head.',
  },
  {
    id: 'vegan-milk',
    number: '03',
    question: 'Do you offer specialty dairy alternatives and vegan menu pairings?',
    answer:
      'Yes! We offer organic oat, roasted almond, and silky soy milks. Our espresso machine steam wands are fitted with dry vortex micro-tips, enabling our baristas to achieve identical micro-silky texture and freehand latte art with plant-based milks as whole dairy.',
  },
  {
    id: 'home-brew',
    number: '04',
    question: 'Can I purchase whole roasted beans customized for home brewing?',
    answer:
      'Certainly. All signature roasts (Bourbon Reserve, Dark Obsidian, and Golden Crema) are bagged fresh within 48 hours of roasting with one-way aroma degassing valves. Upon request, our baristas will precision-grind your bag to the exact micron level for Espresso, AeroPress, V60 Pourover, or French Press.',
  },
  {
    id: 'reservations',
    number: '05',
    question: 'What are the cafe operating hours and cupping reservation options?',
    answer:
      'Our sanctuary is open daily from 7:00 AM to 11:30 PM. Walk-ins are always welcomed for all seating zones. For weekend sensory cupping sessions, barista masterclasses, or reserve table bookings, you can place a reservation directly through our online concierge or visit the counter.',
  },
];

export function FaqSection({ onOpenOrder }) {
  const [openId, setOpenId] = useState('origin'); // First item open by default

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="faq-section" aria-label="Frequently Asked Questions">
      {/* Ambient background glows */}
      <div className="faq-section__ambient-glow" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <div className="faq-section__header">
          <Reveal delay={0.06} underline={true}>
            <div className="section-eyebrow">
              <HelpCircle size={14} className="faq-section__eyebrow-icon" />
              <span className="eyebrow-underline">Brewing Knowledge</span> · FAQ
            </div>
          </Reveal>

          <Reveal delay={0.12} split={true}>
            <h2 className="faq-section__title">
              <SplitText>Everything You Need To Know About</SplitText>{' '}
              <span className="faq-section__gold-title">Our Craft.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="faq-section__subtitle">
              From high-altitude micro-lots to our 24-hour nitro extraction, explore the science and passion poured into every single cup.
            </p>
          </Reveal>
        </div>

        {/* Accordion List */}
        <div className="faq-section__list" role="region" aria-label="Accordion Questions">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openId === item.id;
            const buttonId = `faq-btn-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <Reveal key={item.id} delay={0.1 + index * 0.06}>
                <div
                  className={`faq-card ${isOpen ? 'faq-card--open' : ''}`}
                >
                  <button
                    type="button"
                    id={buttonId}
                    className="faq-card__header"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleItem(item.id);
                      }
                    }}
                  >
                    <div className="faq-card__title-wrap">
                      <span className="faq-card__number">{item.number}</span>
                      <span className="faq-card__question">{item.question}</span>
                    </div>

                    <div className={`faq-card__icon-wrap ${isOpen ? 'faq-card__icon-wrap--active' : ''}`}>
                      <ChevronDown
                        size={18}
                        className="faq-card__chevron"
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className="faq-card__content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="faq-card__answer-inner">
                          <p className="faq-card__answer">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;

