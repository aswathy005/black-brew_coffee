import React from 'react';
import { Sparkles, Flame, Coffee } from 'lucide-react';
import './Marquee.css';

const MARQUEE_ITEMS = [
  { text: 'FRESHLY BREWED', highlight: false },
  { text: 'PREMIUM COFFEE', highlight: true },
  { text: 'MADE WITH PASSION', highlight: false },
  { text: 'CRAFTED FOR YOU', highlight: true },
  { text: '100% SINGLE ORIGIN', highlight: false },
  { text: 'BLACK & BREW', highlight: true },
  { text: 'ARTISANAL ROAST', highlight: false },
  { text: 'EST. 2018', highlight: true },
];

export function Marquee({ speed = 28, reverse = false, className = '' }) {
  // We duplicate the items 3 times to ensure a completely seamless continuous infinite loop
  const repeatedItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section className={`brand-marquee-section ${className}`} aria-label="Brand Highlights Ticker">
      <div className="brand-marquee__track-wrapper">
        <div
          className={`brand-marquee__track ${reverse ? 'brand-marquee__track--reverse' : ''}`}
          style={{ animationDuration: `${speed}s` }}
        >
          {repeatedItems.map((item, index) => (
            <div key={`marquee-item-1-${index}`} className="brand-marquee__item">
              <span
                className={`brand-marquee__text ${
                  item.highlight ? 'brand-marquee__text--gold' : 'brand-marquee__text--outline'
                }`}
              >
                {item.text}
              </span>
              <span className="brand-marquee__separator" aria-hidden="true">
                <Sparkles size={13} className="brand-marquee__star" />
              </span>
            </div>
          ))}
        </div>

        {/* Duplicate track for seamless infinite loop */}
        <div
          className={`brand-marquee__track ${reverse ? 'brand-marquee__track--reverse' : ''}`}
          aria-hidden="true"
          style={{ animationDuration: `${speed}s` }}
        >
          {repeatedItems.map((item, index) => (
            <div key={`marquee-item-2-${index}`} className="brand-marquee__item">
              <span
                className={`brand-marquee__text ${
                  item.highlight ? 'brand-marquee__text--gold' : 'brand-marquee__text--outline'
                }`}
              >
                {item.text}
              </span>
              <span className="brand-marquee__separator" aria-hidden="true">
                <Sparkles size={13} className="brand-marquee__star" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Marquee;

