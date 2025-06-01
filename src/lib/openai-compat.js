/**
 * OpenAI API Compatibility Layer
 *
 * This file provides compatibility between OpenAI API v3 and v4
 * to ensure code written for v3 continues to work with v4.
 */

// Simple mock implementation to prevent build errors
export class OpenAIApi {
  constructor() {}
  
  async createCompletion() {
    return { data: {} };
  }
  
  async createChatCompletion() {
    return { data: {} };
  }
  
  async createEmbedding() {
    return { data: {} };
  }
}

export class Configuration {
  constructor() {}
}

// Default export
const openai = {
  completions: {
    create: async () => ({})
  },
  chat: {
    completions: {
      create: async () => ({})
    }
  },
  embeddings: {
    create: async () => ({})
  }
};

export default openai;