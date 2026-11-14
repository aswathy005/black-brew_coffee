import React from 'react';
import { Plus } from 'lucide-react';
import { useCard3DTilt } from '../hooks/useCard3DTilt';

/**
 * MenuCard Component
 * Displays a single coffee menu item with 3D cursor tilt, lift, dynamic glare,
 * smooth image zoom, and physical translateZ depth on interactive controls.
 */
export function MenuCard({ item, onQuickAdd, onImageLoad }) {
  const { cardRef, handleMouseMove, handleMouseLeave } = useCard3DTilt({
    maxTilt: 8,
    lift: -10,
  });

  return (
    <div className="menu-card-wrapper">
      <article
        ref={cardRef}
        className="menu-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onQuickAdd(item)}
        tabIndex={0}
        role="button"
        aria-label={`${item.name}, ₹${item.price}. Click to add to order`}
      >
        {/* Dynamic moving glare light overlay following the cursor */}
        <div className="menu-card__glare" aria-hidden="true" />

        {/* Media container with overflow:hidden and image zoom */}
        <div className="menu-card__media">
          <img
            src={item.image}
            alt={item.name}
            className="menu-card__img"
            loading="lazy"
            onLoad={onImageLoad}
          />
          {/* Subtle dark gradient overlay deepening on hover for crisp contrast */}
          <div className="menu-card__media-overlay" aria-hidden="true" />

          {/* Quick-add floating button with translateZ(30px) physical depth */}
          <button
            type="button"
            className="menu-card__add-pill"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(item);
            }}
            aria-label={`Add ${item.name} to order`}
            title={`Add ${item.name}`}
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Card Title & Price with subtle 3D elevation */}
        <h3 className="menu-card__title">{item.name}</h3>
        <p className="menu-card__price">₹{item.price}</p>
      </article>
    </div>
  );
}

export default MenuCard;

