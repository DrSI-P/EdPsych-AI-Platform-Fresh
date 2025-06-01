/**
 * Text-to-Speech Service
 * 
 * This service provides high-quality text-to-speech functionality
 * with support for multiple voices, languages, and reading styles.
 */

// Types for text-to-speech
export interface TextToSpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  highlightText?: boolean;
  childFriendlyVoice?: boolean;
  specialEducationalNeeds?: {
    simplifiedLanguage?: boolean;
    extendedPauses?: boolean;
    emphasizeKeywords?: boolean;
  };
}

export interface TextToSpeechState {
  isReading: boolean;
  currentPosition: number;
  currentSentence: string;
  progress: number;
  availableVoices: any[];
}

// Text-to-speech service class
export class TextToSpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private options: TextToSpeechOptions;
  private state: TextToSpeechState;
  private textQueue: any[] = [];
  private highlightCallback: ((text: string, start: number, end: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  
  constructor(options: TextToSpeechOptions = {}) {
    this.options = {
      voice: '',
      rate: 1,
      pitch: 1,
      volume: 1,
      lang: 'en-GB',
      highlightText: true,
      childFriendlyVoice: false,
      ...options
    };
    
    this.state = {
      isReading: false,
      currentPosition: 0,
      currentSentence: '',
      progress: 0,
      availableVoices: []
    };
    
    this.initSynthesis();
  }
  
  /**
   * Initialize speech synthesis
   */
  private initSynthesis(): void {
    // Check if browser supports speech synthesis
    if (!this.isBrowserSupported()) {
      console.error('Speech synthesis is not supported in this browser');
      return;
    }
    
    // Get speech synthesis instance
    this.synthesis = window.speechSynthesis;
    
    // Load available voices
    this.loadVoices();
    
    // Set up voice changed event listener
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }
  
  /**
   * Load available voices
   */
  private loadVoices(): void {
    if (!this.synthesis) return;
    
    const voices = this.synthesis.getVoices();
    this.state.availableVoices = voices;
    
    // Set default voice if not already set
    if (!this.options.voice && voices.length > 0) {
      // Try to find a UK English voice
      const ukVoice = voices.find(voice => 
        voice.lang === 'en-GB' && 
        (this.options.childFriendlyVoice ? voice.name.toLowerCase().includes('child') : true)
      );
      
      if (ukVoice) {
        this.options.voice = ukVoice.name;
      } else {
        // Fall back to any English voice
        const anyEnglishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (anyEnglishVoice) {
          this.options.voice = anyEnglishVoice.name;
        } else {
          // Fall back to first available voice
          this.options.voice = voices[0].name;
        }
      }
    }
  }
  
  /**
   * Check if browser supports speech synthesis
   */
  public isBrowserSupported(): boolean {
    return 'speechSynthesis' in window;
  }
  
  /**
   * Get available voices
   */
  public getVoices(): SpeechSynthesisVoice[] {
    return this.state.availableVoices;
  }
  
  /**
   * Set highlight callback
   */
  public setHighlightCallback(callback: (text: string, start: number, end: number) => void): void {
    this.highlightCallback = callback;
  }
  
  /**
   * Set on end callback
   */
  public setOnEndCallback(callback: () => void): void {
    this.onEndCallback = callback;
  }
  
  /**
   * Speak text
   */
  public speak(text: string): void {
    if (!this.synthesis || !text) return;
    
    // Stop any current speech
    this.stop();
    
    // Process text for special educational needs if required
    if (this.options.specialEducationalNeeds) {
      text = this.processTextForSpecialNeeds(text);
    }
    
    // Split text into sentences for better control
    const sentences = this.splitIntoSentences(text);
    this.textQueue = sentences;
    
    // Start speaking
    this.speakNextSentence();
  }
  
  /**
   * Process text for special educational needs
   */
  private processTextForSpecialNeeds(text: string): string {
    const needs = this.options.specialEducationalNeeds;
    
    if (!needs) return text;
    
    let processedText = text;
    
    // Simplify language if needed
    if (needs.simplifiedLanguage) {
      processedText = this.simplifyLanguage(processedText);
    }
    
    // Add extended pauses if needed
    if (needs.extendedPauses) {
      processedText = this.addExtendedPauses(processedText);
    }
    
    // Emphasize keywords if needed
    if (needs.emphasizeKeywords) {
      processedText = this.emphasizeKeywords(processedText);
    }
    
    return processedText;
  }
  
  /**
   * Simplify language
   */
  private simplifyLanguage(text: string): string {
    // This is a simplified implementation
    // In a real implementation, this would use NLP to simplify complex language
    
    // Replace complex words with simpler alternatives
    const simplifications: [RegExp, string][] = [
      [/(\b)utilize(\b)/g, '$1use$2'],
      [/(\b)commence(\b)/g, '$1start$2'],
      [/(\b)terminate(\b)/g, '$1end$2'],
      [/(\b)purchase(\b)/g, '$1buy$2'],
      [/(\b)inquire(\b)/g, '$1ask$2'],
      [/(\b)sufficient(\b)/g, '$1enough$2'],
      [/(\b)require(\b)/g, '$1need$2'],
      [/(\b)obtain(\b)/g, '$1get$2'],
      [/(\b)comprehend(\b)/g, '$1understand$2'],
      [/(\b)additional(\b)/g, '$1more$2']
    ];
    
    let simplifiedText = text;
    for (const [pattern, replacement] of simplifications) {
      simplifiedText = simplifiedText.replace(pattern, replacement);
    }
    
    return simplifiedText;
  }
  
  /**
   * Add extended pauses
   */
  private addExtendedPauses(text: string): string {
    // Add pauses after punctuation
    return text
      .replace(/\./g, '... ')
      .replace(/\,/g, ', ')
      .replace(/\;/g, '... ')
      .replace(/\:/g, '... ')
      .replace(/\n/g, '...... ');
  }
  
  /**
   * Emphasize keywords
   */
  private emphasizeKeywords(text: string): string {
    // This is a simplified implementation
    // In a real implementation, this would use NLP to identify important keywords
    
    // Simple approach: emphasize words that start with capital letters (except at beginning of sentences)
    return text.replace(/(\.\s+\w|^\w)([^\.!?]*?)(\b[A-Z][a-z]+\b)/g, (match, start, middle, word) => {
      return `${start}${middle}<emphasis>${word}</emphasis>`;
    });
  }
  
  /**
   * Split text into sentences
   */
  private splitIntoSentences(text: string): string[] {
    // Simple sentence splitting - in a real implementation, this would be more sophisticated
    return text
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .filter(sentence => sentence.trim().length > 0);
  }
  
  /**
   * Speak next sentence in queue
   */
  private speakNextSentence(): void {
    if (!this.synthesis || this.textQueue.length === 0) {
      this.state.isReading = false;
      this.state.progress = 100;
      
      if (this.onEndCallback) {
        this.onEndCallback();
      }
      
      return;
    }
    
    const sentence = this.textQueue.shift() || '';
    this.state.currentSentence = sentence;
    this.state.isReading = true;
    
    // Create utterance
    this.utterance = new SpeechSynthesisUtterance(sentence);
    
    // Set utterance properties
    this.utterance.rate = this.options.rate || 1;
    this.utterance.pitch = this.options.pitch || 1;
    this.utterance.volume = this.options.volume || 1;
    this.utterance.lang = this.options.lang || 'en-GB';
    
    // Set voice if specified
    if (this.options.voice) {
      const voice = this.state.availableVoices.find(v => v.name === this.options.voice);
      if (voice) {
        this.utterance.voice = voice;
      }
    }
    
    // Set up events
    this.utterance.onstart = () => {
      if (this.highlightCallback && this.options.highlightText) {
        this.highlightCallback(sentence, 0, sentence.length);
      }
    };
    
    this.utterance.onend = () => {
      // Update progress
      this.state.currentPosition += sentence.length;
      this.state.progress = Math.min(
        100, 
        Math.round((this.state.currentPosition / (this.state.currentPosition + this.getQueueLength())) * 100)
      );
      
      // Speak next sentence
      this.speakNextSentence();
    };
    
    this.utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      
      // Try to continue with next sentence
      this.speakNextSentence();
    };
    
    // Start speaking
    this.synthesis.speak(this.utterance);
  }
  
  /**
   * Get total length of text in queue
   */
  private getQueueLength(): number {
    return this.textQueue.reduce((total, sentence) => total + sentence.length, 0);
  }
  
  /**
   * Pause speaking
   */
  public pause(): void {
    if (!this.synthesis || !this.state.isReading) return;
    
    this.synthesis.pause();
  }
  
  /**
   * Resume speaking
   */
  public resume(): void {
    if (!this.synthesis || !this.state.isReading) return;
    
    this.synthesis.resume();
  }
  
  /**
   * Stop speaking
   */
  public stop(): void {
    if (!this.synthesis) return;
    
    this.synthesis.cancel();
    this.textQueue = [];
    this.state.isReading = false;
    this.state.currentPosition = 0;
    this.state.currentSentence = '';
    this.state.progress = 0;
  }
  
  /**
   * Check if currently speaking
   */
  public isSpeaking(): boolean {
    return this.state.isReading;
  }
  
  /**
   * Get current state
   */
  public getState(): TextToSpeechState {
    return { ...this.state };
  }
  
  /**
   * Update options
   */
  public updateOptions(options: Partial<TextToSpeechOptions>): void {
    const wasReading = this.state.isReading;
    const currentText = this.state.currentSentence + this.textQueue.join('');
    
    if (wasReading) {
      this.stop();
    }
    
    this.options = {
      ...this.options,
      ...options
    };
    
    if (wasReading && currentText) {
      this.speak(currentText);
    }
  }
}

// Export singleton instance
let textToSpeechService: TextToSpeechService | null = null;

export function getTextToSpeechService(options?: TextToSpeechOptions): TextToSpeechService {
  if (!textToSpeechService) {
    textToSpeechService = new TextToSpeechService(options);
  } else if (options) {
    textToSpeechService.updateOptions(options);
  }
  
  return textToSpeechService;
}
