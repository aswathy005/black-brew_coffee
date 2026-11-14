import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { Reveal } from '../components/animations/Reveal';
import './CtaBanner.css';

export function CtaBanner({ onFindLocation }) {
  const bannerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ['start end', 'center center'],
  });
  const bannerScale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const bannerY = useTransform(scrollYProgress, [0, 1], [26, 0]);

  return (
    <section ref={bannerRef} className="cta-section" aria-label="Visit BLACK & BREW">
      <div className="container">
        <motion.div
          className="cta-banner"
          style={{ scale: bannerScale, y: bannerY }}
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="cta-banner__shine" aria-hidden="true" />

          <div className="cta-banner__copy">
            <Reveal delay={0.06}>
              <h2 className="cta-banner__title">Ready for a Coffee Break?</h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="cta-banner__desc">
                Visit us today and experience the BLACK &amp; BREW vibe!
              </p>
            </Reveal>
          </div>

          <div className="cta-banner__action">
            <Reveal delay={0.22}>
              <button type="button" className="btn-dark" onClick={onFindLocation}>
                <MapPin size={17} className="cta-banner__pin" />
                <span>Find Our Location</span>
                <ArrowRight size={17} className="btn-arrow" />
              </button>
            </Reveal>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CtaBanner;

