'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  Brain, 
  CheckCircle, 
  Lightbulb, 
  BarChart, 
  LineChart,
  Sparkles,
  Zap,
  Users,
  ArrowRight,
  Clock,
  Star,
  Award,
  FileText,
  PenTool,
  RotateCw,
  Layers,
  MessageSquare,
  BarChart2,
  PieChart
} from 'lucide-react';

// AI-Powered Assessment prototype
// This component demonstrates the concept of intelligent, adaptive assessment systems

interface AssessmentQuestion {
  id: string;

  type: 'multiple-choice' | 'short-answer' | 'essay' | 'interactive';
  difficulty: number;

  question: string;
  options?: string[];
  correctAnswer?: string | string[];
 rubric?: {
    criteria: string;

    levels: {
      score: number;

      description: string;
    }[];
  }[];
  conceptTags: string[];

  adaptiveFollowUp?: {
    correct: string[];
    incorrect: string[];
  };
}

interface AssessmentResult {
  questionId: string;

  correct: boolean;
  score: number;

  response: string;
  feedback: string;

  conceptsAssessed: {
    concept: string;

    mastery: number;
  }[];
  timeSpent: number;
}

interface ConceptMastery {
  concept: string;

  mastery: number;
  confidence: number;

  lastAssessed: string;
  trend: 'improving' | 'stable' | 'declining';
}

export default function AIPoweredAssessmentPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('assessment');
  
  // State for current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // State for selected answer (multiple choice)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // State for text answers (short answer/essay)
  const [textAnswer, setTextAnswer] = useState('');
  
  // State for assessment in progress
  const [assessmentInProgress, setAssessmentInProgress] = useState(false);
  
  // State for assessment completed
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  
  // State for loading/processing
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for AI feedback level
  const [feedbackLevel, setFeedbackLevel] = useState(80);
  
  // State for assessment results
  const [results, setResults] = useState<AssessmentResult[]>([]);
  
  // State for concept mastery
  const [conceptMastery, setConceptMastery] = useState<ConceptMastery[]>([
    {
      concept: "Algebraic Expressions",
      mastery: 85,
      confidence: 90,
      lastAssessed: "2025-05-15",
      trend: "improving"
    },
    {
      concept: "Linear Equations",
      mastery: 72,
      confidence: 85,
      lastAssessed: "2025-05-10",
      trend: "improving"
    },
    {
      concept: "Quadratic Equations",
      mastery: 65,
      confidence: 70,
      lastAssessed: "2025-05-05",
      trend: "stable"
    },
    {
      concept: "Geometric Principles",
      mastery: 78,
      confidence: 75,
      lastAssessed: "2025-05-12",
      trend: "stable"
    },
    {
      concept: "Statistical Analysis",
      mastery: 58,
      confidence: 60,
      lastAssessed: "2025-05-08",
      trend: "improving"
    },
    {
      concept: "Probability Concepts",
      mastery: 45,
      confidence: 50,
      lastAssessed: "2025-05-03",
      trend: "declining"
    }
  ]);
  
  // Sample assessment questions
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([
    {
      id: "q1",
      type: "multiple-choice",
      difficulty: 2,
      question: "Solve for x in the equation: 3x + 7 = 22",
      options: ["x = 5", "x = 7", "x = 15", "x = 3"],
      correctAnswer: "x = 5",
      conceptTags: ["Linear Equations", "Algebraic Expressions"],
      adaptiveFollowUp: {
        correct: ["q3", "q5"],
        incorrect: ["q2", "q4"]
      }
    },
    {
      id: "q2",
      type: "multiple-choice",
      difficulty: 1,
      question: "Which of the following is an example of a linear equation?",
      options: ["y = x² + 3", "y = 2x + 5", "y = 3/x", "y = √x"],
      correctAnswer: "y = 2x + 5",
      conceptTags: ["Linear Equations", "Algebraic Expressions"],
      adaptiveFollowUp: {
        correct: ["q1"],
        incorrect: ["q4"]
      }
    },
    {
      id: "q3",
      type: "short-answer",
      difficulty: 3,
      question: "Factor the expression: x² - 9",
      correctAnswer: ["(x+3)(x-3)", "(x-3)(x+3)"],
      conceptTags: ["Algebraic Expressions", "Quadratic Equations"],
      adaptiveFollowUp: {
        correct: ["q5"],
        incorrect: ["q2"]
      }
    },
    {
      id: "q4",
      type: "multiple-choice",
      difficulty: 2,
      question: "If a rectangle has a length of (x+3) units and a width of (x-1) units, which expression represents its area?",
      options: ["x² + 2x - 3", "x² + 2x + 3", "x² + 4x - 3", "2x² + 2"],
      correctAnswer: "x² + 2x - 3",
      conceptTags: ["Algebraic Expressions", "Geometric Principles"],
      adaptiveFollowUp: {
        correct: ["q5"],
        incorrect: ["q2"]
      }
    },
    {
      id: "q5",
      type: "essay",
      difficulty: 4,
      question: "Explain how you would solve a system of two linear equations using the substitution method. Provide an example to illustrate your explanation.",
      rubric: [
        {
          criteria: "Explanation of Method",
          levels: [
            { score: 1, description: "Minimal or incorrect explanation" },
            { score: 2, description: "Basic explanation with some gaps" },
            { score: 3, description: "Clear and accurate explanation" },
            { score: 4, description: "Comprehensive explanation with insights" }
          ]
        },
        {
          criteria: "Example Quality",
          levels: [
            { score: 1, description: "No example or incorrect example" },
            { score: 2, description: "Basic example with minor errors" },
            { score: 3, description: "Correct example with clear steps" },
            { score: 4, description: "Excellent example with thorough work" }
          ]
        }
      ],
      conceptTags: ["Linear Equations", "Algebraic Expressions"],
      adaptiveFollowUp: {
        correct: [],
        incorrect: ["q3"]
      }
    }
  ]);
  
  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Handle starting assessment
  const handleStartAssessment = () => {
    setAssessmentInProgress(true);
    setAssessmentCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTextAnswer('');
    setResults([]);
  };
  
  // Handle submitting answer
  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      let isCorrect = false;
      let score = 0;
      let feedback = '';
      
      // Check if answer is correct based on question type
      if (currentQuestion.type === 'multiple-choice' && selectedAnswer) {
        isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        score = isCorrect ? 100 : 0;
        
        if (isCorrect) {
          feedback = "Correct! You've demonstrated a good understanding of this concept.";
        } else {
          feedback = `Incorrect. The correct answer is ${currentQuestion.correctAnswer}. Remember that when solving linear equations, you need to isolate the variable.`;
        }
      } else if ((currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay') && textAnswer) {
        // Simulate AI evaluation for text answers
        if (currentQuestion.type === 'short-answer') {
          const possibleAnswers = currentQuestion.correctAnswer as string[];
          isCorrect = possibleAnswers.some(answer => 
            textAnswer.toLowerCase().includes(answer.toLowerCase())
          );
          score = isCorrect ? 100 : 30; // Partial credit possible
          
          if (isCorrect) {
            feedback = "Correct! Your factorization is accurate.";
          } else {
            feedback = "Your answer needs revision. Remember that x² - 9 is a difference of squares, which can be factored as (x+3)(x-3).";
          }
        } else {
          // Essay scoring simulation
          const lengthScore = Math.min(100, textAnswer.length / 5);
          const keywordScore = textAnswer.toLowerCase().includes('substitution') && 
                              textAnswer.toLowerCase().includes('equation') ? 100 : 50;
          score = Math.round((lengthScore + keywordScore) / 2);
          isCorrect = score >= 70;
          
          if (score > 85) {
            feedback = "Excellent explanation! You've clearly articulated the substitution method and provided a helpful example that demonstrates the process step-by-step.";
          } else if (score > 70) {
            feedback = "Good explanation. Your understanding of the substitution method is evident, though your example could be more detailed.";
          } else {
            feedback = "Your explanation needs development. Consider explaining how one equation is rearranged to isolate a variable, which is then substituted into the other equation.";
          }
        }
      }
      
      // Create result object
      const result: AssessmentResult = {
        questionId: currentQuestion.id,
        correct: isCorrect,
        score,
        response: currentQuestion.type === 'multiple-choice' ? selectedAnswer || '' : textAnswer,
        feedback,
        conceptsAssessed: currentQuestion.conceptTags.map(concept => {
          const masteryChange = isCorrect ? Math.random() * 10 : -Math.random() * 5;
          return {
            concept,
            mastery: Math.min(100, Math.max(0, masteryChange))
          }
        }),
        timeSpent: Math.floor(Math.random() * 120) + 30 // Random time between 30-150 seconds
      }
      
      // Update results
      setResults(prev => [...prev, result]);
      
      // Update concept mastery based on results
      setConceptMastery(prev => 
        prev.map(concept => {
          const assessed = currentQuestion.conceptTags.includes(concept.concept);
          if (!assessed) return concept;
          
          const masteryChange = isCorrect ? Math.random() * 5 : -Math.random() * 3;
          const newMastery = Math.min(100, Math.max(0, concept.mastery + masteryChange));
          
          return {
            ...concept,
            mastery: newMastery,
            lastAssessed: new Date().toISOString().split('T')[0],
            trend: newMastery > concept.mastery ? 'improving' : (newMastery < concept.mastery ? 'declining' : 'stable')
          }
        })
      );
      
      // Move to next question or complete assessment
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setTextAnswer('');
      } else {
        setAssessmentInProgress(false);
        setAssessmentCompleted(true);
      }
      
      setIsProcessing(false);
    }, 2000);
  };
  
  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'improving':
        return <ArrowRight className="h-4 w-4 text-green-500 transform rotate-45" />;
      case 'declining':
        return <ArrowRight className="h-4 w-4 text-red-500 transform -rotate-45" />;
      default:
        return <ArrowRight className="h-4 w-4 text-amber-500" />;
    }
  };
  
  // Get mastery colour
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return "text-green-500";
    if (mastery >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className = "container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-centre mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">AI-Powered Assessment</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience intelligent assessment that adapts to your responses, provides personalized feedback, and builds a comprehensive understanding of your knowledge and skills.
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
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {activeTab === 'assessment' ? (
                <div className="space-y-6">
                  {!assessmentInProgress && !assessmentCompleted ? (
                    <div className="space-y-4">
                      <div className="text-centre mb-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-centre justify-centre mx-auto mb-3">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">Mathematics Assessment</h2>
                        <p className="text-muted-foreground">Adaptive assessment of algebraic concepts</p>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Assessment Details</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Estimated Time:</span>
                            <span>15-20 minutes</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Questions:</span>
                            <span>5-10 (adaptive)</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Format:</span>
                            <span>Mixed question types</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Difficulty:</span>
                            <span>Adaptive</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2 flex items-centre">
                          <Brain className="mr-2 h-4 w-4 text-primary" />
                          Concepts Assessed
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">Linear Equations</Badge>
                          <Badge variant="secondary">Algebraic Expressions</Badge>
                          <Badge variant="secondary">Quadratic Equations</Badge>
                          <Badge variant="secondary">Geometric Principles</Badge>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={handleStartAssessment}
                      >
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Start Assessment
                      </Button>
                    </div>
                  ) : assessmentInProgress ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-centre">
                        <h3 className="font-medium">Question {currentQuestionIndex + 1}/{questions.length}</h3>
                        <Badge variant="outline">
                          {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' : 
                           currentQuestion.type === 'short-answer' ? 'Short Answer' : 
                           'Essay'}
                        </Badge>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-centre gap-2 mb-2">
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-centre justify-centre">
                              <span className="text-xs font-medium text-primary">{currentQuestion.difficulty}</span>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${currentQuestion.difficulty * 20}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Difficulty
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {currentQuestion.conceptTags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {results.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="font-medium">Previous Results</h3>
                          <div className="space-y-2">
                            {results.map((result, index) => (
                              <div key={index} className="flex items-centre gap-2">
                                <div className={`w-2 h-2 rounded-full ${result.correct ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-sm">Question {index + 1}: {result.score}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {;
                            setAssessmentInProgress(false);
                            setAssessmentCompleted(false);
                          }}
                        >
                          Exit Assessment
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className = "space-y-4">
                      <div className="text-centre mb-6">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-centre justify-centre mx-auto mb-3">
                          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-semibold">Assessment Complete</h2>
                        <p className="text-muted-foreground">Your results have been analysed</p>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Assessment Summary</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Questions Answered:</span>
                            <span>{results.length}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Correct Answers:</span>
                            <span>{results.filter(r => r.correct).length}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Average Score:</span>
                            <span>
                              {Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)}%
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Total Time:</span>
                            <span>
                              {Math.round(results.reduce((acc, r) => acc + r.timeSpent, 0) / 60)} minutes
                            </span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-medium">Concept Mastery Updates</h3>
                        <div className="space-y-2">
                          {conceptMastery
                            .filter(concept => 
                              results.some(r => 
                                r.conceptsAssessed.some(c => c.concept === concept.concept)
                              )
                            )
                            .map((concept, index) => (
                              <div key={index} className="flex items-centre justify-between">
                                <div className="flex items-centre gap-2">
                                  {getTrendIcon(concept.trend)}
                                  <span className="text-sm">{concept.concept}</span>
                                </div>
                                <span className={`text-sm font-medium ${getMasteryColor(concept.mastery)}`}>
                                  {Math.round(concept.mastery)}%
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t space-y-3">
                        <Button 
                          className="w-full" 
                          onClick={handleStartAssessment}
                        >
                          <Lightbulb className="mr-2 h-4 w-4" />
                          Start New Assessment
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {;
                            setActiveTab('mastery');
                          }}
                        >
                          <Brain className = "mr-2 h-4 w-4" />
                          View Detailed Results
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Assessment Settings</h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="feedback-level">Feedback Detail Level</Label>
                          <span className="text-sm">{feedbackLevel}%</span>
                        </div>
                        <Slider
                          id="feedback-level"
                          min={0}
                          max={100}
                          step={10}
                          value={[feedbackLevel]}
                          onValueChange={(value) => setFeedbackLevel(value[0])}
                        />
                        <p className="text-xs text-muted-foreground">
                          Higher values provide more detailed feedback, lower values offer concise guidance.
                        </p>
                      </div>
                      
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="adaptive-toggle">
                          <div className="flex items-centre">
                            <Brain className="mr-2 h-4 w-4" />
                            Adaptive Difficulty
                          </div>
                        </Label>
                        <Switch 
                          id="adaptive-toggle" 
                          checked={true}
                        />
                      </div>
                      
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="hints-toggle">
                          <div className="flex items-centre">
                            <Lightbulb className="mr-2 h-4 w-4" />
                            Show Hints
                          </div>
                        </Label>
                        <Switch 
                          id="hints-toggle" 
                          checked={true}
                        />
                      </div>
                      
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="timer-toggle">
                          <div className="flex items-centre">
                            <Clock className="mr-2 h-4 w-4" />
                            Question Timer
                          </div>
                        </Label>
                        <Switch 
                          id="timer-toggle" 
                          checked={false}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Accessibility Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="text-to-speech">Text-to-Speech</Label>
                        <Switch id="text-to-speech" />
                      </div>
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="extended-time">Extended Time</Label>
                        <Switch id="extended-time" />
                      </div>
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="simplified-language">Simplified Language</Label>
                        <Switch id="simplified-language" />
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
          {assessmentInProgress ? (
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-4">{currentQuestion.question}</h2>
                  
                  {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            selectedAnswer === option 
                              ? 'border-primary bg-primary/5' 
                              : 'border-transparent bg-muted/50 hover:bg-muted'
                          }`}
                          onClick={() => setSelectedAnswer(option)}
                        >
                          <div className="flex items-centre">
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-centre justify-centre ${
                              selectedAnswer === option 
                                ? 'border-primary' 
                                : 'border-muted-foreground'
                            }`}>
                              {selectedAnswer === option && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay') && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder={currentQuestion.type === 'short-answer' 
                          ? "Enter your answer here..." 
                          : "Write your response here..."
                        }
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        rows={currentQuestion.type === 'short-answer' ? 3 : 8}
                        className="w-full"
                      />
                      
                      {currentQuestion.type === 'essay' && currentQuestion.rubric && (
                        <div className="bg-muted/50 p-4 rounded-lg mt-4">
                          <h3 className="text-sm font-medium mb-2">Rubric</h3>
                          <div className="space-y-3">
                            {currentQuestion.rubric.map((rubricItem, index) => (
                              <div key={index}>
                                <h4 className="text-sm font-medium">{rubricItem.criteria}</h4>
                                <div className="grid grid-cols-4 gap-1 mt-1">
                                  {rubricItem.levels.map((level, levelIndex) => (
                                    <div key={levelIndex} className="text-xs p-1 border rounded text-centre">
                                      {level.score}: {level.description}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  >
                    Previous
                  </Button>
                  
                  <Button 
                    disabled={
                      isProcessing || 
                      (currentQuestion.type === 'multiple-choice' && !selectedAnswer) ||
                      ((currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay') && !textAnswer.trim())
                    }
                    onClick={handleSubmitAnswer}
                  >
                    {isProcessing ? (
                      <>
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Submit Answer'
                    )}
                  </Button>
                </div>
                
                {results.length > 0 && currentQuestionIndex > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-medium mb-3">Previous Question Feedback</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-centre gap-2 mb-2">
                        {results[currentQuestionIndex - 1].correct ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">
                          {results[currentQuestionIndex - 1].correct ? 'Correct' : 'Needs Improvement'}
                        </span>
                        <Badge variant="outline" className="ml-auto">
                          Score: {results[currentQuestionIndex - 1].score}%
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{results[currentQuestionIndex - 1].feedback}</p>
                      <div className="text-xs text-muted-foreground">
                        Time spent: {Math.floor(results[currentQuestionIndex - 1].timeSpent / 60)}m {results[currentQuestionIndex - 1].timeSpent % 60}s
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : assessmentCompleted ? (
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-centre">
                    <BarChart className="mr-2 h-5 w-5 text-primary" />
                    Assessment Results
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                      <CardContent className="p-4 text-centre">
                        <div className="text-5xl font-bold mb-2 text-primary">
                          {Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Overall Score</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-centre">
                        <div className="text-5xl font-bold mb-2 text-primary">
                          {results.filter(r => r.correct).length}/{results.length}
                        </div>
                        <p className="text-sm text-muted-foreground">Questions Correct</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-centre">
                        <div className="text-5xl font-bold mb-2 text-primary">
                          {Math.round(results.reduce((acc, r) => acc + r.timeSpent, 0) / 60)}
                        </div>
                        <p className="text-sm text-muted-foreground">Minutes Spent</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4">Question Breakdown</h3>
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-centre justify-between mb-2">
                            <h4 className="font-medium">Question {index + 1}</h4>
                            <Badge 
                              variant={result.correct ? "default" : "destructive"}
                              className="ml-auto"
                            >
                              {result.score}%
                            </Badge>
                          </div>
                          
                          <p className="text-sm mb-3">
                            {questions[index].question}
                          </p>
                          
                          <div className="bg-muted/50 p-3 rounded-lg mb-3">
                            <div className="text-xs text-muted-foreground mb-1">Your Response:</div>
                            <p className="text-sm">{result.response}</p>
                          </div>
                          
                          <div className="bg-primary/5 p-3 rounded-lg">
                            <div className="text-xs text-primary mb-1">Feedback:</div>
                            <p className="text-sm">{result.feedback}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {questions[index].conceptTags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
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
                    <Brain className="mr-2 h-5 w-5 text-primary" />
                    Knowledge Map
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Concept Mastery</h3>
                      <div className="space-y-4">
                        {conceptMastery.map((concept, index) => (
                          <div key={index}>
                            <div className="flex items-centre justify-between mb-1">
                              <div className="flex items-centre">
                                {getTrendIcon(concept.trend)}
                                <span className="ml-2">{concept.concept}</span>
                              </div>
                              <span className={`font-medium ${getMasteryColor(concept.mastery)}`}>
                                {Math.round(concept.mastery)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  concept.mastery >= 80 ? 'bg-green-500' : 
                                  concept.mastery >= 60 ? 'bg-amber-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${concept.mastery}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Last assessed: {concept.lastAssessed}</span>
                              <span>Confidence: {concept.confidence}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">Learning Recommendations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2 flex items-centre">
                              <Zap className="mr-2 h-4 w-4 text-primary" />
                              Focus Areas
                            </h4>
                            <ul className="space-y-2 text-sm">
                              {conceptMastery
                                .filter(concept => concept.mastery < 60)
                                .map((concept, index) => (
                                  <li key={index} className="flex items-start">
                                    <ArrowRight className="mr-2 h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    <span>{concept.concept} - Review fundamental principles and practise with basic examples</span>
                                  </li>
                                ))}
                              {conceptMastery
                                .filter(concept => concept.mastery >= 60 && concept.mastery < 80)
                                .map((concept, index) => (
                                  <li key={index} className="flex items-start">
                                    <ArrowRight className="mr-2 h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span>{concept.concept} - Continue practise with intermediate problems</span>
                                  </li>
                                ))}
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2 flex items-centre">
                              <Sparkles className="mr-2 h-4 w-4 text-primary" />
                              Recommended Resources
                            </h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <BookOpen className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>Interactive tutorial: "Mastering Linear Equations"</span>
                              </li>
                              <li className="flex items-start">
                                <BookOpen className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>Practise set: "Algebraic Expressions in Real-World Contexts"</span>
                              </li>
                              <li className="flex items-start">
                                <BookOpen className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>Video lesson: "Factoring Quadratic Expressions"</span>
                              </li>
                              <li className="flex items-start">
                                <BookOpen className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>Interactive simulation: "Geometric Applications of Algebra"</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 border-t">
                  <Button className="w-full">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Personalized Study Plan
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-centre">
                    <Brain className="mr-2 h-5 w-5 text-primary" />
                    Intelligent Assessment System
                  </h2>
                  
                  <p className="mb-6">
                    Our AI-powered assessment system goes beyond traditional testing to provide a comprehensive understanding of your knowledge, skills, and learning patterns. Through adaptive questioning, detailed feedback, and sophisticated analysis, we create a complete picture of your academic strengths and areas for growth.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="bg-primary/10 p-3 rounded-full w-fit mb-3">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium mb-2">Adaptive Questioning</h3>
                        <p className="text-sm text-muted-foreground">
                          Questions adjust in real-time based on your responses, targeting the precise edge of your knowledge to maximize learning insights.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="bg-primary/10 p-3 rounded-full w-fit mb-3">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium mb-2">Personalized Feedback</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive tailored explanations and guidance that address your specific misconceptions and learning patterns.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="bg-primary/10 p-3 rounded-full w-fit mb-3">
                          <BarChart2 className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-medium mb-2">Knowledge Mapping</h3>
                        <p className="text-sm text-muted-foreground">
                          Visualise your understanding across concepts and topics, identifying connections and knowledge gaps.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-centre">
                      <PieChart className="mr-2 h-5 w-5 text-primary" />
                      Current Knowledge Profile
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Concept Mastery Overview</h4>
                        <div className="space-y-3">
                          {conceptMastery.map((concept, index) => (
                            <div key={index}>
                              <div className="flex justify-between text-xs mb-1">
                                <span>{concept.concept}</span>
                                <span className={getMasteryColor(concept.mastery)}>
                                  {Math.round(concept.mastery)}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    concept.mastery >= 80 ? 'bg-green-500' : 
                                    concept.mastery >= 60 ? 'bg-amber-500' : 
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${concept.mastery}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Strengths & Growth Areas</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">Strengths</h5>
                            <ul className="space-y-1 text-sm">
                              {conceptMastery
                                .filter(concept => concept.mastery >= 80)
                                .map((concept, index) => (
                                  <li key={index} className="flex items-centre">
                                    <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                                    {concept.concept}
                                  </li>
                                ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">Growth Areas</h5>
                            <ul className="space-y-1 text-sm">
                              {conceptMastery
                                .filter(concept => concept.mastery < 60)
                                .map((concept, index) => (
                                  <li key={index} className="flex items-centre">
                                    <ArrowRight className="mr-2 h-3 w-3 text-red-500" />
                                    {concept.concept}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-centre">
                      <Layers className="mr-2 h-5 w-5 text-primary" />
                      Assessment Types
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Diagnostic Assessment</h4>
                        <p className="text-sm mb-3">
                          Comprehensive evaluation of your current knowledge state across multiple concepts and skills.
                        </p>
                        <Button size="sm">Start Diagnostic</Button>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Concept-Focused Assessment</h4>
                        <p className="text-sm mb-3">
                          Deep dive into specific concepts to identify precise strengths and misconceptions.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline">Linear Equations</Badge>
                          <Badge variant="outline">Quadratic Equations</Badge>
                          <Badge variant="outline">Algebraic Expressions</Badge>
                          <Badge variant="outline">Geometric Principles</Badge>
                        </div>
                        <Button size="sm">Select Concept</Button>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Progress Monitoring</h4>
                        <p className="text-sm mb-3">
                          Regular check-ins to track growth and ensure continued mastery of previously learned concepts.
                        </p>
                        <Button size="sm">Schedule Check-in</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Adaptive Intelligence</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your responses in real-time, adjusting question difficulty and focus to precisely map your knowledge boundaries and learning patterns.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <PenTool className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Response Analysis</h3>
              <p className="text-muted-foreground">
                Advanced natural language processing evaluates free-text responses, understanding conceptual understanding beyond simple right/wrong answers.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Feedback</h3>
              <p className="text-muted-foreground">
                Receive tailored explanations that address your specific misconceptions, learning style, and prior knowledge patterns.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-centre">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Knowledge Mapping</h3>
              <p className="text-muted-foreground">
                Sophisticated algorithms build a comprehensive map of your understanding, identifying connections between concepts and precise knowledge gaps.
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
                    <span className="font-medium">Beyond Right and Wrong</span>
                    <p className="text-sm text-muted-foreground">Receive credit for partial understanding and insight into your thinking process, not just binary correct/incorrect judgments.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Targeted Learning Recommendations</span>
                    <p className="text-sm text-muted-foreground">Receive precisely tailored resources and activities that address your specific knowledge gaps and learning needs.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Reduced Test Anxiety</span>
                    <p className="text-sm text-muted-foreground">Experience assessment as a supportive learning tool rather than a high-stakes judgment, with immediate constructive feedback.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Metacognitive Development</span>
                    <p className="text-sm text-muted-foreground">Gain insights into your own learning patterns and thought processes, developing valuable self-awareness and learning strategies.</p>
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
                    <span className="font-medium">Comprehensive Learner Insights</span>
                    <p className="text-sm text-muted-foreground">Access detailed knowledge maps for each student, revealing precise understanding levels across concepts and topics.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Efficient Assessment</span>
                    <p className="text-sm text-muted-foreground">Save time with automated evaluation of complex responses while maintaining high-quality assessment and feedback.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Data-Driven Instruction</span>
                    <p className="text-sm text-muted-foreground">Use detailed assessment data to inform teaching strategies, curriculum adjustments, and intervention planning.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Early Intervention</span>
                    <p className="text-sm text-muted-foreground">Identify misconceptions and learning gaps early, before they compound into larger challenges for students.</p>
                  </div>
                </li>
              </ul>
            </CardContent>          </Card>
        </div>
      </motion.div>
    </div>
  );
}
