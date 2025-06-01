/**
 * UK Educational Compliance Types
 * 
 * This file defines the core types for UK educational compliance features
 * in the EdPsych-AI-Education-Platform, including DFE compliance, GDPR,
 * safeguarding, data protection, and content moderation.
 */

import { z } from 'zod';
import { SupportedLanguage } from '../i18n/types';
import { UKKeyStage } from '../assessment/types';

/**
 * Age appropriateness rating enum
 */
export enum AgeAppropriatenessRating {
  EARLY_YEARS = 'early_years', // 3-5 years
  PRIMARY_LOWER = 'primary_lower', // 5-7 years (KS1)
  PRIMARY_UPPER = 'primary_upper', // 7-11 years (KS2)
  SECONDARY_LOWER = 'secondary_lower', // 11-14 years (KS3)
  SECONDARY_UPPER = 'secondary_upper', // 14-16 years (KS4)
  POST_16 = 'post_16', // 16-18 years (KS5)
  ADULT = 'adult', // 18+ years
  ALL_AGES = 'all_ages' // Suitable for all ages
}

/**
 * Content category enum for classification
 */
export enum ContentCategory {
  EDUCATIONAL = 'educational',
  INFORMATIONAL = 'informational',
  ENTERTAINMENT = 'entertainment',
  COMMUNICATION = 'communication',
  USER_GENERATED = 'user_generated',
  ASSESSMENT = 'assessment',
  ADMINISTRATIVE = 'administrative'
}

/**
 * Safeguarding concern level enum
 */
export enum SafeguardingConcernLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Safeguarding concern type enum
 */
export enum SafeguardingConcernType {
  BULLYING = 'bullying',
  HARASSMENT = 'harassment',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  SELF_HARM = 'self_harm',
  SUICIDAL_IDEATION = 'suicidal_ideation',
  ABUSE = 'abuse',
  RADICALIZATION = 'radicalization',
  GROOMING = 'grooming',
  OTHER = 'other'
}

/**
 * Data protection category enum
 */
export enum DataProtectionCategory {
  PERSONAL = 'personal',
  SPECIAL_CATEGORY = 'special_category',
  EDUCATIONAL_RECORD = 'educational_record',
  ASSESSMENT_DATA = 'assessment_data',
  BEHAVIORAL_DATA = 'behavioral_data',
  COMMUNICATION_DATA = 'communication_data',
  SYSTEM_DATA = 'system_data'
}

/**
 * Data retention period enum
 */
export enum DataRetentionPeriod {
  SESSION = 'session',
  SHORT_TERM = 'short_term', // Up to 30 days
  MEDIUM_TERM = 'medium_term', // Up to 1 year
  LONG_TERM = 'long_term', // Up to 7 years
  PERMANENT = 'permanent' // Until explicitly deleted
}

/**
 * Content moderation action enum
 */
export enum ContentModerationAction {
  APPROVE = 'approve',
  FLAG_FOR_REVIEW = 'flag_for_review',
  MODIFY = 'modify',
  REJECT = 'reject',
  BLOCK = 'block'
}

/**
 * Content moderation reason enum
 */
export enum ContentModerationReason {
  INAPPROPRIATE_LANGUAGE = 'inappropriate_language',
  HARMFUL_CONTENT = 'harmful_content',
  PERSONAL_INFORMATION = 'personal_information',
  COPYRIGHT_VIOLATION = 'copyright_violation',
  AGE_INAPPROPRIATE = 'age_inappropriate',
  BULLYING_HARASSMENT = 'bullying_harassment',
  SPAM = 'spam',
  OFF_TOPIC = 'off_topic',
  OTHER = 'other'
}

/**
 * DFE compliance schema
 */
export const DFEComplianceSchema = z.object({
  keyStage: z.nativeEnum(UKKeyStage),
  curriculumStandards: z.array(z.string()),
  ageAppropriate: z.boolean(),
  ageRating: z.nativeEnum(AgeAppropriatenessRating),
  accessibilityCompliant: z.boolean(),
  senProvisions: z.array(z.string()).optional(),
  inclusivityChecked: z.boolean(),
  lastReviewDate: z.date(),
  reviewedBy: z.string(),
  nextReviewDate: z.date(),
  notes: z.string().optional()
});

export type DFECompliance = z.infer<typeof DFEComplianceSchema>;

/**
 * GDPR data processing basis enum
 */
export enum GDPRProcessingBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_TASK = 'public_task',
  LEGITIMATE_INTERESTS = 'legitimate_interests'
}

/**
 * GDPR compliance schema
 */
export const GDPRComplianceSchema = z.object({
  dataCategory: z.nativeEnum(DataProtectionCategory),
  processingPurpose: z.string(),
  processingBasis: z.nativeEnum(GDPRProcessingBasis),
  retentionPeriod: z.nativeEnum(DataRetentionPeriod),
  retentionJustification: z.string(),
  dataMinimized: z.boolean(),
  encryptionApplied: z.boolean(),
  accessControls: z.array(z.string()),
  subjectAccessEnabled: z.boolean(),
  rightToErasureEnabled: z.boolean(),
  dataPortabilityEnabled: z.boolean(),
  privacyNoticeUrl: z.string().url(),
  dpoContactInfo: z.string(),
  thirdPartyProcessors: z.array(z.object({
    name: z.string(),
    purpose: z.string(),
    dataShared: z.array(z.string()),
    location: z.string(),
    adequacyMechanism: z.string().optional()
  })).optional(),
  lastReviewDate: z.date(),
  reviewedBy: z.string()
});

export type GDPRCompliance = z.infer<typeof GDPRComplianceSchema>;

/**
 * Safeguarding report schema
 */
export const SafeguardingReportSchema = z.object({
  id: z.string().uuid(),
  concernType: z.nativeEnum(SafeguardingConcernType),
  concernLevel: z.nativeEnum(SafeguardingConcernLevel),
  description: z.string(),
  reportedBy: z.string(),
  reportedAt: z.date(),
  involvedUsers: z.array(z.string()).optional(),
  contentReference: z.string().optional(),
  status: z.enum(['reported', 'under_review', 'action_taken', 'resolved', 'dismissed']),
  assignedTo: z.string().optional(),
  actionTaken: z.string().optional(),
  actionDate: z.date().optional(),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.date().optional(),
  notes: z.string().optional()
});

export type SafeguardingReport = z.infer<typeof SafeguardingReportSchema>;

/**
 * Content moderation result schema
 */
export const ContentModerationResultSchema = z.object({
  id: z.string().uuid(),
  contentId: z.string(),
  contentType: z.string(),
  contentHash: z.string(),
  moderationAction: z.nativeEnum(ContentModerationAction),
  moderationReason: z.nativeEnum(ContentModerationReason).optional(),
  confidenceScore: z.number().min(0).max(1).optional(),
  moderatedBy: z.enum(['automated', 'human']),
  moderatorId: z.string().optional(),
  moderatedAt: z.date(),
  originalContent: z.string().optional(),
  modifiedContent: z.string().optional(),
  notes: z.string().optional()
});

export type ContentModerationResult = z.infer<typeof ContentModerationResultSchema>;

/**
 * Age verification level enum
 */
export enum AgeVerificationLevel {
  SELF_DECLARATION = 'self_declaration',
  PARENT_CONFIRMATION = 'parent_confirmation',
  SCHOOL_CONFIRMATION = 'school_confirmation',
  DOCUMENT_VERIFICATION = 'document_verification'
}

/**
 * Age verification record schema
 */
export const AgeVerificationRecordSchema = z.object({
  userId: z.string(),
  declaredAge: z.number().min(3).max(100),
  verificationLevel: z.nativeEnum(AgeVerificationLevel),
  verifiedBy: z.string().optional(),
  verificationDate: z.date(),
  verificationMethod: z.string().optional(),
  verificationEvidence: z.string().optional(),
  expiryDate: z.date().optional(),
  lastRevalidationDate: z.date().optional()
});

export type AgeVerificationRecord = z.infer<typeof AgeVerificationRecordSchema>;

/**
 * Content filtering level enum
 */
export enum ContentFilteringLevel {
  MINIMAL = 'minimal',
  MODERATE = 'moderate',
  STRICT = 'strict',
  VERY_STRICT = 'very_strict'
}

/**
 * Content filtering settings schema
 */
export const ContentFilteringSettingsSchema = z.object({
  userId: z.string(),
  filteringLevel: z.nativeEnum(ContentFilteringLevel),
  customKeywordFilters: z.array(z.string()).optional(),
  categoryFilters: z.array(z.string()).optional(),
  allowedContentCategories: z.array(z.nativeEnum(ContentCategory)),
  blockedContentCategories: z.array(z.nativeEnum(ContentCategory)),
  ageAppropriateContentOnly: z.boolean().default(true),
  maxAgeRating: z.nativeEnum(AgeAppropriatenessRating),
  parentalControlsEnabled: z.boolean().default(false),
  parentalControlPassword: z.string().optional(),
  lastUpdatedBy: z.string(),
  lastUpdatedAt: z.date()
});

export type ContentFilteringSettings = z.infer<typeof ContentFilteringSettingsSchema>;

/**
 * Data protection impact assessment schema
 */
export const DataProtectionImpactAssessmentSchema = z.object({
  id: z.string().uuid(),
  featureName: z.string(),
  featureDescription: z.string(),
  dataProcessingActivities: z.array(z.string()),
  personalDataTypes: z.array(z.string()),
  dataSubjects: z.array(z.string()),
  processingPurposes: z.array(z.string()),
  necessityJustification: z.string(),
  proportionalityAssessment: z.string(),
  risks: z.array(z.object({
    description: z.string(),
    likelihood: z.enum(['low', 'medium', 'high']),
    impact: z.enum(['low', 'medium', 'high']),
    mitigationMeasures: z.array(z.string())
  })),
  consultationDetails: z.string().optional(),
  dpoRecommendation: z.string().optional(),
  implementationDecision: z.enum(['approved', 'approved_with_conditions', 'rejected']),
  decisionJustification: z.string(),
  conditions: z.array(z.string()).optional(),
  reviewSchedule: z.string(),
  completedBy: z.string(),
  completedAt: z.date(),
  approvedBy: z.string().optional(),
  approvedAt: z.date().optional()
});

export type DataProtectionImpactAssessment = z.infer<typeof DataProtectionImpactAssessmentSchema>;

/**
 * Interfaces for compliance services
 */

/**
 * DFE compliance service interface
 */
export interface DFEComplianceService {
  validateCurriculumAlignment: (content: any, keyStage: UKKeyStage) => Promise<{
    isAligned: boolean;
    alignmentScore: number;
    misalignments: string[];
    recommendations: string[];
  }>;
  
  checkAgeAppropriateness: (content: any, targetAgeRange: { min: number; max: number }) => Promise<{
    isAppropriate: boolean;
    appropriatenessScore: number;
    concerns: string[];
    recommendedAgeRating: AgeAppropriatenessRating;
  }>;
  
  validateAccessibility: (content: any) => Promise<{
    isAccessible: boolean;
    accessibilityScore: number;
    issues: string[];
    recommendations: string[];
  }>;
  
  checkInclusivity: (content: any) => Promise<{
    isInclusive: boolean;
    inclusivityScore: number;
    issues: string[];
    recommendations: string[];
  }>;
  
  generateComplianceReport: (contentId: string) => Promise<DFECompliance>;
}

/**
 * GDPR compliance service interface
 */
export interface GDPRComplianceService {
  registerDataProcessingActivity: (activity: {
    name: string;
    description: string;
    dataCategory: DataProtectionCategory;
    processingPurpose: string;
    processingBasis: GDPRProcessingBasis;
    retentionPeriod: DataRetentionPeriod;
  }) => Promise<string>;
  
  recordDataSubjectConsent: (userId: string, purposeId: string, consentGiven: boolean) => Promise<boolean>;
  
  handleSubjectAccessRequest: (userId: string) => Promise<{
    personalData: any;
    processingActivities: string[];
    processingPurposes: string[];
    retentionPeriods: Record<string, string>;
    recipients: string[];
  }>;
  
  handleRightToErasure: (userId: string, dataCategories?: DataProtectionCategory[]) => Promise<{
    success: boolean;
    erasedCategories: string[];
    retainedCategories: string[];
    retentionReasons: Record<string, string>;
  }>;
  
  handleDataPortability: (userId: string, format: 'json' | 'csv' | 'xml') => Promise<{
    success: boolean;
    downloadUrl: string;
    expiryDate: Date;
  }>;
  
  conductImpactAssessment: (featureId: string) => Promise<DataProtectionImpactAssessment>;
  
  logDataBreach: (details: {
    description: string;
    affectedUsers: string[];
    affectedDataCategories: DataProtectionCategory[];
    detectionDate: Date;
    containmentActions: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
  }) => Promise<string>;
}

/**
 * Safeguarding service interface
 */
export interface SafeguardingService {
  reportConcern: (concern: {
    concernType: SafeguardingConcernType;
    description: string;
    reportedBy: string;
    involvedUsers?: string[];
    contentReference?: string;
  }) => Promise<string>;
  
  assessConcern: (reportId: string, assessment: {
    concernLevel: SafeguardingConcernLevel;
    assignedTo: string;
    notes?: string;
  }) => Promise<boolean>;
  
  takeSafeguardingAction: (reportId: string, action: {
    actionTaken: string;
    actionDate: Date;
    followUpRequired: boolean;
    followUpDate?: Date;
    notes?: string;
  }) => Promise<boolean>;
  
  monitorUserActivity: (userId: string) => Promise<{
    concernIndicators: Array<{
      indicator: string;
      severity: 'low' | 'medium' | 'high';
      detectionDate: Date;
    }>;
    recommendedActions: string[];
  }>;
  
  getSafeguardingReports: (filters?: {
    status?: string;
    concernType?: SafeguardingConcernType;
    concernLevel?: SafeguardingConcernLevel;
    dateRange?: { start: Date; end: Date };
  }) => Promise<SafeguardingReport[]>;
  
  getSafeguardingPolicies: () => Promise<Array<{
    id: string;
    title: string;
    version: string;
    effectiveDate: Date;
    documentUrl: string;
  }>>;
}

/**
 * Content moderation service interface
 */
export interface ContentModerationService {
  moderateText: (text: string, context: {
    contentType: string;
    authorId: string;
    targetAudience: AgeAppropriatenessRating;
    language: SupportedLanguage;
  }) => Promise<ContentModerationResult>;
  
  moderateImage: (imageUrl: string, context: {
    contentType: string;
    authorId: string;
    targetAudience: AgeAppropriatenessRating;
  }) => Promise<ContentModerationResult>;
  
  moderateDocument: (documentUrl: string, context: {
    contentType: string;
    authorId: string;
    targetAudience: AgeAppropriatenessRating;
    language: SupportedLanguage;
  }) => Promise<ContentModerationResult>;
  
  filterUserContent: (content: string, filteringSettings: ContentFilteringSettings) => Promise<{
    filteredContent: string;
    filteringActions: Array<{
      originalText: string;
      replacementText: string;
      reason: ContentModerationReason;
    }>;
  }>;
  
  getUserContentFilteringSettings: (userId: string) => Promise<ContentFilteringSettings>;
  
  updateUserContentFilteringSettings: (userId: string, settings: Partial<ContentFilteringSettings>) => Promise<boolean>;
  
  reviewModerationDecision: (moderationResultId: string, review: {
    decision: 'uphold' | 'overturn';
    reviewedBy: string;
    notes: string;
  }) => Promise<boolean>;
}

/**
 * Age verification service interface
 */
export interface AgeVerificationService {
  verifyUserAge: (userId: string, declaredAge: number, method: AgeVerificationLevel) => Promise<{
    verified: boolean;
    verificationRecord: AgeVerificationRecord;
  }>;
  
  getUserAgeVerification: (userId: string) => Promise<AgeVerificationRecord | null>;
  
  isUserAgeVerified: (userId: string) => Promise<boolean>;
  
  isContentAllowedForUser: (userId: string, contentAgeRating: AgeAppropriatenessRating) => Promise<{
    allowed: boolean;
    reason?: string;
  }>;
  
  revalidateAgeVerification: (userId: string) => Promise<boolean>;
}

/**
 * Data protection service interface
 */
export interface DataProtectionService {
  classifyData: (data: any) => Promise<{
    categories: string[];
    sensitivityLevel: 'low' | 'medium' | 'high';
    personalDataFields: string[];
    specialCategoryFields: string[];
  }>;
  
  applyDataMinimization: (data, purpose: string) => Promise<{
    minimizedData;
    removedFields: any[];
  }>;
  
  applyPseudonymization: (data, fields: string[]) => Promise<{
    pseudonymizedData;
    mappingKey: string;
  }>;
  
  applyAnonymization: (data) => Promise<{
    anonymizedData;
    anonymizationLevel: 'partial' | 'complete';
    reidentificationRisk: 'low' | 'medium' | 'high';
  }>;
  
  encryptData: (data, level: 'standard' | 'high') => Promise<{
    encryptedData: string;
    decryptionKeyId: string;
  }>;
  
  decryptData: (encryptedData: string, decryptionKeyId: string) => Promise<any>;
  
  applyRetentionPolicy: (dataCategory: DataProtectionCategory) => Promise<{
    retentionPeriod: DataRetentionPeriod;
    retentionJustification: string;
    archivingRequirements: any[];
    deletionMethod: string;
  }>;
  
  scheduleDataDeletion: (dataId: string, deletionDate: Date) => Promise<boolean>;
}
