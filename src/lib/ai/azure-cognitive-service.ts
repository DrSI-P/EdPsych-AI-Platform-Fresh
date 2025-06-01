import { env } from '@/env.mjs';
import { TextAnalyticsClient, AzureKeyCredential } from '@azure/ai-text-analytics';
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import { SpeechConfig, SpeechRecognizer, AudioConfig, ResultReason } from 'microsoft-cognitiveservices-speech-sdk';

// Azure Cognitive Services integration
export class AzureCognitiveService {
  private textAnalyticsClient: TextAnalyticsClient;
  private computerVisionClient: ComputerVisionClient;
  
  constructor() {
    // Initialize Text Analytics client
    this.textAnalyticsClient = new TextAnalyticsClient(
      env.AZURE_COGNITIVE_ENDPOINT,
      new AzureKeyCredential(env.AZURE_COGNITIVE_KEY)
    );
    
    // Initialize Computer Vision client
    this.computerVisionClient = new ComputerVisionClient(
      new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': env.AZURE_COGNITIVE_KEY } }),
      env.AZURE_COGNITIVE_ENDPOINT
    );
  }
  
  /**
   * Analyse sentiment of text
   */
  async analyzeSentiment(text: string, language: string = 'en') {
    try {
      const results = await this.textAnalyticsClient.analyzeSentiment([text], { language });
      
      if (!results[0] || results[0].error) {
        throw new Error(results[0]?.error?.message || 'Failed to analyse sentiment');
      }
      
      return {
        sentiment: results[0].sentiment,
        confidenceScores: results[0].confidenceScores,
        sentences: results[0].sentences.map(sentence => ({
          text: sentence.text,
          sentiment: sentence.sentiment,
          confidenceScores: sentence.confidenceScores
        }))
      };
    } catch (error) {
      console.error('Azure sentiment analysis error:', error);
      throw new Error(`Failed to analyse sentiment: ${error.message}`);
    }
  }
  
  /**
   * Extract key phrases from text
   */
  async extractKeyPhrases(text: string, language: string = 'en') {
    try {
      const results = await this.textAnalyticsClient.extractKeyPhrases([text], { language });
      
      if (!results[0] || results[0].error) {
        throw new Error(results[0]?.error?.message || 'Failed to extract key phrases');
      }
      
      return results[0].keyPhrases;
    } catch (error) {
      console.error('Azure key phrase extraction error:', error);
      throw new Error(`Failed to extract key phrases: ${error.message}`);
    }
  }
  
  /**
   * Detect language of text
   */
  async detectLanguage(text: string) {
    try {
      const results = await this.textAnalyticsClient.detectLanguage([text]);
      
      if (!results[0] || results[0].error) {
        throw new Error(results[0]?.error?.message || 'Failed to detect language');
      }
      
      return {
        primaryLanguage: {
          name: results[0].primaryLanguage.name,
          iso6391Name: results[0].primaryLanguage.iso6391Name,
          confidenceScore: results[0].primaryLanguage.confidenceScore
        },
        allLanguages: results[0].detectedLanguages.map(lang => ({
          name: lang.name,
          iso6391Name: lang.iso6391Name,
          confidenceScore: lang.confidenceScore
        }))
      };
    } catch (error) {
      console.error('Azure language detection error:', error);
      throw new Error(`Failed to detect language: ${error.message}`);
    }
  }
  
  /**
   * Analyse image and extract information
   */
  async analyzeImage(imageUrl: string, options: {
    visualFeatures?: string[];
    details?: string[];
    language?: string;
  } = {}) {
    try {
      const {
        visualFeatures = ['Categories', 'Description', 'Objects', 'Tags'],
        details = [],
        language = 'en'
      } = options;
      
      const results = await this.computerVisionClient.analyzeImage(imageUrl, {
        visualFeatures,
        details,
        language
      });
      
      return {
        description: results.description?.captions?.map(caption => ({
          text: caption.text,
          confidence: caption.confidence
        })),
        tags: results.tags?.map(tag => ({
          name: tag.name,
          confidence: tag.confidence
        })),
        objects: results.objects?.map(obj => ({
          object: obj.object,
          confidence: obj.confidence,
          rectangle: obj.rectangle
        })),
        categories: results.categories?.map(category => ({
          name: category.name,
          score: category.score
        }))
      };
    } catch (error) {
      console.error('Azure image analysis error:', error);
      throw new Error(`Failed to analyse image: ${error.message}`);
    }
  }
  
  /**
   * Extract text from image (OCR)
   */
  async extractTextFromImage(imageUrl: string, language: string = 'en') {
    try {
      const results = await this.computerVisionClient.read(imageUrl);
      
      // Get operation ID from URL
      const operationId = results.operationLocation.split('/').pop();
      
      // Wait for the operation to complete
      let status = 'notStarted';
      let textResults;
      
      while (status !== 'succeeded' && status !== 'failed') {
        textResults = await this.computerVisionClient.getReadResult(operationId);
        status = textResults.status;
        
        if (status === 'notStarted' || status === 'running') {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (status === 'failed') {
        throw new Error('Text extraction operation failed');
      }
      
      // Extract and format the text results
      const extractedText = textResults.analyzeResult.readResults
        .map(page => page.lines.map(line => line.text).join('\n'))
        .join('\n\n');
      
      return {
        text: extractedText,
        pages: textResults.analyzeResult.readResults.map(page => ({
          width: page.width,
          height: page.height,
          unit: page.unit,
          lines: page.lines.map(line => ({
            text: line.text,
            boundingBox: line.boundingBox,
            words: line.words.map(word => ({
              text: word.text,
              boundingBox: word.boundingBox,
              confidence: word.confidence
            }))
          }))
        }))
      };
    } catch (error) {
      console.error('Azure OCR error:', error);
      throw new Error(`Failed to extract text from image: ${error.message}`);
    }
  }
  
  /**
   * Convert speech to text
   */
  async speechToText(audioFile: string, language: string = 'en-GB') {
    return new Promise<string>((resolve, reject) => {
      try {
        const speechConfig = SpeechConfig.fromSubscription(
          env.AZURE_COGNITIVE_KEY,
          env.AZURE_COGNITIVE_REGION
        );
        
        speechConfig.speechRecognitionLanguage = language;
        
        const audioConfig = AudioConfig.fromWavFileInput(audioFile);
        const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
        
        recognizer.recognizeOnceAsync(
          result => {
            if (result.reason === ResultReason.RecognizedSpeech) {
              resolve(result.text);
            } else {
              reject(new Error(`Speech recognition failed: ${result.reason}`));
            }
            
            recognizer.close();
          },
          error => {
            reject(error);
            recognizer.close();
          }
        );
      } catch (error) {
        console.error('Azure speech-to-text error:', error);
        reject(new Error(`Failed to convert speech to text: ${error.message}`));
      }
    });
  }
  
  /**
   * Analyse educational content for readability and complexity
   */
  async analyzeEducationalContent(text: string, targetAgeGroup: string) {
    try {
      // First, analyse the text's language
      const languageResult = await this.detectLanguage(text);
      const language = languageResult.primaryLanguage.iso6391Name;
      
      // Then analyse key phrases to understand main concepts
      const keyPhrases = await this.extractKeyPhrases(text, language);
      
      // Calculate readability metrics (simplified implementation)
      const words = text.split(/\s+/).filter(word => word.length > 0);
      const sentences = text.split(/[.!?]+/).filter(sentence => sentence.length > 0);
      const syllables = this.countSyllables(text);
      
      const wordsPerSentence = words.length / sentences.length;
      const syllablesPerWord = syllables / words.length;
      
      // Calculate Flesch-Kincaid Grade Level (simplified)
      const fleschKincaidGradeLevel = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
      
      // Map grade level to age
      const ageLevel = Math.round(fleschKincaidGradeLevel + 5);
      
      // Determine if content is appropriate for target age group
      const targetAge = this.ageGroupToAge(targetAgeGroup);
      const isAppropriate = Math.abs(ageLevel - targetAge) <= 2;
      
      return {
        readabilityMetrics: {
          fleschKincaidGradeLevel: fleschKincaidGradeLevel.toFixed(1),
          wordsPerSentence: wordsPerSentence.toFixed(1),
          syllablesPerWord: syllablesPerWord.toFixed(1),
          wordCount: words.length,
          sentenceCount: sentences.length,
          estimatedAgeLevel: ageLevel
        },
        contentAnalysis: {
          keyPhrases: keyPhrases.slice(0, 10), // Top 10 key phrases
          language: languageResult.primaryLanguage.name,
          isAppropriateForTargetAge: isAppropriate,
          targetAgeGroup,
          targetAge
        },
        recommendations: this.generateReadabilityRecommendations(
          fleschKincaidGradeLevel,
          targetAge,
          wordsPerSentence,
          syllablesPerWord
        )
      };
    } catch (error) {
      console.error('Azure educational content analysis error:', error);
      throw new Error(`Failed to analyse educational content: ${error.message}`);
    }
  }
  
  // Helper method to count syllables (simplified)
  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let count = 0;
    
    for (const word of words) {
      if (word.length <= 3) {
        count += 1;
        continue;
      }
      
      // Count vowel groups as syllables
      const vowelGroups = word.match(/[aeiouy]+/g);
      if (vowelGroups) {
        count += vowelGroups.length;
      }
      
      // Subtract silent e at the end
      if (word.endsWith('e') && word.length > 2 && !/[aeiouy]/.test(word.charAt(word.length - 2))) {
        count -= 1;
      }
    }
    
    return count;
  }
  
  // Helper method to convert age group to approximate age
  private ageGroupToAge(ageGroup: string): number {
    const ageGroupMap: Record<string, number> = {
      'reception': 5,
      'year 1': 6,
      'year 2': 7,
      'year 3': 8,
      'year 4': 9,
      'year 5': 10,
      'year 6': 11,
      'year 7': 12,
      'year 8': 13,
      'year 9': 14,
      'year 10': 15,
      'year 11': 16,
      'year 12': 17,
      'year 13': 18,
      'ks1': 6,
      'ks2': 9,
      'ks3': 13,
      'ks4': 15,
      'ks5': 17,
      'primary': 8,
      'secondary': 14,
      'early years': 4
    };
    
    const normalizedAgeGroup = ageGroup.toLowerCase().trim();
    
    if (normalizedAgeGroup in ageGroupMap) {
      return ageGroupMap[normalizedAgeGroup];
    }
    
    // Try to extract a number if the age group contains digits
    const match = normalizedAgeGroup.match(/\d+/);
    if (match) {
      return parseInt(match[0], 10);
    }
    
    // Default to middle school age if unknown
    return 12;
  }
  
  // Helper method to generate readability recommendations
  private generateReadabilityRecommendations(
    gradeLevel: number,
    targetAge: number,
    wordsPerSentence: number,
    syllablesPerWord: number
  ): string[] {
    const recommendations: string[] = [];
    const targetGradeLevel = targetAge - 5;
    
    if (Math.abs(gradeLevel - targetGradeLevel) > 2) {
      if (gradeLevel > targetGradeLevel) {
        recommendations.push('The content may be too complex for the target age group.');
        
        if (wordsPerSentence > 15) {
          recommendations.push('Consider using shorter sentences to improve readability.');
        }
        
        if (syllablesPerWord > 1.5) {
          recommendations.push('Consider using simpler words with fewer syllables.');
        }
      } else {
        recommendations.push('The content may be too simple for the target age group.');
        recommendations.push('Consider introducing more complex vocabulary and sentence structures.');
      }
    } else {
      recommendations.push('The content is appropriately matched to the target age group.');
    }
    
    return recommendations;
  }
}

// Export a singleton instance
export const azureCognitiveService = new AzureCognitiveService();
