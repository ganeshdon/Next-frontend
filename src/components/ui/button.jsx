import React from 'react';

const Button = ({ 
  children, 
  className = '', 
  disabled = false, 
  type = 'button', 
  onClick,
  size = 'md',
  variant = 'default',
  ...props 
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Variant classes - only apply if no custom bg/text colors in className
  const hasCustomColors = className.includes('bg-') || className.includes('text-');
  const variantClasses = hasCustomColors ? '' : {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }[variant] || '';

  // Base classes that all buttons should have
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer';

  // Combine all classes
  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses}
    ${className}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;


