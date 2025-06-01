'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { Tabs } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';

interface QuestionType {
  id?: string;
  text: string;
  type: 'multiple_choice' | 'likert_scale' | 'open_ended' | 'emoji_scale' | 'yes_no';
  required: boolean;
  options: any[];
  order: number;
}

// Component to handle search params with Suspense
function CreatePupilVoiceSurveyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // If template is specified, load template data
    if (templateId) {
      setLoading(true);
      
      const loadTemplate = async () => {
        try {
          const response = await fetch(`/api/assessment/pupil-voice/templates/${templateId}`);
          
          if (!response.ok) {
            throw new Error('Failed to load template');
          }
          
          const data = await response.json();
          
          setTitle(data.title);
          setDescription(data.description || '');
          setQuestions(data.questions || []);
          
        } catch (err) {
          console.error('Error loading template:', err);
          setError('An error occurred while loading the template');
        } finally {
          setLoading(false);
        }
      };
      
      loadTemplate();
    } else {
      // Add a default first question if no template
      if (questions.length === 0) {
        setQuestions([
          {
            text: '',
            type: 'multiple_choice',
            required: true,
            options: ['', ''],
            order: 0,
          },
        ]);
        setActiveQuestionIndex(0);
      }
    }
  }, [templateId]);

  const handleAddQuestion = () => {
    const newQuestion: QuestionType = {
      text: '',
      type: 'multiple_choice',
      required: true,
      options: ['', ''],
      order: questions.length,
    };
    
    setQuestions([...questions, newQuestion]);
    setActiveQuestionIndex(questions.length);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    
    // Reorder questions
    const reorderedQuestions = newQuestions.map((q, i) => ({
      ...q,
      order: i,
    }));
    
    setQuestions(reorderedQuestions);
    
    if (activeQuestionIndex === index) {
      setActiveQuestionIndex(index === 0 ? (newQuestions.length > 0 ? 0 : null) : index - 1);
    } else if (activeQuestionIndex !== null && activeQuestionIndex > index) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  const handleQuestionChange = (index: number, field: keyof QuestionType, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value,
    };
    
    // If changing question type, reset options for certain types
    if (field === 'type') {
      switch (value) {
        case 'multiple_choice':
          newQuestions[index].options = ['', ''];
          break;
        case 'likert_scale':
          newQuestions[index].options = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
          break;
        case 'emoji_scale':
          newQuestions[index].options = ['😢', '😕', '😐', '🙂', '😄'];
          break;
        case 'yes_no':
          newQuestions[index].options = ['Yes', 'No'];
          break;
        case 'open_ended':
          newQuestions[index].options = [];
          break;
      }
    }
    
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }
    
    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap questions
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    
    // Update order
    newQuestions[index].order = index;
    newQuestions[targetIndex].order = targetIndex;
    
    setQuestions(newQuestions);
    setActiveQuestionIndex(targetIndex);
  };

  const handleSaveSurvey = async (status: 'draft' | 'active' = 'draft') => {
    // Validate survey
    if (!title.trim()) {
      setError('Please provide a title for the survey');
      return;
    }
    
    if (questions.length === 0) {
      setError('Please add at least one question to the survey');
      return;
    }
    
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      if (!question.text.trim()) {
        setError(`Question ${i + 1} is missing text`);
        setActiveQuestionIndex(i);
        return;
      }
      
      if (question.type === 'multiple_choice' && question.options.length < 2) {
        setError(`Question ${i + 1} needs at least two options`);
        setActiveQuestionIndex(i);
        return;
      }
      
      if (question.type === 'multiple_choice') {
        for (let j = 0; j < question.options.length; j++) {
          if (!question.options[j].trim()) {
            setError(`Option ${j + 1} in question ${i + 1} is empty`);
            setActiveQuestionIndex(i);
            return;
          }
        }
      }
    }
    
    setSaving(true);
    setError('');
    
    try {
      const surveyData = {
        title,
        description,
        questions,
        status,
        templateId: templateId || undefined,
      };
      
      const response = await fetch('/api/assessment/pupil-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save survey');
      }
      
      const data = await response.json();
      
      if (status === 'active') {
        router.push(`/assessment/pupil-voice/share/${data.id}`);
      } else {
        router.push('/assessment/pupil-voice');
      }
    } catch (err) {
      console.error('Error saving survey:', err);
      setError(err.message || 'An error occurred while saving the survey');
    } finally {
      setSaving(false);
    }
  };

  const renderQuestionEditor = () => {
    if (activeQuestionIndex === null || !questions[activeQuestionIndex]) {
      return (
        <div className="text-centre py-12">
          <p className="text-grey-500 mb-4">No question selected.</p>
          <Button onClick={handleAddQuestion}>
            Add Question
          </Button>
        </div>
      );
    }
    
    const question = questions[activeQuestionIndex];
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-grey-700">Question Text</label>
          <textarea
            className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={question.text}
            onChange={(e) => handleQuestionChange(activeQuestionIndex, 'text', e.target.value)}
            placeholder="Enter your question here"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-grey-700">Question Type</label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={question.type}
            onChange={(e) => handleQuestionChange(activeQuestionIndex, 'type', e.target.value)}
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="likert_scale">Likert Scale</option>
            <option value="emoji_scale">Emoji Scale</option>
            <option value="yes_no">Yes/No</option>
            <option value="open_ended">Open Ended</option>
          </select>
        </div>
        
        <div className="flex items-centre">
          <input
            id="required"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300 rounded"
            checked={question.required}
            onChange={(e) => handleQuestionChange(activeQuestionIndex, 'required', e.target.checked)}
          />
          <label htmlFor="required" className="ml-2 block text-sm text-grey-900">
            Required question
          </label>
        </div>
        
        {(question.type === 'multiple_choice') && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-grey-700">Options</label>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-centre">
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={option}
                    onChange={(e) => handleOptionChange(activeQuestionIndex, optionIndex, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      className="ml-2 text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveOption(activeQuestionIndex, optionIndex)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddOption(activeQuestionIndex)}
            >
              Add Option
            </Button>
          </div>
        )}
        
        {(question.type === 'likert_scale' || question.type === 'emoji_scale') && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-grey-700">Scale Options</label>
            <div className="flex justify-between items-centre p-2 border border-grey-200 rounded">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="text-centre">
                  <div className="text-lg">{option}</div>
                  <div className="text-xs text-grey-500">{optionIndex + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRemoveQuestion(activeQuestionIndex)}
          >
            Delete Question
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMoveQuestion(activeQuestionIndex, 'up')}
              disabled={activeQuestionIndex === 0}
            >
              Move Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMoveQuestion(activeQuestionIndex, 'down')}
              disabled={activeQuestionIndex === questions.length - 1}
            >
              Move Down
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderStep1 = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-grey-700">Survey Title</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your survey"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-grey-700">Description (Optional)</label>
          <textarea
            className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a brief description of the survey"
            rows={4}
          />
        </div>
        
        <div className="pt-4">
          <Button
            onClick={() => setCurrentStep(2)}
            disabled={!title.trim()}
          >
            Next: Add Questions
          </Button>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-grey-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Questions</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md cursor-pointer ${
                      activeQuestionIndex === index
                        ? 'bg-indigo-50 border border-indigo-300'
                        : 'bg-white border border-grey-200 hover:border-grey-300'
                    }`}
                    onClick={() => setActiveQuestionIndex(index)}
                  >
                    <div className="flex items-centre justify-between">
                      <div className="font-medium truncate">
                        {question.text || `Question ${index + 1}`}
                      </div>
                      <div className="text-xs text-grey-500">
                        {question.type === 'multiple_choice' ? 'Multiple Choice' :
                         question.type === 'likert_scale' ? 'Likert Scale' :
                         question.type === 'emoji_scale' ? 'Emoji Scale' :
                         question.type === 'yes_no' ? 'Yes/No' :
                         'Open Ended'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={handleAddQuestion}
                  className="w-full"
                >
                  Add Question
                </Button>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">
                  {activeQuestionIndex !== null
                    ? `Question ${activeQuestionIndex + 1}`
                    : 'Question Editor'}
                </h3>
              </CardHeader>
              <CardContent>
                {renderQuestionEditor()}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(1)}
          >
            Back
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handleSaveSurvey('draft')}
              disabled={saving}
            >
              {saving ? <Spinner size="sm" /> : 'Save as Draft'}
            </Button>
            <Button
              onClick={() => handleSaveSurvey('active')}
              disabled={saving || questions.length === 0}
            >
              {saving ? <Spinner size="sm" /> : 'Publish Survey'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-centre items-centre min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-centre justify-between">
          <h1 className="text-2xl font-bold text-grey-900">Create Pupil Voice Survey</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/assessment/pupil-voice')}
          >
            Cancel
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="mb-6">
        <div className="flex items-centre mb-8">
          <div className={`flex items-centre justify-centre w-10 h-10 rounded-full ${
            currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-grey-200 text-grey-600'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            currentStep >= 2 ? 'bg-indigo-600' : 'bg-grey-200'
          }`}></div>
          <div className={`flex items-centre justify-centre w-10 h-10 rounded-full ${
            currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-grey-200 text-grey-600'
          }`}>
            2
          </div>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function CreatePupilVoiceSurveyPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-centre items-centre min-h-screen">
        <Spinner size="lg" />
      </div>
    }>
      <CreatePupilVoiceSurveyContent />
    </Suspense>
  );
}
