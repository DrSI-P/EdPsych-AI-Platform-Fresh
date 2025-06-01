'use client';

import React from 'react';

export default function VoiceInputTestLoading() {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
        <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse delay-150"></div>
        <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse delay-300"></div>
      </div>
      <h2 className="text-xl font-medium text-gray-700">Loading Voice Input Test Suite...</h2>
      <p className="text-gray-500 mt-2">Initializing speech recognition components</p>
    </div>
  );
}
