import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Award } from 'lucide-react';
import { Reveal } from '../components/animations/Reveal';
import heroCoffeeImg from '../assets/images/hero-coffee.jpg';
import cappuccinoImg from '../assets/images/menu-cappuccino.jpg';
import caramelLatteImg from '../assets/images/menu-caramel-latte.jpg';
import coldBrewImg from '../assets/images/menu-cold-brew.jpg';
import './LuxuryShowcaseSection.css';

const SHOWCASE_BREWS = [
  {
    id: 'velvet-espresso',
    name: 'Velvet Double Crema',
    subtitle: 'Signature 9-Bar Extraction',
    price: 110,
    image: heroCoffeeImg,
    badge: 'Single Origin 1,400m',
    notes: 'Dark Couverture Cacao · Brown Sugar · Rich Hazelnut',
    roast: 'Dark Roast (205°C)',
    body: 'Velvety & Dense',
    crema: '4mm Hazelnut Crema',
    temperature: '93.5°C',
    pressure: '9 Bar',
  },
  {
    id: 'rosetta-cappuccino',
    name: 'Rosetta Micro-Foam Cappuccino',
    subtitle: 'Artisanal Steamed Velvet',
    price: 150,
    image: cappuccinoImg,
    badge: 'Barista Champion Pour',
    notes: 'Sweet Steamed Farm Milk · Toasted Walnut · Cocoa Dust',
    roast: 'Medium-Dark Roast',
    body: 'Airy & Silky',
    crema: 'Micro-Foam Rosetta Art',
    temperature: '65.0°C Milk',
    pressure: '9 Bar',
  },
  {
    id: 'golden-caramel',
    name: 'Golden Caramel Macchiato',
    subtitle: 'Slow Caramelized Cream',
    price: 180,
    image: caramelLatteImg,
    badge: 'House Secret Recipe',
    notes: 'Slow Cooked Salted Toffee · Whipped Cream · Vanilla Bean',
    roast: 'House Signature Blend',
    body: 'Luxurious & Rich',
    crema: 'Layered Caramel Foam',
    temperature: '68.0°C Milk',
    pressure: '9 Bar',
  },
  {
    id: 'cold-brew-reserve',
    name: '18-Hour Cold Brew Reserve',
    subtitle: 'Slow-Steeped Botanical Pour',
    price: 140,
    image: coldBrewImg,
    badge: '18-Hour Slow Extraction',
    notes: 'Zero Acridity · Cold Cacao Extract · Crisp Citrus Finish',
    roast: 'Slow-Steeped Dark Roast',
    body: 'Clean & Refreshing',
    crema: 'Nitro Cold Clarity',
    temperature: '4.0°C Chilled',
    pressure: 'Slow Steep',
  },
];

export function LuxuryShowcaseSection({ onQuickAdd }) {
  const sectionRef = useRef(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeBrew = SHOWCASE_BREWS[selectedIdx];

  // Scroll parallax tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax transforms for central cup, podium, ribbon, and floating beans
  const cupY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const cupRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const cupScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1.03, 0.95]);

  const podiumY = useTransform(scrollYProgress, [0, 1], [35, -25]);
  const ribbonY = useTransform(scrollYProgress, [0, 1], [-50, 45]);
  const ribbonRotate = useTransform(scrollYProgress, [0, 1], [-6, 5]);

  // Floating coffee beans parallax at different depth layers
  const bean1Y = useTransform(scrollYProgress, [0, 1], [70, -85]);
  const bean1Rot = useTransform(scrollYProgress, [0, 1], [0, 75]);

  const bean2Y = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const bean2Rot = useTransform(scrollYProgress, [0, 1], [20, -55]);

  const bean3Y = useTransform(scrollYProgress, [0, 1], [80, -90]);
  const bean3Rot = useTransform(scrollYProgress, [0, 1], [-30, 65]);

  const bean4Y = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const bean4Rot = useTransform(scrollYProgress, [0, 1], [45, -45]);

  const bean5Y = useTransform(scrollYProgress, [0, 1], [20, -35]);
  const bean6Y = useTransform(scrollYProgress, [0, 1], [50, -65]);

  return (
    <section id="luxury-showcase" ref={sectionRef} className="lux-showcase" aria-label="Luxury Coffee Showcase">
      {/* Background Ambience & Golden Glow */}
      <div className="lux-showcase__bg-glow" aria-hidden="true" />
      <div className="lux-showcase__spotlight" aria-hidden="true" />

      {/* Dynamic Golden Ribbon sweeping across background */}
      <motion.div
        className="lux-showcase__ribbon-wrap"
        style={{ y: ribbonY, rotate: ribbonRotate }}
        aria-hidden="true"
      >
        <svg
          className="lux-showcase__ribbon-svg"
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd142" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#ffc928" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#f5b700" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e5a700" stopOpacity="0.15" />
            </linearGradient>
            <filter id="ribbonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>
          <path
            d="M-50 480C220 540 380 280 620 220C880 150 1020 340 1250 180"
            stroke="url(#goldRibbonGrad)"
            strokeWidth="18"
            strokeLinecap="round"
            filter="url(#ribbonGlow)"
          />
          <path
            d="M-40 470C230 530 390 270 630 210C890 140 1030 330 1260 170"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      <div className="container lux-showcase__container">
        {/* Left Column: Editorial & Story */}
        <motion.div
          className="lux-showcase__col-left"
          initial={{ opacity: 0, x: -36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <Reveal delay={0.06}>
            <div className="section-eyebrow">
              <span className="eyebrow-underline">✦ The Master Reserve</span>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <h2 className="lux-showcase__heading">
              Luxing Collection:
              <br />
              <span className="lux-showcase__heading-gold">The 3D Stage</span>
            </h2>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="lux-showcase__desc">
              Experience the pinnacle of coffee gastronomy. Single-estate high-altitude beans extracted to
              perfection, crowned with dense golden crema and served on our signature illuminated pedestal.
            </p>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeBrew.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="lux-showcase__brew-details"
            >
              <div className="lux-showcase__pill-badge">{activeBrew.badge}</div>
              <h3 className="lux-showcase__brew-name">{activeBrew.name}</h3>
              <p className="lux-showcase__brew-subtitle">{activeBrew.subtitle}</p>

              <div className="lux-showcase__stats-grid">
                <div className="lux-stat">
                  <span className="lux-stat__label">Pressure</span>
                  <span className="lux-stat__val">{activeBrew.pressure}</span>
                </div>
                <div className="lux-stat">
                  <span className="lux-stat__label">Temperature</span>
                  <span className="lux-stat__val">{activeBrew.temperature}</span>
                </div>
                <div className="lux-stat">
                  <span className="lux-stat__label">Profile</span>
                  <span className="lux-stat__val">{activeBrew.roast}</span>
                </div>
              </div>

              <div className="lux-showcase__action-row">
                <button
                  type="button"
                  className="btn-gold"
                  onClick={() => onQuickAdd(activeBrew)}
                >
                  <ShoppingBag size={17} />
                  <span>Order Online • ₹{activeBrew.price}</span>
                  <ArrowRight size={17} className="btn-arrow" strokeWidth={2.4} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Center Column: 3D Golden Podium & Floating Cup with Splash */}
        <div className="lux-showcase__col-center">
          {/* Floating Coffee Beans Parallax Layer */}
          <div className="lux-showcase__beans-layer" aria-hidden="true">
            {/* Bean 1 (Top Left) */}
            <motion.div
              className="lux-bean lux-bean--1"
              style={{ y: bean1Y, rotate: bean1Rot }}
            >
              <CoffeeBeanSvg size={38} />
            </motion.div>

            {/* Bean 2 (Mid Left) */}
            <motion.div
              className="lux-bean lux-bean--2"
              style={{ y: bean2Y, rotate: bean2Rot }}
            >
              <CoffeeBeanSvg size={26} />
            </motion.div>

            {/* Bean 3 (Top Right) */}
            <motion.div
              className="lux-bean lux-bean--3"
              style={{ y: bean3Y, rotate: bean3Rot }}
            >
              <CoffeeBeanSvg size={42} />
            </motion.div>

            {/* Bean 4 (Mid Right) */}
            <motion.div
              className="lux-bean lux-bean--4"
              style={{ y: bean4Y, rotate: bean4Rot }}
            >
              <CoffeeBeanSvg size={30} />
            </motion.div>

            {/* Bean 5 (Bottom Left) */}
            <motion.div
              className="lux-bean lux-bean--5"
              style={{ y: bean5Y }}
            >
              <CoffeeBeanSvg size={22} />
            </motion.div>

            {/* Bean 6 (Bottom Right) */}
            <motion.div
              className="lux-bean lux-bean--6"
              style={{ y: bean6Y }}
            >
              <CoffeeBeanSvg size={24} />
            </motion.div>
          </div>

          {/* Central 3D Podium & Cup Stage */}
          <div className="lux-podium-stage">
            {/* The Floating Coffee Cup */}
            <motion.div
              className="lux-cup-anchor"
              style={{ y: cupY, rotate: cupRotate, scale: cupScale }}
            >
              {/* Milk & Crema Splash Layer */}
              <div className="lux-splash-aura" aria-hidden="true">
                <svg
                  className="lux-splash-svg"
                  viewBox="0 0 320 280"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="milkSplashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                      <stop offset="60%" stopColor="#fff8e8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ffc928" stopOpacity="0.45" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M60 190C35 150 45 90 90 70C110 60 125 80 115 105C105 130 85 160 60 190Z"
                    fill="url(#milkSplashGrad)"
                  />
                  <path
                    d="M260 190C285 150 275 90 230 70C210 60 195 80 205 105C215 130 235 160 260 190Z"
                    fill="url(#milkSplashGrad)"
                  />
                  <circle cx="85" cy="50" r="4.5" fill="#ffffff" />
                  <circle cx="235" cy="50" r="4" fill="#ffffff" />
                  <circle cx="50" cy="95" r="3" fill="#ffeec2" />
                  <circle cx="270" cy="95" r="3.5" fill="#ffeec2" />
                </svg>
              </div>

              {/* Realistic Animated Steam */}
              <div className="steam-wrapper lux-steam" aria-hidden="true">
                <span className="steam-wisp steam-wisp--1" />
                <span className="steam-wisp steam-wisp--2" />
                <span className="steam-wisp steam-wisp--3" />
                <span className="steam-wisp steam-wisp--4" />
              </div>

              {/* Cup Image with Smooth Switch Animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBrew.id}
                  className="lux-cup-img-wrap"
                  initial={{ opacity: 0, scale: 0.92, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={activeBrew.image}
                    alt={activeBrew.name}
                    className="lux-cup-img"
                    loading="lazy"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* 3D Circular Golden Pedestal / Podium */}
            <motion.div
              className="lux-podium-structure"
              style={{ y: podiumY }}
            >
              {/* Top Mirrored Gold Disc */}
              <div className="lux-podium__top-plate">
                <div className="lux-podium__plate-reflection" />
              </div>

              {/* Middle Beveled Gold Rim with ambient halo */}
              <div className="lux-podium__bevel-rim">
                <div className="lux-podium__rim-glow" />
              </div>

              {/* Lower Tier Cylinder */}
              <div className="lux-podium__cylinder">
                {/* Dot Pagination Indicators on podium body */}
                <div className="lux-podium__dots" aria-label="Select Brew">
                  {SHOWCASE_BREWS.map((brew, idx) => (
                    <button
                      key={brew.id}
                      type="button"
                      className={`lux-dot ${selectedIdx === idx ? 'lux-dot--active' : ''}`}
                      onClick={() => setSelectedIdx(idx)}
                      aria-label={`Show ${brew.name}`}
                    />
                  ))}
                </div>

                {/* Centered Order Button pill on the podium */}
                <button
                  type="button"
                  className="lux-podium__order-pill"
                  onClick={() => onQuickAdd(activeBrew)}
                >
                  <span>Order Online</span>
                </button>
              </div>

              {/* Pedestal Base Drop Shadow & Amber Glow */}
              <div className="lux-podium__ground-shadow" aria-hidden="true" />
            </motion.div>
          </div>
        </div>

        {/* Right Column: Sensory Tasting Card */}
        <motion.div
          className="lux-showcase__col-right"
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="lux-profile-card">
            <div className="lux-profile-card__header">
              <Award size={18} className="lux-profile-card__icon" />
              <span>Sensory Tasting Card</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeBrew.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="lux-profile-card__content"
              >
                <div className="lux-note-row">
                  <span className="lux-note-label">Aromatic Notes</span>
                  <p className="lux-note-val">{activeBrew.notes}</p>
                </div>

                <div className="lux-note-row">
                  <span className="lux-note-label">Mouthfeel & Body</span>
                  <p className="lux-note-val">{activeBrew.body}</p>
                </div>

                <div className="lux-note-row">
                  <span className="lux-note-label">Crema Structure</span>
                  <p className="lux-note-val">{activeBrew.crema}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Interactive Brew Switcher Pills */}
            <div className="lux-brew-switcher">
              <span className="lux-switcher-label">Choose Selection:</span>
              <div className="lux-switcher-pills">
                {SHOWCASE_BREWS.map((b, idx) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`lux-pill-btn ${selectedIdx === idx ? 'lux-pill-btn--active' : ''}`}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <span>{b.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Realistic vector coffee bean with center slit and golden rim.
 */
function CoffeeBeanSvg({ size = 32 }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.35)}
      viewBox="0 0 32 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="coffee-bean-vector"
    >
      <defs>
        <linearGradient id="beanHullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3d2d1d" />
          <stop offset="45%" stopColor="#251a10" />
          <stop offset="100%" stopColor="#140e08" />
        </linearGradient>
        <linearGradient id="beanGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd142" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#c98a00" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path
        d="M16 2C8 2 2 9.5 2 22C2 34.5 8 42 16 42C24 42 30 34.5 30 22C30 9.5 24 2 16 2Z"
        fill="url(#beanHullGrad)"
        stroke="url(#beanGoldRim)"
        strokeWidth="1.6"
      />
      <path
        d="M16 6C18.8 13.5 13.2 18.5 16 22C18.8 25.5 13.2 30.5 16 38"
        stroke="#ffc928"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

export default LuxuryShowcaseSection;

