// Learning analytics and adaptive content utilities for EdPsych-AI-Education-Platform
// Provides comprehensive learning style detection, progress tracking, and content adaptation

import { useEffect, useState } from 'react';

/**
 * Learning styles based on VARK model
 * (Visual, Auditory, Reading/Writing, Kinesthetic)
 */
export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  READING_WRITING = 'reading_writing',
  KINESTHETIC = 'kinesthetic',
  MULTIMODAL = 'multimodal'
}

/**
 * Learning pace categories
 */
export enum LearningPace {
  ACCELERATED = 'accelerated',
  STANDARD = 'standard',
  DELIBERATE = 'deliberate',
  CUSTOM = 'custom'
}

/**
 * Difficulty levels
 */
export enum DifficultyLevel {
  INTRODUCTORY = 'introductory',
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

/**
 * Interest categories for personalization
 */
export enum InterestCategory {
  SCIENCE = 'science',
  TECHNOLOGY = 'technology',
  ENGINEERING = 'engineering',
  ARTS = 'arts',
  MATHEMATICS = 'mathematics',
  HISTORY = 'history',
  LITERATURE = 'literature',
  MUSIC = 'music',
  SPORTS = 'sports',
  NATURE = 'nature'
}

/**
 * Learning goal types
 */
export enum LearningGoalType {
  KNOWLEDGE_ACQUISITION = 'knowledge_acquisition',
  SKILL_DEVELOPMENT = 'skill_development',
  PROBLEM_SOLVING = 'problem_solving',
  CREATIVE_EXPRESSION = 'creative_expression',
  CERTIFICATION = 'certification',
  PERSONAL_GROWTH = 'personal_growth'
}

/**
 * Learning activity types
 */
export enum LearningActivityType {
  VIDEO = 'video',
  READING = 'reading',
  INTERACTIVE = 'interactive',
  QUIZ = 'quiz',
  DISCUSSION = 'discussion',
  PROJECT = 'project',
  GAME = 'game',
  SIMULATION = 'simulation',
  ASSESSMENT = 'assessment',
  REFLECTION = 'reflection'
}

/**
 * Learning progress status
 */
export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  MASTERED = 'mastered',
  NEEDS_REVIEW = 'needs_review'
}

/**
 * User learning profile
 */
export interface LearningProfile {
  userId: string;
  primaryLearningStyle: LearningStyle;
  secondaryLearningStyle?: LearningStyle;
  learningPace: LearningPace;
  preferredDifficulty: DifficultyLevel;
  interests: string[];
  goals: {
    type: LearningGoalType;
    description: string;
    targetDate?: Date;
  }[];
  strengths: string[];
  areasForImprovement: string[];
  adaptations?: {
    dyslexia?: boolean;
    adhd?: boolean;
    visualImpairment?: boolean;
    hearingImpairment?: boolean;
    motorSkillChallenges?: boolean;
    other?: string[];
  }
  preferredActivities: LearningActivityType[];
  lastUpdated: Date;
}

/**
 * Learning module metadata
 */
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // in minutes
  prerequisites: string[];
  learningOutcomes: string[];
  keywords: string[];
  categories: string[];
  relatedInterests: InterestCategory[];
  activities: {
    id: string;
    type: LearningActivityType;
    title: string;
    description: string;
    duration: number; // in minutes
    optional: boolean;
  }[];
  assessments: {
    id: string;
    title: string;
    description: string;
    passingScore: number;
  }[];
  adaptiveContent: {
    visual: string[];
    auditory: string[];
    readingWriting: string[];
    kinesthetic: string[];
  }
}

/**
 * User progress on a learning module
 */
export interface ModuleProgress {
  userId: string;
  moduleId: string;
  startDate: Date;
  lastAccessDate: Date;
  completedActivities: string[];
  assessmentResults: {
    assessmentId: string;
    attempts: number;
    bestScore: number;
    lastCompletionDate: Date;
    passed: boolean;
  }[];
  timeSpent: number; // in minutes
  completionPercentage: number;
  status: ProgressStatus;
  notes: string;
  adaptations: {
    contentStyle: LearningStyle;
    paceModifier: number; // 1.0 is standard, <1 is faster, >1 is slower
    difficultyAdjustment: number; // 0 is standard, negative is easier, positive is harder
  }
}

/**
 * Learning achievement
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  criteria: string;
  dateEarned?: Date;
  progress?: number; // 0-100
  category: 'completion' | 'mastery' | 'engagement' | 'milestone' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

/**
 * Learning recommendation
 */
export interface LearningRecommendation {
  moduleId: string;
  title: string;
  description: string;
  relevanceScore: number; // 0-100
  reasonForRecommendation: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // in minutes
  matchesInterests: InterestCategory[];
  matchesGoals: LearningGoalType[];
  prerequisites: {
    moduleId: string;
    title: string;
    completed: boolean;
  }[];
}

/**
 * Learning style assessment question
 */
export interface LearningStyleQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    style: LearningStyle;
  }[];
}

/**
 * Learning style assessment result
 */
export interface LearningStyleResult {
  visual: number; // 0-100
  auditory: number; // 0-100
  readingWriting: number; // 0-100
  kinesthetic: number; // 0-100
  primaryStyle: LearningStyle;
  secondaryStyle?: LearningStyle;
  isMultimodal: boolean;
}

// Sample learning style assessment questions
const LEARNING_STYLE_QUESTIONS: LearningStyleQuestion[] = [
  {
    id: 'q1',
    question: 'When learning a new skill, I prefer to:',
    options: [
      { text: 'Watch a demonstration or video', style: LearningStyle.VISUAL },
      { text: 'Listen to detailed instructions', style: LearningStyle.AUDITORY },
      { text: 'Read step-by-step instructions', style: LearningStyle.READING_WRITING },
      { text: 'Try it out and learn through practise', style: LearningStyle.KINESTHETIC }
    ]
  },
  {
    id: 'q2',
    question: 'When trying to remember information, I most easily recall:',
    options: [
      { text: 'Images, diagrams, and visual details', style: LearningStyle.VISUAL },
      { text: 'Discussions, lectures, and what was said', style: LearningStyle.AUDITORY },
      { text: 'Written notes and text I\'ve read', style: LearningStyle.READING_WRITING },
      { text: 'Activities and experiences I\'ve done', style: LearningStyle.KINESTHETIC }
    ]
  },
  {
    id: 'q3',
    question: 'When explaining a concept to someone else, I tend to:',
    options: [
      { text: 'Draw a diagram or show images', style: LearningStyle.VISUAL },
      { text: 'Explain verbally with emphasis on key points', style: LearningStyle.AUDITORY },
      { text: 'Write out an explanation or provide written materials', style: LearningStyle.READING_WRITING },
      { text: 'Demonstrate through examples or hands-on activities', style: LearningStyle.KINESTHETIC }
    ]
  },
  {
    id: 'q4',
    question: 'When solving a problem, I prefer to:',
    options: [
      { text: 'Visualise the problem and possible solutions', style: LearningStyle.VISUAL },
      { text: 'Talk through the problem and solutions out loud', style: LearningStyle.AUDITORY },
      { text: 'Write down the problem and organise my thoughts in writing', style: LearningStyle.READING_WRITING },
      { text: 'Use a trial-and-error approach and physical manipulation', style: LearningStyle.KINESTHETIC }
    ]
  },
  {
    id: 'q5',
    question: 'When attending a class or presentation, I get the most out of:',
    options: [
      { text: 'Visual aids, charts, and demonstrations', style: LearningStyle.VISUAL },
      { text: 'Listening to the speaker and verbal discussions', style: LearningStyle.AUDITORY },
      { text: 'Reading handouts and taking detailed notes', style: LearningStyle.READING_WRITING },
      { text: 'Interactive activities and practical exercises', style: LearningStyle.KINESTHETIC }
    ]
  },
  {
    id: 'q6',
    question: 'When giving directions, I typically:',
    options: [
      { text: 'Draw a map or show pictures', style: LearningStyle.VISUAL },
      { text: 'Explain verbally with clear instructions', style: LearningStyle.AUDITORY },
      { text: 'Write down detailed directions', style: LearningStyle.READING_WRITING },
      { text: 'Walk or drive with the person to show them', style: LearningStyle.KINESTHETIC }
    ]
  },
  {
    id: 'q7',
    question: 'When learning from a website or app, I prefer:',
    options: [
      { text: 'Visual layouts with images, videos, and diagrams', style: LearningStyle.VISUAL },
      { text: 'Audio explanations, podcasts, or narrated content', style: LearningStyle.AUDITORY },
      { text: 'Text-based content with clear written explanations', style: LearningStyle.READING_WRITING },
      { text: 'Interactive elements that let me practise and apply concepts', style: LearningStyle.KINESTHETIC }
    ]
  },
  {
    id: 'q8',
    question: 'When remembering a past event, I most vividly recall:',
    options: [
      { text: 'What I saw and how things looked', style: LearningStyle.VISUAL },
      { text: 'What was said and the sounds I heard', style: LearningStyle.AUDITORY },
      { text: 'Notes I took or texts I read about it', style: LearningStyle.READING_WRITING },
      { text: 'What I did and how it felt physically', style: LearningStyle.KINESTHETIC }
    ]
  }
];

/**
 * Conduct a learning style assessment
 */
export const assessLearningStyle = (answers: Record<string, LearningStyle>): LearningStyleResult => {
  // Count occurrences of each learning style
  const counts: Record<LearningStyle, number> = {
    [LearningStyle.VISUAL]: 0,
    [LearningStyle.AUDITORY]: 0,
    [LearningStyle.READING_WRITING]: 0,
    [LearningStyle.KINESTHETIC]: 0,
    [LearningStyle.MULTIMODAL]: 0
  }
  
  // Tally the selected styles
  Object.values(answers).forEach(style => {
    counts[style]++;
  });
  
  // Calculate percentages
  const total = Object.values(counts).reduce((sum, count) => (sum) + count, 0);
  const percentages = {
    visual: Math.round((counts[LearningStyle.VISUAL] / total) * 100),
    auditory: Math.round((counts[LearningStyle.AUDITORY] / total) * 100),
    readingWriting: Math.round((counts[LearningStyle.READING_WRITING] / total) * 100),
    kinesthetic: Math.round((counts[LearningStyle.KINESTHETIC] / total) * 100)
  }
  
  // Determine primary and secondary styles
  const styles = [
    { style: LearningStyle.VISUAL, score: percentages.visual },
    { style: LearningStyle.AUDITORY, score: percentages.auditory },
    { style: LearningStyle.READING_WRITING, score: percentages.readingWriting },
    { style: LearningStyle.KINESTHETIC, score: percentages.kinesthetic }
  ].sort((a, b) => (b).score - a.score);
  
  const primaryStyle = styles[0].style;
  const secondaryStyle = styles[1].score > 20 ? styles[1].style : undefined;
  
  // Check if multimodal (no clear preference)
  const isMultimodal = styles[0].score - styles[1].score < 10;
  
  return {
    visual: percentages.visual,
    auditory: percentages.auditory,
    readingWriting: percentages.readingWriting,
    kinesthetic: percentages.kinesthetic,
    primaryStyle: isMultimodal ? LearningStyle.MULTIMODAL : primaryStyle,
    secondaryStyle: isMultimodal ? primaryStyle : secondaryStyle,
    isMultimodal
  }
}

/**
 * Get learning style assessment questions
 */
export const getLearningStyleQuestions = (): LearningStyleQuestion[] => {
  return LEARNING_STYLE_QUESTIONS;
}

/**
 * Track user progress on a module
 */
export const trackModuleProgress = (
  userId: string,
  moduleId: string,
  activityId?: string,
  assessmentResult?: {
    assessmentId: string;
    score: number;
    passed: boolean;
  },
  timeSpent?: number
): Promise<ModuleProgress> => {
  // In a real implementation, this would update the database
  // For now, we'll simulate with a delay and return mock data
  return new Promise(resolve => {
    setTimeout(() => {
      const progress: ModuleProgress = {
        userId,
        moduleId,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        lastAccessDate: new Date(),
        completedActivities: ['activity1', 'activity2'],
        assessmentResults: [],
        timeSpent: 120, // 2 hours
        completionPercentage: 65,
        status: ProgressStatus.IN_PROGRESS,
        notes: '',
        adaptations: {
          contentStyle: LearningStyle.VISUAL,
          paceModifier: 1.0,
          difficultyAdjustment: 0
        }
      }
      
      // Update with new activity if provided
      if (activityId) {
        progress.completedActivities.push(activityId);
        progress.completionPercentage = Math.min(
          100, 
          Math.round((progress.completedActivities.length / 5) * 100) // Assuming 5 activities total
        );
      }
      
      // Update with assessment result if provided
      if (assessmentResult) {
        progress.assessmentResults.push({
          assessmentId: assessmentResult.assessmentId,
          attempts: 1,
          bestScore: assessmentResult.score,
          lastCompletionDate: new Date(),
          passed: assessmentResult.passed
        });
        
        // Update status if all activities completed and assessment passed
        if (progress.completionPercentage === 100 && assessmentResult.passed) {
          progress.status = ProgressStatus.COMPLETED;
        }
      }
      
      // Update time spent if provided
      if (timeSpent) {
        progress.timeSpent += timeSpent;
      }
      
      resolve(progress);
    }, 100);
  });
}

/**
 * Get learning recommendations based on user profile and progress
 */
export const getLearningRecommendations = (
  userId: string,
  count: number = 3
): Promise<LearningRecommendation[]> => {
  // In a real implementation, this would query the database
  // For now, we'll simulate with a delay and return mock data
  return new Promise(resolve => {
    setTimeout(() => {
      const recommendations: LearningRecommendation[] = [
        {
          moduleId: 'module1',
          title: 'Introduction to Educational Psychology',
          description: 'Learn the fundamental principles of educational psychology and their applications in learning environments.',
          relevanceScore: 95,
          reasonForRecommendation: 'Matches your interest in psychology and education',
          difficulty: DifficultyLevel.BEGINNER,
          estimatedDuration: 120, // 2 hours
          matchesInterests: [InterestCategory.SCIENCE],
          matchesGoals: [LearningGoalType.KNOWLEDGE_ACQUISITION],
          prerequisites: []
        },
        {
          moduleId: 'module2',
          title: 'Cognitive Development in Children',
          description: 'Explore how cognitive abilities develop throughout childhood and adolescence.',
          relevanceScore: 88,
          reasonForRecommendation: 'Builds on your completed modules about child development',
          difficulty: DifficultyLevel.INTERMEDIATE,
          estimatedDuration: 180, // 3 hours
          matchesInterests: [InterestCategory.SCIENCE],
          matchesGoals: [LearningGoalType.KNOWLEDGE_ACQUISITION],
          prerequisites: [
            {
              moduleId: 'module1',
              title: 'Introduction to Educational Psychology',
              completed: true
            }
          ]
        },
        {
          moduleId: 'module3',
          title: 'Learning Styles and Differentiated Instruction',
          description: 'Discover how to adapt teaching methods to different learning styles and needs.',
          relevanceScore: 92,
          reasonForRecommendation: 'Aligns with your interest in personalized learning',
          difficulty: DifficultyLevel.INTERMEDIATE,
          estimatedDuration: 150, // 2.5 hours
          matchesInterests: [InterestCategory.EDUCATION],
          matchesGoals: [LearningGoalType.SKILL_DEVELOPMENT],
          prerequisites: [
            {
              moduleId: 'module1',
              title: 'Introduction to Educational Psychology',
              completed: true
            }
          ]
        }
      ];
      
      resolve(recommendations.slice(0, count));
    }, 100);
  });
}

/**
 * Get user achievements
 */
export const getUserAchievements = (userId: string): Promise<Achievement[]> => {
  // In a real implementation, this would query the database
  // For now, we'll simulate with a delay and return mock data
  return new Promise(resolve => {
    setTimeout(() => {
      const achievements: Achievement[] = [
        {
          id: 'achievement1',
          title: 'First Steps',
          description: 'Completed your first learning module',
          iconUrl: '/icons/achievements/first_steps.svg',
          criteria: 'Complete any learning module',
          dateEarned: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          category: 'completion',
          rarity: 'common'
        },
        {
          id: 'achievement2',
          title: 'Knowledge Seeker',
          description: 'Completed 5 learning modules',
          iconUrl: '/icons/achievements/knowledge_seeker.svg',
          criteria: 'Complete 5 learning modules',
          progress: 60, // 3 out of 5 completed
          category: 'milestone',
          rarity: 'uncommon'
        },
        {
          id: 'achievement3',
          title: 'Perfect Score',
          description: 'Achieved 100% on an assessment',
          iconUrl: '/icons/achievements/perfect_score.svg',
          criteria: 'Score 100% on any assessment',
          dateEarned: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          category: 'mastery',
          rarity: 'rare'
        }
      ];
      
      resolve(achievements);
    }, 100);
  });
}

/**
 * Get content adapted to user's learning style
 */
export const getAdaptedContent = (
  moduleId: string,
  learningStyle: LearningStyle,
  activityId: string
): Promise<string> => {
  // In a real implementation, this would query the database
  // For now, we'll simulate with a delay and return mock content
  return new Promise(resolve => {
    setTimeout(() => {
      const contentByStyle: Record<LearningStyle, string> = {
        [LearningStyle.VISUAL]: `
          <div class="visual-content">
            <h2>Visual Representation of Key Concepts</h2>
            <img src="/images/modules/${moduleId}/concept_map.svg" alt="Concept map" />
            <p>The diagram above illustrates the relationships between key concepts in this module.</p>
            <div class="video-container">
              <video controls>
                <source src="/videos/modules/${moduleId}/visual_explanation.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <h3>Colour-Coded Summary</h3>
            <ul class="colour-coded">
              <li class="primary">Primary concept: Educational Psychology Foundations</li>
              <li class="secondary">Secondary concept: Cognitive Development Stages</li>
              <li class="tertiary">Tertiary concept: Learning Environment Design</li>
            </ul>
          </div>
        `,
        [LearningStyle.AUDITORY]: `
          <div class="auditory-content">
            <h2>Audio Explanations of Key Concepts</h2>
            <p>Listen to the following audio explanations of the key concepts in this module:</p>
            <div class="audio-player">
              <h3>Introduction to Educational Psychology</h3>
              <audio controls>
                <source src="/audio/modules/${moduleId}/introduction.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            <div class="audio-player">
              <h3>Cognitive Development Theories</h3>
              <audio controls>
                <source src="/audio/modules/${moduleId}/cognitive_development.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            <div class="discussion-points">
              <h3>Discussion Points</h3>
              <p>Consider these questions as you listen:</p>
              <ul>>
                <li>>How do the different theories of cognitive development compare?</li>
                <li>>What implications do these theories have for educational practise?</li>
                <li>>How might you apply these concepts in a classroom setting?</li>
              </ul>
            </div>
          </div>
        `,
        [LearningStyle.READING_WRITING]: `
          <div class="reading-writing-content">
            <h2>Detailed Text Explanation of Key Concepts</h2>
            <article>>
              <h3>Introduction to Educational Psychology</h3>
              <p>Educational psychology is the branch of psychology concerned with the scientific study of human learning. The study of learning processes, from both cognitive and behavioural perspectives, allows researchers to understand individual differences in intelligence, cognitive development, affect, motivation, self-regulation, and self-concept, as well as their role in learning.</p>
              <p>The field of educational psychology relies heavily on quantitative methods, including testing and measurement, to enhance educational activities related to instructional design, classroom management, and assessment, which serve to facilitate learning processes in various educational settings across the lifespan.</p>
              
              <h3>Key Theories in Educational Psychology</h3>
              <p>Several key theories have shaped our understanding of how people learn:</p>
              <ol>>
                <li>><strong>>Behaviorism</strong>: Focuses on observable behaviors and how they are affected by external stimuli.</li>
                <li>><strong>>Cognitivism</strong>: Examines internal mental processes such as problem-solving, memory, and language.</li>
                <li>><strong>>Constructivism</strong>: Suggests that learners construct knowledge rather than merely receiving and storing information.</li>
                <li>><strong>>Social Learning Theory</strong>: Proposes that people learn from observing others.</li>
              </ol>
              
              <h3>Summary and Key Points</h3>
              <p>Educational psychology provides the foundation for understanding how students learn and develop. By applying psychological principles to educational settings, educators can improve teaching methods, enhance learning outcomes, and address individual differences among students.</p>
            </article>
            <div class="writing-prompts">
              <h3>Writing Prompts</h3>
              <p>Respond to the following prompts to reinforce your understanding:</p>
              <ol>>
                <li>>Summarize the key differences between behaviorism and cognitivism.</li>
                <li>>Explain how constructivist theory might influence classroom teaching methods.</li>
                <li>>Describe how you would apply social learning theory in an educational setting.</li>
              </ol>
            </div>
          </div>
        `,
        [LearningStyle.KINESTHETIC]: `
          <div class="kinesthetic-content">
            <h2>Interactive Learning Activities</h2>
            <div class="interactive-exercise">
              <h3>Hands-on Application Exercise</h3>
              <p>Complete the following interactive activities to apply the concepts you've learned:</p>
              <div class="activity-container">
                <button class="start-activity" data-activity="cognitive_mapping">Start Cognitive Mapping Exercise</button>
                <div class="activity-description">
                  <p>In this exercise, you'll create a physical or digital mind map of key educational psychology concepts and their relationships.</p>
                  <p>Materials needed: Paper and coloured pens, or a digital mind mapping tool.</p>
                </div>
              </div>
              <div class="activity-container">
                <button class="start-activity" data-activity="case_study_simulation">Start Case Study Simulation</button>
                <div class="activity-description">
                  <p>Work through a realistic classroom scenario where you'll apply educational psychology principles to solve challenges.</p>
                </div>
              </div>
            </div>
            <div class="role-play">
              <h3>Role-Play Scenario</h3>
              <p>With a partner or in a group, act out the following scenario:</p>
              <blockquote>>
                You are a teacher designing a lesson for a diverse classroom with students who have different learning preferences. Demonstrate how you would incorporate multiple approaches to accommodate various learning styles.
              </blockquote>
              <p>After completing the role-play, reflect on:</p>
              <ul>>
                <li>>Which strategies were most effective?</li>
                <li>>What challenges did you encounter?</li>
                <li>>How would you improve your approach in the future?</li>
              </ul>
            </div>
          </div>
        `,
        [LearningStyle.MULTIMODAL]: `
          <div class="multimodal-content">
            <h2>Multimodal Learning Experience</h2>
            <p>This content combines visual, auditory, reading/writing, and kinesthetic elements to provide a comprehensive learning experience.</p>
            
            <div class="visual-section">
              <h3>Visual Elements</h3>
              <img src="/images/modules/${moduleId}/concept_map.svg" alt="Concept map" />
              <p>The diagram above illustrates the relationships between key concepts in this module.</p>
            </div>
            
            <div class="auditory-section">
              <h3>Audio Explanation</h3>
              <audio controls>
                <source src="/audio/modules/${moduleId}/introduction.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            
            <div class="reading-section">
              <h3>Text Explanation</h3>
              <p>Educational psychology is the branch of psychology concerned with the scientific study of human learning. The study of learning processes, from both cognitive and behavioural perspectives, allows researchers to understand individual differences in intelligence, cognitive development, affect, motivation, self-regulation, and self-concept, as well as their role in learning.</p>
            </div>
            
            <div class="kinesthetic-section">
              <h3>Interactive Activity</h3>
              <button class="start-activity" data-activity="cognitive_mapping">Start Cognitive Mapping Exercise</button>
              <div class="activity-description">
                <p>In this exercise, you'll create a physical or digital mind map of key educational psychology concepts and their relationships.</p>
              </div>
            </div>
          </div>
        `
      }
      
      resolve(contentByStyle[learningStyle] || contentByStyle[LearningStyle.MULTIMODAL]);
    }, 100);
  });
}

/**
 * React hook for learning style assessment
 */
export const useLearningStyleAssessment = (): {
  questions: LearningStyleQuestion[];
  answers: Record<string, LearningStyle>;
  setAnswer: (questionId: string, style: LearningStyle) => void;
  result: LearningStyleResult | null;
  calculateResult: () => void;
  isComplete: boolean;
} => {
  const [questions] = useState<LearningStyleQuestion[]>(getLearningStyleQuestions());
  const [answers, setAnswers] = useState<Record<string, LearningStyle>>({});
  const [result, setResult] = useState<LearningStyleResult | null>(null);
  
  const setAnswer = (questionId: string, style: LearningStyle) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: style
    }));
  }
  
  const calculateResult = () => {
    const assessmentResult = assessLearningStyle(answers);
    setResult(assessmentResult);
  }
  
  const isComplete = Object.keys(answers).length === questions.length;
  
  return {
    questions,
    answers,
    setAnswer,
    result,
    calculateResult,
    isComplete
  }
}

/**
 * React hook for module progress tracking
 */
export const useModuleProgress = (
  userId: string,
  moduleId: string
): {
  progress: ModuleProgress | null;
  loading: boolean;
  error: string | null;
  trackActivity: (activityId: string, timeSpent: number) => Promise<void>;
  trackAssessment: (assessmentId: string, score: number, passed: boolean) => Promise<void>;
} => {
  const [progress, setProgress] = useState<ModuleProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const result = await trackModuleProgress(userId, moduleId);
        setProgress(result);
        setError(null);
      } catch (err) {
        setError('Failed to load progress data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProgress();
  }, [userId, moduleId]);
  
  const trackActivity = async (activityId: string, timeSpent: number) => {
    try {
      setLoading(true);
      const updatedProgress = await trackModuleProgress(
        userId,
        moduleId,
        activityId,
        undefined,
        timeSpent
      );
      setProgress(updatedProgress);
      setError(null);
    } catch (err) {
      setError('Failed to update activity progress');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  const trackAssessment = async (assessmentId: string, score: number, passed: boolean) => {
    try {
      setLoading(true);
      const updatedProgress = await trackModuleProgress(
        userId,
        moduleId,
        undefined,
        { assessmentId, score, passed }
      );
      setProgress(updatedProgress);
      setError(null);
    } catch (err) {
      setError('Failed to update assessment progress');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  return {
    progress,
    loading,
    error,
    trackActivity,
    trackAssessment
  }
}

/**
 * React hook for learning recommendations
 */
export const useLearningRecommendations = (
  userId: string,
  count: number = 3
): {
  recommendations: LearningRecommendation[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} => {
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const result = await getLearningRecommendations(userId, count);
      setRecommendations(result);
      setError(null);
    } catch (err) {
      setError('Failed to load recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchRecommendations();
  }, [userId, count]);
  
  return {
    recommendations,
    loading,
    error,
    refresh: fetchRecommendations
  }
}

/**
 * React hook for user achievements
 */
export const useAchievements = (
  userId: string
): {
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const result = await getUserAchievements(userId);
      setAchievements(result);
      setError(null);
    } catch (err) {
      setError('Failed to load achievements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchAchievements();
  }, [userId]);
  
  return {
    achievements,
    loading,
    error,
    refresh: fetchAchievements
  }
}

/**
 * React hook for adaptive content
 */
export const useAdaptiveContent = (
  moduleId: string,
  activityId: string,
  learningStyle: LearningStyle
): {
  content: string;
  loading: boolean;
  error: string | null;
  changeStyle: (style: LearningStyle) => void;
} => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState<LearningStyle>(learningStyle);
  
  const fetchContent = async (style: LearningStyle) => {
    try {
      setLoading(true);
      const result = await getAdaptedContent(moduleId, style, activityId);
      setContent(result);
      setError(null);
    } catch (err) {
      setError('Failed to load adaptive content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchContent(currentStyle);
  }, [moduleId, activityId, currentStyle]);
  
  const changeStyle = (style: LearningStyle) => {
    setCurrentStyle(style);
  }
  
  return {
    content,
    loading,
    error,
    changeStyle
  }
}

/**
 * Learning style adaptive content component
 */
export const LearningStyleAdaptiveContent: React.FC<{
  moduleId: string;
  activityId: string;
  userLearningStyle: LearningStyle;
  allowStyleChange?: boolean;
  className?: string;
}> = ({ moduleId, activityId, userLearningStyle, allowStyleChange = true, className = '' }) => {
  const {
    content,
    loading,
    error,
    changeStyle
  } = useAdaptiveContent(moduleId, activityId, userLearningStyle);
  
  if (loading) {
    return <div className="adaptive-content-loading">Loading content...</div>;
  }
  
  if (error) {
    return <div className="adaptive-content-error">Error: {error}</div>;
  }
  
  return (
    <div className={`adaptive-content ${className}`}>
      {allowStyleChange && (
        <div className="style-selector">
          <label htmlFor="learning-style">Content presentation style:</label>
          <select 
            id="learning-style"
            defaultValue={userLearningStyle}
            onChange={(e) => (changeStyle)(e.target.value as LearningStyle)}
          >
            <option value={LearningStyle.VISUAL}>Visual</option>
            <option value={LearningStyle.AUDITORY}>Auditory</option>
            <option value={LearningStyle.READING_WRITING}>Reading/Writing</option>
            <option value={LearningStyle.KINESTHETIC}>Kinesthetic</option>
            <option value={LearningStyle.MULTIMODAL}>Multimodal</option>
          </select>
        </div>
      )}
      
      <div 
        className="content-container"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

/**
 * Progress tracking component
 */
export const ProgressTracking: React.FC<{
  userId: string;
  moduleId: string;
  showCelebration?: boolean;
  className?: string;
}> = ({ userId, moduleId, showCelebration = true, className = '' }) => {
  const {
    progress,
    loading,
    error
  } = useModuleProgress(userId, moduleId);
  
  const [showingCelebration, setShowingCelebration] = useState<boolean>(false);
  
  useEffect(() => {
    if (progress?.status === ProgressStatus.COMPLETED && showCelebration) {
      setShowingCelebration(true);
      
      // Hide celebration after 5 seconds
      const timer = setTimeout(() => {
        setShowingCelebration(false);
      }, 5000);
      
      return () => (clearTimeout)(timer);
    }
  }, [progress, showCelebration]);
  
  if (loading) {
    return <div className="progress-loading">Loading progress...</div>;
  }
  
  if (error) {
    return <div className="progress-error">Error: {error}</div>;
  }
  
  if (!progress) {
    return <div className="progress-not-found">No progress data available</div>;
  }
  
  return (
    <div className={`progress-tracking ${className}`}>
      <div className="progress-header">
        <h3>Your Progress</h3>
        <div className="progress-status">{progress.status}</div>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress.completionPercentage}%` }}
        />
        <div className="progress-percentage">{progress.completionPercentage}%</div>
      </div>
      
      <div className="progress-details">
        <div className="progress-stat">
          <span className="stat-label">Time spent:</span>
          <span className="stat-value">{progress.timeSpent} minutes</span>
        </div>
        <div className="progress-stat">
          <span className="stat-label">Activities completed:</span>
          <span className="stat-value">{progress.completedActivities.length}</span>
        </div>
        <div className="progress-stat">
          <span className="stat-label">Assessments completed:</span>
          <span className="stat-value">{progress.assessmentResults.length}</span>
        </div>
      </div>
      
      {showingCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <h2>Congratulations!</h2>
            <p>You've completed this module!</p>
            <div className="confetti-animation"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default {
  assessLearningStyle,
  getLearningStyleQuestions,
  trackModuleProgress,
  getLearningRecommendations,
  getUserAchievements,
  getAdaptedContent,
  useLearningStyleAssessment,
  useModuleProgress,
  useLearningRecommendations,
  useAchievements,
  useAdaptiveContent,
  LearningStyleAdaptiveContent,
  ProgressTracking,
  LearningStyle,
  LearningPace,
  DifficultyLevel,
  InterestCategory,
  LearningGoalType,
  LearningActivityType,
  ProgressStatus
}
