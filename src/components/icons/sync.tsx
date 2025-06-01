'use client';

import React from 'react';

interface SyncProps {
  className?: string;
}

export function Sync({ className = '' }: SyncProps) {
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
      <path d="M21 8v5a5 5 0 0 1-5 5H8" />
      <path d="m17 8-4-4-4 4" />
      <path d="M3 16v-5a5 5 0 0 1 5-5h8" />
      <path d="m7 16 4 4 4-4" />
    </svg>
  );
}