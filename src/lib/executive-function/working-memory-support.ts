/**
 * Working Memory Support Service
 * 
 * This service provides advanced cognitive support tools and exercises
 * to assist users with working memory challenges, enhancing executive
 * function support within the platform.
 */

import { UserPreferences } from '@/lib/types';

// Working memory exercise types
export enum WorkingMemoryExerciseType {
  SEQUENTIAL_MEMORY = 'sequential_memory',
  DUAL_N_BACK = 'dual_n_back',
  VISUAL_SPATIAL = 'visual_spatial',
  AUDITORY_VERBAL = 'auditory_verbal',
  PATTERN_RECOGNITION = 'pattern_recognition',
  CATEGORIZATION = 'categorization',
  MENTAL_MATH = 'mental_math',
  INSTRUCTION_FOLLOWING = 'instruction_following'
}

// Working memory support level
export enum WorkingMemorySupportLevel {
  MINIMAL = 'minimal',
  MODERATE = 'moderate',
  SUBSTANTIAL = 'substantial',
  COMPREHENSIVE = 'comprehensive'
}

// Working memory challenge areas
export enum WorkingMemoryChallengeArea {
  VISUAL_SPATIAL_SKETCHPAD = 'visual_spatial_sketchpad',
  PHONOLOGICAL_LOOP = 'phonological_loop',
  CENTRAL_EXECUTIVE = 'central_executive',
  EPISODIC_BUFFER = 'episodic_buffer'
}

// Working memory exercise configuration
export interface WorkingMemoryExerciseConfig {
  type: WorkingMemoryExerciseType;
  difficulty: number; // 1-10 scale
  duration: number; // in seconds
  adaptiveDifficulty: boolean;
  challengeAreas: WorkingMemoryChallengeArea[];
  visualSupport: boolean;
  auditorySupport: boolean;
  instructions: string;
  feedbackLevel: 'minimal' | 'moderate' | 'detailed';
}

// Working memory exercise result
export interface WorkingMemoryExerciseResult {
  exerciseId: string;
  type: WorkingMemoryExerciseType;
  startTime: Date;
  endTime: Date;
  difficulty: number;
  score: number; // 0-100 scale
  accuracy: number; // 0-1 scale
  responseTime: number; // average in milliseconds
  completionRate: number; // 0-1 scale
  attentionLapses: number;
  progressionLevel: number;
}

// Working memory profile
export interface WorkingMemoryProfile {
  overallCapacity: number; // 1-10 scale
  visualSpatialCapacity: number; // 1-10 scale
  phonologicalCapacity: number; // 1-10 scale
  centralExecutiveStrength: number; // 1-10 scale
  episodicBufferCapacity: number; // 1-10 scale
  challengeAreas: WorkingMemoryChallengeArea[];
  recommendedExercises: WorkingMemoryExerciseType[];
  recommendedSupportLevel: WorkingMemorySupportLevel;
  exerciseHistory: WorkingMemoryExerciseResult[];
  progressTrend: 'improving' | 'stable' | 'declining' | 'variable' | 'initial';
}

// Working memory support tools
export interface WorkingMemorySupportTool {
  id: string;
  name: string;
  description: string;
  targetChallengeAreas: WorkingMemoryChallengeArea[];
  supportLevel: WorkingMemorySupportLevel;
  contextualTrigger: 'always' | 'on_demand' | 'automatic_detection';
  visualComponent: boolean;
  auditoryComponent: boolean;
  interactiveComponent: boolean;
}

// Working memory support configuration
export interface WorkingMemorySupportConfig {
  enabledTools: string[]; // IDs of enabled support tools
  defaultSupportLevel: WorkingMemorySupportLevel;
  automaticDetection: boolean;
  adaptiveSupport: boolean;
  notificationFrequency: 'low' | 'medium' | 'high';
  visualCues: boolean;
  auditoryCues: boolean;
  reminderSystem: boolean;
  parentNotifications: boolean;
  educatorNotifications: boolean;
  dataCollection: boolean;
}

/**
 * Working Memory Support Service
 */
export class WorkingMemorySupport {
  private static instance: WorkingMemorySupport;
  private userProfiles: Map<string, WorkingMemoryProfile> = new Map();
  private supportTools: Map<string, WorkingMemorySupportTool> = new Map();
  private exerciseConfigurations: Map<string, WorkingMemoryExerciseConfig> = new Map();
  private activeExercises: Map<string, { userId: string; config: WorkingMemoryExerciseConfig; startTime: Date }> = new Map();
  private userConfigurations: Map<string, WorkingMemorySupportConfig> = new Map();

  private constructor() {
    this.initializeSupportTools();
    this.initializeExerciseConfigurations();
  }

  /**
   * Get the singleton instance of the Working Memory Support service
   */
  public static getInstance(): WorkingMemorySupport {
    if (!WorkingMemorySupport.instance) {
      WorkingMemorySupport.instance = new WorkingMemorySupport();
    }
    return WorkingMemorySupport.instance;
  }

  /**
   * Initialize support tools
   */
  private initializeSupportTools(): void {
    // Visual organizers
    this.supportTools.set('visual_checklist', {
      id: 'visual_checklist',
      name: 'Visual Checklist',
      description: 'Interactive visual checklist to track multi-step tasks',
      targetChallengeAreas: [WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE, WorkingMemoryChallengeArea.VISUAL_SPATIAL_SKETCHPAD],
      supportLevel: WorkingMemorySupportLevel.MODERATE,
      contextualTrigger: 'always',
      visualComponent: true,
      auditoryComponent: false,
      interactiveComponent: true
    });

    this.supportTools.set('mind_mapping', {
      id: 'mind_mapping',
      name: 'Mind Mapping Tool',
      description: 'Visual mind mapping to organize thoughts and information',
      targetChallengeAreas: [WorkingMemoryChallengeArea.VISUAL_SPATIAL_SKETCHPAD, WorkingMemoryChallengeArea.EPISODIC_BUFFER],
      supportLevel: WorkingMemorySupportLevel.MODERATE,
      contextualTrigger: 'on_demand',
      visualComponent: true,
      auditoryComponent: false,
      interactiveComponent: true
    });

    // Auditory supports
    this.supportTools.set('verbal_rehearsal', {
      id: 'verbal_rehearsal',
      name: 'Verbal Rehearsal Assistant',
      description: 'Audio prompts to support verbal rehearsal of information',
      targetChallengeAreas: [WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP],
      supportLevel: WorkingMemorySupportLevel.SUBSTANTIAL,
      contextualTrigger: 'on_demand',
      visualComponent: false,
      auditoryComponent: true,
      interactiveComponent: true
    });

    this.supportTools.set('audio_note_taker', {
      id: 'audio_note_taker',
      name: 'Audio Note Taker',
      description: 'Records and organizes audio notes with transcription',
      targetChallengeAreas: [WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP, WorkingMemoryChallengeArea.EPISODIC_BUFFER],
      supportLevel: WorkingMemorySupportLevel.SUBSTANTIAL,
      contextualTrigger: 'on_demand',
      visualComponent: true,
      auditoryComponent: true,
      interactiveComponent: true
    });

    // Executive function supports
    this.supportTools.set('task_breakdown', {
      id: 'task_breakdown',
      name: 'Task Breakdown Assistant',
      description: 'Automatically breaks complex tasks into manageable steps',
      targetChallengeAreas: [WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE],
      supportLevel: WorkingMemorySupportLevel.COMPREHENSIVE,
      contextualTrigger: 'automatic_detection',
      visualComponent: true,
      auditoryComponent: false,
      interactiveComponent: true
    });

    this.supportTools.set('attention_refocuser', {
      id: 'attention_refocuser',
      name: 'Attention Refocuser',
      description: 'Gentle prompts to refocus attention when distraction is detected',
      targetChallengeAreas: [WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE],
      supportLevel: WorkingMemorySupportLevel.MODERATE,
      contextualTrigger: 'automatic_detection',
      visualComponent: true,
      auditoryComponent: true,
      interactiveComponent: false
    });

    // Memory aids
    this.supportTools.set('visual_memory_bank', {
      id: 'visual_memory_bank',
      name: 'Visual Memory Bank',
      description: 'Stores and organizes visual information for easy reference',
      targetChallengeAreas: [WorkingMemoryChallengeArea.VISUAL_SPATIAL_SKETCHPAD, WorkingMemoryChallengeArea.EPISODIC_BUFFER],
      supportLevel: WorkingMemorySupportLevel.SUBSTANTIAL,
      contextualTrigger: 'always',
      visualComponent: true,
      auditoryComponent: false,
      interactiveComponent: true
    });

    this.supportTools.set('concept_connector', {
      id: 'concept_connector',
      name: 'Concept Connector',
      description: 'Visualizes connections between concepts to reduce cognitive load',
      targetChallengeAreas: [WorkingMemoryChallengeArea.EPISODIC_BUFFER, WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE],
      supportLevel: WorkingMemorySupportLevel.COMPREHENSIVE,
      contextualTrigger: 'on_demand',
      visualComponent: true,
      auditoryComponent: false,
      interactiveComponent: true
    });

    // Advanced supports
    this.supportTools.set('cognitive_load_monitor', {
      id: 'cognitive_load_monitor',
      name: 'Cognitive Load Monitor',
      description: 'Monitors cognitive load and adjusts content presentation accordingly',
      targetChallengeAreas: [
        WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE,
        WorkingMemoryChallengeArea.VISUAL_SPATIAL_SKETCHPAD,
        WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP
      ],
      supportLevel: WorkingMemorySupportLevel.COMPREHENSIVE,
      contextualTrigger: 'automatic_detection',
      visualComponent: true,
      auditoryComponent: true,
      interactiveComponent: false
    });

    this.supportTools.set('multimodal_memory_assistant', {
      id: 'multimodal_memory_assistant',
      name: 'Multimodal Memory Assistant',
      description: 'Provides information through multiple sensory channels to enhance retention',
      targetChallengeAreas: [
        WorkingMemoryChallengeArea.VISUAL_SPATIAL_SKETCHPAD,
        WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP,
        WorkingMemoryChallengeArea.EPISODIC_BUFFER
      ],
      supportLevel: WorkingMemorySupportLevel.COMPREHENSIVE,
      contextualTrigger: 'on_demand',
      visualComponent: true,
      auditoryComponent: true,
      interactiveComponent: true
    });
  }

  /**
   * Initialize exercise configurations
   */
  private initializeExerciseConfigurations(): void {
    // Sequential memory exercises
    this.exerciseConfigurations.set('digit_span', {
      type: WorkingMemoryExerciseType.SEQUENTIAL_MEMORY,
      difficulty: 3,
      duration: 120,
      adaptiveDifficulty: true,
      challengeAreas: [WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP],
      visualSupport: true,
      auditorySupport: true,
      instructions: 'Remember and repeat the sequence of numbers in the same order.',
      feedbackLevel: 'moderate'
    });

    this.exerciseConfigurations.set('reverse_digit_span', {
      type: WorkingMemoryExerciseType.SEQUENTIAL_MEMORY,
      difficulty: 4,
      duration: 120,
      adaptiveDifficulty: true,
      challengeAreas: [WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP, WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE],
      visualSupport: true,
      auditorySupport: true,
      instructions: 'Remember the sequence of numbers and repeat them in reverse order.',
      feedbackLevel: 'moderate'
    });

    // Dual n-back exercises
    this.exerciseConfigurations.set('dual_2_back', {
      type: WorkingMemoryExerciseType.DUAL_N_BACK,
      difficulty: 6,
      duration: 180,
      adaptiveDifficulty: true,
      challengeAreas: [
        WorkingMemoryChallengeArea.VISUAL_SPATIAL_SKETCHPAD,
        WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP,
        WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE
      ],
      visualSupport: true,
      auditorySupport: true,
      instructions: 'Press the visual button when the position matches the position 2 steps back, and the audio button when the sound matches the sound 2 steps back.',
      feedbackLevel: 'detailed'
    });

    // Visual-spatial exercises
    this.exerciseConfigurations.set('pattern_memory', {
      type: WorkingMemoryExerciseType.VISUAL_SPATIAL,
      difficulty: 3,
      duration: 150,
      adaptiveDifficulty: true,
      challengeAreas: [WorkingMemoryChallengeArea.VISUAL_SPATIAL_SKETCHPAD],
      visualSupport: true,
      auditorySupport: false,
      instructions: 'Remember the pattern of highlighted squares and reproduce it after it disappears.',
      feedbackLevel: 'moderate'
    });

    this.exerciseConfigurations.set('spatial_location', {
      type: WorkingMemoryExerciseType.VISUAL_SPATIAL,
      difficulty: 4,
      duration: 150,
      adaptiveDifficulty: true,
      challengeAreas: [WorkingMemoryChallengeArea.VISUAL_SPATIAL_SKETCHPAD, WorkingMemoryChallengeArea.EPISODIC_BUFFER],
      visualSupport: true,
      auditorySupport: false,
      instructions: 'Remember the locations of the objects and identify which one has moved.',
      feedbackLevel: 'moderate'
    });

    // Auditory-verbal exercises
    this.exerciseConfigurations.set('word_list_recall', {
      type: WorkingMemoryExerciseType.AUDITORY_VERBAL,
      difficulty: 3,
      duration: 120,
      adaptiveDifficulty: true,
      challengeAreas: [WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP],
      visualSupport: false,
      auditorySupport: true,
      instructions: 'Listen to the list of words and recall as many as you can in any order.',
      feedbackLevel: 'moderate'
    });

    this.exerciseConfigurations.set('sentence_completion', {
      type: WorkingMemoryExerciseType.AUDITORY_VERBAL,
      difficulty: 5,
      duration: 180,
      adaptiveDifficulty: true,
      challengeAreas: [WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP, WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE],
      visualSupport: true,
      auditorySupport: true,
      instructions: 'Listen to the sentences and remember the last word of each. Then complete each sentence when prompted.',
      feedbackLevel: 'detailed'
    });

    // Pattern recognition exercises
    this.exerciseConfigurations.set('sequence_prediction', {
      type: WorkingMemoryExerciseType.PATTERN_RECOGNITION,
      difficulty: 4,
      duration: 150,
      adaptiveDifficulty: true,
      challengeAreas: [WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE],
      visualSupport: true,
      auditorySupport: false,
      instructions: 'Identify the pattern in the sequence and predict the next items.',
      feedbackLevel: 'detailed'
    });

    // Categorization exercises
    this.exerciseConfigurations.set('sorting_task', {
      type: WorkingMemoryExerciseType.CATEGORIZATION,
      difficulty: 3,
      duration: 180,
      adaptiveDifficulty: true,
      challengeAreas: [WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE, WorkingMemoryChallengeArea.EPISODIC_BUFFER],
      visualSupport: true,
      auditorySupport: false,
      instructions: 'Sort the items into the correct categories according to the rules.',
      feedbackLevel: 'moderate'
    });

    // Mental math exercises
    this.exerciseConfigurations.set('mental_arithmetic', {
      type: WorkingMemoryExerciseType.MENTAL_MATH,
      difficulty: 4,
      duration: 120,
      adaptiveDifficulty: true,
      challengeAreas: [WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE, WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP],
      visualSupport: true,
      auditorySupport: true,
      instructions: 'Solve the arithmetic problems in your head without writing anything down.',
      feedbackLevel: 'moderate'
    });

    // Instruction following exercises
    this.exerciseConfigurations.set('multi_step_instructions', {
      type: WorkingMemoryExerciseType.INSTRUCTION_FOLLOWING,
      difficulty: 5,
      duration: 180,
      adaptiveDifficulty: true,
      challengeAreas: [
        WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP,
        WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE,
        WorkingMemoryChallengeArea.EPISODIC_BUFFER
      ],
      visualSupport: true,
      auditorySupport: true,
      instructions: 'Listen to or read the multi-step instructions, then perform the actions in the correct order.',
      feedbackLevel: 'detailed'
    });
  }

  /**
   * Get user's working memory profile
   * 
   * @param userId User identifier
   */
  public getUserProfile(userId: string): WorkingMemoryProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  /**
   * Create or update user's working memory profile
   * 
   * @param userId User identifier
   * @param profile Working memory profile data
   */
  public updateUserProfile(userId: string, profile: Partial<WorkingMemoryProfile>): WorkingMemoryProfile {
    const existingProfile = this.userProfiles.get(userId);
    
    const updatedProfile: WorkingMemoryProfile = {
      overallCapacity: profile.overallCapacity ?? existingProfile?.overallCapacity ?? 5,
      visualSpatialCapacity: profile.visualSpatialCapacity ?? existingProfile?.visualSpatialCapacity ?? 5,
      phonologicalCapacity: profile.phonologicalCapacity ?? existingProfile?.phonologicalCapacity ?? 5,
      centralExecutiveStrength: profile.centralExecutiveStrength ?? existingProfile?.centralExecutiveStrength ?? 5,
      episodicBufferCapacity: profile.episodicBufferCapacity ?? existingProfile?.episodicBufferCapacity ?? 5,
      challengeAreas: profile.challengeAreas ?? existingProfile?.challengeAreas ?? [],
      recommendedExercises: profile.recommendedExercises ?? existingProfile?.recommendedExercises ?? [],
      recommendedSupportLevel: profile.recommendedSupportLevel ?? existingProfile?.recommendedSupportLevel ?? WorkingMemorySupportLevel.MODERATE,
      exerciseHistory: profile.exerciseHistory ?? existingProfile?.exerciseHistory ?? [],
      progressTrend: profile.progressTrend ?? existingProfile?.progressTrend ?? 'initial'
    };
    
    this.userProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  /**
   * Get user's working memory support configuration
   * 
   * @param userId User identifier
   */
  public getUserConfiguration(userId: string): WorkingMemorySupportConfig {
    const defaultConfig: WorkingMemorySupportConfig = {
      enabledTools: Array.from(this.supportTools.keys()),
      defaultSupportLevel: WorkingMemorySupportLevel.MODERATE,
      automaticDetection: true,
      adaptiveSupport: true,
      notificationFrequency: 'medium',
      visualCues: true,
      auditoryCues: true,
      reminderSystem: true,
      parentNotifications: false,
      educatorNotifications: true,
      dataCollection: true
    };
    
    return this.userConfigurations.get(userId) || defaultConfig;
  }

  /**
   * Update user's working memory support configuration
   * 
   * @param userId User identifier
   * @param config Working memory support configuration
   */
  public updateUserConfiguration(userId: string, config: Partial<WorkingMemorySupportConfig>): WorkingMemorySupportConfig {
    const existingConfig = this.getUserConfiguration(userId);
    
    const updatedConfig: WorkingMemorySupportConfig = {
      enabledTools: config.enabledTools ?? existingConfig.enabledTools,
      defaultSupportLevel: config.defaultSupportLevel ?? existingConfig.defaultSupportLevel,
      automaticDetection: config.automaticDetection ?? existingConfig.automaticDetection,
      adaptiveSupport: config.adaptiveSupport ?? existingConfig.adaptiveSupport,
      notificationFrequency: config.notificationFrequency ?? existingConfig.notificationFrequency,
      visualCues: config.visualCues ?? existingConfig.visualCues,
      auditoryCues: config.auditoryCues ?? existingConfig.auditoryCues,
      reminderSystem: config.reminderSystem ?? existingConfig.reminderSystem,
      parentNotifications: config.parentNotifications ?? existingConfig.parentNotifications,
      educatorNotifications: config.educatorNotifications ?? existingConfig.educatorNotifications,
      dataCollection: config.dataCollection ?? existingConfig.dataCollection
    };
    
    this.userConfigurations.set(userId, updatedConfig);
    return updatedConfig;
  }

  /**
   * Get available working memory support tools
   * 
   * @param supportLevel Optional filter by support level
   * @param challengeArea Optional filter by challenge area
   */
  public getAvailableSupportTools(
    supportLevel?: WorkingMemorySupportLevel,
    challengeArea?: WorkingMemoryChallengeArea
  ): WorkingMemorySupportTool[] {
    let tools = Array.from(this.supportTools.values());
    
    // Filter by support level if specified
    if (supportLevel) {
      tools = tools.filter(tool => tool.supportLevel === supportLevel);
    }
    
    // Filter by challenge area if specified
    if (challengeArea) {
      tools = tools.filter(tool => tool.targetChallengeAreas.includes(challengeArea));
    }
    
    return tools;
  }

  /**
   * Get available working memory exercises
   * 
   * @param type Optional filter by exercise type
   * @param challengeArea Optional filter by challenge area
   */
  public getAvailableExercises(
    type?: WorkingMemoryExerciseType,
    challengeArea?: WorkingMemoryChallengeArea
  ): WorkingMemoryExerciseConfig[] {
    let exercises = Array.from(this.exerciseConfigurations.values());
    
    // Filter by exercise type if specified
    if (type) {
      exercises = exercises.filter(exercise => exercise.type === type);
    }
    
    // Filter by challenge area if specified
    if (challengeArea) {
      exercises = exercises.filter(exercise => exercise.challengeAreas.includes(challengeArea));
    }
    
    return exercises;
  }

  /**
   * Start a working memory exercise
   * 
   * @param userId User identifier
   * @param exerciseId Exercise identifier
   */
  public startExercise(userId: string, exerciseId: string): string {
    const config = this.exerciseConfigurations.get(exerciseId);
    
    if (!config) {
      throw new Error(`Exercise ${exerciseId} not found`);
    }
    
    // Generate a unique session ID
    const sessionId = `${userId}_${exerciseId}_${Date.now()}`;
    
    // Record the active exercise
    this.activeExercises.set(sessionId, {
      userId,
      config,
      startTime: new Date()
    });
    
    return sessionId;
  }

  /**
   * Complete a working memory exercise
   * 
   * @param sessionId Exercise session identifier
   * @param result Exercise result data
   */
  public completeExercise(sessionId: string, result: Partial<WorkingMemoryExerciseResult>): WorkingMemoryExerciseResult {
    const activeExercise = this.activeExercises.get(sessionId);
    
    if (!activeExercise) {
      throw new Error(`No active exercise found for session ${sessionId}`);
    }
    
    const { userId, config, startTime } = activeExercise;
    
    // Create complete result
    const completeResult: WorkingMemoryExerciseResult = {
      exerciseId: sessionId.split('_')[1],
      type: config.type,
      startTime,
      endTime: new Date(),
      difficulty: config.difficulty,
      score: result.score ?? 0,
      accuracy: result.accuracy ?? 0,
      responseTime: result.responseTime ?? 0,
      completionRate: result.completionRate ?? 0,
      attentionLapses: result.attentionLapses ?? 0,
      progressionLevel: result.progressionLevel ?? 1
    };
    
    // Update user profile with exercise result
    const profile = this.getUserProfile(userId) || this.createDefaultProfile(userId);
    profile.exerciseHistory.push(completeResult);
    
    // Update progress trend
    if (profile.exerciseHistory.length >= 3) {
      const recentExercises = profile.exerciseHistory.slice(-3);
      const recentScores = recentExercises.map(e => e.score);
      const avgScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
      const prevAvgScore = profile.exerciseHistory.slice(-6, -3).map(e => e.score).reduce((a, b) => a + b, 0) / 3;
      
      if (avgScore > prevAvgScore + 5) {
        profile.progressTrend = 'improving';
      } else if (avgScore < prevAvgScore - 5) {
        profile.progressTrend = 'declining';
      } else {
        profile.progressTrend = 'stable';
      }
    }
    
    // Update profile capacities based on exercise results
    this.updateProfileCapacities(profile, completeResult);
    
    // Update user profile
    this.userProfiles.set(userId, profile);
    
    // Remove from active exercises
    this.activeExercises.delete(sessionId);
    
    return completeResult;
  }

  /**
   * Get recommended support tools for a user
   * 
   * @param userId User identifier
   * @param context Current context (e.g., 'reading', 'math', 'writing')
   */
  public getRecommendedSupportTools(userId: string, context?: string): WorkingMemorySupportTool[] {
    const profile = this.getUserProfile(userId);
    const config = this.getUserConfiguration(userId);
    
    if (!profile) {
      // Return default tools if no profile exists
      return this.getDefaultSupportTools();
    }
    
    // Filter tools by enabled status
    const enabledTools = Array.from(this.supportTools.values())
      .filter(tool => config.enabledTools.includes(tool.id));
    
    // Filter by challenge areas in user profile
    const recommendedTools = enabledTools.filter(tool => 
      profile.challengeAreas.some(area => tool.targetChallengeAreas.includes(area))
    );
    
    // Sort by relevance to user's challenge areas
    recommendedTools.sort((a, b) => {
      const aRelevance = a.targetChallengeAreas.filter(area => 
        profile.challengeAreas.includes(area)
      ).length;
      
      const bRelevance = b.targetChallengeAreas.filter(area => 
        profile.challengeAreas.includes(area)
      ).length;
      
      return bRelevance - aRelevance;
    });
    
    // Limit to top 5 most relevant tools
    return recommendedTools.slice(0, 5);
  }

  /**
   * Get recommended exercises for a user
   * 
   * @param userId User identifier
   */
  public getRecommendedExercises(userId: string): WorkingMemoryExerciseConfig[] {
    const profile = this.getUserProfile(userId);
    
    if (!profile) {
      // Return default exercises if no profile exists
      return this.getDefaultExercises();
    }
    
    // Get all exercises
    const allExercises = Array.from(this.exerciseConfigurations.values());
    
    // Filter by challenge areas in user profile
    const recommendedExercises = allExercises.filter(exercise => 
      profile.challengeAreas.some(area => exercise.challengeAreas.includes(area))
    );
    
    // Sort by relevance to user's challenge areas
    recommendedExercises.sort((a, b) => {
      const aRelevance = a.challengeAreas.filter(area => 
        profile.challengeAreas.includes(area)
      ).length;
      
      const bRelevance = b.challengeAreas.filter(area => 
        profile.challengeAreas.includes(area)
      ).length;
      
      return bRelevance - aRelevance;
    });
    
    // Limit to top 5 most relevant exercises
    return recommendedExercises.slice(0, 5);
  }

  /**
   * Apply working memory support to content
   * 
   * @param content Content to enhance with working memory support
   * @param userId User identifier
   * @param context Current context (e.g., 'reading', 'math', 'writing')
   */
  public applyWorkingMemorySupport(
    content: string,
    userId: string,
    context?: string
  ): { enhancedContent: string; appliedSupports: string[] } {
    const profile = this.getUserProfile(userId);
    const config = this.getUserConfiguration(userId);
    
    // If no profile or support disabled, return original content
    if (!profile || !config.enabledTools.length) {
      return { enhancedContent: content, appliedSupports: [] };
    }
    
    let enhancedContent = content;
    const appliedSupports: string[] = [];
    
    // Apply visual organizers if enabled
    if (config.visualCues && config.enabledTools.includes('visual_checklist')) {
      // Identify task lists and enhance them
      const taskListRegex = /(\d+\.\s+[^\n]+\n)+/g;
      enhancedContent = enhancedContent.replace(taskListRegex, match => {
        appliedSupports.push('visual_checklist');
        return `<div class="working-memory-support visual-checklist">${match}</div>`;
      });
    }
    
    // Apply concept connectors if enabled
    if (config.visualCues && config.enabledTools.includes('concept_connector')) {
      // Identify key concepts and enhance them
      const keyConceptRegex = /(key concepts|important terms|vocabulary):(.*?)(\n\n|\n$)/gi;
      enhancedContent = enhancedContent.replace(keyConceptRegex, (match, p1, p2, p3) => {
        appliedSupports.push('concept_connector');
        return `<div class="working-memory-support concept-connector"><h4>${p1}</h4>${p2}${p3}</div>`;
      });
    }
    
    // Apply attention refocuser if enabled
    if (config.enabledTools.includes('attention_refocuser')) {
      // Add attention focus markers
      enhancedContent = `<div class="working-memory-support attention-refocuser" data-interval="60">${enhancedContent}</div>`;
      appliedSupports.push('attention_refocuser');
    }
    
    // Apply task breakdown if enabled
    if (config.enabledTools.includes('task_breakdown')) {
      // Identify complex instructions and break them down
      const complexInstructionRegex = /(instructions|directions|steps):(.*?)(\n\n|\n$)/gi;
      enhancedContent = enhancedContent.replace(complexInstructionRegex, (match, p1, p2, p3) => {
        appliedSupports.push('task_breakdown');
        
        // Break down complex instructions into steps
        const steps = p2.split(/\.\s+/).filter(step => step.trim().length > 0);
        let stepsHtml = '<ol>';
        steps.forEach(step => {
          stepsHtml += `<li>${step.trim()}</li>`;
        });
        stepsHtml += '</ol>';
        
        return `<div class="working-memory-support task-breakdown"><h4>${p1}</h4>${stepsHtml}${p3}</div>`;
      });
    }
    
    // Apply multimodal memory assistant if enabled
    if (config.enabledTools.includes('multimodal_memory_assistant')) {
      // Add multimodal support wrapper
      enhancedContent = `<div class="working-memory-support multimodal-memory-assistant" data-audio-support="${config.auditoryCues}" data-visual-support="${config.visualCues}">${enhancedContent}</div>`;
      appliedSupports.push('multimodal_memory_assistant');
    }
    
    return { enhancedContent, appliedSupports };
  }

  /**
   * Assess working memory load of content
   * 
   * @param content Content to assess
   */
  public assessWorkingMemoryLoad(content: string): {
    overallLoad: number;
    visualLoad: number;
    verbalLoad: number;
    executiveLoad: number;
    recommendations: string[];
  } {
    // This is a simplified implementation - in a real system, this would use
    // more sophisticated content analysis
    
    // Count words, sentences, and paragraphs
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
    
    // Calculate average sentence length
    const avgSentenceLength = words.length / sentences.length;
    
    // Count complex words (simplified: words with 3+ syllables)
    const complexWords = words.filter(word => this.countSyllables(word) >= 3);
    const complexWordRatio = complexWords.length / words.length;
    
    // Count numbers and formulas
    const numbers = content.match(/\d+/g) || [];
    const formulas = content.match(/[a-z0-9]+[+\-*/=^][a-z0-9]+/gi) || [];
    
    // Count visual elements (simplified detection)
    const tables = (content.match(/\|[-+|]+\|/g) || []).length;
    const lists = (content.match(/(\*|\-|\d+\.)\s+[^\n]+/g) || []).length;
    
    // Calculate loads
    const verbalLoad = Math.min(10, (
      (avgSentenceLength / 20) * 5 +
      (complexWordRatio) * 10 +
      (words.length > 500 ? 2 : 0)
    ));
    
    const visualLoad = Math.min(10, (
      (tables * 2) +
      (lists * 1) +
      (numbers.length / 10) +
      (formulas.length * 2)
    ));
    
    const executiveLoad = Math.min(10, (
      (paragraphs.length > 5 ? 2 : 0) +
      (avgSentenceLength > 15 ? 2 : 0) +
      (complexWordRatio > 0.2 ? 2 : 0) +
      (tables > 0 ? 2 : 0) +
      (formulas.length > 0 ? 2 : 0)
    ));
    
    const overallLoad = Math.min(10, (verbalLoad * 0.4 + visualLoad * 0.3 + executiveLoad * 0.3));
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (verbalLoad > 7) {
      recommendations.push('Simplify language and shorten sentences');
      recommendations.push('Break content into smaller chunks');
    }
    
    if (visualLoad > 7) {
      recommendations.push('Reduce visual complexity by simplifying tables and diagrams');
      recommendations.push('Present numerical information in smaller groups');
    }
    
    if (executiveLoad > 7) {
      recommendations.push('Provide clear structure with headings and subheadings');
      recommendations.push('Add summary points at the beginning or end of sections');
    }
    
    if (overallLoad > 7) {
      recommendations.push('Consider splitting content into multiple pages or sections');
      recommendations.push('Add interactive elements to engage working memory actively');
    }
    
    return {
      overallLoad,
      visualLoad,
      verbalLoad,
      executiveLoad,
      recommendations
    };
  }

  /**
   * Detect working memory challenges from user interaction data
   * 
   * @param userId User identifier
   * @param interactionData User interaction data
   */
  public detectWorkingMemoryChallenges(
    userId: string,
    interactionData: {
      pageRevisits: number;
      taskSwitches: number;
      incompleteActions: number;
      responseDelays: number[];
      errorPatterns: { type: string; count: number }[];
      timeOnTask: number;
    }
  ): {
    detectedChallenges: WorkingMemoryChallengeArea[];
    confidenceLevel: number;
    recommendedSupportLevel: WorkingMemorySupportLevel;
  } {
    const detectedChallenges: WorkingMemoryChallengeArea[] = [];
    let confidenceLevel = 0.5;
    
    // Detect visual-spatial sketchpad challenges
    if (interactionData.errorPatterns.some(pattern => 
      pattern.type === 'spatial_navigation' && pattern.count > 3
    )) {
      detectedChallenges.push(WorkingMemoryChallengeArea.VISUAL_SPATIAL_SKETCHPAD);
      confidenceLevel += 0.1;
    }
    
    // Detect phonological loop challenges
    if (interactionData.errorPatterns.some(pattern => 
      pattern.type === 'instruction_recall' && pattern.count > 3
    )) {
      detectedChallenges.push(WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP);
      confidenceLevel += 0.1;
    }
    
    // Detect central executive challenges
    if (interactionData.taskSwitches > 5 || interactionData.incompleteActions > 3) {
      detectedChallenges.push(WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE);
      confidenceLevel += 0.1;
    }
    
    // Detect episodic buffer challenges
    if (interactionData.pageRevisits > 5) {
      detectedChallenges.push(WorkingMemoryChallengeArea.EPISODIC_BUFFER);
      confidenceLevel += 0.1;
    }
    
    // Determine recommended support level based on challenges
    let recommendedSupportLevel = WorkingMemorySupportLevel.MINIMAL;
    
    if (detectedChallenges.length === 1) {
      recommendedSupportLevel = WorkingMemorySupportLevel.MODERATE;
    } else if (detectedChallenges.length === 2) {
      recommendedSupportLevel = WorkingMemorySupportLevel.SUBSTANTIAL;
    } else if (detectedChallenges.length > 2) {
      recommendedSupportLevel = WorkingMemorySupportLevel.COMPREHENSIVE;
    }
    
    // Update user profile with detected challenges
    const profile = this.getUserProfile(userId) || this.createDefaultProfile(userId);
    
    // Merge detected challenges with existing ones
    const allChallenges = [...new Set([...profile.challengeAreas, ...detectedChallenges])];
    profile.challengeAreas = allChallenges;
    profile.recommendedSupportLevel = recommendedSupportLevel;
    
    // Update user profile
    this.userProfiles.set(userId, profile);
    
    return {
      detectedChallenges,
      confidenceLevel: Math.min(1.0, confidenceLevel),
      recommendedSupportLevel
    };
  }

  /**
   * Get default support tools
   */
  private getDefaultSupportTools(): WorkingMemorySupportTool[] {
    return [
      this.supportTools.get('visual_checklist')!,
      this.supportTools.get('task_breakdown')!,
      this.supportTools.get('attention_refocuser')!
    ];
  }

  /**
   * Get default exercises
   */
  private getDefaultExercises(): WorkingMemoryExerciseConfig[] {
    return [
      this.exerciseConfigurations.get('digit_span')!,
      this.exerciseConfigurations.get('pattern_memory')!,
      this.exerciseConfigurations.get('sorting_task')!
    ];
  }

  /**
   * Create default profile for a user
   * 
   * @param userId User identifier
   */
  private createDefaultProfile(userId: string): WorkingMemoryProfile {
    const defaultProfile: WorkingMemoryProfile = {
      overallCapacity: 5,
      visualSpatialCapacity: 5,
      phonologicalCapacity: 5,
      centralExecutiveStrength: 5,
      episodicBufferCapacity: 5,
      challengeAreas: [],
      recommendedExercises: [
        WorkingMemoryExerciseType.SEQUENTIAL_MEMORY,
        WorkingMemoryExerciseType.VISUAL_SPATIAL
      ],
      recommendedSupportLevel: WorkingMemorySupportLevel.MODERATE,
      exerciseHistory: [],
      progressTrend: 'initial'
    };
    
    this.userProfiles.set(userId, defaultProfile);
    return defaultProfile;
  }

  /**
   * Update profile capacities based on exercise results
   * 
   * @param profile Working memory profile
   * @param result Exercise result
   */
  private updateProfileCapacities(profile: WorkingMemoryProfile, result: WorkingMemoryExerciseResult): void {
    // Calculate performance factor (-0.2 to +0.2)
    const performanceFactor = ((result.score / 100) - 0.5) * 0.4;
    
    // Update capacities based on exercise type and performance
    switch (result.type) {
      case WorkingMemoryExerciseType.SEQUENTIAL_MEMORY:
      case WorkingMemoryExerciseType.AUDITORY_VERBAL:
        profile.phonologicalCapacity = Math.max(1, Math.min(10, profile.phonologicalCapacity + performanceFactor));
        break;
        
      case WorkingMemoryExerciseType.VISUAL_SPATIAL:
        profile.visualSpatialCapacity = Math.max(1, Math.min(10, profile.visualSpatialCapacity + performanceFactor));
        break;
        
      case WorkingMemoryExerciseType.DUAL_N_BACK:
      case WorkingMemoryExerciseType.PATTERN_RECOGNITION:
      case WorkingMemoryExerciseType.MENTAL_MATH:
        profile.centralExecutiveStrength = Math.max(1, Math.min(10, profile.centralExecutiveStrength + performanceFactor));
        break;
        
      case WorkingMemoryExerciseType.CATEGORIZATION:
      case WorkingMemoryExerciseType.INSTRUCTION_FOLLOWING:
        profile.episodicBufferCapacity = Math.max(1, Math.min(10, profile.episodicBufferCapacity + performanceFactor));
        break;
    }
    
    // Update overall capacity (average of all capacities)
    profile.overallCapacity = Math.round(
      (profile.visualSpatialCapacity +
       profile.phonologicalCapacity +
       profile.centralExecutiveStrength +
       profile.episodicBufferCapacity) / 4
    );
    
    // Update challenge areas based on capacities
    profile.challengeAreas = [];
    
    if (profile.visualSpatialCapacity < 4) {
      profile.challengeAreas.push(WorkingMemoryChallengeArea.VISUAL_SPATIAL_SKETCHPAD);
    }
    
    if (profile.phonologicalCapacity < 4) {
      profile.challengeAreas.push(WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP);
    }
    
    if (profile.centralExecutiveStrength < 4) {
      profile.challengeAreas.push(WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE);
    }
    
    if (profile.episodicBufferCapacity < 4) {
      profile.challengeAreas.push(WorkingMemoryChallengeArea.EPISODIC_BUFFER);
    }
    
    // Update recommended exercises based on challenge areas
    profile.recommendedExercises = this.getRecommendedExerciseTypes(profile.challengeAreas);
    
    // Update recommended support level based on overall capacity
    if (profile.overallCapacity >= 7) {
      profile.recommendedSupportLevel = WorkingMemorySupportLevel.MINIMAL;
    } else if (profile.overallCapacity >= 5) {
      profile.recommendedSupportLevel = WorkingMemorySupportLevel.MODERATE;
    } else if (profile.overallCapacity >= 3) {
      profile.recommendedSupportLevel = WorkingMemorySupportLevel.SUBSTANTIAL;
    } else {
      profile.recommendedSupportLevel = WorkingMemorySupportLevel.COMPREHENSIVE;
    }
  }

  /**
   * Get recommended exercise types based on challenge areas
   * 
   * @param challengeAreas Working memory challenge areas
   */
  private getRecommendedExerciseTypes(challengeAreas: WorkingMemoryChallengeArea[]): WorkingMemoryExerciseType[] {
    const recommendedTypes: WorkingMemoryExerciseType[] = [];
    
    if (challengeAreas.includes(WorkingMemoryChallengeArea.VISUAL_SPATIAL_SKETCHPAD)) {
      recommendedTypes.push(WorkingMemoryExerciseType.VISUAL_SPATIAL);
    }
    
    if (challengeAreas.includes(WorkingMemoryChallengeArea.PHONOLOGICAL_LOOP)) {
      recommendedTypes.push(WorkingMemoryExerciseType.AUDITORY_VERBAL);
      recommendedTypes.push(WorkingMemoryExerciseType.SEQUENTIAL_MEMORY);
    }
    
    if (challengeAreas.includes(WorkingMemoryChallengeArea.CENTRAL_EXECUTIVE)) {
      recommendedTypes.push(WorkingMemoryExerciseType.DUAL_N_BACK);
      recommendedTypes.push(WorkingMemoryExerciseType.MENTAL_MATH);
    }
    
    if (challengeAreas.includes(WorkingMemoryChallengeArea.EPISODIC_BUFFER)) {
      recommendedTypes.push(WorkingMemoryExerciseType.CATEGORIZATION);
      recommendedTypes.push(WorkingMemoryExerciseType.INSTRUCTION_FOLLOWING);
    }
    
    // If no specific challenges or empty array, recommend balanced set
    if (recommendedTypes.length === 0) {
      recommendedTypes.push(
        WorkingMemoryExerciseType.SEQUENTIAL_MEMORY,
        WorkingMemoryExerciseType.VISUAL_SPATIAL,
        WorkingMemoryExerciseType.PATTERN_RECOGNITION
      );
    }
    
    return recommendedTypes;
  }

  /**
   * Count syllables in a word
   * 
   * @param word Word to count syllables in
   */
  private countSyllables(word: string): number {
    // This is a simplified implementation - in a real system, this would use
    // a more sophisticated syllable counting algorithm
    
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    
    // Count vowel groups
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
    let count = 0;
    let prevIsVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !prevIsVowel) {
        count++;
      }
      prevIsVowel = isVowel;
    }
    
    // Adjust for silent e at end
    if (word.length > 2 && word.endsWith('e') && !vowels.includes(word[word.length - 2])) {
      count--;
    }
    
    // Ensure at least one syllable
    return Math.max(1, count);
  }
}

// Export singleton instance
export const workingMemorySupport = WorkingMemorySupport.getInstance();
