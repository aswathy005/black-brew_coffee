import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import './CoffeeStorytellingSection.css';

// Project authentic coffee photography assets
import aboutBeansImg from '../assets/images/about-beans.jpg';
import espressoExtractionImg from '../assets/images/espresso-extraction.jpg';
import latteArtPourImg from '../assets/images/latte-art-pour.jpg';
import coffeeBrewingImg from '../assets/images/coffee-brewing.jpg';
import heroCoffeeImg from '../assets/images/hero-coffee.jpg';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SCENES = [
  {
    id: 'scene-1',
    number: '01',
    tag: 'ORIGIN & SELECTION',
    heading: 'Every Bean Has a Story',
    caption: 'Single-origin heirloom Arabica cultivated at 1,850m elevation in rich volcanic soil, hand-sorted at peak ripeness.',
    accent: 'Heirloom Bourbon',
    image: aboutBeansImg,
  },
  {
    id: 'scene-2',
    number: '02',
    tag: 'EXTRACTION PRECISION',
    heading: 'Crafted to Perfection',
    caption: 'Saturated 93°C water pulled under 9-bar hydraulic pressure, yielding dense golden tiger-striped crema.',
    accent: '9-Bar Lever Pull',
    image: espressoExtractionImg,
  },
  {
    id: 'scene-3',
    number: '03',
    tag: 'BARISTA CRAFT',
    heading: 'Made with Passion',
    caption: 'Master baristas texturing whole organic milk to micro-silky 65°C perfection, poured with freehand rosetta art.',
    accent: 'Velvet Microfoam',
    image: latteArtPourImg,
  },
  {
    id: 'scene-4',
    number: '04',
    tag: 'BREWING RITUAL',
    heading: 'Experience the Art of Coffee',
    caption: 'Slow-drip extraction unlocking subtle aromatics of wild jasmine honey, dark cacao, and toasted hazelnut.',
    accent: 'Slow Bar Alchemy',
    image: coffeeBrewingImg,
  },
  {
    id: 'scene-5',
    number: '05',
    tag: 'SIGNATURE MOMENT',
    heading: 'Your Perfect Coffee Moment',
    caption: 'The pinnacle of our craft—served in custom pre-warmed obsidian ceramics for an unforgettable tasting journey.',
    accent: 'The Obsidian Standard',
    image: heroCoffeeImg,
  },
];

export function CoffeeStorytellingSection({ onBackHome, onExploreMenu } = {}) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const progressBarRef = useRef(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray('.coffee-story__slide');
      const textCards = gsap.utils.toArray('.coffee-story__text-group');
      const dots = gsap.utils.toArray('.coffee-story__dot');

      // Initialize all slides except the first one
      slides.forEach((slide, i) => {
        if (i !== 0) {
          gsap.set(slide, { opacity: 0, scale: prefersReducedMotion ? 1 : 1.12 });
        } else {
          gsap.set(slide, { opacity: 1, scale: 1 });
        }
      });

      // Initialize all text cards except the first one
      textCards.forEach((card, i) => {
        if (i !== 0) {
          gsap.set(card, { opacity: 0, y: prefersReducedMotion ? 0 : 35, pointerEvents: 'none' });
        } else {
          gsap.set(card, { opacity: 1, y: 0, pointerEvents: 'auto' });
        }
      });

      // Master Pinned Scrub Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=320%',
          pin: stage,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update the top progress bar
            if (progressBarRef.current) {
              gsap.set(progressBarRef.current, { scaleX: self.progress });
            }
            // Update active dot index
            const step = Math.min(
              SCENES.length - 1,
              Math.floor(self.progress * SCENES.length)
            );
            setActiveSceneIndex(step);
          },
        },
      });

      // Animate transitions between 5 scenes
      // Total duration = 4 transitions
      const stepDuration = 1;

      for (let i = 0; i < SCENES.length - 1; i++) {
        const currentSlide = slides[i];
        const nextSlide = slides[i + 1];
        const currentText = textCards[i];
        const nextText = textCards[i + 1];

        const transitionLabel = `step-${i}`;
        tl.addLabel(transitionLabel);

        // 1. Text transition: fade out current, fade in next
        tl.to(
          currentText,
          {
            opacity: 0,
            y: prefersReducedMotion ? 0 : -35,
            duration: stepDuration * 0.45,
            ease: 'power2.in',
            pointerEvents: 'none',
          },
          transitionLabel
        );

        // 2. Image crossfade + gentle camera zoom
        tl.to(
          currentSlide,
          {
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 1.08,
            duration: stepDuration * 0.75,
            ease: 'power2.inOut',
          },
          transitionLabel
        );

        tl.fromTo(
          nextSlide,
          {
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 1.15,
          },
          {
            opacity: 1,
            scale: 1,
            duration: stepDuration * 0.75,
            ease: 'power2.inOut',
          },
          `${transitionLabel}+=0.15`
        );

        tl.fromTo(
          nextText,
          {
            opacity: 0,
            y: prefersReducedMotion ? 0 : 40,
            pointerEvents: 'none',
          },
          {
            opacity: 1,
            y: 0,
            duration: stepDuration * 0.55,
            ease: 'power2.out',
            pointerEvents: 'auto',
          },
          `${transitionLabel}+=0.35`
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="storytelling-section"
      className="coffee-story"
      aria-label="The Journey of Coffee Storytelling"
    >
      <div ref={stageRef} className="coffee-story__stage">
        {/* Pinned Timeline Progress Line */}
        <div className="coffee-story__progress-track" aria-hidden="true">
          <div ref={progressBarRef} className="coffee-story__progress-fill" />
        </div>

        {/* Background Visual Layers (5 Fullscreen Cinematic Scenes) */}
        <div className="coffee-story__media-container">
          {SCENES.map((scene, index) => (
            <div
              key={scene.id}
              className={`coffee-story__slide coffee-story__slide--${index}`}
              aria-hidden={activeSceneIndex !== index}
            >
              <img
                src={scene.image}
                alt={scene.heading}
                className="coffee-story__img"
                loading={index === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
              <div className="coffee-story__vignette" />
              <div className="coffee-story__warm-glow" />
            </div>
          ))}
        </div>

        {/* Ambient Darkened Readability Scrim Overlay */}
        <div className="coffee-story__scrim" aria-hidden="true" />

        {/* Foreground Content Shell */}
        <div className="container coffee-story__content-wrapper">
          <div className="coffee-story__layout">
            {/* Left: Step Indicators / Chapter Pill */}
            <div className="coffee-story__sidebar">
              <div className="coffee-story__chapter-badge">
                <Sparkles size={13} className="coffee-story__badge-sparkle" />
                <span>CRAFT STORY</span>
              </div>

              <div className="coffee-story__step-dots" role="tablist" aria-label="Story chapters">
                {SCENES.map((scene, idx) => (
                  <div
                    key={`dot-${scene.id}`}
                    className={`coffee-story__dot ${
                      activeSceneIndex === idx ? 'coffee-story__dot--active' : ''
                    }`}
                  >
                    <span className="coffee-story__dot-pill" />
                    <span className="coffee-story__dot-label">
                      {scene.number} · {scene.accent}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Center-Right: Text Carousel with Synchronized Scroll Fade & Lift */}
            <div className="coffee-story__text-stage">
              {SCENES.map((scene, idx) => (
                <div
                  key={`text-${scene.id}`}
                  className="coffee-story__text-group"
                  aria-hidden={activeSceneIndex !== idx}
                >
                  <div className="coffee-story__eyebrow">
                    <span className="coffee-story__eyebrow-num">{scene.number}</span>
                    <span className="coffee-story__eyebrow-sep">/</span>
                    <span className="coffee-story__eyebrow-tag">{scene.tag}</span>
                  </div>

                  <h2 className="coffee-story__heading">
                    {scene.heading}
                  </h2>

                  <p className="coffee-story__caption">
                    {scene.caption}
                  </p>

                  <div className="coffee-story__accent-bar">
                    <span className="coffee-story__accent-text">{scene.accent}</span>
                  </div>

                  {idx === 4 && (onExploreMenu || onBackHome) && (
                    <div className="coffee-story__cta-row">
                      {onExploreMenu && (
                        <button
                          type="button"
                          className="btn-gold"
                          onClick={onExploreMenu}
                        >
                          <span>Explore Menu</span>
                          <ArrowRight size={15} />
                        </button>
                      )}
                      {onBackHome && (
                        <button
                          type="button"
                          className="btn-dark"
                          onClick={onBackHome}
                        >
                          <span>Return Home</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subtle Bottom Scroll Hint */}
        <div className="coffee-story__scroll-prompt" aria-hidden="true">
          <span>Scroll to Experience The Craft</span>
          <ChevronDown size={14} className="coffee-story__prompt-chevron" />
        </div>
      </div>
    </section>
  );
}

export default CoffeeStorytellingSection;

