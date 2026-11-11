import React from 'react';
import { Instagram, Facebook, Youtube, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CAFE_INFO } from '../data/coffeeData';
import './Footer.css';

const FOOTER_LINKS = [
  { id: 'home', label: 'Home', type: 'scroll' },
  { id: 'menu', label: 'Menu', type: 'scroll' },
  { id: 'about', label: 'About', type: 'scroll' },
  { id: 'gallery', label: 'Gallery', type: 'modal' },
  { id: 'reviews', label: 'Reviews', type: 'scroll' },
  { id: 'contact', label: 'Contact', type: 'location' },
];

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer({ onNavigate, onOpenGallery, onOpenLocation }) {
  const handleLinkClick = (e, item) => {
    e.preventDefault();
    if (item.type === 'modal') {
      onOpenGallery();
    } else if (item.type === 'location') {
      onOpenLocation();
    } else {
      onNavigate(item.id);
    }
  };

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer__main">
          <BrandLogo
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
          />

          <nav className="footer__links" aria-label="Footer navigation">
            {FOOTER_LINKS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item)}
                className="footer__link"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="footer__socials" aria-label="Social media">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="footer__social-btn"
              aria-label="BLACK & BREW on Instagram"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="footer__social-btn"
              aria-label="BLACK & BREW on Facebook"
            >
              <Facebook size={15} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="footer__social-btn"
              aria-label="BLACK & BREW on YouTube"
            >
              <Youtube size={15} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="footer__social-btn"
              aria-label="BLACK & BREW on X"
            >
              <XIcon />
            </a>
          </div>

          <p className="footer__copy">© 2026 BLACK &amp; BREW. All rights reserved.</p>
        </div>

        <div className="footer__meta">
          <button
            type="button"
            className="footer__meta-item footer__meta-link"
            onClick={onOpenLocation}
          >
            <MapPin size={14} className="footer__meta-icon" />
            <span>{CAFE_INFO.address}</span>
          </button>

          <div className="footer__meta-item">
            <Clock size={14} className="footer__meta-icon" />
            <span>{CAFE_INFO.hours}</span>
          </div>

          <a href={`tel:${CAFE_INFO.phone}`} className="footer__meta-item footer__meta-link">
            <Phone size={14} className="footer__meta-icon" />
            <span>{CAFE_INFO.phone}</span>
          </a>

          <a href={`mailto:${CAFE_INFO.email}`} className="footer__meta-item footer__meta-link">
            <Mail size={14} className="footer__meta-icon" />
            <span>{CAFE_INFO.email}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

