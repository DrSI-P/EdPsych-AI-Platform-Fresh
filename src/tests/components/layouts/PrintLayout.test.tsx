// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PrintLayout from '../../components/layouts/PrintLayout';

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/test-path',
  }),
}));

describe('PrintLayout Component', () => {
  it('renders print layout correctly', () => {
    render(
      <PrintLayout title="Test Report">
        <div>Test Content</div>
      </PrintLayout>
    );
    
    // Check that the content is rendered
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
    
    // Check that the title is rendered
    expect(screen.getByText(/Test Report/i)).toBeInTheDocument();
    
    // Check that the print container is present
    expect(screen.getByTestId('print-container')).toBeInTheDocument();
  });

  it('renders print header with logo and title', () => {
    render(
      <PrintLayout title="Test Report">
        <div>Test Content</div>
      </PrintLayout>
    );
    
    // Check header elements
    expect(screen.getByTestId('print-header')).toBeInTheDocument();
    expect(screen.getByAltText(/EdPsych Connect Logo/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Report/i)).toBeInTheDocument();
  });

  it('renders print footer with page information', () => {
    render(
      <PrintLayout title="Test Report">
        <div>Test Content</div>
      </PrintLayout>
    );
    
    // Check footer elements
    expect(screen.getByTestId('print-footer')).toBeInTheDocument();
    expect(screen.getByText(/Page/i)).toBeInTheDocument();
  });

  it('renders print button that triggers print dialogue', () => {
    // Mock window.print
    const originalPrint = window.print;
    window.print = vi.fn();
    
    render(
      <PrintLayout title="Test Report">
        <div>Test Content</div>
      </PrintLayout>
    );
    
    // Find and click print button
    const printButton = screen.getByRole('button', { name: /Print/i });
    fireEvent.click(printButton);
    
    // Check that print was called
    expect(window.print).toHaveBeenCalled();
    
    // Restore original print function
    window.print = originalPrint;
  });

  it('renders download PDF button', () => {
    render(
      <PrintLayout title="Test Report">
        <div>Test Content</div>
      </PrintLayout>
    );
    
    // Check that download button is present
    expect(screen.getByRole('button', { name: /Download PDF/i })).toBeInTheDocument();
  });

  it('applies page break classes correctly', () => {
    render(
      <PrintLayout title="Test Report">
        <div data-testid="section-1" className="page-break-after">Section 1</div>
        <div data-testid="section-2">Section 2</div>
      </PrintLayout>
    );
    
    // Check that page break class is applied
    expect(screen.getByTestId('section-1')).toHaveClass('page-break-after');
  });

  it('handles multiple pages correctly', () => {
    render(
      <PrintLayout title="Test Report" pages={3}>
        <div>Test Content</div>
      </PrintLayout>
    );
    
    // Check that page indicators are present
    expect(screen.getByText(/Page 1 of 3/i)).toBeInTheDocument();
  });

  it('applies print-specific styles', () => {
    render(
      <PrintLayout title="Test Report">
        <div>Test Content</div>
      </PrintLayout>
    );
    
    // Check that print-specific container has appropriate classes
    const printContainer = screen.getByTestId('print-container');
    expect(printContainer).toHaveClass('print-layout');
  });

  it('includes metadata in document head', async () => {
    // This is a bit tricky to test directly, but we can check if the component
    // attempts to set document title which is one aspect of metadata
    const originalTitle = document.title;
    
    render(
      <PrintLayout title="Test Report" author="Test Author">
        <div>Test Content</div>
      </PrintLayout>
    );
    
    // Check if document title was updated
    await waitFor(() => {
      expect(document.title).toContain('Test Report');
    });
    
    // Restore original title
    document.title = originalTitle;
  });
});
