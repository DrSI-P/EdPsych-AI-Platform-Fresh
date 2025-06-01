'use client';

import React, { useState, useRef } from 'react';
import { useTheme } from '@/components/enhanced-theme-provider';
import AvatarService, { AvatarProfile, VideoGenerationOptions } from '@/lib/ai-avatar/avatar-service';

interface AvatarCreatorProps {
  onAvatarCreated?: (avatarId: string) => void;
  defaultAgeGroup?: 'nursery' | 'early-primary' | 'late-primary' | 'secondary' | 'professional';
  className?: string;
}

/**
 * Avatar Creator Component
 * 
 * A component for creating and customising AI avatars for educational videos
 */
const AvatarCreator: React.FC<AvatarCreatorProps> = ({
  onAvatarCreated,
  defaultAgeGroup = 'secondary',
  className = '',
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [provider, setProvider] = useState<'simli' | 'veed' | 'elevenlabs' | 'heygen' | 'custom'>('veed');
  const [style, setStyle] = useState<'formal' | 'casual' | 'friendly' | 'enthusiastic'>('friendly');
  const [accent, setAccent] = useState('en-GB');
  const [targetAgeGroup, setTargetAgeGroup] = useState(defaultAgeGroup);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file is too large. Maximum size is 5MB.');
      return;
    }
    
    // Check file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPEG and PNG images are supported.');
      return;
    }
    
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate form
      if (!name.trim()) {
        throw new Error('Avatar name is required');
      }
      
      // In a real implementation, this would use environment variables
      const avatarService = new AvatarService({
        defaultProvider: provider,
        veedApiKey: 'sample-key',
        simliApiKey: 'sample-key',
        elevenLabsApiKey: 'sample-key',
        heygenApiKey: 'sample-key',
      });
      
      // Create avatar profile
      const profile: Omit<AvatarProfile, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        provider,
        style,
        ageGroup: targetAgeGroup,
        accentPreference: accent,
      };
      
      // In a real implementation, this would upload the image and get a URL
      if (imageFile && previewUrl) {
        profile.imageUrl = previewUrl;
      }
      
      // Create avatar
      const createdAvatar = await avatarService.createAvatarProfile(profile);
      
      setSuccess(`Avatar "${name}" created successfully!`);
      
      // Notify parent component
      if (onAvatarCreated) {
        onAvatarCreated(createdAvatar.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create avatar');
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
      <h2 className={styles.headingClass}>Create AI Avatar</h2>
      
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
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Avatar Name */}
        <div>
          <label htmlFor="avatar-name" className="block text-sm font-medium text-grey-700 mb-1">
            Avatar Name
          </label>
          <input
            id="avatar-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Dr. Scott"
            required
          />
        </div>
        
        {/* Avatar Provider */}
        <div>
          <label htmlFor="avatar-provider" className="block text-sm font-medium text-grey-700 mb-1">
            Avatar Provider
          </label>
          <select
            id="avatar-provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value as any)}
            className="w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="veed">VEED.IO</option>
            <option value="simli">Simli</option>
            <option value="elevenlabs">ElevenLabs</option>
            <option value="heygen">HeyGen</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        {/* Avatar Style */}
        <div>
          <label htmlFor="avatar-style" className="block text-sm font-medium text-grey-700 mb-1">
            Presentation Style
          </label>
          <select
            id="avatar-style"
            value={style}
            onChange={(e) => setStyle(e.target.value as any)}
            className="w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
        </div>
        
        {/* Voice Accent */}
        <div>
          <label htmlFor="avatar-accent" className="block text-sm font-medium text-grey-700 mb-1">
            Voice Accent
          </label>
          <select
            id="avatar-accent"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="en-GB">British English</option>
            <option value="en-US">American English</option>
            <option value="en-AU">Australian English</option>
            <option value="en-IN">Indian English</option>
            <option value="en-ZA">South African English</option>
          </select>
        </div>
        
        {/* Target Age Group */}
        <div>
          <label htmlFor="target-age-group" className="block text-sm font-medium text-grey-700 mb-1">
            Target Audience
          </label>
          <select
            id="target-age-group"
            value={targetAgeGroup}
            onChange={(e) => setTargetAgeGroup(e.target.value as any)}
            className="w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="nursery">Nursery (Ages 3-5)</option>
            <option value="early-primary">Early Primary (Ages 5-8)</option>
            <option value="late-primary">Late Primary (Ages 8-11)</option>
            <option value="secondary">Secondary (Ages 11+)</option>
            <option value="professional">Professional (Educators & Parents)</option>
          </select>
        </div>
        
        {/* Avatar Image Upload */}
        <div>
          <label className="block text-sm font-medium text-grey-700 mb-1">
            Avatar Image (Optional)
          </label>
          
          <div className="mt-1 flex items-centre">
            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Avatar preview" 
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setImageFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  aria-label="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-centre px-4 py-2 border border-grey-300 rounded-md shadow-sm text-sm font-medium text-grey-700 bg-white hover:bg-grey-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-grey-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Upload Image
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/png"
              className="hidden"
            />
          </div>
          <p className="mt-2 text-sm text-grey-500">
            JPG or PNG. Max 5MB. Recommended: square image with clear face.
          </p>
        </div>
        
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
                Creating...
              </>
            ) : (
              'Create Avatar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvatarCreator;
