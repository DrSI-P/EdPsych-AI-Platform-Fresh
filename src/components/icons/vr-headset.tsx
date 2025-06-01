'use client';

import React from 'react';

interface VrHeadsetProps {
  className?: string;
}

export function VrHeadset({ className = '' }: VrHeadsetProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 9h16v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z" />
      <path d="M15 18v3" />
      <path d="M9 18v3" />
      <path d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
      <path d="M9 9h6" />
    </svg>
  );
}
