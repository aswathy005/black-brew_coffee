import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import './CtaBanner.css';

export function CtaBanner({ onFindLocation }) {
  return (
    <section className="cta-section" aria-label="Visit BLACK & BREW">
      <div className="container">
        <motion.div
          className="cta-banner"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="cta-banner__shine" aria-hidden="true" />

          <div className="cta-banner__copy">
            <h2 className="cta-banner__title">Ready for a Coffee Break?</h2>
            <p className="cta-banner__desc">
              Visit us today and experience the BLACK &amp; BREW vibe!
            </p>
          </div>

          <div className="cta-banner__action">
            <button type="button" className="btn-dark" onClick={onFindLocation}>
              <MapPin size={17} className="cta-banner__pin" />
              <span>Find Our Location</span>
              <ArrowRight size={17} className="btn-arrow" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

