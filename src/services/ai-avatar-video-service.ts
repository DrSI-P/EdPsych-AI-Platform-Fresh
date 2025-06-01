/**
 * AI Avatar Video Service
 * 
 * This service handles interactions with the AI Avatar Video generation API
 * for creating and managing educational videos with AI avatars.
 */

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  url: string | null;
  thumbnail: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoGenerationOptions {
  avatarProfileId: string;
  script: string;
  title: string;
  description?: string;
  voiceId?: string;
  language?: string;
  settings?: {
    background?: string;
    resolution?: '720p' | '1080p';
    aspectRatio?: '16:9' | '4:3' | '1:1';
  };
}

export class AIAvatarVideoService {
  private apiUrl: string;
  
  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/ai-avatar-videos';
  }
  
  /**
   * Generate a new AI avatar video
   * @param options Video generation options
   * @returns Promise with the generated video metadata
   */
  async generateVideo(options: VideoGenerationOptions): Promise<VideoMetadata> {
    try {
      const response = await fetch(`${this.apiUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate video: ${response.statusText}`);
      }
      
      const data = await response.json();
      return this.normalizeVideoData(data);
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  }
  
  /**
   * Get a list of all videos for the current user
   * @returns Promise with an array of video metadata
   */
  async getAllVideos(): Promise<VideoMetadata[]> {
    try {
      const response = await fetch(`${this.apiUrl}/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.videos.map(this.normalizeVideoData);
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }
  
  /**
   * Get the status and metadata of a specific video
   * @param videoId The ID of the video to check
   * @returns Promise with the video metadata
   */
  async getVideoStatus(videoId: string): Promise<VideoMetadata> {
    try {
      const response = await fetch(`${this.apiUrl}/${videoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch video status: ${response.statusText}`);
      }
      
      const data = await response.json();
      return this.normalizeVideoData(data);
    } catch (error) {
      console.error('Error fetching video status:', error);
      throw error;
    }
  }
  
  /**
   * Delete a video
   * @param videoId The ID of the video to delete
   * @returns Promise indicating success
   */
  async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }
  
  /**
   * Normalize video data from API response
   * @param data Raw video data from API
   * @returns Normalized VideoMetadata object
   */
  private normalizeVideoData(data): VideoMetadata {
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status,
      url: data.url,
      thumbnail: data.thumbnail,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}
