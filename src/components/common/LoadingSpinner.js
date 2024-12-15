import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}>
        <div className="w-full h-full rounded-full border-2 border-transparent border-t-blue-200"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 