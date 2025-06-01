'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
// Import VolumeUp from our custom icons to fix build errors
import { Mic, MicOff, Send, Globe, Volume2, MessageSquare, Copy, Download, RefreshCw, Check, X, FileText, BookOpen } from 'lucide-react';
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

// Mock data for subjects
const subjects = [
  'English', 'Mathematics', 'Science', 'History', 'Geography', 'Art and Design',
  'Computing', 'Design and Technology', 'Languages', 'Music', 'Physical Education',
  'Religious Education', 'PSHE', 'Citizenship', 'Other'
];

// Interface for transcription entry
interface TranscriptionEntry {
  id: string;
  originalText: string;
  originalLanguage: string;
  translatedText?: string;
  targetLanguage?: string;
  context?: string;
  subject?: string;
  createdAt: string;
}

// Interface for vocabulary item
interface VocabularyItem {
  id: string;
  term: string;
  definition: string;
  translations: {
    language: string;
    translation: string;
  }[];
  subject: string;
  createdAt: string;
}

export default function TranscriptionTranslationSystem() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("translate");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcribedText, setTranscribedText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionEntry[]>([]);
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveTranscribing, setIsLiveTranscribing] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const liveTranscriptionRef = useRef<NodeJS.Timeout | null>(null);
  
  // Transcription form state
  const [transcriptionForm, setTranscriptionForm] = useState({
    originalText: '',
    originalLanguage: 'en',
    targetLanguage: 'en',
    context: '',
    subject: ''
  });
  
  // Vocabulary form state
  const [vocabularyForm, setVocabularyForm] = useState({
    term: '',
    definition: '',
    subject: '',
    translations: [{ language: 'es', translation: '' }]
  });
  
  // Load mock data on component mount
  useEffect(() => {
    // Mock transcription history
    const mockTranscriptionHistory: any[] = [
      {
        id: '1',
        originalText: 'Today we will learn about photosynthesis and how plants convert sunlight into energy.',
        originalLanguage: 'en',
        translatedText: 'Dziś dowiemy się o fotosyntezie i o tym, jak rośliny przekształcają światło słoneczne w energię.',
        targetLanguage: 'pl',
        context: 'Science lesson',
        subject: 'Science',
        createdAt: '2025-05-15T09:30:00Z'
      },
      {
        id: '2',
        originalText: 'Please complete exercises 1-5 on page 42 of your workbook for homework.',
        originalLanguage: 'en',
        translatedText: 'Lütfen ev ödevi için çalışma kitabınızın 42. sayfasındaki 1-5 alıştırmaları tamamlayın.',
        targetLanguage: 'tr',
        context: 'Mathematics homework',
        subject: 'Mathematics',
        createdAt: '2025-05-14T15:20:00Z'
      },
      {
        id: '3',
        originalText: 'Tomorrow we will have a school trip to the museum. Please bring a packed lunch and wear comfortable shoes.',
        originalLanguage: 'en',
        translatedText: 'غدًا سنقوم برحلة مدرسية إلى المتحف. يرجى إحضار غداء معبأ وارتداء أحذية مريحة.',
        targetLanguage: 'ar',
        context: 'School announcement',
        subject: 'Other',
        createdAt: '2025-05-13T14:10:00Z'
      }
    ];
    
    // Mock vocabulary list
    const mockVocabularyList: any[] = [
      {
        id: '1',
        term: 'Photosynthesis',
        definition: 'The process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.',
        translations: [
          { language: 'pl', translation: 'Fotosynteza' },
          { language: 'es', translation: 'Fotosíntesis' },
          { language: 'ar', translation: 'التمثيل الضوئي' }
        ],
        subject: 'Science',
        createdAt: '2025-05-15T10:00:00Z'
      },
      {
        id: '2',
        term: 'Equation',
        definition: 'A statement that the values of two mathematical expressions are equal.',
        translations: [
          { language: 'pl', translation: 'Równanie' },
          { language: 'es', translation: 'Ecuación' },
          { language: 'tr', translation: 'Denklem' }
        ],
        subject: 'Mathematics',
        createdAt: '2025-05-14T11:30:00Z'
      },
      {
        id: '3',
        term: 'Adjective',
        definition: 'A word naming an attribute of a noun, such as sweet, red, or technical.',
        translations: [
          { language: 'fr', translation: 'Adjectif' },
          { language: 'es', translation: 'Adjetivo' },
          { language: 'de', translation: 'Adjektiv' }
        ],
        subject: 'English',
        createdAt: '2025-05-13T09:15:00Z'
      }
    ];
    
    setTranscriptionHistory(mockTranscriptionHistory);
    setVocabularyList(mockVocabularyList);
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
        "Today we will be learning about the water cycle and how it affects our environment.",
        "Please turn to page 42 in your textbooks and complete exercises 3 through 7.",
        "For homework, I would like you to write a short essay about your favourite scientific discovery.",
        "Let's review what we learned yesterday about the structure of plant cells.",
        "Can anyone tell me what photosynthesis means and why it's important?"
      ];
      
      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      
      setTranscribedText(randomTranscription);
      setTranscriptionForm(prev => ({
        ...prev,
        originalText: randomTranscription
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
      
      // Create a new transcription entry
      const newTranscription: TranscriptionEntry = {
        id: Date.now().toString(),
        originalText: text,
        originalLanguage: sourceLanguage,
        translatedText: mockTranslation,
        targetLanguage: targetLanguage,
        context: transcriptionForm.context || undefined,
        subject: transcriptionForm.subject || undefined,
        createdAt: new Date().toISOString()
      };
      
      // Add to transcription history
      setTranscriptionHistory(prev => [newTranscription, ...prev]);
      
      setIsTranslating(false);
      
      toast({
        title: "Translation complete",
        description: `Text has been translated to ${languageOptions.find(l => l.code === targetLanguage)?.name || targetLanguage}.`,
      });
      
      // Reset form
      setTranscriptionForm({
        originalText: '',
        originalLanguage: 'en',
        targetLanguage: 'en',
        context: '',
        subject: ''
      });
      
      setTranscribedText('');
    }, 1500);
  };
  
  // Handle transcription form change
  const handleTranscriptionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTranscriptionForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle vocabulary form change
  const handleVocabularyFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVocabularyForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle translation change in vocabulary form
  const handleTranslationChange = (index: number, field: 'language' | 'translation', value: string) => {
    setVocabularyForm(prev => {
      const newTranslations = [...prev.translations];
      newTranslations[index] = {
        ...newTranslations[index],
        [field]: value
      };
      return { ...prev, translations: newTranslations };
    });
  };
  
  // Add translation field to vocabulary form
  const addTranslation = () => {
    setVocabularyForm(prev => ({
      ...prev,
      translations: [...prev.translations, { language: 'en', translation: '' }]
    }));
  };
  
  // Remove translation field from vocabulary form
  const removeTranslation = (index: number) => {
    setVocabularyForm(prev => {
      const newTranslations = [...prev.translations];
      newTranslations.splice(index, 1);
      return { 
        ...prev, 
        translations: newTranslations.length ? newTranslations : [{ language: 'en', translation: '' }]
      };
    });
  };
  
  // Handle vocabulary submission
  const handleSubmitVocabulary = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!vocabularyForm.term.trim()) {
      toast({
        title: "Term required",
        description: "Please enter a vocabulary term.",
        variant: "destructive"
      });
      return;
    }
    
    if (!vocabularyForm.definition.trim()) {
      toast({
        title: "Definition required",
        description: "Please enter a definition for the term.",
        variant: "destructive"
      });
      return;
    }
    
    if (!vocabularyForm.subject) {
      toast({
        title: "Subject required",
        description: "Please select a subject for the vocabulary term.",
        variant: "destructive"
      });
      return;
    }
    
    const hasEmptyTranslations = vocabularyForm.translations.some(t => !t.translation.trim());
    if (hasEmptyTranslations) {
      toast({
        title: "Translation required",
        description: "Please provide all translations or remove empty fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, this would send the vocabulary to an API
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Create a new vocabulary item
      const newVocabulary: VocabularyItem = {
        id: Date.now().toString(),
        term: vocabularyForm.term,
        definition: vocabularyForm.definition,
        translations: vocabularyForm.translations,
        subject: vocabularyForm.subject,
        createdAt: new Date().toISOString()
      };
      
      // Add to vocabulary list
      setVocabularyList(prev => [newVocabulary, ...prev]);
      
      // Reset form
      setVocabularyForm({
        term: '',
        definition: '',
        subject: '',
        translations: [{ language: 'es', translation: '' }]
      });
      
      setIsLoading(false);
      
      toast({
        title: "Vocabulary added",
        description: "The vocabulary term has been added to the list.",
      });
    }, 1000);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Simulate text-to-speech
  const speakText = (text: string, language: string) => {
    toast({
      title: "Text-to-speech",
      description: `Speaking text in ${languageOptions.find(l => l.code === language)?.name || language}...`,
    });
    
    // In a real application, this would use the Web Speech API or a TTS service
    console.log(`Speaking: ${text} in ${language}`);
  };
  
  // Simulate copying text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };
  
  // Simulate downloading transcription as text file
  const downloadTranscription = (transcription: TranscriptionEntry) => {
    const filename = `transcription_${new Date().toISOString().slice(0, 10)}.txt`;
    const content = `Original (${transcription.originalLanguage}): ${transcription.originalText}\n\nTranslation (${transcription.targetLanguage}): ${transcription.translatedText}\n\nContext: ${transcription.context || 'N/A'}\nSubject: ${transcription.subject || 'N/A'}\nDate: ${formatDate(transcription.createdAt)}`;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
    
    toast({
      title: "Download started",
      description: `Downloading as ${filename}`,
    });
  };
  
  // Simulate live transcription
  const toggleLiveTranscription = () => {
    if (isLiveTranscribing) {
      // Stop live transcription
      if (liveTranscriptionRef.current) {
        clearInterval(liveTranscriptionRef.current);
        liveTranscriptionRef.current = null;
      }
      setIsLiveTranscribing(false);
      
      toast({
        title: "Live transcription stopped",
        description: "Live transcription has been stopped.",
      });
    } else {
      // Start live transcription
      setIsLiveTranscribing(true);
      setLiveTranscription("Listening...");
      
      // Simulate receiving transcription updates
      liveTranscriptionRef.current = setInterval(() => {
        const mockPhrases = [
          "The mitochondria is the powerhouse of the cell.",
          "In 1492, Columbus sailed the ocean blue.",
          "Water is composed of hydrogen and oxygen atoms.",
          "The square root of 144 is 12.",
          "Shakespeare wrote Romeo and Juliet.",
          "The capital of France is Paris."
        ];
        
        const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
        setLiveTranscription(randomPhrase);
      }, 5000);
      
      toast({
        title: "Live transcription started",
        description: "Live transcription is now active.",
      });
    }
  };
  
  // Render the component
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Transcription & Translation System</h1>
        <p className="text-muted-foreground">
          Transcribe speech, translate text, and build multilingual vocabulary resources for students.
        </p>
      </div>
      
      <Tabs defaultValue="translate" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="translate">
            <Globe className="mr-2 h-4 w-4" />
            Translate
          </TabsTrigger>
          <TabsTrigger value="vocabulary">
            <BookOpen className="mr-2 h-4 w-4" />
            Vocabulary
          </TabsTrigger>
          <TabsTrigger value="history">
            <FileText className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="translate" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Speech to Text</CardTitle>
                <CardDescription>
                  Record speech and convert it to text for translation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Recording Status</Label>
                    <Badge variant={isRecording ? "destructive" : "outline"}>
                      {isRecording ? `Recording (${recordingTime}s)` : "Ready"}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant={isRecording ? "destructive" : "default"} 
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isTranscribing}
                      className="flex-1"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="mr-2 h-4 w-4" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-4 w-4" />
                          Start Recording
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={toggleLiveTranscription}
                      className="flex-1"
                    >
                      {isLiveTranscribing ? (
                        <>
                          <X className="mr-2 h-4 w-4" />
                          Stop Live
                        </>
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Live Transcribe
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {isLiveTranscribing && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium">Live Transcription:</p>
                    <p className="italic">{liveTranscription}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="transcribedText">Transcribed Text</Label>
                  <Textarea
                    id="transcribedText"
                    placeholder={isTranscribing ? "Transcribing..." : "Transcribed text will appear here..."}
                    value={transcribedText}
                    onChange={(e) => {
                      setTranscribedText(e.target.value);
                      setTranscriptionForm(prev => ({
                        ...prev,
                        originalText: e.target.value
                      }));
                    }}
                    className="min-h-[120px]"
                    disabled={isTranscribing}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Translation Settings</CardTitle>
                <CardDescription>
                  Configure translation options and context.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="originalLanguage">Original Language</Label>
                    <Select
                      value={transcriptionForm.originalLanguage}
                      onValueChange={(value) => setTranscriptionForm(prev => ({ ...prev, originalLanguage: value }))}
                      disabled={isTranslating}
                    >
                      <SelectTrigger id="originalLanguage">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetLanguage">Target Language</Label>
                    <Select
                      value={transcriptionForm.targetLanguage}
                      onValueChange={(value) => setTranscriptionForm(prev => ({ ...prev, targetLanguage: value }))}
                      disabled={isTranslating}
                    >
                      <SelectTrigger id="targetLanguage">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="context">Context (Optional)</Label>
                  <Input
                    id="context"
                    name="context"
                    placeholder="e.g., Science lesson, Parent meeting"
                    value={transcriptionForm.context}
                    onChange={handleTranscriptionFormChange}
                    disabled={isTranslating}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject (Optional)</Label>
                  <Select
                    value={transcriptionForm.subject}
                    onValueChange={(value) => setTranscriptionForm(prev => ({ ...prev, subject: value }))}
                    disabled={isTranslating}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => translateText(
                    transcriptionForm.originalText,
                    transcriptionForm.originalLanguage,
                    transcriptionForm.targetLanguage
                  )}
                  disabled={!transcriptionForm.originalText.trim() || isTranslating || transcriptionForm.originalLanguage === transcriptionForm.targetLanguage}
                >
                  {isTranslating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Translate Text
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="vocabulary" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Vocabulary Term</CardTitle>
              <CardDescription>
                Create multilingual vocabulary resources for students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitVocabulary} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="term">Term</Label>
                    <Input
                      id="term"
                      name="term"
                      placeholder="e.g., Photosynthesis"
                      value={vocabularyForm.term}
                      onChange={handleVocabularyFormChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={vocabularyForm.subject}
                      onValueChange={(value) => setVocabularyForm(prev => ({ ...prev, subject: value }))}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="definition">Definition</Label>
                  <Textarea
                    id="definition"
                    name="definition"
                    placeholder="Enter the definition of the term..."
                    value={vocabularyForm.definition}
                    onChange={handleVocabularyFormChange}
                    className="min-h-[100px]"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Translations</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTranslation}
                      disabled={isLoading}
                    >
                      Add Translation
                    </Button>
                  </div>
                  
                  {vocabularyForm.translations.map((translation, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Select
                        value={translation.language}
                        onValueChange={(value) => handleTranslationChange(index, 'language', value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Input
                        placeholder="Translation"
                        value={translation.translation}
                        onChange={(e) => handleTranslationChange(index, 'translation', e.target.value)}
                        className="flex-1"
                        disabled={isLoading}
                      />
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTranslation(index)}
                        disabled={vocabularyForm.translations.length === 1 || isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Vocabulary Term
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vocabulary List</h3>
            
            {vocabularyList.length === 0 ? (
              <p className="text-muted-foreground">No vocabulary terms added yet.</p>
            ) : (
              vocabularyList.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{item.term}</CardTitle>
                      <Badge>{item.subject}</Badge>
                    </div>
                    <CardDescription>{formatDate(item.createdAt)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="mb-2">{item.definition}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.translations.map((translation, index) => (
                        <Badge key={index} variant="outline" className="flex items-center">
                          <span className="font-semibold mr-1">
                            {languageOptions.find(l => l.code === translation.language)?.name || translation.language}:
                          </span>
                          {translation.translation}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakText(item.term, 'en')}
                    >
                      <VolumeUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${item.term}: ${item.definition}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 mt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Transcription & Translation History</h3>
            
            {transcriptionHistory.length === 0 ? (
              <p className="text-muted-foreground">No transcription history yet.</p>
            ) : (
              transcriptionHistory.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {entry.subject && (
                          <Badge className="mr-2">{entry.subject}</Badge>
                        )}
                        {entry.context || "Untitled"}
                      </CardTitle>
                      <CardDescription>{formatDate(entry.createdAt)}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-3">
                    <div>
                      <div className="flex items-center mb-1">
                        <Badge variant="outline" className="mr-2">
                          {languageOptions.find(l => l.code === entry.originalLanguage)?.name || entry.originalLanguage}
                        </Badge>
                        <div className="flex-1"></div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => speakText(entry.originalText, entry.originalLanguage)}
                        >
                          <VolumeUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(entry.originalText)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm">{entry.originalText}</p>
                    </div>
                    
                    {entry.translatedText && (
                      <div>
                        <Separator className="my-2" />
                        <div className="flex items-center mb-1">
                          <Badge variant="outline" className="mr-2">
                            {languageOptions.find(l => l.code === entry.targetLanguage)?.name || entry.targetLanguage}
                          </Badge>
                          <div className="flex-1"></div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => speakText(entry.translatedText, entry.targetLanguage || 'en')}
                          >
                            <VolumeUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(entry.translatedText)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm">{entry.translatedText}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      onClick={() => downloadTranscription(entry)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
