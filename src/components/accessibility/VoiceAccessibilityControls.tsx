'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useVoiceAccessibility } from './VoiceAccessibilityProvider';
import { Volume2, VolumeX, Play, Square, Move } from 'lucide-react';

interface VoiceAccessibilityControlsProps {
  className?: string;
  position?: 'fixed' | 'relative';
}

export function VoiceAccessibilityControls({ 
  className = '', 
  position = 'fixed' 
}: VoiceAccessibilityControlsProps) {
  const { 
    isEnabled, 
    isReading, 
    toggleVoiceAccessibility, 
    readPageContent, 
    stopReading 
  } = useVoiceAccessibility();

  const baseClasses = position === 'fixed' 
    ? 'fixed top-4 right-4 z-50' 
    : 'relative';

  return (
    <div className={`${baseClasses} ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2">
        {/* Voice Accessibility Toggle */}
        <button
          onClick={toggleVoiceAccessibility}
          className={`p-2 rounded-md transition-colors ${
            isEnabled
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
          }`}
          title={isEnabled ? 'Disable Voice Accessibility' : 'Enable Voice Accessibility'}
          aria-label={isEnabled ? 'Disable Voice Accessibility' : 'Enable Voice Accessibility'}
        >
          {isEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* Read Page Button */}
        {isEnabled && (
          <button
            onClick={isReading ? stopReading : readPageContent}
            className={`p-2 rounded-md transition-colors ${
              isReading
                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'
                : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
            }`}
            title={isReading ? 'Stop Reading' : 'Read Page Content'}
            aria-label={isReading ? 'Stop Reading' : 'Read Page Content'}
          >
            {isReading ? <Square size={20} /> : <Play size={20} />}
          </button>
        )}

        {/* Status Indicator */}
        {isEnabled && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded text-xs">
            <div 
              className={`w-2 h-2 rounded-full ${
                isReading ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span className="text-gray-600 dark:text-gray-300">
              {isReading ? 'Reading' : 'Ready'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Draggable Floating Voice Controls
export function FloatingVoiceControls() {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const controlsRef = useRef<HTMLDivElement>(null);

  const { 
    isEnabled, 
    isReading, 
    toggleVoiceAccessibility, 
    readPageContent, 
    stopReading 
  } = useVoiceAccessibility();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div
      ref={controlsRef}
      className={`fixed z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2">
        {/* Drag Handle */}
        <div className="drag-handle p-1 text-gray-400 hover:text-gray-600 cursor-grab">
          <Move size={16} />
        </div>

        {/* Voice Accessibility Toggle */}
        <button
          onClick={toggleVoiceAccessibility}
          className={`p-2 rounded-md transition-colors ${
            isEnabled
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
          }`}
          title={isEnabled ? 'Disable Voice Accessibility' : 'Enable Voice Accessibility'}
          aria-label={isEnabled ? 'Disable Voice Accessibility' : 'Enable Voice Accessibility'}
        >
          {isEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* Read Page Button */}
        {isEnabled && (
          <button
            onClick={isReading ? stopReading : readPageContent}
            className={`p-2 rounded-md transition-colors ${
              isReading
                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'
                : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
            }`}
            title={isReading ? 'Stop Reading' : 'Read Page Content'}
            aria-label={isReading ? 'Stop Reading' : 'Read Page Content'}
          >
            {isReading ? <Square size={20} /> : <Play size={20} />}
          </button>
        )}

        {/* Status Indicator */}
        {isEnabled && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded text-xs">
            <div 
              className={`w-2 h-2 rounded-full ${
                isReading ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span className="text-gray-600 dark:text-gray-300">
              {isReading ? 'Reading' : 'Ready'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline version for specific components
export function InlineVoiceControls({ className }: { className?: string }) {
  return <VoiceAccessibilityControls position="relative" className={className} />;
}

