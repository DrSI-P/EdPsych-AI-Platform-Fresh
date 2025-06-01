'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { Modal } from '@/components/ui/modal';

interface Question {
  id: string;
  type: string;
  content: string;
  options?: any[];
  items?: any[];
  allowedFileTypes?: string[];
  maxFileSize?: number;
  wordLimit?: number;
  points: number;
  order: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: string;
  subject: string;
  keyStage: string;
  timeLimit: number;
  passingScore: number;
  showResults: boolean;
  randomizeQuestions: boolean;
  allowRetakes: boolean;
  status: string;
  questions: any[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

interface Answer {
  questionId: string;
  content;
}

export default function AssessmentTakePage() {
  const router = useRouter();
  const params = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [results, setResults] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessment/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch assessment');
        }
        
        const data = await response.json();
        
        // Check if assessment is published
        if (data.status !== 'published') {
          throw new Error('This assessment is not available');
        }
        
        setAssessment(data);
        
        // Initialize answers array
        const initialAnswers = data.questions.map((question: Question) => ({
          questionId: question.id,
          content: question.type === 'multiple-choice' ? [] : 
                  question.type === 'matching' ? {} : 
                  question.type === 'file-upload' ? null : ''
        }));
        
        setAnswers(initialAnswers);
        
        // Set up timer if there's a time limit
        if (data.timeLimit > 0) {
          setTimeRemaining(data.timeLimit * 60); // Convert minutes to seconds
        }
      } catch (err) {
        console.error('Error fetching assessment:', err);
        setError('An error occurred while fetching the assessment');
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchAssessment();
    }
    
    return () => {
      // Clean up timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [params.id]);

  // Set up timer
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && !submissionComplete) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining, submissionComplete]);

  const handleTimeUp = () => {
    // Auto-submit when time is up
    handleSubmit();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleAnswerChange = (questionId: string, value) => {
    setAnswers(prevAnswers => 
      prevAnswers.map(answer => 
        answer.questionId === questionId ? { ...answer, content: value } : answer
      )
    );
  };

  const handleMultipleChoiceChange = (questionId: string, optionId: string, allowMultiple: boolean) => {
    setAnswers(prevAnswers => 
      prevAnswers.map(answer => {
        if (answer.questionId === questionId) {
          if (allowMultiple) {
            // Toggle the option in the array
            const content = Array.isArray(answer.content) ? [...answer.content] : [];
            const index = content.indexOf(optionId);
            
            if (index > -1) {
              content.splice(index, 1);
            } else {
              content.push(optionId);
            }
            
            return { ...answer, content };
          } else {
            // Single selection
            return { ...answer, content: [optionId] };
          }
        }
        return answer;
      })
    );
  };

  const handleMatchingChange = (questionId: string, leftId: string, rightId: string) => {
    setAnswers(prevAnswers => 
      prevAnswers.map(answer => {
        if (answer.questionId === questionId) {
          const content = { ...(answer.content || {}) };
          content[leftId] = rightId;
          return { ...answer, content };
        }
        return answer;
      })
    );
  };

  const handleFileUpload = (questionId: string, file: File | null) => {
    setAnswers(prevAnswers => 
      prevAnswers.map(answer => 
        answer.questionId === questionId ? { ...answer, content: file } : answer
      )
    );
  };

  const handleNextQuestion = () => {
    if (assessment && currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!assessment) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Convert file uploads to base64 for submission
      const processedAnswers = await Promise.all(
        answers.map(async (answer) => {
          const question = assessment.questions.find(q => q.id === answer.questionId);
          
          if (question?.type === 'file-upload' && answer.content instanceof File) {
            const base64 = await fileToBase64(answer.content);
            return {
              ...answer,
              content: {
                filename: answer.content.name,
                type: answer.content.type,
                size: answer.content.size,
                data: base64
              }
            };
          }
          
          return answer;
        })
      );
      
      const response = await fetch(`/api/assessment/${assessment.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: processedAnswers
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }
      
      const data = await response.json();
      setResults(data);
      setSubmissionComplete(true);
      
      // Stop the timer if it's running
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('An error occurred while submitting your answers');
    } finally {
      setIsSubmitting(false);
      setShowConfirmSubmit(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const renderQuestion = (question: Question) => {
    const answer = answers.find(a => a.questionId === question.id);
    
    switch (question.type) {
      case 'multiple-choice':
        const allowMultiple = question.options?.some(option => option.isCorrect) && 
                             question.options?.filter(option => option.isCorrect).length > 1;
        
        return (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p>{question.content}</p>
            </div>
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-centre">
                  <input
                    type={allowMultiple ? 'checkbox' : 'radio'}
                    id={`option-${option.id}`}
                    name={`question-${question.id}`}
                    checked={Array.isArray(answer?.content) && answer?.content.includes(option.id)}
                    onChange={() => handleMultipleChoiceChange(question.id, option.id, allowMultiple)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-grey-300"
                  />
                  <label htmlFor={`option-${option.id}`} className="ml-2 block text-sm text-grey-700">
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'open-ended':
        return (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p>{question.content}</p>
            </div>
            {question.wordLimit ? (
              <p className="text-sm text-grey-500">Word limit: {question.wordLimit} words</p>
            ) : null}
            <textarea
              value={answer?.content || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Enter your answer here"
              rows={6}
              className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        );
        
      case 'matching':
        // Get all right items for the dropdown
        const rightItems = question.items?.map(item => ({
          id: item.id,
          text: item.right
        })) || [];
        
        return (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p>{question.content}</p>
            </div>
            <div className="space-y-3">
              {question.items?.map((item) => (
                <div key={item.id} className="grid grid-cols-2 gap-4 items-centre">
                  <div className="p-2 border rounded bg-grey-50">
                    {item.left}
                  </div>
                  <select
                    value={answer?.content?.[item.id] || ''}
                    onChange={(e) => handleMatchingChange(question.id, item.id, e.target.value)}
                    className="block w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select matching item --</option>
                    {rightItems.map((rightItem) => (
                      <option key={rightItem.id} value={rightItem.id}>
                        {rightItem.text}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'file-upload':
        return (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p>{question.content}</p>
            </div>
            <div className="p-4 border-2 border-dashed rounded-md">
              {answer?.content ? (
                <div className="flex items-centre justify-between">
                  <div className="flex items-centre">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-grey-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-grey-700">{answer.content.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFileUpload(question.id, null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-centre">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-grey-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-1 text-sm text-grey-600">
                    Drag and drop a file, or <span className="text-blue-500">browse</span>
                  </p>
                  <p className="mt-1 text-xs text-grey-500">
                    Allowed file types: {question.allowedFileTypes?.map(type => `.${type}`).join(', ')}
                  </p>
                  <p className="mt-1 text-xs text-grey-500">
                    Maximum file size: {question.maxFileSize} MB
                  </p>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileUpload(question.id, file);
                    }}
                    accept={question.allowedFileTypes?.map(type => `.${type}`).join(',')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="prose max-w-none">
            <p>{question.content}</p>
            <p className="text-red-500">Unsupported question type</p>
          </div>
        );
    }
  };

  const renderResults = () => {
    if (!assessment || !results) return null;
    
    const score = results.score;
    const totalPoints = assessment.questions.reduce((total, q) => total + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);
    const passed = percentage >= assessment.passingScore;
    
    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-lg ${passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h2 className="text-2xl font-bold mb-4">Assessment Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-centre p-4 bg-white rounded-md shadow-sm">
              <p className="text-sm text-grey-500 mb-1">Your Score</p>
              <p className="text-3xl font-bold">{score}/{totalPoints}</p>
            </div>
            <div className="text-centre p-4 bg-white rounded-md shadow-sm">
              <p className="text-sm text-grey-500 mb-1">Percentage</p>
              <p className="text-3xl font-bold">{percentage}%</p>
            </div>
            <div className="text-centre p-4 bg-white rounded-md shadow-sm">
              <p className="text-sm text-grey-500 mb-1">Result</p>
              <p className={`text-xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {passed ? 'PASSED' : 'FAILED'}
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Feedback</h3>
            <p className="text-grey-700">{results.feedback || 'No feedback provided.'}</p>
          </div>
        </div>
        
        {assessment.showResults && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Question Review</h3>
            
            {assessment.questions.map((question, index) => {
              const answer = answers.find(a => a.questionId === question.id);
              const questionResult = results.answers.find((a) => a.questionId === question.id);
              const isCorrect = questionResult?.isCorrect;
              
              return (
                <div 
                  key={question.id} 
                  className={`p-4 border rounded-md ${
                    isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <p className="mb-2">{question.content}</p>
                  
                  <div className="bg-white p-3 rounded mb-2">
                    <p className="text-sm font-medium text-grey-500">Your Answer:</p>
                    {renderAnswerContent(question, answer)}
                  </div>
                  
                  {!isCorrect && questionResult?.correctAnswer && (
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm font-medium text-grey-500">Correct Answer:</p>
                      <p className="text-sm">{renderCorrectAnswer(question, questionResult.correctAnswer)}</p>
                    </div>
                  )}
                  
                  {questionResult?.feedback && (
                    <div className="mt-2 text-sm text-grey-700">
                      <p className="font-medium">Feedback:</p>
                      <p>{questionResult.feedback}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => router.push('/assessment')}
          >
            Back to Assessments
          </Button>
          
          {assessment.allowRetakes && (
            <Button
              onClick={() => {
                setSubmissionComplete(false);
                setResults(null);
                setCurrentQuestionIndex(0);
                
                // Reset answers
                const initialAnswers = assessment.questions.map((question: Question) => ({
                  questionId: question.id,
                  content: question.type === 'multiple-choice' ? [] : 
                          question.type === 'matching' ? {} : 
                          question.type === 'file-upload' ? null : ''
                }));
                
                setAnswers(initialAnswers);
                
                // Reset timer if there's a time limit
                if (assessment.timeLimit > 0) {
                  setTimeRemaining(assessment.timeLimit * 60);
                }
              }}
            >
              Retake Assessment
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderAnswerContent = (question: Question, answer: Answer | undefined) => {
    if (!answer) return <p className="text-grey-500">No answer provided</p>;
    
    switch (question.type) {
      case 'multiple-choice':
        if (!Array.isArray(answer.content) || answer.content.length === 0) {
          return <p className="text-grey-500">No option selected</p>;
        }
        
        return (
          <ul className="list-disc pl-5">
            {answer.content.map((optionId) => {
              const option = question.options?.find(o => o.id === optionId);
              return option ? (
                <li key={optionId}>{option.text}</li>
              ) : null;
            })}
          </ul>
        );
        
      case 'open-ended':
        return answer.content ? (
          <p>{answer.content}</p>
        ) : (
          <p className="text-grey-500">No answer provided</p>
        );
        
      case 'matching':
        if (!answer.content || Object.keys(answer.content).length === 0) {
          return <p className="text-grey-500">No matches provided</p>;
        }
        
        return (
          <ul className="list-disc pl-5">
            {Object.entries(answer.content).map(([leftId, rightId]) => {
              const leftItem = question.items?.find(item => item.id === leftId);
              const rightItem = question.items?.find(item => item.id === rightId);
              
              return leftItem && rightItem ? (
                <li key={leftId}>
                  {leftItem.left} → {rightItem.right}
                </li>
              ) : null;
            })}
          </ul>
        );
        
      case 'file-upload':
        return answer.content ? (
          <p className="flex items-centre">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-grey-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {answer.content.name || 'File uploaded'}
          </p>
        ) : (
          <p className="text-grey-500">No file uploaded</p>
        );
        
      default:
        return <p className="text-grey-500">Unsupported question type</p>;
    }
  };

  const renderCorrectAnswer = (question: Question, correctAnswer) => {
    switch (question.type) {
      case 'multiple-choice':
        if (Array.isArray(correctAnswer)) {
          const correctOptions = question.options?.filter(o => correctAnswer.includes(o.id));
          return correctOptions?.map(o => o.text).join(', ');
        }
        return 'Unknown format';
        
      case 'matching':
        if (typeof correctAnswer === 'object' && correctAnswer !== null) {
          return Object.entries(correctAnswer)
            .map(([leftId, rightId]) => {
              const leftItem = question.items?.find(item => item.id === leftId);
              const rightItem = question.items?.find(item => item.id === rightId);
              return leftItem && rightItem ? `${leftItem.left} → ${rightItem.right}` : null;
            })
            .filter(Boolean)
            .join(', ');
        }
        return 'Unknown format';
        
      default:
        return String(correctAnswer);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-centre items-centre min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
        <Button onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" className="mb-6">
          Assessment not found
        </Alert>
        <Button onClick={() => router.push('/assessment')}>
          Go to Assessments
        </Button>
      </div>
    );
  }

  if (submissionComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            {renderResults()}
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-grey-900">{assessment.title}</h1>
        <p className="text-grey-600">{assessment.description}</p>
      </div>

      <div className="flex justify-between items-centre mb-4">
        <div className="text-sm">
          Question {currentQuestionIndex + 1} of {assessment.questions.length}
        </div>
        {timeRemaining !== null && (
          <div className={`text-sm font-medium ${timeRemaining < 60 ? 'text-red-600' : 'text-grey-700'}`}>
            Time Remaining: {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          {currentQuestion ? (
            renderQuestion(currentQuestion)
          ) : (
            <p className="text-grey-500">No questions available</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < assessment.questions.length - 1 ? (
            <Button
              onClick={handleNextQuestion}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={() => setShowConfirmSubmit(true)}
            >
              Submit Assessment
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="flex justify-centre">
        <div className="flex flex-wrap gap-2 max-w-2xl">
          {assessment.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 flex items-centre justify-centre rounded-full text-sm font-medium ${
                index === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : answers[index]?.content && 
                    (Array.isArray(answers[index].content) 
                      ? answers[index].content.length > 0 
                      : answers[index].content !== null && answers[index].content !== '' && Object.keys(answers[index].content || {}).length > 0)
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-grey-100 text-grey-800 border border-grey-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <Modal
        isOpen={showConfirmSubmit}
        onClose={() => setShowConfirmSubmit(false)}
        title="Submit Assessment"
      >
        <div className="p-6">
          <p className="mb-4">Are you sure you want to submit this assessment? You won't be able to change your answers after submission.</p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmSubmit(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              Submit Assessment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
