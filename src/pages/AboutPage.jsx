import React, { useEffect } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { CoffeeTransformation } from '../components/CoffeeTransformation';
import './AboutPage.css';

/**
 * AboutPage Component
 * Full-screen 3D Scroll-Driven Hero Section powered by Three.js & GSAP ScrollTrigger
 * followed by the BLACK & BREW Brand Philosophy Sanctuary statement.
 */
export function AboutPage({ onBackHome, onExploreMenu, onNavigate }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="about-editorial-page">
      {/* ====================================================================
          3D SCROLL-DRIVEN COFFEE TRANSFORMATION HERO SECTION
          ==================================================================== */}
      <CoffeeTransformation
        scrollDistance="+=320%"
        onExploreMenu={onExploreMenu}
      />

      {/* ====================================================================
          SUBSEQUENT ABOUT SECTION (Seamless transition with ZERO dead gaps)
          ==================================================================== */}
      <section className="about-statement-section" aria-label="Brand Philosophy Statement">
        <div className="about-statement__ambient-glow" aria-hidden="true" />
        <div className="container">
          <div className="about-statement__badge">
            <Compass size={14} className="about-gold-icon" />
            <span>THE OBSIDIAN STANDARD</span>
          </div>

          <blockquote className="about-statement__quote">
            “Coffee isn’t just fuel for the morning. It is a quiet sanctuary, a moment of presence, and a celebration of master craftsmanship.”
          </blockquote>

          <div className="about-statement__author">
            <span className="about-statement__author-name">BLACK &amp; BREW</span>
            <span className="about-statement__author-sub">Bengaluru Roastery &amp; Espresso Bar</span>
          </div>

          <div className="about-statement__actions">
            <button
              type="button"
              className="btn-gold"
              onClick={onExploreMenu}
            >
              <span>Explore Signature Menu</span>
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              className="btn-dark"
              onClick={onBackHome}
            >
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
