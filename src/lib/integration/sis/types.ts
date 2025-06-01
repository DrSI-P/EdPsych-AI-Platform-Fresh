/**
 * OneRoster Types and Interfaces
 * 
 * This file defines the types and interfaces used in the OneRoster implementation
 * for the EdPsych Connect platform.
 */

/**
 * OneRoster API Versions
 */
export enum OneRosterVersion {
  V1_0 = '1.0',
  V1_1 = '1.1',
  V1_2 = '1.2'
}

/**
 * OneRoster Integration Method
 */
export type OneRosterIntegrationMethod = 'rest' | 'csv';

/**
 * OneRoster Integration Status
 */
export type OneRosterIntegrationStatus = 'pending' | 'active' | 'inactive' | 'error';

/**
 * OneRoster Sync Mode
 */
export type OneRosterSyncMode = 'full' | 'delta';

/**
 * OneRoster Sync Status
 */
export type OneRosterSyncStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

/**
 * OneRoster Entity Type
 */
export type OneRosterEntityType = 'orgs' | 'academicSessions' | 'courses' | 'classes' | 'users' | 'enrollments';

/**
 * OneRoster SIS Integration
 */
export interface OneRosterSisIntegration {
  id: string;
  tenantId: string;
  sisName: string;
  apiUrl: string | null;
  clientId: string | null;
  clientSecret: string | null;
  integrationMethod: OneRosterIntegrationMethod;
  version: OneRosterVersion;
  createdAt: Date;
  updatedAt: Date;
  lastSyncAt: Date | null;
  status: OneRosterIntegrationStatus;
  settings?: Record<string, any>;
}

/**
 * OneRoster Sync Job
 */
export interface OneRosterSyncJob {
  id: string;
  integrationId: string;
  tenantId: string;
  entities: OneRosterEntityType[];
  mode: OneRosterSyncMode;
  dryRun: boolean;
  status: OneRosterSyncStatus;
  startedAt: Date;
  completedAt: Date | null;
  stats: OneRosterSyncStats;
  error?: string;
}

/**
 * OneRoster Sync Statistics
 */
export interface OneRosterSyncStats {
  processed: number;
  created: number;
  updated: number;
  deleted: number;
  errors: number;
}

/**
 * OneRoster Sync Result
 */
export interface OneRosterSyncResult {
  success: boolean;
  syncJobId: string;
  stats: OneRosterSyncStats;
  error?: string;
}

/**
 * OneRoster CSV Upload
 */
export interface OneRosterCsvUpload {
  id: string;
  integrationId: string;
  tenantId: string;
  files: OneRosterCsvFile[];
  uploadedAt: Date;
  processedAt: Date | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

/**
 * OneRoster CSV File
 */
export interface OneRosterCsvFile {
  filename: string;
  entityType: OneRosterEntityType;
  path: string;
  rowCount: number;
  processedCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

/**
 * OneRoster Organization
 */
export interface OneRosterOrg {
  id: string;
  tenantId: string;
  sourceId: string;
  name: string;
  type: 'department' | 'school' | 'district' | 'local' | 'state' | 'national';
  identifier?: string;
  parentSourceId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * OneRoster Academic Session
 */
export interface OneRosterAcademicSession {
  id: string;
  tenantId: string;
  sourceId: string;
  title: string;
  type: 'term' | 'semester' | 'schoolYear' | 'gradingPeriod';
  startDate: Date;
  endDate: Date;
  parentSourceId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * OneRoster Course
 */
export interface OneRosterCourse {
  id: string;
  tenantId: string;
  sourceId: string;
  title: string;
  courseCode?: string;
  grades?: string[];
  subjects?: string[];
  orgSourceId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * OneRoster Class
 */
export interface OneRosterClass {
  id: string;
  tenantId: string;
  sourceId: string;
  title: string;
  classCode?: string;
  classType?: string;
  location?: string;
  grades?: string[];
  subjects?: string[];
  courseSourceId: string;
  schoolSourceId: string;
  termSourceIds: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * OneRoster User
 */
export interface OneRosterUser {
  id: string;
  tenantId: string;
  sourceId: string;
  status: 'active' | 'inactive' | 'tobedeleted';
  username?: string;
  userIds?: { type: string; identifier: string }[];
  enabledUser: boolean;
  givenName: string;
  familyName: string;
  middleName?: string;
  role: 'student' | 'teacher' | 'parent' | 'guardian' | 'relative' | 'aide' | 'administrator';
  identifier?: string;
  email?: string;
  phone?: string;
  grades?: string[];
  password?: string;
  orgSourceIds: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * OneRoster Enrollment
 */
export interface OneRosterEnrollment {
  id: string;
  tenantId: string;
  sourceId: string;
  status: 'active' | 'inactive' | 'tobedeleted';
  role: 'student' | 'teacher' | 'parent' | 'guardian' | 'relative' | 'aide' | 'administrator';
  primary: boolean;
  userSourceId: string;
  classSourceId: string;
  schoolSourceId: string;
  beginDate?: Date;
  endDate?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
