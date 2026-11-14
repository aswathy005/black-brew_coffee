import React, { useEffect, useRef, useState } from 'react';
import {
  MotionConfig,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
  motion,
} from 'framer-motion';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import {
  OrderModal,
  GalleryModal,
  VideoModal,
  StoryModal,
  LocationModal,
} from './components/Modals';
import { HeroAboutStage } from './sections/HeroAboutStage';
import { HeroSection } from './sections/HeroSection';
import { FeaturesBar } from './sections/FeaturesBar';
import { AboutSection } from './sections/AboutSection';
import { CardFanOutSection } from './sections/CardFanOutSection';
import { LuxuryShowcaseSection } from './sections/LuxuryShowcaseSection';
import { IcedSplashSection } from './sections/IcedSplashSection';
import { MenuSection } from './sections/MenuSection';
import { HorizontalGallery } from './sections/HorizontalGallery';
import { TestimonialSection } from './sections/TestimonialSection';
import { FaqSection } from './sections/FaqSection';
import { CtaBanner } from './sections/CtaBanner';
import { Marquee } from './components/Marquee';
import { AboutPage } from './pages/AboutPage';

export function App() {
  const lenisRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === '#about' || params.get('page') === 'about') {
        return 'about';
      }
    }
    return 'home';
  });
  const [activeSection, setActiveSection] = useState('home');
  const [activeModal, setActiveModal] = useState(null); // 'order' | 'gallery' | 'video' | 'story' | 'location' | null
  const [cart, setCart] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync currentPage with URL hash (#about or #home)
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === '#about' || params.get('page') === 'about') {
        setCurrentPage('about');
      } else if (hash === '#home' || hash === '') {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  // Recalculate GSAP ScrollTrigger pin spacers after page transition
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 450);
    return () => clearTimeout(timer);
  }, [currentPage]);

  // Global Page Scroll Progress for top beam and floating scroll-to-top
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  // Track scroll position to reveal the floating scroll-to-top button
  useEffect(() => {
    const unsub = scrollY.on('change', (latest) => {
      setShowScrollTop(latest > 350);
    });
    return () => unsub();
  }, [scrollY]);

  // Subtle Parallax on ambient background wave
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, -180]);

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
      touchMultiplier: 1.25,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Track visible section for active nav pill
  useEffect(() => {
    const sectionIds = ['home', 'about', 'fanout-section', 'luxury-showcase', 'iced-splash', 'menu', 'gallery-section', 'reviews', 'faq', 'contact'];
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

  const handleNavigate = (target, isPage = false) => {
    if (isPage) {
      if (target === 'about') {
        setCurrentPage('about');
        window.location.hash = 'about';
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      } else if (target === 'home') {
        setCurrentPage('home');
        window.location.hash = 'home';
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }
      return;
    }

    if (currentPage !== 'home') {
      setCurrentPage('home');
      window.location.hash = 'home';
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      setTimeout(() => {
        scrollToSection(target);
      }, 70);
      return;
    }

    scrollToSection(target);
  };

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {/* Pinned Top Coffee-Brown Scroll Progress Beam */}
        <motion.div
          className="scroll-progress-beam"
          style={{ scaleX }}
          aria-hidden="true"
        />

        {/* Ambient Golden Wave Backdrop with Scroll Parallax */}
        <div className="ambient-backdrop" aria-hidden="true">
          <motion.svg
            className="ambient-wave-svg"
            style={{ y: backdropY }}
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
          </motion.svg>
        </div>

        <Navbar
          activeSection={activeSection}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenGallery={() => setActiveModal('gallery')}
          onOpenOrder={() => setActiveModal('order')}
          cartCount={cartCount}
        />

        <main>
          <AnimatePresence mode="wait">
            {currentPage === 'home' ? (
              <motion.div
                key="page-home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Hero Stage: Cinematic Background Video across Hero & Promises */}
                <HeroAboutStage>
                  <HeroSection
                    onExploreMenu={() => scrollToSection('menu')}
                    onWatchVideo={() => setActiveModal('video')}
                    onScrollDown={() => scrollToSection('about')}
                  />

                  <FeaturesBar />
                </HeroAboutStage>

                {/* Infinite Typography Marquee Ticker */}
                <Marquee speed={28} />

                {/* Our Story Section: Pure Dark Background + Scroll Falling Coffee Beans */}
                <AboutSection onOpenStory={() => handleNavigate('about', true)} />

                <CardFanOutSection
                  onQuickAdd={handleQuickAdd}
                />

                <LuxuryShowcaseSection onQuickAdd={handleQuickAdd} />

                <IcedSplashSection
                  onQuickAdd={handleQuickAdd}
                  onExploreMenu={() => scrollToSection('menu')}
                />

                <MenuSection
                  onViewFullMenu={() => setActiveModal('order')}
                  onQuickAdd={handleQuickAdd}
                />

                <HorizontalGallery onOpenGalleryModal={() => setActiveModal('gallery')} />

                <TestimonialSection />

                <FaqSection onOpenOrder={() => setActiveModal('order')} />

                <CtaBanner onFindLocation={() => setActiveModal('location')} />
              </motion.div>
            ) : (
              <motion.div
                key="page-about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <AboutPage
                  onNavigateHome={(target) => handleNavigate(target || 'home', true)}
                  onBackHome={() => handleNavigate('home', true)}
                  onExploreMenu={() => handleNavigate('menu', false)}
                  onNavigate={handleNavigate}
                  onOpenGallery={() => setActiveModal('gallery')}
                  onOpenOrder={() => setActiveModal('order')}
                  onOpenLocation={() => setActiveModal('location')}
                  cartCount={cartCount}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Footer
          onNavigate={handleNavigate}
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

        {/* Floating Scroll to Top Button with Circular Progress Ring */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              type="button"
              className="scroll-top-btn"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 20 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Scroll to top of page"
            >
              <svg className="scroll-top-progress" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" className="scroll-top-track" />
                <motion.circle
                  cx="22"
                  cy="22"
                  r="18"
                  className="scroll-top-fill"
                  style={{ pathLength: scrollYProgress }}
                />
              </svg>
              <ArrowUp size={16} className="scroll-top-icon" strokeWidth={2.4} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

export default App;
