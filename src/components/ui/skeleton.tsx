import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  borderRadius?: string | number;
}

export function Skeleton({
  className = '',
  height = '1rem',
  width = '100%',
  borderRadius = '0.25rem'
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${className}`}
      style={{
        height,
        width,
        borderRadius
      }}
    />
  );
}

export default Skeleton;
