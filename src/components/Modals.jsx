import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { FULL_MENU_ITEMS, GALLERY_PHOTOS, CAFE_INFO } from '../data/coffeeData';
import heroCoffeeImg from '../assets/images/hero-coffee.jpg';
import './Modals.css';

function ModalShell({ isOpen, onClose, titleId, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <motion.div
            className="modal-panel"
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OrderModal({ isOpen, onClose, cart, onUpdateCart, onClearCart }) {
  const [category, setCategory] = useState('All');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const categories = ['All', 'Hot Classics', 'Cold Classics', 'Signature Lattes'];
  const filtered =
    category === 'All'
      ? FULL_MENU_ITEMS
      : FULL_MENU_ITEMS.filter((item) => item.category === category);

  const totalItems = Object.values(cart).reduce((acc, q) => acc + q, 0);
  const totalAmount = FULL_MENU_ITEMS.reduce(
    (sum, item) => sum + (cart[item.id] || 0) * item.price,
    0
  );

  const handleCheckout = () => {
    if (totalItems === 0) return;
    setOrderPlaced(true);
    setTimeout(() => {
      onClearCart();
      setOrderPlaced(false);
      onClose();
    }, 2400);
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleId="order-modal-title">
      <div className="modal-header">
        <p className="modal-eyebrow">BLACK &amp; BREW Menu</p>
        <h2 id="order-modal-title" className="modal-title">
          Crafted Fresh to Order
        </h2>
        <p className="modal-subtitle">
          Select your favorite pours for express pickup at our Indiranagar bar.
        </p>
      </div>

      {orderPlaced ? (
        <div
          style={{
            textAlign: 'center',
            padding: '44px 20px',
            border: '1px solid rgba(255, 201, 40, 0.3)',
            borderRadius: '18px',
            background: 'rgba(255, 201, 40, 0.06)',
          }}
        >
          <CheckCircle2 size={46} color="#FFC928" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>Order Sent to the Bar!</h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.94rem' }}>
            Your fresh {totalItems} {totalItems === 1 ? 'drink is' : 'drinks are'} being crafted
            now. Ready in ~8 minutes.
          </p>
        </div>
      ) : (
        <>
          <div className="menu-modal__tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`menu-modal__tab ${
                  category === cat ? 'menu-modal__tab--active' : ''
                }`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="menu-modal__grid">
            {filtered.map((item) => {
              const qty = cart[item.id] || 0;
              return (
                <div key={item.id} className="menu-modal__item">
                  <img src={item.image} alt={item.name} className="menu-modal__thumb" />
                  <div className="menu-modal__info">
                    <h3 className="menu-modal__name">{item.name}</h3>
                    <p className="menu-modal__desc">{item.description}</p>
                    <div className="menu-modal__bottom">
                      <span className="menu-modal__price">₹{item.price}</span>
                      <div className="qty-control">
                        <button
                          type="button"
                          onClick={() => onUpdateCart(item.id, -1)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Minus size={13} />
                        </button>
                        <span>{qty}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateCart(item.id, 1)}
                          aria-label={`Add ${item.name}`}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="order-summary-bar">
            <div className="order-summary-bar__total">
              <span>
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in bag • Total:
              </span>
              <strong>₹{totalAmount}</strong>
            </div>

            <button
              type="button"
              className="btn-gold"
              onClick={handleCheckout}
              style={{ opacity: totalItems === 0 ? 0.5 : 1 }}
              disabled={totalItems === 0}
            >
              <span>Place Pickup Order</span>
              <ArrowRight size={16} className="btn-arrow" />
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}

export function GalleryModal({ isOpen, onClose }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleId="gallery-modal-title">
      <div className="modal-header">
        <p className="modal-eyebrow">Visual Journal</p>
        <h2 id="gallery-modal-title" className="modal-title">
          Inside BLACK &amp; BREW
        </h2>
        <p className="modal-subtitle">
          Moments from our roastery, espresso bar, and evening lounge.
        </p>
      </div>

      {selectedPhoto ? (
        <div>
          <motion.div
            key={selectedPhoto.id}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 201, 40, 0.35)',
              marginBottom: '14px',
            }}
          >
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title}
              style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
            />
          </motion.div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <span className="gallery-tile__cat">{selectedPhoto.category}</span>
              <h3 style={{ fontSize: '1.15rem' }}>{selectedPhoto.title}</h3>
            </div>
            <button
              type="button"
              className="btn-gold"
              onClick={() => setSelectedPhoto(null)}
              style={{ padding: '10px 20px', fontSize: '0.86rem' }}
            >
              Back to Gallery
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          className="gallery-masonry"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.06,
                delayChildren: 0.04,
              },
            },
          }}
        >
          {GALLERY_PHOTOS.map((photo) => (
            <motion.button
              key={photo.id}
              type="button"
              className={`gallery-tile ${
                photo.span === 'tall'
                  ? 'gallery-tile--tall'
                  : photo.span === 'wide'
                  ? 'gallery-tile--wide'
                  : ''
              }`}
              variants={{
                hidden: { opacity: 0, y: 18, scale: 0.96 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo.image} alt={photo.title} className="gallery-tile__img" />
              <div className="gallery-tile__caption">
                <span className="gallery-tile__cat">{photo.category}</span>
                <span className="gallery-tile__title">{photo.title}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </ModalShell>
  );
}

export function VideoModal({ isOpen, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isOpen) {
      videoEl.currentTime = 0;
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          videoEl.muted = true;
          videoEl.play().catch(() => {});
        });
      }
    } else {
      videoEl.pause();
    }
  }, [isOpen]);

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleId="video-modal-title">
      <div className="modal-header">
        <p className="modal-eyebrow">Behind The Roast</p>
        <h2 id="video-modal-title" className="modal-title">
          The BLACK &amp; BREW Film Reel
        </h2>
        <p className="modal-subtitle">
          Every roast, every pour, crafted for the perfect coffee moment.
        </p>
      </div>

      <div className="video-stage">
        <video
          ref={videoRef}
          className="video-stage__player"
          controls
          autoPlay
          playsInline
          preload="auto"
          poster={heroCoffeeImg}
        >
          <source src="/videos/gemini_generated_video.mp4" type="video/mp4" />
          Your browser does not support HTML5 video playback.
        </video>
      </div>
    </ModalShell>
  );
}

export function StoryModal({ isOpen, onClose, onExploreMenu }) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleId="story-modal-title">
      <div className="modal-header">
        <p className="modal-eyebrow">Since 2018</p>
        <h2 id="story-modal-title" className="modal-title">
          Crafted for Coffee Lovers, Built for Community
        </h2>
        <p className="modal-subtitle">
          What began in 2018 as a single manual espresso bar and a cast-iron drum roaster has grown
          into Bengaluru’s favorite late-evening sanctuary for bold coffee and warm connections.
        </p>
      </div>

      <div className="story-timeline">
        <div className="story-milestone">
          <div className="story-milestone__year">2018</div>
          <h4>First Micro-Roastery</h4>
          <p>Partnered directly with high-elevation Arabica growers in Chikmagalur.</p>
        </div>
        <div className="story-milestone">
          <div className="story-milestone__year">2021</div>
          <h4>Night Lounge Launch</h4>
          <p>Introduced our signature dark-and-gold late-night espresso bar until 11 PM.</p>
        </div>
        <div className="story-milestone">
          <div className="story-milestone__year">2026</div>
          <h4>100,000+ Cups Poured</h4>
          <p>Still roasting fresh every Tuesday and greeting regulars by name.</p>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="btn-gold"
          onClick={() => {
            onClose();
            onExploreMenu();
          }}
        >
          <Sparkles size={16} />
          <span>Taste Our Signature Menu</span>
        </button>
      </div>
    </ModalShell>
  );
}

export function LocationModal({ isOpen, onClose }) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2200);
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleId="location-modal-title">
      <div className="modal-header">
        <p className="modal-eyebrow">Visit Us</p>
        <h2 id="location-modal-title" className="modal-title">
          Find BLACK &amp; BREW
        </h2>
        <p className="modal-subtitle">
          Drop by for a fresh pour, reserve a cozy table, or say hello.
        </p>
      </div>

      <div className="location-grid">
        <div className="location-card">
          <div className="location-row">
            <MapPin size={18} />
            <div>
              <strong style={{ color: '#fff', display: 'block' }}>Flagship Coffee House</strong>
              <span>{CAFE_INFO.address}</span>
            </div>
          </div>
          <div className="location-row">
            <Clock size={18} />
            <div>
              <strong style={{ color: '#fff', display: 'block' }}>Opening Hours</strong>
              <span>{CAFE_INFO.hours}</span>
            </div>
          </div>
          <div className="location-row">
            <Phone size={18} />
            <div>
              <strong style={{ color: '#fff', display: 'block' }}>Call the Bar</strong>
              <span>{CAFE_INFO.phone}</span>
            </div>
          </div>
          <div className="location-row">
            <Mail size={18} />
            <div>
              <strong style={{ color: '#fff', display: 'block' }}>Email Us</strong>
              <span>{CAFE_INFO.email}</span>
            </div>
          </div>
        </div>

        <div className="location-card">
          {sent ? (
            <div style={{ textAlign: 'center', margin: 'auto', padding: '24px 8px' }}>
              <CheckCircle2 size={42} color="#FFC928" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ marginBottom: '6px' }}>Message Received!</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)' }}>
                Our café host will confirm your table or reply shortly.
              </p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <strong style={{ fontSize: '0.96rem', marginBottom: '2px' }}>
                Reserve a Table / Send a Note
              </strong>
              <input
                type="text"
                required
                placeholder="Your Name"
                className="contact-input"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                className="contact-input"
              />
              <textarea
                rows={3}
                required
                placeholder="Preferred time, group size, or question..."
                className="contact-input"
                style={{ resize: 'vertical' }}
              />
              <button type="submit" className="btn-gold" style={{ width: '100%' }}>
                <span>Send Message</span>
                <ArrowRight size={16} className="btn-arrow" />
              </button>
            </form>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

