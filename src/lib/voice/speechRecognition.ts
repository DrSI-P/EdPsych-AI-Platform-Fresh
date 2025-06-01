/**
 * Speech Recognition Service
 * 
 * This service provides advanced speech recognition optimised for children's voices
 * and supports voice input across the platform.
 */

// Types for speech recognition
export interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  childVoiceOptimization?: boolean;
  maxAlternatives?: number;
  profanityFilter?: boolean;
  specialEducationalNeeds?: {
    articulation?: boolean;
    fluency?: boolean;
    processing?: boolean;
  };
}

export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  alternatives?: Array<{
    text: string;
    confidence: number;
  }>;
  isFinal: boolean;
}

// Speech recognition service class
export class SpeechRecognitionService {
  private recognition;
  private isListening: boolean = false;
  private options: SpeechRecognitionOptions;
  private childVoiceModel: boolean = false;
  
  constructor(options: SpeechRecognitionOptions = {}) {
    this.options = {
      continuous: true,
      interimResults: true,
      lang: 'en-GB',
      childVoiceOptimization: true,
      maxAlternatives: 3,
      profanityFilter: true,
      ...options
    };
    
    this.initRecognition();
  }
  
  /**
   * Initialize speech recognition
   */
  private initRecognition(): void {
    // Check if browser supports speech recognition
    if (!this.isBrowserSupported()) {
      console.error('Speech recognition is not supported in this browser');
      return;
    }
    
    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    this.recognition.continuous = this.options.continuous;
    this.recognition.interimResults = this.options.interimResults;
    this.recognition.lang = this.options.lang;
    this.recognition.maxAlternatives = this.options.maxAlternatives;
    
    // Load child voice model if available and requested
    if (this.options.childVoiceOptimization) {
      this.loadChildVoiceModel();
    }
  }
  
  /**
   * Check if browser supports speech recognition
   */
  public isBrowserSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
  
  /**
   * Load optimised model for children's voices
   */
  private async loadChildVoiceModel(): Promise<void> {
    try {
      // In a real implementation, this would load a specialised model
      // For now, we'll simulate loading a model
      console.log('Loading child voice optimization model...');
      
      // Simulate model loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.childVoiceModel = true;
      console.log('Child voice optimization model loaded');
    } catch (error) {
      console.error('Failed to load child voice model:', error);
      this.childVoiceModel = false;
    }
  }
  
  /**
   * Start listening for speech
   */
  public start(onResult: (result: SpeechRecognitionResult) => void, onError?: (error) => void): void {
    if (!this.recognition) {
      if (onError) onError(new Error('Speech recognition not initialized'));
      return;
    }
    
    if (this.isListening) {
      this.stop();
    }
    
    // Set up result handler
    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const mainResult = result[0];
      
      // Process result with child voice optimization if enabled
      const processedText = this.options.childVoiceOptimization && this.childVoiceModel
        ? this.processChildSpeech(mainResult.transcript)
        : mainResult.transcript;
      
      // Create alternatives array
      const alternatives = [];
      for (let i = 1; i < result.length; i++) {
        alternatives.push({
          text: result[i].transcript,
          confidence: result[i].confidence
        });
      }
      
      // Call result handler
      onResult({
        text: processedText,
        confidence: mainResult.confidence,
        alternatives: alternatives.length > 0 ? alternatives : undefined,
        isFinal: result.isFinal
      });
    };
    
    // Set up error handler
    this.recognition.onerror = (event) => {
      if (onError) onError(event.error);
    };
    
    // Start recognition
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      if (onError) onError(error);
    }
  }
  
  /**
   * Stop listening for speech
   */
  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  /**
   * Process speech with child voice optimizations
   */
  private processChildSpeech(text: string): string {
    // In a real implementation, this would use a specialised model for children's speech
    // For now, we'll implement some basic processing
    
    // Common child speech patterns and corrections
    const corrections: [RegExp, string][] = [
      [/(\b)fing(\b)/g, '$1thing$2'],
      [/(\b)free(\b)/g, '$1three$2'],
      [/(\b)fo(\b)/g, '$1four$2'],
      [/(\b)wabbit(\b)/g, '$1rabbit$2'],
      [/(\b)lellow(\b)/g, '$1yellow$2'],
      [/(\b)wed(\b)/g, '$1red$2'],
      [/(\b)dat(\b)/g, '$1that$2'],
      [/(\b)dis(\b)/g, '$1this$2'],
      [/(\b)nana(\b)/g, '$1banana$2'],
      [/(\b)pasghetti(\b)/g, '$1spaghetti$2'],
      [/(\b)aminal(\b)/g, '$1animal$2'],
      [/(\b)hostipal(\b)/g, '$1hospital$2'],
      [/(\b)libary(\b)/g, '$1library$2'],
      [/(\b)brefast(\b)/g, '$1breakfast$2'],
      [/(\b)puter(\b)/g, '$1computer$2']
    ];
    
    // Apply corrections
    let processedText = text;
    for (const [pattern, replacement] of corrections) {
      processedText = processedText.replace(pattern, replacement);
    }
    
    // Handle special educational needs if configured
    if (this.options.specialEducationalNeeds) {
      if (this.options.specialEducationalNeeds.articulation) {
        // Additional processing for articulation difficulties
        processedText = this.processArticulationDifficulties(processedText);
      }
      
      if (this.options.specialEducationalNeeds.fluency) {
        // Additional processing for fluency difficulties
        processedText = this.processFluencyDifficulties(processedText);
      }
    }
    
    return processedText;
  }
  
  /**
   * Process speech with articulation difficulty optimizations
   */
  private processArticulationDifficulties(text: string): string {
    // Additional corrections for common articulation difficulties
    const corrections: [RegExp, string][] = [
      [/(\b)tup(\b)/g, '$1cup$2'],
      [/(\b)tar(\b)/g, '$1car$2'],
      [/(\b)doat(\b)/g, '$1goat$2'],
      [/(\b)wion(\b)/g, '$1lion$2'],
      [/(\b)yeg(\b)/g, '$1leg$2'],
      [/(\b)wun(\b)/g, '$1run$2'],
      [/(\b)tee(\b)/g, '$1key$2'],
      [/(\b)tate(\b)/g, '$1cake$2'],
      [/(\b)pish(\b)/g, '$1fish$2'],
      [/(\b)pork(\b)/g, '$1fork$2']
    ];
    
    // Apply corrections
    let processedText = text;
    for (const [pattern, replacement] of corrections) {
      processedText = processedText.replace(pattern, replacement);
    }
    
    return processedText;
  }
  
  /**
   * Process speech with fluency difficulty optimizations
   */
  private processFluencyDifficulties(text: string): string {
    // Remove repeated syllables and words (common in stuttering)
    return text
      .replace(/(\b\w+\b)-(\b\w+\b)/g, '$2') // Remove word repetitions with hyphen
      .replace(/(\b\w+\b) \1(\b)/g, '$1$2')  // Remove repeated words
      .replace(/(\w{1,2})-\1/g, '$1');       // Remove repeated syllables
  }
  
  /**
   * Update recognition options
   */
  public updateOptions(options: Partial<SpeechRecognitionOptions>): void {
    const wasListening = this.isListening;
    
    if (wasListening) {
      this.stop();
    }
    
    this.options = {
      ...this.options,
      ...options
    };
    
    this.initRecognition();
    
    if (wasListening) {
      this.start(() => {});
    }
  }
  
  /**
   * Check if currently listening
   */
  public isCurrentlyListening(): boolean {
    return this.isListening;
  }
}

// Browser compatibility types
declare global {
  interface Window {
    SpeechRecognition;
    webkitSpeechRecognition;
  }
}

// Export singleton instance
let speechRecognitionService: SpeechRecognitionService | null = null;

export function getSpeechRecognitionService(options?: SpeechRecognitionOptions): SpeechRecognitionService {
  if (!speechRecognitionService) {
    speechRecognitionService = new SpeechRecognitionService(options);
  } else if (options) {
    speechRecognitionService.updateOptions(options);
  }
  
  return speechRecognitionService;
}
