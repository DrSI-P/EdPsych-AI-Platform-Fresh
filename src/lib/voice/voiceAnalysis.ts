/**
 * Voice Analysis Service
 * 
 * This service provides advanced voice analysis capabilities including:
 * - Emotional tone detection
 * - Speech pattern analysis
 * - Confidence and clarity assessment
 * - Speaking pace analysis
 * - Age-appropriate voice processing
 */

import { getSpeechRecognitionService, SpeechRecognitionResult } from './speechRecognition';

// Types for voice analysis
export interface VoiceAnalysisOptions {
  emotionalToneDetection?: boolean;
  speechPatternAnalysis?: boolean;
  confidenceAnalysis?: boolean;
  paceAnalysis?: boolean;
  ageGroup?: 'early-years' | 'primary' | 'secondary' | 'adult';
  specialEducationalNeeds?: {
    anxiety?: boolean;
    socialCommunication?: boolean;
    emotionalRegulation?: boolean;
  };
}

export interface EmotionalToneResult {
  primaryEmotion: string;
  confidence: number;
  secondaryEmotions?: {
    emotion: string;
    confidence: number;
  }[];
  valence: number; // -1 (negative) to 1 (positive)
  arousal: number; // 0 (calm) to 1 (excited)
}

export interface SpeechPatternResult {
  clarity: number; // 0 to 1
  fluency: number; // 0 to 1
  articulation: number; // 0 to 1
  rhythm: number; // 0 to 1
  patterns: {
    type: string;
    frequency: number;
    examples?: string[];
  }[];
}

export interface ConfidenceAnalysisResult {
  overallConfidence: number; // 0 to 1
  hesitations: number; // Frequency of hesitations
  fillerWords: {
    word: string;
    count: number;
  }[];
  voiceStrength: number; // 0 to 1
}

export interface PaceAnalysisResult {
  wordsPerMinute: number;
  isAppropriate: boolean;
  recommendation?: string;
  variability: number; // 0 (monotone) to 1 (highly variable)
  pauses: {
    count: number;
    averageDuration: number;
    appropriateness: number; // 0 to 1
  };
}

export interface VoiceAnalysisResult {
  text: string;
  emotionalTone?: EmotionalToneResult;
  speechPattern?: SpeechPatternResult;
  confidence?: ConfidenceAnalysisResult;
  pace?: PaceAnalysisResult;
  timestamp: number;
  audioQuality: number; // 0 to 1
  recommendations?: string[];
}

// Voice analysis service class
export class VoiceAnalysisService {
  private options: VoiceAnalysisOptions;
  private emotionModel: any = null;
  private speechPatternModel: any = null;
  private confidenceModel: any = null;
  private paceModel: any = null;
  private modelsLoaded: boolean = false;
  private isAnalyzing: boolean = false;
  
  constructor(options: VoiceAnalysisOptions = {}) {
    this.options = {
      emotionalToneDetection: true,
      speechPatternAnalysis: true,
      confidenceAnalysis: true,
      paceAnalysis: true,
      ageGroup: 'primary',
      ...options
    };
    
    this.loadModels();
  }
  
  /**
   * Load required analysis models
   */
  private async loadModels(): Promise<void> {
    try {
      console.log('Loading voice analysis models...');
      
      const modelLoadPromises: Promise<any>[] = [];
      
      if (this.options.emotionalToneDetection) {
        modelLoadPromises.push(this.loadEmotionModel());
      }
      
      if (this.options.speechPatternAnalysis) {
        modelLoadPromises.push(this.loadSpeechPatternModel());
      }
      
      if (this.options.confidenceAnalysis) {
        modelLoadPromises.push(this.loadConfidenceModel());
      }
      
      if (this.options.paceAnalysis) {
        modelLoadPromises.push(this.loadPaceModel());
      }
      
      await Promise.all(modelLoadPromises);
      
      this.modelsLoaded = true;
      console.log('Voice analysis models loaded successfully');
    } catch (error) {
      console.error('Failed to load voice analysis models:', error);
      this.modelsLoaded = false;
    }
  }
  
  /**
   * Load emotion detection model
   */
  private async loadEmotionModel(): Promise<void> {
    // In a real implementation, this would load a pre-trained model
    // For now, we'll simulate loading a model
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate model with basic emotion detection capabilities
    this.emotionModel = {
      detect: (text: string, audioFeatures: any): EmotionalToneResult => {
        // Simple keyword-based emotion detection for simulation
        const emotions = {
          happy: ['happy', 'glad', 'excited', 'wonderful', 'great', 'love', 'enjoy'],
          sad: ['sad', 'upset', 'unhappy', 'disappointed', 'sorry', 'miss', 'lost'],
          angry: ['angry', 'mad', 'frustrated', 'annoyed', 'hate', 'terrible'],
          fearful: ['scared', 'afraid', 'worried', 'nervous', 'anxious', 'frightened'],
          surprised: ['surprised', 'shocked', 'amazed', 'wow', 'unexpected'],
          neutral: []
        };
        
        // Count emotion keywords
        const emotionCounts = {};
        const lowerText = text.toLowerCase();
        
        for (const [emotion, keywords] of Object.entries(emotions)) {
          emotionCounts[emotion] = keywords.filter(keyword => 
            lowerText.includes(keyword)
          ).length;
        }
        
        // Determine primary emotion
        let primaryEmotion = 'neutral';
        let maxCount = 0;
        
        for (const [emotion, count] of Object.entries(emotionCounts)) {
          if (count > maxCount) {
            maxCount = count as number;
            primaryEmotion = emotion;
          }
        }
        
        // Calculate confidence based on keyword frequency
        const totalWords = text.split(' ').length;
        const confidence = Math.min(maxCount / Math.max(totalWords * 0.1, 1), 0.95);
        
        // Get secondary emotions
        const secondaryEmotions = Object.entries(emotionCounts)
          .filter(([emotion, count]) => emotion !== primaryEmotion && count > 0)
          .map(([emotion, count]) => ({
            emotion,
            confidence: Math.min((count as number) / Math.max(totalWords * 0.2, 1), 0.7)
          }))
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 2);
        
        // Calculate valence and arousal
        const valenceMap = {
          happy: 0.8,
          sad: -0.7,
          angry: -0.8,
          fearful: -0.6,
          surprised: 0.4,
          neutral: 0
        };
        
        const arousalMap = {
          happy: 0.6,
          sad: 0.3,
          angry: 0.9,
          fearful: 0.7,
          surprised: 0.8,
          neutral: 0.2
        };
        
        // Adjust for age group
        let valenceAdjustment = 0;
        let arousalAdjustment = 0;
        
        switch (this.options.ageGroup) {
          case 'early-years':
            valenceAdjustment = 0.1; // Young children tend to express emotions more positively
            arousalAdjustment = 0.2; // Young children tend to be more expressive
            break;
          case 'primary':
            valenceAdjustment = 0.05;
            arousalAdjustment = 0.1;
            break;
          case 'secondary':
            valenceAdjustment = -0.05; // Teenagers may express more negative emotions
            arousalAdjustment = 0;
            break;
          case 'adult':
            valenceAdjustment = 0;
            arousalAdjustment = -0.1; // Adults tend to be more measured
            break;
        }
        
        return {
          primaryEmotion,
          confidence,
          secondaryEmotions: secondaryEmotions.length > 0 ? secondaryEmotions : undefined,
          valence: Math.max(-1, Math.min(1, valenceMap[primaryEmotion] + valenceAdjustment)),
          arousal: Math.max(0, Math.min(1, arousalMap[primaryEmotion] + arousalAdjustment))
        };
      }
    };
  }
  
  /**
   * Load speech pattern analysis model
   */
  private async loadSpeechPatternModel(): Promise<void> {
    // In a real implementation, this would load a pre-trained model
    // For now, we'll simulate loading a model
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate model with basic speech pattern analysis capabilities
    this.speechPatternModel = {
      analyze: (text: string, audioFeatures: any): SpeechPatternResult => {
        // Simple pattern detection for simulation
        const words = text.split(' ');
        const totalWords = words.length;
        
        // Detect repeated words
        const repeatedWords = [];
        for (let i = 1; i < words.length; i++) {
          if (words[i].toLowerCase() === words[i-1].toLowerCase()) {
            repeatedWords.push(words[i]);
          }
        }
        
        // Detect filler words
        const fillerWords = ['um', 'uh', 'like', 'you know', 'sort of', 'kind of'];
        const detectedFillers = words.filter(word => 
          fillerWords.includes(word.toLowerCase())
        );
        
        // Detect sentence fragments
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const fragments = sentences.filter(s => 
          !(/\b[A-Z][a-z]*\b/.test(s.trim())) || s.trim().split(' ').length < 3
        );
        
        // Calculate metrics based on detected patterns
        const clarity = Math.max(0, Math.min(1, 1 - (detectedFillers.length / Math.max(totalWords, 1) * 2)));
        const fluency = Math.max(0, Math.min(1, 1 - (repeatedWords.length / Math.max(totalWords, 1) * 3)));
        const articulation = Math.random() * 0.3 + 0.7; // Simulated value (would use audio in real implementation)
        const rhythm = Math.max(0, Math.min(1, 1 - (fragments.length / Math.max(sentences.length, 1) * 0.5)));
        
        // Adjust for age group
        let clarityAdjustment = 0;
        let fluencyAdjustment = 0;
        let articulationAdjustment = 0;
        
        switch (this.options.ageGroup) {
          case 'early-years':
            clarityAdjustment = -0.2; // Young children typically have lower clarity
            fluencyAdjustment = -0.15; // Young children typically have lower fluency
            articulationAdjustment = -0.2; // Young children typically have lower articulation
            break;
          case 'primary':
            clarityAdjustment = -0.1;
            fluencyAdjustment = -0.1;
            articulationAdjustment = -0.1;
            break;
          case 'secondary':
            clarityAdjustment = 0;
            fluencyAdjustment = -0.05;
            articulationAdjustment = 0;
            break;
          case 'adult':
            clarityAdjustment = 0;
            fluencyAdjustment = 0;
            articulationAdjustment = 0;
            break;
        }
        
        // Compile patterns
        const patterns = [];
        
        if (repeatedWords.length > 0) {
          patterns.push({
            type: 'word repetition',
            frequency: repeatedWords.length / Math.max(totalWords, 1),
            examples: repeatedWords.slice(0, 3)
          });
        }
        
        if (detectedFillers.length > 0) {
          patterns.push({
            type: 'filler words',
            frequency: detectedFillers.length / Math.max(totalWords, 1),
            examples: [...new Set(detectedFillers)].slice(0, 3)
          });
        }
        
        if (fragments.length > 0) {
          patterns.push({
            type: 'sentence fragments',
            frequency: fragments.length / Math.max(sentences.length, 1),
            examples: fragments.slice(0, 2)
          });
        }
        
        return {
          clarity: Math.max(0, Math.min(1, clarity + clarityAdjustment)),
          fluency: Math.max(0, Math.min(1, fluency + fluencyAdjustment)),
          articulation: Math.max(0, Math.min(1, articulation + articulationAdjustment)),
          rhythm,
          patterns
        };
      }
    };
  }
  
  /**
   * Load confidence analysis model
   */
  private async loadConfidenceModel(): Promise<void> {
    // In a real implementation, this would load a pre-trained model
    // For now, we'll simulate loading a model
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Simulate model with basic confidence analysis capabilities
    this.confidenceModel = {
      analyze: (text: string, audioFeatures: any): ConfidenceAnalysisResult => {
        // Simple confidence indicators for simulation
        const words = text.split(' ');
        const totalWords = words.length;
        
        // Detect hesitation markers
        const hesitationMarkers = ['um', 'uh', 'er', 'hmm', '...'];
        const hesitations = words.filter(word => 
          hesitationMarkers.includes(word.toLowerCase())
        ).length;
        
        // Detect filler words
        const fillerWords = ['like', 'you know', 'sort of', 'kind of', 'basically', 'actually'];
        const fillerCounts = {};
        
        for (const word of words) {
          const lowerWord = word.toLowerCase();
          for (const filler of fillerWords) {
            if (lowerWord === filler) {
              fillerCounts[filler] = (fillerCounts[filler] || 0) + 1;
            }
          }
        }
        
        // Calculate voice strength (would use audio features in real implementation)
        const voiceStrength = Math.random() * 0.4 + 0.6;
        
        // Calculate overall confidence
        const hesitationFactor = Math.max(0, 1 - (hesitations / Math.max(totalWords, 1) * 3));
        const fillerFactor = Math.max(0, 1 - (Object.values(fillerCounts).reduce((sum: number, count: number) => sum + count, 0) / Math.max(totalWords, 1) * 2));
        
        let overallConfidence = (hesitationFactor * 0.4) + (fillerFactor * 0.3) + (voiceStrength * 0.3);
        
        // Adjust for age group and special needs
        let confidenceAdjustment = 0;
        
        switch (this.options.ageGroup) {
          case 'early-years':
            confidenceAdjustment = -0.1; // Young children typically show less confidence
            break;
          case 'primary':
            confidenceAdjustment = -0.05;
            break;
          case 'secondary':
            confidenceAdjustment = 0;
            break;
          case 'adult':
            confidenceAdjustment = 0.05; // Adults typically show more confidence
            break;
        }
        
        // Adjust for anxiety if specified
        if (this.options.specialEducationalNeeds?.anxiety) {
          confidenceAdjustment -= 0.15;
        }
        
        return {
          overallConfidence: Math.max(0, Math.min(1, overallConfidence + confidenceAdjustment)),
          hesitations,
          fillerWords: Object.entries(fillerCounts).map(([word, count]) => ({ word, count: count as number })),
          voiceStrength
        };
      }
    };
  }
  
  /**
   * Load pace analysis model
   */
  private async loadPaceModel(): Promise<void> {
    // In a real implementation, this would load a pre-trained model
    // For now, we'll simulate loading a model
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate model with basic pace analysis capabilities
    this.paceModel = {
      analyze: (text: string, audioFeatures: any, durationMs: number): PaceAnalysisResult => {
        // Calculate words per minute
        const words = text.split(' ').filter(w => w.trim().length > 0);
        const totalWords = words.length;
        const minutes = durationMs / 60000;
        const wordsPerMinute = Math.round(totalWords / Math.max(minutes, 0.1));
        
        // Determine if pace is appropriate based on age group
        let optimalWpm = 150; // Default for adults
        let wpmRange = 30;
        
        switch (this.options.ageGroup) {
          case 'early-years':
            optimalWpm = 80;
            wpmRange = 40;
            break;
          case 'primary':
            optimalWpm = 100;
            wpmRange = 35;
            break;
          case 'secondary':
            optimalWpm = 120;
            wpmRange = 30;
            break;
          case 'adult':
            optimalWpm = 150;
            wpmRange = 30;
            break;
        }
        
        const isAppropriate = wordsPerMinute >= (optimalWpm - wpmRange) && 
                              wordsPerMinute <= (optimalWpm + wpmRange);
        
        // Generate recommendation if pace is not appropriate
        let recommendation;
        if (!isAppropriate) {
          if (wordsPerMinute < (optimalWpm - wpmRange)) {
            recommendation = 'Consider speaking a bit faster to maintain engagement';
          } else {
            recommendation = 'Consider slowing down slightly to improve clarity';
          }
        }
        
        // Simulate pause analysis (would use audio features in real implementation)
        const pauseCount = Math.floor(totalWords / 10);
        const averagePauseDuration = 0.5 + (Math.random() * 0.5);
        const pauseAppropriateness = Math.random() * 0.4 + 0.6;
        
        // Calculate variability (monotone vs. expressive)
        const variability = Math.random() * 0.6 + 0.4;
        
        return {
          wordsPerMinute,
          isAppropriate,
          recommendation,
          variability,
          pauses: {
            count: pauseCount,
            averageDuration: averagePauseDuration,
            appropriateness: pauseAppropriateness
          }
        };
      }
    };
  }
  
  /**
   * Analyze speech from recognition result
   */
  public async analyzeSpeech(
    recognitionResult: SpeechRecognitionResult, 
    audioData?: any, 
    durationMs: number = 5000
  ): Promise<VoiceAnalysisResult | null> {
    if (!this.modelsLoaded) {
      console.warn('Voice analysis models not loaded yet');
      return null;
    }
    
    if (this.isAnalyzing) {
      console.warn('Voice analysis already in progress');
      return null;
    }
    
    try {
      this.isAnalyzing = true;
      
      // Create base result
      const result: VoiceAnalysisResult = {
        text: recognitionResult.text,
        timestamp: Date.now(),
        audioQuality: audioData ? 0.85 : 0.7 // Simulated audio quality
      };
      
      // Simulate audio features (would extract from actual audio in real implementation)
      const simulatedAudioFeatures = {
        amplitude: 0.75,
        frequency: 220,
        clarity: 0.8,
        background_noise: 0.1
      };
      
      const audioFeatures = audioData || simulatedAudioFeatures;
      
      // Run enabled analyses
      if (this.options.emotionalToneDetection && this.emotionModel) {
        result.emotionalTone = this.emotionModel.detect(recognitionResult.text, audioFeatures);
      }
      
      if (this.options.speechPatternAnalysis && this.speechPatternModel) {
        result.speechPattern = this.speechPatternModel.analyze(recognitionResult.text, audioFeatures);
      }
      
      if (this.options.confidenceAnalysis && this.confidenceModel) {
        result.confidence = this.confidenceModel.analyze(recognitionResult.text, audioFeatures);
      }
      
      if (this.options.paceAnalysis && this.paceModel) {
        result.pace = this.paceModel.analyze(recognitionResult.text, audioFeatures, durationMs);
      }
      
      // Generate recommendations based on analysis results
      result.recommendations = this.generateRecommendations(result);
      
      return result;
    } catch (error) {
      console.error('Error during voice analysis:', error);
      return null;
    } finally {
      this.isAnalyzing = false;
    }
  }
  
  /**
   * Generate recommendations based on analysis results
   */
  private generateRecommendations(result: VoiceAnalysisResult): string[] {
    const recommendations: string[] = [];
    
    // Emotional tone recommendations
    if (result.emotionalTone) {
      if (result.emotionalTone.primaryEmotion === 'angry' && result.emotionalTone.confidence > 0.6) {
        recommendations.push('Consider using calmer language to express your thoughts');
      } else if (result.emotionalTone.primaryEmotion === 'fearful' && result.emotionalTone.confidence > 0.6) {
        recommendations.push('Try using more confident language to express your ideas');
      }
      
      if (result.emotionalTone.valence < -0.5 && this.options.specialEducationalNeeds?.emotionalRegulation) {
        recommendations.push('Remember to use your emotional regulation strategies when feeling upset');
      }
    }
    
    // Speech pattern recommendations
    if (result.speechPattern) {
      if (result.speechPattern.clarity < 0.6) {
        recommendations.push('Try speaking more clearly by enunciating each word');
      }
      
      if (result.speechPattern.fluency < 0.5) {
        recommendations.push('Practice speaking more smoothly without repeating words');
      }
      
      // Find patterns with high frequency
      const highFrequencyPatterns = result.speechPattern.patterns.filter(p => p.frequency > 0.2);
      if (highFrequencyPatterns.length > 0) {
        const patternType = highFrequencyPatterns[0].type;
        recommendations.push(`Try to reduce your use of ${patternType}`);
      }
    }
    
    // Confidence recommendations
    if (result.confidence) {
      if (result.confidence.overallConfidence < 0.5) {
        recommendations.push('Try speaking with more confidence by reducing hesitations');
      }
      
      if (result.confidence.fillerWords.length > 2) {
        const fillerExample = result.confidence.fillerWords[0].word;
        recommendations.push(`Reduce filler words like "${fillerExample}" to sound more confident`);
      }
    }
    
    // Pace recommendations
    if (result.pace && !result.pace.isAppropriate) {
      if (result.pace.recommendation) {
        recommendations.push(result.pace.recommendation);
      }
      
      if (result.pace.variability < 0.4) {
        recommendations.push('Try varying your tone more to make your speech more engaging');
      }
    }
    
    // Limit to top 3 recommendations
    return recommendations.slice(0, 3);
  }
  
  /**
   * Update analysis options
   */
  public updateOptions(options: Partial<VoiceAnalysisOptions>): void {
    const previousOptions = { ...this.options };
    
    this.options = {
      ...this.options,
      ...options
    };
    
    // Reload models if necessary options changed
    const needsReload = 
      (previousOptions.emotionalToneDetection !== this.options.emotionalToneDetection) ||
      (previousOptions.speechPatternAnalysis !== this.options.speechPatternAnalysis) ||
      (previousOptions.confidenceAnalysis !== this.options.confidenceAnalysis) ||
      (previousOptions.paceAnalysis !== this.options.paceAnalysis) ||
      (previousOptions.ageGroup !== this.options.ageGroup);
    
    if (needsReload) {
      this.loadModels();
    }
  }
  
  /**
   * Check if models are loaded
   */
  public areModelsLoaded(): boolean {
    return this.modelsLoaded;
  }
  
  /**
   * Check if currently analyzing
   */
  public isCurrentlyAnalyzing(): boolean {
    return this.isAnalyzing;
  }
}

// Export singleton instance
let voiceAnalysisService: VoiceAnalysisService | null = null;

export function getVoiceAnalysisService(options?: VoiceAnalysisOptions): VoiceAnalysisService {
  if (!voiceAnalysisService) {
    voiceAnalysisService = new VoiceAnalysisService(options);
  } else if (options) {
    voiceAnalysisService.updateOptions(options);
  }
  
  return voiceAnalysisService;
}
