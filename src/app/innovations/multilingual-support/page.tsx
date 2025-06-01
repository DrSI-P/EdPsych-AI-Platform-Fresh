'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Globe, 
  Languages, 
  MessageSquare, 
  BookOpen, 
  Sparkles,
  Zap,
  Users,
  ArrowRight,
  Check,
  Headphones,
  Mic,
  FileText,
  PenTool,
  RotateCw,
  Layers,
  Brain,
  Settings,
  Flag
} from 'lucide-react';

// Multilingual Support prototype
// This component demonstrates the concept of comprehensive language support across the platform

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  supportLevel: 'full' | 'partial' | 'machine';
  availableFeatures: any[];
}

interface TranslationExample {
  original: string;
  translated: string;
  language: string;
  context: string;
}

export default function MultilingualSupportPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for selected language
  const [selectedLanguage, setSelectedLanguage] = useState('en-GB');
  
  // State for translation input
  const [translationInput, setTranslationInput] = useState('');
  
  // State for translation output
  const [translationOutput, setTranslationOutput] = useState('');
  
  // State for translation loading
  const [isTranslating, setIsTranslating] = useState(false);
  
  // State for voice input active
  const [voiceInputActive, setVoiceInputActive] = useState(false);
  
  // State for auto-translation enabled
  const [autoTranslationEnabled, setAutoTranslationEnabled] = useState(true);
  
  // State for content adaptation enabled
  const [contentAdaptationEnabled, setContentAdaptationEnabled] = useState(true);
  
  // State for cultural sensitivity enabled
  const [culturalSensitivityEnabled, setCulturalSensitivityEnabled] = useState(true);
  
  // Available languages
  const languages: any[] = [
    {
      code: 'en-GB',
      name: 'English (UK)',
      nativeName: 'English (UK)',
      flag: '🇬🇧',
      supportLevel: 'full',
      availableFeatures: ['voice-input', 'voice-output', 'content-adaptation', 'cultural-sensitivity', 'assessment', 'feedback']
    },
    {
      code: 'cy',
      name: 'Welsh',
      nativeName: 'Cymraeg',
      flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
      supportLevel: 'full',
      availableFeatures: ['voice-input', 'voice-output', 'content-adaptation', 'cultural-sensitivity', 'assessment', 'feedback']
    },
    {
      code: 'gd',
      name: 'Scottish Gaelic',
      nativeName: 'Gàidhlig',
      flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      supportLevel: 'partial',
      availableFeatures: ['content-adaptation', 'cultural-sensitivity', 'assessment']
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      supportLevel: 'full',
      availableFeatures: ['voice-input', 'voice-output', 'content-adaptation', 'cultural-sensitivity', 'assessment', 'feedback']
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      supportLevel: 'full',
      availableFeatures: ['voice-input', 'voice-output', 'content-adaptation', 'cultural-sensitivity', 'assessment', 'feedback']
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      supportLevel: 'full',
      availableFeatures: ['voice-input', 'voice-output', 'content-adaptation', 'cultural-sensitivity', 'assessment', 'feedback']
    },
    {
      code: 'pl',
      name: 'Polish',
      nativeName: 'Polski',
      flag: '🇵🇱',
      supportLevel: 'full',
      availableFeatures: ['voice-input', 'voice-output', 'content-adaptation', 'assessment', 'feedback']
    },
    {
      code: 'ur',
      name: 'Urdu',
      nativeName: 'اردو',
      flag: '🇵🇰',
      supportLevel: 'partial',
      availableFeatures: ['content-adaptation', 'assessment', 'feedback']
    },
    {
      code: 'bn',
      name: 'Bengali',
      nativeName: 'বাংলা',
      flag: '🇧🇩',
      supportLevel: 'partial',
      availableFeatures: ['content-adaptation', 'assessment', 'feedback']
    },
    {
      code: 'zh',
      name: 'Chinese (Simplified)',
      nativeName: '中文',
      flag: '🇨🇳',
      supportLevel: 'full',
      availableFeatures: ['voice-input', 'voice-output', 'content-adaptation', 'cultural-sensitivity', 'assessment', 'feedback']
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      supportLevel: 'partial',
      availableFeatures: ['content-adaptation', 'assessment', 'feedback']
    },
    {
      code: 'so',
      name: 'Somali',
      nativeName: 'Soomaali',
      flag: '🇸🇴',
      supportLevel: 'machine',
      availableFeatures: ['content-adaptation', 'assessment']
    }
  ];
  
  // Translation examples
  const translationExamples: any[] = [
    {
      original: "Today we're going to learn about fractions and how they relate to everyday life.",
      translated: "Aujourd'hui, nous allons apprendre les fractions et comment elles se rapportent à la vie quotidienne.",
      language: "French",
      context: "Mathematics lesson introduction"
    },
    {
      original: "Can you explain how you solved this problem?",
      translated: "¿Puedes explicar cómo resolviste este problema?",
      language: "Spanish",
      context: "Teacher feedback request"
    },
    {
      original: "The water cycle is the process by which water circulates between the Earth's oceans, atmosphere, and land.",
      translated: "Der Wasserkreislauf ist der Prozess, durch den Wasser zwischen den Ozeanen, der Atmosphäre und dem Land der Erde zirkuliert.",
      language: "German",
      context: "Science lesson content"
    },
    {
      original: "Let's discuss how the main character's feelings changed throughout the story.",
      translated: "Gadewch i ni drafod sut newidiodd teimladau'r prif gymeriad drwy gydol y stori.",
      language: "Welsh",
      context: "Literature discussion prompt"
    }
  ];
  
  // Get selected language details
  const getSelectedLanguageDetails = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0];
  };
  
  // Handle translation
  const handleTranslate = () => {
    if (!translationInput.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate translation process
    setTimeout(() => {
      // Simple mock translation (in real implementation, this would call a translation API)
      let output = '';
      
      if (selectedLanguage === 'fr') {
        // Mock French translation
        output = translationInput
          .replace(/hello/gi, 'bonjour')
          .replace(/goodbye/gi, 'au revoir')
          .replace(/thank you/gi, 'merci')
          .replace(/please/gi, 's\'il vous plaît')
          .replace(/student/gi, 'élève')
          .replace(/teacher/gi, 'enseignant')
          .replace(/school/gi, 'école')
          .replace(/learn/gi, 'apprendre')
          .replace(/understand/gi, 'comprendre');
      } else if (selectedLanguage === 'es') {
        // Mock Spanish translation
        output = translationInput
          .replace(/hello/gi, 'hola')
          .replace(/goodbye/gi, 'adiós')
          .replace(/thank you/gi, 'gracias')
          .replace(/please/gi, 'por favour')
          .replace(/student/gi, 'estudiante')
          .replace(/teacher/gi, 'profesor')
          .replace(/school/gi, 'escuela')
          .replace(/learn/gi, 'aprender')
          .replace(/understand/gi, 'entender');
      } else if (selectedLanguage === 'de') {
        // Mock German translation
        output = translationInput
          .replace(/hello/gi, 'hallo')
          .replace(/goodbye/gi, 'auf wiedersehen')
          .replace(/thank you/gi, 'danke')
          .replace(/please/gi, 'bitte')
          .replace(/student/gi, 'Schüler')
          .replace(/teacher/gi, 'Lehrer')
          .replace(/school/gi, 'Schule')
          .replace(/learn/gi, 'lernen')
          .replace(/understand/gi, 'verstehen');
      } else if (selectedLanguage === 'cy') {
        // Mock Welsh translation
        output = translationInput
          .replace(/hello/gi, 'helo')
          .replace(/goodbye/gi, 'hwyl fawr')
          .replace(/thank you/gi, 'diolch')
          .replace(/please/gi, 'os gwelwch yn dda')
          .replace(/student/gi, 'myfyriwr')
          .replace(/teacher/gi, 'athro')
          .replace(/school/gi, 'ysgol')
          .replace(/learn/gi, 'dysgu')
          .replace(/understand/gi, 'deall');
      } else {
        // Default to input for other languages (in real implementation, would use appropriate translation)
        output = `[Translated to ${getSelectedLanguageDetails().name}]: ${translationInput}`;
      }
      
      setTranslationOutput(output);
      setIsTranslating(false);
    }, 1500);
  };
  
  // Handle voice input
  const handleVoiceInput = () => {
    setVoiceInputActive(prev => !prev);
    
    if (!voiceInputActive) {
      // Simulate voice recognition
      setTimeout(() => {
        setTranslationInput('Hello, I would like to learn about fractions today. Can you help me understand how to add fractions with different denominators?');
        setVoiceInputActive(false);
      }, 3000);
    }
  };
  
  // Get support level badge
  const getSupportLevelBadge = (level: string) => {
    switch(level) {
      case 'full':
        return <Badge className="bg-green-500">Full Support</Badge>;
      case 'partial':
        return <Badge className="bg-amber-500">Partial Support</Badge>;
      case 'machine':
        return <Badge className="bg-blue-500">Machine Translation</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-centre mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">Multilingual Support</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Breaking language barriers in education with comprehensive multilingual capabilities that ensure every learner can access quality education in their preferred language.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Sidebar Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {activeTab === 'overview' ? (
                <div className="space-y-6">
                  <div className="text-centre mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-centre justify-centre mx-auto mb-3">
                      <Globe className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">Language Support</h2>
                    <p className="text-muted-foreground">12 languages with varying support levels</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-centre">
                      <h3 className="font-medium">Select Language</h3>
                      {getSelectedLanguageDetails() && (
                        <div className="flex items-centre">
                          <span className="mr-2">{getSelectedLanguageDetails().flag}</span>
                          {getSupportLevelBadge(getSelectedLanguageDetails().supportLevel)}
                        </div>
                      )}
                    </div>
                    
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            <div className="flex items-centre">
                              <span className="mr-2">{language.flag}</span>
                              <span>{language.name}</span>
                              <span className="ml-2 text-muted-foreground">({language.nativeName})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {getSelectedLanguageDetails() && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Available Features</h3>
                      <div className="space-y-2">
                        {['voice-input', 'voice-output', 'content-adaptation', 'cultural-sensitivity', 'assessment', 'feedback'].map((feature) => {
                          const isAvailable = getSelectedLanguageDetails().availableFeatures.includes(feature);
                          return (
                            <div key={feature} className="flex items-centre">
                              {isAvailable ? (
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                              ) : (
                                <div className="h-4 w-4 border border-muted-foreground rounded-full mr-2" />
                              )}
                              <span className={isAvailable ? '' : 'text-muted-foreground'}>
                                {feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('translator')}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Open Translator
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('settings')}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Language Settings
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Language Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="auto-translation-toggle">
                          <div className="flex items-centre">
                            <Globe className="mr-2 h-4 w-4" />
                            Auto-Translation
                          </div>
                        </Label>
                        <Switch 
                          id="auto-translation-toggle" 
                          checked={autoTranslationEnabled}
                          onCheckedChange={setAutoTranslationEnabled}
                        />
                      </div>
                      
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="content-adaptation-toggle">
                          <div className="flex items-centre">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Content Adaptation
                          </div>
                        </Label>
                        <Switch 
                          id="content-adaptation-toggle" 
                          checked={contentAdaptationEnabled}
                          onCheckedChange={setContentAdaptationEnabled}
                        />
                      </div>
                      
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="cultural-sensitivity-toggle">
                          <div className="flex items-centre">
                            <Users className="mr-2 h-4 w-4" />
                            Cultural Sensitivity
                          </div>
                        </Label>
                        <Switch 
                          id="cultural-sensitivity-toggle" 
                          checked={culturalSensitivityEnabled}
                          onCheckedChange={setCulturalSensitivityEnabled}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Accessibility Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="text-to-speech">Text-to-Speech</Label>
                        <Switch id="text-to-speech" checked={true} />
                      </div>
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="speech-to-text">Speech-to-Text</Label>
                        <Switch id="speech-to-text" checked={true} />
                      </div>
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="simplified-language">Simplified Language</Label>
                        <Switch id="simplified-language" checked={false} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Advanced Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="translation-quality" className="mb-2 block">Translation Quality</Label>
                        <Select defaultValue="balanced">
                          <SelectTrigger id="translation-quality">
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fast">Fast (Machine Only)</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="accurate">Accurate (Human Reviewed)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="dialect-preference" className="mb-2 block">Dialect Preference</Label>
                        <Select defaultValue="auto">
                          <SelectTrigger id="dialect-preference">
                            <SelectValue placeholder="Select dialect" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Auto-detect</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-3"
        >
          {activeTab === 'translator' ? (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-centre">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  Real-Time Translator
                </h2>
                
                <div className="mb-6">
                  <div className="flex justify-between items-centre mb-2">
                    <Label htmlFor="translation-input">English (UK)</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleVoiceInput}
                      className={voiceInputActive ? 'text-red-500' : ''}
                    >
                      <Mic className="h-4 w-4 mr-1" />
                      {voiceInputActive ? 'Listening...' : 'Voice Input'}
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <Input
                      id="translation-input"
                      placeholder="Enter text to translate..."
                      value={translationInput}
                      onChange={(e) => setTranslationInput(e.target.value)}
                      className="min-h-[100px] resize-y"
                    />
                    {voiceInputActive && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-centre justify-centre rounded-md">
                        <div className="flex flex-col items-centre">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-centre justify-centre mb-2 relative">
                            <Mic className="h-6 w-6 text-primary" />
                            <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75"></div>
                          </div>
                          <p className="text-sm">Listening...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-centre mb-2">
                    <Label htmlFor="translation-output">
                      {getSelectedLanguageDetails().flag} {getSelectedLanguageDetails().name}
                    </Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                    >
                      <Headphones className="h-4 w-4 mr-1" />
                      Listen
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <div 
                      id="translation-output"
                      className="min-h-[100px] p-3 border rounded-md bg-muted/30"
                    >
                      {translationOutput || (
                        <span className="text-muted-foreground">Translation will appear here...</span>
                      )}
                    </div>
                    
                    {isTranslating && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-centre justify-centre rounded-md">
                        <div className="flex flex-col items-centre">
                          <RotateCw className="h-8 w-8 text-primary animate-spin mb-2" />
                          <p className="text-sm">Translating...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setTranslationInput('');
                      setTranslationOutput('');
                    }}
                  >
                    Clear
                  </Button>
                  
                  <Button 
                    disabled={!translationInput.trim() || isTranslating}
                    onClick={handleTranslate}
                  >
                    {isTranslating ? (
                      <>
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-4 w-4" />
                        Translate
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Translation Examples</h3>
                  <div className="space-y-4">
                    {translationExamples.map((example, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{example.language} Example</h4>
                            <Badge variant="outline">{example.context}</Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="bg-muted/30 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">English (UK):</div>
                              <p className="text-sm">{example.original}</p>
                            </div>
                            
                            <div className="bg-primary/5 p-3 rounded-md">
                              <div className="text-xs text-primary mb-1">{example.language}:</div>
                              <p className="text-sm">{example.translated}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-centre">
                    <Globe className="mr-2 h-5 w-5 text-primary" />
                    Comprehensive Language Support
                  </h2>
                  
                  <p className="mb-6">
                    Our multilingual support system breaks down language barriers in education, ensuring that every learner can access high-quality educational content in their preferred language. With support for 12 languages and growing, we're committed to making education truly inclusive and accessible.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                      <CardContent className="p-4 text-centre">
                        <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-3">
                          <Languages className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-3xl font-bold mb-1">12</div>
                        <p className="text-sm text-muted-foreground">Supported Languages</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-centre">
                        <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-3">
                          <Mic className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-3xl font-bold mb-1">8</div>
                        <p className="text-sm text-muted-foreground">Voice-Enabled Languages</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-centre">
                        <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-3">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-3xl font-bold mb-1">100%</div>
                        <p className="text-sm text-muted-foreground">UK Curriculum Coverage</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4">Supported Languages</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {languages.map((language) => (
                      <Card key={language.code} className="overflow-hidden">
                        <div className={`h-1 ${
                          language.supportLevel === 'full' ? 'bg-green-500' : 
                          language.supportLevel === 'partial' ? 'bg-amber-500' : 
                          'bg-blue-500'
                        }`}></div>
                        <CardContent className="p-4">
                          <div className="flex items-centre justify-between mb-2">
                            <div className="flex items-centre">
                              <span className="text-2xl mr-2">{language.flag}</span>
                              <div>
                                <h4 className="font-medium">{language.name}</h4>
                                <p className="text-xs text-muted-foreground">{language.nativeName}</p>
                              </div>
                            </div>
                            {getSupportLevelBadge(language.supportLevel)}
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {language.availableFeatures.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-centre">
                    <Layers className="mr-2 h-5 w-5 text-primary" />
                    Beyond Translation: Comprehensive Language Support
                  </h2>
                  
                  <p className="mb-6">
                    Our approach goes beyond simple translation to provide a truly comprehensive language support system that considers cultural context, educational relevance, and accessibility needs.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="bg-primary/10 p-3 rounded-full w-fit mb-3">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium mb-2">Intelligent Content Adaptation</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Content isn't just translated—it's adapted to be culturally relevant and educationally appropriate for speakers of each language, considering:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Cultural references and examples that resonate with different communities</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Educational terminology aligned with local curriculum standards</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Age-appropriate language and complexity levels</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="bg-primary/10 p-3 rounded-full w-fit mb-3">
                          <Mic className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium mb-2">Voice-Enabled Learning</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          For supported languages, our platform offers comprehensive voice interaction capabilities:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Natural speech recognition with dialect awareness</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>High-quality text-to-speech with natural intonation and pacing</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Voice-based assessment and feedback systems</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Pronunciation guidance and correction</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="bg-primary/10 p-3 rounded-full w-fit mb-3">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium mb-2">Cultural Sensitivity</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Our platform ensures that all content is culturally appropriate and sensitive:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Culturally appropriate imagery and examples</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Awareness of cultural norms and sensitivities</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Inclusive representation across all content</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Celebration of linguistic and cultural diversity</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="bg-primary/10 p-3 rounded-full w-fit mb-3">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium mb-2">UK Curriculum Alignment</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          All multilingual content maintains alignment with UK educational standards:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Full coverage of UK National Curriculum requirements</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Consistent educational terminology across languages</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Assessment frameworks that match UK standards</span>
                          </li>
                          <li className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>Support for UK-specific educational contexts</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-semibold mb-6 text-centre">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Language Detection</h3>
              <p className="text-muted-foreground">
                Our system automatically detects the user's preferred language based on browser settings, location, and previous interactions, offering a seamless experience from the first visit.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Neural Translation</h3>
              <p className="text-muted-foreground">
                Advanced neural machine translation models provide high-quality, context-aware translations that understand educational terminology and maintain the pedagogical intent of the content.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cultural Adaptation</h3>
              <p className="text-muted-foreground">
                Content is not just translated but culturally adapted to ensure examples, references, and contexts are relevant and appropriate for speakers of each supported language.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Voice Integration</h3>
              <p className="text-muted-foreground">
                For fully supported languages, our platform offers comprehensive voice input and output capabilities, enabling natural spoken interaction with educational content.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h2 className="text-3xl font-semibold mb-6 text-centre">Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">For Learners</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Accessible Education</span>
                    <p className="text-sm text-muted-foreground">Access high-quality educational content in your preferred language, removing language barriers to learning.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Cultural Relevance</span>
                    <p className="text-sm text-muted-foreground">Experience learning materials that respect and incorporate your cultural context and references.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Voice Interaction</span>
                    <p className="text-sm text-muted-foreground">Engage with content through natural spoken language, supporting different learning styles and accessibility needs.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Improved Comprehension</span>
                    <p className="text-sm text-muted-foreground">Understand complex concepts more easily when presented in your native or preferred language.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">For Educators</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Inclusive Classrooms</span>
                    <p className="text-sm text-muted-foreground">Support diverse learners with different language backgrounds, creating truly inclusive educational environments.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Parental Engagement</span>
                    <p className="text-sm text-muted-foreground">Enable better communication with parents who may have different language preferences, strengthening the home-school connection.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">EAL Support</span>
                    <p className="text-sm text-muted-foreground">Provide targeted support for English as an Additional Language (EAL) students, helping them transition while maintaining academic progress.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Global Perspective</span>
                    <p className="text-sm text-muted-foreground">Foster a global perspective in your classroom by celebrating linguistic diversity and cultural exchange.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
