'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createForumTopic } from '@/lib/collaborative-learning/api';
import { ForumCategory, PostVisibility } from '@/lib/collaborative-learning/types';

/**
 * Create Topic Dialog Component
 * 
 * Dialog for creating a new forum topic.
 */
export function CreateTopicDialog({ open, onOpenChange, onCreateTopic, userId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ForumCategory.GENERAL,
    tags: '',
    visibility: PostVisibility.PUBLIC,
    createdBy: userId
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.category) {
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
      
      // Create topic
      const newTopic = await createForumTopic({
        ...formData,
        tags,
        createdAt: new Date().toISOString(),
        lastPostAt: new Date().toISOString(),
        viewCount: 0,
        replyCount: 0
      });
      
      onCreateTopic(newTopic);
    } catch (err) {
      console.error('Error creating topic:', err);
      setError('Failed to create topic. Please try again.');
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
          <DialogDescription>
            Start a new discussion topic in the forum.
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
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter a descriptive title for your topic"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Provide details about your topic"
              rows={4}
            />
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ForumCategory.GENERAL}>General</SelectItem>
                <SelectItem value={ForumCategory.SUBJECT_SPECIFIC}>Subject Specific</SelectItem>
                <SelectItem value={ForumCategory.HELP_REQUESTS}>Help Requests</SelectItem>
                <SelectItem value={ForumCategory.STUDY_GROUPS}>Study Groups</SelectItem>
                <SelectItem value={ForumCategory.ANNOUNCEMENTS}>Announcements</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas (e.g., maths, algebra, equations)"
            />
            <p className="text-sm text-muted-foreground">
              Tags help others find your topic more easily
            </p>
          </div>
          
          {/* Visibility */}
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select 
              value={formData.visibility} 
              onValueChange={(value) => handleChange('visibility', value)}
            >
              <SelectTrigger id="visibility">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PostVisibility.PUBLIC}>Public (visible to everyone)</SelectItem>
                <SelectItem value={PostVisibility.CLASS_ONLY}>Class Only (visible to your class)</SelectItem>
                <SelectItem value={PostVisibility.EDUCATORS_ONLY}>Educators Only (visible to educators)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Topic'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
