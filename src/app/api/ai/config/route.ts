import { NextRequest, NextResponse } from 'next/server';
import aiService from '@/lib/ai/ai-service';

// Define AIProvider type locally since it's not exported from ai-service
type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'grok' | 'openrouter';

// Define environment variable keys for each provider
const PROVIDER_API_KEYS = {
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  gemini: 'GEMINI_API_KEY',
  grok: 'GROK_API_KEY',
  openrouter: 'OPENROUTER_API_KEY'
};

// Get AI configuration
export async function GET() {
  try {
    // Check which providers are configured
    const configuredProviders: Record<AIProvider, boolean> = {
      openai: !!process.env[PROVIDER_API_KEYS.openai],
      anthropic: !!process.env[PROVIDER_API_KEYS.anthropic],
      gemini: !!process.env[PROVIDER_API_KEYS.gemini],
      grok: !!process.env[PROVIDER_API_KEYS.grok],
      openrouter: !!process.env[PROVIDER_API_KEYS.openrouter]
    };
    
    // Determine default provider (first available one)
    let defaultProvider: AIProvider | undefined = undefined;
    for (const [provider, configured] of Object.entries(configuredProviders)) {
      if (configured) {
        defaultProvider = provider as AIProvider;
        break;
      }
    }
    
    // Default model for the provider
    const defaultModels: Record<AIProvider, string> = {
      openai: 'gpt-4-turbo',
      anthropic: 'claude-3-opus',
      gemini: 'gemini-pro',
      grok: 'grok-1',
      openrouter: 'openrouter-router'
    };
    
    return NextResponse.json({
      configured: Object.values(configuredProviders).some(Boolean),
      providers: configuredProviders,
      defaultProvider: defaultProvider || 'openai',
      defaultModel: defaultProvider ? defaultModels[defaultProvider] : 'gpt-4-turbo'
    });
  } catch (error) {
    console.error('Error getting AI configuration:', error);
    return NextResponse.json(
      { error: 'Failed to get AI configuration' },
      { status: 500 }
    );
  }
}

// Update AI configuration
export async function POST(request: NextRequest) {
  try {
    const { defaultProvider, defaultModel } = await request.json();
    
    // In a real application, this would update the configuration in a database
    // For now, we'll just return the updated configuration
    
    return NextResponse.json({
      success: true,
      defaultProvider,
      defaultModel
    });
  } catch (error) {
    console.error('Error updating AI configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update AI configuration' },
      { status: 500 }
    );
  }
}
