import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import heroCoffeeImg from '../assets/images/hero-coffee.jpg';
import './AboutSection.css';

export function AboutSection({ onOpenStory }) {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about__grid">
          {/* Left Coffee Showcase (Hero cup placed seamlessly without yellow box) */}
          <motion.div
            className="about__media"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="about__ambient-glow hero-glow-pulse" aria-hidden="true" />

            <motion.div
              className="about__cup-float"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Realistic CSS Animated Steam */}
              <div className="steam-wrapper about__steam" aria-hidden="true">
                <span className="steam-wisp steam-wisp--1" />
                <span className="steam-wisp steam-wisp--2" />
                <span className="steam-wisp steam-wisp--3" />
                <span className="steam-wisp steam-wisp--4" />
              </div>

              <img
                src={heroCoffeeImg}
                alt="BLACK & BREW signature espresso cup with rosetta latte art, splash, and floating coffee beans"
                className="about__cup-image"
              />
            </motion.div>

            {/* Decorative Sparkles near Since Badge */}
            <svg
              className="about__sparkles"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M12 24L4 17" stroke="#FFC928" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M22 15L19 5" stroke="#FFC928" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M32 19L39 11" stroke="#FFC928" strokeWidth="2.2" strokeLinecap="round" />
            </svg>

            <motion.div
              className="about__since-badge"
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

          {/* Center Editorial Copy */}
          <motion.div
            className="about__content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.28 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.08,
                },
              },
            }}
          >
            <motion.div
              className="section-eyebrow"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <span className="eyebrow-underline">About</span> BLACK &amp; BREW
            </motion.div>

            <motion.h2
              className="about__heading"
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.64, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              More Than Just Coffee
            </motion.h2>

            <motion.p
              className="about__desc"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              BLACK &amp; BREW is where great coffee meets good vibes. Founded with a passion for
              coffee and community, we bring you the perfect blend of taste, comfort and positivity.
            </motion.p>

            <motion.div
              style={{ display: 'inline-flex' }}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <button type="button" className="btn-gold" onClick={onOpenStory}>
                <span>Our Story</span>
                <ArrowRight size={17} className="btn-arrow" strokeWidth={2.4} />
              </button>
            </motion.div>
          </motion.div>

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
              <path
                d="M6 15C44 4 102 2 144 9"
                stroke="#FFC928"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
