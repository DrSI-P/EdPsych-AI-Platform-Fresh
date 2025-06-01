'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TaskStatus } from '@/lib/collaborative-learning/types';
import { updateProjectTask } from '@/lib/collaborative-learning/api';

/**
 * Project Task List Component
 * 
 * Displays and manages tasks for a group project.
 */
export function ProjectTaskList({ tasks, projectId, currentUserId }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No tasks have been created for this project yet.</p>
        <Button variant="link" className="mt-2">
          Create a task
        </Button>
      </div>
    );
  }
  
  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === TaskStatus.TODO);
  const inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
  const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED);
  
  return (
    <div className="space-y-6">
      {/* To Do Tasks */}
      <div>
        <h3 className="font-semibold text-lg mb-3">To Do</h3>
        <div className="space-y-2">
          {todoTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No tasks to do</p>
          ) : (
            todoTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                projectId={projectId}
                currentUserId={currentUserId}
              />
            ))
          )}
        </div>
      </div>
      
      {/* In Progress Tasks */}
      <div>
        <h3 className="font-semibold text-lg mb-3">In Progress</h3>
        <div className="space-y-2">
          {inProgressTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No tasks in progress</p>
          ) : (
            inProgressTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                projectId={projectId}
                currentUserId={currentUserId}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Completed Tasks */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Completed</h3>
        <div className="space-y-2">
          {completedTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No completed tasks</p>
          ) : (
            completedTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                projectId={projectId}
                currentUserId={currentUserId}
              />
            ))
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button>
          Add New Task
        </Button>
      </div>
    </div>
  );
}

/**
 * Task Card Component
 * 
 * Displays information about a project task
 */
function TaskCard({ task, projectId, currentUserId }) {
  // Format dates
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
  
  // Check if current user is assigned to this task
  const isAssigned = task.assignedTo === currentUserId;
  
  // Handle task status change
  const handleStatusChange = async (checked) => {
    try {
      const newStatus = checked ? TaskStatus.COMPLETED : TaskStatus.IN_PROGRESS;
      await updateProjectTask(projectId, task.id, { status: newStatus });
      // In a real implementation, we would update the UI state here
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={task.status === TaskStatus.COMPLETED}
            onCheckedChange={handleStatusChange}
            className="mt-1"
          />
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
              <h4 className="font-medium">{task.title}</h4>
              <div className="flex items-center gap-2">
                <Badge variant={getTaskPriorityVariant(task.priority)}>
                  {task.priority}
                </Badge>
                <Badge variant="outline">{dueDate}</Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {task.description}
            </p>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground mr-2">Assigned to:</span>
                {task.assignedTo ? (
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-1">
                      <AvatarImage src={`/avatars/${task.assignedTo}.png`} alt="User avatar" />
                      <AvatarFallback>{task.assignedTo.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">
                      {isAssigned ? 'You' : `User ${task.assignedTo.substring(0, 4)}`}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs">Unassigned</span>
                )}
              </div>
              
              <Button variant="ghost" size="sm">
                Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Helper function to get badge variant based on task priority
 */
function getTaskPriorityVariant(priority) {
  switch (priority) {
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'secondary';
    default:
      return 'outline';
  }
}
