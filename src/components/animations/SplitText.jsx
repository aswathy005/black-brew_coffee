import React from 'react';

/**
 * SplitText Helper Component
 * Splits plain text or headings into words wrapped in overflow:hidden masks.
 * Words animate smoothly from y: 100% to 0 via GSAP without any paid plugins.
 * Fully accessible with screen-reader aria-label.
 *
 * @param {Object} props
 * @param {string|React.ReactNode} props.children - Heading text to split
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.as='span'] - Tag to render
 */
export function SplitText({ children, className = '', as: Component = 'span', ...rest }) {
  if (typeof children !== 'string') {
    return <Component className={className} {...rest}>{children}</Component>;
  }

  const words = children.trim().split(/\s+/);

  return (
    <Component
      className={`split-text-container ${className}`}
      aria-label={children}
      {...rest}
    >
      {words.map((word, index) => (
        <span
          key={`split-word-${index}-${word}`}
          className="split-mask"
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            marginRight: index < words.length - 1 ? '0.28em' : 0,
          }}
          aria-hidden="true"
        >
          <span
            className="split-word"
            style={{
              display: 'inline-block',
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}

export default SplitText;

