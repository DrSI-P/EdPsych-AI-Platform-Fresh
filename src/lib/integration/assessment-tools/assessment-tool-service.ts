/**
 * Assessment Tool Service
 * 
 * This service manages integration with third-party assessment tools,
 * enabling assessment discovery, delivery, and result tracking.
 */
export class AssessmentToolService {
  private static instance: AssessmentToolService;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  /**
   * Get the singleton instance of the Assessment Tool service
   */
  public static getInstance(): AssessmentToolService {
    if (!AssessmentToolService.instance) {
      AssessmentToolService.instance = new AssessmentToolService();
    }
    return AssessmentToolService.instance;
  }
  
  /**
   * Register a new assessment tool
   * 
   * @param tenantId The tenant ID for multi-tenant support
   * @param toolData The assessment tool data
   */
  public async registerAssessmentTool(tenantId: string, toolData: any): Promise<string> {
    try {
      // Validate required fields
      if (!toolData.name || !toolData.type || !toolData.baseUrl) {
        throw new Error('Missing required fields');
      }
      
      // Store assessment tool in database
      const toolId = await this.storeAssessmentTool({
        tenantId,
        name: toolData.name,
        description: toolData.description || '',
        type: toolData.type,
        baseUrl: toolData.baseUrl,
        apiKey: toolData.apiKey,
        apiSecret: toolData.apiSecret,
        oauthClientId: toolData.oauthClientId,
        oauthClientSecret: toolData.oauthClientSecret,
        oauthTokenUrl: toolData.oauthTokenUrl,
        status: 'pending',
        supportedQuestionTypes: toolData.supportedQuestionTypes || [],
        settings: toolData.settings || {},
        metadata: toolData.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return toolId;
    } catch (error) {
      console.error('Error registering assessment tool:', error);
      throw new Error('Failed to register assessment tool');
    }
  }
  
  /**
   * Search for assessments across all tools
   * 
   * @param tenantId The tenant ID for multi-tenant support
   * @param searchQuery The search query parameters
   */
  public async searchAssessments(tenantId: string, searchQuery: any): Promise<any> {
    try {
      // Get active assessment tools for this tenant
      const tools = await this.getActiveAssessmentTools(tenantId);
      
      // Filter tools based on search query
      const filteredTools = searchQuery.tools && searchQuery.tools.length > 0
        ? tools.filter(t => searchQuery.tools.includes(t.id))
        : tools;
      
      // Search each tool in parallel
      const searchPromises = filteredTools.map(tool => 
        this.searchToolAssessments(tool, searchQuery)
      );
      
      // Wait for all searches to complete
      const searchResults = await Promise.allSettled(searchPromises);
      
      // Process results
      const items: any[] = [];
      let total = 0;
      
      searchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const toolResults = result.value;
          items.push(...toolResults.items);
          total += toolResults.total;
        } else {
          console.error(`Error searching tool ${filteredTools[index].name}:`, result.reason);
        }
      });
      
      // Apply limit and offset
      const limit = searchQuery.limit || 20;
      const offset = searchQuery.offset || 0;
      const paginatedItems = items.slice(offset, offset + limit);
      
      return {
        items: paginatedItems,
        total,
        limit,
        offset
      };
    } catch (error) {
      console.error('Error searching assessments:', error);
      throw new Error('Failed to search assessments');
    }
  }
  
  /**
   * Get assessment details
   * 
   * @param tenantId The tenant ID for multi-tenant support
   * @param assessmentId The assessment ID
   */
  public async getAssessment(tenantId: string, assessmentId: string): Promise<any> {
    try {
      // Get assessment from database
      const assessment = await this.findAssessment(assessmentId, tenantId);
      
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      
      // Get tool details
      const tool = await this.getAssessmentToolById(assessment.toolId, tenantId);
      
      if (!tool) {
        throw new Error('Assessment tool not found');
      }
      
      // Get questions for this assessment
      const questions = await this.getAssessmentQuestions(assessmentId, tenantId);
      
      // Enrich assessment with tool details and questions
      return {
        ...assessment,
        tool: {
          id: tool.id,
          name: tool.name,
          type: tool.type
        },
        questions
      };
    } catch (error) {
      console.error('Error getting assessment:', error);
      throw new Error('Failed to get assessment');
    }
  }
  
  /**
   * Start assessment attempt
   * 
   * @param tenantId The tenant ID for multi-tenant support
   * @param assessmentId The assessment ID
   * @param userId The user ID
   * @param contextId Optional context ID (e.g., class, course)
   */
  public async startAssessmentAttempt(
    tenantId: string,
    assessmentId: string,
    userId: string,
    contextId?: string
  ): Promise<string> {
    try {
      // Get assessment details
      const assessment = await this.findAssessment(assessmentId, tenantId);
      
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      
      // Check if user has reached maximum attempts
      if (assessment.maxAttempts) {
        const attemptCount = await this.getUserAttemptCount(assessmentId, userId, tenantId);
        
        if (attemptCount >= assessment.maxAttempts) {
          throw new Error('Maximum attempts reached');
        }
      }
      
      // Create assessment attempt
      const attemptId = await this.storeAssessmentAttempt({
        tenantId,
        assessmentId,
        userId,
        contextId,
        startedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return attemptId;
    } catch (error) {
      console.error('Error starting assessment attempt:', error);
      throw new Error('Failed to start assessment attempt');
    }
  }
  
  /**
   * Submit assessment attempt
   * 
   * @param tenantId The tenant ID for multi-tenant support
   * @param attemptId The attempt ID
   * @param answers The question answers
   */
  public async submitAssessmentAttempt(
    tenantId: string,
    attemptId: string,
    answers: any[]
  ): Promise<any> {
    try {
      // Get attempt details
      const attempt = await this.findAssessmentAttempt(attemptId, tenantId);
      
      if (!attempt) {
        throw new Error('Assessment attempt not found');
      }
      
      if (attempt.completedAt) {
        throw new Error('Assessment attempt already completed');
      }
      
      // Get assessment details
      const assessment = await this.findAssessment(attempt.assessmentId, tenantId);
      
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      
      // Get questions for this assessment
      const questions = await this.getAssessmentQuestions(assessment.id, tenantId);
      
      // Process answers and calculate score
      const processedAnswers = await this.processAnswers(answers, questions);
      const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
      const earnedPoints = processedAnswers.reduce((sum, a) => sum + (a.points || 0), 0);
      const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
      const passed = assessment.passingScore ? score >= assessment.passingScore : true;
      
      // Calculate time spent
      const startedAt = new Date(attempt.startedAt);
      const completedAt = new Date();
      const timeSpent = Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000);
      
      // Update attempt with results
      const updatedAttempt = {
        ...attempt,
        completedAt,
        timeSpent,
        score,
        passed,
        answers: processedAnswers,
        updatedAt: new Date()
      };
      
      await this.updateAssessmentAttempt(attemptId, updatedAttempt);
      
      // Return results
      return {
        attemptId,
        score,
        passed,
        timeSpent,
        feedback: assessment.showFeedback ? this.generateFeedback(processedAnswers, questions) : null,
        results: assessment.showResults ? processedAnswers : null
      };
    } catch (error) {
      console.error('Error submitting assessment attempt:', error);
      throw new Error('Failed to submit assessment attempt');
    }
  }
  
  /**
   * Get user assessment results
   * 
   * @param tenantId The tenant ID for multi-tenant support
   * @param userId The user ID
   * @param assessmentId Optional assessment ID to filter by
   * @param contextId Optional context ID to filter by
   * @param limit Maximum number of results to return
   * @param offset Offset for pagination
   */
  public async getUserAssessmentResults(
    tenantId: string,
    userId: string,
    assessmentId?: string,
    contextId?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<any> {
    try {
      // Build query
      const query: any = {
        userId,
        tenantId
      };
      
      if (assessmentId) {
        query.assessmentId = assessmentId;
      }
      
      if (contextId) {
        query.contextId = contextId;
      }
      
      // Get attempts from database
      const attempts = await this.findAssessmentAttempts(query, limit, offset);
      const total = await this.countAssessmentAttempts(query);
      
      // Enrich attempts with assessment details
      const enrichedAttempts = await Promise.all(
        attempts.map(async (attempt) => {
          const assessment = await this.findAssessment(attempt.assessmentId, tenantId);
          
          return {
            ...attempt,
            assessment: assessment ? {
              id: assessment.id,
              title: assessment.title,
              type: assessment.type
            } : null
          };
        })
      );
      
      return {
        items: enrichedAttempts,
        total,
        limit,
        offset
      };
    } catch (error) {
      console.error('Error getting user assessment results:', error);
      throw new Error('Failed to get user assessment results');
    }
  }
  
  /**
   * Handle webhook event from assessment tool
   * 
   * @param tenantId The tenant ID for multi-tenant support
   * @param toolId The assessment tool ID
   * @param eventType The event type
   * @param payload The event payload
   */
  public async handleWebhookEvent(
    tenantId: string,
    toolId: string,
    eventType: string,
    payload: any
  ): Promise<boolean> {
    try {
      // Store webhook event
      const eventId = await this.storeWebhookEvent({
        tenantId,
        toolId,
        eventType,
        payload,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Process event based on type
      switch (eventType) {
        case 'assessment.created':
        case 'assessment.updated':
          await this.processAssessmentUpdateEvent(toolId, payload, tenantId);
          break;
          
        case 'assessment.deleted':
          await this.processAssessmentDeleteEvent(toolId, payload, tenantId);
          break;
          
        case 'attempt.completed':
          await this.processAttemptCompletedEvent(toolId, payload, tenantId);
          break;
          
        default:
          console.warn(`Unknown webhook event type: ${eventType}`);
      }
      
      // Update event status
      await this.updateWebhookEvent(eventId, {
        status: 'processed',
        processedAt: new Date(),
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Error handling webhook event:', error);
      
      // Update event status with error
      if (error instanceof Error) {
        await this.updateWebhookEvent(eventId, {
          status: 'failed',
          error: error.message,
          updatedAt: new Date()
        });
      }
      
      throw new Error('Failed to handle webhook event');
    }
  }
  
  // Private helper methods
  
  private async storeAssessmentTool(tool: any): Promise<string> {
    // Implementation would store in database
    return 'mock-tool-id';
  }
  
  private async getActiveAssessmentTools(tenantId: string): Promise<any[]> {
    // Implementation would query database
    return [
      {
        id: 'mock-tool-1',
        name: 'Mock Tool 1',
        type: 'formative',
        baseUrl: 'https://tool1.example.com'
      },
      {
        id: 'mock-tool-2',
        name: 'Mock Tool 2',
        type: 'summative',
        baseUrl: 'https://tool2.example.com'
      }
    ];
  }
  
  private async searchToolAssessments(tool: any, query: any): Promise<any> {
    // Implementation would call tool API
    return {
      items: [
        {
          id: 'mock-assessment-1',
          toolId: tool.id,
          title: 'Mock Assessment 1',
          description: 'This is mock assessment 1',
          type: 'formative'
        },
        {
          id: 'mock-assessment-2',
          toolId: tool.id,
          title: 'Mock Assessment 2',
          description: 'This is mock assessment 2',
          type: 'summative'
        }
      ],
      total: 2
    };
  }
  
  private async findAssessment(assessmentId: string, tenantId: string): Promise<any> {
    // Implementation would query database
    return {
      id: assessmentId,
      toolId: 'mock-tool-1',
      title: 'Mock Assessment',
      description: 'This is a mock assessment',
      timeLimit: 30,
      passingScore: 70,
      maxAttempts: 3,
      showFeedback: true,
      showResults: true
    };
  }
  
  private async getAssessmentToolById(toolId: string, tenantId: string): Promise<any> {
    // Implementation would query database
    return {
      id: toolId,
      name: 'Mock Tool',
      type: 'formative',
      baseUrl: 'https://tool1.example.com'
    };
  }
  
  private async getAssessmentQuestions(assessmentId: string, tenantId: string): Promise<any[]> {
    // Implementation would query database
    return [
      {
        id: 'mock-question-1',
        assessmentId,
        type: 'multiple_choice',
        text: 'What is 2 + 2?',
        options: [
          { id: 'option-1', text: '3', isCorrect: false },
          { id: 'option-2', text: '4', isCorrect: true },
          { id: 'option-3', text: '5', isCorrect: false }
        ],
        correctAnswer: 'option-2',
        points: 1
      },
      {
        id: 'mock-question-2',
        assessmentId,
        type: 'true_false',
        text: 'The Earth is flat.',
        options: [
          { id: 'option-1', text: 'True', isCorrect: false },
          { id: 'option-2', text: 'False', isCorrect: true }
        ],
        correctAnswer: 'option-2',
        points: 1
      }
    ];
  }
  
  private async getUserAttemptCount(assessmentId: string, userId: string, tenantId: string): Promise<number> {
    // Implementation would query database
    return 1;
  }
  
  private async storeAssessmentAttempt(attempt: any): Promise<string> {
    // Implementation would store in database
    return 'mock-attempt-id';
  }
  
  private async findAssessmentAttempt(attemptId: string, tenantId: string): Promise<any> {
    // Implementation would query database
    return {
      id: attemptId,
      assessmentId: 'mock-assessment-1',
      userId: 'mock-user-1',
      startedAt: new Date(Date.now() - 600000) // 10 minutes ago
    };
  }
  
  private async updateAssessmentAttempt(attemptId: string, updates: any): Promise<void> {
    // Implementation would update database
  }
  
  private async processAnswers(answers: any[], questions: any[]): Promise<any[]> {
    // Implementation would process answers and calculate scores
    return answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      
      if (!question) {
        return {
          ...answer,
          isCorrect: false,
          points: 0
        };
      }
      
      const isCorrect = this.checkAnswer(answer.answer, question);
      const points = isCorrect ? (question.points || 1) : 0;
      
      return {
        ...answer,
        isCorrect,
        points
      };
    });
  }
  
  private checkAnswer(answer: any, question: any): boolean {
    // Implementation would check answer against correct answer
    switch (question.type) {
      case 'multiple_choice':
      case 'true_false':
        return answer === question.correctAnswer;
        
      case 'multiple_answer':
        if (!Array.isArray(answer) || !Array.isArray(question.correctAnswer)) {
          return false;
        }
        return answer.length === question.correctAnswer.length &&
          answer.every(a => question.correctAnswer.includes(a));
        
      case 'short_answer':
        return answer.toLowerCase() === question.correctAnswer.toLowerCase();
        
      default:
        return false;
    }
  }
  
  private generateFeedback(answers: any[], questions: any[]): string {
    // Implementation would generate feedback based on answers
    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalCount = questions.length;
    const percentage = Math.round((correctCount / totalCount) * 100);
    
    return `You answered ${correctCount} out of ${totalCount} questions correctly (${percentage}%).`;
  }
  
  private async findAssessmentAttempts(query: any, limit: number, offset: number): Promise<any[]> {
    // Implementation would query database
    return [
      {
        id: 'mock-attempt-1',
        assessmentId: 'mock-assessment-1',
        userId: query.userId,
        startedAt: new Date(Date.now() - 86400000), // 1 day ago
        completedAt: new Date(Date.now() - 86000000),
        score: 80,
        passed: true
      }
    ];
  }
  
  private async countAssessmentAttempts(query: any): Promise<number> {
    // Implementation would query database
    return 1;
  }
  
  private async storeWebhookEvent(event: any): Promise<string> {
    // Implementation would store in database
    return 'mock-event-id';
  }
  
  private async updateWebhookEvent(eventId: string, updates: any): Promise<void> {
    // Implementation would update database
  }
  
  private async processAssessmentUpdateEvent(toolId: string, payload: any, tenantId: string): Promise<void> {
    // Implementation would process assessment update
  }
  
  private async processAssessmentDeleteEvent(toolId: string, payload: any, tenantId: string): Promise<void> {
    // Implementation would process assessment deletion
  }
  
  private async processAttemptCompletedEvent(toolId: string, payload: any, tenantId: string): Promise<void> {
    // Implementation would process attempt completion
  }
}
