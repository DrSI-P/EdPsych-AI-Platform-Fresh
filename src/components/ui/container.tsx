import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({
  children,
  className = '',
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component className={`container mx-auto px-4 md:px-6 ${className}`}>
      {children}
    </Component>
  );
}

export default Container;
