'use client';

import React from 'react';

// Create a stub VolumeUp icon component to fix build warnings
export const VolumeUp = ({ 
  size = 24, 
  colour = 'currentColor', 
  strokeWidth = 2,
  className = '',
  ...props 
}: {
  size?: number;
  colour?: string;
  strokeWidth?: number;
  className?: string;
  [key: string];
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colour}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-volume-up ${className}`}
      {...props}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
};

export default VolumeUp;
