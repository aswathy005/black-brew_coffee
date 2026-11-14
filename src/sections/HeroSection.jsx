import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Coffee, ArrowRight, Play } from 'lucide-react';
import { Reveal } from '../components/animations/Reveal';
import './HeroSection.css';

const CINEMA_EASE = [0.16, 1, 0.3, 1];

const HERO_TITLE_LINES = [
  { text: 'Fuel Your Day', highlight: false, startDelay: 0.08 },
  { text: 'with', highlight: false, startDelay: 0.26 },
  { text: 'Perfect Coffee', highlight: true, startDelay: 0.38 },
];

/**
 * Masked baseline split-text line revealing characters smoothly in sequence.
 */
function SplitTextLine({ text, startDelay, highlight }) {
  const words = text.split(' ');
  let runningCharIndex = 0;

  return (
    <span className="hero__title-line" aria-hidden="true">
      <span className={highlight ? 'hero__title-highlight' : undefined}>
        {words.map((word, wordIdx) => {
          const wordStartIndex = runningCharIndex;
          const chars = Array.from(word);
          runningCharIndex += chars.length;

          return (
            <React.Fragment key={`${word}-${wordIdx}`}>
              {wordIdx > 0 && ' '}
              <span className="hero__split-word">
                {chars.map((char, charOffset) => (
                  <motion.span
                    key={`${wordIdx}-${charOffset}-${char}`}
                    className="hero__split-char"
                    initial={{ y: '118%', opacity: 0, rotate: 2.5 }}
                    animate={{ y: '0%', opacity: 1, rotate: 0 }}
                    transition={{
                      duration: 0.68,
                      delay: startDelay + (wordStartIndex + charOffset) * 0.024,
                      ease: CINEMA_EASE,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </React.Fragment>
          );
        })}
      </span>
    </span>
  );
}

export function HeroSection({ onExploreMenu, onWatchVideo, onScrollDown }) {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Hero parallax: Headline fades and moves up as user scrolls down
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const headlineY = useTransform(
    scrollYProgress,
    [0, 0.75],
    shouldReduceMotion ? [0, 0] : [0, -70]
  );
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroScale = useTransform(
    scrollYProgress,
    [0, 0.75],
    shouldReduceMotion ? [1, 1] : [1, 0.96]
  );

  return (
    <section id="home" ref={sectionRef} className="hero">
      <div className="container hero__grid">
        <motion.div
          className="hero__content"
          style={{ scale: heroScale }}
        >
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="hero__badge-icon">
              <Coffee size={14} strokeWidth={2.2} />
            </span>
            <span>Good Coffee. Good Mood.</span>
          </motion.div>

          {/* Headline moves UP and fades out as user scrolls */}
          <motion.h1
            className="hero__title"
            style={{
              y: headlineY,
              opacity: headlineOpacity,
            }}
          >
            <span className="hero__sr-only">Fuel Your Day with Perfect Coffee</span>
            {HERO_TITLE_LINES.map((line) => (
              <SplitTextLine
                key={line.text}
                text={line.text}
                startDelay={line.startDelay}
                highlight={line.highlight}
              />
            ))}
          </motion.h1>

          <Reveal delay={0.5} y={18}>
            <div className="hero__desc-wrap">
              <p className="hero__desc">
                Experience the rich aroma, bold taste and warm vibes at BLACK &amp; BREW.
              </p>
              <svg
                className="hero__swish"
                viewBox="0 0 120 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <motion.path
                  d="M3 10.5C34 2.5 82 1.8 117 6.5"
                  stroke="#FFC928"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            </div>
          </Reveal>

          <motion.div
            className="hero__cta-row"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.14,
                  delayChildren: 0.72,
                },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <button type="button" className="btn-gold" onClick={onExploreMenu}>
                <span>Explore Menu</span>
                <ArrowRight size={17} className="btn-arrow" strokeWidth={2.4} />
              </button>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <button type="button" className="hero__video-btn" onClick={onWatchVideo}>
                <span className="hero__play-circle">
                  <span className="hero__play-inner">
                    <Play size={12} fill="#080808" stroke="#080808" />
                  </span>
                </span>
                <span>Watch Video</span>
              </button>
            </motion.div>
          </motion.div>

          <motion.button
            type="button"
            className="hero__scroll-btn"
            onClick={onScrollDown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.94 }}
            aria-label="Scroll down to explore"
          >
            <span className="hero__coffee-bean-cursor" aria-hidden="true">
              <svg
                className="hero__bean-svg"
                viewBox="0 0 24 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.2 2 2 7.2 2 17C2 26.8 6.2 32 12 32C17.8 32 22 26.8 22 17C22 7.2 17.8 2 12 2Z"
                  className="hero__bean-outline"
                />
                <path
                  d="M12 5.5C14.2 10.5 9.8 14.5 12 17C14.2 19.5 9.8 23.5 12 28.5"
                  className="hero__bean-groove"
                />
                <circle cx="12" cy="9" r="2.2" className="hero__bean-scroll-dot" />
              </svg>
            </span>
            <span>Scroll Down</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;

