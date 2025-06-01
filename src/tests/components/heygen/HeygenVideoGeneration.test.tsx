// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HeygenVideoGeneration } from '@/components/heygen/heygen-video-generation';

// Mock the heygen service
vi.mock('@/lib/heygen/heygen-service', () => ({
  createVideo: vi.fn().mockResolvedValue({ 
    id: 'test-video-id',
    status: 'processing'
  }),
  getVideoStatus: vi.fn().mockResolvedValue({
    id: 'test-video-id',
    status: 'completed',
    url: 'https://example.com/test-video.mp4'
  }),
  getAvatars: vi.fn().mockResolvedValue([
    { id: 'avatar1', name: 'Teacher Emma', thumbnail: 'https://example.com/emma.jpg' },
    { id: 'avatar2', name: 'Professor James', thumbnail: 'https://example.com/james.jpg' }
  ]),
  getVoices: vi.fn().mockResolvedValue([
    { id: 'voice1', name: 'British Female', language: 'en-GB' },
    { id: 'voice2', name: 'American Male', language: 'en-US' }
  ])
}));

describe('HeygenVideoGeneration Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders video generation form correctly', async () => {
    render(<HeygenVideoGeneration />);
    
    // Check that the component renders with the title
    expect(screen.getByText(/Create AI Avatar Video/i)).toBeInTheDocument();
    
    // Check that script input is present
    expect(screen.getByLabelText(/Script/i)).toBeInTheDocument();
    
    // Wait for avatars to load
    await waitFor(() => {
      expect(screen.getByText(/Teacher Emma/i)).toBeInTheDocument();
      expect(screen.getByText(/Professor James/i)).toBeInTheDocument();
    });
    
    // Wait for voices to load
    await waitFor(() => {
      expect(screen.getByText(/British Female/i)).toBeInTheDocument();
      expect(screen.getByText(/American Male/i)).toBeInTheDocument();
    });
  });

  it('loads avatars and voices on mount', async () => {
    const heygenService = await import('@/lib/heygen/heygen-service');
    
    render(<HeygenVideoGeneration />);
    
    // Check that avatar and voice services were called
    expect(heygenService.getAvatars).toHaveBeenCalled();
    expect(heygenService.getVoices).toHaveBeenCalled();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Teacher Emma/i)).toBeInTheDocument();
      expect(screen.getByText(/British Female/i)).toBeInTheDocument();
    });
  });

  it('submits video generation request when form is submitted', async () => {
    const heygenService = await import('@/lib/heygen/heygen-service');
    
    render(<HeygenVideoGeneration />);
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Script/i)).toBeInTheDocument();
    });
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Script/i), {
      target: { value: 'This is a test script for the AI avatar video.' }
    });
    
    // Wait for avatars and voices to load
    await waitFor(() => {
      expect(screen.getByText(/Teacher Emma/i)).toBeInTheDocument();
      expect(screen.getByText(/British Female/i)).toBeInTheDocument();
    });
    
    // Select avatar and voice
    fireEvent.click(screen.getByText(/Teacher Emma/i));
    fireEvent.click(screen.getByText(/British Female/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Video/i }));
    
    // Check that video creation was called with correct parameters
    await waitFor(() => {
      expect(heygenService.createVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          avatar_id: 'avatar1',
          voice_id: 'voice1',
          script: 'This is a test script for the AI avatar video.'
        })
      );
    });
    
    // Check that processing status is displayed
    expect(screen.getByText(/Processing your video/i)).toBeInTheDocument();
  });

  it('polls for video status after submission', async () => {
    const heygenService = await import('@/lib/heygen/heygen-service');
    
    // Mock timers for polling
    vi.useFakeTimers();
    
    render(<HeygenVideoGeneration />);
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Script/i)).toBeInTheDocument();
    });
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Script/i), {
      target: { value: 'This is a test script for the AI avatar video.' }
    });
    
    // Wait for avatars and voices to load
    await waitFor(() => {
      expect(screen.getByText(/Teacher Emma/i)).toBeInTheDocument();
      expect(screen.getByText(/British Female/i)).toBeInTheDocument();
    });
    
    // Select avatar and voice
    fireEvent.click(screen.getByText(/Teacher Emma/i));
    fireEvent.click(screen.getByText(/British Female/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Video/i }));
    
    // Wait for initial submission
    await waitFor(() => {
      expect(heygenService.createVideo).toHaveBeenCalled();
    });
    
    // Advance timers to trigger polling
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    
    // Check that status check was called
    expect(heygenService.getVideoStatus).toHaveBeenCalledWith('test-video-id');
    
    // Check that completed status is displayed
    await waitFor(() => {
      expect(screen.getByText(/Video generation complete/i)).toBeInTheDocument();
    });
    
    // Check that video player is displayed
    expect(screen.getByTestId('video-player')).toBeInTheDocument();
    expect(screen.getByTestId('video-player')).toHaveAttribute('src', 'https://example.com/test-video.mp4');
    
    // Restore real timers
    vi.useRealTimers();
  });

  it('handles video generation errors gracefully', async () => {
    const heygenService = await import('@/lib/heygen/heygen-service');
    heygenService.createVideo.mockRejectedValue(new Error('Video generation failed'));
    
    render(<HeygenVideoGeneration />);
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Script/i)).toBeInTheDocument();
    });
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Script/i), {
      target: { value: 'This is a test script for the AI avatar video.' }
    });
    
    // Wait for avatars and voices to load
    await waitFor(() => {
      expect(screen.getByText(/Teacher Emma/i)).toBeInTheDocument();
      expect(screen.getByText(/British Female/i)).toBeInTheDocument();
    });
    
    // Select avatar and voice
    fireEvent.click(screen.getByText(/Teacher Emma/i));
    fireEvent.click(screen.getByText(/British Female/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Video/i }));
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Error: Video generation failed/i)).toBeInTheDocument();
    });
    
    // Check that retry button is displayed
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
  });

  it('provides script templates for quick selection', async () => {
    render(<HeygenVideoGeneration />);
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Script/i)).toBeInTheDocument();
    });
    
    // Find and click template selector
    const templateButton = screen.getByRole('button', { name: /Use Template/i });
    fireEvent.click(templateButton);
    
    // Check that template options are displayed
    expect(screen.getByText(/Introduction to Course/i)).toBeInTheDocument();
    expect(screen.getByText(/Lesson Summary/i)).toBeInTheDocument();
    
    // Select a template
    fireEvent.click(screen.getByText(/Introduction to Course/i));
    
    // Check that script input is populated with template
    const scriptInput = screen.getByLabelText(/Script/i);
    expect(scriptInput.value).toContain('Welcome to this course');
  });

  it('allows saving generated videos to library', async () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(JSON.stringify([])),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    const heygenService = await import('@/lib/heygen/heygen-service');
    
    render(<HeygenVideoGeneration />);
    
    // Complete video generation process
    await waitFor(() => {
      expect(screen.getByLabelText(/Script/i)).toBeInTheDocument();
    });
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Script/i), {
      target: { value: 'This is a test script for the AI avatar video.' }
    });
    
    // Wait for avatars and voices to load
    await waitFor(() => {
      expect(screen.getByText(/Teacher Emma/i)).toBeInTheDocument();
      expect(screen.getByText(/British Female/i)).toBeInTheDocument();
    });
    
    // Select avatar and voice
    fireEvent.click(screen.getByText(/Teacher Emma/i));
    fireEvent.click(screen.getByText(/British Female/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Video/i }));
    
    // Wait for video to complete
    await waitFor(() => {
      expect(heygenService.createVideo).toHaveBeenCalled();
    });
    
    // Mock video completion
    heygenService.getVideoStatus.mockResolvedValue({
      id: 'test-video-id',
      status: 'completed',
      url: 'https://example.com/test-video.mp4'
    });
    
    // Wait for video to complete
    await waitFor(() => {
      expect(screen.getByText(/Video generation complete/i)).toBeInTheDocument();
    });
    
    // Find and click save button
    const saveButton = screen.getByRole('button', { name: /Save to Library/i });
    fireEvent.click(saveButton);
    
    // Check that video was saved to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'savedVideos',
      expect.stringContaining('test-video-id')
    );
    
    // Check for success message
    expect(screen.getByText(/Video saved to library/i)).toBeInTheDocument();
  });

  it('validates form inputs before submission', async () => {
    render(<HeygenVideoGeneration />);
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Script/i)).toBeInTheDocument();
    });
    
    // Submit form without filling it out
    fireEvent.click(screen.getByRole('button', { name: /Generate Video/i }));
    
    // Check for validation error messages
    expect(screen.getByText(/Please enter a script/i)).toBeInTheDocument();
    expect(screen.getByText(/Please select an avatar/i)).toBeInTheDocument();
    expect(screen.getByText(/Please select a voice/i)).toBeInTheDocument();
  });
});
