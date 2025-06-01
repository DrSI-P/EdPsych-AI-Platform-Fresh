'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toast';
import { AIProvider } from '@/lib/ai/ai-service';

interface AIConfigurationProps {
  className?: string;
}

export function AIConfiguration({
  className = ''
}: AIConfigurationProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // AI configuration data
  const [config, setConfig] = useState({
    defaultProvider: 'openai' as AIProvider,
    defaultModel: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: 'You are an educational assistant helping students and teachers with learning tasks. Always provide UK-curriculum aligned responses and use UK English spelling.',
    safetySettings: {
      contentFiltering: true,
      blockSensitiveTopics: true,
      ageAppropriate: 'school',
      profanityFilter: true
    },
    providers: {
      openai: {
        enabled: true,
        models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        defaultModel: 'gpt-4o'
      },
      anthropic: {
        enabled: true,
        models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
        defaultModel: 'claude-3-opus'
      },
      gemini: {
        enabled: true,
        models: ['gemini-pro', 'gemini-ultra'],
        defaultModel: 'gemini-pro'
      },
      grok: {
        enabled: true,
        models: ['grok-1'],
        defaultModel: 'grok-1'
      },
      openrouter: {
        enabled: true,
        models: ['openai/gpt-4o', 'anthropic/claude-3-opus', 'meta/llama-3'],
        defaultModel: 'openai/gpt-4o'
      }
    },
    usageSettings: {
      rateLimit: 100,
      userQuota: {
        enabled: true,
        dailyLimit: 50,
        monthlyLimit: 1000
      },
      costManagement: {
        enabled: true,
        budgetCap: 100
      }
    },
    educationalSettings: {
      ageGroup: 'all',
      curriculumAlignment: 'uk_national',
      subjectSpecialisation: false,
      difficultyAdaptation: true,
      feedbackStyle: 'constructive'
    }
  });
  
  // Fetch current configuration on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/ai/config');
        if (response.ok) {
          const data = await response.json();
          // Merge fetched data with default config
          setConfig(prev => ({
            ...prev,
            defaultProvider: data.defaultProvider || prev.defaultProvider,
            defaultModel: data.defaultModel || prev.defaultModel,
          }));
        }
      } catch (error) {
        console.error('Error fetching AI configuration:', error);
        showToast({
          title: 'Failed to load configuration',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfig();
  }, [showToast]);
  
  // Handle configuration change
  const handleConfigChange = (section: string, setting: string, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: value
      }
    }));
    setSaved(false);
  };
  
  // Handle nested configuration change
  const handleNestedConfigChange = (section: string, subsection: string, setting: string, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...prev[section as keyof typeof prev][subsection as any],
          [setting]: value
        }
      }
    }));
    setSaved(false);
  };
  
  // Handle direct setting change
  const handleSettingChange = (setting: string, value) => {
    setConfig(prev => ({
      ...prev,
      [setting]: value
    }));
    setSaved(false);
  };
  
  // Handle save configuration
  const handleSaveConfig = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/ai/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          defaultProvider: config.defaultProvider,
          defaultModel: config.defaultModel,
          systemPrompt: config.systemPrompt,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          safetySettings: config.safetySettings,
          educationalSettings: config.educationalSettings
        })
      });
      
      if (response.ok) {
        setSaved(true);
        showToast({
          title: 'AI configuration saved',
          type: 'success'
        });
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving AI configuration:', error);
      showToast({
        title: 'Failed to save configuration',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Reset saved state when config changes
  useEffect(() => {
    setSaved(false);
  }, [config]);
  
  const tabs = [
    {
      id: 'general',
      label: 'General Settings',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">AI Provider Configuration</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Default AI Provider</label>
                <Select
                  options={[
                    { value: 'openai', label: 'OpenAI' },
                    { value: 'anthropic', label: 'Anthropic' },
                    { value: 'gemini', label: 'Google Gemini' },
                    { value: 'grok', label: 'GROK' },
                    { value: 'openrouter', label: 'OpenRouter' }
                  ]}
                  value={config.defaultProvider}
                  onChange={(value) => handleSettingChange('defaultProvider', value)}
                  className="w-full"
                />
                <p className="text-xs text-grey-500 mt-1">The default AI provider to use when no specific provider is requested</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Default Model</label>
                <Select
                  options={[
                    { value: 'gpt-4o', label: 'GPT-4o' },
                    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
                    { value: 'gemini-pro', label: 'Gemini Pro' },
                    { value: 'grok-1', label: 'Grok-1' }
                  ]}
                  value={config.defaultModel}
                  onChange={(value) => handleSettingChange('defaultModel', value)}
                  className="w-full"
                />
                <p className="text-xs text-grey-500 mt-1">The default model to use when no specific model is requested</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">System Prompt</label>
                <Textarea
                  value={config.systemPrompt}
                  onChange={(e) => handleSettingChange('systemPrompt', e.target.value)}
                  className="w-full h-24"
                />
                <p className="text-xs text-grey-500 mt-1">Default system prompt to use for all AI interactions</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Generation Parameters</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Temperature: {config.temperature}</label>
                <div className="flex items-centre gap-2">
                  <span className="text-sm">0.0</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.1" 
                    value={config.temperature}
                    onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                    className="w-full" 
                  />
                  <span className="text-sm">2.0</span>
                </div>
                <p className="text-xs text-grey-500 mt-1">Controls randomness: lower values are more deterministic, higher values more creative</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Maximum Tokens</label>
                <Input 
                  type="number"
                  value={config.maxTokens}
                  onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-grey-500 mt-1">Maximum number of tokens to generate in responses</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Top P: {config.topP}</label>
                <div className="flex items-centre gap-2">
                  <span className="text-sm">0.0</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={config.topP}
                    onChange={(e) => handleSettingChange('topP', parseFloat(e.target.value))}
                    className="w-full" 
                  />
                  <span className="text-sm">1.0</span>
                </div>
                <p className="text-xs text-grey-500 mt-1">Controls diversity via nucleus sampling</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Frequency Penalty: {config.frequencyPenalty}</label>
                <div className="flex items-centre gap-2">
                  <span className="text-sm">0.0</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.1" 
                    value={config.frequencyPenalty}
                    onChange={(e) => handleSettingChange('frequencyPenalty', parseFloat(e.target.value))}
                    className="w-full" 
                  />
                  <span className="text-sm">2.0</span>
                </div>
                <p className="text-xs text-grey-500 mt-1">Reduces repetition of token sequences</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Presence Penalty: {config.presencePenalty}</label>
                <div className="flex items-centre gap-2">
                  <span className="text-sm">0.0</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.1" 
                    value={config.presencePenalty}
                    onChange={(e) => handleSettingChange('presencePenalty', parseFloat(e.target.value))}
                    className="w-full" 
                  />
                  <span className="text-sm">2.0</span>
                </div>
                <p className="text-xs text-grey-500 mt-1">Reduces repetition of topics</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'safety',
      label: 'Safety & Compliance',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Content Safety Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="Enable content filtering"
                  checked={config.safetySettings.contentFiltering}
                  onChange={(checked) => handleNestedConfigChange('safetySettings', 'safetySettings', 'contentFiltering', checked)}
                  description="Filter out potentially harmful or inappropriate content"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Block sensitive topics"
                  checked={config.safetySettings.blockSensitiveTopics}
                  onChange={(checked) => handleNestedConfigChange('safetySettings', 'safetySettings', 'blockSensitiveTopics', checked)}
                  description="Prevent responses on sensitive or controversial topics"
                />
              </div>
              
              <div>
                <Checkbox 
                  label="Enable profanity filter"
                  checked={config.safetySettings.profanityFilter}
                  onChange={(checked) => handleNestedConfigChange('safetySettings', 'safetySettings', 'profanityFilter', checked)}
                  description="Filter out profanity and inappropriate language"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Age-appropriate content</label>
                <Select
                  options={[
                    { value: 'early_years', label: 'Early Years (3-5)' },
                    { value: 'primary', label: 'Primary (5-11)' },
                    { value: 'secondary', label: 'Secondary (11-16)' },
                    { value: 'sixth_form', label: 'Sixth Form (16-18)' },
                    { value: 'school', label: 'All School Ages' },
                    { value: 'adult', label: 'Adult (18+)' }
                  ]}
                  value={config.safetySettings.ageAppropriate}
                  onChange={(value) => handleNestedConfigChange('safetySettings', 'safetySettings', 'ageAppropriate', value)}
                  className="w-full"
                />
                <p className="text-xs text-grey-500 mt-1">Ensure content is appropriate for the selected age group</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Educational Compliance</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Curriculum Alignment</label>
                <Select
                  options={[
                    { value: 'uk_national', label: 'UK National Curriculum' },
                    { value: 'uk_eyfs', label: 'UK Early Years Foundation Stage' },
                    { value: 'uk_gcse', label: 'UK GCSE' },
                    { value: 'uk_a_level', label: 'UK A-Level' },
                    { value: 'international', label: 'International Curriculum' }
                  ]}
                  value={config.educationalSettings.curriculumAlignment}
                  onChange={(value) => handleNestedConfigChange('educationalSettings', 'educationalSettings', 'curriculumAlignment', value)}
                  className="w-full"
                />
                <p className="text-xs text-grey-500 mt-1">Align AI responses with the selected curriculum standards</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Target Age Group</label>
                <Select
                  options={[
                    { value: 'early_years', label: 'Early Years (3-5)' },
                    { value: 'ks1', label: 'Key Stage 1 (5-7)' },
                    { value: 'ks2', label: 'Key Stage 2 (7-11)' },
                    { value: 'ks3', label: 'Key Stage 3 (11-14)' },
                    { value: 'ks4', label: 'Key Stage 4 (14-16)' },
                    { value: 'ks5', label: 'Key Stage 5 (16-18)' },
                    { value: 'all', label: 'All Age Groups' }
                  ]}
                  value={config.educationalSettings.ageGroup}
                  onChange={(value) => handleNestedConfigChange('educationalSettings', 'educationalSettings', 'ageGroup', value)}
                  className="w-full"
                />
                <p className="text-xs text-grey-500 mt-1">Target age group for educational content</p>
              </div>
              
              <div>
                <Checkbox 
                  label="Enable difficulty adaptation"
                  checked={config.educationalSettings.difficultyAdaptation}
                  onChange={(checked) => handleNestedConfigChange('educationalSettings', 'educationalSettings', 'difficultyAdaptation', checked)}
                  description="Automatically adapt content difficulty based on user interactions"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Feedback Style</label>
                <Select
                  options={[
                    { value: 'constructive', label: 'Constructive' },
                    { value: 'encouraging', label: 'Encouraging' },
                    { value: 'detailed', label: 'Detailed' },
                    { value: 'concise', label: 'Concise' },
                    { value: 'socratic', label: 'Socratic' }
                  ]}
                  value={config.educationalSettings.feedbackStyle}
                  onChange={(value) => handleNestedConfigChange('educationalSettings', 'educationalSettings', 'feedbackStyle', value)}
                  className="w-full"
                />
                <p className="text-xs text-grey-500 mt-1">Style of feedback provided to learners</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'usage',
      label: 'Usage & Cost',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Usage Limits</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rate Limit (requests per minute)</label>
                <Input 
                  type="number"
                  value={config.usageSettings.rateLimit}
                  onChange={(e) => handleNestedConfigChange('usageSettings', 'usageSettings', 'rateLimit', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-grey-500 mt-1">Maximum number of AI requests per minute</p>
              </div>
              
              <div>
                <Checkbox 
                  label="Enable user quotas"
                  checked={config.usageSettings.userQuota.enabled}
                  onChange={(checked) => handleNestedConfigChange('usageSettings', 'usageSettings', 'userQuota', {
                    ...config.usageSettings.userQuota,
                    enabled: checked
                  })}
                  description="Set limits on AI usage per user"
                />
              </div>
              
              {config.usageSettings.userQuota.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Daily User Limit</label>
                    <Input 
                      type="number"
                      value={config.usageSettings.userQuota.dailyLimit}
                      onChange={(e) => handleNestedConfigChange('usageSettings', 'usageSettings', 'userQuota', {
                        ...config.usageSettings.userQuota,
                        dailyLimit: parseInt(e.target.value)
                      })}
                      className="w-full"
                    />
                    <p className="text-xs text-grey-500 mt-1">Maximum AI requests per user per day</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly User Limit</label>
                    <Input 
                      type="number"
                      value={config.usageSettings.userQuota.monthlyLimit}
                      onChange={(e) => handleNestedConfigChange('usageSettings', 'usageSettings', 'userQuota', {
                        ...config.usageSettings.userQuota,
                        monthlyLimit: parseInt(e.target.value)
                      })}
                      className="w-full"
                    />
                    <p className="text-xs text-grey-500 mt-1">Maximum AI requests per user per month</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Cost Management</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Checkbox 
                  label="Enable cost management"
                  checked={config.usageSettings.costManagement.enabled}
                  onChange={(checked) => handleNestedConfigChange('usageSettings', 'usageSettings', 'costManagement', {
                    ...config.usageSettings.costManagement,
                    enabled: checked
                  })}
                  description="Set budget limits for AI usage"
                />
              </div>
              
              {config.usageSettings.costManagement.enabled && (
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Budget Cap (£)</label>
                  <Input 
                    type="number"
                    value={config.usageSettings.costManagement.budgetCap}
                    onChange={(e) => handleNestedConfigChange('usageSettings', 'usageSettings', 'costManagement', {
                      ...config.usageSettings.costManagement,
                      budgetCap: parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                  <p className="text-xs text-grey-500 mt-1">Maximum monthly spending on AI services</p>
                </div>
              )}
              
              <div className="mt-4">
                <Alert type="info">
                  <p>Cost optimisation is enabled. The system will automatically select the most cost-effective AI provider based on the task requirements.</p>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'providers',
      label: 'Provider Settings',
      content: (
        <div className="space-y-6">
          {Object.entries(config.providers).map(([provider, settings]) => (
            <Card key={provider}>
              <CardHeader>
                <h3 className="text-lg font-semibold">{provider.charAt(0).toUpperCase() + provider.slice(1)} Settings</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Checkbox 
                    label={`Enable ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
                    checked={settings.enabled}
                    onChange={(checked) => handleNestedConfigChange('providers', provider, 'enabled', checked)}
                    description={`Use ${provider.charAt(0).toUpperCase() + provider.slice(1)} as an AI provider`}
                  />
                </div>
                
                {settings.enabled && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Default Model</label>
                    <Select
                      options={settings.models.map(model => ({ value: model, label: model }))}
                      value={settings.defaultModel}
                      onChange={(value) => handleNestedConfigChange('providers', provider, 'defaultModel', value)}
                      className="w-full"
                    />
                    <p className="text-xs text-grey-500 mt-1">Default model to use for this provider</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }
  ];
  
  return (
    <div className={`ai-configuration ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">AI Configuration</h2>
        <p className="text-grey-600">Configure AI providers, models, and settings for the EdPsych AI Education Platform</p>
      </div>
      
      {loading && (
        <div className="flex justify-centre my-8">
          <Spinner size="large" />
        </div>
      )}
      
      {!loading && (
        <>
          <Tabs tabs={tabs} />
          
          <div className="mt-6 flex justify-end">
            {saved && (
              <Alert type="success" className="mr-4">
                Configuration saved successfully
              </Alert>
            )}
            <Button 
              onClick={handleSaveConfig} 
              disabled={loading || saved}
              loading={loading}
            >
              Save Configuration
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
