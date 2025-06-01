/**
 * Real-time Collaboration Types
 * 
 * This file defines the core types and interfaces for the real-time collaboration system,
 * which enables shared workspaces, document editing, and remote collaboration.
 */

// Collaboration session types
export enum CollaborationSessionType {
  DOCUMENT = 'document',
  WHITEBOARD = 'whiteboard',
  PROJECT = 'project',
  DISCUSSION = 'discussion',
  VIDEO_CONFERENCE = 'video_conference'
}

// User role in collaboration
export enum CollaborationRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  COMMENTER = 'commenter',
  VIEWER = 'viewer'
}

// Collaboration session interface
export interface CollaborationSession {
  id: string;
  type: CollaborationSessionType;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  participants: CollaborationParticipant[];
  status: 'active' | 'scheduled' | 'completed' | 'archived';
  settings: CollaborationSettings;
  content: {
    documentId?: string;
    whiteboardId?: string;
    projectId?: string;
    discussionId?: string;
    videoConferenceId?: string;
  };
  metadata: {
    subject?: string;
    keyStage?: string;
    tags?: string[];
    educationalObjectives?: string[];
    [key: string]: any;
  };
}

// Collaboration participant interface
export interface CollaborationParticipant {
  userId: string;
  name: string;
  role: CollaborationRole;
  joinedAt: Date;
  lastActive?: Date;
  status: 'online' | 'away' | 'offline';
  cursor?: {
    x: number;
    y: number;
    lastUpdated: Date;
  };
  permissions: {
    canEdit: boolean;
    canComment: boolean;
    canShare: boolean;
    canInvite: boolean;
    canExport: boolean;
  };
}

// Collaboration settings interface
export interface CollaborationSettings {
  isPublic: boolean;
  allowJoinRequests: boolean;
  allowAnonymousViewers: boolean;
  requireApprovalToJoin: boolean;
  enableChat: boolean;
  enableVideoConference: boolean;
  enableRealTimeEditing: boolean;
  enableVersionHistory: boolean;
  maxParticipants: number;
  autoSaveInterval: number; // in seconds
  inactivityTimeout: number; // in minutes
  moderationSettings: {
    enableContentFiltering: boolean;
    enableProfanityFilter: boolean;
    requireApprovalForExternalContent: boolean;
  };
  accessibilitySettings: {
    enableHighContrast: boolean;
    enableScreenReaderSupport: boolean;
    enableKeyboardNavigation: boolean;
    enableTextToSpeech: boolean;
    enableVoiceInput: boolean;
  };
}

// Collaborative document interface
export interface CollaborativeDocument {
  id: string;
  sessionId: string;
  title: string;
  content: string;
  format: 'markdown' | 'rich_text' | 'plain_text' | 'html';
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastEditedBy: string;
  contributors: string[];
  comments: DocumentComment[];
  versionHistory: DocumentVersion[];
  currentEditors: string[];
  status: 'draft' | 'in_review' | 'final';
  metadata: {
    wordCount: number;
    readingTime: number; // in minutes
    [key: string]: any;
  };
}

// Document comment interface
export interface DocumentComment {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  position: {
    startIndex: number;
    endIndex: number;
  };
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  replies: DocumentComment[];
  mentions: string[]; // user IDs
}

// Document version interface
export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: string;
  createdAt: Date;
  createdBy: string;
  comment: string;
  changes: {
    additions: number;
    deletions: number;
    changedSections: {
      startIndex: number;
      endIndex: number;
      before: string;
      after: string;
    };[];
  };
}

// Collaborative whiteboard interface
export interface CollaborativeWhiteboard {
  id: string;
  sessionId: string;
  title: string;
  width: number;
  height: number;
  elements: WhiteboardElement[];
  background: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastEditedBy: string;
   contributors: string[];
  currentEditors: string[];
  status: 'active' | 'archived';
}

// Whiteboard element interface
export interface WhiteboardElement {
  id: string;
  type: 'shape' | 'text' | 'image' | 'line' | 'sticky_note' | 'connector';
  position: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    rotation?: number;
  };
  style: {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    opacity?: number;
    fontSize?: number;
    fontFamily?: string;
    textAlign?: 'left' | 'centre' | 'right';
    [key: string]: any;
  };
  content?: {
    text?: string;
    imageUrl?: string;
    shape?: 'rectangle' | 'circle' | 'triangle' | 'diamond';
    points?: { x: number; y: number }[];
    [key: string]: any;
  };
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  locked: boolean;
  groupId?: string;
  zIndex: number;
}

// Collaborative project interface
export interface CollaborativeProject {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  objectives: string[];
  tasks: ProjectTask[];
  resources: ProjectResource[];
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: ProjectMilestone[];
  };
  members: {
    userId: string;
    name: string;
    role: string;
    responsibilities: string[];
  }[];
  status: 'planning' | 'in_progress' | 'review' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastEditedBy: string;
}

// Project task interface
export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  startDate?: Date;
  completedDate?: Date;
  dependencies: string[]; // IDs of tasks that must be completed first
  comments: {
    userId: string;
    userName: string;
    content: string;
    createdAt: Date;
  };[];
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedBy: string;
    uploadedAt: Date;
  };[];
  progress: number; // 0-100
  estimatedHours: number;
  actualHours: number;
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  };[];
}

// Project resource interface
export interface ProjectResource {
  id: string;
  title: string;
  type: 'document' | 'link' | 'file' | 'reference';
  url?: string;
  documentId?: string;
  description: string;
  addedBy: string;
  addedAt: Date;
  tags: string[];
}

// Project milestone interface
export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  associatedTasks: string[]; // IDs of tasks associated with this milestone
  deliverables: string[];
  completedAt?: Date;
}

// Discussion thread interface
export interface DiscussionThread {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  category: string;
  tags: string[];
  status: 'active' | 'resolved' | 'archived';
  pinned: boolean;
  messages: DiscussionMessage[];
  participants: string[];
  views: number;
  lastActivity: Date;
}

// Discussion message interface
export interface DiscussionMessage {
  id: string;
  threadId: string;
  content: string;
  format: 'markdown' | 'plain_text' | 'html';
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
  };[];
  reactions: {
    type: string;
    count: number;
    users: string[];
  }[];
  mentions: string[];
  parentId?: string; // For replies
  edited: boolean;
  pinned: boolean;
}

// Video conference interface
export interface VideoConference {
  id: string;
  sessionId: string;
  title: string;
  status: 'scheduled' | 'in_progress' | 'ended';
  startTime: Date;
  endTime?: Date;
  host: string;
  participants: {
    userId: string;
    name: string;
    joinedAt?: Date;
    leftAt?: Date;
    camera: boolean;
    microphone: boolean;
    screenSharing: boolean;
    handRaised: boolean;
    connection: 'excellent' | 'good' | 'fair' | 'poor';
  }[];
  settings: {
    enableWaitingRoom: boolean;
    muteParticipantsOnEntry: boolean;
    allowScreenSharing: boolean;
    allowRecording: boolean;
    allowChat: boolean;
    allowHandRaising: boolean;
    allowBreakoutRooms: boolean;
    maxParticipants: number;
    requireAuthentication: boolean;
  };
  recording?: {
    inProgress: boolean;
    startedAt?: Date;
    duration?: number; // in seconds
    url?: string;
  };
  chat: {
    enabled: boolean;
    messages: {
      id: string;
      userId: string;
      userName: string;
      content: string;
      timestamp: Date;
      isPrivate: boolean;
      recipientId?: string;
    }[];
  };
  breakoutRooms?: {
    id: string;
    name: string;
    participants: string[];
    createdAt: Date;
    endedAt?: Date;
  }[];
}

// Collaboration invitation interface
export interface CollaborationInvitation {
  id: string;
  sessionId: string;
  invitedBy: string;
  invitedEmail: string;
  invitedName?: string;
  role: CollaborationRole;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  message?: string;
  token: string;
}

// Collaboration activity interface
export interface CollaborationActivity {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  activityType: 'join' | 'leave' | 'edit' | 'comment' | 'share' | 'upload' | 'download' | 'create' | 'delete' | 'permission_change';
  description: string;
  timestamp: Date;
  details: {
    targetId?: string;
    targetType?: string;
    before?;
    after?;
    [key: string]: any;
  };
}

// Collaboration notification interface
export interface CollaborationNotification {
  id: string;
  userId: string;
  sessionId: string;
  type: 'mention' | 'comment' | 'edit' | 'share' | 'invitation' | 'deadline' | 'system';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  readAt?: Date;
  actionUrl?: string;
  sender?: {
    id: string;
    name: string;
  };
  priority: 'low' | 'medium' | 'high';
}
