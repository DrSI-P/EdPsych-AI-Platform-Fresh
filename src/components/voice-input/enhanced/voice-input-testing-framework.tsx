'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { createBrowserSpeechRecognition } from './browser-compatibility-layer';
import { ukAccentOptions, useUKAccentRecognition } from './uk-accent-recognition';

// Define types for accent samples
type AccentSample = {
  id: string;
  name: string;
  region: string;
  phrases: string[];
  description: string;
};

/**
 * UK Accent Samples
 * 
 * This collection provides test phrases for different UK accents and dialects,
 * allowing for comprehensive testing of the voice recognition system.
 */
const ukAccentSamples: AccentSample[] = [
  {
    id: 'rp',
    name: 'Received Pronunciation',
    region: 'Standard British English',
    phrases: [
      'How now brown cow',
      'The rain in Spain stays mainly in the plain',
      'Could you please tell me the way to the nearest railway station',
      'I would like a cup of tea with milk and sugar',
      'The quick brown fox jumps over the lazy dog'
    ],
    description: 'Often associated with BBC English or the Queen\'s English, characterized by non-rhotic pronunciation.'
  },
  {
    id: 'cockney',
    name: 'Cockney',
    region: 'East London',
    phrases: [
      'Up the apples and pears',
      'I\'m going down the frog and toad',
      'Have a butcher\'s at this',
      'It\'s brass monkeys outside today',
      'I\'m Hank Marvin, let\'s get some Ruby Murray'
    ],
    description: 'Known for its distinctive rhyming slang, glottal stops, and h-dropping.'
  },
  {
    id: 'geordie',
    name: 'Geordie',
    region: 'Newcastle and Tyneside',
    phrases: [
      'Howay man, let\'s gan doon the toon',
      'It\'s proper canny, like',
      'I\'m absolutely hacky, pet',
      'Are you coming for a bevvy?',
      'It\'s chucking it down outside'
    ],
    description: 'Distinctive northeastern accent with unique vocabulary and pronunciation patterns.'
  },
  {
    id: 'scouse',
    name: 'Scouse',
    region: 'Liverpool',
    phrases: [
      'That\'s dead good, la',
      'I\'m made up with that',
      'Where\'s me butties?',
      'I\'m going to the ozzy',
      'She\'s got a right cob on'
    ],
    description: 'Characterized by nasal quality and distinctive intonation patterns.'
  },
  {
    id: 'scottish',
    name: 'Scottish',
    region: 'Scotland',
    phrases: [
      'It\'s a braw bricht moonlicht nicht the nicht',
      'Ye cannae shove yer granny aff a bus',
      'I\'m away to the shops',
      'That\'s a wee bonnie lassie',
      'Haud yer wheesht'
    ],
    description: 'Includes various dialects with rolled Rs and distinctive vowel sounds.'
  },
  {
    id: 'welsh',
    name: 'Welsh',
    region: 'Wales',
    phrases: [
      'Now in a minute',
      'I\'ll be there now in a bit',
      'That\'s tidy, that is',
      'I\'m absolutely tamping',
      'Who\'s coat is that jacket?'
    ],
    description: 'Melodic intonation with distinctive rising and falling patterns.'
  },
  {
    id: 'west_country',
    name: 'West Country',
    region: 'Southwest England',
    phrases: [
      'Alright my lover?',
      'That\'s proper job',
      'Where\'s that to?',
      'I\'m a bit of a dimpsy',
      'He\'s a right gabester'
    ],
    description: 'Characterized by rhotic R sounds and slower pace of speech.'
  },
  {
    id: 'northern',
    name: 'Northern',
    region: 'Northern England',
    phrases: [
      'It\'s reet good',
      'Put wood in th\'ole',
      'I\'m off down t\'shops',
      'It\'s chucking it down',
      'That\'s champion, that'
    ],
    description: 'Includes Yorkshire, Lancashire and other northern dialects with flat vowels.'
  },
  {
    id: 'brummie',
    name: 'Brummie',
    region: 'Birmingham',
    phrases: [
      'Alright bab?',
      'That\'s bostin\' that is',
      'I\'m going round the island',
      'He\'s a right yampy',
      'I\'m absolutely saft'
    ],
    description: 'Distinctive downward intonation and drawn-out vowels.'
  },
  {
    id: 'children',
    name: 'Children\'s Speech',
    region: 'Various',
    phrases: [
      'Can I have an ice cweam please?',
      'I wike playing with my fwiends',
      'The wabbit is weally soft',
      'I can\'t find my teddy anywhewe',
      'That\'s my favwit toy'
    ],
    description: 'Common speech patterns of young children, including difficulty with certain consonants.'
  }
];

/**
 * Voice Input Testing Framework Component
 * 
 * This component provides a comprehensive testing framework for voice input,
 * with support for different UK accents and dialects.
 */
export default function VoiceInputTestingFramework() {
  // State
  const [selectedAccent, setSelectedAccent] = useState<string>('rp');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [currentPhrase, setCurrentPhrase] = useState<string>('');
  const [testResults, setTestResults] = useState<Record<string, {
    attempted: boolean;
    success: boolean;
    transcript: string;
    confidence: number;
  }>>({});
  const [overallScore, setOverallScore] = useState<number>(0);
  const [testInProgress, setTestInProgress] = useState<boolean>(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState<number>(0);
  
  // Recognition engine reference
  const recognitionRef = React.useRef<any>(null);
  
  // Get current accent sample
  const currentAccentSample = ukAccentSamples.find(sample => sample.id === selectedAccent) || ukAccentSamples[0];
  
  // Use UK accent recognition
  const accentRecognition = useUKAccentRecognition({
    initialAccent: selectedAccent === 'children' ? 'uk_children' : 'uk_general',
    adaptiveMode: true,
    sensitivityLevel: 75,
  });
  
  // Initialize speech recognition
  useEffect(() => {
    // Create recognition instance with browser compatibility
    const recognition = createBrowserSpeechRecognition({
      continuous: false,
      interimResults: true,
      lang: accentRecognition.getLanguageCode(),
    });
    
    // Set up event handlers
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      setIsListening(false);
      
      // Record failed attempt
      if (currentPhrase && testInProgress) {
        setTestResults(prev => ({
          ...prev,
          [currentPhrase]: {
            attempted: true,
            success: false,
            transcript: '',
            confidence: 0,
          }
        }));
        
        // Move to next phrase
        moveToNextPhrase();
      }
    };
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      
      // Process the result with accent optimization
      const processedResult = accentRecognition.processRecognitionResult([{
        transcript: result[0].transcript,
        confidence: result[0].confidence
      }]);
      
      // Apply children's speech optimizations if needed
      const optimizedTranscript = accentRecognition.applyChildrenSpeechOptimizations(
        processedResult.transcript
      );
      
      setTranscript(optimizedTranscript);
      
      // If final result and test in progress, evaluate
      if (result.isFinal && testInProgress && currentPhrase) {
        evaluateResult(optimizedTranscript, processedResult.confidence);
      }
    };
    
    // Store recognition instance
    recognitionRef.current = recognition;
    
    // Cleanup
    return () => {
      if (recognitionRef.current?.isListening) {
        recognitionRef.current.abort();
      }
    };
  }, [accentRecognition, currentPhrase, testInProgress]);
  
  // Evaluate recognition result
  const evaluateResult = (transcript: string, confidence: number) => {
    if (!currentPhrase) return;
    
    // Calculate similarity between transcript and current phrase
    const similarity = calculateStringSimilarity(
      transcript.toLowerCase().trim(),
      currentPhrase.toLowerCase().trim()
    );
    
    // Determine success (similarity > 0.7 or confidence > 0.8)
    const success = similarity > 0.7 || confidence > 0.8;
    
    // Record result
    setTestResults(prev => ({
      ...prev,
      [currentPhrase]: {
        attempted: true,
        success,
        transcript,
        confidence,
      }
    }));
    
    // Move to next phrase
    moveToNextPhrase();
  };
  
  // Calculate string similarity (Levenshtein distance-based)
  const calculateStringSimilarity = (str1: string, str2: string): number => {
    const track = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator, // substitution
        );
      }
    }
    
    const distance = track[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    
    // Return similarity as 1 - normalized distance
    return 1 - distance / maxLength;
  };
  
  // Start test
  const startTest = () => {
    setTestInProgress(true);
    setCurrentPhraseIndex(0);
    setTestResults({});
    setOverallScore(0);
    
    // Set first phrase
    if (currentAccentSample.phrases.length > 0) {
      setCurrentPhrase(currentAccentSample.phrases[0]);
    }
  };
  
  // Stop test
  const stopTest = () => {
    setTestInProgress(false);
    setCurrentPhrase('');
    
    if (recognitionRef.current?.isListening) {
      recognitionRef.current.stop();
    }
  };
  
  // Reset test
  const resetTest = () => {
    stopTest();
    setTestResults({});
    setOverallScore(0);
    setCurrentPhraseIndex(0);
    setTranscript('');
  };
  
  // Move to next phrase
  const moveToNextPhrase = () => {
    // Stop listening
    if (recognitionRef.current?.isListening) {
      recognitionRef.current.stop();
    }
    
    // Calculate current progress
    const totalPhrases = currentAccentSample.phrases.length;
    const completedPhrases = Object.keys(testResults).length;
    const successfulPhrases = Object.values(testResults).filter(result => result.success).length;
    
    // Update overall score
    setOverallScore(totalPhrases > 0 ? (successfulPhrases / totalPhrases) * 100 : 0);
    
    // Check if test is complete
    if (currentPhraseIndex >= totalPhrases - 1) {
      // Test complete
      setTestInProgress(false);
      setCurrentPhrase('');
      return;
    }
    
    // Move to next phrase
    const nextIndex = currentPhraseIndex + 1;
    setCurrentPhraseIndex(nextIndex);
    setCurrentPhrase(currentAccentSample.phrases[nextIndex]);
    
    // Clear transcript
    setTranscript('');
    
    // Start listening after a short delay
    setTimeout(() => {
      if (recognitionRef.current && !recognitionRef.current.isListening && testInProgress) {
        recognitionRef.current.start();
      }
    }, 1000);
  };
  
  // Start listening for current phrase
  const listenForPhrase = () => {
    if (!recognitionRef.current || !testInProgress || !currentPhrase) return;
    
    // Clear transcript
    setTranscript('');
    
    // Start listening
    recognitionRef.current.start();
  };
  
  // Get test progress
  const getTestProgress = (): number => {
    const totalPhrases = currentAccentSample.phrases.length;
    const completedPhrases = Object.keys(testResults).length;
    
    return totalPhrases > 0 ? (completedPhrases / totalPhrases) * 100 : 0;
  };
  
  // Render test status
  const renderTestStatus = () => {
    const progress = getTestProgress();
    
    if (!testInProgress && progress === 0) {
      return (
        <Alert className="mb-4">
          <AlertTitle>Ready to Test</AlertTitle>
          <AlertDescription>
            Click the Start Test button to begin testing the {currentAccentSample.name} accent.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!testInProgress && progress === 100) {
      return (
        <Alert className={overallScore >= 70 ? 'bg-green-50 mb-4' : 'bg-yellow-50 mb-4'}>
          <AlertTitle className={overallScore >= 70 ? 'text-green-800' : 'text-yellow-800'}>
            Test Complete
          </AlertTitle>
          <AlertDescription>
            <div className="flex flex-col space-y-2">
              <p>
                Overall recognition score: <span className="font-bold">{overallScore.toFixed(1)}%</span>
              </p>
              <Progress value={overallScore} className="h-2" />
              <p className="text-sm">
                {overallScore >= 90 ? 'Excellent recognition for this accent!' :
                 overallScore >= 70 ? 'Good recognition for this accent.' :
                 overallScore >= 50 ? 'Moderate recognition for this accent. Some improvements needed.' :
                 'Poor recognition for this accent. Significant improvements needed.'}
              </p>
            </div>
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <Alert className="mb-4 bg-blue-50">
        <AlertTitle className="text-blue-800">Test in Progress</AlertTitle>
        <AlertDescription>
          <div className="flex flex-col space-y-2">
            <p>
              Progress: <span className="font-bold">{progress.toFixed(1)}%</span>
            </p>
            <Progress value={progress} className="h-2" />
            {currentPhrase && (
              <div className="mt-2">
                <p className="font-medium">Current phrase to speak:</p>
                <p className="text-lg font-bold mt-1 p-2 bg-blue-100 rounded">{currentPhrase}</p>
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Input Testing Framework</h1>
      
      <Tabs defaultValue="testing" className="mb-6">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="testing">Testing Interface</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <CardTitle>Accent Testing</CardTitle>
              <CardDescription>
                Test voice recognition with different UK accents and dialects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Accent</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={selectedAccent}
                    onChange={(e) => {
                      setSelectedAccent(e.target.value);
                      resetTest();
                    }}
                    disabled={testInProgress}
                  >
                    {ukAccentSamples.map(sample => (
                      <option key={sample.id} value={sample.id}>
                        {sample.name} ({sample.region})
                      </option>
                    ))}
                  </select>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <h3 className="font-medium mb-1">Accent Description:</h3>
                    <p className="text-sm">{currentAccentSample.description}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Test Phrases:</h3>
                    <ul className="space-y-1">
                      {currentAccentSample.phrases.map((phrase, index) => (
                        <li 
                          key={index} 
                          className={`p-2 rounded text-sm ${
                            testResults[phrase]?.attempted ? 
                              testResults[phrase]?.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                              : 'bg-gray-50'
                          }`}
                        >
                          {phrase}
                          {testResults[phrase]?.attempted && (
                            <span className="ml-2">
                              {testResults[phrase]?.success ? 
                                <CheckCircle className="inline h-4 w-4 text-green-600" /> : 
                                <AlertCircle className="inline h-4 w-4 text-red-600" />
                              }
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  {renderTestStatus()}
                  
                  {testInProgress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <Button
                          onClick={listenForPhrase}
                          disabled={isListening}
                          className="flex items-center space-x-2"
                        >
                          {isListening ? (
                            <>
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                              </span>
                              <span>Listening...</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              <span>Click to Speak Phrase</span>
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {transcript && (
                        <div className="mt-4">
                          <h3 className="font-medium mb-1">Recognized Speech:</h3>
                          <p className="p-2 bg-gray-50 rounded">{transcript}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {!testInProgress ? (
                      <Button onClick={startTest} className="flex-1">
                        <Play className="h-4 w-4 mr-1" />
                        Start Test
                      </Button>
                    ) : (
                      <Button onClick={stopTest} variant="destructive" className="flex-1">
                        <Pause className="h-4 w-4 mr-1" />
                        Stop Test
                      </Button>
                    )}
                    <Button onClick={resetTest} variant="outline">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Detailed results of accent recognition tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(testResults).length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h3 className="font-medium">Overall Score:</h3>
                      <div className="flex items-center mt-1">
                        <Progress value={overallScore} className="h-2 flex-1 mr-2" />
                        <span className="font-bold">{overallScore.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Accent:</h3>
                      <p>{currentAccentSample.name}</p>
                    </div>
                  </div>
                  
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 text-left">Phrase</th>
                        <th className="p-2 text-left">Recognized As</th>
                        <th className="p-2 text-left">Confidence</th>
                        <th className="p-2 text-left">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(testResults).map(([phrase, result], index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{phrase}</td>
                          <td className="p-2">{result.transcript}</td>
                          <td className="p-2">{(result.confidence * 100).toFixed(1)}%</td>
                          <td className="p-2">
                            {result.success ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Pass
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Fail
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  <p>No test results available yet. Run a test to see results.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>About the Testing Framework</CardTitle>
          <CardDescription>
            How the voice input testing framework works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              This testing framework allows you to validate the voice recognition system with different UK accents and dialects.
              It provides a structured way to test recognition accuracy and identify areas for improvement.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">Features:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Testing with 10 different UK accents and dialects</li>
                  <li>Predefined test phrases for each accent</li>
                  <li>Real-time recognition feedback</li>
                  <li>Detailed test results and analytics</li>
                  <li>Overall recognition score calculation</li>
                </ul>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">How It Works:</h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Select an accent to test</li>
                  <li>Start the test</li>
                  <li>Speak each test phrase when prompted</li>
                  <li>The system evaluates recognition accuracy</li>
                  <li>Review detailed results after completion</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
