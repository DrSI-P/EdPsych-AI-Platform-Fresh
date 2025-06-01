/**
 * Type definitions for the Parent/Guardian Portal
 */

import { UKKeyStage, UKSubject } from '@/lib/assessment/types';
import { LearningStyle } from '@/lib/learning-path/types';

/**
 * Represents a child/student in the Parent/Guardian Portal
 */
export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  yearGroup: number;
  keyStage: UKKeyStage;
  school: string;
  profileImageUrl?: string;
  learningStyle?: LearningStyle;
  specialEducationalNeeds?: SpecialEducationalNeed[];
}

/**
 * Represents a parent/guardian in the system
 */
export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  children: string[]; // Array of child IDs
  preferredContactMethod: 'email' | 'phone' | 'app';
  notificationPreferences: NotificationPreferences;
  lastLogin?: Date;
}

/**
 * Notification preferences for parents
 */
export interface NotificationPreferences {
  assessmentResults: boolean;
  homeworkAssigned: boolean;
  homeworkCompleted: boolean;
  achievements: boolean;
  behaviourAlerts: boolean;
  weeklyProgress: boolean;
  schoolAnnouncements: boolean;
  parentTeacherMeetings: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

/**
 * Types of special educational needs
 */
export enum SpecialEducationalNeed {
  DYSLEXIA = 'Dyslexia',
  DYSPRAXIA = 'Dyspraxia',
  DYSCALCULIA = 'Dyscalculia',
  ADHD = 'ADHD',
  AUTISM = 'Autism',
  HEARING_IMPAIRMENT = 'Hearing Impairment',
  VISUAL_IMPAIRMENT = 'Visual Impairment',
  SPEECH_LANGUAGE = 'Speech and Language',
  SOCIAL_EMOTIONAL_MENTAL_HEALTH = 'Social, Emotional and Mental Health',
  PHYSICAL_DISABILITY = 'Physical Disability',
  OTHER = 'Other'
}

/**
 * Progress summary for a child
 */
export interface ChildProgressSummary {
  childId: string;
  overallProgress: number; // 0-100
  subjectProgress: SubjectProgress[];
  recentAssessments: AssessmentSummary[];
  learningPathProgress: number; // 0-100
  curriculumCoverage: CurriculumCoverage[];
  strengths: string[];
  areasForImprovement: string[];
  recentAchievements: Achievement[];
  upcomingMilestones: Milestone[];
}

/**
 * Progress in a specific subject
 */
export interface SubjectProgress {
  subject: UKSubject;
  progress: number; // 0-100
  trend: 'improving' | 'steady' | 'declining';
  lastAssessmentDate?: Date;
  lastAssessmentScore?: number;
  targetLevel?: string;
  currentLevel?: string;
}

/**
 * Summary of an assessment
 */
export interface AssessmentSummary {
  id: string;
  title: string;
  subject: UKSubject;
  date: Date;
  score: number;
  maxScore: number;
  percentile?: number;
  feedback?: string;
}

/**
 * Curriculum coverage for a subject
 */
export interface CurriculumCoverage {
  subject: UKSubject;
  keyStage: UKKeyStage;
  topicsCovered: number;
  totalTopics: number;
  coverage: number; // 0-100
  gapAreas?: string[];
}

/**
 * Achievement earned by a child
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'academic' | 'behaviour' | 'attendance' | 'extracurricular' | 'other';
  iconUrl?: string;
}

/**
 * Upcoming milestone in a child's learning journey
 */
export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number; // 0-100
  subject?: UKSubject;
  prerequisiteSkills?: string[];
}

/**
 * Message between parent and educator
 */
export interface ParentEducatorMessage {
  id: string;
  senderId: string;
  senderType: 'parent' | 'educator';
  recipientId: string;
  recipientType: 'parent' | 'educator';
  childId: string;
  subject: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: MessageAttachment[];
  replyToId?: string;
}

/**
 * Attachment in a message
 */
export interface MessageAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
}

/**
 * Meeting between parent and educator
 */
export interface ParentEducatorMeeting {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: number; // in minutes
  location: string;
  virtual: boolean;
  meetingLink?: string;
  educatorId: string;
  parentId: string;
  childId: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

/**
 * Home learning resource recommended for a child
 */
export interface HomeLearningResource {
  id: string;
  title: string;
  description: string;
  subject: UKSubject;
  keyStage: UKKeyStage;
  learningStyle: LearningStyle;
  type: 'activity' | 'reading' | 'video' | 'game' | 'worksheet' | 'other';
  estimatedDuration: number; // in minutes
  url?: string;
  thumbnailUrl?: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'challenging';
  parentGuidance?: string;
}

/**
 * Wellbeing check-in for a child
 */
export interface WellbeingCheckIn {
  id: string;
  childId: string;
  date: Date;
  mood: 'very_happy' | 'happy' | 'neutral' | 'sad' | 'very_sad';
  sleepQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'very_poor';
  energyLevel: 'high' | 'medium' | 'low';
  anxiety: 'none' | 'mild' | 'moderate' | 'high';
  notes?: string;
  parentId?: string;
  educatorId?: string;
}

/**
 * Individual Education Plan (IEP) for a child with special educational needs
 */
export interface IndividualEducationPlan {
  id: string;
  childId: string;
  startDate: Date;
  reviewDate: Date;
  specialEducationalNeeds: SpecialEducationalNeed[];
  strengths: string[];
  challenges: string[];
  accommodations: string[];
  goals: IEPGoal[];
  supportServices: SupportService[];
  notes: string;
  status: 'draft' | 'active' | 'under_review' | 'archived';
}

/**
 * Goal in an Individual Education Plan
 */
export interface IEPGoal {
  id: string;
  description: string;
  strategies: string[];
  success: string;
  progress: number; // 0-100
  targetDate: Date;
  achievedDate?: Date;
}

/**
 * Support service for a child with special educational needs
 */
export interface SupportService {
  id: string;
  name: string;
  provider: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

/**
 * School announcement visible to parents
 */
export interface SchoolAnnouncement {
  id: string;
  title: string;
  content: string;
  publishDate: Date;
  expiryDate?: Date;
  importance: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'year_group' | 'class' | 'individual';
  targetYearGroup?: number;
  targetClassId?: string;
  targetChildId?: string;
  attachments?: MessageAttachment[];
}

/**
 * Homework assignment for a child
 */
export interface HomeworkAssignment {
  id: string;
  title: string;
  description: string;
  subject: UKSubject;
  assignedDate: Date;
  dueDate: Date;
  status: 'assigned' | 'in_progress' | 'submitted' | 'marked' | 'late';
  childId: string;
  educatorId: string;
  attachments?: MessageAttachment[];
  submissionUrl?: string;
  feedback?: string;
  grade?: string;
}

/**
 * Behaviour record for a child
 */
export interface BehaviourRecord {
  id: string;
  childId: string;
  date: Date;
  type: 'positive' | 'negative';
  category: string;
  description: string;
  location: string;
  educatorId: string;
  points?: number;
  actionTaken?: string;
  parentNotified: boolean;
  resolutionStatus?: 'pending' | 'in_progress' | 'resolved';
}

/**
 * Parent feedback on the child's educational experience
 */
export interface ParentFeedback {
  id: string;
  parentId: string;
  childId: string;
  date: Date;
  category: 'general' | 'curriculum' | 'teaching' | 'support' | 'communication' | 'facilities' | 'other';
  rating: number; // 1-5
  comments: string;
  requiresResponse: boolean;
  responded: boolean;
  responseDate?: Date;
  responseContent?: string;
  responderId?: string;
}
