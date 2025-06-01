"use client";

/**
 * Utility functions for UI components
 */

/**
 * Combines multiple class names into a single string
 * @param inputs - Class names to combine
 * @returns Combined class names as a string
 */
export function cn(...inputs: (string | undefined | null | false | object)[]) {
  return inputs
    .filter(Boolean)
    .map((input) => {
      if (typeof input === 'string') return input;
      if (typeof input === 'object') {
        return Object.entries(input)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}
