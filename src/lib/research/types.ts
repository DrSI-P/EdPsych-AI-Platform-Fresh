/**
 * Research and Impact Measurement Types
 * 
 * This file defines the core types for research and impact measurement features
 * in the EdPsych-AI-Education-Platform, supporting evidence-based evaluation
 * of educational interventions and outcomes.
 */

import { z } from 'zod';
import { UKKeyStage, UKSubject } from '../assessment/types';

/**
 * Research domain enum
 */
export enum ResearchDomain {
  ACADEMIC_ACHIEVEMENT = 'academic_achievement',
  COGNITIVE_DEVELOPMENT = 'cognitive_development',
  SOCIAL_EMOTIONAL = 'social_emotional',
  Behavioural = 'behavioural',
  ENGAGEMENT = 'engagement',
  INCLUSION = 'inclusion',
  TEACHING_PRACTICE = 'teaching_practice',
  PARENTAL_INVOLVEMENT = 'parental_involvement',
  TECHNOLOGY_INTEGRATION = 'technology_integration',
  CURRICULUM_EFFECTIVENESS = 'curriculum_effectiveness'
}

/**
 * Research methodology enum
 */
export enum ResearchMethodology {
  QUANTITATIVE = 'quantitative',
  QUALITATIVE = 'qualitative',
  MIXED_METHODS = 'mixed_methods',
  LONGITUDINAL = 'longitudinal',
  CROSS_SECTIONAL = 'cross_sectional',
  CASE_STUDY = 'case_study',
  ACTION_RESEARCH = 'action_research',
  EXPERIMENTAL = 'experimental',
  QUASI_EXPERIMENTAL = 'quasi_experimental',
  OBSERVATIONAL = 'observational'
}

/**
 * Data collection method enum
 */
export enum DataCollectionMethod {
  ASSESSMENT = 'assessment',
  SURVEY = 'survey',
  INTERVIEW = 'interview',
  OBSERVATION = 'observation',
  FOCUS_GROUP = 'focus_group',
  DOCUMENT_ANALYSIS = 'document_analysis',
  SYSTEM_ANALYTICS = 'system_analytics',
  STANDARDIZED_TEST = 'standardized_test',
  PORTFOLIO = 'portfolio',
  BEHAVIORAL_TRACKING = 'behavioral_tracking'
}

/**
 * Impact level enum
 */
export enum ImpactLevel {
  INDIVIDUAL = 'individual',
  CLASSROOM = 'classroom',
  SCHOOL = 'school',
  DISTRICT = 'district',
  NATIONAL = 'national',
  INTERNATIONAL = 'international'
}

/**
 * Evidence strength enum
 */
export enum EvidenceStrength {
  ANECDOTAL = 'anecdotal',
  PROMISING = 'promising',
  MODERATE = 'moderate',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong'
}

/**
 * Research project status enum
 */
export enum ResearchProjectStatus {
  PLANNING = 'planning',
  DATA_COLLECTION = 'data_collection',
  ANALYSIS = 'analysis',
  REPORTING = 'reporting',
  COMPLETED = 'completed',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

/**
 * Research project schema
 */
export const ResearchProjectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  domains: z.array(z.nativeEnum(ResearchDomain)),
  methodology: z.nativeEnum(ResearchMethodology),
  dataCollectionMethods: z.array(z.nativeEnum(DataCollectionMethod)),
  researchQuestions: z.array(z.string()),
  hypotheses: z.array(z.string()).optional(),
  targetPopulation: z.object({
    keyStages: z.array(z.nativeEnum(UKKeyStage)),
    subjects: z.array(z.nativeEnum(UKSubject)).optional(),
    specialEducationalNeeds: z.array(z.string()).optional(),
    demographicFactors: z.array(z.string()).optional()
  }),
  sampleSize: z.object({
    planned: z.number().int().positive(),
    actual: z.number().int().nonnegative().optional()
  }),
  timeline: z.object({
    startDate: z.date(),
    endDate: z.date(),
    milestones: z.array(z.object({
      title: z.string(),
      date: z.date(),
      completed: z.boolean().default(false)
    }))
  }),
  ethicalConsiderations: z.array(z.string()),
  ethicalApproval: z.object({
    required: z.boolean(),
    approved: z.boolean().optional(),
    approvalDate: z.date().optional(),
    approvalReference: z.string().optional()
  }),
  dataManagementPlan: z.object({
    dataStorageLocation: z.string(),
    retentionPeriod: z.string(),
    anonymizationProcess: z.string(),
    dataAccessControls: z.array(z.string())
  }),
  collaborators: z.array(z.object({
    id: z.string(),
    role: z.string(),
    organisation: z.string().optional()
  })),
  status: z.nativeEnum(ResearchProjectStatus),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type ResearchProject = z.infer<typeof ResearchProjectSchema>;

/**
 * Data collection instrument schema
 */
export const DataCollectionInstrumentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  type: z.nativeEnum(DataCollectionMethod),
  format: z.enum(['structured', 'semi_structured', 'unstructured']),
  targetDomains: z.array(z.nativeEnum(ResearchDomain)),
  questions: z.array(z.object({
    id: z.string(),
    text: z.string(),
    type: z.enum(['multiple_choice', 'likert_scale', 'open_ended', 'yes_no', 'rating', 'ranking', 'matrix', 'demographic']),
    options: z.array(z.string()).optional(),
    required: z.boolean().default(true),
    validationRules: z.array(z.string()).optional()
  })).optional(),
  scoringMethod: z.string().optional(),
  validationStatus: z.object({
    isValidated: z.boolean(),
    validationMethod: z.string().optional(),
    reliability: z.number().min(0).max(1).optional(),
    validity: z.number().min(0).max(1).optional()
  }),
  administrationGuidelines: z.string(),
  estimatedCompletionTime: z.number().int().positive(),
  targetAudience: z.array(z.nativeEnum(UKKeyStage)),
  accessibilityFeatures: z.array(z.string()).optional(),
  translations: z.array(z.string()).optional(),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type DataCollectionInstrument = z.infer<typeof DataCollectionInstrumentSchema>;

/**
 * Data collection session schema
 */
export const DataCollectionSessionSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  instrumentId: z.string().uuid(),
  participantId: z.string(),
  facilitatorId: z.string().optional(),
  startTime: z.date(),
  endTime: z.date().optional(),
  completionStatus: z.enum(['not_started', 'in_progress', 'completed', 'abandoned']),
  responses: z.record(z.string(), z.any()).optional(),
  contextualNotes: z.string().optional(),
  environmentalFactors: z.array(z.string()).optional(),
  technicalIssues: z.array(z.string()).optional(),
  participantFeedback: z.string().optional(),
  dataQualityAssessment: z.object({
    completeness: z.number().min(0).max(1).optional(),
    consistency: z.number().min(0).max(1).optional(),
    validityFlags: z.array(z.string()).optional()
  }).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type DataCollectionSession = z.infer<typeof DataCollectionSessionSchema>;

/**
 * Impact measurement framework schema
 */
export const ImpactMeasurementFrameworkSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  domains: z.array(z.nativeEnum(ResearchDomain)),
  indicators: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    domain: z.nativeEnum(ResearchDomain),
    measurementMethod: z.string(),
    baselineRequired: z.boolean().default(true),
    targetValue: z.number().optional(),
    unit: z.string().optional(),
    frequency: z.string(),
    responsibleParty: z.string().optional()
  })),
  levels: z.array(z.nativeEnum(ImpactLevel)),
  theoreticalFoundation: z.string(),
  evidenceBase: z.array(z.object({
    source: z.string(),
    strength: z.nativeEnum(EvidenceStrength),
    relevance: z.number().min(1).max(5),
    summary: z.string()
  })),
  implementationRequirements: z.array(z.string()),
  evaluationSchedule: z.object({
    baseline: z.date(),
    formativeAssessments: z.array(z.date()),
    summativeAssessment: z.date()
  }),
  reportingFormat: z.array(z.string()),
  stakeholders: z.array(z.object({
    role: z.string(),
    interests: z.array(z.string()),
    involvementLevel: z.enum(['inform', 'consult', 'involve', 'collaborate', 'empower'])
  })),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type ImpactMeasurementFramework = z.infer<typeof ImpactMeasurementFrameworkSchema>;

/**
 * Impact measurement result schema
 */
export const ImpactMeasurementResultSchema = z.object({
  id: z.string().uuid(),
  frameworkId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  indicatorId: z.string(),
  level: z.nativeEnum(ImpactLevel),
  targetEntityId: z.string(),
  targetEntityType: z.string(),
  measurementDate: z.date(),
  baselineValue: z.number().optional(),
  currentValue: z.number(),
  percentageChange: z.number().optional(),
  targetAchievement: z.number().optional(),
  qualitativeObservations: z.string().optional(),
  contextualFactors: z.array(z.string()).optional(),
  dataSource: z.string(),
  confidenceLevel: z.number().min(0).max(1),
  limitations: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
  nextMeasurementDate: z.date().optional(),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type ImpactMeasurementResult = z.infer<typeof ImpactMeasurementResultSchema>;

/**
 * Longitudinal tracking record schema
 */
export const LongitudinalTrackingRecordSchema = z.object({
  id: z.string().uuid(),
  participantId: z.string(),
  trackingStartDate: z.date(),
  trackingEndDate: z.date().optional(),
  keyStageProgression: z.array(z.object({
    keyStage: z.nativeEnum(UKKeyStage),
    startDate: z.date(),
    endDate: z.date().optional(),
    schoolId: z.string().optional(),
    teacherId: z.string().optional()
  })),
  assessmentResults: z.array(z.object({
    assessmentId: z.string(),
    date: z.date(),
    score: z.number(),
    percentile: z.number().optional(),
    standardizedScore: z.number().optional(),
    subject: z.nativeEnum(UKSubject).optional(),
    notes: z.string().optional()
  })),
  interventions: z.array(z.object({
    interventionId: z.string(),
    name: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    intensity: z.string().optional(),
    adherence: z.number().min(0).max(1).optional(),
    notes: z.string().optional()
  })),
  observations: z.array(z.object({
    date: z.date(),
    domain: z.nativeEnum(ResearchDomain),
    observer: z.string(),
    notes: z.string(),
    attachments: z.array(z.string()).optional()
  })),
  significantEvents: z.array(z.object({
    date: z.date(),
    eventType: z.string(),
    description: z.string(),
    impact: z.string().optional()
  })).optional(),
  dataQuality: z.object({
    completeness: z.number().min(0).max(1),
    consistency: z.number().min(0).max(1),
    timelinessOfUpdates: z.number().min(0).max(1)
  }),
  consentStatus: z.object({
    consentGiven: z.boolean(),
    consentDate: z.date(),
    consentExpiryDate: z.date().optional(),
    consentNotes: z.string().optional()
  }),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type LongitudinalTrackingRecord = z.infer<typeof LongitudinalTrackingRecordSchema>;

/**
 * Qualitative data record schema
 */
export const QualitativeDataRecordSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  participantId: z.string().optional(),
  collectionMethod: z.nativeEnum(DataCollectionMethod),
  collectionDate: z.date(),
  collector: z.string(),
  domain: z.nativeEnum(ResearchDomain),
  content: z.string(),
  context: z.string().optional(),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
  codingStatus: z.enum(['not_coded', 'partially_coded', 'fully_coded']),
  codes: z.array(z.object({
    code: z.string(),
    segment: z.string(),
    coder: z.string(),
    codingDate: z.date()
  })).optional(),
  themes: z.array(z.string()).optional(),
  confidentiality: z.enum(['public', 'anonymized', 'confidential', 'restricted']),
  consentReference: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type QualitativeDataRecord = z.infer<typeof QualitativeDataRecordSchema>;

/**
 * Research partnership schema
 */
export const ResearchPartnershipSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  partnerOrganizations: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['academic', 'school', 'government', 'non_profit', 'commercial', 'community']),
    contactPerson: z.string(),
    contactEmail: z.string().email(),
    role: z.string()
  })),
  researchFocus: z.array(z.nativeEnum(ResearchDomain)),
  objectives: z.array(z.string()),
  startDate: z.date(),
  endDate: z.date().optional(),
  fundingSources: z.array(z.object({
    source: z.string(),
    amount: z.number().optional(),
    startDate: z.date(),
    endDate: z.date().optional(),
    restrictions: z.array(z.string()).optional()
  })).optional(),
  dataSharing: z.object({
    agreement: z.string(),
    restrictions: z.array(z.string()),
    anonymizationRequirements: z.string()
  }),
  intellectualProperty: z.object({
    ownershipTerms: z.string(),
    publicationRights: z.string(),
    commercializationTerms: z.string().optional()
  }),
  governanceStructure: z.string(),
  meetingSchedule: z.string(),
  evaluationPlan: z.string(),
  status: z.enum(['planning', 'active', 'completed', 'suspended']),
  outputs: z.array(z.object({
    type: z.string(),
    title: z.string(),
    date: z.date(),
    url: z.string().url().optional(),
    description: z.string().optional()
  })).optional(),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type ResearchPartnership = z.infer<typeof ResearchPartnershipSchema>;

/**
 * Interfaces for research and impact measurement services
 */

/**
 * Research project service interface
 */
export interface ResearchProjectService {
  createProject: (project: Omit<ResearchProject, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  
  getProject: (projectId: string) => Promise<ResearchProject | null>;
  
  updateProject: (projectId: string, updates: Partial<ResearchProject>) => Promise<boolean>;
  
  listProjects: (filters?: {
    domains?: ResearchDomain[];
    status?: ResearchProjectStatus[];
    keyStages?: UKKeyStage[];
  }) => Promise<ResearchProject[]>;
  
  addCollaborator: (projectId: string, collaborator: {
    id: string;
    role: string;
    organisation?: string;
  }) => Promise<boolean>;
  
  updateProjectStatus: (projectId: string, status: ResearchProjectStatus) => Promise<boolean>;
  
  generateResearchBrief: (projectId: string) => Promise<{
    projectSummary: string;
    methodology: string;
    timeline: string;
    ethicalConsiderations: string;
    dataManagementSummary: string;
  }>;
}

/**
 * Data collection service interface
 */
export interface DataCollectionService {
  createInstrument: (instrument: Omit<DataCollectionInstrument, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  
  getInstrument: (instrumentId: string) => Promise<DataCollectionInstrument | null>;
  
  updateInstrument: (instrumentId: string, updates: Partial<DataCollectionInstrument>) => Promise<boolean>;
  
  listInstruments: (filters?: {
    types?: DataCollectionMethod[];
    domains?: ResearchDomain[];
    keyStages?: UKKeyStage[];
  }) => Promise<DataCollectionInstrument[]>;
  
  startDataCollectionSession: (session: {
    projectId: string;
    instrumentId: string;
    participantId: string;
    facilitatorId?: string;
  }) => Promise<string>;
  
  submitSessionResponse: (sessionId: string, responses: Record<string, any>) => Promise<boolean>;
  
  completeSession: (sessionId: string, endTime: Date) => Promise<boolean>;
  
  getSessionResults: (sessionId: string) => Promise<DataCollectionSession | null>;
  
  validateInstrument: (instrumentId: string, validationMethod: string) => Promise<{
    isValid: boolean;
    reliability: number;
    validity: number;
    issues: any[];
  }>;
}

/**
 * Impact measurement service interface
 */
export interface ImpactMeasurementService {
  createFramework: (framework: Omit<ImpactMeasurementFramework, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  
  getFramework: (frameworkId: string) => Promise<ImpactMeasurementFramework | null>;
  
  updateFramework: (frameworkId: string, updates: Partial<ImpactMeasurementFramework>) => Promise<boolean>;
  
  listFrameworks: (filters?: {
    domains?: ResearchDomain[];
    levels?: ImpactLevel[];
  }) => Promise<ImpactMeasurementFramework[]>;
  
  recordMeasurement: (measurement: Omit<ImpactMeasurementResult, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  
  getMeasurementResults: (filters: {
    frameworkId?: string;
    projectId?: string;
    indicatorId?: string;
    level?: ImpactLevel;
    targetEntityId?: string;
    dateRange?: { start: Date; end: Date };
  }) => Promise<ImpactMeasurementResult[]>;
  
  analyzeImpact: (frameworkId: string, filters?: {
    projectId?: string;
    level?: ImpactLevel;
    dateRange?: { start: Date; end: Date };
  }) => Promise<{
    summary: string;
    indicatorResults: Array<{
      indicatorId: string;
      indicatorName: string;
      baselineValue: number;
      currentValue: number;
      percentageChange: number;
      targetAchievement: number;
      trend: 'improving' | 'stable' | 'declining';
    }>;
    domains: Record<ResearchDomain, {
      overallImpact: number;
      confidence: number;
      keyFindings: string[];
    }>;
    recommendations: string[];
  }>;
  
  generateImpactReport: (frameworkId: string, projectId?: string) => Promise<{
    reportUrl: string;
    executiveSummary: string;
    keyFindings: string[];
    visualizations: string[];
  }>;
}

/**
 * Longitudinal tracking service interface
 */
export interface LongitudinalTrackingService {
  createTrackingRecord: (record: Omit<LongitudinalTrackingRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  
  getTrackingRecord: (recordId: string) => Promise<LongitudinalTrackingRecord | null>;
  
  updateTrackingRecord: (recordId: string, updates: Partial<LongitudinalTrackingRecord>) => Promise<boolean>;
  
  addAssessmentResult: (recordId: string, result: {
    assessmentId: string;
    date: Date;
    score: number;
    percentile?: number;
    standardizedScore?: number;
    subject?: UKSubject;
    notes?: string;
  }) => Promise<boolean>;
  
  addIntervention: (recordId: string, intervention: {
    interventionId: string;
    name: string;
    startDate: Date;
    endDate?: Date;
    intensity?: string;
    adherence?: number;
    notes?: string;
  }) => Promise<boolean>;
  
  addObservation: (recordId: string, observation: {
    date: Date;
    domain: ResearchDomain;
    observer: string;
    notes: string;
    attachments?: string[];
  }) => Promise<boolean>;
  
  analyzeProgressionTrends: (filters: {
    keyStages?: UKKeyStage[];
    subjects?: UKSubject[];
    interventionTypes?: string[];
    dateRange?: { start: Date; end: Date };
  }) => Promise<{
    overallTrends: string;
    keyStageProgressions: Record<UKKeyStage, {
      averageProgressRate: number;
      successFactors: string[];
      challenges: string[];
    }>;
    interventionEffectiveness: Record<string, {
      impactScore: number;
      confidence: number;
      contextualFactors: string[];
    }>;
    recommendations: string[];
  }>;
  
  generateProgressionReport: (participantId: string) => Promise<{
    reportUrl: string;
    summary: string;
    keyMilestones: string[];
    interventionImpacts: string[];
    recommendations: string[];
  }>;
}

/**
 * Qualitative data service interface
 */
export interface QualitativeDataService {
  recordQualitativeData: (data: Omit<QualitativeDataRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  
  getQualitativeRecord: (recordId: string) => Promise<QualitativeDataRecord | null>;
  
  updateQualitativeRecord: (recordId: string, updates: Partial<QualitativeDataRecord>) => Promise<boolean>;
  
  listQualitativeRecords: (filters?: {
    projectId?: string;
    participantId?: string;
    domains?: ResearchDomain[];
    collectionMethods?: DataCollectionMethod[];
    dateRange?: { start: Date; end: Date };
    tags?: string[];
  }) => Promise<QualitativeDataRecord[]>;
  
  addCoding: (recordId: string, coding: {
    code: string;
    segment: string;
    coder: string;
  }) => Promise<boolean>;
  
  identifyThemes: (projectId: string, filters?: {
    domains?: ResearchDomain[];
    dateRange?: { start: Date; end: Date };
  }) => Promise<{
    themes: Array<{
      name: string;
      frequency: number;
      relatedCodes: string[];
      keyQuotes: string[];
      domains: ResearchDomain[];
    }>;
    connections: Array<{
      themeA: string;
      themeB: string;
      strength: number;
      description: string;
    }>;
    insights: string[];
  }>;
  
  generateQualitativeReport: (projectId: string) => Promise<{
    reportUrl: string;
    executiveSummary: string;
    methodologySummary: string;
    keyThemes: string[];
    illustrativeQuotes: Record<string, string[]>;
    implications: string[];
  }>;
}

/**
 * Research partnership service interface
 */
export interface ResearchPartnershipService {
  createPartnership: (partnership: Omit<ResearchPartnership, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  
  getPartnership: (partnershipId: string) => Promise<ResearchPartnership | null>;
  
  updatePartnership: (partnershipId: string, updates: Partial<ResearchPartnership>) => Promise<boolean>;
  
  listPartnerships: (filters?: {
    status?: string[];
    domains?: ResearchDomain[];
    organizationTypes?: string[];
  }) => Promise<ResearchPartnership[]>;
  
  addPartnerOrganization: (partnershipId: string, organisation: {
    id: string;
    name: string;
    type: 'academic' | 'school' | 'government' | 'non_profit' | 'commercial' | 'community';
    contactPerson: string;
    contactEmail: string;
    role: string;
  }) => Promise<boolean>;
  
  addOutput: (partnershipId: string, output: {
    type: string;
    title: string;
    date: Date;
    url?: string;
    description?: string;
  }) => Promise<boolean>;
  
  generatePartnershipReport: (partnershipId: string) => Promise<{
    reportUrl: string;
    summary: string;
    achievements: string[];
    challenges: string[];
    nextSteps: string[];
  }>;
  
  findPotentialPartners: (criteria: {
    researchDomains: ResearchDomain[];
    geographicArea?: string;
    organizationTypes?: string[];
    keywords?: string[];
  }) => Promise<Array<{
    organizationId: string;
    name: string;
    type: string;
    researchInterests: string[];
    previousCollaborations: string[];
    contactInformation: {
      contactPerson: string;
      email: string;
      phone?: string;
    };
    relevanceScore: number;
  }>>;
}
