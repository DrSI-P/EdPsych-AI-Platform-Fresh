'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
// Import VolumeUp from our custom icons to fix build errors
import { Mic, MicOff, Send, Image, Video, Smile, Save, Download, Copy, Globe, Volume2, MessageSquare, Eye, EyeOff, RefreshCw, Check, X } from 'lucide-react';
import { VolumeUp } from '@/components/icons/volume-up';

// Mock data for language options
const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polish' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'bn', name: 'Bengali' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'so', name: 'Somali' },
  { code: 'tr', name: 'Turkish' },
  { code: 'ru', name: 'Russian' },
];

// Mock data for feedback categories
const feedbackCategories = [
  { id: 'learning', label: 'Learning Experience' },
  { id: 'teaching', label: 'Teaching Methods' },
  { id: 'curriculum', label: 'Curriculum Content' },
  { id: 'environment', label: 'Learning Environment' },
  { id: 'resources', label: 'Resources & Materials' },
  { id: 'support', label: 'Support & Help' },
  { id: 'wellbeing', label: 'Wellbeing & Inclusion' },
  { id: 'other', label: 'Other' }
];

// Mock data for year groups
const yearGroups = [
  'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
];

// Mock data for subjects
const subjects = [
  'English', 'Mathematics', 'Science', 'History', 'Geography', 'Art and Design',
  'Computing', 'Design and Technology', 'Languages', 'Music', 'Physical Education',
  'Religious Education', 'PSHE', 'Citizenship', 'Other'
];

// Mock data for emoji reactions
const emojiReactions = [
  { emoji: '😀', label: 'Happy' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '😕', label: 'Confused' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '👍', label: 'Agree' },
  { emoji: '👎', label: 'Disagree' },
  { emoji: '❓', label: 'Question' }
];

// Interface for feedback entry
interface FeedbackEntry {
  id: string;
  studentId?: string;
  studentName?: string;
  yearGroup?: string;
  subject?: string;
  category: string;
  content: string;
  contentType: 'text' | 'voice' | 'image' | 'video';
  anonymous: boolean;
  language: string;
  translation?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  reactions?: { emoji: string; count: number }[];
  createdAt: string;
}

// Interface for transcription entry
interface TranscriptionEntry {
  id: string;
  originalText: string;
  originalLanguage: string;
  translatedText?: string;
  targetLanguage?: string;
  context?: string;
  createdAt: string;
}

export default function MultiModalFeedbackCollection() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('provide');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    category: '',
    content: '',
    contentType: 'text' as 'text' | 'voice' | 'image' | 'video',
    anonymous: false,
    language: 'en',
    yearGroup: '',
    subject: '',
    studentName: ''
  });
  
  // Transcription form state
  const [transcriptionForm, setTranscriptionForm] = useState({
    originalText: '',
    originalLanguage: 'en',
    targetLanguage: 'en',
    context: ''
  });
  
  // Load mock data on component mount
  useEffect(() => {
    // Mock feedback entries
    const mockFeedbackEntries: any[] = [
      {
        id: '1',
        studentName: 'Anonymous',
        yearGroup: 'Year 8',
        subject: 'Mathematics',
        category: 'teaching',
        content: 'I find it difficult to understand algebra when it\'s explained only on the board. Could we have more interactive examples?',
        contentType: 'text',
        anonymous: true,
        language: 'en',
        sentiment: 'neutral',
        reactions: [
          { emoji: '👍', count: 5 },
          { emoji: '🤔', count: 2 }
        ],
        createdAt: '2025-05-15T10:30:00Z'
      },
      {
        id: '2',
        studentName: 'Maria Rodriguez',
        yearGroup: 'Year 5',
        subject: 'Science',
        category: 'resources',
        content: 'Me gusta mucho los experimentos de ciencias, pero necesitamos más materiales.',
        contentType: 'text',
        anonymous: false,
        language: 'es',
        translation: 'I really like the science experiments, but we need more materials.',
        sentiment: 'positive',
        reactions: [
          { emoji: '👍', count: 3 }
        ],
        createdAt: '2025-05-14T14:15:00Z'
      },
      {
        id: '3',
        studentName: 'Anonymous',
        yearGroup: 'Year 10',
        subject: 'English',
        category: 'environment',
        content: 'The classroom is too noisy during reading time. It\'s hard to concentrate.',
        contentType: 'text',
        anonymous: true,
        language: 'en',
        sentiment: 'negative',
        reactions: [
          { emoji: '👍', count: 8 },
          { emoji: '😢', count: 3 }
        ],
        createdAt: '2025-05-13T09:45:00Z'
      }
    ];
    
    // Mock transcription history
    const mockTranscriptionHistory: any[] = [
      {
        id: '1',
        originalText: 'Today we will learn about photosynthesis and how plants convert sunlight into energy.',
        originalLanguage: 'en',
        translatedText: 'Dziś dowiemy się o fotosyntezie i o tym, jak rośliny przekształcają światło słoneczne w energię.',
        targetLanguage: 'pl',
        context: 'Science lesson',
        createdAt: '2025-05-15T09:30:00Z'
      },
      {
        id: '2',
        originalText: 'Please complete exercises 1-5 on page 42 of your workbook for homework.',
        originalLanguage: 'en',
        translatedText: 'Lütfen ev ödevi için çalışma kitabınızın 42. sayfasındaki 1-5 alıştırmaları tamamlayın.',
        targetLanguage: 'tr',
        context: 'Mathematics homework',
        createdAt: '2025-05-14T15:20:00Z'
      },
      {
        id: '3',
        originalText: 'Tomorrow we will have a school trip to the museum. Please bring a packed lunch and wear comfortable shoes.',
        originalLanguage: 'en',
        translatedText: 'غدًا سنقوم برحلة مدرسية إلى المتحف. يرجى إحضار غداء معبأ وارتداء أحذية مريحة.',
        targetLanguage: 'ar',
        context: 'School announcement',
        createdAt: '2025-05-13T14:10:00Z'
      }
    ];
    
    setFeedbackEntries(mockFeedbackEntries);
    setTranscriptionHistory(mockTranscriptionHistory);
  }, []);
  
  // Handle starting voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        transcribeAudio(audioBlob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  // Handle stopping voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "Recording stopped",
        description: "Processing your audio...",
      });
    }
  };
  
  // Simulate transcribing audio
  const transcribeAudio = (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    // In a real application, this would send the audio to a transcription service
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Mock transcription result
      const mockTranscriptions = [
        "I find the science lessons really interesting, but sometimes it's hard to understand all the English words.",
        "I would like more time to complete the writing tasks because I need to translate in my head first.",
        "The visual diagrams help me understand the concepts better than just listening to explanations.",
        "Could we have some key words translated into different languages on the classroom walls?",
        "I enjoy working in groups because my friends can help explain things I don't understand."
      ];
      
      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      
      setTranscribedText(randomTranscription);
      setFeedbackForm(prev => ({
        ...prev,
        content: randomTranscription,
        contentType: 'voice'
      }));
      
      setIsTranscribing(false);
      
      toast({
        title: "Transcription complete",
        description: "Your speech has been converted to text.",
      });
    }, 2000);
  };
  
  // Simulate translating text
  const translateText = (text: string, sourceLanguage: string, targetLanguage: string) => {
    if (!text.trim()) return;
    
    setIsTranslating(true);
    
    // In a real application, this would send the text to a translation service
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Mock translation based on target language
      let mockTranslation = '';
      
      if (targetLanguage === 'es') {
        mockTranslation = "Esta es una traducción simulada al español. En una aplicación real, utilizaríamos un servicio de traducción profesional.";
      } else if (targetLanguage === 'fr') {
        mockTranslation = "Ceci est une traduction simulée en français. Dans une application réelle, nous utiliserions un service de traduction professionnel.";
      } else if (targetLanguage === 'pl') {
        mockTranslation = "To jest symulowane tłumaczenie na język polski. W rzeczywistej aplikacji użylibyśmy profesjonalnego serwisu tłumaczeniowego.";
      } else if (targetLanguage === 'ar') {
        mockTranslation = "هذه ترجمة محاكاة باللغة العربية. في تطبيق حقيقي، سنستخدم خدمة ترجمة احترافية.";
      } else {
        mockTranslation = "This is a simulated translation. In a real application, we would use a professional translation service.";
      }
      
      setTranslatedText(mockTranslation);
      setIsTranslating(false);
      
      toast({
        title: "Translation complete",
        description: `Text has been translated to ${languageOptions.find(l => l.code === targetLanguage)?.name || targetLanguage}.`,
      });
    }, 1500);
  };
  
  // Handle feedback form change
  const handleFeedbackFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFeedbackForm(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle transcription form change
  const handleTranscriptionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTranscriptionForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle feedback submission
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!feedbackForm.category) {
      toast({
        title: "Category required",
        description: "Please select a feedback category.",
        variant: "destructive"
      });
      return;
    }
    
    if (!feedbackForm.content.trim()) {
      toast({
        title: "Content required",
        description: "Please provide some feedback content.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, this would send the feedback to an API
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Create a new feedback entry
      const newFeedback: FeedbackEntry = {
        id: Date.now().toString(),
        studentName: feedbackForm.anonymous ? 'Anonymous' : feedbackForm.studentName || 'Student',
        yearGroup: feedbackForm.yearGroup || undefined,
        subject: feedbackForm.subject || undefined,
        category: feedbackForm.category,
        content: feedbackForm.content,
        contentType: feedbackForm.contentType,
        anonymous: feedbackForm.anonymous,
        language: feedbackForm.language,
        translation: feedbackForm.language !== 'en' ? translatedText : undefined,
        sentiment: 'neutral', // In a real app, this would be determined by sentiment analysis
        reactions: [],
        createdAt: new Date().toISOString()
      };
      
      // Add to feedback entries
      setFeedbackEntries(prev => [newFeedback, ...prev]);
      
      // Reset form
      setFeedbackForm({
        category: '',
        content: '',
        contentType: 'text',
        anonymous: false,
        language: 'en',
        yearGroup: '',
        subject: '',
        studentName: ''
      });
      
      setTranscribedText('');
      setTranslatedText('');
      
      setIsLoading(false);
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for sharing your thoughts!",
      });
    }, 1000);
  };
  
  // Handle transcription request
  const handleRequestTranscription = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!transcriptionForm.originalText.trim()) {
      toast({
        title: "Text required",
        description: "Please enter the text to translate.",
        variant: "destructive"
      });
      return;
    }
    
    if (transcriptionForm.originalLanguage === transcriptionForm.targetLanguage) {
      toast({
        title: "Different languages required",
        description: "Source and target languages must be different.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, this would send the text to a translation service
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Mock translation based on target language
      let mockTranslation = '';
      
      if (transcriptionForm.targetLanguage === 'es') {
        mockTranslation = "Esta es una traducción simulada al español. En una aplicación real, utilizaríamos un servicio de traducción profesional.";
      } else if (transcriptionForm.targetLanguage === 'fr') {
        mockTranslation = "Ceci est une traduction simulée en français. Dans une application réelle, nous utiliserions un service de traduction professionnel.";
      } else if (transcriptionForm.targetLanguage === 'pl') {
        mockTranslation = "To jest symulowane tłumaczenie na język polski. W rzeczywistej aplikacji użylibyśmy profesjonalnego serwisu tłumaczeniowego.";
      } else if (transcriptionForm.targetLanguage === 'ar') {
        mockTranslation = "هذه ترجمة محاكاة باللغة العربية. في تطبيق حقيقي، سنستخدم خدمة ترجمة احترافية.";
      } else {
        mockTranslation = "This is a simulated translation. In a real application, we would use a professional translation service.";
      }
      
      // Create a new transcription entry
      const newTranscription: TranscriptionEntry = {
        id: Date.now().toString(),
        originalText: transcriptionForm.originalText,
        originalLanguage: transcriptionForm.originalLanguage,
        translatedText: mockTranslation,
        targetLanguage: transcriptionForm.targetLanguage,
        context: transcriptionForm.context || undefined,
        createdAt: new Date().toISOString()
      };
      
      // Add to transcription history
      setTranscriptionHistory(prev => [newTranscription, ...prev]);
      
      // Reset form
      setTranscriptionForm({
        originalText: '',
        originalLanguage: 'en',
        targetLanguage: 'en',
        context: ''
      });
      
      setIsLoading(false);
      
      toast({
        title: "Translation complete",
        description: "Your text has been translated and saved.",
      });
    }, 1500);
  };
  
  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle reaction to feedback
  const handleReaction = (feedbackId: string, emoji: string) => {
    setFeedbackEntries(prev => 
      prev.map(entry => {
        if (entry.id === feedbackId) {
          const existingReactionIndex = entry.reactions?.findIndex(r => r.emoji === emoji) ?? -1;
          const updatedReactions = entry.reactions ? [...entry.reactions] : [];
          
          if (existingReactionIndex >= 0) {
            updatedReactions[existingReactionIndex] = {
              ...updatedReactions[existingReactionIndex],
              count: updatedReactions[existingReactionIndex].count + 1
            };
          } else {
            updatedReactions.push({ emoji, count: 1 });
          }
          
          return { ...entry, reactions: updatedReactions };
        }
        return entry;
      })
    );
    
    toast({
      title: "Reaction added",
      description: `You reacted with ${emoji}`,
    });
  };
  
  // Copy transcription to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Text has been copied to your clipboard.",
        });
      },
      (err) => {
        toast({
          title: "Copy failed",
          description: "Could not copy text to clipboard.",
          variant: "destructive"
        });
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Student Voice Amplification System</h1>
      <p className="text-muted-foreground mb-6">
        Express your thoughts, ideas, and feedback through multiple channels
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="provide">Provide Feedback</TabsTrigger>
          <TabsTrigger value="browse">Browse Feedback</TabsTrigger>
          <TabsTrigger value="transcription">Transcription & Translation</TabsTrigger>
        </TabsList>
        
        {/* Provide Feedback Tab */}
        <TabsContent value="provide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Thoughts</CardTitle>
              <CardDescription>
                Your feedback helps improve the learning experience for everyone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Feedback Category</Label>
                    <Select 
                      value={feedbackForm.category} 
                      onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {feedbackCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={feedbackForm.language} 
                      onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map(language => (
                          <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearGroup">Year Group (Optional)</Label>
                    <Select 
                      value={feedbackForm.yearGroup} 
                      onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, yearGroup: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not specified</SelectItem>
                        {yearGroups.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject (Optional)</Label>
                    <Select 
                      value={feedbackForm.subject} 
                      onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not specified</SelectItem>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="studentName">Your Name (Optional)</Label>
                  <Input
                    id="studentName"
                    name="studentName"
                    value={feedbackForm.studentName}
                    onChange={handleFeedbackFormChange}
                    placeholder="Enter your name"
                    disabled={feedbackForm.anonymous}
                  />
                </div>
                
                <div className="flex items-centre space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={feedbackForm.anonymous}
                    onCheckedChange={(checked) => handleCheckboxChange('anonymous', checked === true)}
                  />
                  <Label htmlFor="anonymous" className="text-sm font-normal">
                    Submit anonymously
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label>Input Method</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={feedbackForm.contentType === 'text' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, contentType: 'text' }))}
                      className="flex items-centre gap-1"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Text</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant={feedbackForm.contentType === 'voice' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, contentType: 'voice' }))}
                      className="flex items-centre gap-1"
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>Voice</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant={feedbackForm.contentType === 'image' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, contentType: 'image' }))}
                      className="flex items-centre gap-1"
                      disabled={true} // Disabled for this demo
                    >
                      <Image className="h-4 w-4" />
                      <span>Image</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant={feedbackForm.contentType === 'video' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, contentType: 'video' }))}
                      className="flex items-centre gap-1"
                      disabled={true} // Disabled for this demo
                    >
                      <Video className="h-4 w-4" />
                      <span>Video</span>
                    </Button>
                  </div>
                </div>
                
                {feedbackForm.contentType === 'text' && (
                  <div>
                    <Label htmlFor="content">Your Feedback</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={feedbackForm.content}
                      onChange={handleFeedbackFormChange}
                      placeholder="Share your thoughts, ideas, or concerns..."
                      className="min-h-[150px]"
                    />
                  </div>
                )}
                
                {feedbackForm.contentType === 'voice' && (
                  <div className="space-y-4">
                    <div className="flex items-centre justify-between">
                      <Label>Voice Recording</Label>
                      {isRecording && (
                        <Badge variant="outline" className="text-red-500 animate-pulse">
                          Recording: {formatTime(recordingTime)}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-centre gap-4 p-6 border rounded-md bg-muted/20">
                      {!isRecording ? (
                        <Button
                          type="button"
                          onClick={startRecording}
                          className="flex items-centre gap-2"
                          disabled={isTranscribing}
                        >
                          <Mic className="h-5 w-5" />
                          Start Recording
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={stopRecording}
                          variant="destructive"
                          className="flex items-centre gap-2"
                        >
                          <MicOff className="h-5 w-5" />
                          Stop Recording
                        </Button>
                      )}
                      
                      {isTranscribing && (
                        <div className="flex items-centre gap-2 text-muted-foreground">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Transcribing your audio...</span>
                        </div>
                      )}
                      
                      {transcribedText && (
                        <div className="w-full space-y-2">
                          <Label>Transcribed Text</Label>
                          <Textarea
                            value={transcribedText}
                            onChange={(e) => {
                              setTranscribedText(e.target.value);
                              setFeedbackForm(prev => ({ ...prev, content: e.target.value }));
                            }}
                            className="min-h-[100px]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {feedbackForm.language !== 'en' && feedbackForm.content && (
                  <div className="space-y-2">
                    <div className="flex items-centre justify-between">
                      <Label>Translation to English</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => translateText(feedbackForm.content, feedbackForm.language, 'en')}
                        disabled={isTranslating || !feedbackForm.content.trim()}
                        className="flex items-centre gap-1"
                      >
                        {isTranslating ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Globe className="h-4 w-4" />
                        )}
                        <span>Translate</span>
                      </Button>
                    </div>
                    
                    {isTranslating ? (
                      <div className="p-4 border rounded-md bg-muted/20 flex items-centre justify-centre">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        <span>Translating...</span>
                      </div>
                    ) : translatedText ? (
                      <div className="p-4 border rounded-md bg-muted/20">
                        {translatedText}
                      </div>
                    ) : (
                      <div className="p-4 border rounded-md bg-muted/20 text-muted-foreground">
                        Click translate to see your feedback in English
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !feedbackForm.content.trim() || !feedbackForm.category}
                    className="w-full md:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Reactions</CardTitle>
              <CardDescription>
                Express your feelings about today's lesson
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {emojiReactions.map(reaction => (
                  <Button
                    key={reaction.label}
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-centre gap-2"
                    onClick={() => {
                      toast({
                        title: "Reaction recorded",
                        description: `You felt ${reaction.label} about today's lesson.`,
                      });
                    }}
                  >
                    <span className="text-4xl">{reaction.emoji}</span>
                    <span>{reaction.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Browse Feedback Tab */}
        <TabsContent value="browse" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>
                Browse feedback shared by students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {feedbackEntries.length === 0 ? (
                  <div className="text-centre py-8 text-muted-foreground">
                    No feedback entries available.
                  </div>
                ) : (
                  feedbackEntries.map(entry => (
                    <Card key={entry.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">
                              {entry.studentName}
                              {entry.yearGroup && ` • ${entry.yearGroup}`}
                              {entry.subject && ` • ${entry.subject}`}
                            </CardTitle>
                            <CardDescription>
                              {new Date(entry.createdAt).toLocaleDateString()} • 
                              {feedbackCategories.find(c => c.id === entry.category)?.label || entry.category}
                            </CardDescription>
                          </div>
                          <div className="flex items-centre gap-2">
                            {entry.language !== 'en' && (
                              <Badge variant="outline" className="flex items-centre gap-1">
                                <Globe className="h-3 w-3" />
                                {languageOptions.find(l => l.code === entry.language)?.name || entry.language}
                              </Badge>
                            )}
                            {entry.sentiment && (
                              <Badge className={
                                entry.sentiment === 'positive' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                entry.sentiment === 'negative' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                                'bg-grey-100 text-grey-800 hover:bg-grey-100'
                              }>
                                {entry.sentiment.charAt(0).toUpperCase() + entry.sentiment.slice(1)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm">
                            {entry.content}
                          </div>
                          
                          {entry.translation && (
                            <div className="pt-2">
                              <div className="flex items-centre justify-between mb-1">
                                <Label className="text-xs text-muted-foreground">Translation</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setShowTranslation(!showTranslation)}
                                  className="h-6 px-2 text-xs"
                                >
                                  {showTranslation ? (
                                    <EyeOff className="h-3 w-3 mr-1" />
                                  ) : (
                                    <Eye className="h-3 w-3 mr-1" />
                                  )}
                                  {showTranslation ? 'Hide' : 'Show'}
                                </Button>
                              </div>
                              {showTranslation && (
                                <div className="text-sm p-2 bg-muted/20 rounded-md">
                                  {entry.translation}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex-wrap gap-2">
                        <div className="flex flex-wrap gap-1 mr-auto">
                          {entry.reactions && entry.reactions.map((reaction, index) => (
                            <Badge key={index} variant="outline" className="flex items-centre gap-1">
                              <span>{reaction.emoji}</span>
                              <span>{reaction.count}</span>
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-1">
                          {emojiReactions.slice(0, 4).map(reaction => (
                            <Button
                              key={reaction.emoji}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(entry.id, reaction.emoji)}
                              className="h-8 w-8 p-0"
                              title={reaction.label}
                            >
                              {reaction.emoji}
                            </Button>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Transcription & Translation Tab */}
        <TabsContent value="transcription" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transcription & Translation</CardTitle>
                <CardDescription>
                  Translate classroom content between languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequestTranscription} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="originalLanguage">Source Language</Label>
                      <Select 
                        value={transcriptionForm.originalLanguage} 
                        onValueChange={(value) => setTranscriptionForm(prev => ({ ...prev, originalLanguage: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map(language => (
                            <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="targetLanguage">Target Language</Label>
                      <Select 
                        value={transcriptionForm.targetLanguage} 
                        onValueChange={(value) => setTranscriptionForm(prev => ({ ...prev, targetLanguage: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map(language => (
                            <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="originalText">Text to Translate</Label>
                    <Textarea
                      id="originalText"
                      name="originalText"
                      value={transcriptionForm.originalText}
                      onChange={handleTranscriptionFormChange}
                      placeholder="Enter text to translate..."
                      className="min-h-[150px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="context">Context (Optional)</Label>
                    <Input
                      id="context"
                      name="context"
                      value={transcriptionForm.context}
                      onChange={handleTranscriptionFormChange}
                      placeholder="e.g., Science lesson, Homework instructions, etc."
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading || !transcriptionForm.originalText.trim() || transcriptionForm.originalLanguage === transcriptionForm.targetLanguage}
                      className="w-full md:w-auto"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
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
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Translation History</CardTitle>
                <CardDescription>
                  Recently translated content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transcriptionHistory.length === 0 ? (
                    <div className="text-centre py-8 text-muted-foreground">
                      No translation history available.
                    </div>
                  ) : (
                    transcriptionHistory.map(entry => (
                      <Card key={entry.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">
                                {languageOptions.find(l => l.code === entry.originalLanguage)?.name || entry.originalLanguage} → 
                                {languageOptions.find(l => l.code === entry.targetLanguage)?.name || entry.targetLanguage}
                              </CardTitle>
                              <CardDescription>
                                {new Date(entry.createdAt).toLocaleDateString()}
                                {entry.context && ` • ${entry.context}`}
                              </CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(entry.translatedText || '')}
                              className="h-8 w-8 p-0"
                              title="Copy translation"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs text-muted-foreground">Original Text</Label>
                              <div className="text-sm p-2 bg-muted/20 rounded-md">
                                {entry.originalText}
                              </div>
                            </div>
                            
                            {entry.translatedText && (
                              <div>
                                <Label className="text-xs text-muted-foreground">Translated Text</Label>
                                <div className="text-sm p-2 bg-muted/20 rounded-md">
                                  {entry.translatedText}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Classroom Transcription Support</CardTitle>
              <CardDescription>
                Tools to help EAL students access the curriculum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Live Lesson Transcription</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Automatically transcribe teacher's speech in real-time to help EAL students follow along.
                    </p>
                    <Button className="w-full" disabled>
                      <VolumeUp className="mr-2 h-4 w-4" />
                      Start Transcription
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Vocabulary Translation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create translated vocabulary lists for lessons to support EAL students.
                    </p>
                    <Button className="w-full" disabled>
                      <Globe className="mr-2 h-4 w-4" />
                      Create Vocabulary List
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interpreter Mode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Real-time spoken translation for parent-teacher conferences and student support.
                    </p>
                    <Button className="w-full" disabled>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Start Interpreter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Note: Advanced features will be available in the next update. Current implementation provides basic translation support.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
