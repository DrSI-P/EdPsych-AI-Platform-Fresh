import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccessibilityControls from '@/components/ui/AccessibilityControls';

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: function(key: string) {
      return store[key] || null;
    },
    setItem: function(key: string, value: string) {
      store[key] = value;
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key: string) {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AccessibilityControls', () => {
  beforeEach(() => {
    document.body.classList.remove('high-contrast', 'dark-contrast', 'reduce-motion', 'dyslexic-font');
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('renders the accessibility button', () => {
    render(<AccessibilityControls />);
    const button = screen.getByLabelText('Accessibility options');
    expect(button).toBeInTheDocument();
  });

  it('opens the accessibility panel when button is clicked', () => {
    render(<AccessibilityControls />);
    const button = screen.getByLabelText('Accessibility options');
    fireEvent.click(button);
    
    expect(screen.getByText('Accessibility Options')).toBeInTheDocument();
    expect(screen.getByText('Font Size')).toBeInTheDocument();
    expect(screen.getByText('Contrast')).toBeInTheDocument();
    expect(screen.getByText('Reduce Motion')).toBeInTheDocument();
    expect(screen.getByText('Dyslexic Font')).toBeInTheDocument();
  });

  it('increases font size when increase button is clicked', () => {
    render(<AccessibilityControls initialFontSize={16} />);
    const button = screen.getByLabelText('Accessibility options');
    fireEvent.click(button);
    
    const increaseFontButton = screen.getByLabelText('Increase font size');
    fireEvent.click(increaseFontButton);
    
    // Check if document.documentElement.style.fontSize was updated
    expect(document.documentElement.style.fontSize).toBe('18px');
  });

  it('decreases font size when decrease button is clicked', () => {
    render(<AccessibilityControls initialFontSize={16} />);
    const button = screen.getByLabelText('Accessibility options');
    fireEvent.click(button);
    
    const decreaseFontButton = screen.getByLabelText('Decrease font size');
    fireEvent.click(decreaseFontButton);
    
    // Check if document.documentElement.style.fontSize was updated
    expect(document.documentElement.style.fontSize).toBe('14px');
  });

  it('changes contrast mode when contrast buttons are clicked', () => {
    render(<AccessibilityControls />);
    const button = screen.getByLabelText('Accessibility options');
    fireEvent.click(button);
    
    // Click high contrast button
    const highContrastButton = screen.getByText('High');
    fireEvent.click(highContrastButton);
    
    // Check if body class was updated
    expect(document.body.classList.contains('high-contrast')).toBe(true);
    
    // Click dark contrast button
    const darkContrastButton = screen.getByText('Dark');
    fireEvent.click(darkContrastButton);
    
    // Check if body class was updated
    expect(document.body.classList.contains('high-contrast')).toBe(false);
    expect(document.body.classList.contains('dark-contrast')).toBe(true);
  });

  it('toggles reduce motion when switch is clicked', () => {
    render(<AccessibilityControls />);
    const button = screen.getByLabelText('Accessibility options');
    fireEvent.click(button);
    
    // Find the reduce motion switch
    const reduceMotionSwitch = screen.getByRole('switch', { name: /Reduce Motion/i });
    fireEvent.click(reduceMotionSwitch);
    
    // Check if body class was updated
    expect(document.body.classList.contains('reduce-motion')).toBe(true);
    
    // Click again to toggle off
    fireEvent.click(reduceMotionSwitch);
    
    // Check if body class was removed
    expect(document.body.classList.contains('reduce-motion')).toBe(false);
  });

  it('toggles dyslexic font when switch is clicked', () => {
    render(<AccessibilityControls />);
    const button = screen.getByLabelText('Accessibility options');
    fireEvent.click(button);
    
    // Find the dyslexic font switch
    const dyslexicFontSwitch = screen.getByRole('switch', { name: /Dyslexic Font/i });
    fireEvent.click(dyslexicFontSwitch);
    
    // Check if body class was updated
    expect(document.body.classList.contains('dyslexic-font')).toBe(true);
    
    // Click again to toggle off
    fireEvent.click(dyslexicFontSwitch);
    
    // Check if body class was removed
    expect(document.body.classList.contains('dyslexic-font')).toBe(false);
  });

  it('resets to defaults when reset button is clicked', () => {
    render(<AccessibilityControls initialFontSize={20} initialContrast="high" initialReduceMotion={true} initialDyslexicFont={true} />);
    const button = screen.getByLabelText('Accessibility options');
    fireEvent.click(button);
    
    // Check initial state
    expect(document.documentElement.style.fontSize).toBe('20px');
    expect(document.body.classList.contains('high-contrast')).toBe(true);
    expect(document.body.classList.contains('reduce-motion')).toBe(true);
    expect(document.body.classList.contains('dyslexic-font')).toBe(true);
    
    // Click reset button
    const resetButton = screen.getByText('Reset to Defaults');
    fireEvent.click(resetButton);
    
    // Check if everything was reset
    expect(document.documentElement.style.fontSize).toBe('16px');
    expect(document.body.classList.contains('high-contrast')).toBe(false);
    expect(document.body.classList.contains('reduce-motion')).toBe(false);
    expect(document.body.classList.contains('dyslexic-font')).toBe(false);
  });

  it('saves settings to localStorage', () => {
    render(<AccessibilityControls />);
    const button = screen.getByLabelText('Accessibility options');
    fireEvent.click(button);
    
    // Change some settings
    const highContrastButton = screen.getByText('High');
    fireEvent.click(highContrastButton);
    
    const dyslexicFontSwitch = screen.getByRole('switch', { name: /Dyslexic Font/i });
    fireEvent.click(dyslexicFontSwitch);
    
    // Check if localStorage was updated
    const savedSettings = JSON.parse(localStorageMock.getItem('accessibility') || '{}');
    expect(savedSettings.contrast).toBe('high');
    expect(savedSettings.dyslexicFont).toBe(true);
  });

  it('loads settings from localStorage on initial render', () => {
    // Set up localStorage with saved settings
    localStorageMock.setItem('accessibility', JSON.stringify({
      fontSize: 22,
      contrast: 'dark',
      reduceMotion: true,
      dyslexicFont: true
    }));
    
    render(<AccessibilityControls />);
    
    // Check if settings were applied from localStorage
    expect(document.documentElement.style.fontSize).toBe('22px');
    expect(document.body.classList.contains('dark-contrast')).toBe(true);
    expect(document.body.classList.contains('reduce-motion')).toBe(true);
    expect(document.body.classList.contains('dyslexic-font')).toBe(true);
  });
});
