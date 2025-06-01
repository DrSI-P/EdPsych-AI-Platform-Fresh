'use client';

import React from 'react';

// Create a stub Certificate icon component to fix build warnings
export const Certificate = ({ 
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
      className={`lucide lucide-certificate ${className}`}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
      <path d="M15 21v-6" />
      <path d="M15 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );
};

export default Certificate;
