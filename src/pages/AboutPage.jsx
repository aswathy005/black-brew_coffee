import React, { useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { CoffeeStory3D } from '../components/about/CoffeeStory3D';
import './AboutPage.css';

/**
 * AboutPage Component
 * Standalone 3D Storytelling Experience for BLACK & BREW
 * Features:
 *  (A) Pinned Full-Screen 3D Fly-Through Coffee Transformation Tunnel (CoffeeStory3D)
 *  (B) Brand Statement Section & 3 Pillars of Craft
 */
export function AboutPage({
  onNavigateHome,
  onBackHome,
  onExploreMenu,
  onNavigate,
}) {
  // Ensure the page always starts at the top when mounted or hash synced
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleReturnHome = () => {
    if (onNavigateHome) {
      onNavigateHome('home');
    } else if (onBackHome) {
      onBackHome();
    } else if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExplore = () => {
    if (onExploreMenu) {
      onExploreMenu();
    } else if (onNavigate) {
      onNavigate('menu');
    } else {
      window.location.hash = '#menu';
    }
  };

  return (
    <div className="about-page">
      {/* ====================================================================
          (A) PINNED 3D COFFEE TRANSFORMATION STORY SECTION
          ==================================================================== */}
      <CoffeeStory3D
        scrollDistance="+=600%"
        onExploreReserve={handleExplore}
      />

      {/* ====================================================================
          (B) BRAND STATEMENT & CRAFT PHILOSOPHY SECTION
          ==================================================================== */}
      <section className="about-brand" id="brand-statement">
        <div className="container">
          <div className="about-brand__header">
            <span className="about-brand__eyebrow">The BLACK &amp; BREW Philosophy</span>
            <h2 className="about-brand__title">
              Crafted for the
              <span className="about-brand__title-gold">Obsessed.</span>
            </h2>
            <p className="about-brand__lead">
              Every cup is an intentional journey. From high-altitude volcanic soils to
              state-of-the-art 9-bar extraction, we honor the alchemy of coffee making.
            </p>
            <p className="about-brand__desc">
              Founded with a purist’s dedication, BLACK &amp; BREW bridges single-origin craftsmanship
              with contemporary hospitality. We roast each micro-lot in small batches, calibrating burr
              tolerances and water chemistry daily to reveal notes of deep roasted cocoa, caramelized
              honey, and velvety citrus crema.
            </p>
          </div>

          {/* 3 Pillars of Craft */}
          <div className="about-brand__pillars">
            <div className="about-pillar-card">
              <span className="about-pillar-card__num">01 / HIGHLAND HARVEST</span>
              <h3 className="about-pillar-card__title">Single-Origin Arabica</h3>
              <p className="about-pillar-card__desc">
                Sourced exclusively above 1,800m altitude from shade-grown estates. Hand-picked at
                deep burgundy maturity for maximum sugar density and clarity of terroir.
              </p>
            </div>

            <div className="about-pillar-card">
              <span className="about-pillar-card__num">02 / THERMAL ROASTING</span>
              <h3 className="about-pillar-card__title">Precision Burr Milling</h3>
              <p className="about-pillar-card__desc">
                Flat ceramic burrs engineered to sub-micron tolerances ensure perfectly uniform
                particle geometry, preventing channeling and maximizing aromatic extraction.
              </p>
            </div>

            <div className="about-pillar-card">
              <span className="about-pillar-card__num">03 / 9-BAR EXTRACTION</span>
              <h3 className="about-pillar-card__title">The Golden Crema</h3>
              <p className="about-pillar-card__desc">
                Infused at 93.5°C under rigorous 9-bar pressure. The result is a viscous, honey-like
                stream crowned with dense, golden-flecked crema that lingers on the palate.
              </p>
            </div>
          </div>

          {/* Two Action Buttons */}
          <div className="about-brand__actions">
            <button
              type="button"
              className="btn-gold"
              onClick={handleExplore}
              aria-label="Explore Signature Menu"
            >
              <span>Explore Signature Menu</span>
              <ArrowRight size={17} className="btn-arrow" strokeWidth={2.4} />
            </button>

            <button
              type="button"
              className="about-brand__btn-home"
              onClick={handleReturnHome}
              aria-label="Return to Home"
            >
              <ArrowLeft size={17} className="btn-arrow-left" strokeWidth={2.4} />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export const AboutSection = AboutPage;
export default AboutPage;
