/**
 * Visual Spatial Exercise Component
 * 
 * This component implements visual-spatial working memory exercises like
 * pattern memory and spatial location tasks.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Progress, Alert } from '@/components/ui';
import { useTranslation } from '@/components/i18n';
import { WorkingMemoryExerciseConfig } from '@/lib/executive-function/working-memory-support';

interface VisualSpatialExerciseProps {
  sessionId: string;
  config: WorkingMemoryExerciseConfig;
  onComplete: (result: any) => void;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
}

export default function VisualSpatialExercise({
  sessionId,
  config,
  onComplete,
  highContrast,
  largeText,
  reduceMotion
}: VisualSpatialExerciseProps) {
  const { t } = useTranslation('working-memory');
  
  // Exercise state
  const [pattern, setPattern] = useState<boolean[]>([]);
  const [userPattern, setUserPattern] = useState<boolean[]>([]);
  const [stage, setStage] = useState<'instruction' | 'presentation' | 'recall' | 'feedback'>('instruction');
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [totalTrials, setTotalTrials] = useState<number>(0);
  const [correctTrials, setCorrectTrials] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(config.duration);
  const [gridSize, setGridSize] = useState<number>(3); // 3x3 grid to start
  const [showingPattern, setShowingPattern] = useState<boolean>(false);
  const [attentionLapses, setAttentionLapses] = useState<number>(0);
  const [responseTime, setResponseTime] = useState<number[]>([]);
  
  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const presentationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // Constants
  const initialPatternCount = 3;
  const maxPatternCount = 9;
  const presentationDuration = reduceMotion ? 3000 : 2000; // ms to show pattern
  const isPatternMemory = config.type === 'pattern_memory';
  
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
    
    // Generate initial pattern
    generatePattern(initialPatternCount);
    
    return () => {
      // Clean up timers
      if (timerRef.current) clearInterval(timerRef.current);
      if (presentationTimerRef.current) clearTimeout(presentationTimerRef.current);
    };
  }, []);
  
  // Generate a new pattern with specified number of highlighted cells
  const generatePattern = (count: number) => {
    const totalCells = gridSize * gridSize;
    const newPattern = Array(totalCells).fill(false);
    
    // Randomly select cells to highlight
    let highlightedCount = 0;
    while (highlightedCount < count) {
      const index = Math.floor(Math.random() * totalCells);
      if (!newPattern[index]) {
        newPattern[index] = true;
        highlightedCount++;
      }
    }
    
    setPattern(newPattern);
    setUserPattern(Array(totalCells).fill(false));
  };
  
  // Start pattern presentation
  const startPresentation = () => {
    setStage('presentation');
    setShowingPattern(true);
    
    // Hide pattern after presentation time
    presentationTimerRef.current = setTimeout(() => {
      setShowingPattern(false);
      setStage('recall');
      startTimeRef.current = Date.now();
    }, presentationDuration);
  };
  
  // Handle cell click during recall
  const handleCellClick = (index: number) => {
    if (stage === 'recall') {
      const newUserPattern = [...userPattern];
      newUserPattern[index] = !newUserPattern[index];
      setUserPattern(newUserPattern);
    }
  };
  
  // Submit user's pattern
  const handleSubmit = () => {
    if (stage === 'recall') {
      // Calculate response time
      const endTime = Date.now();
      const responseTimeMs = endTime - startTimeRef.current;
      setResponseTime(prev => [...prev, responseTimeMs]);
      
      // Check if pattern is correct
      let isCorrect = true;
      for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] !== userPattern[i]) {
          isCorrect = false;
          break;
        }
      }
      
      // Update score and trials
      setTotalTrials(prev => prev + 1);
      
      if (isCorrect) {
        setCorrectTrials(prev => prev + 1);
        // Score based on pattern complexity
        const patternCount = pattern.filter(cell => cell).length;
        setScore(prev => prev + (patternCount * 10));
        
        // Increase difficulty if adaptive
        if (config.adaptiveDifficulty) {
          const patternCount = pattern.filter(cell => cell).length;
          if (patternCount < maxPatternCount) {
            setLevel(prev => prev + 1);
            generatePattern(patternCount + 1);
          } else if (gridSize < 5) {
            // Increase grid size if at max pattern count
            setGridSize(prev => prev + 1);
            generatePattern(initialPatternCount);
          } else {
            generatePattern(patternCount);
          }
        } else {
          const patternCount = pattern.filter(cell => cell).length;
          generatePattern(patternCount);
        }
      } else {
        // Decrease difficulty if adaptive and not at minimum
        if (config.adaptiveDifficulty) {
          const patternCount = pattern.filter(cell => cell).length;
          if (patternCount > initialPatternCount) {
            setLevel(prev => prev - 1);
            generatePattern(patternCount - 1);
          } else if (gridSize > 3) {
            // Decrease grid size if at min pattern count
            setGridSize(prev => prev - 1);
            generatePattern(initialPatternCount);
          } else {
            generatePattern(patternCount);
          }
        } else {
          const patternCount = pattern.filter(cell => cell).length;
          generatePattern(patternCount);
        }
      }
      
      // Show feedback
      setStage('feedback');
      
      // Move to next trial after feedback
      setTimeout(() => {
        setStage('instruction');
      }, 2000);
    }
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
  
  // Render grid
  const renderGrid = () => {
    const cellSize = 320 / gridSize; // Adjust based on grid size
    
    return (
      <div 
        className="grid gap-1 mx-auto" 
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: '320px',
          height: '320px'
        }}
      >
        {pattern.map((cell, index) => (
          <div
            key={index}
            className={`
              border-2 rounded cursor-pointer transition-colors
              ${highContrast 
                ? 'border-black' 
                : 'border-gray-300'
              }
              ${(stage === 'presentation' && showingPattern && cell) || (stage === 'recall' && userPattern[index])
                ? highContrast 
                  ? 'bg-yellow-400' 
                  : 'bg-blue-500'
                : 'bg-white'
              }
              ${stage === 'feedback' 
                ? (pattern[index] && userPattern[index]) 
                  ? 'bg-green-500' // Correct match
                  : (pattern[index] && !userPattern[index])
                    ? 'bg-red-500' // Missed
                    : (!pattern[index] && userPattern[index])
                      ? 'bg-orange-500' // False positive
                      : 'bg-white'
                : ''
              }
            `}
            style={{ 
              width: `${cellSize}px`, 
              height: `${cellSize}px` 
            }}
            onClick={() => handleCellClick(index)}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className={`visual-spatial-exercise ${largeText ? 'text-lg' : ''}`}>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {isPatternMemory ? t('exercises.patternMemory') : t('exercises.spatialLocation')}
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
        
        <div className="exercise-content min-h-[350px] flex flex-col items-center justify-center">
          {stage === 'instruction' && (
            <div className="text-center">
              <p className="mb-4">
                {isPatternMemory 
                  ? t('instructions.patternMemory') 
                  : t('instructions.spatialLocation')}
              </p>
              <Button 
                onClick={startPresentation}
                variant="primary"
              >
                {t('startPattern')}
              </Button>
            </div>
          )}
          
          {(stage === 'presentation' || stage === 'recall' || stage === 'feedback') && (
            <div className="text-center w-full">
              {stage === 'presentation' && (
                <p className="mb-4">{t('memorizePattern')}</p>
              )}
              
              {stage === 'recall' && (
                <p className="mb-4">{t('reproducePattern')}</p>
              )}
              
              {renderGrid()}
              
              {stage === 'recall' && (
                <Button 
                  onClick={handleSubmit}
                  variant="primary"
                  className="mt-6"
                >
                  {t('submit')}
                </Button>
              )}
              
              {stage === 'feedback' && (
                <div className="mt-4">
                  {userPattern.every((cell, i) => cell === pattern[i]) ? (
                    <Alert variant="success">{t('correct')}</Alert>
                  ) : (
                    <Alert variant="error">{t('incorrect')}</Alert>
                  )}
                </div>
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
