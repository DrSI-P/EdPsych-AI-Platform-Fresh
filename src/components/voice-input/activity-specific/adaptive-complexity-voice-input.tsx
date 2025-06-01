'use client';

import React from 'react';
import { useVoiceInput } from '@/components/VoiceInput';
import UniversalVoiceInput from '@/components/voice-input/universal-voice-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Settings, Sliders, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { AgeGroup } from '@/components/VoiceInput/VoiceInputProvider';

interface AdaptiveComplexityVoiceInputProps {
  onTranscriptChange?: (transcript: string) => void;
  onComplete?: (finalTranscript: string) => void;
  placeholder?: string;
  className?: string;
  complexityLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

/**
 * Adaptive Complexity Voice Input Component
 * 
 * Specialised voice input component for the adaptive complexity feature,
 * with optimizations for different complexity levels.
 */
export const AdaptiveComplexityVoiceInput: React.FC<AdaptiveComplexityVoiceInputProps> = ({
  onTranscriptChange,
  onComplete,
  placeholder = "Speak your response...",
  className = '',
  complexityLevel = 'intermediate'
}) => {
  const { toast } = useToast();
  const { 
    isAvailable, 
    settings, 
    updateSettings, 
    ageGroup, 
    setAgeGroup
  } = useVoiceInput();
  
  const [activeTab, setActiveTab] = React.useState<string>('input');
  
  // Adjust settings based on complexity level
  React.useEffect(() => {
    // Adjust confidence threshold based on complexity level
    let confidenceThreshold = settings.confidenceThreshold;
    
    switch (complexityLevel) {
      case 'beginner':
        confidenceThreshold = 0.5; // More forgiving for beginners
        break;
      case 'intermediate':
        confidenceThreshold = 0.6;
        break;
      case 'advanced':
        confidenceThreshold = 0.7;
        break;
      case 'expert':
        confidenceThreshold = 0.8; // More strict for experts
        break;
    }
    
    updateSettings({ confidenceThreshold });
  }, [complexityLevel, updateSettings]);
  
  // Get appropriate placeholder based on complexity level and age group
  const getPlaceholder = () => {
    if (ageGroup === 'nursery' || ageGroup === 'early-primary') {
      switch (complexityLevel) {
        case 'beginner':
          return "Tell me your answer...";
        case 'intermediate':
          return "Speak your answer...";
        case 'advanced':
          return "Say your complete answer...";
        case 'expert':
          return "Explain your answer...";
        default:
          return placeholder;
      }
    } else {
      switch (complexityLevel) {
        case 'beginner':
          return "Speak your answer...";
        case 'intermediate':
          return "Provide your response...";
        case 'advanced':
          return "Explain your reasoning...";
        case 'expert':
          return "Articulate your complete response...";
        default:
          return placeholder;
      }
    }
  };
  
  // Render complexity-specific guidance
  const renderComplexityGuidance = () => {
    switch (complexityLevel) {
      case 'beginner':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 p-3 rounded-md border border-green-100"
          >
            <h4 className="text-sm font-medium text-green-800 mb-1">Voice Tips - Beginner Level</h4>
            <ul className="text-xs text-green-700 space-y-1 list-disc pl-4">
              <li>Speak slowly and clearly</li>
              <li>Use simple words and short sentences</li>
              <li>Take your time between sentences</li>
            </ul>
          </motion.div>
        );
      case 'intermediate':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-3 rounded-md border border-blue-100"
          >
            <h4 className="text-sm font-medium text-blue-800 mb-1">Voice Tips - Intermediate Level</h4>
            <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
              <li>Speak at a normal pace</li>
              <li>Use complete sentences</li>
              <li>Try to explain your thinking</li>
            </ul>
          </motion.div>
        );
      case 'advanced':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 p-3 rounded-md border border-purple-100"
          >
            <h4 className="text-sm font-medium text-purple-800 mb-1">Voice Tips - Advanced Level</h4>
            <ul className="text-xs text-purple-700 space-y-1 list-disc pl-4">
              <li>Use detailed explanations</li>
              <li>Include specific examples</li>
              <li>Say "new paragraph" to organise your response</li>
            </ul>
          </motion.div>
        );
      case 'expert':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 p-3 rounded-md border border-amber-100"
          >
            <h4 className="text-sm font-medium text-amber-800 mb-1">Voice Tips - Expert Level</h4>
            <ul className="text-xs text-amber-700 space-y-1 list-disc pl-4">
              <li>Provide comprehensive explanations</li>
              <li>Use subject-specific vocabulary</li>
              <li>Structure your response with clear organisation</li>
              <li>Say punctuation like "comma", "period", "question mark"</li>
            </ul>
          </motion.div>
        );
      default:
        return null;
    }
  };
  
  // Render settings panel
  const renderSettings = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="age-group">Age Group</Label>
          <Select 
            value={ageGroup} 
            onValueChange={(value) => setAgeGroup(value as AgeGroup)}
          >
            <SelectTrigger id="age-group">
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nursery">Nursery (3-5 years)</SelectItem>
              <SelectItem value="early-primary">Early Primary (5-8 years)</SelectItem>
              <SelectItem value="late-primary">Late Primary (8-11 years)</SelectItem>
              <SelectItem value="secondary">Secondary (11+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="complexity-level">Complexity Level</Label>
          <Select 
            value={complexityLevel} 
            disabled
          >
            <SelectTrigger id="complexity-level">
              <SelectValue placeholder="Select complexity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-grey-500">
            Complexity level is determined by the adaptive system
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-centre justify-between">
            <Label htmlFor="child-voice-optimization">Child Voice Optimization</Label>
            <Switch 
              id="child-voice-optimization"
              checked={settings.childVoiceOptimization}
              onCheckedChange={(checked) => updateSettings({ childVoiceOptimization: checked })}
            />
          </div>
          <p className="text-xs text-grey-500">
            Improves recognition accuracy for children's voices
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confidence-threshold">Recognition Sensitivity</Label>
          <Slider 
            id="confidence-threshold"
            min={0.3}
            max={0.9}
            step={0.1}
            value={[settings.confidenceThreshold]}
            onValueChange={(value) => updateSettings({ confidenceThreshold: value[0] })}
          />
          <div className="flex justify-between text-xs text-grey-500">
            <span>More Forgiving</span>
            <span>More Strict</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Special Educational Needs</Label>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-centre justify-between">
              <Label htmlFor="articulation" className="text-sm">Articulation Support</Label>
              <Switch 
                id="articulation"
                checked={settings.specialEducationalNeeds.articulation}
                onCheckedChange={(checked) => updateSettings({ 
                  specialEducationalNeeds: { 
                    ...settings.specialEducationalNeeds, 
                    articulation: checked 
                  } 
                })}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <Label htmlFor="fluency" className="text-sm">Fluency Support</Label>
              <Switch 
                id="fluency"
                checked={settings.specialEducationalNeeds.fluency}
                onCheckedChange={(checked) => updateSettings({ 
                  specialEducationalNeeds: { 
                    ...settings.specialEducationalNeeds, 
                    fluency: checked 
                  } 
                })}
              />
            </div>
            
            <div className="flex items-centre justify-between">
              <Label htmlFor="processing" className="text-sm">Processing Support</Label>
              <Switch 
                id="processing"
                checked={settings.specialEducationalNeeds.processing}
                onCheckedChange={(checked) => updateSettings({ 
                  specialEducationalNeeds: { 
                    ...settings.specialEducationalNeeds, 
                    processing: checked 
                  } 
                })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (!isAvailable) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Voice Input Not Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Voice input is not supported in your browser. Please try using Chrome, Edge, or Safari.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-centre justify-between">
          <span className="flex items-centre gap-2">
            <Mic className="h-4 w-4" />
            <span>Voice Input</span>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
              {complexityLevel.charAt(0).toUpperCase() + complexityLevel.slice(1)} Level
            </span>
          </span>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">Input</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="input" className="mt-0 space-y-4">
          <UniversalVoiceInput 
            onTranscriptChange={onTranscriptChange}
            onComplete={onComplete}
            placeholder={getPlaceholder()}
            mode="continuous"
            showSettings={false}
          />
          
          {renderComplexityGuidance()}
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          {renderSettings()}
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default AdaptiveComplexityVoiceInput;
