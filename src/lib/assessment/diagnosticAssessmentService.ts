/**
 * Diagnostic Assessment Service
 * 
 * This service implements the core functionality for comprehensive diagnostic assessments,
 * providing detailed insights into student strengths, weaknesses, and learning gaps.
 */

import {
  DiagnosticAssessment,
  DiagnosticQuestion,
  DiagnosticResponse,
  DiagnosticResult,
  KnowledgeArea,
  Skill,
  LearningGap,
  ProficiencyLevel,
  DiagnosticAssessmentTemplate,
  ProgressTrackingRecord,
  SpacedRepetitionSchedule
} from './diagnosticAssessmentTypes';

import { v4 as uuidv4 } from 'uuid';
import { DifficultyLevel, UKKeyStage, UKSubject } from './types';

/**
 * Service for managing diagnostic assessments and related functionality
 */
export class DiagnosticAssessmentService {
  /**
   * Create a new diagnostic assessment
   * @param assessment The assessment to create
   * @returns The created assessment with generated ID
   */
  async createDiagnosticAssessment(assessment: Omit<DiagnosticAssessment, 'id'>): Promise<DiagnosticAssessment> {
    const now = new Date();
    const newAssessment: DiagnosticAssessment = {
      ...assessment,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      status: assessment.status || 'draft'
    };
    
    // In a real implementation, this would save to a database
    console.log(`Creating diagnostic assessment: ${newAssessment.title}`);
    
    return newAssessment;
  }
  
  /**
   * Generate a diagnostic assessment from a template
   * @param template The template to use
   * @param questionBank The question bank to draw questions from
   * @returns The generated diagnostic assessment
   */
  async generateFromTemplate(
    template: DiagnosticAssessmentTemplate,
    questionBank: DiagnosticQuestion[]
  ): Promise<DiagnosticAssessment> {
    console.log(`Generating diagnostic assessment from template: ${template.name}`);
    
    // Filter questions by subject and key stage
    const filteredQuestions = questionBank.filter(q => 
      q.knowledgeAreaIds.some(kaId => 
        template.knowledgeAreaDistribution.some(kad => kad.knowledgeAreaId === kaId)
      )
    );
    
    // Select questions based on template distribution
    const selectedQuestions: DiagnosticQuestion[] = [];
    
    // Calculate total number of questions based on estimated duration
    // Assuming average of 2 minutes per question
    const totalQuestions = Math.floor(template.estimatedDuration / 2);
    
    // Select questions for each knowledge area based on distribution
    for (const kad of template.knowledgeAreaDistribution) {
      const questionCount = Math.floor((kad.percentage / 100) * totalQuestions);
      const areaQuestions = filteredQuestions.filter(q => 
        q.knowledgeAreaIds.includes(kad.knowledgeAreaId)
      );
      
      // Sort by difficulty to ensure a good distribution
      areaQuestions.sort((a, b) => 
        Object.values(DifficultyLevel).indexOf(a.difficultyLevel) - 
        Object.values(DifficultyLevel).indexOf(b.difficultyLevel)
      );
      
      // Select questions up to the calculated count
      const selected = areaQuestions.slice(0, questionCount);
      selectedQuestions.push(...selected);
    }
    
    // Create the assessment
    const now = new Date();
    const assessment: DiagnosticAssessment = {
      id: uuidv4(),
      title: template.name,
      description: template.description,
      subject: template.subject,
      keyStage: template.keyStage,
      targetAgeRange: this.getAgeRangeForKeyStage(template.keyStage),
      knowledgeAreas: template.knowledgeAreaDistribution.map(kad => kad.knowledgeAreaId),
      skills: template.skillDistribution.map(sd => sd.skillId),
      questions: selectedQuestions,
      adaptiveSettings: template.adaptiveSettings,
      estimatedDuration: template.estimatedDuration,
      createdAt: now,
      updatedAt: now,
      version: '1.0.0',
      status: 'draft',
      metadata: {
        author: template.metadata.author,
        tags: template.metadata.tags,
        curriculumReferences: template.metadata.curriculumReferences
      }
    };
    
    return assessment;
  }
  
  /**
   * Process a completed diagnostic assessment and generate results
   * @param studentId The ID of the student
   * @param assessmentId The ID of the assessment
   * @param responses The student's responses
   * @returns The diagnostic result with detailed analysis
   */
  async processDiagnosticResults(
    studentId: string,
    assessment: DiagnosticAssessment,
    responses: DiagnosticResponse[]
  ): Promise<DiagnosticResult> {
    console.log(`Processing diagnostic results for student ${studentId} on assessment ${assessment.id}`);
    
    const now = new Date();
    
    // Calculate overall score
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    for (const response of responses) {
      const question = assessment.questions.find(q => q.id === response.questionId);
      if (question) {
        maxPossibleScore += question.points;
        if (response.isCorrect) {
          totalScore += question.points;
        } else if (response.partialScore) {
          totalScore += response.partialScore;
        }
      }
    }
    
    const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
    
    // Calculate knowledge area results
    const knowledgeAreaResults: DiagnosticResult['knowledgeAreaResults'] = [];
    const knowledgeAreaMap = new Map<string, {
      score: number;
      maxScore: number;
      questions: DiagnosticQuestion[];
      responses: DiagnosticResponse[];
    }>();
    
    // Initialize knowledge area map
    for (const kaId of assessment.knowledgeAreas) {
      knowledgeAreaMap.set(kaId, {
        score: 0,
        maxScore: 0,
        questions: [],
        responses: []
      });
    }
    
    // Populate knowledge area map with questions and responses
    for (const question of assessment.questions) {
      for (const kaId of question.knowledgeAreaIds) {
        const kaData = knowledgeAreaMap.get(kaId);
        if (kaData) {
          kaData.questions.push(question);
          kaData.maxScore += question.points;
          
          const response = responses.find(r => r.questionId === question.id);
          if (response) {
            kaData.responses.push(response);
            if (response.isCorrect) {
              kaData.score += question.points;
            } else if (response.partialScore) {
              kaData.score += response.partialScore;
            }
          }
        }
      }
    }
    
    // Calculate results for each knowledge area
    for (const [kaId, kaData] of knowledgeAreaMap.entries()) {
      const kaPercentage = kaData.maxScore > 0 ? (kaData.score / kaData.maxScore) * 100 : 0;
      const proficiencyLevel = this.calculateProficiencyLevel(kaPercentage);
      
      // Identify strengths and weaknesses
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      
      for (const question of kaData.questions) {
        const response = kaData.responses.find(r => r.questionId === question.id);
        if (response) {
          if (response.isCorrect && response.timeSpent < question.timeEstimate) {
            // Quick correct answer indicates strength
            strengths.push(`Quick mastery of ${question.text.substring(0, 50)}...`);
          } else if (!response.isCorrect && response.attempts > 1) {
            // Multiple attempts with incorrect answer indicates weakness
            weaknesses.push(`Difficulty with ${question.text.substring(0, 50)}...`);
          }
        }
      }
      
      knowledgeAreaResults.push({
        knowledgeAreaId: kaId,
        score: kaData.score,
        maxPossibleScore: kaData.maxScore,
        percentage: kaPercentage,
        proficiencyLevel,
        strengths,
        weaknesses
      });
    }
    
    // Calculate skill results
    const skillResults: DiagnosticResult['skillResults'] = [];
    const skillMap = new Map<string, {
      score: number;
      maxScore: number;
      questions: DiagnosticQuestion[];
      responses: DiagnosticResponse[];
    }>();
    
    // Initialize skill map
    for (const skillId of assessment.skills) {
      skillMap.set(skillId, {
        score: 0,
        maxScore: 0,
        questions: [],
        responses: []
      });
    }
    
    // Populate skill map with questions and responses
    for (const question of assessment.questions) {
      for (const skillId of question.skillIds) {
        const skillData = skillMap.get(skillId);
        if (skillData) {
          skillData.questions.push(question);
          skillData.maxScore += question.points;
          
          const response = responses.find(r => r.questionId === question.id);
          if (response) {
            skillData.responses.push(response);
            if (response.isCorrect) {
              skillData.score += question.points;
            } else if (response.partialScore) {
              skillData.score += response.partialScore;
            }
          }
        }
      }
    }
    
    // Calculate results for each skill
    for (const [skillId, skillData] of skillMap.entries()) {
      const skillPercentage = skillData.maxScore > 0 ? (skillData.score / skillData.maxScore) * 100 : 0;
      const proficiencyLevel = this.calculateProficiencyLevel(skillPercentage);
      
      // Generate observations
      const observations: string[] = [];
      
      if (skillPercentage >= 90) {
        observations.push('Demonstrates excellent mastery of this skill');
      } else if (skillPercentage >= 75) {
        observations.push('Shows strong competency in this skill area');
      } else if (skillPercentage >= 60) {
        observations.push('Demonstrates adequate proficiency with room for improvement');
      } else if (skillPercentage >= 40) {
        observations.push('Shows developing understanding but needs additional practice');
      } else {
        observations.push('Requires significant support to develop this skill');
      }
      
      skillResults.push({
        skillId,
        score: skillData.score,
        maxPossibleScore: skillData.maxScore,
        percentage: skillPercentage,
        proficiencyLevel,
        observations
      });
    }
    
    // Identify learning gaps
    const identifiedGaps: LearningGap[] = [];
    
    for (const kaResult of knowledgeAreaResults) {
      if (kaResult.percentage < 60) {
        // Significant gap
        identifiedGaps.push({
          id: uuidv4(),
          studentId,
          knowledgeAreaId: kaResult.knowledgeAreaId,
          severity: kaResult.percentage < 40 ? 'significant' : 'moderate',
          detectedAt: now,
          status: 'identified'
        });
      }
    }
    
    for (const skillResult of skillResults) {
      if (skillResult.percentage < 50) {
        // Significant skill gap
        identifiedGaps.push({
          id: uuidv4(),
          studentId,
          skillId: skillResult.skillId,
          severity: skillResult.percentage < 30 ? 'significant' : 'moderate',
          detectedAt: now,
          status: 'identified'
        });
      }
    }
    
    // Generate recommendations
    const recommendations: DiagnosticResult['recommendations'] = [];
    
    for (const gap of identifiedGaps) {
      recommendations.push({
        type: 'resource',
        title: `Targeted resources for ${gap.knowledgeAreaId || gap.skillId}`,
        description: 'Curated learning materials to address specific gaps',
        priority: gap.severity === 'significant' ? 'high' : 'medium',
        targetGapIds: [gap.id]
      });
      
      recommendations.push({
        type: 'activity',
        title: `Practice activities for ${gap.knowledgeAreaId || gap.skillId}`,
        description: 'Interactive exercises to build proficiency',
        priority: gap.severity === 'significant' ? 'high' : 'medium',
        targetGapIds: [gap.id]
      });
    }
    
    // Calculate overall proficiency level
    const overallProficiencyLevel = this.calculateProficiencyLevel(percentage);
    
    // Generate next steps
    const nextSteps: string[] = [
      'Review detailed assessment results with student',
      'Focus on addressing identified learning gaps',
      'Schedule follow-up assessment in 4-6 weeks'
    ];
    
    if (identifiedGaps.length > 0) {
      nextSteps.push('Implement recommended interventions for identified gaps');
    }
    
    if (percentage < 60) {
      nextSteps.push('Consider additional support or tutoring');
    }
    
    // Calculate metadata
    const totalTimeSpent = responses.reduce((sum, r) => sum + r.timeSpent, 0);
    const averageResponseTime = responses.length > 0 ? totalTimeSpent / responses.length : 0;
    const completionRate = (responses.length / assessment.questions.length) * 100;
    
    // Calculate confidence-accuracy correlation
    const confidenceAccuracyPairs = responses.map(r => ({
      confidence: r.confidence,
      isCorrect: r.isCorrect ? 1 : 0
    }));
    
    let confidenceAccuracyCorrelation = 0;
    if (confidenceAccuracyPairs.length > 1) {
      // Simple correlation calculation
      const confidenceSum = confidenceAccuracyPairs.reduce((sum, p) => sum + p.confidence, 0);
      const correctnessSum = confidenceAccuracyPairs.reduce((sum, p) => sum + p.isCorrect, 0);
      const confidenceMean = confidenceSum / confidenceAccuracyPairs.length;
      const correctnessMean = correctnessSum / confidenceAccuracyPairs.length;
      
      let numerator = 0;
      let confidenceVariance = 0;
      let correctnessVariance = 0;
      
      for (const pair of confidenceAccuracyPairs) {
        const confidenceDiff = pair.confidence - confidenceMean;
        const correctnessDiff = pair.isCorrect - correctnessMean;
        numerator += confidenceDiff * correctnessDiff;
        confidenceVariance += confidenceDiff * confidenceDiff;
        correctnessVariance += correctnessDiff * correctnessDiff;
      }
      
      const denominator = Math.sqrt(confidenceVariance * correctnessVariance);
      confidenceAccuracyCorrelation = denominator > 0 ? numerator / denominator : 0;
    }
    
    // Create the diagnostic result
    const result: DiagnosticResult = {
      id: uuidv4(),
      studentId,
      assessmentId: assessment.id,
      startTime: responses.length > 0 ? 
        new Date(Math.min(...responses.map(r => r.timestamp.getTime()))) : now,
      endTime: now,
      totalScore,
      maxPossibleScore,
      percentage,
      timeSpent: totalTimeSpent,
      responses,
      knowledgeAreaResults,
      skillResults,
      identifiedGaps,
      recommendations,
      nextSteps,
      overallProficiencyLevel,
      metadata: {
        averageResponseTime,
        completionRate,
        confidenceAccuracyCorrelation
      }
    };
    
    return result;
  }
  
  /**
   * Create or update a progress tracking record based on assessment results
   * @param result The diagnostic result to use for updating progress
   * @returns The updated progress tracking record
   */
  async updateProgressTracking(result: DiagnosticResult): Promise<ProgressTrackingRecord[]> {
    console.log(`Updating progress tracking for student ${result.studentId}`);
    
    const progressRecords: ProgressTrackingRecord[] = [];
    
    // Update progress for each knowledge area
    for (const kaResult of result.knowledgeAreaResults) {
      // In a real implementation, this would fetch existing record from database
      // For now, we'll create a new one
      const progressRecord: ProgressTrackingRecord = {
        id: uuidv4(),
        studentId: result.studentId,
        knowledgeAreaId: kaResult.knowledgeAreaId,
        assessmentResults: [{
          assessmentId: result.assessmentId,
          resultId: result.id,
          date: result.endTime,
          score: kaResult.percentage,
          proficiencyLevel: kaResult.proficiencyLevel
        }],
        currentProficiencyLevel: kaResult.proficiencyLevel,
        progressTrend: 'not_enough_data', // Need multiple assessments for a trend
        growthRate: 0, // Need multiple assessments for growth rate
        lastUpdated: new Date(),
        targetProficiencyLevel: ProficiencyLevel.MASTERY,
        interventions: [],
        notes: []
      };
      
      progressRecords.push(progressRecord);
    }
    
    // Update progress for each skill
    for (const skillResult of result.skillResults) {
      // In a real implementation, this would fetch existing record from database
      // For now, we'll create a new one
      const progressRecord: ProgressTrackingRecord = {
        id: uuidv4(),
        studentId: result.studentId,
        knowledgeAreaId: '', // No specific knowledge area
        skillId: skillResult.skillId,
        assessmentResults: [{
          assessmentId: result.assessmentId,
          resultId: result.id,
          date: result.endTime,
          score: skillResult.percentage,
          proficiencyLevel: skillResult.proficiencyLevel
        }],
        currentProficiencyLevel: skillResult.proficiencyLevel,
        progressTrend: 'not_enough_data', // Need multiple assessments for a trend
        growthRate: 0, // Need multiple assessments for growth rate
        lastUpdated: new Date(),
        targetProficiencyLevel: ProficiencyLevel.MASTERY,
        interventions: [],
        notes: []
      };
      
      progressRecords.push(progressRecord);
    }
    
    return progressRecords;
  }
  
  /**
   * Create spaced repetition schedules for knowledge areas that need reinforcement
   * @param result The diagnostic result to use for creating schedules
   * @returns The created spaced repetition schedules
   */
  async createSpacedRepetitionSchedules(result: DiagnosticResult): Promise<SpacedRepetitionSchedule[]> {
    console.log(`Creating spaced repetition schedules for student ${result.studentId}`);
    
    const schedules: SpacedRepetitionSchedule[] = [];
    
    // Create schedules for knowledge areas that need reinforcement
    for (const kaResult of result.knowledgeAreaResults) {
      // Only create schedules for areas that need improvement
      if (kaResult.proficiencyLevel !== ProficiencyLevel.MASTERY && 
          kaResult.proficiencyLevel !== ProficiencyLevel.EXCEEDING) {
        
        const now = new Date();
        const schedule: SpacedRepetitionSchedule = {
          id: uuidv4(),
          studentId: result.studentId,
          knowledgeAreaId: kaResult.knowledgeAreaId,
          initialAssessmentId: result.assessmentId,
          initialProficiencyLevel: kaResult.proficiencyLevel,
          repetitionIntervals: this.generateRepetitionIntervals(kaResult.proficiencyLevel, now),
          algorithm: 'sm2',
          algorithmParameters: {
            easeFactor: 2.5,
            intervalModifier: 1.0,
            failureSetback: 0.5
          },
          status: 'active',
          createdAt: now,
          updatedAt: now
        };
        
        schedules.push(schedule);
      }
    }
    
    return schedules;
  }
  
  /**
   * Generate repetition intervals based on proficiency level and spaced repetition principles
   * @param proficiencyLevel The current proficiency level
   * @param startDate The start date for the schedule
   * @returns Array of repetition intervals
   */
  private generateRepetitionIntervals(
    proficiencyLevel: ProficiencyLevel,
    startDate: Date
  ): SpacedRepetitionSchedule['repetitionIntervals'] {
    const intervals: SpacedRepetitionSchedule['repetitionIntervals'] = [];
    
    // Base intervals in days, adjusted by proficiency level
    let baseIntervals: number[];
    
    switch (proficiencyLevel) {
      case ProficiencyLevel.NEEDS_SUPPORT:
        baseIntervals = [1, 2, 4, 7, 14, 30];
        break;
      case ProficiencyLevel.DEVELOPING:
        baseIntervals = [2, 4, 8, 15, 30, 60];
        break;
      case ProficiencyLevel.APPROACHING:
        baseIntervals = [3, 7, 14, 30, 60, 90];
        break;
      case ProficiencyLevel.MEETING:
        baseIntervals = [5, 10, 21, 45, 90, 180];
        break;
      default:
        baseIntervals = [3, 7, 14, 30, 60, 90]; // Default intervals
    }
    
    // Generate scheduled dates based on intervals
    let cumulativeDays = 0;
    
    for (let i = 0; i < baseIntervals.length; i++) {
      cumulativeDays += baseIntervals[i];
      
      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(startDate.getDate() + cumulativeDays);
      
      intervals.push({
        repetitionNumber: i + 1,
        intervalDays: baseIntervals[i],
        scheduledDate,
        completed: false
      });
    }
    
    return intervals;
  }
  
  /**
   * Calculate proficiency level based on percentage score
   * @param percentage The percentage score
   * @returns The corresponding proficiency level
   */
  private calculateProficiencyLevel(percentage: number): ProficiencyLevel {
    if (percentage >= 90) {
      return ProficiencyLevel.MASTERY;
    } else if (percentage >= 80) {
      return ProficiencyLevel.EXCEEDING;
    } else if (percentage >= 70) {
      return ProficiencyLevel.MEETING;
    } else if (percentage >= 60) {
      return ProficiencyLevel.APPROACHING;
    } else if (percentage >= 40) {
      return ProficiencyLevel.DEVELOPING;
    } else {
      return ProficiencyLevel.NEEDS_SUPPORT;
    }
  }
  
  /**
   * Get age range for a UK key stage
   * @param keyStage The key stage
   * @returns The corresponding age range [min, max]
   */
  private getAgeRangeForKeyStage(keyStage: UKKeyStage): [number, number] {
    switch (keyStage) {
      case UKKeyStage.EYFS:
        return [3, 5];
      case UKKeyStage.KS1:
        return [5, 7];
      case UKKeyStage.KS2:
        return [7, 11];
      case UKKeyStage.KS3:
        return [11, 14];
      case UKKeyStage.KS4:
        return [14, 16];
      case UKKeyStage.KS5:
        return [16, 18];
      default:
        return [5, 18]; // Default range
    }
  }
}
