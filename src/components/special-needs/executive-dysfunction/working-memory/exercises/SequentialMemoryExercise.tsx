/**
 * Sequential Memory Exercise Component
 * 
 * This component implements sequential memory exercises like digit span and
 * reverse digit span to improve working memory capacity.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Progress, Alert } from '@/components/ui';
import { useTranslation } from '@/components/i18n';
import { WorkingMemoryExerciseConfig } from '@/lib/executive-function/working-memory-support';

interface SequentialMemoryExerciseProps {
  sessionId: string;
  config: WorkingMemoryExerciseConfig;
  onComplete: (result: any) => void;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
}

export default function SequentialMemoryExercise({
  sessionId,
  config,
  onComplete,
  highContrast,
  largeText,
  reduceMotion
}: SequentialMemoryExerciseProps) {
  const { t } = useTranslation('working-memory');
  
  // Exercise state
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [stage, setStage] = useState<'instruction' | 'presentation' | 'recall' | 'feedback'>('instruction');
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [totalTrials, setTotalTrials] = useState<number>(0);
  const [correctTrials, setCorrectTrials] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(config.duration);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isReverse, setIsReverse] = useState<boolean>(config.type === 'reverse_digit_span');
  const [attentionLapses, setAttentionLapses] = useState<number>(0);
  const [responseTime, setResponseTime] = useState<number[]>([]);
  const [showingItem, setShowingItem] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<number | null>(null);
  
  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const presentationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // Constants
  const initialSequenceLength = 3;
  const maxSequenceLength = 9;
  const presentationSpeed = reduceMotion ? 1500 : 1000; // ms per item
  const interItemDelay = reduceMotion ? 500 : 300; // ms between items
  
  // Initialize exercise
  useEffect(() => {
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up, complete exercise
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Generate initial sequence
    generateSequence(initialSequenceLength);
    
    return () => {
      // Clean up timers
      if (timerRef.current) clearInterval(timerRef.current);
      if (presentationTimerRef.current) clearTimeout(presentationTimerRef.current);
    };
  }, []);
  
  // Generate a new sequence of specified length
  const generateSequence = (length: number) => {
    const newSequence: number[] = [];
    
    for (let i = 0; i < length; i++) {
      // Generate random digit 0-9
      newSequence.push(Math.floor(Math.random() * 10));
    }
    
    setSequence(newSequence);
    setUserInput([]);
    setCurrentIndex(0);
  };
  
  // Start sequence presentation
  const startPresentation = () => {
    setStage('presentation');
    setCurrentIndex(0);
    presentNextItem();
  };
  
  // Present next item in sequence
  const presentNextItem = () => {
    if (currentIndex < sequence.length) {
      setCurrentItem(sequence[currentIndex]);
      setShowingItem(true);
      
      // Hide item after presentation time
      presentationTimerRef.current = setTimeout(() => {
        setShowingItem(false);
        
        // Show next item after delay
        presentationTimerRef.current = setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          
          if (currentIndex + 1 < sequence.length) {
            presentNextItem();
          } else {
            // All items presented, move to recall stage
            setStage('recall');
            setUserInput([]);
            startTimeRef.current = Date.now();
          }
        }, interItemDelay);
      }, presentationSpeed);
    }
  };
  
  // Handle digit button click
  const handleDigitClick = (digit: number) => {
    if (stage === 'recall') {
      const newInput = [...userInput, digit];
      setUserInput(newInput);
      
      // Check if user has input all digits
      if (newInput.length === sequence.length) {
        checkAnswer(newInput);
      }
    }
  };
  
  // Handle backspace
  const handleBackspace = () => {
    if (stage === 'recall' && userInput.length > 0) {
      setUserInput(prev => prev.slice(0, -1));
    }
  };
  
  // Check user's answer
  const checkAnswer = (input: number[]) => {
    // Calculate response time
    const endTime = Date.now();
    const responseTimeMs = endTime - startTimeRef.current;
    setResponseTime(prev => [...prev, responseTimeMs]);
    
    // Check if answer is correct
    let isCorrect = true;
    
    if (isReverse) {
      // For reverse digit span, compare with reversed sequence
      const reversedSequence = [...sequence].reverse();
      for (let i = 0; i < input.length; i++) {
        if (input[i] !== reversedSequence[i]) {
          isCorrect = false;
          break;
        }
      }
    } else {
      // For regular digit span, compare with original sequence
      for (let i = 0; i < input.length; i++) {
        if (input[i] !== sequence[i]) {
          isCorrect = false;
          break;
        }
      }
    }
    
    // Update score and trials
    setTotalTrials(prev => prev + 1);
    
    if (isCorrect) {
      setCorrectTrials(prev => prev + 1);
      setScore(prev => prev + (sequence.length * 10));
      
      // Increase difficulty if adaptive
      if (config.adaptiveDifficulty && sequence.length < maxSequenceLength) {
        setLevel(prev => prev + 1);
        generateSequence(sequence.length + 1);
      } else {
        generateSequence(sequence.length);
      }
    } else {
      // Decrease difficulty if adaptive and not at minimum
      if (config.adaptiveDifficulty && sequence.length > initialSequenceLength) {
        setLevel(prev => prev - 1);
        generateSequence(sequence.length - 1);
      } else {
        generateSequence(sequence.length);
      }
    }
    
    // Show feedback
    setStage('feedback');
    
    // Move to next trial after feedback
    setTimeout(() => {
      setStage('instruction');
    }, 2000);
  };
  
  // Complete exercise
  const handleComplete = () => {
    // Clean up timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (presentationTimerRef.current) clearTimeout(presentationTimerRef.current);
    
    // Calculate final score (0-100)
    const finalScore = Math.min(100, Math.round((score / (totalTrials * 50)) * 100));
    
    // Calculate accuracy
    const accuracy = totalTrials > 0 ? correctTrials / totalTrials : 0;
    
    // Calculate average response time
    const avgResponseTime = responseTime.length > 0 
      ? responseTime.reduce((a, b) => a + b, 0) / responseTime.length 
      : 0;
    
    // Prepare result
    const result = {
      score: finalScore,
      accuracy,
      responseTime: avgResponseTime,
      completionRate: 1, // Completed all trials
      attentionLapses,
      progressionLevel: level
    };
    
    // Call onComplete callback
    onComplete(result);
  };
  
  // Render digit buttons
  const renderDigitButtons = () => {
    return (
      <div className="grid grid-cols-5 gap-2 mt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(digit => (
          <Button
            key={digit}
            onClick={() => handleDigitClick(digit)}
            variant="outline"
            className={`text-xl font-bold h-12 w-12 ${
              highContrast ? 'bg-yellow-100 text-black border-black' : ''
            }`}
            disabled={stage !== 'recall'}
          >
            {digit}
          </Button>
        ))}
        <Button
          onClick={handleBackspace}
          variant="outline"
          className="col-span-2 h-12"
          disabled={stage !== 'recall' || userInput.length === 0}
        >
          {t('backspace')}
        </Button>
      </div>
    );
  };
  
  return (
    <div className={`sequential-memory-exercise ${largeText ? 'text-lg' : ''}`}>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {isReverse ? t('exercises.reverseDigitSpan') : t('exercises.digitSpan')}
          </h3>
          <div className="text-sm">
            {t('level')}: {level}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>{t('timeRemaining')}</span>
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
          <Progress 
            value={(timeLeft / config.duration) * 100} 
            max={100} 
            className="h-2 rounded-full"
          />
        </div>
        
        <div className="exercise-content min-h-[200px] flex flex-col items-center justify-center">
          {stage === 'instruction' && (
            <div className="text-center">
              <p className="mb-4">
                {isReverse 
                  ? t('instructions.reverseDigitSpan') 
                  : t('instructions.digitSpan')}
              </p>
              <Button 
                onClick={startPresentation}
                variant="primary"
              >
                {t('startSequence')}
              </Button>
            </div>
          )}
          
          {stage === 'presentation' && (
            <div className="text-center">
              {showingItem && (
                <div className={`text-6xl font-bold mb-4 ${
                  highContrast ? 'text-black' : ''
                }`}>
                  {currentItem}
                </div>
              )}
              <p>{t('watchCarefully')}</p>
            </div>
          )}
          
          {stage === 'recall' && (
            <div className="text-center w-full">
              <p className="mb-4">
                {isReverse 
                  ? t('enterReverseOrder') 
                  : t('enterSameOrder')}
              </p>
              
              <div className="flex justify-center mb-6">
                <div className="flex gap-2">
                  {Array(sequence.length).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-10 h-10 flex items-center justify-center border-2 rounded ${
                        i < userInput.length 
                          ? 'border-primary bg-primary-50' 
                          : 'border-gray-300'
                      } ${highContrast ? 'border-black' : ''}`}
                    >
                      {i < userInput.length ? userInput[i] : ''}
                    </div>
                  ))}
                </div>
              </div>
              
              {renderDigitButtons()}
            </div>
          )}
          
          {stage === 'feedback' && (
            <div className="text-center">
              {userInput.length === sequence.length && (
                isReverse ? (
                  userInput.join('') === [...sequence].reverse().join('') ? (
                    <Alert variant="success">{t('correct')}</Alert>
                  ) : (
                    <Alert variant="error">
                      {t('incorrect')}
                      <div className="mt-2">
                        {t('correctAnswer')}: {[...sequence].reverse().join(' ')}
                      </div>
                    </Alert>
                  )
                ) : (
                  userInput.join('') === sequence.join('') ? (
                    <Alert variant="success">{t('correct')}</Alert>
                  ) : (
                    <Alert variant="error">
                      {t('incorrect')}
                      <div className="mt-2">
                        {t('correctAnswer')}: {sequence.join(' ')}
                      </div>
                    </Alert>
                  )
                )
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span>{t('score')}</span>
            <span>{score}</span>
          </div>
          <Progress 
            value={score} 
            max={500} 
            className="h-2 rounded-full"
          />
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            onClick={handleComplete}
            variant="secondary"
          >
            {t('endExercise')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
