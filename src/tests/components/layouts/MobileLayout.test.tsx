// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MobileLayout from '../../components/layouts/MobileLayout';

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/test-path',
  }),
}));

// Mock the useMediaQuery hook
vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: vi.fn().mockImplementation(() => {
    // Default implementation for most common queries
    return true;
  }),
}));

describe('MobileLayout Component', () => {
  it('renders mobile layout correctly', () => {
    render(
      <MobileLayout>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    // Check that the content is rendered
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
    
    // Check that the mobile container is present
    expect(screen.getByTestId('mobile-container')).toBeInTheDocument();
  });

  it('renders mobile navigation with touch-friendly controls', () => {
    render(
      <MobileLayout>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    // Check that mobile navigation is present
    expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();
    
    // Check for touch-friendly elements
    const touchButtons = screen.getAllByRole('button');
    expect(touchButtons.length).toBeGreaterThan(0);
    
    // Check that buttons have appropriate size for touch
    const firstButton = touchButtons[0];
    const styles = window.getComputedStyle(firstButton);
    expect(parseInt(styles.minHeight || '0')).toBeGreaterThanOrEqual(44); // Minimum touch target size
  });

  it('handles swipe gestures correctly', async () => {
    render(
      <MobileLayout>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    const container = screen.getByTestId('mobile-container');
    
    // Simulate touch start
    fireEvent.touchStart(container, { 
      touches: [{ clientX: 250, clientY: 300 }] 
    });
    
    // Simulate touch move (swipe right)
    fireEvent.touchMove(container, { 
      touches: [{ clientX: 400, clientY: 300 }] 
    });
    
    // Simulate touch end
    fireEvent.touchEnd(container);
    
    // Check that swipe was detected (this would depend on implementation details)
    await waitFor(() => {
      expect(screen.getByTestId('swipe-indicator')).toHaveTextContent('right');
    });
  });

  it('adapts to orientation changes', async () => {
    // Import and mock in a way that avoids require()
    const useMediaQueryMock = vi.fn();
    useMediaQueryMock.mockReturnValue(true); // Initial portrait mode
    
    // Override the mock implementation
    vi.mocked(vi.importActual('@/hooks/useMediaQuery')).useMediaQuery = useMediaQueryMock;
    
    render(
      <MobileLayout>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    // Check initial orientation (portrait)
    expect(screen.getByTestId('mobile-container')).toHaveClass('portrait');
    
    // Change orientation to landscape
    useMediaQueryMock.mockReturnValue(false);
    
    // Trigger orientation change
    fireEvent(window, new Event('orientationchange'));
    
    // Check that orientation class is updated
    await waitFor(() => {
      expect(screen.getByTestId('mobile-container')).toHaveClass('landscape');
    });
  });

  it('renders bottom navigation bar correctly', () => {
    render(
      <MobileLayout>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    // Check that bottom navigation is present
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
    
    // Check for navigation items
    const navItems = screen.getAllByTestId('nav-item');
    expect(navItems.length).toBeGreaterThan(0);
  });

  it('handles pull-to-refresh gesture', async () => {
    const mockRefresh = vi.fn();
    
    render(
      <MobileLayout onRefresh={mockRefresh}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    const container = screen.getByTestId('mobile-container');
    
    // Simulate pull-to-refresh gesture
    fireEvent.touchStart(container, { 
      touches: [{ clientX: 250, clientY: 50 }] 
    });
    
    fireEvent.touchMove(container, { 
      touches: [{ clientX: 250, clientY: 150 }] 
    });
    
    fireEvent.touchEnd(container);
    
    // Check that refresh function was called
    expect(mockRefresh).toHaveBeenCalled();
    
    // Check for loading indicator
    await waitFor(() => {
      expect(screen.getByTestId('refresh-indicator')).toBeInTheDocument();
    });
  });

  it('renders mobile-optimised form controls', () => {
    render(
      <MobileLayout>
        <form data-testid="test-form">
          <input type="text" data-testid="test-input" />
          <button type="submit" data-testid="test-button">Submit</button>
        </form>
      </MobileLayout>
    );
    
    // Check that form elements have mobile-optimised classes
    expect(screen.getByTestId('test-form')).toHaveClass('mobile-form');
    expect(screen.getByTestId('test-input')).toHaveClass('mobile-input');
    expect(screen.getByTestId('test-button')).toHaveClass('mobile-button');
  });

  it('handles offline status correctly', async () => {
    // Mock navigator.onLine
    const originalOnline = navigator.onLine;
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
    
    render(
      <MobileLayout>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    // Check for offline indicator
    expect(screen.getByTestId('offline-indicator')).toBeInTheDocument();
    
    // Change to online
    Object.defineProperty(navigator, 'onLine', { value: true });
    fireEvent(window, new Event('online'));
    
    // Check that offline indicator is removed
    await waitFor(() => {
      expect(screen.queryByTestId('offline-indicator')).not.toBeInTheDocument();
    });
    
    // Restore original value
    Object.defineProperty(navigator, 'onLine', { value: originalOnline });
  });
});
