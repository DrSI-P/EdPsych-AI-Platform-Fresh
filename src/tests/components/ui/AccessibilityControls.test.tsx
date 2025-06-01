// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AccessibilityControls from '../../components/ui/AccessibilityControls';

describe('AccessibilityControls Component', () => {
  beforeEach(() => {
    // Reset localStorage mock before each test
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  it('renders accessibility controls component correctly', () => {
    render(<AccessibilityControls />);
    
    // Check that the component renders with the title
    expect(screen.getByText(/Accessibility Settings/i)).toBeInTheDocument();
    
    // Check that font size controls are present
    expect(screen.getByLabelText(/Font Size/i)).toBeInTheDocument();
    
    // Check that contrast controls are present
    expect(screen.getByLabelText(/Contrast/i)).toBeInTheDocument();
    
    // Check that motion reduction toggle is present
    expect(screen.getByLabelText(/Reduce Motion/i)).toBeInTheDocument();
    
    // Check that dyslexic font toggle is present
    expect(screen.getByLabelText(/Dyslexic Font/i)).toBeInTheDocument();
  });

  it('changes font size when slider is adjusted', async () => {
    render(<AccessibilityControls />);
    
    // Find font size slider
    const fontSizeSlider = screen.getByLabelText(/Font Size/i);
    
    // Change font size to large
    fireEvent.change(fontSizeSlider, { target: { value: '150' } });
    
    // Check that font size class is applied to document
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('font-size-150');
    });
  });

  it('changes contrast when option is selected', async () => {
    render(<AccessibilityControls />);
    
    // Find contrast selector
    const contrastSelector = screen.getByLabelText(/Contrast/i);
    
    // Change to high contrast
    fireEvent.change(contrastSelector, { target: { value: 'high-contrast' } });
    
    // Check that contrast class is applied to document
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('high-contrast');
    });
  });

  it('toggles motion reduction when checkbox is clicked', async () => {
    render(<AccessibilityControls />);
    
    // Find motion reduction checkbox
    const motionCheckbox = screen.getByLabelText(/Reduce Motion/i);
    
    // Toggle motion reduction on
    fireEvent.click(motionCheckbox);
    
    // Check that motion reduction class is applied to document
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('reduce-motion');
    });
    
    // Toggle motion reduction off
    fireEvent.click(motionCheckbox);
    
    // Check that motion reduction class is removed
    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass('reduce-motion');
    });
  });

  it('toggles dyslexic font when checkbox is clicked', async () => {
    render(<AccessibilityControls />);
    
    // Find dyslexic font checkbox
    const dyslexicFontCheckbox = screen.getByLabelText(/Dyslexic Font/i);
    
    // Toggle dyslexic font on
    fireEvent.click(dyslexicFontCheckbox);
    
    // Check that dyslexic font class is applied to document
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dyslexic-font');
    });
    
    // Toggle dyslexic font off
    fireEvent.click(dyslexicFontCheckbox);
    
    // Check that dyslexic font class is removed
    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass('dyslexic-font');
    });
  });

  it('saves settings to localStorage', async () => {
    const { setItem } = window.localStorage;
    
    render(<AccessibilityControls saveSettings={true} />);
    
    // Change font size
    const fontSizeSlider = screen.getByLabelText(/Font Size/i);
    fireEvent.change(fontSizeSlider, { target: { value: '125' } });
    
    // Toggle dyslexic font on
    const dyslexicFontCheckbox = screen.getByLabelText(/Dyslexic Font/i);
    fireEvent.click(dyslexicFontCheckbox);
    
    // Check that settings were saved to localStorage
    await waitFor(() => {
      expect(setItem).toHaveBeenCalledWith(
        'accessibilitySettings',
        expect.stringContaining('"fontSize":"125"')
      );
      expect(setItem).toHaveBeenCalledWith(
        'accessibilitySettings',
        expect.stringContaining('"dyslexicFont":true')
      );
    });
  });

  it('loads settings from localStorage', async () => {
    const savedSettings = {
      fontSize: '175',
      contrast: 'high-contrast',
      reduceMotion: true,
      dyslexicFont: true
    };
    
    const { getItem } = window.localStorage;
    getItem.mockReturnValue(JSON.stringify(savedSettings));
    
    render(<AccessibilityControls saveSettings={true} />);
    
    // Check that settings are loaded from localStorage
    await waitFor(() => {
      // Check font size slider value
      const fontSizeSlider = screen.getByLabelText(/Font Size/i);
      expect(fontSizeSlider.value).toBe('175');
      
      // Check contrast selector value
      const contrastSelector = screen.getByLabelText(/Contrast/i);
      expect(contrastSelector.value).toBe('high-contrast');
      
      // Check motion reduction checkbox
      const motionCheckbox = screen.getByLabelText(/Reduce Motion/i);
      expect(motionCheckbox).toBeChecked();
      
      // Check dyslexic font checkbox
      const dyslexicFontCheckbox = screen.getByLabelText(/Dyslexic Font/i);
      expect(dyslexicFontCheckbox).toBeChecked();
      
      // Check that classes are applied to document
      expect(document.documentElement).toHaveClass('font-size-175');
      expect(document.documentElement).toHaveClass('high-contrast');
      expect(document.documentElement).toHaveClass('reduce-motion');
      expect(document.documentElement).toHaveClass('dyslexic-font');
    });
  });

  it('provides a reset button to restore default settings', async () => {
    render(<AccessibilityControls />);
    
    // Change some settings first
    const fontSizeSlider = screen.getByLabelText(/Font Size/i);
    fireEvent.change(fontSizeSlider, { target: { value: '150' } });
    
    const dyslexicFontCheckbox = screen.getByLabelText(/Dyslexic Font/i);
    fireEvent.click(dyslexicFontCheckbox);
    
    // Find and click reset button
    const resetButton = screen.getByRole('button', { name: /Reset to Default/i });
    fireEvent.click(resetButton);
    
    // Check that settings are reset to defaults
    await waitFor(() => {
      // Check font size slider value
      expect(fontSizeSlider.value).toBe('100');
      
      // Check dyslexic font checkbox
      expect(dyslexicFontCheckbox).not.toBeChecked();
      
      // Check that classes are removed from document
      expect(document.documentElement).not.toHaveClass('font-size-150');
      expect(document.documentElement).not.toHaveClass('dyslexic-font');
    });
  });

  it('provides keyboard shortcuts for accessibility settings', async () => {
    render(<AccessibilityControls keyboardShortcuts={true} />);
    
    // Check that keyboard shortcuts info is displayed
    expect(screen.getByText(/Keyboard Shortcuts/i)).toBeInTheDocument();
    
    // Simulate keyboard shortcut for increasing font size (Ctrl+Plus)
    fireEvent.keyDown(document, { key: '+', ctrlKey: true });
    
    // Check that font size is increased
    await waitFor(() => {
      const fontSizeSlider = screen.getByLabelText(/Font Size/i);
      expect(fontSizeSlider.value).toBe('110');
    });
    
    // Simulate keyboard shortcut for toggling high contrast (Ctrl+H)
    fireEvent.keyDown(document, { key: 'h', ctrlKey: true });
    
    // Check that contrast is changed
    await waitFor(() => {
      const contrastSelector = screen.getByLabelText(/Contrast/i);
      expect(contrastSelector.value).toBe('high-contrast');
    });
  });

  it('applies settings to content within the component', async () => {
    render(
      <AccessibilityControls>
        <div data-testid="test-content">Test Content</div>
      </AccessibilityControls>
    );
    
    // Change font size
    const fontSizeSlider = screen.getByLabelText(/Font Size/i);
    fireEvent.change(fontSizeSlider, { target: { value: '150' } });
    
    // Check that font size class is applied to content
    await waitFor(() => {
      const content = screen.getByTestId('test-content');
      expect(content).toHaveClass('font-size-150');
    });
  });

  it('provides a preview of accessibility settings', async () => {
    render(<AccessibilityControls showPreview={true} />);
    
    // Check that preview section is displayed
    expect(screen.getByTestId('accessibility-preview')).toBeInTheDocument();
    
    // Change font size
    const fontSizeSlider = screen.getByLabelText(/Font Size/i);
    fireEvent.change(fontSizeSlider, { target: { value: '150' } });
    
    // Check that preview is updated
    await waitFor(() => {
      const preview = screen.getByTestId('accessibility-preview');
      expect(preview).toHaveClass('font-size-150');
    });
  });
});
