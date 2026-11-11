import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/coffeeData';
import './TestimonialSection.css';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 52 : -52,
    opacity: 0,
    scale: 0.985,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction) => ({
    x: direction > 0 ? -52 : 52,
    opacity: 0,
    scale: 0.985,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function TestimonialSection() {
  const [cardsPerSlide, setCardsPerSlide] = useState(2);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const updateCount = () => {
      setCardsPerSlide(window.innerWidth < 720 ? 1 : 2);
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  const totalPages = Math.ceil(TESTIMONIALS.length / cardsPerSlide);
  const safePage = page >= totalPages ? 0 : page;

  const currentItems = TESTIMONIALS.slice(
    safePage * cardsPerSlide,
    safePage * cardsPerSlide + cardsPerSlide
  );

  const handleNext = () => {
    setDirection(1);
    setPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setDirection(-1);
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section id="reviews" className="testimonials">
      <div className="container">
        <div className="testimonials__layout">
          {/* Left Header */}
          <motion.div
            className="testimonials__intro"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-eyebrow">
              <span className="eyebrow-underline">What</span> Our{' '}
              <span className="eyebrow-underline">Customers</span> Say
            </div>

            <h2 className="testimonials__heading">
              Happy Sippers,
              <br />
              Happy Us
            </h2>

            <svg
              className="testimonials__swish"
              viewBox="0 0 165 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 13C48 4 115 2 160 8.5"
                stroke="#FFC928"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          {/* Right Interactive Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.24 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="testimonials__carousel-wrap">
              <button
                type="button"
                className="testimonials__nav-btn"
                onClick={handlePrev}
                aria-label="Previous testimonials"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="testimonials__viewport">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`${safePage}-${cardsPerSlide}`}
                    className="testimonials__slide-grid"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    {currentItems.map((review) => (
                      <article key={review.id} className="testimonial-card">
                        <div>
                          <svg
                            className="testimonial-card__quote-mark"
                            width="26"
                            height="20"
                            viewBox="0 0 28 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M11.6 10.6V21.2H1V11.8C1 5.6 4.4 1.6 10.8 0L12.4 3.2C8.4 4.4 6.6 6.8 6.4 10.6H11.6ZM26.8 10.6V21.2H16.2V11.8C16.2 5.6 19.6 1.6 26 0L27.6 3.2C23.6 4.4 21.8 6.8 21.6 10.6H26.8Z"
                              fill="#FFC928"
                            />
                          </svg>

                          <p className="testimonial-card__text">“{review.quote}”</p>
                        </div>

                        <div className="testimonial-card__footer">
                          <div className="testimonial-card__author">
                            {review.avatar ? (
                              <img
                                src={review.avatar}
                                alt={review.name}
                                className="testimonial-card__avatar"
                              />
                            ) : (
                              <span
                                className="testimonial-card__avatar-badge"
                                aria-hidden="true"
                              >
                                {review.initials}
                              </span>
                            )}
                            <span className="testimonial-card__name">– {review.name}</span>
                          </div>

                          <div
                            className="testimonial-card__stars"
                            aria-label={`${review.rating} out of 5 stars`}
                          >
                            {Array.from({ length: review.rating }).map((_, idx) => (
                              <Star key={idx} size={13} fill="#FFC928" stroke="#FFC928" />
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                type="button"
                className="testimonials__nav-btn"
                onClick={handleNext}
                aria-label="Next testimonials"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="testimonials__dots" role="tablist" aria-label="Testimonial slides">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={safePage === idx}
                  aria-label={`View reviews page ${idx + 1}`}
                  className={`testimonials__dot ${
                    safePage === idx ? 'testimonials__dot--active' : ''
                  }`}
                  onClick={() => {
                    setDirection(idx > safePage ? 1 : -1);
                    setPage(idx);
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
