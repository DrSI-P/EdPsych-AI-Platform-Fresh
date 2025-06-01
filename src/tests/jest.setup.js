// @ts-check
// Jest setup file for Vitest environment
import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextDecoder, TextEncoder } from 'util';
import { vi } from 'vitest';

// Mock the global fetch
global.fetch = vi.fn();

/**
 * Mock IntersectionObserver implementation
 */
global.IntersectionObserver = class IntersectionObserver {
  /**
   * @param {IntersectionObserverCallback} callback - The callback to run when intersection changes
   */
  constructor(callback) {
    this.callback = callback;
  }
  
  /**
   * Mock observe method
   * @returns {null}
   */
  observe() {
    return null;
  }
  
  /**
   * Mock unobserve method
   * @returns {null}
   */
  unobserve() {
    return null;
  }
  
  /**
   * Mock disconnect method
   * @returns {null}
   */
  disconnect() {
    return null;
  }
};

/**
 * Mock ResizeObserver implementation
 */
global.ResizeObserver = class ResizeObserver {
  /**
   * @param {ResizeObserverCallback} callback - The callback to run when resize occurs
   */
  constructor(callback) {
    this.callback = callback;
  }
  
  /**
   * Mock observe method
   * @returns {null}
   */
  observe() {
    return null;
  }
  
  /**
   * Mock unobserve method
   * @returns {null}
   */
  unobserve() {
    return null;
  }
  
  /**
   * Mock disconnect method
   * @returns {null}
   */
  disconnect() {
    return null;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Speech Recognition API
global.SpeechRecognition = vi.fn().mockImplementation(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

global.webkitSpeechRecognition = global.SpeechRecognition;

/**
 * Mock localStorage implementation
 */
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn(key => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

/**
 * Mock sessionStorage implementation
 */
const sessionStorageMock = (function() {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn(key => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Suppress console errors during tests
vi.spyOn(console, 'error').mockImplementation(() => {});
