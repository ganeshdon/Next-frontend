import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  // Base card classes - only apply if no custom bg in className
  const hasCustomBg = className.includes('bg-');
  const baseClasses = hasCustomBg 
    ? 'rounded-lg shadow-sm' 
    : 'bg-white rounded-lg shadow-sm border border-gray-200';

  // Combine classes
  const combinedClasses = `${baseClasses} ${className}`.trim().replace(/\s+/g, ' ');

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;


