import React from 'react';

// Heading component
export const Heading = ({ children, className, ...props }) => {
  return (
    <h2 className={className} {...props}>
      {children}
    </h2>
  );
};

// Text component
export const Text = ({ children, className, ...props }) => {
  return (
    <p className={className} {...props}>
      {children}
    </p>
  );
};

// Img component
export const Img = ({ src, alt, className, ...props }) => {
  return (
    <img src={src} alt={alt || ''} className={className} {...props} />
  );
}; 