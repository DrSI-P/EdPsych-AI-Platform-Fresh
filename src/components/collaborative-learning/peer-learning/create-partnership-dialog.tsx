'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPeerPartnership } from '@/lib/collaborative-learning/api';
import { PeerLearningStatus } from '@/lib/collaborative-learning/types';

/**
 * Create Partnership Dialog Component
 * 
 * Dialog for creating a new peer learning partnership.
 */
export function CreatePartnershipDialog({ open, onOpenChange, onCreatePartnership, userId }) {
  const [formData, setFormData] = useState({
    subject: '',
    keyStage: '',
    curriculumObjectives: [''],
    tutorId: userId,
    tuteeId: '',
    status: PeerLearningStatus.PENDING
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.subject || !formData.keyStage || !formData.tuteeId) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Filter out empty curriculum objectives
    const filteredObjectives = formData.curriculumObjectives.filter(obj => obj.trim() !== '');
    if (filteredObjectives.length === 0) {
      setError('Please add at least one curriculum objective');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create partnership
      const newPartnership = await createPeerPartnership({
        ...formData,
        curriculumObjectives: filteredObjectives
      });
      
      onCreatePartnership(newPartnership);
    } catch (err) {
      console.error('Error creating partnership:', err);
      setError('Failed to create partnership. Please try again.');
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
  
  // Handle curriculum objective changes
  const handleObjectiveChange = (index, value) => {
    const updatedObjectives = [...formData.curriculumObjectives];
    updatedObjectives[index] = value;
    
    // Add a new empty field if this is the last one and it's not empty
    if (index === updatedObjectives.length - 1 && value.trim() !== '') {
      updatedObjectives.push('');
    }
    
    setFormData({
      ...formData,
      curriculumObjectives: updatedObjectives
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Peer Learning Partnership</DialogTitle>
          <DialogDescription>
            Set up a new peer learning partnership to help or be helped by another student.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* Subject */}
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
          
          {/* Key Stage */}
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
          
          {/* Partnership Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Your Role</Label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="role-tutor"
                  name="role"
                  className="mr-2"
                  checked={formData.tutorId === userId}
                  onChange={() => {
                    setFormData({
                      ...formData,
                      tutorId: userId,
                      tuteeId: ''
                    });
                  }}
                />
                <Label htmlFor="role-tutor" className="cursor-pointer">I want to tutor</Label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="role-tutee"
                  name="role"
                  className="mr-2"
                  checked={formData.tuteeId === userId}
                  onChange={() => {
                    setFormData({
                      ...formData,
                      tuteeId: userId,
                      tutorId: ''
                    });
                  }}
                />
                <Label htmlFor="role-tutee" className="cursor-pointer">I need tutoring</Label>
              </div>
            </div>
          </div>
          
          {/* Partner ID */}
          <div className="space-y-2">
            <Label htmlFor="partnerId">
              {formData.tutorId === userId ? 'Tutee ID' : 'Tutor ID'}
            </Label>
            <Input
              id="partnerId"
              value={formData.tutorId === userId ? formData.tuteeId : formData.tutorId}
              onChange={(e) => {
                if (formData.tutorId === userId) {
                  handleChange('tuteeId', e.target.value);
                } else {
                  handleChange('tutorId', e.target.value);
                }
              }}
              placeholder="Enter the user ID of your learning partner"
            />
            <p className="text-sm text-muted-foreground">
              In a real implementation, this would be a search or selection interface.
            </p>
          </div>
          
          {/* Curriculum Objectives */}
          <div className="space-y-2">
            <Label>Curriculum Objectives</Label>
            <p className="text-sm text-muted-foreground mb-2">
              What specific learning objectives will this partnership focus on?
            </p>
            
            {formData.curriculumObjectives.map((objective, index) => (
              <div key={index} className="mb-2">
                <Input
                  value={objective}
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                  placeholder={`Objective ${index + 1}`}
                />
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Partnership'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
