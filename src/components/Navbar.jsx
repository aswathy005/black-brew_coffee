import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', type: 'page' },
  { id: 'menu', label: 'Menu', type: 'scroll' },
  { id: 'about', label: 'About', type: 'page' },
  { id: 'gallery', label: 'Gallery', type: 'modal' },
  { id: 'reviews', label: 'Reviews', type: 'scroll' },
  { id: 'contact', label: 'Contact', type: 'scroll' },
];

export function Navbar({
  activeSection,
  currentPage = 'home',
  onNavigate,
  onOpenGallery,
  onOpenOrder,
  cartCount,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const lastScrollY = useRef(0);
  const isScrolledRef = useRef(false);
  const isHiddenRef = useRef(false);
  const mobileOpenRef = useRef(mobileOpen);
  mobileOpenRef.current = mobileOpen;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolled = currentScrollY > 20;

      // Only update state when value actually changes to prevent unnecessary re-renders
      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;
        setIsScrolled(scrolled);
      }

      // Hide on scroll down past 100px, show on scroll up
      // If mobile menu is open, do not hide navbar
      if (!mobileOpenRef.current) {
        const prevScrollY = lastScrollY.current;
        if (currentScrollY > 100 && currentScrollY > prevScrollY) {
          if (!isHiddenRef.current) {
            isHiddenRef.current = true;
            setIsHidden(true);
          }
        } else if (currentScrollY < prevScrollY) {
          if (isHiddenRef.current) {
            isHiddenRef.current = false;
            setIsHidden(false);
          }
        }
      }

      lastScrollY.current = currentScrollY;
    };

    // Run check once on mount in case page loads already scrolled
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
    if (item.type === 'page') {
      onNavigate(item.id, true);
      return;
    }
    onNavigate(item.id, false);
  };

  // Determine state classes for styling
  const scrolledClass = isScrolled || mobileOpen ? 'navbar--scrolled' : '';
  const hiddenClass = isHidden && !mobileOpen ? 'navbar--hidden' : '';
  const menuOpenClass = mobileOpen ? 'navbar--menu-open' : '';

  return (
    <header
      className={`navbar ${scrolledClass} ${hiddenClass} ${menuOpenClass}`}
    >
      <div className="container navbar__inner">
        <BrandLogo
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home', true);
          }}
        />

        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentPage === 'about'
                ? item.id === 'about'
                : activeSection === item.id;
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
              {NAV_ITEMS.map((item) => {
                const isMobileActive =
                  currentPage === 'about'
                    ? item.id === 'about'
                    : activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleLinkClick(e, item)}
                    className={`navbar__mobile-link ${
                      isMobileActive ? 'navbar__mobile-link--active' : ''
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={15} opacity={0.7} />
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
