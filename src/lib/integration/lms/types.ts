/**
 * LMS Integration Types
 * 
 * Type definitions for LMS integration functionality
 */

/**
 * LTI Message Types as defined in the LTI 1.3 specification
 */
export enum LTIMessageType {
  RESOURCE_LINK_REQUEST = 'LtiResourceLinkRequest',
  DEEP_LINKING_REQUEST = 'LtiDeepLinkingRequest',
  SUBMISSION_REVIEW_REQUEST = 'LtiSubmissionReviewRequest',
  CONTENT_ITEM_SELECTION = 'ContentItemSelection'
}

/**
 * LTI Version
 */
export enum LTIVersion {
  V1_3 = '1.3.0'
}

/**
 * LTI Deployment State
 */
export enum LTIDeploymentState {
  PENDING = 'pending',
  ACTIVE = 'active',
  DISABLED = 'disabled'
}

/**
 * LMS Platform Types supported by the EdPsych Connect platform
 */
export enum LMSPlatformType {
  MOODLE = 'moodle',
  CANVAS = 'canvas',
  BLACKBOARD = 'blackboard',
  MICROSOFT_TEAMS = 'microsoft_teams',
  GOOGLE_CLASSROOM = 'google_classroom',
  OTHER = 'other'
}

/**
 * LMS Platform Registration
 */
export interface LMSPlatformRegistration {
  id: string;
  tenantId: string;
  platformName: string;
  platformType: LMSPlatformType;
  clientId: string;
  authenticationEndpoint: string;
  tokenEndpoint: string;
  keysetUrl: string;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
  updatedAt: Date;
  state: LTIDeploymentState;
}

/**
 * LTI Resource Link
 */
export interface LTIResourceLink {
  id: string;
  registrationId: string;
  resourceLinkId: string;
  contextId?: string;
  title?: string;
  description?: string;
  lineItemUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * LTI Context (Course)
 */
export interface LTIContext {
  id: string;
  registrationId: string;
  contextId: string;
  title?: string;
  label?: string;
  type?: string[];
  namesAndRolesUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * OIDC State for LTI Authentication
 */
export interface OIDCState {
  state: string;
  nonce: string;
  loginHint: string;
  messageHint?: string;
  targetLinkUri: string;
  registrationId: string;
  tenantId: string;
  createdAt: Date;
}

/**
 * LTI User
 */
export interface LTIUser {
  id: string;
  registrationId: string;
  userId: string;
  name?: string;
  email?: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Analytics Integration Settings
 */
export interface AnalyticsIntegrationSettings {
  enabled: boolean;
  shareProgressData: boolean;
  shareLearningAnalytics: boolean;
  shareCurriculumCoverage: boolean;
  shareAssessmentData: boolean;
  shareEngagementMetrics: boolean;
}

/**
 * Parent Portal Integration Settings
 */
export interface ParentPortalIntegrationSettings {
  enabled: boolean;
  linkParentAccounts: boolean;
  shareProgressReports: boolean;
  integrateCommunicationChannels: boolean;
  syncEventCalendars: boolean;
  manageResourceAccess: boolean;
}

/**
 * Accessibility Integration Settings
 */
export interface AccessibilityIntegrationSettings {
  enabled: boolean;
  syncAccessibilitySettings: boolean;
  ensureAccessibleContentDelivery: boolean;
  maintainScreenReaderSupport: boolean;
  preserveVisualSettings: boolean;
  ensureKeyboardNavigation: boolean;
}

/**
 * Language Integration Settings
 */
export interface LanguageIntegrationSettings {
  enabled: boolean;
  syncLanguagePreferences: boolean;
  deliverLocalizedContent: boolean;
  maintainRTLSupport: boolean;
  preserveUKTerminology: boolean;
  ensureTranslationConsistency: boolean;
}

/**
 * Complete LMS Integration Configuration
 */
export interface LMSIntegrationConfig {
  platformRegistration: LMSPlatformRegistration;
  analyticsSettings: AnalyticsIntegrationSettings;
  parentPortalSettings: ParentPortalIntegrationSettings;
  accessibilitySettings: AccessibilityIntegrationSettings;
  languageSettings: LanguageIntegrationSettings;
}
