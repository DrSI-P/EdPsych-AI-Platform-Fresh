'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';
import { MilestoneStatus } from '@/lib/collaborative-learning/types';

/**
 * Project Milestone Timeline Component
 * 
 * Displays project milestones in a visual timeline format.
 */
export function ProjectMilestoneTimeline({ milestones, projectId }) {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No milestones have been created for this project yet.</p>
      </div>
    );
  }
  
  // Sort milestones by date
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-muted"></div>
      
      {/* Milestones */}
      <div className="space-y-8 relative">
        {sortedMilestones.map((milestone, index) => (
          <MilestoneCard 
            key={milestone.id} 
            milestone={milestone}
            isFirst={index === 0}
            isLast={index === sortedMilestones.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Milestone Card Component
 * 
 * Displays information about a project milestone
 */
function MilestoneCard({ milestone, isFirst, isLast }) {
  // Format date
  const dueDate = new Date(milestone.dueDate).toLocaleDateString();
  
  // Determine milestone status
  const isCompleted = milestone.status === MilestoneStatus.COMPLETED;
  const isUpcoming = milestone.status === MilestoneStatus.UPCOMING;
  const isInProgress = milestone.status === MilestoneStatus.IN_PROGRESS;
  const isOverdue = milestone.status === MilestoneStatus.OVERDUE;
  
  // Get status color
  const getStatusColor = () => {
    switch (milestone.status) {
      case MilestoneStatus.COMPLETED:
        return 'bg-green-500';
      case MilestoneStatus.IN_PROGRESS:
        return 'bg-blue-500';
      case MilestoneStatus.UPCOMING:
        return 'bg-gray-500';
      case MilestoneStatus.OVERDUE:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get status icon
  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    return <Clock className="h-6 w-6 text-muted-foreground" />;
  };
  
  return (
    <div className="flex">
      {/* Timeline marker */}
      <div className="relative flex items-center justify-center w-8 h-8 mr-4">
        <div className={`w-4 h-4 rounded-full ${getStatusColor()}`}></div>
      </div>
      
      {/* Milestone content */}
      <Card className="flex-1">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
            <h4 className="font-medium">{milestone.title}</h4>
            <div className="flex items-center gap-2">
              <Badge variant={isCompleted ? 'default' : isOverdue ? 'destructive' : 'outline'}>
                {milestone.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline">{dueDate}</Badge>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {milestone.description}
          </p>
          
          {milestone.deliverables && milestone.deliverables.length > 0 && (
            <div className="mt-2">
              <h5 className="text-sm font-medium mb-1">Deliverables:</h5>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {milestone.deliverables.map((deliverable, index) => (
                  <li key={index}>{deliverable}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center">
              {getStatusIcon()}
              <span className="text-xs ml-2 text-muted-foreground">
                {isCompleted 
                  ? `Completed on ${new Date(milestone.completedDate).toLocaleDateString()}` 
                  : isOverdue 
                    ? 'Overdue' 
                    : isInProgress 
                      ? 'In progress' 
                      : 'Upcoming'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
