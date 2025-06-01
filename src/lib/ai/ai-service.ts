'use client';

import { useState, useEffect } from 'react';

// Define interfaces for AI service responses
interface TextGenerationResponse {
  text: string;
  metadata: {
    model: string;
    tokens: number;
    timestamp: string;
  };
}

interface SentimentAnalysisResponse {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  details: {
    positiveScore: number;
    negativeScore: number;
    neutralScore: number;
  };
}

interface EducationalContentResponse {
  content: string;
  metadata: {
    topic: string;
    ageGroup: string;
    format: string;
    timestamp: string;
  };
}

interface OpenEndedAnswerEvaluationParams {
  question: string;
  expectedAnswer: string;
  studentAnswer: string;
  maxScore: number;
}

interface OpenEndedAnswerEvaluationResponse {
  score: number;
  feedback: string;
  matchRatio: number;
  maxScore: number;
}

interface AIServiceOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: string };
  [key: string]: any;
}

// Server-side AI service function for API routes
export function getAIService() {
  return {
    // Generate text using AI
    generateText: async (prompt: string, options: AIServiceOptions = {}): Promise<TextGenerationResponse> => {
      try {
        // In a real implementation, this would call an actual AI service
        console.log('Server: Generating text for prompt:', prompt, 'with options:', options);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          text: `AI-generated response for: ${prompt}`,
          metadata: {
            model: options.model || 'default',
            tokens: Math.floor(Math.random() * 100) + 50,
            timestamp: new Date().toISOString()
          }
        };
      } catch (error) {
        console.error('Error generating text:', error);
        throw error;
      }
    },
    
    // Analyse sentiment of text
    analyzeSentiment: async (text: string): Promise<SentimentAnalysisResponse> => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simple mock sentiment analysis
        const words = text.toLowerCase().split(' ');
        const positiveWords = ['good', 'great', 'excellent', 'happy', 'positive', 'like', 'love'];
        const negativeWords = ['bad', 'poor', 'terrible', 'sad', 'negative', 'dislike', 'hate'];
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        words.forEach(word => {
          if (positiveWords.includes(word)) positiveCount++;
          if (negativeWords.includes(word)) negativeCount++;
        });
        
        let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
        if (positiveCount > negativeCount) sentiment = 'positive';
        if (negativeCount > positiveCount) sentiment = 'negative';
        
        return {
          sentiment,
          confidence: 0.7,
          details: {
            positiveScore: positiveCount / words.length,
            negativeScore: negativeCount / words.length,
            neutralScore: 1 - ((positiveCount + negativeCount) / words.length)
          }
        };
      } catch (error) {
        console.error('Error analysing sentiment:', error);
        throw error;
      }
    },
    
    // Generate educational content
    generateEducationalContent: async (topic: string, ageGroup: string, format: string): Promise<EducationalContentResponse> => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
          content: `Educational content about ${topic} for ${ageGroup} in ${format} format.`,
          metadata: {
            topic,
            ageGroup,
            format,
            timestamp: new Date().toISOString()
          }
        };
      } catch (error) {
        console.error('Error generating educational content:', error);
        throw error;
      }
    },
    
    // Evaluate open-ended answer
    evaluateOpenEndedAnswer: async (params: OpenEndedAnswerEvaluationParams): Promise<OpenEndedAnswerEvaluationResponse> => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const { question, expectedAnswer, studentAnswer, maxScore } = params;
        
        // Simple mock evaluation logic
        const keywords = expectedAnswer.toLowerCase().split(' ');
        const studentWords = studentAnswer.toLowerCase().split(' ');
        
        // Count matching keywords
        let matchCount = 0;
        keywords.forEach(keyword => {
          if (studentWords.includes(keyword)) matchCount++;
        });
        
        // Calculate score based on keyword matches
        const matchRatio = keywords.length > 0 ? matchCount / keywords.length : 0;
        const score = Math.round(matchRatio * maxScore);
        
        // Generate feedback based on score
        let feedback = '';
        if (score >= maxScore * 0.8) {
          feedback = "Excellent answer! You've covered all the key points.";
        } else if (score >= maxScore * 0.6) {
          feedback = "Good answer, but you could expand on some key concepts.";
        } else if (score >= maxScore * 0.4) {
          feedback = "Your answer addresses some points but misses important concepts.";
        } else {
          feedback = "Your answer needs improvement. Review the material and try again.";
        }
        
        return {
          score,
          feedback,
          matchRatio,
          maxScore
        };
      } catch (error) {
        console.error('Error evaluating open-ended answer:', error);
        throw error;
      }
    }
  };
}

// Custom hook for using AI service in components
export function useAIService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Generate text using AI
  const generateText = async (prompt: string, options: AIServiceOptions = {}): Promise<TextGenerationResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.generateText(prompt, options);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      throw err;
    }
  };
  
  // Analyse sentiment of text
  const analyzeSentiment = async (text: string): Promise<SentimentAnalysisResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.analyzeSentiment(text);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      throw err;
    }
  };
  
  // Generate educational content
  const generateEducationalContent = async (topic: string, ageGroup: string, format: string): Promise<EducationalContentResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.generateEducationalContent(topic, ageGroup, format);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      throw err;
    }
  };
  
  // Evaluate open-ended answer
  const evaluateOpenEndedAnswer = async (params: OpenEndedAnswerEvaluationParams): Promise<OpenEndedAnswerEvaluationResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.evaluateOpenEndedAnswer(params);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      throw err;
    }
  };
  
  return {
    isLoading,
    error,
    generateText,
    analyzeSentiment,
    generateEducationalContent,
    evaluateOpenEndedAnswer
  };
}

// AI service for handling AI-related operations
export const aiService = {
  // Generate text using AI
  generateText: async (prompt: string, options: AIServiceOptions = {}): Promise<TextGenerationResponse> => {
    try {
      // In a real implementation, this would call an actual AI service
      // For now, we'll return a mock response
      console.log('Generating text for prompt:', prompt, 'with options:', options);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        text: `AI-generated response for: ${prompt}`,
        metadata: {
          model: options.model || 'default',
          tokens: Math.floor(Math.random() * 100) + 50,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  },
  
  // Analyse sentiment of text
  analyzeSentiment: async (text: string): Promise<SentimentAnalysisResponse> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple mock sentiment analysis
      const words = text.toLowerCase().split(' ');
      const positiveWords = ['good', 'great', 'excellent', 'happy', 'positive', 'like', 'love'];
      const negativeWords = ['bad', 'poor', 'terrible', 'sad', 'negative', 'dislike', 'hate'];
      
      let positiveCount = 0;
      let negativeCount = 0;
      
      words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
      });
      
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (positiveCount > negativeCount) sentiment = 'positive';
      if (negativeCount > positiveCount) sentiment = 'negative';
      
      return {
        sentiment,
        confidence: 0.7,
        details: {
          positiveScore: positiveCount / words.length,
          negativeScore: negativeCount / words.length,
          neutralScore: 1 - ((positiveCount + negativeCount) / words.length)
        }
      };
    } catch (error) {
      console.error('Error analysing sentiment:', error);
      throw error;
    }
  },
  
  // Generate educational content
  generateEducationalContent: async (topic: string, ageGroup: string, format: string): Promise<EducationalContentResponse> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        content: `Educational content about ${topic} for ${ageGroup} in ${format} format.`,
        metadata: {
          topic,
          ageGroup,
          format,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error generating educational content:', error);
      throw error;
    }
  },
  
  // Evaluate open-ended answer
  evaluateOpenEndedAnswer: async (params: OpenEndedAnswerEvaluationParams): Promise<OpenEndedAnswerEvaluationResponse> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const { question, expectedAnswer, studentAnswer, maxScore } = params;
      
      // Simple mock evaluation logic
      const keywords = expectedAnswer.toLowerCase().split(' ');
      const studentWords = studentAnswer.toLowerCase().split(' ');
      
      // Count matching keywords
      let matchCount = 0;
      keywords.forEach(keyword => {
        if (studentWords.includes(keyword)) matchCount++;
      });
      
      // Calculate score based on keyword matches
      const matchRatio = keywords.length > 0 ? matchCount / keywords.length : 0;
      const score = Math.round(matchRatio * maxScore);
      
      // Generate feedback based on score
      let feedback = '';
      if (score >= maxScore * 0.8) {
        feedback = "Excellent answer! You've covered all the key points.";
      } else if (score >= maxScore * 0.6) {
        feedback = "Good answer, but you could expand on some key concepts.";
      } else if (score >= maxScore * 0.4) {
        feedback = "Your answer addresses some points but misses important concepts.";
      } else {
        feedback = "Your answer needs improvement. Review the material and try again.";
      }
      
      return {
        score,
        feedback,
        matchRatio,
        maxScore
      };
    } catch (error) {
      console.error('Error evaluating open-ended answer:', error);
      throw error;
    }
  }
};

export default aiService;
