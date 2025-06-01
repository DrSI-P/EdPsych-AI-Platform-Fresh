/**
 * Deployment Configuration
 * 
 * This file contains the deployment configuration for the EdPsych-AI-Education-Platform,
 * including Vercel deployment settings, environment variables, and build configuration.
 */

import { z } from 'zod';

/**
 * Environment enum
 */
export enum DeploymentEnvironment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

/**
 * Deployment provider enum
 */
export enum DeploymentProvider {
  VERCEL = 'vercel',
  NETLIFY = 'netlify',
  AWS = 'aws',
  AZURE = 'azure',
  CUSTOM = 'custom'
}

/**
 * Environment variable schema
 */
export const EnvironmentVariableSchema = z.object({
  key: z.string(),
  value: z.string(),
  isSecret: z.boolean().default(false),
  description: z.string().optional()
});

export type EnvironmentVariable = z.infer<typeof EnvironmentVariableSchema>;

/**
 * Deployment configuration schema
 */
export const DeploymentConfigSchema = z.object({
  environment: z.nativeEnum(DeploymentEnvironment),
  provider: z.nativeEnum(DeploymentProvider),
  projectName: z.string(),
  teamId: z.string().optional(),
  framework: z.enum(['nextjs', 'react', 'vue', 'angular', 'svelte']).default('nextjs'),
  rootDirectory: z.string().default('./'),
  buildCommand: z.string().default('npm run build'),
  outputDirectory: z.string().default('.next'),
  installCommand: z.string().default('npm install'),
  devCommand: z.string().default('npm run dev'),
  nodeVersion: z.string().default('18.x'),
  environmentVariables: z.array(EnvironmentVariableSchema).default([]),
  domains: z.array(z.string()).default([]),
  regions: z.array(z.string()).default(['iad1']),
  serverlessFunctions: z.boolean().default(true),
  automaticDeployments: z.boolean().default(true),
  pullRequestPreviewsEnabled: z.boolean().default(true),
  cacheControl: z.record(z.string(), z.string()).default({}),
  redirects: z.array(z.object({
    source: z.string(),
    destination: z.string(),
    permanent: z.boolean().default(false)
  })).default([]),
  headers: z.array(z.object({
    source: z.string(),
    headers: z.array(z.object({
      key: z.string(),
      value: z.string()
    }))
  })).default([]),
  ignoreCommand: z.string().optional(),
  gitRepository: z.object({
    type: z.enum(['github', 'gitlab', 'bitbucket']).default('github'),
    repo: z.string(),
    branch: z.string().default('main')
  })
});

export type DeploymentConfig = z.infer<typeof DeploymentConfigSchema>;

/**
 * CI/CD pipeline configuration schema
 */
export const CICDPipelineConfigSchema = z.object({
  provider: z.enum(['github-actions', 'gitlab-ci', 'jenkins', 'circle-ci', 'travis-ci']).default('github-actions'),
  buildSteps: z.array(z.object({
    name: z.string(),
    command: z.string(),
    condition: z.string().optional()
  })),
  testSteps: z.array(z.object({
    name: z.string(),
    command: z.string(),
    condition: z.string().optional()
  })),
  deploySteps: z.array(z.object({
    name: z.string(),
    command: z.string(),
    environment: z.nativeEnum(DeploymentEnvironment),
    condition: z.string().optional()
  })),
  notifications: z.array(z.object({
    type: z.enum(['email', 'slack', 'discord', 'webhook']),
    target: z.string(),
    events: z.array(z.enum(['success', 'failure', 'started'])),
    condition: z.string().optional()
  })).default([]),
  schedules: z.array(z.object({
    cron: z.string(),
    branches: z.array(z.string()),
    steps: z.array(z.string())
  })).default([]),
  caching: z.object({
    enabled: z.boolean().default(true),
    paths: z.array(z.string()).default(['node_modules']),
    key: z.string().optional()
  }).default({ enabled: true, paths: ['node_modules'] }),
  timeout: z.number().int().positive().default(60),
  concurrency: z.number().int().positive().default(1)
});

export type CICDPipelineConfig = z.infer<typeof CICDPipelineConfigSchema>;

/**
 * Testing configuration schema
 */
export const TestingConfigSchema = z.object({
  unitTests: z.object({
    framework: z.enum(['jest', 'mocha', 'vitest']).default('jest'),
    directory: z.string().default('__tests__'),
    command: z.string().default('npm run test'),
    coverage: z.object({
      enabled: z.boolean().default(true),
      threshold: z.number().min(0).max(100).default(80),
      excludePaths: z.array(z.string()).default([])
    }).default({ enabled: true, threshold: 80, excludePaths: [] })
  }),
  integrationTests: z.object({
    framework: z.enum(['cypress', 'playwright', 'selenium']).default('playwright'),
    directory: z.string().default('e2e'),
    command: z.string().default('npm run test:e2e'),
    browsers: z.array(z.enum(['chromium', 'firefox', 'webkit'])).default(['chromium']),
    baseUrl: z.string().default('http://localhost:3000')
  }),
  accessibilityTests: z.object({
    enabled: z.boolean().default(true),
    standard: z.enum(['wcag2a', 'wcag2aa', 'wcag2aaa']).default('wcag2aa'),
    tool: z.enum(['axe', 'pa11y', 'lighthouse']).default('axe'),
    command: z.string().default('npm run test:a11y')
  }),
  performanceTests: z.object({
    enabled: z.boolean().default(true),
    tool: z.enum(['lighthouse', 'webpagetest', 'custom']).default('lighthouse'),
    command: z.string().default('npm run test:performance'),
    thresholds: z.object({
      performance: z.number().min(0).max(100).default(90),
      accessibility: z.number().min(0).max(100).default(90),
      bestPractices: z.number().min(0).max(100).default(90),
      seo: z.number().min(0).max(100).default(90)
    }).default({ performance: 90, accessibility: 90, bestPractices: 90, seo: 90 })
  }),
  visualRegressionTests: z.object({
    enabled: z.boolean().default(false),
    tool: z.enum(['percy', 'chromatic', 'loki', 'custom']).default('percy'),
    command: z.string().default('npm run test:visual')
  }).default({ enabled: false, tool: 'percy', command: 'npm run test:visual' }),
  mockServices: z.array(z.object({
    name: z.string(),
    port: z.number().int().positive(),
    command: z.string()
  })).default([])
});

export type TestingConfig = z.infer<typeof TestingConfigSchema>;

/**
 * Database deployment configuration schema
 */
export const DatabaseDeploymentConfigSchema = z.object({
  type: z.enum(['postgres', 'mysql', 'mongodb', 'sqlite', 'none']).default('none'),
  provider: z.enum(['vercel', 'aws', 'azure', 'gcp', 'custom']).default('vercel'),
  connectionString: z.string().optional(),
  migrations: z.object({
    directory: z.string().default('migrations'),
    command: z.string().default('npm run migrate'),
    automaticOnDeploy: z.boolean().default(false)
  }).default({ directory: 'migrations', command: 'npm run migrate', automaticOnDeploy: false }),
  seeding: z.object({
    directory: z.string().default('seeds'),
    command: z.string().default('npm run seed'),
    environments: z.array(z.nativeEnum(DeploymentEnvironment)).default([DeploymentEnvironment.DEVELOPMENT, DeploymentEnvironment.STAGING])
  }).default({ directory: 'seeds', command: 'npm run seed', environments: [DeploymentEnvironment.DEVELOPMENT, DeploymentEnvironment.STAGING] }),
  backup: z.object({
    enabled: z.boolean().default(true),
    schedule: z.string().default('0 0 * * *'),
    retentionPeriod: z.number().int().positive().default(30)
  }).default({ enabled: true, schedule: '0 0 * * *', retentionPeriod: 30 })
});

export type DatabaseDeploymentConfig = z.infer<typeof DatabaseDeploymentConfigSchema>;

/**
 * DNS configuration schema
 */
export const DNSConfigSchema = z.object({
  domain: z.string(),
  provider: z.enum(['vercel', 'cloudflare', 'route53', 'custom']).default('vercel'),
  records: z.array(z.object({
    type: z.enum(['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'CAA']),
    name: z.string(),
    value: z.string(),
    ttl: z.number().int().positive().default(3600),
    priority: z.number().int().nonnegative().optional()
  })),
  nameservers: z.array(z.string()).optional(),
  customDomainVerification: z.object({
    type: z.enum(['txt', 'file']).default('txt'),
    value: z.string().optional()
  }).default({ type: 'txt' })
});

export type DNSConfig = z.infer<typeof DNSConfigSchema>;

/**
 * Monitoring configuration schema
 */
export const MonitoringConfigSchema = z.object({
  enabled: z.boolean().default(true),
  provider: z.enum(['vercel', 'datadog', 'newrelic', 'sentry', 'custom']).default('vercel'),
  errorTracking: z.object({
    enabled: z.boolean().default(true),
    dsn: z.string().optional(),
    environment: z.nativeEnum(DeploymentEnvironment)
  }),
  performanceMonitoring: z.object({
    enabled: z.boolean().default(true),
    sampleRate: z.number().min(0).max(1).default(0.1)
  }).default({ enabled: true, sampleRate: 0.1 }),
  logManagement: z.object({
    enabled: z.boolean().default(true),
    level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    retention: z.number().int().positive().default(30)
  }).default({ enabled: true, level: 'info', retention: 30 }),
  alerting: z.object({
    enabled: z.boolean().default(true),
    channels: z.array(z.object({
      type: z.enum(['email', 'slack', 'webhook']),
      target: z.string()
    })).default([]),
    rules: z.array(z.object({
      name: z.string(),
      condition: z.string(),
      channels: z.array(z.string()).optional()
    })).default([])
  }).default({ enabled: true, channels: [], rules: [] }),
  uptime: z.object({
    enabled: z.boolean().default(true),
    checkInterval: z.number().int().positive().default(60),
    endpoints: z.array(z.string()).default(['/api/health'])
  }).default({ enabled: true, checkInterval: 60, endpoints: ['/api/health'] })
});

export type MonitoringConfig = z.infer<typeof MonitoringConfigSchema>;

/**
 * Security configuration schema
 */
export const SecurityConfigSchema = z.object({
  headers: z.object({
    contentSecurityPolicy: z.string().optional(),
    xFrameOptions: z.enum(['DENY', 'SAMEORIGIN']).default('DENY'),
    xContentTypeOptions: z.enum(['nosniff']).default('nosniff'),
    referrerPolicy: z.enum(['no-referrer', 'no-referrer-when-downgrade', 'origin', 'origin-when-cross-origin', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin', 'unsafe-url']).default('strict-origin-when-cross-origin'),
    permissionsPolicy: z.string().optional(),
    strictTransportSecurity: z.object({
      maxAge: z.number().int().positive().default(63072000),
      includeSubDomains: z.boolean().default(true),
      preload: z.boolean().default(true)
    }).default({ maxAge: 63072000, includeSubDomains: true, preload: true })
  }),
  cors: z.object({
    enabled: z.boolean().default(true),
    origins: z.array(z.string()).default(['*']),
    methods: z.array(z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])).default(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']),
    allowedHeaders: z.array(z.string()).default(['Content-Type', 'Authorization']),
    exposedHeaders: z.array(z.string()).default([]),
    credentials: z.boolean().default(true),
    maxAge: z.number().int().nonnegative().default(86400)
  }),
  rateLimit: z.object({
    enabled: z.boolean().default(true),
    maxRequests: z.number().int().positive().default(100),
    windowMs: z.number().int().positive().default(60000),
    message: z.string().default('Too many requests, please try again later.'),
    skipSuccessfulRequests: z.boolean().default(false),
    skipFailedRequests: z.boolean().default(false)
  }).default({ enabled: true, maxRequests: 100, windowMs: 60000, message: 'Too many requests, please try again later.', skipSuccessfulRequests: false, skipFailedRequests: false }),
  authentication: z.object({
    providers: z.array(z.enum(['credentials', 'google', 'github', 'facebook', 'twitter', 'apple', 'custom'])).default(['credentials']),
    sessionDuration: z.number().int().positive().default(86400),
    jwtSecret: z.string().optional(),
    cookieSecure: z.boolean().default(true),
    cookieSameSite: z.enum(['strict', 'lax', 'none']).default('lax')
  })
});

export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;

/**
 * Deployment service interface
 */
export interface DeploymentService {
  createDeploymentConfig: (config: Omit<DeploymentConfig, 'environmentVariables'>) => Promise<string>;
  
  getDeploymentConfig: (environment: DeploymentEnvironment) => Promise<DeploymentConfig | null>;
  
  updateDeploymentConfig: (environment: DeploymentEnvironment, updates: Partial<DeploymentConfig>) => Promise<boolean>;
  
  addEnvironmentVariable: (environment: DeploymentEnvironment, variable: EnvironmentVariable) => Promise<boolean>;
  
  removeEnvironmentVariable: (environment: DeploymentEnvironment, key: string) => Promise<boolean>;
  
  createCICDPipelineConfig: (config: CICDPipelineConfig) => Promise<string>;
  
  getCICDPipelineConfig: () => Promise<CICDPipelineConfig | null>;
  
  updateCICDPipelineConfig: (updates: Partial<CICDPipelineConfig>) => Promise<boolean>;
  
  createDNSConfig: (config: DNSConfig) => Promise<string>;
  
  getDNSConfig: (domain: string) => Promise<DNSConfig | null>;
  
  updateDNSConfig: (domain: string, updates: Partial<DNSConfig>) => Promise<boolean>;
  
  addDNSRecord: (domain: string, record: {
    type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV' | 'CAA';
    name: string;
    value: string;
    ttl?: number;
    priority?: number;
  }) => Promise<boolean>;
  
  removeDNSRecord: (domain: string, recordId: string) => Promise<boolean>;
  
  createTestingConfig: (config: TestingConfig) => Promise<string>;
  
  getTestingConfig: () => Promise<TestingConfig | null>;
  
  updateTestingConfig: (updates: Partial<TestingConfig>) => Promise<boolean>;
  
  createDatabaseDeploymentConfig: (config: DatabaseDeploymentConfig) => Promise<string>;
  
  getDatabaseDeploymentConfig: () => Promise<DatabaseDeploymentConfig | null>;
  
  updateDatabaseDeploymentConfig: (updates: Partial<DatabaseDeploymentConfig>) => Promise<boolean>;
  
  createMonitoringConfig: (config: MonitoringConfig) => Promise<string>;
  
  getMonitoringConfig: () => Promise<MonitoringConfig | null>;
  
  updateMonitoringConfig: (updates: Partial<MonitoringConfig>) => Promise<boolean>;
  
  createSecurityConfig: (config: SecurityConfig) => Promise<string>;
  
  getSecurityConfig: () => Promise<SecurityConfig | null>;
  
  updateSecurityConfig: (updates: Partial<SecurityConfig>) => Promise<boolean>;
  
  deployToEnvironment: (environment: DeploymentEnvironment) => Promise<{
    success: boolean;
    deploymentUrl: string;
    logs: string;
    error?: string;
  }>;
  
  getDeploymentStatus: (deploymentId: string) => Promise<{
    status: 'queued' | 'building' | 'ready' | 'error';
    url: string;
    createdAt: Date;
    readyAt?: Date;
    error?: string;
  }>;
  
  rollbackDeployment: (deploymentId: string) => Promise<boolean>;
  
  generateDeploymentDocumentation: () => Promise<{
    setupInstructions: string;
    environmentVariables: string;
    cicdConfiguration: string;
    dnsConfiguration: string;
    securityConfiguration: string;
    monitoringConfiguration: string;
  }>;
}
