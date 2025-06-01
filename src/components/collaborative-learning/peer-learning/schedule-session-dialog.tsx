'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { schedulePeerSession } from '@/lib/collaborative-learning/api';
import { SessionType } from '@/lib/collaborative-learning/types';

/**
 * Schedule Session Dialog Component
 * 
 * Dialog for scheduling a peer learning session.
 */
export function ScheduleSessionDialog({ open, onOpenChange, onScheduleSession, userId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    keyStage: '',
    sessionType: SessionType.ONE_ON_ONE,
    date: null,
    startTime: '',
    endTime: '',
    location: '',
    maxParticipants: 2,
    hostId: userId,
    participants: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.subject || !formData.keyStage || 
        !formData.date || !formData.startTime || !formData.endTime) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Format date and times
      const formattedDate = format(formData.date, 'yyyy-MM-dd');
      
      // Create session
      const newSession = await schedulePeerSession({
        ...formData,
        date: formattedDate,
        createdAt: new Date().toISOString(),
        status: 'scheduled'
      });
      
      onScheduleSession(newSession);
    } catch (err) {
      console.error('Error scheduling session:', err);
      setError('Failed to schedule session. Please try again.');
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
    
    // Update max participants based on session type
    if (field === 'sessionType') {
      if (value === SessionType.ONE_ON_ONE) {
        setFormData(prev => ({ ...prev, maxParticipants: 2 }));
      } else if (value === SessionType.GROUP) {
        setFormData(prev => ({ ...prev, maxParticipants: 6 }));
      }
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule Peer Learning Session</DialogTitle>
          <DialogDescription>
            Set up a session to learn together with your peers.
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
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter a descriptive title for your session"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what you'll be learning or discussing"
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
          
          {/* Session Type */}
          <div className="space-y-2">
            <Label htmlFor="sessionType">Session Type</Label>
            <Select 
              value={formData.sessionType} 
              onValueChange={(value) => handleChange('sessionType', value)}
            >
              <SelectTrigger id="sessionType">
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SessionType.ONE_ON_ONE}>One-on-One</SelectItem>
                <SelectItem value={SessionType.GROUP}>Group (up to 6)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleChange('date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Online or physical location (e.g., Library, Classroom 3, Zoom)"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Schedule Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
