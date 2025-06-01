'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useAIService } from '@/lib/ai/ai-service';

// Define types that are missing from the ai-service export
type AIProvider = string;
type AIModel = {
  id: string;
  name: string;
  provider: string;
};

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
}

// Custom Select component that matches the expected interface
const Select = ({ label, value, onChange, options, className = '' }: SelectProps) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface AIPromptProps {
  onCompletion?: (result: string) => void;
  initialPrompt?: string;
  placeholder?: string;
  systemPrompt?: string;
  className?: string;
}

export function AIPrompt({
  onCompletion,
  initialPrompt = '',
  placeholder = 'Enter your question or prompt here...',
  systemPrompt = 'You are a helpful educational assistant using UK English spelling and following UK educational standards. Provide clear, accurate, and age-appropriate responses.',
  className = ''
}: AIPromptProps) {
  // Only use properties that actually exist in useAIService
  const { isConfigured } = useAIService();
  
  // Mock these values since they don't exist in the actual service
  const defaultProvider = 'openai';
  const defaultModel = 'gpt-4';
  const allModels: any[] = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'openai' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' },
    { id: 'claude-3', name: 'Claude 3', provider: 'anthropic' }
  ];
  
  const [provider, setProvider] = useState<AIProvider>(defaultProvider);
  const [model, setModel] = useState<string>(defaultModel);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get models for the selected provider
  const getModelsForProvider = (provider: AIProvider) => {
    return allModels.filter(model => model.provider === provider);
  };
  
  // Get models for the selected provider
  const availableModels = getModelsForProvider(provider);
  
  // Handle provider change
  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    
    // Set default model for the new provider
    const models = getModelsForProvider(newProvider);
    if (models.length > 0) {
      setModel(models[0].id);
    }
  };
  
  // Handle model change
  const handleModelChange = (newModel: string) => {
    setModel(newModel);
  };
  
  // Handle prompt change
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/ai/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider,
          model,
          prompt,
          systemPrompt
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI completion');
      }
      
      setResult(data.text);
      onCompletion?.(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isConfigured) {
    return (
      <Alert variant="warning" title="AI Services Not Configured">
        AI services are not configured. Please add API keys in the environment configuration.
      </Alert>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-medium">AI Assistant</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <Select
              label="AI Provider"
              value={provider}
              onChange={handleProviderChange}
              options={allModels
                .map(model => model.provider)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map(provider => ({
                  value: provider,
                  label: provider.charAt(0).toUpperCase() + provider.slice(1)
                }))}
              className="w-1/2"
            />
            
            <Select
              label="Model"
              value={model}
              onChange={handleModelChange}
              options={availableModels.map(model => ({
                value: model.id,
                label: model.name
              }))}
              className="w-1/2"
            />
          </div>
          
          <Textarea
            label="Prompt"
            value={prompt}
            onChange={handlePromptChange}
            placeholder={placeholder}
            rows={4}
            required
          />
          
          {error && (
            <Alert variant="destructive" dismissible>
              {error}
            </Alert>
          )}
          
          {result && (
            <div className="p-4 bg-grey-50 rounded-md border">
              <h4 className="text-sm font-medium mb-2">Response:</h4>
              <div className="text-sm whitespace-pre-wrap">{result}</div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? <><Spinner size="sm" className="mr-2" /> Processing...</> : 'Generate Response'}
        </Button>
      </CardFooter>
    </Card>
  );
}
