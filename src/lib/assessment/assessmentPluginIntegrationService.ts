/**
 * Assessment Plugin Integration Service
 * 
 * This service integrates assessment tool plugins with the core assessment engine,
 * providing a unified interface for using both built-in and third-party assessment tools.
 */

import { 
  AssessmentEngine,
  Assessment,
  AssessmentTemplate,
  AssessmentResult,
  QuestionResponse
} from '../assessment/types';
import { AssessmentEngineService } from '../assessment/assessmentEngineService';
import { QuestionBankService } from '../assessment/questionBankService';
import { AdaptiveDifficultyService } from '../assessment/adaptiveDifficultyService';
import { FeedbackGeneratorService } from '../assessment/feedbackGeneratorService';
import { 
  PluginRegistry, 
  AssessmentToolPlugin,
  PluginStatus
} from '../plugins/types';
import {
  convertToPluginFormat,
  convertToQuestionResponses,
  convertToAssessmentResult
} from '../plugins/templates/assessmentToolPlugin';

/**
 * Service for integrating assessment plugins with the core assessment engine
 */
export class AssessmentPluginIntegrationService {
  private assessmentEngine: AssessmentEngine;
  private pluginRegistry: PluginRegistry;
  
  /**
   * Constructor for the assessment plugin integration service
   * 
   * @param pluginRegistry The plugin registry
   */
  constructor(pluginRegistry: PluginRegistry) {
    // Initialize the core assessment engine
    const questionBank = new QuestionBankService();
    const adaptiveEngine = new AdaptiveDifficultyService();
    const feedbackGenerator = new FeedbackGeneratorService();
    
    this.assessmentEngine = new AssessmentEngineService(
      questionBank,
      adaptiveEngine,
      feedbackGenerator
    );
    
    this.pluginRegistry = pluginRegistry;
  }
  
  /**
   * Create an assessment using either the core engine or a plugin
   * 
   * @param assessment The assessment to create
   * @param pluginId Optional plugin ID to use for creation
   * @returns The ID of the created assessment
   */
  async createAssessment(assessment: Assessment, pluginId?: string): Promise<string> {
    // If no plugin ID is specified, use the core engine
    if (!pluginId) {
      return this.assessmentEngine.createAssessment(assessment);
    }
    
    // Get the plugin
    const plugin = this.getAssessmentPlugin(pluginId);
    
    // Convert assessment to plugin format
    const pluginParams = convertToPluginFormat(assessment);
    
    // Create the assessment using the plugin
    const pluginAssessment = await plugin.createAssessment(pluginParams);
    
    // Return the assessment ID
    return pluginAssessment.id;
  }
  
  /**
   * Generate an assessment from a template using either the core engine or a plugin
   * 
   * @param template The assessment template
   * @param pluginId Optional plugin ID to use for generation
   * @returns The generated assessment
   */
  async generateAssessment(template: AssessmentTemplate, pluginId?: string): Promise<Assessment> {
    // If no plugin ID is specified, use the core engine
    if (!pluginId) {
      return this.assessmentEngine.generateAssessment(template);
    }
    
    // Get the plugin
    const plugin = this.getAssessmentPlugin(pluginId);
    
    // Convert template to plugin format
    const pluginParams = {
      assessmentType: template.assessmentType,
      targetAgeRange: this.getAgeRangeForKeyStage(template.keyStage),
      subject: template.subject,
      topics: template.topicDistribution.map(td => td.topic),
      difficultyLevel: template.difficultyLevel,
      questionCount: template.questionCount,
      timeLimit: template.settings.timeLimit,
      adaptiveDifficulty: template.settings.adaptiveDifficulty
    };
    
    // Create the assessment using the plugin
    const pluginAssessment = await plugin.createAssessment(pluginParams);
    
    // Convert plugin assessment to platform format
    // In a real implementation, this would convert the plugin's assessment format
    // to the platform's Assessment type
    
    // For now, generate a mock assessment using the core engine
    return this.assessmentEngine.generateAssessment(template);
  }
  
  /**
   * Start an assessment attempt
   * 
   * @param assessmentId The ID of the assessment
   * @param studentId The ID of the student
   * @param pluginId Optional plugin ID to use
   * @returns The ID of the created attempt
   */
  async startAttempt(assessmentId: string, studentId: string, pluginId?: string): Promise<string> {
    // If no plugin ID is specified, use the core engine
    if (!pluginId) {
      return this.assessmentEngine.startAttempt(assessmentId, studentId);
    }
    
    // For plugin-based assessments, we'll use the core engine to track the attempt
    // but delegate the actual assessment to the plugin
    return this.assessmentEngine.startAttempt(assessmentId, studentId);
  }
  
  /**
   * Submit a response to a question in an assessment attempt
   * 
   * @param attemptId The ID of the attempt
   * @param response The student's response to the question
   * @param pluginId Optional plugin ID to use
   * @returns Whether the submission was successful
   */
  async submitResponse(attemptId: string, response: QuestionResponse, pluginId?: string): Promise<boolean> {
    // If no plugin ID is specified, use the core engine
    if (!pluginId) {
      return this.assessmentEngine.submitResponse(attemptId, response);
    }
    
    // For plugin-based assessments, we'll use the core engine to track the response
    // but also store it for later submission to the plugin
    return this.assessmentEngine.submitResponse(attemptId, response);
  }
  
  /**
   * Complete an assessment attempt and generate results
   * 
   * @param attemptId The ID of the attempt to complete
   * @param pluginId Optional plugin ID to use
   * @returns The assessment result
   */
  async completeAttempt(attemptId: string, pluginId?: string): Promise<AssessmentResult> {
    // If no plugin ID is specified, use the core engine
    if (!pluginId) {
      return this.assessmentEngine.completeAttempt(attemptId);
    }
    
    // Get the plugin
    const plugin = this.getAssessmentPlugin(pluginId);
    
    // Get the attempt
    const attempt = await this.assessmentEngine.getAttempt(attemptId);
    if (!attempt) {
      throw new Error(`Attempt not found: ${attemptId}`);
    }
    
    // Get the assessment
    const assessment = await this.assessmentEngine.getAssessment(attempt.assessmentId);
    if (!assessment) {
      throw new Error(`Assessment not found: ${attempt.assessmentId}`);
    }
    
    // Score the assessment using the plugin
    const pluginResult = await plugin.scoreAssessment(
      attempt.assessmentId,
      attempt.responses
    );
    
    // Convert plugin result to platform format
    const result = convertToAssessmentResult(pluginResult, assessment);
    
    return result;
  }
  
  /**
   * Get assessment results
   * 
   * @param assessmentId The ID of the assessment
   * @param studentId The ID of the student
   * @param pluginId Optional plugin ID to use
   * @returns The assessment result
   */
  async getResults(assessmentId: string, studentId: string, pluginId?: string): Promise<AssessmentResult | null> {
    // If no plugin ID is specified, use the core engine
    if (!pluginId) {
      // Get the most recent attempt for this assessment and student
      const attempts = await this.assessmentEngine.getStudentAttempts(studentId, assessmentId);
      
      if (attempts.length === 0) {
        return null;
      }
      
      // Sort attempts by start time (descending)
      attempts.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
      
      // Get the most recent completed attempt
      const completedAttempt = attempts.find(a => a.isComplete);
      
      if (!completedAttempt) {
        return null;
      }
      
      // Complete the attempt if it hasn't been completed yet
      if (!completedAttempt.score) {
        return this.assessmentEngine.completeAttempt(completedAttempt.id);
      }
      
      // Return the result
      return {
        attemptId: completedAttempt.id,
        assessmentId,
        studentId,
        score: completedAttempt.score,
        maxScore: 0, // Would be calculated from the assessment
        percentage: completedAttempt.percentage || 0,
        passed: completedAttempt.passed || false,
        completedAt: completedAttempt.endTime || new Date(),
        timeSpent: 0, // Would be calculated from the attempt
        questionResults: [],
        analytics: {
          byDifficulty: {},
          byCognitiveDomain: {},
          strengths: [],
          areasForImprovement: []
        },
        feedback: {
          overall: '',
          byTopic: {},
          nextSteps: []
        }
      };
    }
    
    // Get the plugin
    const plugin = this.getAssessmentPlugin(pluginId);
    
    // Get the results using the plugin
    const pluginResult = await plugin.getResults(assessmentId);
    
    // Get the assessment
    const assessment = await this.assessmentEngine.getAssessment(assessmentId);
    if (!assessment) {
      throw new Error(`Assessment not found: ${assessmentId}`);
    }
    
    // Convert plugin result to platform format
    return convertToAssessmentResult(pluginResult, assessment);
  }
  
  /**
   * Get a list of available assessment plugins
   * 
   * @returns Array of assessment plugin metadata
   */
  getAvailablePlugins(): Array<{
    id: string;
    name: string;
    description: string;
    status: PluginStatus;
  }> {
    // Get all plugins
    const allPlugins = this.pluginRegistry.listPlugins();
    
    // Filter for assessment tool plugins
    const assessmentPlugins = allPlugins.filter(plugin => {
      const metadata = plugin.metadata;
      return metadata.supportedFeatures.includes('assessment');
    });
    
    // Return simplified metadata
    return assessmentPlugins.map(plugin => ({
      id: plugin.metadata.id,
      name: plugin.metadata.name,
      description: plugin.metadata.description,
      status: plugin.status
    }));
  }
  
  /**
   * Get an assessment plugin by ID
   * 
   * @param pluginId The ID of the plugin to get
   * @returns The assessment plugin
   * @throws Error if plugin is not found or not an assessment plugin
   */
  private getAssessmentPlugin(pluginId: string): AssessmentToolPlugin {
    // Get the plugin
    const plugin = this.pluginRegistry.getPlugin(pluginId);
    
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginId}`);
    }
    
    // Check if it's an assessment plugin
    if (!plugin.getMetadata().supportedFeatures.includes('assessment')) {
      throw new Error(`Plugin is not an assessment plugin: ${pluginId}`);
    }
    
    // Check if it's active
    if (plugin.getStatus() !== PluginStatus.ACTIVE) {
      throw new Error(`Plugin is not active: ${pluginId}`);
    }
    
    return plugin as AssessmentToolPlugin;
  }
  
  /**
   * Get the typical age range for a UK Key Stage
   * 
   * @param keyStage The Key Stage
   * @returns The age range object
   */
  private getAgeRangeForKeyStage(keyStage: string): { min: number; max: number } {
    switch (keyStage) {
      case 'early_years':
        return { min: 3, max: 5 };
      case 'key_stage_1':
        return { min: 5, max: 7 };
      case 'key_stage_2':
        return { min: 7, max: 11 };
      case 'key_stage_3':
        return { min: 11, max: 14 };
      case 'key_stage_4':
        return { min: 14, max: 16 };
      case 'key_stage_5':
        return { min: 16, max: 19 };
      default:
        return { min: 5, max: 18 };
    }
  }
}
