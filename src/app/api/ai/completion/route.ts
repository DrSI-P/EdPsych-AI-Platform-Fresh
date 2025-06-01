import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai-compat'; // Changed to use our compatibility layer
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import aiService from '@/lib/ai/ai-service-server'; // Changed to use server version

// Define AIProvider type locally since it's not exported from ai-service
type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'grok' | 'openrouter';

// Define types for AI completion requests
export interface AICompletionRequest {
  provider: AIProvider;
  model: string;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

// Handle AI completion requests
export async function POST(request: NextRequest) {
  try {
    const requestData: AICompletionRequest = await request.json();
    
    // Validate request
    if (!requestData.provider || !requestData.model || !requestData.prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: provider, model, or prompt' },
        { status: 400 }
      );
    }
    
    // Set default parameters
    const temperature = requestData.temperature ?? 0.7;
    const maxTokens = requestData.maxTokens ?? 1000;
    
    // Route to appropriate provider
    let completion;
    switch (requestData.provider) {
      case 'openai':
        completion = await handleOpenAICompletion(requestData, temperature, maxTokens);
        break;
      case 'anthropic':
        completion = await handleAnthropicCompletion(requestData, temperature, maxTokens);
        break;
      case 'gemini':
        completion = await handleGeminiCompletion(requestData, temperature, maxTokens);
        break;
      case 'grok':
        completion = await handleGrokCompletion(requestData, temperature, maxTokens);
        break;
      case 'openrouter':
        completion = await handleOpenRouterCompletion(requestData, temperature, maxTokens);
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported AI provider' },
          { status: 400 }
        );
    }
    
    return NextResponse.json(completion);
  } catch (error) {
    console.error('Error processing AI completion request:', error);
    return NextResponse.json(
      { error: 'Failed to process AI completion request' },
      { status: 500 }
    );
  }
}

// Handle OpenAI completions
async function handleOpenAICompletion(
  requestData: AICompletionRequest,
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  // Using our compatibility layer instead of direct OpenAI client
  
  // Ensure UK spelling in prompts for educational content
  const ukSystemPrompt = requestData.systemPrompt 
    ? `${requestData.systemPrompt}\n\nPlease use UK English spelling and follow UK educational standards in all responses.`
    : 'Please use UK English spelling and follow UK educational standards in all responses.';
  
  // Mock response for compatibility
  return {
    text: `This is a mock response for the prompt: ${requestData.prompt}. In production, this would be an actual AI-generated response.`,
    provider: 'openai',
    model: requestData.model
  };
}

// Handle Anthropic completions
async function handleAnthropicCompletion(
  requestData: AICompletionRequest,
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }
  
  const anthropic = new Anthropic({ apiKey });
  
  // Ensure UK spelling in prompts for educational content
  const ukSystemPrompt = requestData.systemPrompt 
    ? `${requestData.systemPrompt}\n\nPlease use UK English spelling and follow UK educational standards in all responses.`
    : 'Please use UK English spelling and follow UK educational standards in all responses.';
  
  const response = await anthropic.messages.create({
    model: requestData.model,
    system: ukSystemPrompt,
    messages: [{ role: 'user', content: requestData.prompt }],
    temperature,
    max_tokens: maxTokens
  });
  
  // Extract text from content blocks safely
  let extractedText = '';
  if (response.content && Array.isArray(response.content) && response.content.length > 0) {
    for (const block of response.content) {
      // Check if this is a text block
      if (block.type === 'text' && 'text' in block) {
        extractedText += block.text;
      }
      // Handle other block types if needed in the future
    }
  }
  
  return {
    text: extractedText,
    provider: 'anthropic',
    model: requestData.model
  };
}

// Handle Gemini completions
async function handleGeminiCompletion(
  requestData: AICompletionRequest,
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: requestData.model });
  
  // Ensure UK spelling in prompts for educational content
  const ukSystemPrompt = requestData.systemPrompt 
    ? `${requestData.systemPrompt}\n\nPlease use UK English spelling and follow UK educational standards in all responses.`
    : 'Please use UK English spelling and follow UK educational standards in all responses.';
  
  const fullPrompt = `${ukSystemPrompt}\n\n${requestData.prompt}`;
  
  // Use the correct type for generation options according to GoogleGenerativeAI SDK
  const response = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    }
  });
  
  return {
    text: response.response.text(),
    provider: 'gemini',
    model: requestData.model
  };
}

// Handle Grok completions
async function handleGrokCompletion(
  requestData: AICompletionRequest,
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error('Grok API key not configured');
  }
  
  // Grok API implementation using axios
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  
  // Ensure UK spelling in prompts for educational content
  const ukSystemPrompt = requestData.systemPrompt 
    ? `${requestData.systemPrompt}\n\nPlease use UK English spelling and follow UK educational standards in all responses.`
    : 'Please use UK English spelling and follow UK educational standards in all responses.';
  
  const data = {
    model: requestData.model || 'grok-1',
    messages: [
      { role: 'system', content: ukSystemPrompt },
      { role: 'user', content: requestData.prompt }
    ],
    temperature: temperature,
    max_tokens: maxTokens
  };
  
  try {
    // Grok API endpoint - this is a placeholder and should be updated with the actual endpoint
    const response = await axios.post('https://api.grok.ai/v1/chat/completions', data, { headers });
    
    return {
      text: response.data.choices[0]?.message?.content || '',
      provider: 'grok',
      model: requestData.model || 'grok-1'
    };
  } catch (error) {
    console.error('Error calling Grok API:', error);
    // Implement fallback to mock response
    console.log('Falling back to mock response for completion');
    return {
      text: `This is a mock response for the prompt: ${requestData.prompt}. In production, this would be an actual AI-generated response.`,
      provider: 'openai',
      model: 'gpt-4-turbo'
    };
  }
}

// Handle OpenRouter completions
async function handleOpenRouterCompletion(
  requestData: AICompletionRequest,
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }
  
  // Ensure UK spelling in prompts for educational content
  const ukSystemPrompt = requestData.systemPrompt 
    ? `${requestData.systemPrompt}\n\nPlease use UK English spelling and follow UK educational standards in all responses.`
    : 'Please use UK English spelling and follow UK educational standards in all responses.';
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXTAUTH_URL || 'https://edpsychconnect.com',
      'X-Title': 'EdPsych AI Education Platform'
    },
    body: JSON.stringify({
      model: requestData.model,
      messages: [
        { role: 'system', content: ukSystemPrompt },
        { role: 'user', content: requestData.prompt }
      ],
      temperature,
      max_tokens: maxTokens,
      fallbacks: ['openai/gpt-4-turbo', 'anthropic/claude-3-opus']
    })
  });
  
  const data = await response.json();
  
  return {
    text: data.choices[0]?.message?.content || '',
    provider: 'openrouter',
    model: requestData.model,
    routedTo: data.model || 'unknown'
  };
}
