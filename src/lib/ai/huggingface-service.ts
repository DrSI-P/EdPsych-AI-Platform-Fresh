import { env } from '@/env.mjs';
import fetch from 'node-fetch';

// Hugging Face models integration
export class HuggingFaceService {
  private apiKey: string;
  private baseUrl: string = 'https://api-inference.huggingface.co/models';
  
  constructor() {
    this.apiKey = env.HUGGINGFACE_API_KEY;
  }
  
  /**
   * Make a request to the Hugging Face Inference API
   */
  private async query(model: string, payload): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Hugging Face API error: ${error}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Hugging Face API error for model ${model}:`, error);
      throw new Error(`Failed to query Hugging Face model: ${error.message}`);
    }
  }
  
  /**
   * Generate text using a text generation model
   */
  async generateText(prompt: string, options: {
    model?: string;
    maxLength?: number;
    temperature?: number;
    topK?: number;
    topP?: number;
    repetitionPenalty?: number;
  } = {}) {
    try {
      const {
        model = 'gpt2',
        maxLength = 100,
        temperature = 0.7,
        topK = 50,
        topP = 0.95,
        repetitionPenalty = 1.0
      } = options;
      
      const payload = {
        inputs: prompt,
        parameters: {
          max_length: maxLength,
          temperature,
          top_k: topK,
          top_p: topP,
          repetition_penalty: repetitionPenalty,
          do_sample: true
        }
      };
      
      const result = await this.query(model, payload);
      
      if (Array.isArray(result) && result.length > 0) {
        return result[0].generated_text;
      }
      
      return result.generated_text || '';
    } catch (error) {
      console.error('Hugging Face text generation error:', error);
      throw new Error(`Failed to generate text: ${error.message}`);
    }
  }
  
  /**
   * Summarize text using a summarization model
   */
  async summarizeText(text: string, options: {
    model?: string;
    maxLength?: number;
    minLength?: number;
  } = {}) {
    try {
      const {
        model = 'facebook/bart-large-cnn',
        maxLength = 130,
        minLength = 30
      } = options;
      
      const payload = {
        inputs: text,
        parameters: {
          max_length: maxLength,
          min_length: minLength,
          do_sample: false
        }
      };
      
      const result = await this.query(model, payload);
      
      if (Array.isArray(result) && result.length > 0) {
        return result[0].summary_text;
      }
      
      return result.summary_text || '';
    } catch (error) {
      console.error('Hugging Face summarization error:', error);
      throw new Error(`Failed to summarize text: ${error.message}`);
    }
  }
  
  /**
   * Classify text using a text classification model
   */
  async classifyText(text: string, options: {
    model?: string;
  } = {}) {
    try {
      const {
        model = 'distilbert-base-uncased-finetuned-sst-2-english'
      } = options;
      
      const payload = {
        inputs: text
      };
      
      const result = await this.query(model, payload);
      
      if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
        return result[0];
      }
      
      return result;
    } catch (error) {
      console.error('Hugging Face text classification error:', error);
      throw new Error(`Failed to classify text: ${error.message}`);
    }
  }
  
  /**
   * Answer questions using a question-answering model
   */
  async answerQuestion(question: string, context: string, options: {
    model?: string;
  } = {}) {
    try {
      const {
        model = 'deepset/roberta-base-squad2'
      } = options;
      
      const payload = {
        inputs: {
          question,
          context
        }
      };
      
      const result = await this.query(model, payload);
      
      return {
        answer: result.answer,
        score: result.score,
        start: result.start,
        end: result.end
      };
    } catch (error) {
      console.error('Hugging Face question answering error:', error);
      throw new Error(`Failed to answer question: ${error.message}`);
    }
  }
  
  /**
   * Translate text using a translation model
   */
  async translateText(text: string, options: {
    model?: string;
    sourceLanguage?: string;
    targetLanguage?: string;
  } = {}) {
    try {
      const {
        model = 'Helsinki-NLP/opus-mt-en-fr',
        sourceLanguage = 'en',
        targetLanguage = 'fr'
      } = options;
      
      // For Helsinki-NLP models, use the appropriate model for the language pair
      const actualModel = model === 'Helsinki-NLP/opus-mt-en-fr' 
        ? `Helsinki-NLP/opus-mt-${sourceLanguage}-${targetLanguage}`
        : model;
      
      const payload = {
        inputs: text
      };
      
      const result = await this.query(actualModel, payload);
      
      if (Array.isArray(result) && result.length > 0) {
        return result[0].translation_text;
      }
      
      return result.translation_text || '';
    } catch (error) {
      console.error('Hugging Face translation error:', error);
      throw new Error(`Failed to translate text: ${error.message}`);
    }
  }
  
  /**
   * Generate educational content using a text generation model
   */
  async generateEducationalContent(topic: string, ageGroup: string, options: {
    model?: string;
    maxLength?: number;
    format?: 'lesson' | 'quiz' | 'activity';
  } = {}) {
    try {
      const {
        model = 'gpt2',
        maxLength = 500,
        format = 'lesson'
      } = options;
      
      let prompt = '';
      
      switch (format) {
        case 'lesson':
          prompt = `Create an educational lesson about ${topic} for ${ageGroup} students. Include an introduction, key concepts, examples, and a summary.`;
          break;
        case 'quiz':
          prompt = `Create a quiz about ${topic} for ${ageGroup} students. Include 5 questions with multiple choice answers and explanations.`;
          break;
        case 'activity':
          prompt = `Create an engaging activity about ${topic} for ${ageGroup} students. Include objectives, materials needed, step-by-step instructions, and reflection questions.`;
          break;
      }
      
      return this.generateText(prompt, {
        model,
        maxLength,
        temperature: 0.7
      });
    } catch (error) {
      console.error('Hugging Face educational content generation error:', error);
      throw new Error(`Failed to generate educational content: ${error.message}`);
    }
  }
  
  /**
   * Analyse student text for reading level and complexity
   */
  async analyzeReadingLevel(text: string) {
    try {
      // First, classify the text complexity
      const complexityResult = await this.classifyText(text, {
        model: 'cross-encoder/ms-marco-MiniLM-L-12-v2' // Using a relevance model as proxy
      });
      
      // Then, summarize the text to extract key concepts
      const summary = await this.summarizeText(text, {
        maxLength: 100,
        minLength: 30
      });
      
      // Calculate basic readability metrics
      const words = text.split(/\s+/).filter(word => word.length > 0);
      const sentences = text.split(/[.!?]+/).filter(sentence => sentence.length > 0);
      const wordsPerSentence = words.length / sentences.length;
      
      // Count syllables (very simplified)
      const syllables = words.reduce((count, word) => {
        return count + (word.match(/[aeiouy]{1,2}/g)?.length || 1);
      }, 0);
      
      const syllablesPerWord = syllables / words.length;
      
      // Calculate Flesch-Kincaid Grade Level (simplified)
      const fleschKincaidGradeLevel = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
      
      // Map to UK year groups
      let yearGroup = 'Unknown';
      if (fleschKincaidGradeLevel <= 1) yearGroup = 'Reception';
      else if (fleschKincaidGradeLevel <= 2) yearGroup = 'Year 1';
      else if (fleschKincaidGradeLevel <= 3) yearGroup = 'Year 2';
      else if (fleschKincaidGradeLevel <= 4) yearGroup = 'Year 3';
      else if (fleschKincaidGradeLevel <= 5) yearGroup = 'Year 4';
      else if (fleschKincaidGradeLevel <= 6) yearGroup = 'Year 5';
      else if (fleschKincaidGradeLevel <= 7) yearGroup = 'Year 6';
      else if (fleschKincaidGradeLevel <= 8) yearGroup = 'Year 7';
      else if (fleschKincaidGradeLevel <= 9) yearGroup = 'Year 8';
      else if (fleschKincaidGradeLevel <= 10) yearGroup = 'Year 9';
      else if (fleschKincaidGradeLevel <= 11) yearGroup = 'Year 10';
      else if (fleschKincaidGradeLevel <= 12) yearGroup = 'Year 11';
      else yearGroup = 'Year 12+';
      
      return {
        readabilityMetrics: {
          fleschKincaidGradeLevel: fleschKincaidGradeLevel.toFixed(1),
          wordsPerSentence: wordsPerSentence.toFixed(1),
          syllablesPerWord: syllablesPerWord.toFixed(1),
          wordCount: words.length,
          sentenceCount: sentences.length
        },
        estimatedYearGroup: yearGroup,
        keyConcepts: summary,
        complexity: complexityResult
      };
    } catch (error) {
      console.error('Hugging Face reading level analysis error:', error);
      throw new Error(`Failed to analyse reading level: ${error.message}`);
    }
  }
  
  /**
   * Implement caching for AI responses to improve performance and reduce API calls
   */
  private cache: Map<string, { result, timestamp: number }> = new Map();
  private cacheTTL: number = 3600000; // 1 hour in milliseconds
  
  async getCachedResponse(cacheKey: string, fetchFunction: () => Promise<any>) {
    // Check if we have a cached response
    const cachedItem = this.cache.get(cacheKey);
    
    if (cachedItem && (Date.now() - cachedItem.timestamp) < this.cacheTTL) {
      console.log(`Using cached response for ${cacheKey}`);
      return cachedItem.result;
    }
    
    // If no cache hit or cache expired, fetch new data
    const result = await fetchFunction();
    
    // Cache the new result
    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });
    
    return result;
  }
  
  // Example of using the cache
  async generateTextWithCache(prompt: string, options = {}) {
    const cacheKey = `generateText:${prompt}:${JSON.stringify(options)}`;
    
    return this.getCachedResponse(cacheKey, () => 
      this.generateText(prompt, options)
    );
  }
}

// Export a singleton instance
export const huggingFaceService = new HuggingFaceService();
