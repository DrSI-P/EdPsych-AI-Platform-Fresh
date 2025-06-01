'use client';

import React, { useState, useRef } from 'react';
import { useTheme } from '@/components/enhanced-theme-provider';
import AvatarService, { VideoGenerationOptions } from '@/lib/ai-avatar/avatar-service';

interface VideoGeneratorProps {
  avatarProfileId: string;
  onVideoGenerated?: (videoUrl: string) => void;
  className?: string;
}

/**
 * Video Generator Component
 * 
 * A component for creating AI avatar videos using predefined avatar profiles
 */
const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  avatarProfileId,
  onVideoGenerated,
  className = '',
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  
  // Form state
  const [script, setScript] = useState('');
  const [outputFormat, setOutputFormat] = useState<'mp4' | 'webm'>('mp4');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [background, setBackground] = useState<'classroom' | 'office' | 'neutral' | 'custom'>('neutral');
  const [includeSubtitles, setIncludeSubtitles] = useState(true);
  const [subtitleLanguage, setSubtitleLanguage] = useState('en');
  const [maxDuration, setMaxDuration] = useState(300); // 5 minutes
  const [callToActionText, setCallToActionText] = useState('');
  const [callToActionUrl, setCallToActionUrl] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed' | 'failed'>('idle');
  
  // For custom background
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  
  // Handle background image upload
  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Background image is too large. Maximum size is 10MB.');
      return;
    }
    
    // Check file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPEG and PNG images are supported for backgrounds.');
      return;
    }
    
    setBackgroundFile(file);
    setCustomBackgroundUrl(URL.createObjectURL(file));
    setError(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setGenerationStatus('generating');
    
    try {
      // Validate form
      if (!script.trim()) {
        throw new Error('Script is required');
      }
      
      if (script.length > 5000) {
        throw new Error('Script is too long. Maximum 5000 characters.');
      }
      
      // In a real implementation, this would use environment variables
      const avatarService = new AvatarService({
        defaultProvider: 'veed',
        veedApiKey: 'sample-key',
        simliApiKey: 'sample-key',
        elevenLabsApiKey: 'sample-key',
        heygenApiKey: 'sample-key',
      });
      
      // Create video generation options
      const options: VideoGenerationOptions = {
        script,
        avatarProfileId,
        outputFormat,
        resolution,
        background,
        includeSubtitles,
        subtitleLanguage,
        maxDuration,
      };
      
      // Add call to action if provided
      if (callToActionText) {
        options.callToAction = {
          text: callToActionText,
          url: callToActionUrl || undefined,
        };
      }
      
      // Add custom background if selected
      if (background === 'custom' && customBackgroundUrl) {
        options.customBackgroundUrl = customBackgroundUrl;
      }
      
      // Generate video
      const result = await avatarService.generateVideo(options);
      setVideoId(result.id);
      
      // Poll for video status
      const pollInterval = setInterval(async () => {
        try {
          const status = await avatarService.getVideoStatus(result.id);
          
          if (status.status === 'completed' && status.videoUrl) {
            clearInterval(pollInterval);
            setVideoUrl(status.videoUrl);
            setSuccess('Video generated successfully!');
            setGenerationStatus('completed');
            
            // Notify parent component
            if (onVideoGenerated) {
              onVideoGenerated(status.videoUrl);
            }
          } else if (status.status === 'failed') {
            clearInterval(pollInterval);
            setError(status.error || 'Failed to generate video');
            setGenerationStatus('failed');
          }
        } catch (err) {
          clearInterval(pollInterval);
          setError('Failed to check video status');
          setGenerationStatus('failed');
        }
      }, 5000); // Check every 5 seconds
      
      // For demo purposes, simulate completion after 10 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        const demoVideoUrl = 'https://example.com/demo-video.mp4';
        setVideoUrl(demoVideoUrl);
        setSuccess('Video generated successfully!');
        setGenerationStatus('completed');
        
        // Notify parent component
        if (onVideoGenerated) {
          onVideoGenerated(demoVideoUrl);
        }
      }, 10000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video');
      setGenerationStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get age-appropriate styling
  const getAgeSpecificStyles = () => {
    switch (ageGroup) {
      case 'nursery':
        return {
          containerClass: 'rounded-3xl p-6 bg-gradient-to-br from-purple-50 to-blue-50',
          headingClass: 'text-2xl font-bold text-purple-600',
          buttonClass: 'bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-2xl',
        };
      case 'early-primary':
        return {
          containerClass: 'rounded-2xl p-5 bg-gradient-to-br from-blue-50 to-green-50',
          headingClass: 'text-xl font-bold text-blue-600',
          buttonClass: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-5 rounded-xl',
        };
      case 'late-primary':
        return {
          containerClass: 'rounded-xl p-4 bg-gradient-to-br from-teal-50 to-blue-50',
          headingClass: 'text-lg font-semibold text-teal-600',
          buttonClass: 'bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg',
        };
      default: // secondary and professional
        return {
          containerClass: 'rounded-lg p-4 bg-gradient-to-br from-slate-50 to-blue-50',
          headingClass: 'text-lg font-medium text-slate-700',
          buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded',
        };
    }
  };
  
  const styles = getAgeSpecificStyles();
  
  return (
    <div className={`${styles.containerClass} ${className} shadow-md`}>
      <h2 className={styles.headingClass}>Create AI Avatar Video</h2>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {videoUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Generated Video</h3>
          <div className="aspect-video bg-black rounded overflow-hidden">
            <video 
              src={videoUrl} 
              controls 
              className="w-full h-full"
              poster="/images/video-placeholder.jpg"
            />
          </div>
        </div>
      )}
      
      {generationStatus === 'generating' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded">
          <div className="flex items-centre">
            <div className="mr-3">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium text-blue-700">Generating your video...</p>
              <p className="text-sm text-blue-600">This may take a few minutes depending on the length of your script.</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Script */}
        <div>
          <label htmlFor="video-script" className="block text-sm font-medium text-grey-700 mb-1">
            Script
          </label>
          <textarea
            id="video-script"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the script for your AI avatar to speak..."
            required
          />
          <p className="mt-1 text-sm text-grey-500">
            {script.length}/5000 characters
          </p>
        </div>
        
        {/* Output Format */}
        <div>
          <label htmlFor="output-format" className="block text-sm font-medium text-grey-700 mb-1">
            Output Format
          </label>
          <select
            id="output-format"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as 'mp4' | 'webm')}
            className="w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="mp4">MP4 (Recommended)</option>
            <option value="webm">WebM</option>
          </select>
        </div>
        
        {/* Resolution */}
        <div>
          <label htmlFor="resolution" className="block text-sm font-medium text-grey-700 mb-1">
            Resolution
          </label>
          <select
            id="resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value as '720p' | '1080p')}
            className="w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
          </select>
        </div>
        
        {/* Background */}
        <div>
          <label htmlFor="background" className="block text-sm font-medium text-grey-700 mb-1">
            Background
          </label>
          <select
            id="background"
            value={background}
            onChange={(e) => setBackground(e.target.value as 'classroom' | 'office' | 'neutral' | 'custom')}
            className="w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="classroom">Classroom</option>
            <option value="office">Office</option>
            <option value="neutral">Neutral</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        {/* Custom Background Upload */}
        {background === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-grey-700 mb-1">
              Custom Background
            </label>
            
            <div className="mt-1 flex items-centre">
              {customBackgroundUrl ? (
                <div className="relative">
                  <img 
                    src={customBackgroundUrl} 
                    alt="Background preview" 
                    className="h-24 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCustomBackgroundUrl(null);
                      setBackgroundFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    aria-label="Remove background"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => backgroundFileInputRef.current?.click()}
                  className="inline-flex items-centre px-4 py-2 border border-grey-300 rounded-md shadow-sm text-sm font-medium text-grey-700 bg-white hover:bg-grey-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5 text-grey-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  Upload Background
                </button>
              )}
              <input
                type="file"
                ref={backgroundFileInputRef}
                onChange={handleBackgroundChange}
                accept="image/jpeg,image/png"
                className="hidden"
              />
            </div>
            <p className="mt-2 text-sm text-grey-500">
              JPG or PNG. Max 10MB. Recommended: 16:9 aspect ratio.
            </p>
          </div>
        )}
        
        {/* Subtitles */}
        <div className="flex items-centre">
          <input
            id="include-subtitles"
            type="checkbox"
            checked={includeSubtitles}
            onChange={(e) => setIncludeSubtitles(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-grey-300 rounded"
          />
          <label htmlFor="include-subtitles" className="ml-2 block text-sm text-grey-700">
            Include subtitles
          </label>
        </div>
        
        {/* Subtitle Language */}
        {includeSubtitles && (
          <div>
            <label htmlFor="subtitle-language" className="block text-sm font-medium text-grey-700 mb-1">
              Subtitle Language
            </label>
            <select
              id="subtitle-language"
              value={subtitleLanguage}
              onChange={(e) => setSubtitleLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>
        )}
        
        {/* Call to Action */}
        <div>
          <div className="flex items-centre justify-between">
            <label htmlFor="call-to-action" className="block text-sm font-medium text-grey-700">
              Call to Action (Optional)
            </label>
          </div>
          <input
            id="call-to-action"
            type="text"
            value={callToActionText}
            onChange={(e) => setCallToActionText(e.target.value)}
            placeholder="e.g., Learn More, Subscribe, Visit Website"
            className="mt-1 w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Call to Action URL */}
        {callToActionText && (
          <div>
            <label htmlFor="call-to-action-url" className="block text-sm font-medium text-grey-700 mb-1">
              Call to Action URL (Optional)
            </label>
            <input
              id="call-to-action-url"
              type="url"
              value={callToActionUrl}
              onChange={(e) => setCallToActionUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
        
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.buttonClass} w-full flex justify-centre items-centre transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Video'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoGenerator;
