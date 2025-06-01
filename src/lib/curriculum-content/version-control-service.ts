/**
 * Version Control and Workflow Service
 * Provides functionality for managing content versions and workflow
 */

import { 
  ContentMetadata, 
  ContentStatus,
  ContentChangeRecord
} from './types';
import { 
  updateContentStatus, 
  getContentChangeHistory 
} from './api';

/**
 * Workflow transition interface
 */
export interface WorkflowTransition {
  fromStatus: ContentStatus;
  toStatus: ContentStatus;
  label: string;
  requiresComment: boolean;
  allowedRoles: string[];
}

/**
 * Get allowed workflow transitions
 */
export function getAllowedWorkflowTransitions(
  currentStatus: ContentStatus,
  userRoles: string[]
): WorkflowTransition[] {
  // Define all possible transitions
  const allTransitions: WorkflowTransition[] = [
    {
      fromStatus: ContentStatus.DRAFT,
      toStatus: ContentStatus.REVIEW,
      label: 'Submit for Review',
      requiresComment: false,
      allowedRoles: ['author', 'editor', 'admin']
    },
    {
      fromStatus: ContentStatus.REVIEW,
      toStatus: ContentStatus.APPROVED,
      label: 'Approve',
      requiresComment: false,
      allowedRoles: ['reviewer', 'editor', 'admin']
    },
    {
      fromStatus: ContentStatus.REVIEW,
      toStatus: ContentStatus.REJECTED,
      label: 'Reject',
      requiresComment: true,
      allowedRoles: ['reviewer', 'editor', 'admin']
    },
    {
      fromStatus: ContentStatus.REVIEW,
      toStatus: ContentStatus.DRAFT,
      label: 'Return to Draft',
      requiresComment: true,
      allowedRoles: ['reviewer', 'editor', 'admin']
    },
    {
      fromStatus: ContentStatus.APPROVED,
      toStatus: ContentStatus.PUBLISHED,
      label: 'Publish',
      requiresComment: false,
      allowedRoles: ['publisher', 'admin']
    },
    {
      fromStatus: ContentStatus.APPROVED,
      toStatus: ContentStatus.DRAFT,
      label: 'Return to Draft',
      requiresComment: true,
      allowedRoles: ['editor', 'admin']
    },
    {
      fromStatus: ContentStatus.PUBLISHED,
      toStatus: ContentStatus.ARCHIVED,
      label: 'Archive',
      requiresComment: false,
      allowedRoles: ['publisher', 'admin']
    },
    {
      fromStatus: ContentStatus.PUBLISHED,
      toStatus: ContentStatus.DRAFT,
      label: 'Unpublish and Edit',
      requiresComment: true,
      allowedRoles: ['publisher', 'admin']
    },
    {
      fromStatus: ContentStatus.REJECTED,
      toStatus: ContentStatus.DRAFT,
      label: 'Return to Draft',
      requiresComment: false,
      allowedRoles: ['author', 'editor', 'admin']
    },
    {
      fromStatus: ContentStatus.ARCHIVED,
      toStatus: ContentStatus.PUBLISHED,
      label: 'Restore',
      requiresComment: false,
      allowedRoles: ['publisher', 'admin']
    },
    {
      fromStatus: ContentStatus.ARCHIVED,
      toStatus: ContentStatus.DRAFT,
      label: 'Restore as Draft',
      requiresComment: false,
      allowedRoles: ['publisher', 'admin']
    }
  ];
  
  // Filter transitions based on current status and user roles
  return allTransitions.filter(transition => 
    transition.fromStatus === currentStatus &&
    transition.allowedRoles.some(role => userRoles.includes(role))
  );
}

/**
 * Transition content status
 */
export async function transitionContentStatus(
  contentId: string,
  newStatus: ContentStatus,
  comment?: string
): Promise<ContentMetadata> {
  return await updateContentStatus(contentId, newStatus, comment);
}

/**
 * Get content version history
 */
export async function getVersionHistory(contentId: string): Promise<ContentChangeRecord[]> {
  return await getContentChangeHistory(contentId);
}

/**
 * Format version number
 */
export function formatVersionNumber(version: number): string {
  const major = Math.floor(version);
  const minor = Math.round((version - major) * 10);
  return `${major}.${minor}`;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: ContentStatus): string {
  switch (status) {
    case ContentStatus.DRAFT:
      return 'yellow';
    case ContentStatus.REVIEW:
      return 'blue';
    case ContentStatus.APPROVED:
      return 'green';
    case ContentStatus.PUBLISHED:
      return 'purple';
    case ContentStatus.ARCHIVED:
      return 'gray';
    case ContentStatus.REJECTED:
      return 'red';
    default:
      return 'gray';
  }
}

/**
 * Get workflow stage number (for progress indicators)
 */
export function getWorkflowStageNumber(status: ContentStatus): number {
  switch (status) {
    case ContentStatus.DRAFT:
      return 1;
    case ContentStatus.REVIEW:
      return 2;
    case ContentStatus.APPROVED:
      return 3;
    case ContentStatus.PUBLISHED:
      return 4;
    case ContentStatus.ARCHIVED:
      return 5;
    case ContentStatus.REJECTED:
      return 2; // Same level as REVIEW but different state
    default:
      return 0;
  }
}

/**
 * Check if user can perform a specific workflow action
 */
export function canPerformWorkflowAction(
  currentStatus: ContentStatus,
  targetStatus: ContentStatus,
  userRoles: string[]
): boolean {
  const transitions = getAllowedWorkflowTransitions(currentStatus, userRoles);
  return transitions.some(t => t.toStatus === targetStatus);
}

/**
 * Get available reviewers
 */
export async function getAvailableReviewers(): Promise<Array<{id: string, name: string, role: string}>> {
  // In a real implementation, this would fetch from an API
  // For now, we'll return a static list
  return [
    { id: 'user1', name: 'Sarah Johnson', role: 'Mathematics Lead' },
    { id: 'user2', name: 'David Williams', role: 'KS2 Coordinator' },
    { id: 'user3', name: 'Emma Brown', role: 'Educational Psychologist' },
    { id: 'user4', name: 'Michael Taylor', role: 'Content Reviewer' },
    { id: 'user5', name: 'Jessica Wilson', role: 'Science Lead' },
    { id: 'user6', name: 'Robert Davis', role: 'English Lead' },
    { id: 'user7', name: 'Amanda Clark', role: 'KS3 Coordinator' },
    { id: 'user8', name: 'Thomas White', role: 'Content Editor' }
  ];
}
