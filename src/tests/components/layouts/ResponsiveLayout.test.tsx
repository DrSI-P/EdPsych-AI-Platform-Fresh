// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResponsiveLayout from '../../components/layouts/ResponsiveLayout';

describe('ResponsiveLayout Component', () => {
  it('renders responsive layout correctly', () => {
    render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>
    );
    
    // Check that the content is rendered
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
    
    // Check that the responsive container is present
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('applies mobile styles when on small screens', () => {
    // Mock the media query
    vi.mock('@/hooks/useMediaQuery', () => ({
      useMediaQuery: vi.fn().mockImplementation((query) => {
        if (query === '(max-width: 768px)') return true;
        return false;
      })
    }));
    
    render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>
    );
    
    // Check that mobile class is applied
    expect(screen.getByTestId('responsive-container')).toHaveClass('mobile-view');
  });

  it('applies tablet styles when on medium screens', () => {
    // Mock the media query
    vi.mock('@/hooks/useMediaQuery', () => ({
      useMediaQuery: vi.fn().mockImplementation((query) => {
        if (query === '(max-width: 768px)') return false;
        if (query === '(max-width: 1024px)') return true;
        return false;
      })
    }));
    
    render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>
    );
    
    // Check that tablet class is applied
    expect(screen.getByTestId('responsive-container')).toHaveClass('tablet-view');
  });

  it('applies desktop styles when on large screens', () => {
    // Mock the media query
    vi.mock('@/hooks/useMediaQuery', () => ({
      useMediaQuery: vi.fn().mockImplementation(() => {
        return false; // No media queries match (large screen)
      })
    }));
    
    render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>
    );
    
    // Check that desktop class is applied
    expect(screen.getByTestId('responsive-container')).toHaveClass('desktop-view');
  });

  it('renders navigation menu correctly', () => {
    render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>
    );
    
    // Check that navigation is present
    expect(screen.getByTestId('responsive-navigation')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger icon is clicked', async () => {
    // Mock the media query
    vi.mock('@/hooks/useMediaQuery', () => ({
      useMediaQuery: vi.fn().mockImplementation((query) => {
        if (query === '(max-width: 768px)') return true;
        return false;
      })
    }));
    
    render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>
    );
    
    // Find the hamburger menu button
    const menuButton = screen.getByTestId('mobile-menu-toggle');
    
    // Check initial state (menu closed)
    expect(screen.getByTestId('mobile-menu')).toHaveClass('menu-closed');
    
    // Click the menu button
    fireEvent.click(menuButton);
    
    // Check that menu is open
    expect(screen.getByTestId('mobile-menu')).toHaveClass('menu-open');
    
    // Click again to close
    fireEvent.click(menuButton);
    
    // Check that menu is closed again
    expect(screen.getByTestId('mobile-menu')).toHaveClass('menu-closed');
  });

  it('handles orientation changes correctly', async () => {
    // Mock the media query
    vi.mock('@/hooks/useMediaQuery', () => ({
      useMediaQuery: vi.fn().mockImplementation((query) => {
        if (query === '(max-width: 768px)') return true;
        if (query === '(orientation: landscape)') return false;
        return false;
      })
    }));
    
    render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>
    );
    
    // Check initial orientation
    expect(screen.getByTestId('responsive-container')).toHaveClass('portrait');
    
    // Change orientation to landscape
    vi.mock('@/hooks/useMediaQuery', () => ({
      useMediaQuery: vi.fn().mockImplementation((query) => {
        if (query === '(max-width: 768px)') return true;
        if (query === '(orientation: landscape)') return true;
        return false;
      })
    }));
    
    // Trigger re-render
    fireEvent(window, new Event('resize'));
    
    // Check that orientation class is updated
    await waitFor(() => {
      expect(screen.getByTestId('responsive-container')).toHaveClass('landscape');
    });
  });

  it('adapts content layout based on screen size', () => {
    // Mock the media query for mobile view
    vi.mock('@/hooks/useMediaQuery', () => ({
      useMediaQuery: vi.fn().mockImplementation((query) => {
        if (query === '(max-width: 768px)') return true;
        return false;
      })
    }));
    
    const { rerender } = render(
      <ResponsiveLayout>
        <div data-testid="test-content">Test Content</div>
      </ResponsiveLayout>
    );
    
    // Check mobile layout
    expect(screen.getByTestId('content-wrapper')).toHaveClass('mobile-layout');
    
    // Change to desktop view
    vi.mock('@/hooks/useMediaQuery', () => ({
      useMediaQuery: vi.fn().mockImplementation(() => {
        return false; // No media queries match (large screen)
      })
    }));
    
    // Re-render with same props
    rerender(
      <ResponsiveLayout>
        <div data-testid="test-content">Test Content</div>
      </ResponsiveLayout>
    );
    
    // Check desktop layout
    expect(screen.getByTestId('content-wrapper')).toHaveClass('desktop-layout');
  });
});
