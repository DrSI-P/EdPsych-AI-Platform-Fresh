'use client';

import React from 'react';
import { useVoiceInput } from '@/providers/voice-input-provider';
import UniversalVoiceInput from '@/components/voice-input/universal-voice-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Settings, RefreshCw, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { AgeGroup } from '@/providers/voice-input-provider';

interface AssessmentVoiceInputProps {
  onTranscriptChange?: (transcript: string) => void;
  onComplete?: (finalTranscript: string) => void;
  placeholder?: string;
  className?: string;
  questionType?: 'multiple-choice' | 'short-answer' | 'essay';
}

/**
 * Assessment Voice Input Component
 * 
 * Specialised voice input component for assessment activities,
 * with optimizations for different question types.
 */
export const AssessmentVoiceInput: React.FC<AssessmentVoiceInputProps> = ({
  onTranscriptChange,
  onComplete,
  placeholder = "Speak your answer...",
  className = '',
  questionType = 'short-answer'
}) => {
  const { toast } = useToast();
  const { 
    isAvailable, 
    settings, 
    updateSettings, 
    ageGroup, 
    setAgeGroup,
    calibrate,
    isCalibrating
  } = useVoiceInput();
  
  const [activeTab, setActiveTab] = React.useState<string>('input');
  
  // Determine appropriate mode based on question type
  const getInputMode = () => {
    switch (questionType) {
      case 'multiple-choice':
        return 'command'; // Optimised for short commands like "A", "B", "C", etc.
      case 'short-answer':
        return 'standard'; // Standard mode for short answers
      case 'essay':
        return 'continuous'; // Continuous mode for longer responses
      default:
        return 'standard';
    }
  };
  
  // Get appropriate placeholder based on question type and age group
  const getPlaceholder = () => {
    if (ageGroup === 'nursery' || ageGroup === 'early-primary') {
      switch (questionType) {
        case 'multiple-choice':
          return "Say the letter of your answer...";
        case 'short-answer':
          return "Say your answer...";
        case 'essay':
          return "Tell me your answer...";
        default:
          return placeholder;
      }
    } else {
      switch (questionType) {
        case 'multiple-choice':
          return "Say the letter or number of your choice...";
        case 'short-answer':
          return "Speak your answer clearly...";
        case 'essay':
          return "Dictate your complete response...";
        default:
          return placeholder;
      }
    }
  };
  
  // Handle calibration
  const handleCalibrate = async () => {
    const success = await calibrate();
    if (success) {
      setActiveTab('input');
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
          <div className="flex items-centre justify-between">
            <Label htmlFor="noise-reduction">Background Noise Reduction</Label>
            <Switch 
              id="noise-reduction"
              checked={settings.noiseReduction}
              onCheckedChange={(checked) => updateSettings({ noiseReduction: checked })}
            />
          </div>
          <p className="text-xs text-grey-500">
            Reduces impact of background classroom noise
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
        
        <Button 
          onClick={handleCalibrate}
          disabled={isCalibrating}
          className="w-full flex items-centre justify-centre gap-2"
        >
          {isCalibrating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Calibrating...
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Calibrate Voice Recognition
            </>
          )}
        </Button>
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
          <span>Assessment Voice Input</span>
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
            mode={getInputMode()}
            showSettings={false}
          />
          
          {questionType === 'multiple-choice' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 p-3 rounded-md border border-blue-100"
            >
              <h4 className="text-sm font-medium text-blue-800 mb-1">Voice Input Tips</h4>
              <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                <li>Say the letter or number clearly (e.g., "A", "B", "Option 1")</li>
                <li>You can also say "Select A" or "Choose option 1"</li>
                <li>If it doesn't recognise your choice, try again more slowly</li>
              </ul>
            </motion.div>
          )}
          
          {questionType === 'essay' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 p-3 rounded-md border border-blue-100"
            >
              <h4 className="text-sm font-medium text-blue-800 mb-1">Voice Input Tips</h4>
              <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                <li>Speak clearly and at a normal pace</li>
                <li>Say "new paragraph" to start a new paragraph</li>
                <li>Say punctuation like "comma", "period", "question mark"</li>
                <li>You can edit your answer with the keyboard if needed</li>
              </ul>
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          {renderSettings()}
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default AssessmentVoiceInput;
