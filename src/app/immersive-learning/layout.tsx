'use client';

import React from 'react';
import { ImmersiveLayout } from '@/components/immersive/immersive-layout';

interface ImmersiveLearningLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout wrapper for immersive learning pages
 * 
 * This layout provides a consistent structure for all immersive learning
 * experiences, including navigation, accessibility controls, and responsive
 * design elements.
 */
export default function ImmersiveLearningLayout({
  children
}: ImmersiveLearningLayoutProps) {
  return (
    <div className="immersive-learning-container min-h-screen">
      {children}
    </div>
  );
}
