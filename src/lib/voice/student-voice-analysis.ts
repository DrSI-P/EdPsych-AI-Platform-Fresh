/**
 * Student Voice Analysis Service
 * 
 * This service provides advanced voice pattern recognition and sentiment analysis
 * specifically designed for children and young people in educational contexts.
 * It builds upon the core Voice Analysis service with specialized features for
 * educational assessment and support.
 */

import { 
  getVoiceAnalysisService, 
  VoiceAnalysisResult, 
  VoiceAnalysisOptions,
  EmotionalToneResult,
  SpeechPatternResult
} from './voiceAnalysis';
import { getSpeechRecognitionService, SpeechRecognitionResult } from './speechRecognition';

// Types for student voice analysis
export interface StudentVoiceAnalysisOptions extends VoiceAnalysisOptions {
  educationalContext?: 'classroom' | 'assessment' | 'tutoring' | 'practice';
  subjectContext?: string;
  readingLevel?: 'emerging' | 'developing' | 'fluent' | 'advanced';
  learningDifficulties?: {
    dyslexia?: boolean;
    dyspraxia?: boolean;
    speechImpediment?: boolean;
    hearingImpairment?: boolean;
    attentionDifficulties?: boolean;
  };
  feedbackMode?: 'supportive' | 'instructional' | 'minimal';
}

export interface ReadingAssessmentResult {
  fluencyScore: number; // 0 to 100
  accuracyScore: number; // 0 to 100
  comprehensionIndicators: {
    expressiveness: number; // 0 to 1
    pacing: number; // 0 to 1
    phrasing: number; // 0 to 1
  };
  readingLevel: string;
  strengths: string[];
  areasForImprovement: string[];
}

export interface LanguageAssessmentResult {
  vocabularyLevel: string;
  grammarAccuracy: number; // 0 to 1
  sentenceComplexity: number; // 0 to 1
  topicAdherence: number; // 0 to 1
  conceptUnderstanding: number; // 0 to 1
}

export interface EngagementAssessmentResult {
  overallEngagement: number; // 0 to 1
  confidence: number; // 0 to 1
  interest: number; // 0 to 1
  understanding: number; // 0 to 1
  frustrationIndicators: boolean;
  attentionLevel: 'high' | 'medium' | 'low' | 'fluctuating';
}

export interface StudentVoiceAnalysisResult extends VoiceAnalysisResult {
  educationalContext?: string;
  readingAssessment?: ReadingAssessmentResult;
  languageAssessment?: LanguageAssessmentResult;
  engagementAssessment?: EngagementAssessmentResult;
  learningStyleIndicators?: {
    visual: number; // 0 to 1
    auditory: number; // 0 to 1
    kinesthetic: number; // 0 to 1
    readingWriting: number; // 0 to 1
  };
  adaptiveFeedback?: {
    encouragement: string;
    guidance: string;
    nextSteps: string;
    resourceSuggestions?: {
      type: string;
      title: string;
      relevance: number; // 0 to 1
    }[];
  };
}

// Student Voice Analysis service class
export class StudentVoiceAnalysisService {
  private options: StudentVoiceAnalysisOptions;
  private voiceAnalysisService;
  private readingAssessmentModel: any = null;
  private languageAssessmentModel: any = null;
  private engagementAssessmentModel: any = null;
  private learningStyleModel: any = null;
  private feedbackModel: any = null;
  private modelsLoaded: boolean = false;
  private isAnalyzing: boolean = false;
  
  constructor(options: StudentVoiceAnalysisOptions = {}) {
    this.options = {
      emotionalToneDetection: true,
      speechPatternAnalysis: true,
      confidenceAnalysis: true,
      paceAnalysis: true,
      ageGroup: 'primary',
      educationalContext: 'classroom',
      feedbackMode: 'supportive',
      ...options
    };
    
    // Initialize base voice analysis service
    this.voiceAnalysisService = getVoiceAnalysisService({
      emotionalToneDetection: this.options.emotionalToneDetection,
      speechPatternAnalysis: this.options.speechPatternAnalysis,
      confidenceAnalysis: this.options.confidenceAnalysis,
      paceAnalysis: this.options.paceAnalysis,
      ageGroup: this.options.ageGroup,
      specialEducationalNeeds: this.options.specialEducationalNeeds
    });
    
    this.loadModels();
  }
  
  /**
   * Load required analysis models
   */
  private async loadModels(): Promise<void> {
    try {
      console.log('Loading student voice analysis models...');
      
      const modelLoadPromises: Promise<any>[] = [];
      
      // Load reading assessment model
      modelLoadPromises.push(this.loadReadingAssessmentModel());
      
      // Load language assessment model
      modelLoadPromises.push(this.loadLanguageAssessmentModel());
      
      // Load engagement assessment model
      modelLoadPromises.push(this.loadEngagementAssessmentModel());
      
      // Load learning style model
      modelLoadPromises.push(this.loadLearningStyleModel());
      
      // Load feedback model
      modelLoadPromises.push(this.loadFeedbackModel());
      
      await Promise.all(modelLoadPromises);
      
      this.modelsLoaded = true;
      console.log('Student voice analysis models loaded successfully');
    } catch (error) {
      console.error('Failed to load student voice analysis models:', error);
      this.modelsLoaded = false;
    }
  }
  
  /**
   * Load reading assessment model
   */
  private async loadReadingAssessmentModel(): Promise<void> {
    // In a real implementation, this would load a pre-trained model
    // For now, we'll simulate loading a model
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate model with reading assessment capabilities
    this.readingAssessmentModel = {
      assess: (text: string, speechPattern: SpeechPatternResult, audioFeatures: any): ReadingAssessmentResult => {
        // Simple reading assessment for simulation
        
        // Calculate fluency score based on speech pattern
        const fluencyScore = Math.round(speechPattern.fluency * 100);
        
        // Calculate accuracy score
        const accuracyScore = Math.round((speechPattern.clarity * 0.7 + speechPattern.articulation * 0.3) * 100);
        
        // Determine reading level based on age group and scores
        let readingLevel = 'developing';
        const averageScore = (fluencyScore + accuracyScore) / 2;
        
        switch (this.options.ageGroup) {
          case 'early-years':
            if (averageScore >= 85) readingLevel = 'advanced for age';
            else if (averageScore >= 70) readingLevel = 'on target';
            else if (averageScore >= 50) readingLevel = 'developing';
            else readingLevel = 'emerging';
            break;
          case 'primary':
            if (averageScore >= 90) readingLevel = 'advanced for age';
            else if (averageScore >= 75) readingLevel = 'on target';
            else if (averageScore >= 60) readingLevel = 'developing';
            else readingLevel = 'needs support';
            break;
          case 'secondary':
            if (averageScore >= 90) readingLevel = 'advanced';
            else if (averageScore >= 80) readingLevel = 'proficient';
            else if (averageScore >= 65) readingLevel = 'developing';
            else readingLevel = 'needs support';
            break;
          default:
            if (averageScore >= 90) readingLevel = 'advanced';
            else if (averageScore >= 75) readingLevel = 'proficient';
            else if (averageScore >= 60) readingLevel = 'developing';
            else readingLevel = 'needs support';
        }
        
        // Adjust for learning difficulties if specified
        if (this.options.learningDifficulties) {
          if (this.options.learningDifficulties.dyslexia) {
            readingLevel += ' (with dyslexia considerations)';
          }
          if (this.options.learningDifficulties.speechImpediment) {
            readingLevel += ' (with speech considerations)';
          }
        }
        
        // Determine strengths and areas for improvement
        const strengths = [];
        const areasForImprovement = [];
        
        if (speechPattern.fluency > 0.8) {
          strengths.push('Excellent reading fluency');
        } else if (speechPattern.fluency < 0.6) {
          areasForImprovement.push('Focus on improving reading fluency');
        }
        
        if (speechPattern.clarity > 0.8) {
          strengths.push('Clear pronunciation');
        } else if (speechPattern.clarity < 0.6) {
          areasForImprovement.push('Practice clearer pronunciation');
        }
        
        if (speechPattern.rhythm > 0.8) {
          strengths.push('Good phrasing and expression');
        } else if (speechPattern.rhythm < 0.6) {
          areasForImprovement.push('Work on phrasing and expression');
        }
        
        // Ensure we have at least one strength
        if (strengths.length === 0) {
          strengths.push('Consistent effort in reading');
        }
        
        // Calculate comprehension indicators
        const expressiveness = speechPattern.rhythm;
        const pacing = speechPattern.fluency;
        const phrasing = (speechPattern.rhythm + speechPattern.fluency) / 2;
        
        return {
          fluencyScore,
          accuracyScore,
          comprehensionIndicators: {
            expressiveness,
            pacing,
            phrasing
          },
          readingLevel,
          strengths,
          areasForImprovement
        };
      }
    };
  }
  
  /**
   * Load language assessment model
   */
  private async loadLanguageAssessmentModel(): Promise<void> {
    // In a real implementation, this would load a pre-trained model
    // For now, we'll simulate loading a model
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate model with language assessment capabilities
    this.languageAssessmentModel = {
      assess: (text: string, speechPattern: SpeechPatternResult): LanguageAssessmentResult => {
        // Simple language assessment for simulation
        const words = text.split(' ');
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        // Calculate vocabulary metrics
        const uniqueWords = new Set(words.map(w => w.toLowerCase()));
        const vocabularyRichness = Math.min(uniqueWords.size / Math.max(words.length * 0.6, 1), 1);
        
        // Determine vocabulary level
        let vocabularyLevel = 'age-appropriate';
        
        if (vocabularyRichness > 0.8) {
          vocabularyLevel = 'advanced';
        } else if (vocabularyRichness > 0.6) {
          vocabularyLevel = 'strong';
        } else if (vocabularyRichness < 0.4) {
          vocabularyLevel = 'developing';
        }
        
        // Adjust for age group
        switch (this.options.ageGroup) {
          case 'early-years':
            if (vocabularyRichness > 0.7) vocabularyLevel = 'advanced for age';
            break;
          case 'primary':
            if (vocabularyRichness > 0.75) vocabularyLevel = 'advanced for age';
            break;
          case 'secondary':
            if (vocabularyRichness < 0.5) vocabularyLevel = 'below age expectation';
            break;
        }
        
        // Calculate grammar accuracy (simulated)
        const grammarAccuracy = Math.min(0.5 + (speechPattern.clarity * 0.5), 1);
        
        // Calculate sentence complexity
        const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
        let sentenceComplexity = 0;
        
        switch (this.options.ageGroup) {
          case 'early-years':
            sentenceComplexity = Math.min(avgWordsPerSentence / 10, 1);
            break;
          case 'primary':
            sentenceComplexity = Math.min(avgWordsPerSentence / 15, 1);
            break;
          case 'secondary':
            sentenceComplexity = Math.min(avgWordsPerSentence / 20, 1);
            break;
          default:
            sentenceComplexity = Math.min(avgWordsPerSentence / 20, 1);
        }
        
        // Topic adherence and concept understanding (simulated)
        const topicAdherence = Math.random() * 0.3 + 0.7;
        const conceptUnderstanding = Math.random() * 0.3 + 0.7;
        
        return {
          vocabularyLevel,
          grammarAccuracy,
          sentenceComplexity,
          topicAdherence,
          conceptUnderstanding
        };
      }
    };
  }
  
  /**
   * Load engagement assessment model
   */
  private async loadEngagementAssessmentModel(): Promise<void> {
    // In a real implementation, this would load a pre-trained model
    // For now, we'll simulate loading a model
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Simulate model with engagement assessment capabilities
    this.engagementAssessmentModel = {
      assess: (emotionalTone: EmotionalToneResult, speechPattern: SpeechPatternResult): EngagementAssessmentResult => {
        // Calculate engagement based on emotional tone and speech patterns
        
        // Determine if there are frustration indicators
        const frustrationIndicators = 
          emotionalTone.primaryEmotion === 'angry' || 
          emotionalTone.primaryEmotion === 'fearful' ||
          (emotionalTone.valence < -0.3 && emotionalTone.arousal > 0.7);
        
        // Calculate confidence
        const confidence = 
          (emotionalTone.primaryEmotion === 'happy' ? 0.8 : 0.5) * 
          (speechPattern.fluency * 0.7 + speechPattern.clarity * 0.3);
        
        // Calculate interest based on emotional tone
        let interest = 0.5;
        switch (emotionalTone.primaryEmotion) {
          case 'happy':
            interest = 0.8;
            break;
          case 'surprised':
            interest = 0.9;
            break;
          case 'neutral':
            interest = 0.5;
            break;
          case 'sad':
            interest = 0.3;
            break;
          case 'angry':
            interest = 0.2;
            break;
          case 'fearful':
            interest = 0.3;
            break;
        }
        
        // Adjust interest based on arousal
        interest = Math.min(interest + (emotionalTone.arousal * 0.3), 1);
        
        // Calculate understanding (simulated)
        const understanding = speechPattern.fluency * 0.4 + speechPattern.clarity * 0.6;
        
        // Calculate overall engagement
        const overallEngagement = (confidence * 0.3) + (interest * 0.4) + (understanding * 0.3);
        
        // Determine attention level
        let attentionLevel: 'high' | 'medium' | 'low' | 'fluctuating' = 'medium';
        
        if (overallEngagement > 0.8) {
          attentionLevel = 'high';
        } else if (overallEngagement < 0.4) {
          attentionLevel = 'low';
        } else if (frustrationIndicators) {
          attentionLevel = 'fluctuating';
        }
        
        // Adjust for attention difficulties if specified
        if (this.options.learningDifficulties?.attentionDifficulties) {
          if (attentionLevel === 'high') {
            attentionLevel = 'medium';
          } else if (attentionLevel === 'medium') {
            attentionLevel = 'fluctuating';
          }
        }
        
        return {
          overallEngagement,
          confidence,
          interest,
          understanding,
          frustrationIndicators,
          attentionLevel
        };
      }
    };
  }
  
  /**
   * Load learning style model
   */
  private async loadLearningStyleModel(): Promise<void> {
    // In a real implementation, this would load a pre-trained model
    // For now, we'll simulate loading a model
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate model with learning style detection capabilities
    this.learningStyleModel = {
      detect: (text: string, emotionalTone: EmotionalToneResult, speechPattern: SpeechPatternResult): any => {
        // Simple learning style detection for simulation
        
        // Look for keywords that might indicate learning style preferences
        const lowerText = text.toLowerCase();
        
        // Visual learning indicators
        const visualKeywords = ['see', 'look', 'view', 'appear', 'show', 'picture', 'image', 'color', 'watch'];
        const visualCount = visualKeywords.filter(word => lowerText.includes(word)).length;
        
        // Auditory learning indicators
        const auditoryKeywords = ['hear', 'listen', 'sound', 'tell', 'talk', 'say', 'voice', 'loud', 'quiet'];
        const auditoryCount = auditoryKeywords.filter(word => lowerText.includes(word)).length;
        
        // Kinesthetic learning indicators
        const kinestheticKeywords = ['feel', 'touch', 'hold', 'do', 'move', 'try', 'handle', 'build', 'make'];
        const kinestheticCount = kinestheticKeywords.filter(word => lowerText.includes(word)).length;
        
        // Reading/writing learning indicators
        const readingWritingKeywords = ['read', 'write', 'note', 'list', 'book', 'text', 'word', 'page'];
        const readingWritingCount = readingWritingKeywords.filter(word => lowerText.includes(word)).length;
        
        // Calculate base scores
        const totalKeywordCount = Math.max(
          visualCount + auditoryCount + kinestheticCount + readingWritingCount, 
          1
        );
        
        let visualScore = visualCount / totalKeywordCount;
        let auditoryScore = auditoryCount / totalKeywordCount;
        let kinestheticScore = kinestheticCount / totalKeywordCount;
        let readingWritingScore = readingWritingCount / totalKeywordCount;
        
        // Normalize scores
        const totalScore = visualScore + auditoryScore + kinestheticScore + readingWritingScore;
        
        if (totalScore > 0) {
          visualScore = visualScore / totalScore;
          auditoryScore = auditoryScore / totalScore;
          kinestheticScore = kinestheticScore / totalScore;
          readingWritingScore = readingWritingScore / totalScore;
        } else {
          // Default distribution if no keywords detected
          visualScore = 0.25;
          auditoryScore = 0.25;
          kinestheticScore = 0.25;
          readingWritingScore = 0.25;
        }
        
        // Adjust based on speech patterns
        if (speechPattern.fluency > 0.8) {
          auditoryScore += 0.1;
        }
        
        if (speechPattern.clarity > 0.8) {
          readingWritingScore += 0.1;
        }
        
        // Normalize again
        const adjustedTotal = visualScore + auditoryScore + kinestheticScore + readingWritingScore;
        
        return {
          visual: visualScore / adjustedTotal,
          auditory: auditoryScore / adjustedTotal,
          kinesthetic: kinestheticScore / adjustedTotal,
          readingWriting: readingWritingScore / adjustedTotal
        };
      }
    };
  }
  
  /**
   * Load feedback model
   */
  private async loadFeedbackModel(): Promise<void> {
    // In a real implementation, this would load a pre-trained model
    // For now, we'll simulate loading a model
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate model with feedback generation capabilities
    this.feedbackModel = {
      generate: (
        readingAssessment: ReadingAssessmentResult,
        languageAssessment: LanguageAssessmentResult,
        engagementAssessment: EngagementAssessmentResult,
        learningStyleIndicators: any
      ): any => {
        // Generate adaptive feedback based on assessments
        
        // Determine dominant learning style
        const learningStyles = [
          { style: 'visual', score: learningStyleIndicators.visual },
          { style: 'auditory', score: learningStyleIndicators.auditory },
          { style: 'kinesthetic', score: learningStyleIndicators.kinesthetic },
          { style: 'readingWriting', score: learningStyleIndicators.readingWriting }
        ];
        
        const dominantStyle = learningStyles.sort((a, b) => b.score - a.score)[0].style;
        
        // Generate encouragement based on strengths and feedback mode
        let encouragement = '';
        
        if (readingAssessment.strengths.length > 0) {
          encouragement = readingAssessment.strengths[0];
          
          if (this.options.feedbackMode === 'supportive') {
            encouragement = `Well done! ${encouragement}`;
          } else if (this.options.feedbackMode === 'instructional') {
            encouragement = `You've demonstrated ${encouragement.toLowerCase()}`;
          }
        } else {
          if (this.options.feedbackMode === 'supportive') {
            encouragement = "You're making good progress with your reading!";
          } else if (this.options.feedbackMode === 'instructional') {
            encouragement = "You're developing your reading skills.";
          } else {
            encouragement = "Continue practicing your reading.";
          }
        }
        
        // Generate guidance based on areas for improvement
        let guidance = '';
        
        if (readingAssessment.areasForImprovement.length > 0) {
          guidance = readingAssessment.areasForImprovement[0];
          
          if (this.options.feedbackMode === 'supportive') {
            guidance = `Let's work on: ${guidance}`;
          } else if (this.options.feedbackMode === 'instructional') {
            guidance = `Focus area: ${guidance}`;
          }
        } else {
          if (engagementAssessment.understanding < 0.7) {
            guidance = "Try reading the passage again to improve understanding.";
          } else {
            guidance = "Continue with your current reading strategies.";
          }
        }
        
        // Generate next steps based on assessments and learning style
        let nextSteps = '';
        
        switch (dominantStyle) {
          case 'visual':
            if (readingAssessment.fluencyScore < 70) {
              nextSteps = "Try using color-coded text or highlighting to improve fluency.";
            } else if (languageAssessment.conceptUnderstanding < 0.7) {
              nextSteps = "Create a visual map of the key concepts to enhance understanding.";
            } else {
              nextSteps = "Use diagrams or pictures to represent the main ideas.";
            }
            break;
          case 'auditory':
            if (readingAssessment.fluencyScore < 70) {
              nextSteps = "Practice reading aloud and listening to recorded stories.";
            } else if (languageAssessment.conceptUnderstanding < 0.7) {
              nextSteps = "Discuss the concepts with someone to improve understanding.";
            } else {
              nextSteps = "Record yourself summarizing what you've read.";
            }
            break;
          case 'kinesthetic':
            if (readingAssessment.fluencyScore < 70) {
              nextSteps = "Try finger tracking or using a reading guide while reading.";
            } else if (languageAssessment.conceptUnderstanding < 0.7) {
              nextSteps = "Act out or use physical objects to represent the concepts.";
            } else {
              nextSteps = "Create a hands-on project related to what you've read.";
            }
            break;
          case 'readingWriting':
            if (readingAssessment.fluencyScore < 70) {
              nextSteps = "Practice rewriting passages in your own words.";
            } else if (languageAssessment.conceptUnderstanding < 0.7) {
              nextSteps = "Take notes and create summaries to improve understanding.";
            } else {
              nextSteps = "Write a reflection or response to what you've read.";
            }
            break;
        }
        
        // Generate resource suggestions
        const resourceSuggestions = [];
        
        // Reading fluency resources
        if (readingAssessment.fluencyScore < 70) {
          switch (dominantStyle) {
            case 'visual':
              resourceSuggestions.push({
                type: 'interactive',
                title: 'Visual Reading Fluency Builder',
                relevance: 0.9
              });
              break;
            case 'auditory':
              resourceSuggestions.push({
                type: 'audio',
                title: 'Read-Along Audio Stories',
                relevance: 0.9
              });
              break;
            case 'kinesthetic':
              resourceSuggestions.push({
                type: 'activity',
                title: 'Hands-On Reading Fluency Games',
                relevance: 0.9
              });
              break;
            case 'readingWriting':
              resourceSuggestions.push({
                type: 'worksheet',
                title: 'Progressive Reading Passages',
                relevance: 0.9
              });
              break;
          }
        }
        
        // Comprehension resources
        if (languageAssessment.conceptUnderstanding < 0.7) {
          switch (dominantStyle) {
            case 'visual':
              resourceSuggestions.push({
                type: 'visual',
                title: 'Concept Visualization Maps',
                relevance: 0.8
              });
              break;
            case 'auditory':
              resourceSuggestions.push({
                type: 'audio',
                title: 'Guided Concept Explanations',
                relevance: 0.8
              });
              break;
            case 'kinesthetic':
              resourceSuggestions.push({
                type: 'activity',
                title: 'Hands-On Concept Models',
                relevance: 0.8
              });
              break;
            case 'readingWriting':
              resourceSuggestions.push({
                type: 'worksheet',
                title: 'Concept Summary Templates',
                relevance: 0.8
              });
              break;
          }
        }
        
        // Engagement resources
        if (engagementAssessment.overallEngagement < 0.6) {
          resourceSuggestions.push({
            type: 'interactive',
            title: 'Engaging Reading Adventures',
            relevance: 0.7
          });
        }
        
        return {
          encouragement,
          guidance,
          nextSteps,
          resourceSuggestions: resourceSuggestions.length > 0 ? resourceSuggestions : undefined
        };
      }
    };
  }
  
  /**
   * Analyze student speech from recognition result
   */
  public async analyzeStudentSpeech(
    recognitionResult: SpeechRecognitionResult, 
    audioData?: any, 
    durationMs: number = 5000
  ): Promise<StudentVoiceAnalysisResult | null> {
    if (!this.modelsLoaded) {
      console.warn('Student voice analysis models not loaded yet');
      return null;
    }
    
    if (this.isAnalyzing) {
      console.warn('Student voice analysis already in progress');
      return null;
    }
    
    try {
      this.isAnalyzing = true;
      
      // First get base voice analysis
      const baseAnalysis = await this.voiceAnalysisService.analyzeSpeech(
        recognitionResult, 
        audioData, 
        durationMs
      );
      
      if (!baseAnalysis) {
        return null;
      }
      
      // Create student voice analysis result
      const result: StudentVoiceAnalysisResult = {
        ...baseAnalysis,
        educationalContext: this.options.educationalContext
      };
      
      // Perform reading assessment if speech pattern is available
      if (baseAnalysis.speechPattern && this.readingAssessmentModel) {
        result.readingAssessment = this.readingAssessmentModel.assess(
          recognitionResult.text,
          baseAnalysis.speechPattern,
          audioData
        );
      }
      
      // Perform language assessment if speech pattern is available
      if (baseAnalysis.speechPattern && this.languageAssessmentModel) {
        result.languageAssessment = this.languageAssessmentModel.assess(
          recognitionResult.text,
          baseAnalysis.speechPattern
        );
      }
      
      // Perform engagement assessment if emotional tone and speech pattern are available
      if (baseAnalysis.emotionalTone && baseAnalysis.speechPattern && this.engagementAssessmentModel) {
        result.engagementAssessment = this.engagementAssessmentModel.assess(
          baseAnalysis.emotionalTone,
          baseAnalysis.speechPattern
        );
      }
      
      // Detect learning style indicators if emotional tone and speech pattern are available
      if (baseAnalysis.emotionalTone && baseAnalysis.speechPattern && this.learningStyleModel) {
        result.learningStyleIndicators = this.learningStyleModel.detect(
          recognitionResult.text,
          baseAnalysis.emotionalTone,
          baseAnalysis.speechPattern
        );
      }
      
      // Generate adaptive feedback if all assessments are available
      if (
        result.readingAssessment && 
        result.languageAssessment && 
        result.engagementAssessment && 
        result.learningStyleIndicators &&
        this.feedbackModel
      ) {
        result.adaptiveFeedback = this.feedbackModel.generate(
          result.readingAssessment,
          result.languageAssessment,
          result.engagementAssessment,
          result.learningStyleIndicators
        );
      }
      
      return result;
    } catch (error) {
      console.error('Error during student voice analysis:', error);
      return null;
    } finally {
      this.isAnalyzing = false;
    }
  }
  
  /**
   * Update analysis options
   */
  public updateOptions(options: Partial<StudentVoiceAnalysisOptions>): void {
    const previousOptions = { ...this.options };
    
    this.options = {
      ...this.options,
      ...options
    };
    
    // Update base voice analysis service options
    this.voiceAnalysisService.updateOptions({
      emotionalToneDetection: this.options.emotionalToneDetection,
      speechPatternAnalysis: this.options.speechPatternAnalysis,
      confidenceAnalysis: this.options.confidenceAnalysis,
      paceAnalysis: this.options.paceAnalysis,
      ageGroup: this.options.ageGroup,
      specialEducationalNeeds: this.options.specialEducationalNeeds
    });
    
    // Reload models if necessary options changed
    const needsReload = 
      (previousOptions.ageGroup !== this.options.ageGroup) ||
      (previousOptions.educationalContext !== this.options.educationalContext) ||
      (previousOptions.readingLevel !== this.options.readingLevel) ||
      (JSON.stringify(previousOptions.learningDifficulties) !== JSON.stringify(this.options.learningDifficulties));
    
    if (needsReload) {
      this.loadModels();
    }
  }
  
  /**
   * Check if models are loaded
   */
  public areModelsLoaded(): boolean {
    return this.modelsLoaded && this.voiceAnalysisService.areModelsLoaded();
  }
  
  /**
   * Check if currently analyzing
   */
  public isCurrentlyAnalyzing(): boolean {
    return this.isAnalyzing;
  }
}

// Export singleton instance
let studentVoiceAnalysisService: StudentVoiceAnalysisService | null = null;

export function getStudentVoiceAnalysisService(options?: StudentVoiceAnalysisOptions): StudentVoiceAnalysisService {
  if (!studentVoiceAnalysisService) {
    studentVoiceAnalysisService = new StudentVoiceAnalysisService(options);
  } else if (options) {
    studentVoiceAnalysisService.updateOptions(options);
  }
  
  return studentVoiceAnalysisService;
}
