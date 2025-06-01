'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

interface AssessmentCreatorProps {
  onSave?: (assessment: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

export function AssessmentCreator({ onSave, onCancel, initialData }: AssessmentCreatorProps) {
  const { showToast } = useToast();
  const [assessment, setAssessment] = useState(initialData || {
    title: '',
    description: '',
    type: 'multiple-choice',
    questions: [],
    published: false
  });
  
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'multiple-choice',
    options: ['', ''],
    correctAnswer: ''
  });
  
  const handleAssessmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssessment(prev => ({ ...prev, [name]: value }));
  };
  
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({ ...prev, [name]: value }));
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };
  
  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };
  
  const removeOption = (index: number) => {
    const newOptions = [...currentQuestion.options];
    newOptions.splice(index, 1);
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };
  
  const addQuestion = () => {
    if (!currentQuestion.text) {
      showToast({
        title: 'Question text is required',
        type: 'error'
      });
      return;
    }
    
    const newQuestion = { ...currentQuestion, id: Date.now().toString() };
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    // Reset current question
    setCurrentQuestion({
      text: '',
      type: 'multiple-choice',
      options: ['', ''],
      correctAnswer: ''
    });
  };
  
  const removeQuestion = (index: number) => {
    const newQuestions = [...assessment.questions];
    newQuestions.splice(index, 1);
    setAssessment(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };
  
  const handleSave = () => {
    if (!assessment.title) {
      showToast({
        title: 'Assessment title is required',
        type: 'error'
      });
      return;
    }
    
    if (assessment.questions.length === 0) {
      showToast({
        title: 'Assessment must have at least one question',
        type: 'error'
      });
      return;
    }
    
    onSave?.(assessment);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Assessment Details</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={assessment.title}
            onChange={handleAssessmentChange}
            required
          />
          
          <Textarea
            label="Description"
            name="description"
            value={assessment.description}
            onChange={handleAssessmentChange}
            rows={3}
          />
          
          <Select
            label="Assessment Type"
            name="type"
            value={assessment.type}
            onChange={handleAssessmentChange}
            options={[
              { value: 'multiple-choice', label: 'Multiple Choice' },
              { value: 'open-ended', label: 'Open Ended' },
              { value: 'matching', label: 'Matching' },
              { value: 'file-upload', label: 'File Upload' }
            ]}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Questions</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {assessment.questions.map((question, index: number) => (
            <div key={question.id || index} className="p-4 border rounded-md relative">
              <button
                type="button"
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => removeQuestion(index)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="font-medium mb-2">Question {index + 1}</div>
              <p className="mb-2">{question.text}</p>
              <div className="text-sm text-grey-500">Type: {question.type}</div>
              
              {question.type === 'multiple-choice' && (
                <div className="mt-2">
                  <div className="text-sm font-medium mb-1">Options:</div>
                  <ul className="list-disc pl-5">
                    {question.options.map((option: string, optIndex: number) => (
                      <li key={optIndex} className={option === question.correctAnswer ? 'text-green-600 font-medium' : ''}>
                        {option} {option === question.correctAnswer && '(Correct)'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          
          <div className="p-4 border rounded-md border-dashed">
            <h3 className="text-lg font-medium mb-4">Add New Question</h3>
            
            <div className="space-y-4">
              <Textarea
                label="Question Text"
                name="text"
                value={currentQuestion.text}
                onChange={handleQuestionChange}
                required
              />
              
              <Select
                label="Question Type"
                name="type"
                value={currentQuestion.type}
                onChange={handleQuestionChange}
                options={[
                  { value: 'multiple-choice', label: 'Multiple Choice' },
                  { value: 'open-ended', label: 'Open Ended' },
                  { value: 'matching', label: 'Matching' },
                  { value: 'file-upload', label: 'File Upload' }
                ]}
              />
              
              {currentQuestion.type === 'multiple-choice' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-centre">
                    <label className="block text-sm font-medium text-grey-700">Options</label>
                    <Button
                      type="button"
                      onClick={addOption}
                      className="text-sm py-1"
                    >
                      Add Option
                    </Button>
                  </div>
                  
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-centre space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1"
                      />
                      
                      <div className="flex items-centre">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={index === currentQuestion.options.indexOf(currentQuestion.correctAnswer)}
                          onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: option }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-grey-300"
                        />
                        <label className="ml-2 text-sm text-grey-700">Correct</label>
                      </div>
                      
                      {currentQuestion.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="pt-2">
                <Button type="button" onClick={addQuestion}>
                  Add Question
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Assessment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
