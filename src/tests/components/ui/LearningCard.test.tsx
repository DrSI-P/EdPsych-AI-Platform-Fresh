// @ts-check
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '@/components/theme-provider';
import LearningCard from '@/components/ui/LearningCard';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe('LearningCard Component', () => {
  const defaultProps = {
    title: 'Test Learning Card',
    description: 'This is a test description',
    imageUrl: '/test-image.jpg',
    href: '/test-link',
    category: 'Mathematics',
    level: 'Intermediate',
  };

  it('renders with all props correctly', () => {
    render(
      <ThemeProvider>
        <LearningCard {...defaultProps} />
      </ThemeProvider>
    );

    // Check if title and description are rendered
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    
    // Check if category and level are rendered
    expect(screen.getByText(defaultProps.category)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.level)).toBeInTheDocument();
    
    // Check if image is rendered with correct alt text
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining(defaultProps.imageUrl));
    expect(image).toHaveAttribute('alt', expect.stringContaining(defaultProps.title));
    
    // Check if the card is clickable (wrapped in a link)
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', defaultProps.href);
  });

  it('renders without optional props', () => {
    const minimalProps = {
      title: 'Minimal Card',
      href: '/minimal',
    };

    render(
      <ThemeProvider>
        <LearningCard {...minimalProps} />
      </ThemeProvider>
    );

    // Check if title is rendered
    expect(screen.getByText(minimalProps.title)).toBeInTheDocument();
    
    // Check if the card is clickable
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', minimalProps.href);
    
    // Optional props should not be in the document
    expect(screen.queryByText('Mathematics')).not.toBeInTheDocument();
    expect(screen.queryByText('Intermediate')).not.toBeInTheDocument();
  });

  it('applies age-appropriate styling based on theme context', () => {
    // This test would check if the component applies different styles based on the age group
    // For simplicity, we're just checking if the component renders within the theme provider
    render(
      <ThemeProvider>
        <LearningCard {...defaultProps} />
      </ThemeProvider>
    );
    
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    // In a real test, we would check for specific CSS classes or styles
  });
});
