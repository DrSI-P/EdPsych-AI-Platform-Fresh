// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ImmersiveLearningLayout from '../../components/layouts/ImmersiveLearningLayout';

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/test-path',
  }),
}));

// Mock the theme context
vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'space',
    setTheme: vi.fn(),
    themes: ['space', 'ocean', 'forest', 'desert'],
  }),
}));

describe('ImmersiveLearningLayout Component', () => {
  it('renders immersive learning layout with correct theme', () => {
    render(
      <ImmersiveLearningLayout>
        <div>Test Content</div>
      </ImmersiveLearningLayout>
    );
    
    // Check that the content is rendered
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
    
    // Check that the theme elements are present
    expect(screen.getByTestId('immersive-container')).toHaveClass('theme-space');
  });

  it('renders theme selector correctly', () => {
    render(
      <ImmersiveLearningLayout>
        <div>Test Content</div>
      </ImmersiveLearningLayout>
    );
    
    // Check that theme selector is present
    expect(screen.getByLabelText(/Select Theme/i)).toBeInTheDocument();
    
    // Check that all theme options are available
    expect(screen.getByRole('option', { name: /Space/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Ocean/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Forest/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Desert/i })).toBeInTheDocument();
  });

  it('renders ambient effects correctly', () => {
    render(
      <ImmersiveLearningLayout>
        <div>Test Content</div>
      </ImmersiveLearningLayout>
    );
    
    // Check that ambient effects container is present
    expect(screen.getByTestId('ambient-effects')).toBeInTheDocument();
  });

  it('toggles ambient effects when button is clicked', () => {
    render(
      <ImmersiveLearningLayout>
        <div>Test Content</div>
      </ImmersiveLearningLayout>
    );
    
    // Find the toggle button
    const toggleButton = screen.getByRole('button', { name: /Toggle Effects/i });
    
    // Check initial state
    expect(screen.getByTestId('ambient-effects')).toHaveClass('effects-enabled');
    
    // Click the toggle button
    fireEvent.click(toggleButton);
    
    // Check that effects are disabled
    expect(screen.getByTestId('ambient-effects')).toHaveClass('effects-disabled');
  });

  it('renders interactive elements correctly', async () => {
    render(
      <ImmersiveLearningLayout>
        <div>Test Content</div>
      </ImmersiveLearningLayout>
    );
    
    // Check that interactive elements are present
    const interactiveElements = screen.getAllByTestId('interactive-element');
    expect(interactiveElements.length).toBeGreaterThan(0);
  });

  it('shows tooltip when hovering over interactive elements', async () => {
    render(
      <ImmersiveLearningLayout>
        <div>Test Content</div>
      </ImmersiveLearningLayout>
    );
    
    // Find an interactive element
    const interactiveElement = screen.getAllByTestId('interactive-element')[0];
    
    // Hover over the element
    fireEvent.mouseEnter(interactiveElement);
    
    // Check that tooltip is shown
    await waitFor(() => {
      expect(screen.getByTestId('element-tooltip')).toBeInTheDocument();
    });
    
    // Mouse leave
    fireEvent.mouseLeave(interactiveElement);
    
    // Check that tooltip is hidden
    await waitFor(() => {
      expect(screen.queryByTestId('element-tooltip')).not.toBeInTheDocument();
    });
  });

  it('renders navigation controls correctly', () => {
    render(
      <ImmersiveLearningLayout>
        <div>Test Content</div>
      </ImmersiveLearningLayout>
    );
    
    // Check that navigation controls are present
    expect(screen.getByTestId('immersive-navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });

  it('renders accessibility controls correctly', () => {
    render(
      <ImmersiveLearningLayout>
        <div>Test Content</div>
      </ImmersiveLearningLayout>
    );
    
    // Check that accessibility button is present
    expect(screen.getByRole('button', { name: /Accessibility/i })).toBeInTheDocument();
    
    // Click the accessibility button
    fireEvent.click(screen.getByRole('button', { name: /Accessibility/i }));
    
    // Check that accessibility controls are shown
    expect(screen.getByTestId('accessibility-controls')).toBeInTheDocument();
  });
});
