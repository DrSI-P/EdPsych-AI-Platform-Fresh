'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';

export default function TakePupilVoiceSurveyPage() {
  const router = useRouter();
  const params = useParams();
  const surveyId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [survey, setSurvey] = useState<any>(null);
  const [responses, setResponses] = useState<{[key: string]}>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`/api/assessment/pupil-voice/${surveyId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch pupil voice survey');
        }
        
        const data = await response.json();
        
        // Check if survey is active
        if (data.status !== 'active') {
          setError('This survey is not currently active');
          setLoading(false);
          return;
        }
        
        setSurvey(data);
        
        // Initialize responses object
        const initialResponses: {[key: string]} = {};
        data.questions.forEach((question) => {
          if (question.type === 'multiple_choice' || question.type === 'likert_scale' || 
              question.type === 'emoji_scale' || question.type === 'yes_no') {
            initialResponses[question.id] = '';
          } else if (question.type === 'open_ended') {
            initialResponses[question.id] = '';
          }
        });
        
        setResponses(initialResponses);
      } catch (err) {
        console.error('Error fetching pupil voice survey:', err);
        setError('An error occurred while fetching the pupil voice survey');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurvey();
  }, [surveyId]);

  const handleInputChange = (questionId: string, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Clear validation error for this question if it exists
    if (validationErrors[questionId]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = () => {
    if (!survey) return false;
    
    const currentQuestions = [survey.questions[currentStep]];
    const newErrors: {[key: string]: string} = {};
    
    currentQuestions.forEach(question => {
      if (question.required) {
        const response = responses[question.id];
        if (!response || (typeof response === 'string' && response.trim() === '')) {
          newErrors[question.id] = 'This question requires an answer';
        }
      }
    });
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!survey) return;
    
    if (validateCurrentStep()) {
      if (currentStep < survey.questions.length - 1) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!survey) return;
    
    // Validate all questions
    const newErrors: {[key: string]: string} = {};
    survey.questions.forEach((question) => {
      if (question.required) {
        const response = responses[question.id];
        if (!response || (typeof response === 'string' && response.trim() === '')) {
          newErrors[question.id] = 'This question requires an answer';
        }
      }
    });
    
    setValidationErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Find the first question with an error and navigate to it
      const errorQuestionIndex = survey.questions.findIndex((q) => newErrors[q.id]);
      if (errorQuestionIndex !== -1) {
        setCurrentStep(errorQuestionIndex);
        return;
      }
    }
    
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/assessment/pupil-voice/${surveyId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit survey responses');
      }
      
      // Navigate to thank you page
      router.push(`/assessment/pupil-voice/thank-you/${surveyId}`);
    } catch (err) {
      console.error('Error submitting survey responses:', err);
      setError('An error occurred while submitting your responses');
      setSubmitting(false);
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
        <Button
          onClick={() => router.push('/assessment/pupil-voice')}
        >
          Back to Surveys
        </Button>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" className="mb-6">
          Survey not found
        </Alert>
        <Button
          onClick={() => router.push('/assessment/pupil-voice')}
        >
          Back to Surveys
        </Button>
      </div>
    );
  }

  const currentQuestion = survey.questions[currentStep];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-grey-900">{survey.title}</h1>
        {survey.description && (
          <p className="mt-2 text-grey-600">
            {survey.description}
          </p>
        )}
      </div>

      <div className="mb-4">
        <div className="w-full bg-grey-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${((currentStep + 1) / survey.questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-grey-600">
          <span>Question {currentStep + 1} of {survey.questions.length}</span>
          <span>{Math.round(((currentStep + 1) / survey.questions.length) * 100)}% complete</span>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-centre justify-centre mr-3 flex-shrink-0">
                {currentStep + 1}
              </span>
              <div className="flex-grow">
                <h3 className="text-lg font-medium mb-2">{currentQuestion.text}</h3>
                
                {currentQuestion.type === 'multiple_choice' && (
                  <div className="space-y-2 mt-3">
                    {currentQuestion.options.map((option: string, optionIndex: number) => (
                      <div key={optionIndex} className="flex items-centre">
                        <input
                          type="radio"
                          name={`question_${currentQuestion.id}`}
                          id={`option_${currentQuestion.id}_${optionIndex}`}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300"
                          checked={responses[currentQuestion.id] === option}
                          onChange={() => handleInputChange(currentQuestion.id, option)}
                        />
                        <label htmlFor={`option_${currentQuestion.id}_${optionIndex}`} className="ml-2 block text-sm text-grey-900">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                
                {currentQuestion.type === 'likert_scale' && (
                  <div className="mt-3">
                    <div className="flex justify-between items-centre">
                      {currentQuestion.options.map((option: string, optionIndex: number) => (
                        <div key={optionIndex} className="text-centre">
                          <div className="flex flex-col items-centre">
                            <input
                              type="radio"
                              name={`question_${currentQuestion.id}`}
                              id={`option_${currentQuestion.id}_${optionIndex}`}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300"
                              checked={responses[currentQuestion.id] === option}
                              onChange={() => handleInputChange(currentQuestion.id, option)}
                            />
                            <label htmlFor={`option_${currentQuestion.id}_${optionIndex}`} className="mt-1 block text-xs text-grey-500">
                              {option}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {currentQuestion.type === 'emoji_scale' && (
                  <div className="mt-3">
                    <div className="flex justify-between items-centre">
                      {currentQuestion.options.map((emoji: string, optionIndex: number) => (
                        <div key={optionIndex} className="text-centre">
                          <div className="flex flex-col items-centre">
                            <input
                              type="radio"
                              name={`question_${currentQuestion.id}`}
                              id={`option_${currentQuestion.id}_${optionIndex}`}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300"
                              checked={responses[currentQuestion.id] === emoji}
                              onChange={() => handleInputChange(currentQuestion.id, emoji)}
                            />
                            <label htmlFor={`option_${currentQuestion.id}_${optionIndex}`} className="mt-1 block text-2xl">
                              {emoji}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {currentQuestion.type === 'yes_no' && (
                  <div className="flex space-x-4 mt-3">
                    <div className="flex items-centre">
                      <input
                        type="radio"
                        name={`question_${currentQuestion.id}`}
                        id={`option_${currentQuestion.id}_yes`}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300"
                        checked={responses[currentQuestion.id] === 'Yes'}
                        onChange={() => handleInputChange(currentQuestion.id, 'Yes')}
                      />
                      <label htmlFor={`option_${currentQuestion.id}_yes`} className="ml-2 block text-sm text-grey-900">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-centre">
                      <input
                        type="radio"
                        name={`question_${currentQuestion.id}`}
                        id={`option_${currentQuestion.id}_no`}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300"
                        checked={responses[currentQuestion.id] === 'No'}
                        onChange={() => handleInputChange(currentQuestion.id, 'No')}
                      />
                      <label htmlFor={`option_${currentQuestion.id}_no`} className="ml-2 block text-sm text-grey-900">
                        No
                      </label>
                    </div>
                  </div>
                )}
                
                {currentQuestion.type === 'open_ended' && (
                  <div className="mt-3">
                    <textarea
                      className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      rows={3}
                      placeholder="Type your answer here..."
                      value={responses[currentQuestion.id] || ''}
                      onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                    />
                  </div>
                )}
                
                {validationErrors[currentQuestion.id] && (
                  <div className="mt-2 text-sm text-red-600">
                    {validationErrors[currentQuestion.id]}
                  </div>
                )}
                
                {currentQuestion.required && (
                  <div className="mt-2 text-xs text-red-600">
                    * Required
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          {currentStep < survey.questions.length - 1 ? (
            <Button
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? <Spinner size="sm" /> : 'Submit'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
