/**
 * Feedback Generator Service
 * 
 * This service implements evidence-based feedback generation for assessments,
 * based on educational psychology principles and research on effective feedback.
 */

import {
  Question,
  AssessmentResult,
  FeedbackGenerator,
  UKSubject,
  CognitiveDomain
} from './types';

/**
 * Implementation of the Feedback Generator
 * 
 * This class provides methods for generating personalized, actionable feedback
 * based on assessment results, following evidence-based principles from educational
 * psychology research.
 */
export class FeedbackGeneratorService implements FeedbackGenerator {
  /**
   * Generate feedback for a specific question response
   * 
   * This implements research-based principles for effective feedback:
   * - Specific and focused on the task
   * - Provides guidance for improvement
   * - Avoids comparisons with other students
   * - Emphasizes effort and strategy over ability
   * 
   * @param question The question that was answered
   * @param response The student's response
   * @param correct Whether the response was correct
   * @returns Personalized feedback text
   */
  generateQuestionFeedback(question: Question, response: any, correct: boolean): string {
    // If the question has specific feedback defined, use that
    if (question.feedback) {
      if (correct && question.feedback.correct) {
        return question.feedback.correct;
      } else if (!correct && question.feedback.incorrect) {
        return question.feedback.incorrect;
      } else if (question.feedback.general) {
        return question.feedback.general;
      }
    }
    
    // Generate feedback based on question type and cognitive domain
    if (correct) {
      return this.generatePositiveFeedback(question);
    } else {
      return this.generateConstructiveFeedback(question);
    }
  }
  
  /**
   * Generate comprehensive feedback for an assessment result
   * 
   * This implements the principles of formative assessment by:
   * - Identifying specific strengths and areas for improvement
   * - Providing actionable next steps
   * - Connecting performance to learning objectives
   * - Supporting metacognitive reflection
   * 
   * @param result The assessment result
   * @returns Structured feedback object
   */
  generateAssessmentFeedback(result: AssessmentResult): {
    overall: string;
    byTopic: Record<string, string>;
    nextSteps: string[];
  } {
    // Generate overall feedback
    const overall = this.generateOverallFeedback(result);
    
    // Generate topic-specific feedback
    const byTopic: Record<string, string> = {};
    
    // Group questions by topic
    const topicGroups: Record<string, {
      correct: number;
      total: number;
      questions: Array<{
        questionId: string;
        correct: boolean;
        cognitiveDomain: CognitiveDomain;
      }>;
    }> = {};
    
    // Mock implementation - in a real system, we would have topic data for each question
    // For now, we'll create some example topics
    const mockTopics = ['Number', 'Algebra', 'Geometry', 'Statistics'];
    
    for (const questionResult of result.questionResults) {
      // Assign to a mock topic for demonstration
      const topicIndex = Math.floor(Math.random() * mockTopics.length);
      const topic = mockTopics[topicIndex];
      
      if (!topicGroups[topic]) {
        topicGroups[topic] = {
          correct: 0,
          total: 0,
          questions: []
        };
      }
      
      topicGroups[topic].total++;
      if (questionResult.correct) {
        topicGroups[topic].correct++;
      }
      
      topicGroups[topic].questions.push({
        questionId: questionResult.questionId,
        correct: questionResult.correct,
        cognitiveDomain: questionResult.cognitiveDomain
      });
    }
    
    // Generate feedback for each topic
    for (const [topic, data] of Object.entries(topicGroups)) {
      const percentage = (data.correct / data.total) * 100;
      
      if (percentage >= 80) {
        byTopic[topic] = `Strong understanding of ${topic}. You correctly answered ${data.correct} out of ${data.total} questions.`;
      } else if (percentage >= 60) {
        byTopic[topic] = `Good progress in ${topic}. You correctly answered ${data.correct} out of ${data.total} questions. Continue practicing to strengthen your understanding.`;
      } else {
        byTopic[topic] = `More practise needed in ${topic}. You correctly answered ${data.correct} out of ${data.total} questions. Focus on building your foundational knowledge in this area.`;
      }
    }
    
    // Generate next steps
    const nextSteps = this.generateNextSteps(result);
    
    return {
      overall,
      byTopic,
      nextSteps
    };
  }
  
  /**
   * Generate feedback on student progress over time
   * 
   * This implements principles of learning analytics and growth mindset by:
   * - Highlighting patterns of improvement
   * - Identifying consistent strengths and challenges
   * - Providing targeted recommendations
   * - Encouraging persistence and effort
   * 
   * @param studentId The student's ID
   * @param subject The subject area
   * @param timeframe The time period to analyse
   * @returns Structured progress feedback
   */
  async generateProgressFeedback(
    studentId: string,
    subject: UKSubject,
    timeframe: 'week' | 'month' | 'term' | 'year'
  ): Promise<{
    summary: string;
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
  }> {
    // In a real implementation, this would analyse the student's assessment history
    // For now, we'll return mock data
    
    return {
      summary: `Over the past ${timeframe}, you've shown consistent engagement with ${subject} assessments. Your overall performance shows improvement in problem-solving skills.`,
      strengths: [
        'Consistent performance in applying mathematical concepts',
        'Strong analytical skills when interpreting data',
        'Good progress in explaining mathematical reasoning'
      ],
      areasForImprovement: [
        'More practise needed with complex algebraic expressions',
        'Continue developing skills in geometric proofs',
        'Work on time management during assessments'
      ],
      recommendations: [
        'Review the interactive lessons on algebraic expressions',
        'Practise with the geometry visualisation tools',
        'Try the timed practise assessments to build speed and accuracy'
      ]
    };
  }
  
  /**
   * Generate positive feedback for a correct response
   * 
   * @param question The question that was answered correctly
   * @returns Positive feedback text
   */
  private generatePositiveFeedback(question: Question): string {
    // Vary feedback based on cognitive domain to reinforce specific skills
    switch (question.cognitiveDomain) {
      case CognitiveDomain.REMEMBER:
        return 'Well done! You\'ve successfully recalled this information.';
      case CognitiveDomain.UNDERSTAND:
        return 'Excellent! You\'ve demonstrated good understanding of this concept.';
      case CognitiveDomain.APPLY:
        return 'Great job! You\'ve successfully applied the concept to solve this problem.';
      case CognitiveDomain.Analyse:
        return 'Excellent analysis! You\'ve broken down the problem effectively.';
      case CognitiveDomain.EVALUATE:
        return 'Strong critical thinking! You\'ve evaluated the situation correctly.';
      case CognitiveDomain.CREATE:
        return 'Impressive creativity! You\'ve developed an effective solution.';
      default:
        return 'Correct! Well done.';
    }
  }
  
  /**
   * Generate constructive feedback for an incorrect response
   * 
   * @param question The question that was answered incorrectly
   * @returns Constructive feedback text
   */
  private generateConstructiveFeedback(question: Question): string {
    // Vary feedback based on cognitive domain to provide targeted guidance
    switch (question.cognitiveDomain) {
      case CognitiveDomain.REMEMBER:
        return 'This requires recalling specific information. Try reviewing your notes on this topic.';
      case CognitiveDomain.UNDERSTAND:
        return 'This concept might need more review. Try looking at examples that explain how this works.';
      case CognitiveDomain.APPLY:
        return 'When applying this concept, remember to follow the key steps in the process.';
      case CognitiveDomain.Analyse:
        return 'For analysis questions, try breaking down the problem into smaller parts first.';
      case CognitiveDomain.EVALUATE:
        return 'When evaluating, consider multiple perspectives and criteria before making a judgment.';
      case CognitiveDomain.CREATE:
        return 'Creative problems often benefit from brainstorming multiple approaches before selecting one.';
      default:
        return 'Not quite right. Review this topic and try again.';
    }
  }
  
  /**
   * Generate overall feedback for an assessment result
   * 
   * @param result The assessment result
   * @returns Overall feedback text
   */
  private generateOverallFeedback(result: AssessmentResult): string {
    const { percentage, passed } = result;
    
    // Generate feedback based on performance level
    if (percentage >= 90) {
      return `Excellent work! You scored ${percentage.toFixed(1)}%, demonstrating a strong understanding of the material. Your performance shows particular strength in ${result.analytics.strengths[0] || 'multiple areas'}.`;
    } else if (percentage >= 80) {
      return `Very good work! You scored ${percentage.toFixed(1)}%, showing good mastery of most concepts. Continue building on your strengths in ${result.analytics.strengths[0] || 'key areas'}.`;
    } else if (percentage >= 70) {
      return `Good effort! You scored ${percentage.toFixed(1)}%, demonstrating solid understanding of many concepts. Focus on strengthening your knowledge in ${result.analytics.areasForImprovement[0] || 'areas where you had difficulty'}.`;
    } else if (percentage >= 60) {
      return `You've passed with a score of ${percentage.toFixed(1)}%. While you've demonstrated understanding of some key concepts, there are important areas to improve, particularly in ${result.analytics.areasForImprovement[0] || 'several topics'}.`;
    } else {
      return `You scored ${percentage.toFixed(1)}%. This assessment has identified some important areas for further study, especially in ${result.analytics.areasForImprovement[0] || 'several key topics'}. Don't be discouraged - use this feedback to focus your learning.`;
    }
  }
  
  /**
   * Generate next steps based on assessment results
   * 
   * @param result The assessment result
   * @returns Array of next step recommendations
   */
  private generateNextSteps(result: AssessmentResult): string[] {
    const nextSteps: string[] = [];
    
    // Add general next step based on overall performance
    if (result.percentage >= 80) {
      nextSteps.push('Challenge yourself with more advanced material to extend your learning.');
    } else if (result.percentage >= 60) {
      nextSteps.push('Review the topics where you had difficulty and practise with similar questions.');
    } else {
      nextSteps.push('Focus on building your foundational understanding of the core concepts.');
    }
    
    // Add specific next steps based on cognitive domains
    
    // Identify domains with lower performance
    const weakDomains: CognitiveDomain[] = [];
    
    for (const [domain, data] of Object.entries(result.analytics.byCognitiveDomain)) {
      if (data.percentage < 60 && data.count > 0) {
        weakDomains.push(domain as CognitiveDomain);
      }
    }
    
    // Add domain-specific recommendations
    for (const domain of weakDomains) {
      switch (domain) {
        case CognitiveDomain.REMEMBER:
          nextSteps.push('Practise with flashcards or memory aids to strengthen recall of key facts and definitions.');
          break;
        case CognitiveDomain.UNDERSTAND:
          nextSteps.push('Review explanations and examples to deepen your understanding of core concepts.');
          break;
        case CognitiveDomain.APPLY:
          nextSteps.push('Work through practise problems that require applying concepts in different contexts.');
          break;
        case CognitiveDomain.Analyse:
          nextSteps.push('Practise breaking down complex problems into smaller, manageable parts.');
          break;
        case CognitiveDomain.EVALUATE:
          nextSteps.push('Develop your critical thinking by comparing different approaches and solutions.');
          break;
        case CognitiveDomain.CREATE:
          nextSteps.push('Try open-ended problems that allow you to develop and test your own solutions.');
          break;
      }
    }
    
    // Add a metacognitive reflection prompt
    nextSteps.push('Reflect on your approach to this assessment. What strategies worked well, and what might you change next time?');
    
    return nextSteps;
  }
}
