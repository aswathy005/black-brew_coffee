import React, { useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { HeroAboutStage } from './components/HeroAboutStage';
import { HeroSection } from './components/HeroSection';
import { FeaturesBar } from './components/FeaturesBar';
import { AboutSection } from './components/AboutSection';
import { MenuSection } from './components/MenuSection';
import { TestimonialSection } from './components/TestimonialSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import {
  OrderModal,
  GalleryModal,
  VideoModal,
  StoryModal,
  LocationModal,
} from './components/Modals';

export function App() {
  const lenisRef = useRef(null);
  const [activeSection, setActiveSection] = useState('home');
  const [activeModal, setActiveModal] = useState(null); // 'order' | 'gallery' | 'video' | 'story' | 'location' | null
  const [cart, setCart] = useState({});

  // Lenis Smooth Page Scrolling (respects prefers-reduced-motion)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Track visible section for active nav pill
  useEffect(() => {
    const sectionIds = ['home', 'about', 'menu', 'reviews', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      let current = 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= scrollPos) {
            current = id;
          }
        }
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        current = 'contact';
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -74 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateCart = (itemId, delta) => {
    setCart((prev) => {
      const nextQty = Math.max(0, (prev[itemId] || 0) + delta);
      const next = { ...prev };
      if (nextQty === 0) {
        delete next[itemId];
      } else {
        next[itemId] = nextQty;
      }
      return next;
    });
  };

  const handleQuickAdd = (item) => {
    handleUpdateCart(item.id, 1);
    setActiveModal('order');
  };

  const cartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  return (
    <MotionConfig reducedMotion="user">
      <div className="page-wrapper">
      {/* Subtle Ambient Golden Wave Backdrop */}
      <div className="ambient-backdrop" aria-hidden="true">
        <svg
          className="ambient-wave-svg"
          viewBox="0 0 1440 1800"
          fill="none"
          preserveAspectRatio="xMidYMin slice"
        >
          <defs>
            <linearGradient id="goldWave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFC928" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFC928" stopOpacity="0.13" />
              <stop offset="100%" stopColor="#FFC928" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="goldWave2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFC928" stopOpacity="0" />
              <stop offset="45%" stopColor="#FFC928" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFC928" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M-120 420C240 560 560 300 940 430C1220 525 1380 410 1560 340"
            stroke="url(#goldWave1)"
            strokeWidth="2.2"
          />
          <path
            d="M-80 1040C340 910 720 1160 1160 990C1320 930 1460 980 1560 1050"
            stroke="url(#goldWave2)"
            strokeWidth="1.8"
          />
          <path
            d="M-100 1480C310 1380 780 1600 1520 1420"
            stroke="url(#goldWave1)"
            strokeWidth="1.6"
          />
        </svg>
      </div>

      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenGallery={() => setActiveModal('gallery')}
        onOpenOrder={() => setActiveModal('order')}
        cartCount={cartCount}
      />

      <main>
        <HeroAboutStage>
          <HeroSection
            onExploreMenu={() => scrollToSection('menu')}
            onWatchVideo={() => setActiveModal('video')}
            onScrollDown={() => scrollToSection('about')}
          />

          <FeaturesBar />

          <AboutSection onOpenStory={() => setActiveModal('story')} />
        </HeroAboutStage>

        <MenuSection
          onViewFullMenu={() => setActiveModal('order')}
          onQuickAdd={handleQuickAdd}
        />

        <TestimonialSection />

        <CtaBanner onFindLocation={() => setActiveModal('location')} />
      </main>

      <Footer
        onNavigate={scrollToSection}
        onOpenGallery={() => setActiveModal('gallery')}
        onOpenLocation={() => setActiveModal('location')}
      />

      {/* Interactive Modals */}
      <OrderModal
        isOpen={activeModal === 'order'}
        onClose={() => setActiveModal(null)}
        cart={cart}
        onUpdateCart={handleUpdateCart}
        onClearCart={() => setCart({})}
      />
      <GalleryModal
        isOpen={activeModal === 'gallery'}
        onClose={() => setActiveModal(null)}
      />
      <VideoModal
        isOpen={activeModal === 'video'}
        onClose={() => setActiveModal(null)}
      />
      <StoryModal
        isOpen={activeModal === 'story'}
        onClose={() => setActiveModal(null)}
        onExploreMenu={() => scrollToSection('menu')}
      />
      <LocationModal
        isOpen={activeModal === 'location'}
        onClose={() => setActiveModal(null)}
      />
    </div>
    </MotionConfig>
  );
}

export default App;

