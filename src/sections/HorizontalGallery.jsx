import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Maximize2,
  X,
} from 'lucide-react';
import './HorizontalGallery.css';

// Project coffee photography assets
import espressoExtractionImg from '../assets/images/espresso-extraction.jpg';
import coffeeGrindImg from '../assets/images/coffee-grind.jpg';
import latteArtPourImg from '../assets/images/latte-art-pour.jpg';
import aboutBeansImg from '../assets/images/about-beans.jpg';
import heroCoffeeImg from '../assets/images/hero-coffee.jpg';
import cafeAmbienceImg from '../assets/images/cafe-ambience.jpg';
import cappuccinoImg from '../assets/images/menu-cappuccino.jpg';
import coldBrewImg from '../assets/images/menu-cold-brew.jpg';

// 8 Craft Coffee Moments positioned in the 360° circular carousel
const GALLERY_ITEMS = [
  {
    id: '01',
    number: '01',
    tag: 'ORIGIN',
    title: 'Highland Arabica Harvest',
    caption: 'Single-origin heirloom Bourbon beans hand-harvested at 1,850m elevation in volcanic soil.',
    details: 'Flavor notes of dark cacao, dried black cherries, and sweet jasmine honey.',
    image: aboutBeansImg,
  },
  {
    id: '02',
    number: '02',
    tag: 'EXTRACTION',
    title: '9-Bar Golden Crema',
    caption: 'Precision lever pull with saturated 93°C water extracting dense golden tiger-striping.',
    details: 'Pulled on our customized dual-boiler lever machine with a 28-second flow window.',
    image: espressoExtractionImg,
  },
  {
    id: '03',
    number: '03',
    tag: 'MILLING',
    title: '210-Micron Burr Grind',
    caption: 'Flat 83mm titanium burrs producing ultra-uniform micro-particles without friction heat.',
    details: 'Zero static retention ensures every particle retains its volatile aromatics.',
    image: coffeeGrindImg,
  },
  {
    id: '04',
    number: '04',
    tag: 'CRAFT',
    title: 'Rosetta Microfoam Pour',
    caption: 'Velvety 65°C steamed milk textured to micro-silky consistency poured with freehand art.',
    details: 'Whole organic dairy steamed with dry multi-hole vortex tips for zero bubble aeration.',
    image: latteArtPourImg,
  },
  {
    id: '05',
    number: '05',
    tag: 'SANCTUARY',
    title: 'Warm Amber Evenings',
    caption: 'Low acoustic lighting, reclaimed teak timbers, and relaxing slow-drip ambiance.',
    details: 'Our cafe space is engineered with acoustic panels for quiet contemplation or deep conversations.',
    image: cafeAmbienceImg,
  },
  {
    id: '06',
    number: '06',
    tag: 'SIGNATURE',
    title: 'Obsidian Velvet Cappuccino',
    caption: 'Equal parts dense ristretto, textured silky milk, and dark Dutch cocoa powder crown.',
    details: 'Served in custom pre-warmed ceramic cups at the ideal sipping temperature.',
    image: cappuccinoImg,
  },
  {
    id: '07',
    number: '07',
    tag: 'SLOW BAR',
    title: '24-Hour Nitro Cold Brew',
    caption: 'Steeped cold for 24 hours in stainless steel vats and infused with food-grade pure nitrogen.',
    details: 'Cascading stout-like Guinness head with ultra-low acidity and naturally creamy texture.',
    image: coldBrewImg,
  },
  {
    id: '08',
    number: '08',
    tag: 'LEGACY',
    title: 'The Signature Pour',
    caption: 'The flagship BLACK & BREW espresso recipe refined over thousands of test roast batches.',
    details: 'Balanced acidity, syrupy mouthfeel, and a lingering dark chocolate aftertaste.',
    image: heroCoffeeImg,
  },
];

export function HorizontalGallery({ onOpenGalleryModal } = {}) {
  const [rotation, setRotation] = useState(0); // Current carousel angle in degrees
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [dimensions, setDimensions] = useState({ radiusX: 380, radiusY: 130, itemSize: 155 });
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const dragStartRef = useRef({ x: 0, rotation: 0 });
  const animFrameRef = useRef(null);
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const hoveredIndexRef = useRef(null);

  // Keep ref in sync for the animation loop
  useEffect(() => {
    hoveredIndexRef.current = hoveredIndex;
  }, [hoveredIndex]);

  // Responsive stage dimensions calculation
  const updateDimensions = useCallback(() => {
    if (!stageRef.current) return;
    const stageWidth = stageRef.current.clientWidth;
    const isMobile = stageWidth < 640;
    const isTablet = stageWidth >= 640 && stageWidth < 1024;

    if (isMobile) {
      setDimensions({
        radiusX: Math.max(130, Math.min(stageWidth * 0.38, 175)),
        radiusY: Math.max(50, Math.min(stageWidth * 0.16, 75)),
        itemSize: 105,
      });
    } else if (isTablet) {
      setDimensions({
        radiusX: Math.max(220, Math.min(stageWidth * 0.38, 300)),
        radiusY: Math.max(80, Math.min(stageWidth * 0.15, 110)),
        itemSize: 135,
      });
    } else {
      setDimensions({
        radiusX: Math.max(320, Math.min(stageWidth * 0.36, 440)),
        radiusY: Math.max(110, Math.min(stageWidth * 0.13, 150)),
        itemSize: 160,
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  // Continuous 60fps circular rotation loop with smooth lerping
  useEffect(() => {
    const ROTATION_SPEED = 0.18; // degrees per frame during auto-rotation

    const animate = () => {
      // Auto-rotation when not hovered and not dragging
      if (hoveredIndexRef.current === null && !isDragging) {
        targetRotationRef.current += ROTATION_SPEED;
      }

      // Smooth lerp towards target rotation for buttery easing
      const diff = targetRotationRef.current - rotationRef.current;
      rotationRef.current += diff * 0.08;

      setRotation(rotationRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging]);

  // Drag / swipe navigation
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartRef.current = {
      x: clientX,
      rotation: targetRotationRef.current,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartRef.current.x;
    const sensitivity = 0.35;
    targetRotationRef.current = dragStartRef.current.rotation + deltaX * sensitivity;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <section
      ref={containerRef}
      id="gallery-section"
      className="circular-gallery-section"
      aria-label="Moments Brewed Circular Gallery"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Ambient background glow flares */}
      <div className="circular-gallery__ambient-flare circular-gallery__ambient-flare--left" />
      <div className="circular-gallery__ambient-flare circular-gallery__ambient-flare--right" />

      {/* Section Header */}
      <div className="circular-gallery__header">
        <div className="circular-gallery__eyebrow">
          <Sparkles size={14} className="circular-gallery__gold-icon" />
          <span>MOMENTS BREWED</span>
        </div>

        <h2 className="circular-gallery__title">
          Craft In Every <span className="circular-gallery__gold-text">Frame.</span>
        </h2>

        <p className="circular-gallery__subtitle">
          Hover over any coffee moment to pause and zoom. Drag to spin the wheel.
        </p>
      </div>

      {/* 3D Circular Revolving Stage */}
      <div
        ref={stageRef}
        className="circular-gallery__stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        {/* 8 Orbiting Circular Coffee Moment Items */}
        {GALLERY_ITEMS.map((item, index) => {
          const stepAngle = 360 / GALLERY_ITEMS.length;
          // Item's position angle in radians around the circle
          const itemAngleDeg = index * stepAngle + rotation;
          const phi = (itemAngleDeg * Math.PI) / 180;

          // Elliptical coordinates (x: horizontal spread, y: 3D perspective tilt)
          const x = Math.sin(phi) * dimensions.radiusX;
          const y = Math.cos(phi) * dimensions.radiusY;

          // Depth value from 0 (furthest back) to 1 (front-center)
          const depth = (Math.cos(phi) + 1) / 2;

          const isHovered = hoveredIndex === index;

          // Compute scale and opacity based on depth, boosted dramatically on hover
          const baseScale = 0.72 + 0.32 * depth;
          const scale = isHovered ? Math.max(1.38, baseScale * 1.35) : baseScale;
          const opacity = isHovered ? 1 : 0.52 + 0.48 * depth;
          const zIndex = isHovered ? 999 : Math.round(depth * 100) + 10;

          return (
            <div
              key={item.id}
              className={`circular-gallery__item ${isHovered ? 'circular-gallery__item--hovered' : ''}`}
              style={{
                transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0px) scale(${scale})`,
                zIndex,
                opacity,
                width: `${dimensions.itemSize}px`,
                height: `${dimensions.itemSize}px`,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setActiveModalItem(item)}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.title}`}
            >
              {/* Circular Lens Frame with Glowing Gold Concentric Trim */}
              <div className="circular-gallery__lens">
                <img
                  src={item.image}
                  alt={item.title}
                  className="circular-gallery__lens-img"
                  loading="lazy"
                  draggable={false}
                />

                {/* High-gloss convex glass reflection shine */}
                <div className="circular-gallery__lens-glass" />

                {/* Number Badge */}
                <div className="circular-gallery__lens-badge">
                  <span className="circular-gallery__lens-number">{item.number}</span>
                </div>

                {/* Hover Zoom Prompt Icon */}
                <div className="circular-gallery__lens-zoom-icon" aria-hidden="true">
                  <Maximize2 size={16} />
                </div>
              </div>

              {/* Floating Rich Tooltip / Info Card when Hovered */}
              <div
                className={`circular-gallery__item-card ${
                  isHovered ? 'circular-gallery__item-card--visible' : ''
                }`}
              >
                <div className="circular-gallery__item-card-tag">
                  <span>{item.tag}</span>
                  <span className="circular-gallery__item-card-dot">•</span>
                  <span>{item.number}/08</span>
                </div>
                <h4 className="circular-gallery__item-card-title">{item.title}</h4>
                <p className="circular-gallery__item-card-desc">{item.caption}</p>
                <span className="circular-gallery__item-card-cta">
                  <span>Click to view full photo</span>
                  <Maximize2 size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-screen Lightbox Zoom Modal when any image is clicked */}
      {activeModalItem && (
        <div
          className="circular-gallery__lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="circular-gallery__lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="circular-gallery__lightbox-close"
              onClick={() => setActiveModalItem(null)}
              aria-label="Close photo preview"
            >
              <X size={22} />
            </button>

            <div className="circular-gallery__lightbox-img-wrapper">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="circular-gallery__lightbox-img"
              />
              <div className="circular-gallery__lightbox-overlay" />
            </div>

            <div className="circular-gallery__lightbox-body">
              <div className="circular-gallery__lightbox-header">
                <span className="circular-gallery__lightbox-tag">
                  {activeModalItem.tag} • STAGE {activeModalItem.number}
                </span>
                <h3 className="circular-gallery__lightbox-title">{activeModalItem.title}</h3>
              </div>

              <p className="circular-gallery__lightbox-caption">{activeModalItem.caption}</p>
              <p className="circular-gallery__lightbox-details">{activeModalItem.details}</p>

              <div className="circular-gallery__lightbox-footer">
                <span className="circular-gallery__lightbox-origin">
                  BLACK & BREW • CRAFT ARCHIVE
                </span>
                <button
                  type="button"
                  className="circular-gallery__lightbox-dismiss"
                  onClick={() => setActiveModalItem(null)}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HorizontalGallery;
