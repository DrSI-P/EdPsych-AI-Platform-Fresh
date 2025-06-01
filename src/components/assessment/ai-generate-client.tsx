'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { SimpleTabs  } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';

interface AIAssessmentGeneratorProps {
  // Props can be added as needed
}

export default function AIAssessmentGeneratorClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('prompt');
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState('');
  const [keyStage, setKeyStage] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [assessmentType, setAssessmentType] = useState('quiz');
  const [generatedAssessment, setGeneratedAssessment] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const subjects = [
    { value: 'english', label: 'English' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
    { value: 'art', label: 'Art and Design' },
    { value: 'music', label: 'Music' },
    { value: 'pe', label: 'Physical Education' },
    { value: 'computing', label: 'Computing' },
    { value: 'languages', label: 'Modern Foreign Languages' },
  ];

  const keyStages = [
    { value: 'eyfs', label: 'Early Years Foundation Stage' },
    { value: 'ks1', label: 'Key Stage 1' },
    { value: 'ks2', label: 'Key Stage 2' },
    { value: 'ks3', label: 'Key Stage 3' },
    { value: 'ks4', label: 'Key Stage 4' },
    { value: 'ks5', label: 'Key Stage 5' },
  ];

  const assessmentTypes = [
    { value: 'quiz', label: 'Quiz' },
    { value: 'test', label: 'Test' },
    { value: 'exam', label: 'Exam' },
    { value: 'homework', label: 'Homework' },
    { value: 'formative', label: 'Formative Assessment' },
    { value: 'summative', label: 'Summative Assessment' },
  ];

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'open-ended', label: 'Open Ended' },
    { value: 'matching', label: 'Matching' },
    { value: 'file-upload', label: 'File Upload' },
  ];

  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(['multiple-choice', 'open-ended']);

  const handleGenerateAssessment = async () => {
    setGenerating(true);
    setError('');

    try {
      // Prepare the request payload
      const payload = {
        prompt,
        subject,
        keyStage,
        questionCount,
        assessmentType,
        questionTypes: selectedQuestionTypes,
      };

      // Call the AI service to generate the assessment
      const response = await fetch('/api/assessment/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate assessment');
      }

      const data = await response.json();
      setGeneratedAssessment(data);
      setActiveTab('preview');
    } catch (err) {
      console.error('Error generating assessment:', err);
      setError(err.message || 'An error occurred while generating the assessment');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveAssessment = async () => {
    setLoading(true);
    setError('');

    try {
      // Save the generated assessment
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generatedAssessment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save assessment');
      }

      const data = await response.json();
      
      // Redirect to the assessment edit page
      router.push(`/assessment/edit/${data.id}`);
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError(err.message || 'An error occurred while saving the assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleQuestionType = (type) => {
    if (selectedQuestionTypes.includes(type)) {
      setSelectedQuestionTypes(selectedQuestionTypes.filter(t => t !== type));
    } else {
      setSelectedQuestionTypes([...selectedQuestionTypes, type]);
    }
  };

  const renderPromptTab = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">AI Assessment Generator</h2>
          <p className="text-grey-600">
            Use AI to generate assessments based on your requirements. You can provide a detailed prompt or use the guided options below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Assessment Details</h3>
            </CardHeader>
            <CardContent>
              <Form className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-grey-700">Subject</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-grey-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subj) => (
                      <option key={subj.value} value={subj.value}>
                        {subj.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-grey-700">Key Stage</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-grey-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={keyStage}
                    onChange={(e) => setKeyStage(e.target.value)}
                  >
                    <option value="">Select a key stage</option>
                    {keyStages.map((ks) => (
                      <option key={ks.value} value={ks.value}>
                        {ks.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-grey-700">Assessment Type</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-grey-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={assessmentType}
                    onChange={(e) => setAssessmentType(e.target.value)}
                  >
                    {assessmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-grey-700">Number of Questions</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-grey-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
                  />
                </div>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Question Types</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-grey-600">
                  Select the types of questions you want to include in your assessment.
                </p>
                
                <div className="space-y-2">
                  {questionTypes.map((type) => (
                    <div key={type.value} className="flex items-centre">
                      <input
                        id={`question-type-${type.value}`}
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300 rounded"
                        checked={selectedQuestionTypes.includes(type.value)}
                        onChange={() => handleToggleQuestionType(type.value)}
                      />
                      <label htmlFor={`question-type-${type.value}`} className="ml-2 block text-sm text-grey-900">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
                
                {selectedQuestionTypes.length === 0 && (
                  <p className="text-sm text-red-500">
                    Please select at least one question type.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Detailed Prompt (Optional)</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-grey-600 mb-4">
              Provide additional details about the assessment you want to generate. The more specific you are, the better the results will be.
            </p>
            <textarea
              className="w-full h-32 p-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="E.g., Create an assessment about photosynthesis for Year 8 students. Include questions about the process, required materials, and importance to plant life."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => router.push('/assessment')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerateAssessment}
            disabled={generating || !subject || !keyStage || selectedQuestionTypes.length === 0}
          >
            {generating ? <Spinner size="sm" /> : 'Generate Assessment'}
          </Button>
        </div>

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}
      </div>
    );
  };

  const renderPreviewTab = () => {
    if (!generatedAssessment) {
      return (
        <div className="text-centre py-12">
          <p className="text-grey-500">
            Generate an assessment to preview it here.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">{generatedAssessment.title}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-grey-600 mb-4">{generatedAssessment.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-grey-500">Subject</p>
                <p className="text-base">{subjects.find(s => s.value === generatedAssessment.subject)?.label || generatedAssessment.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-grey-500">Key Stage</p>
                <p className="text-base">{keyStages.find(k => k.value === generatedAssessment.keyStage)?.label || generatedAssessment.keyStage}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-grey-500">Assessment Type</p>
                <p className="text-base">{assessmentTypes.find(t => t.value === generatedAssessment.type)?.label || generatedAssessment.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-grey-500">Questions</p>
                <p className="text-base">{generatedAssessment.questions.length}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-lg font-medium">Questions</h4>
              
              {generatedAssessment.questions.map((question, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between mb-2">
                    <h5 className="font-medium">Question {index + 1}</h5>
                    <span className="text-sm text-grey-500">
                      {questionTypes.find(t => t.value === question.type)?.label || question.type}
                    </span>
                  </div>
                  
                  <p className="mb-2">{question.content}</p>
                  
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="ml-4 mt-2 space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-centre">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            disabled
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300"
                          />
                          <label className="ml-2 block text-sm text-grey-900">
                            {option.text}
                            {option.isCorrect && previewMode && (
                              <span className="ml-2 text-green-600">(Correct)</span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'matching' && question.pairs && (
                    <div className="ml-4 mt-2 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-sm mb-2">Items</p>
                          {question.pairs.map((pair, pairIndex) => (
                            <div key={pairIndex} className="p-2 border rounded mb-2">
                              {pair.left}
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="font-medium text-sm mb-2">Matches</p>
                          {question.pairs.map((pair, pairIndex) => (
                            <div key={pairIndex} className="p-2 border rounded mb-2">
                              {pair.right}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {previewMode && question.answer && (
                    <div className="mt-2 p-2 bg-grey-50 rounded">
                      <p className="text-sm font-medium text-grey-700">Expected Answer:</p>
                      <p className="text-sm">{question.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Hide Answers' : 'Show Answers'}
          </Button>
          
          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={() => setActiveTab('prompt')}
            >
              Modify
            </Button>
            <Button
              onClick={handleSaveAssessment}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Save Assessment'}
            </Button>
          </div>
        </div>
        
        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-centre justify-between">
          <h1 className="text-2xl font-bold text-grey-900">AI Assessment Generator</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/assessment')}
          >
            Back to Assessments
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <SimpleTabs
            tabs={[
              { id: 'prompt', label: 'Create' },
              { id: 'preview', label: 'Preview' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-6"
          />

          {activeTab === 'prompt' && renderPromptTab()}
          {activeTab === 'preview' && renderPreviewTab()}
        </CardContent>
      </Card>
    </div>
  );
}