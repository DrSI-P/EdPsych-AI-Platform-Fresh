import React from 'react';

export function Skeleton({
  className = '',
  height = '1rem',
  width = '100%',
  borderRadius = '0.25rem'
}) {
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
