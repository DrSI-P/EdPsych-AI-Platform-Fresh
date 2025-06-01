'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useAIService } from '@/lib/ai/ai-service';

export default function StudentVoiceCapture() {
  const { toast } = useToast();
  const aiService = useAIService();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [audioRecording, setAudioRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [drawingMode, setDrawingMode] = useState(false);
  const [sentiment, setSentiment] = useState('');
  const [themes, setThemes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [emotionDetected, setEmotionDetected] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [topic, setTopic] = useState('');
  const [ageGroup, setAgeGroup] = useState('primary');
  const [feedbackType, setFeedbackType] = useState('general');
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  // References for canvas and media recorder
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  
  // Initialize speech recognition (simulated)
  useEffect(() => {
    // In a real implementation, this would use the Web Speech API
    // For now, we'll simulate the functionality
    const simulateSpeechRecognition = () => {
      return {
        start: () => {
          console.log('Speech recognition started');
          setIsRecording(true);
        },
        stop: () => {
          console.log('Speech recognition stopped');
          setIsRecording(false);
        },
        onresult: null,
        onerror: null
      };
    };
    
    recognitionRef.current = simulateSpeechRecognition();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Initialize canvas for drawing
  useEffect(() => {
    if (activeTab === 'drawing' && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Set initial canvas state
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = 'black';
      context.lineWidth = 5;
      context.lineCap = 'round';
      
      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;
      
      // Drawing functions
      const startDrawing = (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
      };
      
      const draw = (e) => {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.stroke();
        
        lastX = x;
        lastY = y;
      };
      
      const stopDrawing = () => {
        isDrawing = false;
      };
      
      // Add event listeners
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);
      
      // Touch support
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
      });
      
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
      });
      
      canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
      });
      
      // Cleanup
      return () => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseout', stopDrawing);
        canvas.removeEventListener('touchstart', startDrawing);
        canvas.removeEventListener('touchmove', draw);
        canvas.removeEventListener('touchend', stopDrawing);
      };
    }
  }, [activeTab]);
  
  const startVoiceRecording = () => {
    // In a real implementation, this would use the MediaRecorder API
    // For now, we'll simulate the functionality
    setAudioRecording(true);
    audioChunksRef.current = [];
    
    // Simulate recording for 5 seconds
    setTimeout(() => {
      stopVoiceRecording();
    }, 5000);
  };
  
  const stopVoiceRecording = () => {
    setAudioRecording(false);
    
    // Simulate creating an audio blob and URL
    const simulatedAudioURL = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
    setAudioURL(simulatedAudioURL);
    
    // Simulate transcription
    setTimeout(() => {
      const simulatedTranscriptions = [
        "I think we should have more time for art and music in school.",
        "I find it hard to concentrate when the classroom is noisy.",
        "I really enjoy the science experiments we do in class.",
        "Sometimes I don't understand the homework and I'm afraid to ask for help.",
        "I wish we could learn more about different cultures and countries."
      ];
      
      const randomTranscription = simulatedTranscriptions[Math.floor(Math.random() * simulatedTranscriptions.length)];
      setTranscription(randomTranscription);
      setTextInput(randomTranscription);
    }, 1500);
  };
  
  const startSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      
      // Simulate receiving transcription after 3 seconds
      setTimeout(() => {
        const simulatedTranscriptions = [
          "I think we should have more time for art and music in school.",
          "I find it hard to concentrate when the classroom is noisy.",
          "I really enjoy the science experiments we do in class.",
          "Sometimes I don't understand the homework and I'm afraid to ask for help.",
          "I wish we could learn more about different cultures and countries."
        ];
        
        const randomTranscription = simulatedTranscriptions[Math.floor(Math.random() * simulatedTranscriptions.length)];
        setTranscription(randomTranscription);
        setTextInput(randomTranscription);
        
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 3000);
    }
  };
  
  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  const clearDrawing = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };
  
  const saveDrawing = () => {
    if (canvasRef.current) {
      try {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL('image/png');
        
        // In a real implementation, this would save the image
        // For now, we'll just show a success message
        toast({
          title: "Drawing Saved",
          description: "Your drawing has been saved successfully.",
        });
        
        // Simulate AI analysis of the drawing
        analyzeDrawing();
      } catch (error) {
        toast({
          title: "Error Saving Drawing",
          description: "There was a problem saving your drawing. Please try again.",
          variant: "destructive"
        });
        console.error(error);
      }
    }
  };
  
  const analyzeInput = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text or record your voice before analysing.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call the AI service
      // For now, we'll simulate the response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate sentiment analysis
      const sentiments = ['positive', 'neutral', 'negative', 'mixed'];
      const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      setSentiment(randomSentiment);
      
      // Simulate theme extraction
      const possibleThemes = [
        'Learning Environment', 'Curriculum Content', 'Teaching Methods', 
        'Social Interaction', 'Assessment', 'Support Needs', 'Emotional Well-being'
      ];
      const selectedThemes = [];
      const numThemes = Math.floor(Math.random() * 3) + 1; // 1-3 themes
      
      for (let i = 0; i < numThemes; i++) {
        const randomIndex = Math.floor(Math.random() * possibleThemes.length);
        const theme = possibleThemes[randomIndex];
        if (!selectedThemes.includes(theme)) {
          selectedThemes.push(theme);
        }
      }
      
      setThemes(selectedThemes);
      
      // Simulate emotion detection
      const emotions = ['Joy', 'Frustration', 'Curiosity', 'Anxiety', 'Pride', 'Boredom', 'Excitement'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotionDetected(randomEmotion);
      
      // Simulate confidence score
      const randomConfidence = Math.floor(Math.random() * 30) + 70; // 70-99%
      setConfidenceScore(randomConfidence);
      
      // Simulate suggestions based on input
      const possibleSuggestions = [
        'Consider incorporating more hands-on activities',
        'Provide additional support for challenging concepts',
        'Create more opportunities for collaborative learning',
        'Offer alternative ways to demonstrate understanding',
        'Incorporate more student choice in learning activities',
        'Provide clearer instructions for assignments',
        'Create a quieter learning environment when needed'
      ];
      
      const selectedSuggestions = [];
      const numSuggestions = Math.floor(Math.random() * 3) + 1; // 1-3 suggestions
      
      for (let i = 0; i < numSuggestions; i++) {
        const randomIndex = Math.floor(Math.random() * possibleSuggestions.length);
        const suggestion = possibleSuggestions[randomIndex];
        if (!selectedSuggestions.includes(suggestion)) {
          selectedSuggestions.push(suggestion);
        }
      }
      
      setSuggestions(selectedSuggestions);
      
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "There was a problem analysing your input. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const analyzeDrawing = async () => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would analyse the drawing using AI
      // For now, we'll simulate the response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate emotion detection from drawing
      const emotions = ['Joy', 'Frustration', 'Curiosity', 'Anxiety', 'Pride', 'Boredom', 'Excitement'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotionDetected(randomEmotion);
      
      // Simulate confidence score
      const randomConfidence = Math.floor(Math.random() * 30) + 70; // 70-99%
      setConfidenceScore(randomConfidence);
      
      // Simulate theme extraction
      const possibleThemes = [
        'Self-expression', 'Creativity', 'Emotional State', 
        'Social Relationships', 'School Environment', 'Learning Preferences'
      ];
      const selectedThemes = [];
      const numThemes = Math.floor(Math.random() * 3) + 1; // 1-3 themes
      
      for (let i = 0; i < numThemes; i++) {
        const randomIndex = Math.floor(Math.random() * possibleThemes.length);
        const theme = possibleThemes[randomIndex];
        if (!selectedThemes.includes(theme)) {
          selectedThemes.push(theme);
        }
      }
      
      setThemes(selectedThemes);
      
      // Simulate suggestions based on drawing
      const possibleSuggestions = [
        'Provide more opportunities for creative expression',
        'Consider incorporating art-based learning activities',
        'Create a safe space for emotional expression',
        'Offer alternative ways to demonstrate understanding',
        'Incorporate more visual learning materials',
        'Consider the emotional impact of the learning environment'
      ];
      
      const selectedSuggestions = [];
      const numSuggestions = Math.floor(Math.random() * 3) + 1; // 1-3 suggestions
      
      for (let i = 0; i < numSuggestions; i++) {
        const randomIndex = Math.floor(Math.random() * possibleSuggestions.length);
        const suggestion = possibleSuggestions[randomIndex];
        if (!selectedSuggestions.includes(suggestion)) {
          selectedSuggestions.push(suggestion);
        }
      }
      
      setSuggestions(selectedSuggestions);
      
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "There was a problem analysing your drawing. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const submitFeedback = () => {
    toast({
      title: "Feedback Submitted",
      description: "Thank you for sharing your thoughts! Your voice matters and helps us improve.",
    });
    
    // Reset form
    setTextInput('');
    setAudioURL('');
    setTranscription('');
    setSentiment('');
    setThemes([]);
    setSuggestions([]);
    setEmotionDetected('');
    setConfidenceScore(0);
    
    // Clear canvas if in drawing mode
    if (activeTab === 'drawing' && canvasRef.current) {
      clearDrawing();
    }
  };
  
  const renderTextInput = () => (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-centre mb-2">
          <Label htmlFor="topic">What would you like to give feedback about?</Label>
        </div>
        <Input 
          id="topic" 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          placeholder="e.g., Classroom, Lessons, Homework, Teachers, Friends"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-centre mb-2">
          <Label htmlFor="feedback-text">Your thoughts</Label>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={startSpeechRecognition}
              disabled={isRecording}
              className="flex items-centre gap-1 h-8"
            >
              <span className="h-4 w-4">🎤</span>
              <span>Voice Input</span>
            </Button>
          </div>
        </div>
        <Textarea 
          id="feedback-text" 
          value={textInput} 
          onChange={(e) => setTextInput(e.target.value)} 
          placeholder="Share your thoughts, ideas, or feelings about school..."
          className="min-h-[150px]"
        />
      </div>
      
      {isRecording && (
        <div className="bg-primary/10 p-4 rounded-md">
          <div className="flex items-centre mb-2">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse mr-2"></div>
            <span className="font-medium">Listening...</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={stopSpeechRecognition}
          >
            Stop Listening
          </Button>
        </div>
      )}
      
      {transcription && !isRecording && (
        <div className="bg-muted p-4 rounded-md">
          <p className="text-sm font-medium mb-1">Transcription:</p>
          <p className="text-sm">{transcription}</p>
        </div>
      )}
      
      <div className="pt-2">
        <Button 
          onClick={analyzeInput} 
          disabled={isProcessing || !textInput.trim()}
          className="w-full"
        >
          {isProcessing ? 'Analysing...' : 'Analyse My Feedback'}
        </Button>
      </div>
    </div>
  );
  
  const renderVoiceInput = () => (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-centre mb-2">
          <Label htmlFor="topic-voice">What would you like to give feedback about?</Label>
        </div>
        <Input 
          id="topic-voice" 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          placeholder="e.g., Classroom, Lessons, Homework, Teachers, Friends"
        />
      </div>
      
      <div className="bg-muted p-6 rounded-md flex flex-col items-centre justify-centre min-h-[200px]">
        {!audioURL ? (
          <>
            <div className="mb-4 text-centre">
              <p className="font-medium mb-2">Record your voice to share your thoughts</p>
              <p className="text-sm text-muted-foreground">
                Speak clearly and take your time. You can listen to your recording before submitting.
              </p>
            </div>
            
            {audioRecording ? (
              <div className="flex flex-col items-centre">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-centre justify-centre mb-4 relative">
                  <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-25"></div>
                </div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={stopVoiceRecording}
                  className="rounded-full h-12 w-12 p-0 flex items-centre justify-centre"
                >
                  <span className="text-xl">⏹️</span>
                </Button>
                <p className="text-sm mt-2">Recording...</p>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="lg" 
                onClick={startVoiceRecording}
                className="rounded-full h-16 w-16 p-0 flex items-centre justify-centre"
              >
                <span className="text-2xl">🎤</span>
              </Button>
            )}
          </>
        ) : (
          <div className="w-full">
            <div className="mb-4">
              <p className="font-medium mb-2">Your recording</p>
              <audio src={audioURL} controls className="w-full"></audio>
            </div>
            
            {transcription && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Transcription:</p>
                <div className="p-3 bg-background rounded-md text-sm">
                  {transcription}
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setAudioURL('');
                  setTranscription('');
                }}
              >
                Record Again
              </Button>
              <Button 
                onClick={analyzeInput} 
                disabled={isProcessing}
              >
                {isProcessing ? 'Analysing...' : 'Analyse Recording'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderDrawingInput = () => (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-centre mb-2">
          <Label htmlFor="topic-drawing">What are you drawing about?</Label>
        </div>
        <Input 
          id="topic-drawing" 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          placeholder="e.g., My classroom, How school makes me feel, My favourite lesson"
        />
      </div>
      
      <div className="border rounded-md p-2">
        <div className="flex justify-between items-centre mb-2">
          <p className="text-sm font-medium">Draw your thoughts and feelings</p>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearDrawing}
            >
              Clear
            </Button>
          </div>
        </div>
        <canvas 
          ref={canvasRef} 
          className="w-full h-[300px] border rounded cursor-crosshair touch-none"
        ></canvas>
      </div>
      
      <div className="pt-2">
        <Button 
          onClick={saveDrawing} 
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Analysing...' : 'Save & Analyse Drawing'}
        </Button>
      </div>
    </div>
  );
  
  const renderAnalysisResults = () => {
    if (!sentiment && themes.length === 0 && suggestions.length === 0 && !emotionDetected) {
      return null;
    }
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            AI-powered insights from your feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emotionDetected && (
            <div>
              <h4 className="font-medium mb-2">Emotion Detected</h4>
              <div className="flex items-centre space-x-2">
                <div className="text-2xl">
                  {emotionDetected === 'Joy' && '😊'}
                  {emotionDetected === 'Frustration' && '😣'}
                  {emotionDetected === 'Curiosity' && '🤔'}
                  {emotionDetected === 'Anxiety' && '😰'}
                  {emotionDetected === 'Pride' && '😌'}
                  {emotionDetected === 'Boredom' && '😒'}
                  {emotionDetected === 'Excitement' && '😃'}
                </div>
                <div>
                  <p className="font-medium">{emotionDetected}</p>
                  <p className="text-sm text-muted-foreground">Confidence: {confidenceScore}%</p>
                </div>
              </div>
            </div>
          )}
          
          {sentiment && (
            <div>
              <h4 className="font-medium mb-2">Overall Sentiment</h4>
              <div className={`
                inline-flex items-centre px-3 py-1 rounded-full text-sm font-medium
                ${sentiment === 'positive' ? 'bg-green-100 text-green-800' : ''}
                ${sentiment === 'negative' ? 'bg-red-100 text-red-800' : ''}
                ${sentiment === 'neutral' ? 'bg-grey-100 text-grey-800' : ''}
                ${sentiment === 'mixed' ? 'bg-yellow-100 text-yellow-800' : ''}
              `}>
                {sentiment === 'positive' && '👍 Positive'}
                {sentiment === 'negative' && '👎 Negative'}
                {sentiment === 'neutral' && '😐 Neutral'}
                {sentiment === 'mixed' && '🤔 Mixed'}
              </div>
            </div>
          )}
          
          {themes.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Key Themes</h4>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-centre px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {suggestions.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Suggested Actions</h4>
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">💡</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={submitFeedback} className="w-full">
            Submit Feedback
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Share Your Voice</CardTitle>
          <CardDescription>
            Your thoughts and feelings matter. Choose how you'd like to express yourself.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">I am in:</Label>
              <RadioGroup 
                value={ageGroup} 
                onValueChange={setAgeGroup}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="primary" id="primary" />
                  <Label htmlFor="primary">Primary School</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="secondary" id="secondary" />
                  <Label htmlFor="secondary">Secondary School</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="college" id="college" />
                  <Label htmlFor="college">College/Sixth Form</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="mb-2 block">Type of feedback:</Label>
              <RadioGroup 
                value={feedbackType} 
                onValueChange={setFeedbackType}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="general" id="general" />
                  <Label htmlFor="general">General Thoughts</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="suggestion" id="suggestion" />
                  <Label htmlFor="suggestion">Suggestion</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="concern" id="concern" />
                  <Label htmlFor="concern">Concern</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="appreciation" id="appreciation" />
                  <Label htmlFor="appreciation">Appreciation</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Tabs defaultValue="text" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="voice">Voice</TabsTrigger>
                <TabsTrigger value="drawing">Drawing</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="pt-4">
                {renderTextInput()}
              </TabsContent>
              <TabsContent value="voice" className="pt-4">
                {renderVoiceInput()}
              </TabsContent>
              <TabsContent value="drawing" className="pt-4">
                {renderDrawingInput()}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      {renderAnalysisResults()}
    </div>
  );
}
