/**
 * API functions for the Parent/Guardian Portal
 */

import { 
  Child, 
  Parent, 
  ChildProgressSummary, 
  ParentEducatorMessage, 
  ParentEducatorMeeting,
  HomeLearningResource,
  WellbeingCheckIn,
  IndividualEducationPlan,
  SchoolAnnouncement,
  HomeworkAssignment,
  BehaviourRecord
} from './types';

/**
 * Fetch a parent's profile by ID
 * @param parentId The ID of the parent
 * @returns Promise resolving to the parent's profile
 */
export async function getParentProfile(parentId: string): Promise<Parent> {
  const response = await fetch(`/api/parent-portal/parents/${parentId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch parent profile: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Update a parent's profile
 * @param parentId The ID of the parent
 * @param data The updated parent data
 * @returns Promise resolving to the updated parent profile
 */
export async function updateParentProfile(parentId: string, data: Partial<Parent>): Promise<Parent> {
  const response = await fetch(`/api/parent-portal/parents/${parentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update parent profile: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch a child's profile by ID
 * @param childId The ID of the child
 * @returns Promise resolving to the child's profile
 */
export async function getChildProfile(childId: string): Promise<Child> {
  const response = await fetch(`/api/parent-portal/children/${childId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch child profile: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch all children associated with a parent
 * @param parentId The ID of the parent
 * @returns Promise resolving to an array of child profiles
 */
export async function getParentChildren(parentId: string): Promise<Child[]> {
  const response = await fetch(`/api/parent-portal/parents/${parentId}/children`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch parent's children: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch a child's progress summary
 * @param childId The ID of the child
 * @returns Promise resolving to the child's progress summary
 */
export async function getChildProgressSummary(childId: string): Promise<ChildProgressSummary> {
  const response = await fetch(`/api/parent-portal/children/${childId}/progress`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch child progress summary: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch messages between a parent and educators
 * @param parentId The ID of the parent
 * @param params Optional query parameters
 * @returns Promise resolving to an array of messages
 */
export async function getParentMessages(
  parentId: string, 
  params?: { 
    childId?: string; 
    unreadOnly?: boolean; 
    limit?: number; 
    offset?: number;
  }
): Promise<ParentEducatorMessage[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.childId) {
    queryParams.append('childId', params.childId);
  }
  
  if (params?.unreadOnly) {
    queryParams.append('unreadOnly', 'true');
  }
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.offset) {
    queryParams.append('offset', params.offset.toString());
  }
  
  const url = `/api/parent-portal/parents/${parentId}/messages${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch parent messages: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Send a message from a parent to an educator
 * @param message The message to send
 * @returns Promise resolving to the sent message
 */
export async function sendParentMessage(message: Omit<ParentEducatorMessage, 'id' | 'timestamp' | 'read'>): Promise<ParentEducatorMessage> {
  const response = await fetch('/api/parent-portal/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Mark a message as read
 * @param messageId The ID of the message
 * @returns Promise resolving to the updated message
 */
export async function markMessageAsRead(messageId: string): Promise<ParentEducatorMessage> {
  const response = await fetch(`/api/parent-portal/messages/${messageId}/read`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to mark message as read: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch meetings between a parent and educators
 * @param parentId The ID of the parent
 * @param params Optional query parameters
 * @returns Promise resolving to an array of meetings
 */
export async function getParentMeetings(
  parentId: string,
  params?: {
    childId?: string;
    status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    fromDate?: Date;
    toDate?: Date;
  }
): Promise<ParentEducatorMeeting[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.childId) {
    queryParams.append('childId', params.childId);
  }
  
  if (params?.status) {
    queryParams.append('status', params.status);
  }
  
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate.toISOString());
  }
  
  if (params?.toDate) {
    queryParams.append('toDate', params.toDate.toISOString());
  }
  
  const url = `/api/parent-portal/parents/${parentId}/meetings${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch parent meetings: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Schedule a new meeting between a parent and an educator
 * @param meeting The meeting to schedule
 * @returns Promise resolving to the scheduled meeting
 */
export async function scheduleMeeting(meeting: Omit<ParentEducatorMeeting, 'id'>): Promise<ParentEducatorMeeting> {
  const response = await fetch('/api/parent-portal/meetings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meeting),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to schedule meeting: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Update a meeting's status
 * @param meetingId The ID of the meeting
 * @param status The new status
 * @returns Promise resolving to the updated meeting
 */
export async function updateMeetingStatus(
  meetingId: string, 
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
): Promise<ParentEducatorMeeting> {
  const response = await fetch(`/api/parent-portal/meetings/${meetingId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update meeting status: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch home learning resources recommended for a child
 * @param childId The ID of the child
 * @param params Optional query parameters
 * @returns Promise resolving to an array of home learning resources
 */
export async function getHomeLearningResources(
  childId: string,
  params?: {
    subject?: string;
    learningStyle?: string;
    type?: string;
    difficulty?: 'easy' | 'medium' | 'challenging';
    limit?: number;
    offset?: number;
  }
): Promise<HomeLearningResource[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.subject) {
    queryParams.append('subject', params.subject);
  }
  
  if (params?.learningStyle) {
    queryParams.append('learningStyle', params.learningStyle);
  }
  
  if (params?.type) {
    queryParams.append('type', params.type);
  }
  
  if (params?.difficulty) {
    queryParams.append('difficulty', params.difficulty);
  }
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.offset) {
    queryParams.append('offset', params.offset.toString());
  }
  
  const url = `/api/parent-portal/children/${childId}/resources${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch home learning resources: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Submit a wellbeing check-in for a child
 * @param checkIn The wellbeing check-in data
 * @returns Promise resolving to the submitted check-in
 */
export async function submitWellbeingCheckIn(checkIn: Omit<WellbeingCheckIn, 'id'>): Promise<WellbeingCheckIn> {
  const response = await fetch('/api/parent-portal/wellbeing-check-ins', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checkIn),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to submit wellbeing check-in: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch a child's wellbeing check-ins
 * @param childId The ID of the child
 * @param params Optional query parameters
 * @returns Promise resolving to an array of wellbeing check-ins
 */
export async function getChildWellbeingCheckIns(
  childId: string,
  params?: {
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
    offset?: number;
  }
): Promise<WellbeingCheckIn[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate.toISOString());
  }
  
  if (params?.toDate) {
    queryParams.append('toDate', params.toDate.toISOString());
  }
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.offset) {
    queryParams.append('offset', params.offset.toString());
  }
  
  const url = `/api/parent-portal/children/${childId}/wellbeing-check-ins${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch wellbeing check-ins: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch a child's Individual Education Plan (IEP)
 * @param childId The ID of the child
 * @returns Promise resolving to the child's IEP
 */
export async function getChildIEP(childId: string): Promise<IndividualEducationPlan | null> {
  const response = await fetch(`/api/parent-portal/children/${childId}/iep`);
  
  if (response.status === 404) {
    return null;
  }
  
  if (!response.ok) {
    throw new Error(`Failed to fetch child IEP: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch school announcements
 * @param params Optional query parameters
 * @returns Promise resolving to an array of school announcements
 */
export async function getSchoolAnnouncements(
  params?: {
    childId?: string;
    importance?: 'low' | 'medium' | 'high' | 'urgent';
    fromDate?: Date;
    limit?: number;
    offset?: number;
  }
): Promise<SchoolAnnouncement[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.childId) {
    queryParams.append('childId', params.childId);
  }
  
  if (params?.importance) {
    queryParams.append('importance', params.importance);
  }
  
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate.toISOString());
  }
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.offset) {
    queryParams.append('offset', params.offset.toString());
  }
  
  const url = `/api/parent-portal/announcements${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch school announcements: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch a child's homework assignments
 * @param childId The ID of the child
 * @param params Optional query parameters
 * @returns Promise resolving to an array of homework assignments
 */
export async function getChildHomework(
  childId: string,
  params?: {
    status?: 'assigned' | 'in_progress' | 'submitted' | 'marked' | 'late';
    subject?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
    offset?: number;
  }
): Promise<HomeworkAssignment[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.status) {
    queryParams.append('status', params.status);
  }
  
  if (params?.subject) {
    queryParams.append('subject', params.subject);
  }
  
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate.toISOString());
  }
  
  if (params?.toDate) {
    queryParams.append('toDate', params.toDate.toISOString());
  }
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.offset) {
    queryParams.append('offset', params.offset.toString());
  }
  
  const url = `/api/parent-portal/children/${childId}/homework${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch child homework: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch a child's behaviour records
 * @param childId The ID of the child
 * @param params Optional query parameters
 * @returns Promise resolving to an array of behaviour records
 */
export async function getChildBehaviourRecords(
  childId: string,
  params?: {
    type?: 'positive' | 'negative';
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
    offset?: number;
  }
): Promise<BehaviourRecord[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.type) {
    queryParams.append('type', params.type);
  }
  
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate.toISOString());
  }
  
  if (params?.toDate) {
    queryParams.append('toDate', params.toDate.toISOString());
  }
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.offset) {
    queryParams.append('offset', params.offset.toString());
  }
  
  const url = `/api/parent-portal/children/${childId}/behaviour${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch child behaviour records: ${response.statusText}`);
  }
  
  return response.json();
}
