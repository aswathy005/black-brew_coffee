import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import heroCoffeeImg from '../assets/images/hero-coffee.jpg';
import aboutBeansImg from '../assets/images/about-beans.jpg';
import cafeAmbienceImg from '../assets/images/cafe-ambience.jpg';
import { Reveal } from '../components/animations/Reveal';
import { SplitText } from '../components/animations/SplitText';
import { Counter } from '../components/animations/Counter';
import { useReveal } from '../hooks/useReveal';
import './AboutSection.css';

const STORY_CHAPTERS = [
  {
    step: '01',
    title: 'The Origin (2018)',
    tag: 'Chikmagalur Highlands',
    desc: 'Founded with a passion for single-origin beans sourced directly from generational farmers at 1,400m elevation.',
    image: aboutBeansImg,
    alt: 'Fresh whole roasted Arabica coffee beans from Chikmagalur',
  },
  {
    step: '02',
    title: 'The Artisanal Craft',
    tag: 'Cast-Iron Drum Roasting',
    desc: 'Small-batch roasted fresh every Tuesday to unlock deep, velvety notes of dark cacao, toasted hazelnut, and golden crema.',
    image: heroCoffeeImg,
    alt: 'BLACK & BREW signature espresso cup with rosetta latte art',
  },
  {
    step: '03',
    title: 'Community & Good Vibes',
    tag: 'Bengaluru Sanctuary',
    desc: 'More than a coffee shop—a warm, late-night haven where dreamers, creators, and coffee purists connect.',
    image: cafeAmbienceImg,
    alt: 'Warm luxury ambience of BLACK & BREW coffee house',
  },
];

export function AboutSection({ onOpenStory }) {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll: As user scrolls through the container, chapters change & beans tumble
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 20%'],
  });

  // Cross-fade image opacities across 3 chapters
  const img1Opacity = useTransform(scrollYProgress, [0, 0.28, 0.38], [1, 1, 0]);
  const img1Scale = useTransform(scrollYProgress, [0, 0.35], [1, 1.05]);

  const img2Opacity = useTransform(scrollYProgress, [0.32, 0.42, 0.64, 0.74], [0, 1, 1, 0]);
  const img2Scale = useTransform(scrollYProgress, [0.32, 0.55, 0.74], [0.96, 1, 1.04]);

  const img3Opacity = useTransform(scrollYProgress, [0.68, 0.78, 1], [0, 1, 1]);
  const img3Scale = useTransform(scrollYProgress, [0.68, 1], [0.96, 1]);

  // Active chapter text opacity
  const text1Opacity = useTransform(scrollYProgress, [0, 0.28, 0.36], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.34, 0.42, 0.62, 0.70], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.68, 0.76, 1], [0, 1, 1]);

  // Subtle Parallax
  const cupParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [20, -20]
  );
  const badgeParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [15, -15]
  );

  return (
    <section id="about" ref={sectionRef} className="about about--sticky-container">
      <div className="about__sticky-track">
        <div className="container">
          <div className="about__grid">
            {/* Left Column: Dynamic Story Images */}
            <Reveal direction="left" distance={50} duration={0.9} className="about__media-reveal-wrap">
              <motion.div
                className="about__media"
                style={{ y: cupParallaxY }}
              >
                <div className="about__ambient-glow hero-glow-pulse" aria-hidden="true" />

                <div className="about__images-stage">
                {/* Chapter 1 Image */}
                <motion.div
                  className="about__chapter-img-wrap"
                  style={{
                    opacity: shouldReduceMotion ? 1 : img1Opacity,
                    scale: shouldReduceMotion ? 1 : img1Scale,
                  }}
                >
                  <img
                    src={STORY_CHAPTERS[0].image}
                    alt={STORY_CHAPTERS[0].alt}
                    className="about__cup-image"
                    loading="lazy"
                  />
                </motion.div>

                {/* Chapter 2 Image (with Steam) */}
                <motion.div
                  className="about__chapter-img-wrap"
                  style={{
                    opacity: shouldReduceMotion ? 0 : img2Opacity,
                    scale: shouldReduceMotion ? 1 : img2Scale,
                  }}
                >
                  <div className="steam-wrapper about__steam" aria-hidden="true">
                    <span className="steam-wisp steam-wisp--1" />
                    <span className="steam-wisp steam-wisp--2" />
                    <span className="steam-wisp steam-wisp--3" />
                  </div>
                  <img
                    src={STORY_CHAPTERS[1].image}
                    alt={STORY_CHAPTERS[1].alt}
                    className="about__cup-image"
                    loading="lazy"
                  />
                </motion.div>

                {/* Chapter 3 Image */}
                <motion.div
                  className="about__chapter-img-wrap"
                  style={{
                    opacity: shouldReduceMotion ? 0 : img3Opacity,
                    scale: shouldReduceMotion ? 1 : img3Scale,
                  }}
                >
                  <img
                    src={STORY_CHAPTERS[2].image}
                    alt={STORY_CHAPTERS[2].alt}
                    className="about__cup-image"
                    loading="lazy"
                  />
                </motion.div>
              </div>

              {/* Since 2018 Badge */}
              <motion.div
                className="about__since-badge"
                style={{ y: badgeParallaxY }}
                initial={{ scale: 0.75, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Star size={12} fill="#FFC928" stroke="#FFC928" className="about__since-star" />
                <span className="about__since-label">Since</span>
                <span className="about__since-year">2018</span>
              </motion.div>
            </motion.div>
          </Reveal>

            {/* Center / Right Column: Sticky Narrative Content */}
            <div className="about__content-area">
              <Reveal delay={0.04} underline={true}>
                <div className="section-eyebrow">
                  <span className="eyebrow-underline">Our Story</span> · BLACK &amp; BREW
                </div>
              </Reveal>

              <Reveal delay={0.1} split={true}>
                <h2 className="about__heading">
                  <SplitText>More Than Just Coffee</SplitText>
                </h2>
              </Reveal>

              {/* Scroll Chapter Display (Paragraph fades up with 0.15s delay) */}
              <Reveal delay={0.15}>
                <div className="about__story-carousel">
                {/* Chapter 1 Text */}
                <motion.div
                  className="about__story-card"
                  style={{
                    opacity: shouldReduceMotion ? 1 : text1Opacity,
                    pointerEvents: 'auto',
                  }}
                >
                  <div className="about__chapter-tag">
                    <span className="about__chapter-num">01</span>
                    <span className="about__chapter-title">{STORY_CHAPTERS[0].title}</span>
                  </div>
                  <p className="about__desc">{STORY_CHAPTERS[0].desc}</p>
                </motion.div>

                {/* Chapter 2 Text */}
                <motion.div
                  className="about__story-card"
                  style={{
                    opacity: shouldReduceMotion ? 0 : text2Opacity,
                    pointerEvents: 'auto',
                  }}
                >
                  <div className="about__chapter-tag">
                    <span className="about__chapter-num">02</span>
                    <span className="about__chapter-title">{STORY_CHAPTERS[1].title}</span>
                  </div>
                  <p className="about__desc">{STORY_CHAPTERS[1].desc}</p>
                </motion.div>

                {/* Chapter 3 Text */}
                <motion.div
                  className="about__story-card"
                  style={{
                    opacity: shouldReduceMotion ? 0 : text3Opacity,
                    pointerEvents: 'auto',
                  }}
                >
                  <div className="about__chapter-tag">
                    <span className="about__chapter-num">03</span>
                    <span className="about__chapter-title">{STORY_CHAPTERS[2].title}</span>
                  </div>
                  <p className="about__desc">{STORY_CHAPTERS[2].desc}</p>
                </motion.div>
              </div>
            </Reveal>

              {/* Reusable <Counter> Stats Strip */}
              <Reveal selector=".about__stat-item" stagger={0.12} delay={0.2}>
                <div className="about__stats-strip">
                <div className="about__stat-item">
                  <span className="about__stat-number">
                    <Counter target={8} suffix="+" duration={1.8} />
                  </span>
                  <span className="about__stat-label">Years of Passion</span>
                </div>

                <div className="about__stat-item">
                  <span className="about__stat-number">
                    <Counter target={45000} suffix="+" formatNumber={true} duration={2.2} />
                  </span>
                  <span className="about__stat-label">Happy Regulars</span>
                </div>

                <div className="about__stat-item">
                  <span className="about__stat-number">
                    <Counter target={100000} suffix="+" formatNumber={true} duration={2.4} />
                  </span>
                  <span className="about__stat-label">Cups Poured</span>
                </div>
              </div>
            </Reveal>

              {/* Actions */}
              <Reveal delay={0.25}>
                <div className="about__action-wrap">
                  <button type="button" className="btn-gold" onClick={onOpenStory}>
                    <span>Read Full Story</span>
                    <ArrowRight size={17} className="btn-arrow" strokeWidth={2.4} />
                  </button>
                </div>
              </Reveal>
            </div>

            {/* Right Handwritten Script */}
            <motion.div
              className="about__script-wrap"
              initial={{ opacity: 0, scale: 0.9, rotate: -14 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.75, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="about__script-lines">
                <span>Sip</span>
                <span>Smile</span>
                <span>Repeat</span>
              </div>
              <svg
                className="about__script-underline"
                viewBox="0 0 150 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <motion.path
                  d="M6 15C44 4 102 2 144 9"
                  stroke="#FFC928"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
