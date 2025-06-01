/**
 * Enhanced Voice Analysis Service
 * 
 * This service extends the basic voice analysis capabilities with emotional tone detection,
 * speech pattern analysis, and advanced voice recognition features to support accessibility
 * and personalized learning experiences.
 */

import { speechRecognition } from './speechRecognition';
import { textToSpeech } from './textToSpeech';
import { AgeGraduatedSpeechRecognition } from './age-graduated-speech-recognition';

// Emotion types that can be detected in voice
export enum EmotionType {
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  SAD = 'sad',
  ANGRY = 'angry',
  FEARFUL = 'fearful',
  SURPRISED = 'surprised',
  CONFUSED = 'confused',
  FRUSTRATED = 'frustrated'
}

// Speech pattern types for analysis
export enum SpeechPatternType {
  FLUENT = 'fluent',
  HESITANT = 'hesitant',
  REPETITIVE = 'repetitive',
  MONOTONE = 'monotone',
  VARIED = 'varied',
  RAPID = 'rapid',
  SLOW = 'slow'
}

// Voice analysis result interface
export interface VoiceAnalysisResult {
  text: string;
  confidence: number;
  emotion: EmotionType;
  emotionConfidence: number;
  speechPattern: SpeechPatternType;
  speechPatternConfidence: number;
  ageAppropriate: boolean;
  metrics: {
    pitch: {
      average: number;
      variance: number;
    };
    speed: {
      wordsPerMinute: number;
      syllablesPerSecond: number;
    };
    volume: {
      average: number;
      variance: number;
    };
    pauses: {
      count: number;
      averageDuration: number;
    };
  };
  timestamp: Date;
}

// Voice analysis options interface
export interface VoiceAnalysisOptions {
  detectEmotion: boolean;
  analyzeSpeechPattern: boolean;
  ageGroup?: 'nursery' | 'early-primary' | 'late-primary' | 'secondary' | 'adult';
  languageCode?: string;
  sensitivity?: number; // 0-1, higher means more sensitive to emotional changes
  context?: string; // Contextual information to improve analysis accuracy
}

// Default options
const defaultOptions: VoiceAnalysisOptions = {
  detectEmotion: true,
  analyzeSpeechPattern: true,
  ageGroup: 'adult',
  languageCode: 'en-GB',
  sensitivity: 0.7
};

/**
 * Enhanced Voice Analysis Service
 */
export class EnhancedVoiceAnalysis {
  private static instance: EnhancedVoiceAnalysis;
  private ageGraduatedRecognition: AgeGraduatedSpeechRecognition;
  private isListening: boolean = false;
  private currentAnalysisCallback: ((result: VoiceAnalysisResult) => void) | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private mediaStream: MediaStream | null = null;

  private constructor() {
    this.ageGraduatedRecognition = new AgeGraduatedSpeechRecognition();
  }

  /**
   * Get the singleton instance of the Enhanced Voice Analysis service
   */
  public static getInstance(): EnhancedVoiceAnalysis {
    if (!EnhancedVoiceAnalysis.instance) {
      EnhancedVoiceAnalysis.instance = new EnhancedVoiceAnalysis();
    }
    return EnhancedVoiceAnalysis.instance;
  }

  /**
   * Start voice analysis with the given options
   * 
   * @param callback Function to call with analysis results
   * @param options Voice analysis options
   */
  public async startAnalysis(
    callback: (result: VoiceAnalysisResult) => void,
    options: Partial<VoiceAnalysisOptions> = {}
  ): Promise<void> {
    if (this.isListening) {
      this.stopAnalysis();
    }

    const mergedOptions = { ...defaultOptions, ...options };
    this.currentAnalysisCallback = callback;
    this.isListening = true;

    try {
      // Initialize audio context and analyzer for real-time audio processing
      await this.initializeAudioProcessing();

      // Set up speech recognition with age-appropriate settings
      this.ageGraduatedRecognition.setAgeGroup(mergedOptions.ageGroup || 'adult');
      
      // Start speech recognition
      this.ageGraduatedRecognition.startListening(
        (text, confidence) => {
          if (this.isListening && this.currentAnalysisCallback) {
            // Analyze the audio data for emotion and speech patterns
            const emotionResult = this.detectEmotion(mergedOptions);
            const speechPatternResult = this.analyzeSpeechPattern(mergedOptions);
            
            // Combine results
            const analysisResult: VoiceAnalysisResult = {
              text,
              confidence,
              emotion: emotionResult.emotion,
              emotionConfidence: emotionResult.confidence,
              speechPattern: speechPatternResult.pattern,
              speechPatternConfidence: speechPatternResult.confidence,
              ageAppropriate: this.isAgeAppropriate(text, mergedOptions.ageGroup || 'adult'),
              metrics: this.calculateAudioMetrics(),
              timestamp: new Date()
            };
            
            // Send results to callback
            this.currentAnalysisCallback(analysisResult);
          }
        },
        mergedOptions.languageCode
      );
    } catch (error) {
      console.error('Error starting voice analysis:', error);
      throw new Error('Failed to start voice analysis');
    }
  }

  /**
   * Stop the current voice analysis
   */
  public stopAnalysis(): void {
    if (this.isListening) {
      this.ageGraduatedRecognition.stopListening();
      this.cleanupAudioProcessing();
      this.isListening = false;
      this.currentAnalysisCallback = null;
    }
  }

  /**
   * Check if voice analysis is currently active
   */
  public isAnalyzing(): boolean {
    return this.isListening;
  }

  /**
   * Initialize audio processing for real-time analysis
   */
  private async initializeAudioProcessing(): Promise<void> {
    try {
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create audio context and analyzer
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      
      // Connect microphone to analyzer
      this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.microphone.connect(this.analyser);
      
      // Configure analyzer for detailed audio analysis
      this.analyser.smoothingTimeConstant = 0.8;
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;
    } catch (error) {
      console.error('Error initializing audio processing:', error);
      throw new Error('Failed to initialize audio processing');
    }
  }

  /**
   * Clean up audio processing resources
   */
  private cleanupAudioProcessing(): void {
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.analyser = null;
  }

  /**
   * Detect emotion from voice
   * 
   * @param options Voice analysis options
   */
  private detectEmotion(options: VoiceAnalysisOptions): { emotion: EmotionType; confidence: number } {
    if (!options.detectEmotion || !this.analyser) {
      return { emotion: EmotionType.NEUTRAL, confidence: 1.0 };
    }
    
    // Get frequency data from analyzer
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    
    // Analyze frequency patterns to detect emotions
    // This is a simplified implementation - in a real system, this would use
    // a trained machine learning model for emotion detection
    
    // Calculate energy in different frequency bands
    const lowEnergy = this.calculateBandEnergy(dataArray, 0, bufferLength / 4);
    const midEnergy = this.calculateBandEnergy(dataArray, bufferLength / 4, bufferLength / 2);
    const highEnergy = this.calculateBandEnergy(dataArray, bufferLength / 2, bufferLength);
    
    // Determine emotion based on energy distribution
    let emotion: EmotionType;
    let confidence: number;
    
    const totalEnergy = lowEnergy + midEnergy + highEnergy;
    const lowRatio = lowEnergy / totalEnergy;
    const midRatio = midEnergy / totalEnergy;
    const highRatio = highEnergy / totalEnergy;
    
    // Simple rule-based emotion detection
    if (highRatio > 0.4 && midRatio > 0.3) {
      emotion = EmotionType.HAPPY;
      confidence = 0.7 + (highRatio - 0.4) * 0.5;
    } else if (lowRatio > 0.5 && midRatio < 0.3) {
      emotion = EmotionType.SAD;
      confidence = 0.7 + (lowRatio - 0.5) * 0.5;
    } else if (highRatio > 0.5 && lowRatio > 0.3) {
      emotion = EmotionType.ANGRY;
      confidence = 0.7 + (highRatio - 0.5) * 0.5;
    } else if (midRatio > 0.5 && lowRatio < 0.2) {
      emotion = EmotionType.SURPRISED;
      confidence = 0.7 + (midRatio - 0.5) * 0.5;
    } else if (lowRatio > 0.4 && highRatio < 0.2) {
      emotion = EmotionType.FEARFUL;
      confidence = 0.7 + (lowRatio - 0.4) * 0.5;
    } else if (Math.abs(lowRatio - midRatio) < 0.1 && Math.abs(midRatio - highRatio) < 0.1) {
      emotion = EmotionType.CONFUSED;
      confidence = 0.7;
    } else if (highRatio > 0.4 && lowRatio > 0.4) {
      emotion = EmotionType.FRUSTRATED;
      confidence = 0.7 + (Math.min(highRatio, lowRatio) - 0.4) * 0.5;
    } else {
      emotion = EmotionType.NEUTRAL;
      confidence = 0.8;
    }
    
    // Apply sensitivity adjustment
    confidence = Math.min(1.0, confidence * options.sensitivity / 0.7);
    
    return { emotion, confidence };
  }

  /**
   * Analyze speech pattern from voice
   * 
   * @param options Voice analysis options
   */
  private analyzeSpeechPattern(options: VoiceAnalysisOptions): { pattern: SpeechPatternType; confidence: number } {
    if (!options.analyzeSpeechPattern || !this.analyser) {
      return { pattern: SpeechPatternType.FLUENT, confidence: 1.0 };
    }
    
    // Get time domain data from analyzer
    const bufferLength = this.analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);
    this.analyser.getFloatTimeDomainData(dataArray);
    
    // Analyze time domain patterns to detect speech patterns
    // This is a simplified implementation - in a real system, this would use
    // more sophisticated signal processing and pattern recognition
    
    // Calculate zero-crossing rate and energy variance
    const zeroCrossings = this.calculateZeroCrossings(dataArray);
    const energyVariance = this.calculateEnergyVariance(dataArray);
    
    // Determine speech pattern based on audio characteristics
    let pattern: SpeechPatternType;
    let confidence: number;
    
    // Simple rule-based pattern detection
    if (zeroCrossings > 100 && energyVariance < 0.1) {
      pattern = SpeechPatternType.RAPID;
      confidence = 0.7 + Math.min(0.3, (zeroCrossings - 100) / 200);
    } else if (zeroCrossings < 50 && energyVariance < 0.1) {
      pattern = SpeechPatternType.SLOW;
      confidence = 0.7 + Math.min(0.3, (50 - zeroCrossings) / 50);
    } else if (energyVariance < 0.05) {
      pattern = SpeechPatternType.MONOTONE;
      confidence = 0.7 + Math.min(0.3, (0.05 - energyVariance) / 0.05);
    } else if (energyVariance > 0.2) {
      pattern = SpeechPatternType.VARIED;
      confidence = 0.7 + Math.min(0.3, (energyVariance - 0.2) / 0.3);
    } else if (this.detectRepeatedPatterns(dataArray)) {
      pattern = SpeechPatternType.REPETITIVE;
      confidence = 0.8;
    } else if (this.detectPauses(dataArray).length > 5) {
      pattern = SpeechPatternType.HESITANT;
      confidence = 0.7 + Math.min(0.3, (this.detectPauses(dataArray).length - 5) / 10);
    } else {
      pattern = SpeechPatternType.FLUENT;
      confidence = 0.8;
    }
    
    // Apply sensitivity adjustment
    confidence = Math.min(1.0, confidence * options.sensitivity / 0.7);
    
    return { pattern, confidence };
  }

  /**
   * Calculate energy in a frequency band
   * 
   * @param dataArray Frequency data array
   * @param start Start index
   * @param end End index
   */
  private calculateBandEnergy(dataArray: Uint8Array, start: number, end: number): number {
    let energy = 0;
    for (let i = Math.floor(start); i < Math.floor(end); i++) {
      energy += dataArray[i] * dataArray[i];
    }
    return energy / (end - start);
  }

  /**
   * Calculate zero-crossing rate in time domain data
   * 
   * @param dataArray Time domain data array
   */
  private calculateZeroCrossings(dataArray: Float32Array): number {
    let zeroCrossings = 0;
    for (let i = 1; i < dataArray.length; i++) {
      if ((dataArray[i] >= 0 && dataArray[i - 1] < 0) || 
          (dataArray[i] < 0 && dataArray[i - 1] >= 0)) {
        zeroCrossings++;
      }
    }
    return zeroCrossings;
  }

  /**
   * Calculate energy variance in time domain data
   * 
   * @param dataArray Time domain data array
   */
  private calculateEnergyVariance(dataArray: Float32Array): number {
    // Calculate mean energy
    let meanEnergy = 0;
    for (let i = 0; i < dataArray.length; i++) {
      meanEnergy += dataArray[i] * dataArray[i];
    }
    meanEnergy /= dataArray.length;
    
    // Calculate variance
    let variance = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const energy = dataArray[i] * dataArray[i];
      variance += (energy - meanEnergy) * (energy - meanEnergy);
    }
    variance /= dataArray.length;
    
    return variance;
  }

  /**
   * Detect repeated patterns in time domain data
   * 
   * @param dataArray Time domain data array
   */
  private detectRepeatedPatterns(dataArray: Float32Array): boolean {
    // Simplified pattern detection using autocorrelation
    const frameSize = 256;
    const numFrames = Math.floor(dataArray.length / frameSize);
    
    if (numFrames < 2) {
      return false;
    }
    
    // Calculate frame energies
    const frameEnergies: number[] = [];
    for (let i = 0; i < numFrames; i++) {
      let energy = 0;
      for (let j = 0; j < frameSize; j++) {
        const idx = i * frameSize + j;
        if (idx < dataArray.length) {
          energy += dataArray[idx] * dataArray[idx];
        }
      }
      frameEnergies.push(energy / frameSize);
    }
    
    // Look for repeating energy patterns
    const correlations: number[] = [];
    for (let lag = 1; lag < numFrames / 2; lag++) {
      let correlation = 0;
      for (let i = 0; i < numFrames - lag; i++) {
        correlation += Math.abs(frameEnergies[i] - frameEnergies[i + lag]);
      }
      correlation /= (numFrames - lag);
      correlations.push(correlation);
    }
    
    // Find minimum correlation (maximum similarity)
    const minCorrelation = Math.min(...correlations);
    
    // If minimum correlation is below threshold, pattern is repeating
    return minCorrelation < 0.1;
  }

  /**
   * Detect pauses in time domain data
   * 
   * @param dataArray Time domain data array
   */
  private detectPauses(dataArray: Float32Array): number[] {
    const pauseThreshold = 0.05;
    const minPauseLength = 20;
    const pauses: number[] = [];
    let pauseStart = -1;
    
    // Detect segments with low energy
    for (let i = 0; i < dataArray.length; i++) {
      const energy = dataArray[i] * dataArray[i];
      
      if (energy < pauseThreshold) {
        if (pauseStart === -1) {
          pauseStart = i;
        }
      } else {
        if (pauseStart !== -1) {
          const pauseLength = i - pauseStart;
          if (pauseLength >= minPauseLength) {
            pauses.push(pauseStart);
          }
          pauseStart = -1;
        }
      }
    }
    
    // Check for pause at the end
    if (pauseStart !== -1 && dataArray.length - pauseStart >= minPauseLength) {
      pauses.push(pauseStart);
    }
    
    return pauses;
  }

  /**
   * Calculate audio metrics from analyzer data
   */
  private calculateAudioMetrics(): VoiceAnalysisResult['metrics'] {
    if (!this.analyser) {
      return {
        pitch: { average: 0, variance: 0 },
        speed: { wordsPerMinute: 0, syllablesPerSecond: 0 },
        volume: { average: 0, variance: 0 },
        pauses: { count: 0, averageDuration: 0 }
      };
    }
    
    // Get frequency and time domain data
    const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(frequencyData);
    
    const timeData = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(timeData);
    
    // Calculate pitch metrics
    const pitch = this.estimatePitch(frequencyData);
    
    // Calculate volume metrics
    const volume = this.calculateVolume(timeData);
    
    // Calculate pause metrics
    const pauses = this.detectPauses(timeData);
    
    // Calculate speed metrics (estimated)
    const speed = {
      wordsPerMinute: Math.round(80 + Math.random() * 40), // Simulated - would be calculated from word count and duration
      syllablesPerSecond: 2.5 + Math.random() * 1.5 // Simulated - would be calculated from syllable count and duration
    };
    
    return {
      pitch: {
        average: pitch.average,
        variance: pitch.variance
      },
      speed,
      volume: {
        average: volume.average,
        variance: volume.variance
      },
      pauses: {
        count: pauses.length,
        averageDuration: pauses.length > 0 ? 0.2 + Math.random() * 0.3 : 0 // Simulated - would be calculated from pause durations
      }
    };
  }

  /**
   * Estimate pitch from frequency data
   * 
   * @param frequencyData Frequency domain data array
   */
  private estimatePitch(frequencyData: Uint8Array): { average: number; variance: number } {
    // Find peak frequency
    let maxValue = 0;
    let maxIndex = 0;
    
    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i];
        maxIndex = i;
      }
    }
    
    // Convert index to frequency (Hz)
    const sampleRate = this.audioContext?.sampleRate || 44100;
    const fundamentalFreq = maxIndex * sampleRate / (frequencyData.length * 2);
    
    // Calculate variance (simplified)
    let variance = 0;
    let count = 0;
    
    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxValue * 0.5) {
        const freq = i * sampleRate / (frequencyData.length * 2);
        variance += (freq - fundamentalFreq) * (freq - fundamentalFreq) * (frequencyData[i] / maxValue);
        count += frequencyData[i] / maxValue;
      }
    }
    
    variance = count > 0 ? variance / count : 0;
    
    return {
      average: fundamentalFreq,
      variance
    };
  }

  /**
   * Calculate volume metrics from time domain data
   * 
   * @param timeData Time domain data array
   */
  private calculateVolume(timeData: Float32Array): { average: number; variance: number } {
    let sum = 0;
    let sumSquares = 0;
    
    for (let i = 0; i < timeData.length; i++) {
      const amplitude = Math.abs(timeData[i]);
      sum += amplitude;
      sumSquares += amplitude * amplitude;
    }
    
    const average = sum / timeData.length;
    const variance = sumSquares / timeData.length - average * average;
    
    return { average, variance };
  }

  /**
   * Check if speech content is age-appropriate
   * 
   * @param text Speech text
   * @param ageGroup Age group
   */
  private isAgeAppropriate(text: string, ageGroup: string): boolean {
    // This is a simplified implementation - in a real system, this would use
    // more sophisticated content analysis and age-appropriate language models
    
    // Convert text to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase();
    
    // Define inappropriate words or phrases for different age groups
    const inappropriateWords: Record<string, string[]> = {
      'nursery': [
        'violent', 'kill', 'hate', 'stupid', 'idiot', 'damn', 'hell',
        'sex', 'drug', 'alcohol', 'cigarette', 'die', 'dead'
      ],
      'early-primary': [
        'violent', 'kill', 'hate', 'stupid', 'idiot', 'damn', 'hell',
        'sex', 'drug', 'alcohol', 'cigarette', 'die', 'dead'
      ],
      'late-primary': [
        'violent', 'kill', 'hate', 'sex', 'drug', 'alcohol', 'cigarette'
      ],
      'secondary': [
        'explicit', 'pornography', 'drug'
      ],
      'adult': []
    };
    
    // Check if text contains any inappropriate words for the age group
    const wordsToCheck = inappropriateWords[ageGroup] || [];
    
    for (const word of wordsToCheck) {
      if (lowerText.includes(word)) {
        return false;
      }
    }
    
    return true;
  }
}

// Export singleton instance
export const enhancedVoiceAnalysis = EnhancedVoiceAnalysis.getInstance();
