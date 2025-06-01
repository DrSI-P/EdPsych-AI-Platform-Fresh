/**
 * HEYGEN API Integration for EdPsych AI Education Platform
 * 
 * This file provides a comprehensive integration with the HEYGEN API
 * for AI avatar video generation and management.
 */

import axios, { AxiosInstance } from 'axios';

// Types
export interface HeygenAvatar {
  id: string;
  name: string;
  thumbnail: string;
  gender?: string;
  age?: string;
  style?: string;
}

export interface HeygenVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  created_at: string;
  avatar: { id: string; name: string };
  duration: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description?: string;
  createdAt?: Date;
  metadata?: Record<string, any>;
}

export interface VideoGenerationRequest {
  avatar_id: string;
  text: string;
  voice_id?: string;
  title?: string;
  description?: string;
  background?: string;
  webhook_url?: string;
  metadata?: Record<string, any>;
}

export interface VideoGenerationResponse {
  id: string;
  status: 'pending' | 'processing';
  estimated_completion_time?: string;
}

export interface HeygenVoice {
  id: string;
  name: string;
  language: string;
  gender: string;
  preview_url?: string;
}

// Main API Class
export class HeygenAPI {
  private static instance: HeygenAPI;
  private apiKey: string = '';
  private baseUrl: string = 'https://api.heygen.com';
  private initialized: boolean = false;
  private axiosInstance: AxiosInstance;

  private constructor() {
    // Private constructor to enforce singleton pattern
    this.axiosInstance = axios.create();
  }

  /**
   * Get the singleton instance of HeygenAPI
   */
  public static getInstance(): HeygenAPI {
    if (!HeygenAPI.instance) {
      HeygenAPI.instance = new HeygenAPI();
    }
    return HeygenAPI.instance;
  }

  /**
   * Initialize the API with credentials
   * @param apiKey HEYGEN API key
   * @param baseUrl Optional custom base URL
   */
  public initialize(apiKey: string, baseUrl?: string): void {
    this.apiKey = apiKey;
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
    
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    this.initialized = true;
  }

  /**
   * Check if the API is initialized
   */
  private checkInitialized(): void {
    if (!this.initialized) {
      throw new Error('HeygenAPI not initialized. Call initialize() first with a valid API key.');
    }
  }

  /**
   * Get all available avatars
   */
  public async getAvatars(): Promise<HeygenAvatar[]> {
    this.checkInitialized();
    try {
      const response = await this.axiosInstance.get('/v1/avatars');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching avatars:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get all videos for the account
   */
  public async getVideos(): Promise<HeygenVideo[]> {
    this.checkInitialized();
    try {
      const response = await this.axiosInstance.get('/v1/videos');
      return response.data.data.map((video) => this.formatVideoResponse(video));
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get a specific video by ID
   * @param id Video ID
   */
  public async getVideo(id: string): Promise<HeygenVideo> {
    this.checkInitialized();
    try {
      const response = await this.axiosInstance.get(`/v1/videos/${id}`);
      return this.formatVideoResponse(response.data);
    } catch (error) {
      console.error(`Error fetching video ${id}:`, error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Generate a new video
   * @param request Video generation request
   */
  public async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    this.checkInitialized();
    try {
      const response = await this.axiosInstance.post('/v1/videos', request);
      return {
        id: response.data.id,
        status: response.data.status,
        estimated_completion_time: response.data.estimated_completion_time
      };
    } catch (error) {
      console.error('Error generating video:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Delete a video
   * @param id Video ID
   */
  public async deleteVideo(id: string): Promise<{ success: boolean }> {
    this.checkInitialized();
    try {
      await this.axiosInstance.delete(`/v1/videos/${id}`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting video ${id}:`, error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get available voices
   */
  public async getVoices(): Promise<HeygenVoice[]> {
    this.checkInitialized();
    try {
      const response = await this.axiosInstance.get('/v1/voices');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Format video response to match our interface
   */
  private formatVideoResponse(video): HeygenVideo {
    return {
      id: video.id,
      title: video.title || 'Untitled Video',
      thumbnail: video.thumbnail_url || '',
      url: video.url || '',
      created_at: video.created_at,
      avatar: {
        id: video.avatar?.id || '',
        name: video.avatar?.name || 'Unknown Avatar'
      },
      duration: video.duration || 0,
      status: video.status,
      description: video.description || '',
      createdAt: video.created_at ? new Date(video.created_at) : new Date(),
      metadata: video.metadata || {}
    };
  }

  /**
   * Handle API errors
   */
  private handleApiError(error): Error {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const message = error.response.data?.message || 'Unknown API error';
      
      if (status === 401) {
        return new Error('Authentication failed. Please check your API key.');
      } else if (status === 403) {
        return new Error('Access forbidden. Your account may not have permission for this action.');
      } else if (status === 429) {
        return new Error('Rate limit exceeded. Please try again later.');
      }
      
      return new Error(`API Error (${status}): ${message}`);
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('No response received from HEYGEN API. Please check your network connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error(`Error setting up request: ${error.message}`);
    }
  }
}

export default HeygenAPI;
