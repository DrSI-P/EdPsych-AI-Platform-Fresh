/**
 * Type definitions for predictive analytics models
 */

export type PredictionModel = 'learning_gap' | 'progress_forecast' | 'intervention_recommendation';

export interface PredictionResult {
  id: string;
  studentId: string;
  timestamp: string;
  modelType: PredictionModel;
  confidenceLevel: ConfidenceLevel;
}

export interface LearningGapPrediction extends PredictionResult {
  subjectId: string;
  topicId: string;
  conceptId: string;
  gapProbability: number; // 0-1 scale
  expectedTimeframe: {
    weeks: number;
    description: string;
  };
  relatedConcepts: string[];
  curriculumStandards: CurriculumStandard[];
}

export interface ProgressForecast extends PredictionResult {
  subjectId: string;
  currentLevel: string;
  forecastedLevel: string;
  timeframe: number; // weeks
  probabilityDistribution: {
    level: string;
    probability: number;
  }[];
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  factors: {
    name: string;
    impact: number; // -1 to 1 scale
    description: string;
  }[];
}

export interface InterventionRecommendation extends PredictionResult {
  targetGap: LearningGapPrediction;
  recommendationType: 'resource' | 'activity' | 'teaching_strategy' | 'support';
  recommendationId: string;
  title: string;
  description: string;
  expectedImpact: number; // 0-1 scale
  alignedWithLearningStyle: boolean;
  timeRequired: {
    minutes: number;
    description: string;
  };
  implementationSteps: string[];
}

export interface StudentData {
  id: string;
  assessments: AssessmentResult[];
  activities: LearningActivity[];
  learningStyle: LearningStyle;
  preferences: {
    [key: string]: any;
  };
  specialNeeds: string[];
}

export interface AssessmentResult {
  id: string;
  type: string;
  subject: string;
  topic: string;
  score: number;
  maxScore: number;
  date: string;
  duration: number; // minutes
  questions: {
    id: string;
    correct: boolean;
    timeSpent: number; // seconds
    attempts: number;
  }[];
}

export interface LearningActivity {
  id: string;
  type: string;
  subject: string;
  topic: string;
  startTime: string;
  duration: number; // minutes
  completed: boolean;
  engagement: number; // 0-1 scale
  interactions: number;
}

export interface CurriculumStandard {
  id: string;
  name: string;
  description: string;
  keyStage: string;
  subject: string;
  level: string;
}

export type LearningStyle = 'VISUAL' | 'AUDITORY' | 'KINESTHETIC' | 'READING_WRITING' | 'MULTIMODAL';

export interface ConfidenceLevel {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number; // 0-100
  factors: {
    dataQuantity: number;
    dataRecency: number;
    dataConsistency: string;
  };
  explanation: string;
}
