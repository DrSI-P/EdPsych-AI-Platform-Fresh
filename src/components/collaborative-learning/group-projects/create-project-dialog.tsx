'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createGroupProject } from '@/lib/collaborative-learning/api';
import { ProjectStatus, ProjectRole } from '@/lib/collaborative-learning/types';

/**
 * Create Project Dialog Component
 * 
 * Dialog for creating a new group project.
 */
export function CreateProjectDialog({ open, onOpenChange, onCreateProject, userId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    keyStage: '',
    startDate: '',
    endDate: '',
    curriculumObjectives: [''],
    assessmentCriteria: [''],
    status: ProjectStatus.PLANNING,
    members: [
      {
        userId: userId,
        role: ProjectRole.LEADER,
        contributionScore: 0
      }
    ],
    tasks: [],
    milestones: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.subject || !formData.keyStage || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Filter out empty curriculum objectives and assessment criteria
    const filteredObjectives = formData.curriculumObjectives.filter(obj => obj.trim() !== '');
    const filteredCriteria = formData.assessmentCriteria.filter(crit => crit.trim() !== '');
    
    if (filteredObjectives.length === 0) {
      setError('Please add at least one curriculum objective');
      return;
    }
    
    if (filteredCriteria.length === 0) {
      setError('Please add at least one assessment criterion');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create project
      const newProject = await createGroupProject({
        ...formData,
        curriculumObjectives: filteredObjectives,
        assessmentCriteria: filteredCriteria
      });
      
      onCreateProject(newProject);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
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
  
  // Handle assessment criteria changes
  const handleCriteriaChange = (index, value) => {
    const updatedCriteria = [...formData.assessmentCriteria];
    updatedCriteria[index] = value;
    
    // Add a new empty field if this is the last one and it's not empty
    if (index === updatedCriteria.length - 1 && value.trim() !== '') {
      updatedCriteria.push('');
    }
    
    setFormData({
      ...formData,
      assessmentCriteria: updatedCriteria
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Group Project</DialogTitle>
          <DialogDescription>
            Set up a new group project for collaborative learning.
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
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter a descriptive title for your project"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Provide details about your project"
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
          
          {/* Project Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </div>
          </div>
          
          {/* Curriculum Objectives */}
          <div className="space-y-2">
            <Label>Curriculum Objectives</Label>
            <p className="text-sm text-muted-foreground mb-2">
              What specific learning objectives will this project address?
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
          
          {/* Assessment Criteria */}
          <div className="space-y-2">
            <Label>Assessment Criteria</Label>
            <p className="text-sm text-muted-foreground mb-2">
              How will the project be assessed?
            </p>
            
            {formData.assessmentCriteria.map((criterion, index) => (
              <div key={index} className="mb-2">
                <Input
                  value={criterion}
                  onChange={(e) => handleCriteriaChange(index, e.target.value)}
                  placeholder={`Criterion ${index + 1}`}
                />
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
