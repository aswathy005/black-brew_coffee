import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', type: 'scroll' },
  { id: 'menu', label: 'Menu', type: 'scroll' },
  { id: 'about', label: 'About', type: 'scroll' },
  { id: 'gallery', label: 'Gallery', type: 'modal' },
  { id: 'reviews', label: 'Reviews', type: 'scroll' },
  { id: 'contact', label: 'Contact', type: 'scroll' },
];

export function Navbar({ activeSection, onNavigate, onOpenGallery, onOpenOrder, cartCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, item) => {
    e.preventDefault();
    setMobileOpen(false);
    if (item.type === 'modal') {
      onOpenGallery();
      return;
    }
    onNavigate(item.id);
  };

  return (
    <motion.header
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container navbar__inner">
        <BrandLogo
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
        />

        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item)}
                className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="navbar__active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="btn-gold navbar__order-btn"
            onClick={onOpenOrder}
            aria-label="Order Now"
          >
            <span className="navbar__cart-wrap">
              <ShoppingCart size={16} strokeWidth={2.3} />
              {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
            </span>
            <span className="navbar__order-label">Order Now</span>
            <ArrowRight size={16} className="btn-arrow" strokeWidth={2.4} />
          </button>

          <button
            type="button"
            className="navbar__mobile-toggle"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="navbar__mobile-list">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, item)}
                  className={`navbar__mobile-link ${
                    activeSection === item.id ? 'navbar__mobile-link--active' : ''
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight size={15} opacity={0.7} />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

