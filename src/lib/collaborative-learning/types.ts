/**
 * Type definitions for the Collaborative Learning Tools
 * Includes types for peer-to-peer learning, group projects, and discussion forums
 */

import { User, UserRole } from '@/types/user';
import { UKKeyStage, UKSubject, UKCurriculumObjective } from '@/types/curriculum';
import { LearningStyle } from '@/types/learning';

/**
 * Peer Learning Types
 */

export enum PeerLearningRole {
  TUTOR = 'tutor',
  TUTEE = 'tutee',
  COLLABORATOR = 'collaborator'
}

export enum PeerLearningStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface PeerLearningPartnership {
  id: string;
  tutorId: string;
  tuteeId: string;
  subject: UKSubject;
  keyStage: UKKeyStage;
  curriculumObjectives: UKCurriculumObjective[];
  status: PeerLearningStatus;
  createdAt: Date;
  updatedAt: Date;
  sessions: PeerLearningSession[];
  feedback: PeerFeedback[];
}

export interface PeerLearningSession {
  id: string;
  partnershipId: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  resources: string[];
  learningObjectives: string[];
  outcomes: string;
}

export interface PeerFeedback {
  id: string;
  partnershipId: string;
  sessionId?: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  strengths: string;
  areasForImprovement: string;
  comments: string;
  createdAt: Date;
}

export interface StudentResource {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  content: string;
  contentType: 'text' | 'image' | 'video' | 'audio' | 'document' | 'link';
  subject: UKSubject;
  keyStage: UKKeyStage;
  curriculumObjectives: UKCurriculumObjective[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  reviews: ResourceReview[];
  averageRating: number;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface ResourceReview {
  id: string;
  resourceId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  helpful: boolean;
  createdAt: Date;
}

/**
 * Group Project Types
 */

export enum ProjectRole {
  LEADER = 'leader',
  MEMBER = 'member',
  OBSERVER = 'observer'
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum TaskStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  BLOCKED = 'blocked'
}

export interface GroupProject {
  id: string;
  title: string;
  description: string;
  subject: UKSubject;
  keyStage: UKKeyStage;
  curriculumObjectives: UKCurriculumObjective[];
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  members: ProjectMember[];
  tasks: ProjectTask[];
  resources: ProjectResource[];
  discussions: ProjectDiscussion[];
  milestones: ProjectMilestone[];
  educatorId: string;
  educatorNotes: string;
  assessmentCriteria: string[];
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
  contributionScore?: number;
  responsibilities: string[];
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string[];
  startDate: Date;
  dueDate: Date;
  completedAt?: Date;
  dependencies: string[];
  attachments: string[];
  comments: TaskComment[];
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProjectResource {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: 'document' | 'image' | 'video' | 'link' | 'other';
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  version: number;
  previousVersions: string[];
}

export interface ProjectDiscussion {
  id: string;
  projectId: string;
  title: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  messages: DiscussionMessage[];
  pinned: boolean;
}

export interface DiscussionMessage {
  id: string;
  discussionId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  attachments: string[];
  reactions: MessageReaction[];
}

export interface MessageReaction {
  userId: string;
  type: string;
  createdAt: Date;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: Date;
  completedAt?: Date;
  tasks: string[];
  deliverables: string[];
}

export interface ProjectAssessment {
  id: string;
  projectId: string;
  userId: string;
  assessorId: string;
  assessorRole: 'self' | 'peer' | 'educator';
  criteria: {
    criterionId: string;
    score: number;
    feedback: string;
  }[];
  overallScore: number;
  overallFeedback: string;
  createdAt: Date;
}

/**
 * Discussion Forum Types
 */

export enum ForumCategory {
  GENERAL = 'general',
  SUBJECT_SPECIFIC = 'subject-specific',
  HELP_REQUESTS = 'help-requests',
  STUDY_GROUPS = 'study-groups',
  ANNOUNCEMENTS = 'announcements'
}

export enum PostVisibility {
  PUBLIC = 'public',
  CLASS = 'class',
  GROUP = 'group',
  PRIVATE = 'private'
}

export interface ForumTopic {
  id: string;
  title: string;
  description: string;
  category: ForumCategory;
  tags: string[];
  subject?: UKSubject;
  keyStage?: UKKeyStage;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastPostAt: Date;
  postCount: number;
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  visibility: PostVisibility;
  allowedUsers?: string[];
  allowedGroups?: string[];
}

export interface ForumPost {
  id: string;
  topicId: string;
  parentId?: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
  attachments: string[];
  reactions: PostReaction[];
  isAcceptedAnswer: boolean;
  isHidden: boolean;
  hiddenReason?: string;
  hiddenBy?: string;
  reports: PostReport[];
}

export interface PostReaction {
  userId: string;
  type: string;
  createdAt: Date;
}

export interface PostReport {
  id: string;
  postId: string;
  reportedBy: string;
  reason: string;
  details: string;
  createdAt: Date;
  status: 'pending' | 'reviewed' | 'actioned' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: Date;
  action?: string;
}

export interface ForumBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface UserForumStats {
  userId: string;
  postCount: number;
  topicCount: number;
  helpfulAnswers: number;
  acceptedAnswers: number;
  reactionCount: number;
  lastActive: Date;
  badges: {
    badgeId: string;
    awardedAt: Date;
  }[];
  reputation: number;
}

/**
 * Notification Types for Collaborative Features
 */

export enum CollaborationNotificationType {
  PEER_REQUEST = 'peer-request',
  SESSION_REMINDER = 'session-reminder',
  FEEDBACK_RECEIVED = 'feedback-received',
  PROJECT_INVITATION = 'project-invitation',
  TASK_ASSIGNED = 'task-assigned',
  TASK_COMPLETED = 'task-completed',
  MILESTONE_REACHED = 'milestone-reached',
  FORUM_REPLY = 'forum-reply',
  FORUM_MENTION = 'forum-mention',
  POST_REACTION = 'post-reaction'
}

export interface CollaborationNotification {
  id: string;
  userId: string;
  type: CollaborationNotificationType;
  title: string;
  message: string;
  relatedId: string;
  relatedType: 'partnership' | 'session' | 'project' | 'task' | 'topic' | 'post';
  createdAt: Date;
  read: boolean;
  readAt?: Date;
  actionUrl: string;
}
