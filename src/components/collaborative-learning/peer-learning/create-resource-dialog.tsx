'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createStudentResource } from '@/lib/collaborative-learning/api';

/**
 * Create Resource Dialog Component
 * 
 * Dialog for creating a new student resource.
 */
export function CreateResourceDialog({ open, onOpenChange, onCreateResource, userId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    keyStage: '',
    contentType: 'text',
    content: '',
    tags: '',
    creatorId: userId,
    approved: false,
    averageRating: 0,
    reviews: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.subject || !formData.keyStage || !formData.contentType) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Process tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      // Create resource
      const newResource = await createStudentResource({
        ...formData,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      onCreateResource(newResource);
    } catch (err) {
      console.error('Error creating resource:', err);
      setError('Failed to create resource. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Learning Resource</DialogTitle>
          <DialogDescription>
            Share a resource to help other students learn.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Resource Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter a descriptive title for your resource"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what this resource is about and how it helps with learning"
              rows={3}
            />
          </div>
          
          {/* Subject and Key Stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={formData.subject} 
                onValueChange={(value) => handleChange('subject', value)}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Geography">Geography</SelectItem>
                  <SelectItem value="Art">Art</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Physical Education">Physical Education</SelectItem>
                  <SelectItem value="Computing">Computing</SelectItem>
                  <SelectItem value="Modern Foreign Languages">Modern Foreign Languages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keyStage">Key Stage</Label>
              <Select 
                value={formData.keyStage} 
                onValueChange={(value) => handleChange('keyStage', value)}
              >
                <SelectTrigger id="keyStage">
                  <SelectValue placeholder="Select a key stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KS1">KS1</SelectItem>
                  <SelectItem value="KS2">KS2</SelectItem>
                  <SelectItem value="KS3">KS3</SelectItem>
                  <SelectItem value="KS4">KS4</SelectItem>
                  <SelectItem value="KS5">KS5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Content Type */}
          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select 
              value={formData.contentType} 
              onValueChange={(value) => handleChange('contentType', value)}
            >
              <SelectTrigger id="contentType">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="link">External Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            {formData.contentType === 'text' ? (
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Enter your content here"
                rows={5}
              />
            ) : formData.contentType === 'link' ? (
              <Input
                id="content"
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Enter URL (e.g., https://example.com)"
              />
            ) : (
              <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                <p className="text-muted-foreground mb-2">
                  {formData.contentType === 'image' && 'Upload an image'}
                  {formData.contentType === 'video' && 'Upload a video'}
                  {formData.contentType === 'audio' && 'Upload an audio file'}
                  {formData.contentType === 'document' && 'Upload a document'}
                </p>
                <Button type="button" variant="outline">
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  In a real implementation, this would be a file upload component
                </p>
              </div>
            )}
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas (e.g., algebra, equations, visual learning)"
            />
            <p className="text-sm text-muted-foreground">
              Tags help others find your resource more easily
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Resource'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
