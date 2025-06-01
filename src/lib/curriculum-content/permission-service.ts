/**
 * Permission Management Service
 * Provides functionality for managing user permissions for curriculum content
 */

import { 
  UserContentPermission,
  ContentPermission
} from './types';
import { 
  getUserContentPermissions,
  updateUserContentPermission,
  checkUserContentPermission
} from './api';

/**
 * User role interface
 */
export interface UserRole {
  id: string;
  name: string;
  permissions: ContentPermission[];
}

/**
 * Get user content permissions
 */
export async function getUserPermissions(userId: string): Promise<UserContentPermission[]> {
  return await getUserContentPermissions(userId);
}

/**
 * Update user content permission
 */
export async function updateUserPermission(permission: UserContentPermission): Promise<UserContentPermission> {
  return await updateUserContentPermission(permission);
}

/**
 * Check if user has specific permission for content
 */
export async function checkPermission(
  userId: string, 
  contentId: string, 
  requiredPermission: ContentPermission
): Promise<boolean> {
  return await checkUserContentPermission(userId, contentId, requiredPermission);
}

/**
 * Get available user roles
 */
export function getAvailableRoles(): UserRole[] {
  return [
    {
      id: 'viewer',
      name: 'Viewer',
      permissions: [ContentPermission.VIEW]
    },
    {
      id: 'commenter',
      name: 'Commenter',
      permissions: [ContentPermission.VIEW, ContentPermission.COMMENT]
    },
    {
      id: 'editor',
      name: 'Editor',
      permissions: [ContentPermission.VIEW, ContentPermission.COMMENT, ContentPermission.EDIT]
    },
    {
      id: 'approver',
      name: 'Approver',
      permissions: [ContentPermission.VIEW, ContentPermission.COMMENT, ContentPermission.EDIT, ContentPermission.APPROVE]
    },
    {
      id: 'admin',
      name: 'Administrator',
      permissions: [ContentPermission.VIEW, ContentPermission.COMMENT, ContentPermission.EDIT, ContentPermission.APPROVE, ContentPermission.ADMIN]
    }
  ];
}

/**
 * Get role by ID
 */
export function getRoleById(roleId: string): UserRole | undefined {
  return getAvailableRoles().find(role => role.id === roleId);
}

/**
 * Get role name by ID
 */
export function getRoleNameById(roleId: string): string {
  const role = getRoleById(roleId);
  return role ? role.name : 'Unknown Role';
}

/**
 * Check if role has specific permission
 */
export function roleHasPermission(roleId: string, permission: ContentPermission): boolean {
  const role = getRoleById(roleId);
  return role ? role.permissions.includes(permission) : false;
}

/**
 * Get available users for permission assignment
 */
export async function getAvailableUsers(): Promise<Array<{id: string, name: string, email: string, role: string}>> {
  // In a real implementation, this would fetch from an API
  // For now, we'll return a static list
  return [
    { id: 'user1', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'Mathematics Lead' },
    { id: 'user2', name: 'David Williams', email: 'david.williams@example.com', role: 'KS2 Coordinator' },
    { id: 'user3', name: 'Emma Brown', email: 'emma.brown@example.com', role: 'Educational Psychologist' },
    { id: 'user4', name: 'Michael Taylor', email: 'michael.taylor@example.com', role: 'Content Reviewer' },
    { id: 'user5', name: 'Jessica Wilson', email: 'jessica.wilson@example.com', role: 'Science Lead' },
    { id: 'user6', name: 'Robert Davis', email: 'robert.davis@example.com', role: 'English Lead' },
    { id: 'user7', name: 'Amanda Clark', email: 'amanda.clark@example.com', role: 'KS3 Coordinator' },
    { id: 'user8', name: 'Thomas White', email: 'thomas.white@example.com', role: 'Content Editor' }
  ];
}

/**
 * Format permission for display
 */
export function formatPermission(permission: ContentPermission): string {
  switch (permission) {
    case ContentPermission.VIEW:
      return 'View';
    case ContentPermission.COMMENT:
      return 'Comment';
    case ContentPermission.EDIT:
      return 'Edit';
    case ContentPermission.APPROVE:
      return 'Approve';
    case ContentPermission.ADMIN:
      return 'Admin';
    default:
      return permission;
  }
}

/**
 * Get permission description
 */
export function getPermissionDescription(permission: ContentPermission): string {
  switch (permission) {
    case ContentPermission.VIEW:
      return 'Can view content but cannot make changes';
    case ContentPermission.COMMENT:
      return 'Can view content and add comments';
    case ContentPermission.EDIT:
      return 'Can view, comment on, and edit content';
    case ContentPermission.APPROVE:
      return 'Can view, comment, edit, and approve content for publishing';
    case ContentPermission.ADMIN:
      return 'Has full administrative access to content';
    default:
      return 'Unknown permission';
  }
}
