'use client';

import React, { useState } from 'react';
import { useLearningStyle, LearningStyle, AgeGroup } from './learning-style-provider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface LearningStyleDetectorProps {
  onComplete?: () => void;
  className?: string;
}

export const LearningStyleDetector: React.FC<LearningStyleDetectorProps> = ({ 
  onComplete,
  className = ''
}) => {
  const { 
    setLearningStyle, 
    setAgeGroup, 
    setConfidence,
    learningStyle: currentStyle,
    ageGroup: currentAgeGroup
  } = useLearningStyle();
  
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [detectedStyle, setDetectedStyle] = useState<LearningStyle>('unknown');
  const [detectionConfidence, setDetectionConfidence] = useState<number>(0);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>(currentAgeGroup);
  
  // Questions for learning style detection
  const questions = [
    {
      id: 'q1',
      text: 'When learning something new, I prefer to:',
      options: [
        { value: 'visual', text: 'See diagrams, charts, or demonstrations' },
        { value: 'auditory', text: 'Listen to explanations and discuss ideas' },
        { value: 'reading', text: 'Read detailed instructions or explanations' },
        { value: 'kinesthetic', text: 'Try it out hands-on and learn by doing' }
      ]
    },
    {
      id: 'q2',
      text: 'When trying to remember information, I most easily recall:',
      options: [
        { value: 'visual', text: 'Images, diagrams, and how things looked' },
        { value: 'auditory', text: 'What was said and the discussions we had' },
        { value: 'reading', text: 'Notes I wrote or text I read' },
        { value: 'kinesthetic', text: 'Activities I did or how something felt' }
      ]
    },
    {
      id: 'q3',
      text: 'When explaining something to someone else, I tend to:',
      options: [
        { value: 'visual', text: 'Draw a picture or diagram to show them' },
        { value: 'auditory', text: 'Explain verbally with detailed descriptions' },
        { value: 'reading', text: 'Write it down or refer to written materials' },
        { value: 'kinesthetic', text: 'Demonstrate and let them try it themselves' }
      ]
    },
    {
      id: 'q4',
      text: 'In my free time, I most enjoy:',
      options: [
        { value: 'visual', text: 'Watching videos or looking at images' },
        { value: 'auditory', text: 'Listening to music, podcasts, or conversations' },
        { value: 'reading', text: 'Reading books, articles, or browsing text online' },
        { value: 'kinesthetic', text: 'Physical activities, crafts, or building things' }
      ]
    },
    {
      id: 'q5',
      text: 'When I\'m trying to concentrate:',
      options: [
        { value: 'visual', text: 'I need a tidy, visually organized environment' },
        { value: 'auditory', text: 'I prefer quiet or specific background sounds' },
        { value: 'reading', text: 'I focus best when I can take notes or highlight text' },
        { value: 'kinesthetic', text: 'I fidget, move around, or hold something in my hands' }
      ]
    }
  ];
  
  const handleAnswer = (questionId: string, styleValue: string) => {
    const newAnswers = { ...answers, [questionId]: styleValue };
    setAnswers(newAnswers);
    
    // If all questions are answered, move to next step
    if (Object.keys(newAnswers).length === questions.length) {
      analyzeResults(newAnswers);
      setStep(2);
    }
  };
  
  const analyzeResults = (results: Record<string, any>) => {
    // Count occurrences of each learning style
    const counts: Record<string, number> = {
      visual: 0,
      auditory: 0,
      reading: 0,
      kinesthetic: 0
    };
    
    Object.values(results).forEach(value => {
      if (typeof counts[value] !== 'undefined') {
        counts[value]++;
      }
    });
    
    // Find the dominant style(s)
    let maxCount = 0;
    let dominantStyles: string[] = [];
    
    Object.entries(counts).forEach(([style, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantStyles = [style];
      } else if (count === maxCount) {
        dominantStyles.push(style);
      }
    });
    
    // Calculate confidence (as percentage of questions that align with dominant style)
    const confidence = Math.round((maxCount / questions.length) * 100);
    setDetectionConfidence(confidence);
    
    // Set detected style (if multiple dominant styles, set as multimodal)
    if (dominantStyles.length > 1) {
      setDetectedStyle('multimodal');
    } else {
      setDetectedStyle(dominantStyles[0] as LearningStyle);
    }
  };
  
  const handleConfirm = () => {
    // Save the detected learning style and age group
    setLearningStyle(detectedStyle);
    setAgeGroup(selectedAgeGroup);
    setConfidence(detectionConfidence);
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete();
    }
  };
  
  const getStyleDescription = (style: LearningStyle): string => {
    switch (style) {
      case 'visual':
        return 'You learn best through seeing and visualizing information. Images, diagrams, and visual demonstrations help you understand and remember concepts.';
      case 'auditory':
        return 'You learn best through listening and discussing. Verbal explanations, discussions, and audio content are most effective for your learning.';
      case 'reading':
        return 'You learn best through reading and writing. Text-based materials and note-taking help you process and retain information.';
      case 'kinesthetic':
        return 'You learn best through hands-on experiences. Physical activities, practice, and interactive learning help you understand concepts.';
      case 'multimodal':
        return 'You have a balanced learning approach that uses multiple styles. You can adapt to different teaching methods and benefit from varied content formats.';
      default:
        return 'Your learning style has not been determined yet.';
    }
  };
  
  const renderAgeGroupSelector = () => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Select your age group:</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button 
            variant={selectedAgeGroup === 'nursery' ? 'default' : 'outline'}
            onClick={() => setSelectedAgeGroup('nursery')}
            className="flex flex-col items-center justify-center h-24"
          >
            <span className="text-2xl mb-1">🧸</span>
            <span>Nursery</span>
            <span className="text-xs">(Ages 3-5)</span>
          </Button>
          <Button 
            variant={selectedAgeGroup === 'primary' ? 'default' : 'outline'}
            onClick={() => setSelectedAgeGroup('primary')}
            className="flex flex-col items-center justify-center h-24"
          >
            <span className="text-2xl mb-1">📚</span>
            <span>Primary</span>
            <span className="text-xs">(Ages 5-11)</span>
          </Button>
          <Button 
            variant={selectedAgeGroup === 'secondary' ? 'default' : 'outline'}
            onClick={() => setSelectedAgeGroup('secondary')}
            className="flex flex-col items-center justify-center h-24"
          >
            <span className="text-2xl mb-1">🎒</span>
            <span>Secondary</span>
            <span className="text-xs">(Ages 11-18)</span>
          </Button>
          <Button 
            variant={selectedAgeGroup === 'adult' ? 'default' : 'outline'}
            onClick={() => setSelectedAgeGroup('adult')}
            className="flex flex-col items-center justify-center h-24"
          >
            <span className="text-2xl mb-1">👨‍🎓</span>
            <span>Adult</span>
            <span className="text-xs">(18+)</span>
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Card className={`w-full max-w-3xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>Learning Style Assessment</CardTitle>
        <CardDescription>
          Discover how you learn best to personalize your educational experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div>
            <div className="mb-4">
              <p className="mb-2">Answer the following questions to help us determine your learning style:</p>
              <Progress value={(Object.keys(answers).length / questions.length) * 100} className="h-2" />
              <p className="text-sm text-right mt-1">
                {Object.keys(answers).length}/{questions.length} questions answered
              </p>
            </div>
            
            {questions.map((question, index) => (
              <div key={question.id} className="mb-6">
                <h3 className="font-medium mb-2">
                  {index + 1}. {question.text}
                </h3>
                <div className="grid gap-2">
                  {question.options.map((option) => (
                    <Button
                      key={option.value}
                      variant={answers[question.id] === option.value ? 'default' : 'outline'}
                      className="justify-start h-auto py-3 px-4 text-left"
                      onClick={() => handleAnswer(question.id, option.value)}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
                {detectedStyle === 'visual' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
                {detectedStyle === 'auditory' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0a9 9 0 010 12.728M3 9.879c-.412.659-.681 1.381-.824 2.121M21 9.879c.412.659.681 1.381.824 2.121M12 18.17a6 6 0 100-12 6 6 0 000 12z" />
                  </svg>
                )}
                {detectedStyle === 'reading' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
                {detectedStyle === 'kinesthetic' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                )}
                {detectedStyle === 'multimodal' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-2 capitalize">
                {detectedStyle === 'multimodal' ? 'Multimodal Learner' : `${detectedStyle} Learner`}
              </h3>
              <div className="flex items-center justify-center mb-2">
                <span className="text-sm font-medium mr-2">Confidence:</span>
                <Progress value={detectionConfidence} className="h-2 w-32" />
                <span className="text-sm ml-2">{detectionConfidence}%</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {getStyleDescription(detectedStyle)}
              </p>
            </div>
            
            {renderAgeGroupSelector()}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === 1 ? (
          <div className="w-full flex justify-end">
            <Button 
              disabled={Object.keys(answers).length < questions.length}
              onClick={() => {
                analyzeResults(answers);
                setStep(2);
              }}
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back to Questions
            </Button>
            <Button onClick={handleConfirm}>
              Confirm & Save
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default LearningStyleDetector;
