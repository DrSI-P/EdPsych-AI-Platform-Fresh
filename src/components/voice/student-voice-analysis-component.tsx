import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Progress, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/index";
import { Mic, MicOff, Play, Square, BarChart, BookOpen, Brain, Lightbulb, Settings } from 'lucide-react';
import { getStudentVoiceAnalysisService, StudentVoiceAnalysisResult, StudentVoiceAnalysisOptions } from '@/lib/voice/student-voice-analysis';
import { getSpeechRecognitionService, SpeechRecognitionResult } from '@/lib/voice/speechRecognition';
import { Avatar } from '@/components/ui/avatar';

/**
 * Student Voice Analysis Component
 * 
 * This component provides advanced voice pattern recognition and sentiment analysis
 * specifically designed for children and young people in educational contexts.
 */
export const StudentVoiceAnalysisComponent: React.FC = () => {
  // State for recording and analysis
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recognitionResult, setRecognitionResult] = useState<SpeechRecognitionResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<StudentVoiceAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('reading');
  
  // State for settings
  const [settings, setSettings] = useState<StudentVoiceAnalysisOptions>({
    ageGroup: 'primary',
    educationalContext: 'classroom',
    readingLevel: 'developing',
    feedbackMode: 'supportive',
    learningDifficulties: {
      dyslexia: false,
      dyspraxia: false,
      speechImpediment: false,
      hearingImpairment: false,
      attentionDifficulties: false
    }
  });
  
  // References
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  
  // Initialize services
  useEffect(() => {
    // Initialize student voice analysis service with settings
    getStudentVoiceAnalysisService(settings);
    
    // Clean up on unmount
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);
  
  // Update services when settings change
  useEffect(() => {
    getStudentVoiceAnalysisService(settings);
  }, [settings]);
  
  // Start recording
  const startRecording = async () => {
    try {
      // Reset state
      setRecordingDuration(0);
      setRecognitionResult(null);
      setAnalysisResult(null);
      
      // Initialize audio context if needed
      if (!audioContext.current) {
        audioContext.current = new AudioContext();
      }
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize media recorder
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      
      // Set up media recorder events
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      
      // Start recording
      mediaRecorder.current.start();
      setIsRecording(true);
      
      // Start speech recognition
      const speechRecognition = getSpeechRecognitionService({
        continuous: true,
        interimResults: true,
        lang: 'en-GB',
        childVoiceOptimization: true,
        specialEducationalNeeds: settings.learningDifficulties
      });
      
      speechRecognition.start(
        (result) => {
          if (result.isFinal) {
            setRecognitionResult(result);
          }
        },
        (error) => {
          console.error('Speech recognition error:', error);
        }
      );
      
      // Start recording duration timer
      recordingInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    // Stop media recorder
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      
      // Process audio when recording stops
      mediaRecorder.current.onstop = async () => {
        // Create audio blob
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        
        // Analyze speech
        if (recognitionResult) {
          analyzeStudentSpeech(recognitionResult, audioBlob, recordingDuration * 1000);
        }
      };
    }
    
    // Stop speech recognition
    const speechRecognition = getSpeechRecognitionService();
    speechRecognition.stop();
    
    // Stop recording duration timer
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    
    setIsRecording(false);
  };
  
  // Analyze student speech
  const analyzeStudentSpeech = async (
    result: SpeechRecognitionResult, 
    audioBlob?: Blob, 
    durationMs: number = 5000
  ) => {
    setIsAnalyzing(true);
    
    try {
      // Get student voice analysis service
      const studentVoiceAnalysis = getStudentVoiceAnalysisService();
      
      // Process audio data if available
      let audioData = null;
      if (audioBlob && audioContext.current) {
        const arrayBuffer = await audioBlob.arrayBuffer();
        audioData = await audioContext.current.decodeAudioData(arrayBuffer);
      }
      
      // Analyze speech
      const analysisResult = await studentVoiceAnalysis.analyzeStudentSpeech(
        result,
        audioData,
        durationMs
      );
      
      if (analysisResult) {
        setAnalysisResult(analysisResult);
      }
    } catch (error) {
      console.error('Error analyzing student speech:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Update settings
  const updateSettings = (key: string, value: any) => {
    setSettings(prev => {
      if (key.includes('.')) {
        // Handle nested properties
        const [parent, child] = key.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      } else {
        // Handle top-level properties
        return {
          ...prev,
          [key]: value
        };
      }
    });
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* AI Avatar Video Placeholder */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center">
        <div className="mr-4 flex-shrink-0">
          <Avatar className="h-16 w-16 bg-primary text-primary-foreground">
            <span className="text-xl">AI</span>
          </Avatar>
        </div>
        <div>
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">
            Student Voice Analysis Tutorial
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            This video explains how to use the Student Voice Analysis tool to assess reading fluency, 
            language skills, and engagement levels.
          </p>
        </div>
      </div>
      
      {/* Recording Card */}
      <Card className="mb-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Student Voice Analysis</h2>
          <div className="text-sm text-gray-500">
            {isRecording ? `Recording: ${recordingDuration}s` : 'Ready to record'}
          </div>
        </div>
        
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4">
            {isRecording ? (
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full h-16 w-16 flex items-center justify-center"
                onClick={stopRecording}
              >
                <Square className="h-6 w-6" />
              </Button>
            ) : (
              <Button
                variant="default"
                size="lg"
                className="rounded-full h-16 w-16 flex items-center justify-center bg-primary hover:bg-primary/90"
                onClick={startRecording}
                disabled={isAnalyzing}
              >
                <Mic className="h-6 w-6" />
              </Button>
            )}
          </div>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            {isRecording 
              ? "Click to stop recording" 
              : isAnalyzing 
                ? "Analyzing speech..." 
                : "Click to start recording"}
          </p>
        </div>
        
        {recognitionResult && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-md font-medium mb-2">Recognized Speech:</h3>
            <p className="text-gray-700 dark:text-gray-300">{recognitionResult.text}</p>
            <div className="mt-2 flex items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                Confidence:
              </span>
              <Progress 
                value={recognitionResult.confidence * 100} 
                className="h-2 w-24"
              />
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                {Math.round(recognitionResult.confidence * 100)}%
              </span>
            </div>
          </div>
        )}
      </Card>
      
      {/* Analysis Results */}
      {analysisResult && (
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="reading" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Reading
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                Language
              </TabsTrigger>
              <TabsTrigger value="engagement" className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Engagement
              </TabsTrigger>
              <TabsTrigger value="learning" className="flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                Learning Style
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="reading">
              {analysisResult.readingAssessment ? (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Fluency Score</h3>
                      <div className="flex items-center">
                        <Progress 
                          value={analysisResult.readingAssessment.fluencyScore} 
                          className="h-2 flex-grow mr-2"
                        />
                        <span className="text-sm font-medium">
                          {analysisResult.readingAssessment.fluencyScore}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Accuracy Score</h3>
                      <div className="flex items-center">
                        <Progress 
                          value={analysisResult.readingAssessment.accuracyScore} 
                          className="h-2 flex-grow mr-2"
                        />
                        <span className="text-sm font-medium">
                          {analysisResult.readingAssessment.accuracyScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Reading Level</h3>
                    <p className="text-md font-semibold">
                      {analysisResult.readingAssessment.readingLevel}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Strengths</h3>
                      <ul className="list-disc list-inside text-sm">
                        {analysisResult.readingAssessment.strengths.map((strength, index) => (
                          <li key={index} className="mb-1">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Areas for Improvement</h3>
                      <ul className="list-disc list-inside text-sm">
                        {analysisResult.readingAssessment.areasForImprovement.map((area, index) => (
                          <li key={index} className="mb-1">{area}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Reading assessment data not available.
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="language">
              {analysisResult.languageAssessment ? (
                <div>
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Vocabulary Level</h3>
                    <p className="text-md font-semibold">
                      {analysisResult.languageAssessment.vocabularyLevel}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Grammar Accuracy</h3>
                      <div className="flex items-center">
                        <Progress 
                          value={analysisResult.languageAssessment.grammarAccuracy * 100} 
                          className="h-2 flex-grow mr-2"
                        />
                        <span className="text-sm font-medium">
                          {Math.round(analysisResult.languageAssessment.grammarAccuracy * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Sentence Complexity</h3>
                      <div className="flex items-center">
                        <Progress 
                          value={analysisResult.languageAssessment.sentenceComplexity * 100} 
                          className="h-2 flex-grow mr-2"
                        />
                        <span className="text-sm font-medium">
                          {Math.round(analysisResult.languageAssessment.sentenceComplexity * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Topic Adherence</h3>
                      <div className="flex items-center">
                        <Progress 
                          value={analysisResult.languageAssessment.topicAdherence * 100} 
                          className="h-2 flex-grow mr-2"
                        />
                        <span className="text-sm font-medium">
                          {Math.round(analysisResult.languageAssessment.topicAdherence * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Concept Understanding</h3>
                      <div className="flex items-center">
                        <Progress 
                          value={analysisResult.languageAssessment.conceptUnderstanding * 100} 
                          className="h-2 flex-grow mr-2"
                        />
                        <span className="text-sm font-medium">
                          {Math.round(analysisResult.languageAssessment.conceptUnderstanding * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Language assessment data not available.
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="engagement">
              {analysisResult.engagementAssessment ? (
                <div>
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Overall Engagement</h3>
                    <div className="flex items-center">
                      <Progress 
                        value={analysisResult.engagementAssessment.overallEngagement * 100} 
                        className="h-2 flex-grow mr-2"
                      />
                      <span className="text-sm font-medium">
                        {Math.round(analysisResult.engagementAssessment.overallEngagement * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Confidence</h3>
                      <div className="flex items-center">
                        <Progress 
                          value={analysisResult.engagementAssessment.confidence * 100} 
                          className="h-2 flex-grow mr-2"
                        />
                        <span className="text-sm font-medium">
                          {Math.round(analysisResult.engagementAssessment.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Interest</h3>
                      <div className="flex items-center">
                        <Progress 
                          value={analysisResult.engagementAssessment.interest * 100} 
                          className="h-2 flex-grow mr-2"
                        />
                        <span className="text-sm font-medium">
                          {Math.round(analysisResult.engagementAssessment.interest * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Understanding</h3>
                      <div className="flex items-center">
                        <Progress 
                          value={analysisResult.engagementAssessment.understanding * 100} 
                          className="h-2 flex-grow mr-2"
                        />
                        <span className="text-sm font-medium">
                          {Math.round(analysisResult.engagementAssessment.understanding * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Attention Level</h3>
                      <p className="text-md font-semibold capitalize">
                        {analysisResult.engagementAssessment.attentionLevel}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Frustration Indicators</h3>
                      <p className="text-md font-semibold">
                        {analysisResult.engagementAssessment.frustrationIndicators ? 'Present' : 'Not detected'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Engagement assessment data not available.
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="learning">
              {analysisResult.learningStyleIndicators ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-md font-medium mb-3">Learning Style Indicators</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Visual</span>
                          <span className="text-sm text-gray-500">
                            {Math.round(analysisResult.learningStyleIndicators.visual * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={analysisResult.learningStyleIndicators.visual * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Auditory</span>
                          <span className="text-sm text-gray-500">
                            {Math.round(analysisResult.learningStyleIndicators.auditory * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={analysisResult.learningStyleIndicators.auditory * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Kinesthetic</span>
                          <span className="text-sm text-gray-500">
                            {Math.round(analysisResult.learningStyleIndicators.kinesthetic * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={analysisResult.learningStyleIndicators.kinesthetic * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Reading/Writing</span>
                          <span className="text-sm text-gray-500">
                            {Math.round(analysisResult.learningStyleIndicators.readingWriting * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={analysisResult.learningStyleIndicators.readingWriting * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {analysisResult.adaptiveFeedback && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-md font-medium mb-3">Adaptive Feedback</h3>
                      
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1">Encouragement:</h4>
                        <p className="text-sm">{analysisResult.adaptiveFeedback.encouragement}</p>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1">Guidance:</h4>
                        <p className="text-sm">{analysisResult.adaptiveFeedback.guidance}</p>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1">Next Steps:</h4>
                        <p className="text-sm">{analysisResult.adaptiveFeedback.nextSteps}</p>
                      </div>
                      
                      {analysisResult.adaptiveFeedback.resourceSuggestions && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Resource Suggestions:</h4>
                          <ul className="list-disc list-inside text-sm">
                            {analysisResult.adaptiveFeedback.resourceSuggestions.map((resource, index) => (
                              <li key={index} className="mb-1">
                                {resource.title} ({resource.type})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Learning style data not available.
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium mb-2">Age Group</h3>
                  <div className="flex space-x-2">
                    {['early-years', 'primary', 'secondary', 'adult'].map((age) => (
                      <Button
                        key={age}
                        variant={settings.ageGroup === age ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings('ageGroup', age)}
                        className="capitalize"
                      >
                        {age.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Educational Context</h3>
                  <div className="flex space-x-2">
                    {['classroom', 'assessment', 'tutoring', 'practice'].map((context) => (
                      <Button
                        key={context}
                        variant={settings.educationalContext === context ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings('educationalContext', context)}
                        className="capitalize"
                      >
                        {context}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Reading Level</h3>
                  <div className="flex space-x-2">
                    {['emerging', 'developing', 'fluent', 'advanced'].map((level) => (
                      <Button
                        key={level}
                        variant={settings.readingLevel === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings('readingLevel', level)}
                        className="capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Feedback Mode</h3>
                  <div className="flex space-x-2">
                    {['supportive', 'instructional', 'minimal'].map((mode) => (
                      <Button
                        key={mode}
                        variant={settings.feedbackMode === mode ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings('feedbackMode', mode)}
                        className="capitalize"
                      >
                        {mode}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Learning Difficulties</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(settings.learningDifficulties).map((difficulty) => (
                      <Button
                        key={difficulty}
                        variant={settings.learningDifficulties[difficulty] ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings(
                          `learningDifficulties.${difficulty}`, 
                          !settings.learningDifficulties[difficulty]
                        )}
                        className="capitalize justify-start"
                      >
                        <span className="mr-2">
                          {settings.learningDifficulties[difficulty] ? '✓' : ''}
                        </span>
                        {difficulty.replace(/([A-Z])/g, ' $1').trim()}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default StudentVoiceAnalysisComponent;
