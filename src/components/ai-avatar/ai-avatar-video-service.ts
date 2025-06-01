'use client';

import React, { useState, useEffect } from 'react';
import { AIAvatarVideo, AIAvatarVideoCategory, AIAvatarVideoAudience } from './types';

/**
 * Service for managing AI Avatar videos
 */
export class AIAvatarVideoService {
  private static instance: AIAvatarVideoService;
  private videos: any[] = [];
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): AIAvatarVideoService {
    if (!AIAvatarVideoService.instance) {
      AIAvatarVideoService.instance = new AIAvatarVideoService();
    }
    return AIAvatarVideoService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // In a production environment, this would fetch from an API
      // For now, we'll load our predefined video metadata
      this.videos = await this.loadVideoMetadata();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AI Avatar Video Service:', error);
      throw error;
    }
  }

  public async getVideo(id: string): Promise<AIAvatarVideo> {
    await this.ensureInitialized();
    const video = this.videos.find(v => v.id === id);
    if (!video) {
      throw new Error(`Video with ID ${id} not found`);
    }
    return video;
  }

  public async getVideosByCategory(category: AIAvatarVideoCategory): Promise<AIAvatarVideo[]> {
    await this.ensureInitialized();
    return this.videos.filter(v => v.category === category);
  }

  public async getVideosByAudience(audience: AIAvatarVideoAudience): Promise<AIAvatarVideo[]> {
    await this.ensureInitialized();
    return this.videos.filter(v => v.audience === audience);
  }

  public async getFeaturedVideos(): Promise<AIAvatarVideo[]> {
    await this.ensureInitialized();
    return this.videos.filter(v => v.featured);
  }

  public async searchVideos(query: string): Promise<AIAvatarVideo[]> {
    await this.ensureInitialized();
    const lowerQuery = query.toLowerCase();
    return this.videos.filter(v => 
      v.title.toLowerCase().includes(lowerQuery) || 
      v.description.toLowerCase().includes(lowerQuery) ||
      v.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  public async getAllVideos(): Promise<AIAvatarVideo[]> {
    await this.ensureInitialized();
    return [...this.videos];
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  private async loadVideoMetadata(): Promise<AIAvatarVideo[]> {
    // In production, this would fetch from an API or database
    // For now, we'll return our predefined video metadata
    return [
      {
        id: 'executive-summary',
        title: 'EdPsych Connect: Executive Summary',
        description: 'A concise overview of EdPsych Connect, its mission, and core value proposition for all stakeholders.',
        category: AIAvatarVideoCategory.CORE_PLATFORM,
        audience: AIAvatarVideoAudience.ALL,
        duration: 165, // 2:45 minutes
        scriptPath: '/docs/video_scripts/executive_summary_script.md',
        featured: true,
        tags: ['overview', 'introduction', 'mission'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'platform-features-overview',
        title: 'EdPsych Connect: Platform Features Comprehensive Overview',
        description: 'A detailed walkthrough of all major platform components and what makes them unique.',
        category: AIAvatarVideoCategory.CORE_PLATFORM,
        audience: AIAvatarVideoAudience.ALL,
        duration: 420, // 7:00 minutes
        scriptPath: '/docs/video_scripts/platform_features_overview_script.md',
        featured: true,
        tags: ['features', 'overview', 'functionality'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'educational-psychology-foundations',
        title: 'Educational Psychology Foundations',
        description: 'An explanation of the educational psychology principles that inspired the platform and how they\'re implemented.',
        category: AIAvatarVideoCategory.INSPIRATIONAL,
        audience: AIAvatarVideoAudience.ALL,
        duration: 240, // 4:00 minutes
        scriptPath: '/docs/video_scripts/educational_psychology_foundations_script.md',
        featured: true,
        tags: ['educational psychology', 'principles', 'foundations'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Additional videos would be added here
      // For brevity, we're only including the first few
    ];
  }
}

export default AIAvatarVideoService;
