'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';
import { SimpleTabs  } from '@/components/ui/tabs';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { Dropdown } from '@/components/ui/dropdown';
import { Modal } from '@/components/ui/modal';
import { useRouter } from 'next/navigation';

// Define assessment types
const assessmentTypes = [
  { id: 'quiz', name: 'Quiz', description: 'Short assessment with multiple choice questions' },
  { id: 'test', name: 'Test', description: 'Comprehensive assessment with various question types' },
  { id: 'survey', name: 'Survey', description: 'Collect feedback and opinions' },
  { id: 'formative', name: 'Formative Assessment', description: 'Monitor student learning during instruction' },
  { id: 'summative', name: 'Summative Assessment', description: 'Evaluate student learning at the end of a unit' },
  { id: 'diagnostic', name: 'Diagnostic Assessment', description: 'Identify strengths and areas for improvement' },
];

// Define curriculum subjects
const curriculumSubjects = [
  { id: 'english', name: 'English' },
  { id: 'maths', name: 'Mathematics' },
  { id: 'science', name: 'Science' },
  { id: 'history', name: 'History' },
  { id: 'geography', name: 'Geography' },
  { id: 'art', name: 'Art & Design' },
  { id: 'music', name: 'Music' },
  { id: 'pe', name: 'Physical Education' },
  { id: 'computing', name: 'Computing' },
  { id: 'languages', name: 'Modern Foreign Languages' },
];

// Define key stages
const keyStages = [
  { id: 'eyfs', name: 'Early Years Foundation Stage' },
  { id: 'ks1', name: 'Key Stage 1' },
  { id: 'ks2', name: 'Key Stage 2' },
  { id: 'ks3', name: 'Key Stage 3' },
  { id: 'ks4', name: 'Key Stage 4' },
  { id: 'ks5', name: 'Key Stage 5' },
];

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  
  // Form state
  const [assessmentData, setAssessmentData] = useState({
    title: '',
    description: '',
    type: '',
    subject: '',
    keyStage: '',
    timeLimit: 0,
    passingScore: 70,
    showResults: true,
    randomizeQuestions: false,
    allowRetakes: true,
  });
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    description: '',
    type: '',
    subject: '',
    keyStage: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setAssessmentData({
        ...assessmentData,
        [name]: checked,
      });
    } else if (type === 'number') {
      setAssessmentData({
        ...assessmentData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setAssessmentData({
        ...assessmentData,
        [name]: value,
      });
    }
    
    // Clear validation error when field is edited
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };
  
  const validateForm = () => {
    const errors = {
      title: '',
      description: '',
      type: '',
      subject: '',
      keyStage: '',
    };
    
    if (!assessmentData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!assessmentData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!assessmentData.type) {
      errors.type = 'Assessment type is required';
    }
    
    if (!assessmentData.subject) {
      errors.subject = 'Subject is required';
    }
    
    if (!assessmentData.keyStage) {
      errors.keyStage = 'Key stage is required';
    }
    
    setValidationErrors(errors);
    return !Object.values(errors).some(error => error);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        // Redirect to the assessment editor after a short delay
        setTimeout(() => {
          router.push(`/assessment/edit/${data.id}`);
        }, 1500);
      } else {
        setError(data.message || 'An error occurred while creating the assessment');
      }
    } catch (err) {
      setError('An error occurred while creating the assessment');
      console.error('Error creating assessment:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Please enter a prompt for the AI');
      return;
    }
    
    setAiLoading(true);
    setAiError('');
    
    try {
      const response = await fetch('/api/ai/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create an educational assessment based on the following description: ${aiPrompt}. 
                  Include a title, description, appropriate type, subject, key stage, and other relevant details.
                  Format the response as JSON that can be directly used in a form.`,
          max_tokens: 1000,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        try {
          const assessmentSuggestion = JSON.parse(data.text);
          setAssessmentData({
            ...assessmentData,
            ...assessmentSuggestion,
          });
          setShowAIModal(false);
        } catch (parseErr) {
          setAiError('Could not parse AI response. Please try a different prompt.');
          console.error('Error parsing AI response:', parseErr);
        }
      } else {
        setAiError(data.message || 'An error occurred while generating the assessment');
      }
    } catch (err) {
      setAiError('An error occurred while generating the assessment');
      console.error('Error generating assessment with AI:', err);
    } finally {
      setAiLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-grey-900 mb-2">Create New Assessment</h1>
        <p className="text-grey-600">
          Design a new assessment for your students. Fill in the details below to get started.
        </p>
      </div>
      
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert type="success" className="mb-6">
          Assessment created successfully! Redirecting to editor...
        </Alert>
      )}
      
      <div className="flex justify-end mb-6">
        <Button
          onClick={() => setShowAIModal(true)}
          variant="outline"
          className="flex items-centre gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate with AI
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <SimpleTabs
            tabs={[
              { id: 'details', label: 'Assessment Details' },
              { id: 'settings', label: 'Settings' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-6"
          />
          
          <form onSubmit={handleSubmit}>
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-grey-700 mb-1">
                    Assessment Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={assessmentData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a title for your assessment"
                    className={validationErrors.title ? 'border-red-500' : ''}
                  />
                  {validationErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-grey-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={assessmentData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a description of the assessment"
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.description ? 'border-red-500' : 'border-grey-300'
                    }`}
                  />
                  {validationErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-grey-700 mb-1">
                      Assessment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={assessmentData.type}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.type ? 'border-red-500' : 'border-grey-300'
                      }`}
                    >
                      <option value="">Select an assessment type</option>
                      {assessmentTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    {validationErrors.type && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.type}</p>
                    )}
                    {assessmentData.type && (
                      <p className="mt-1 text-sm text-grey-500">
                        {assessmentTypes.find(t => t.id === assessmentData.type)?.description}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-grey-700 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={assessmentData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.subject ? 'border-red-500' : 'border-grey-300'
                      }`}
                    >
                      <option value="">Select a subject</option>
                      {curriculumSubjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                    {validationErrors.subject && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.subject}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="keyStage" className="block text-sm font-medium text-grey-700 mb-1">
                      Key Stage <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="keyStage"
                      name="keyStage"
                      value={assessmentData.keyStage}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.keyStage ? 'border-red-500' : 'border-grey-300'
                      }`}
                    >
                      <option value="">Select a key stage</option>
                      {keyStages.map(stage => (
                        <option key={stage.id} value={stage.id}>{stage.name}</option>
                      ))}
                    </select>
                    {validationErrors.keyStage && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.keyStage}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="timeLimit" className="block text-sm font-medium text-grey-700 mb-1">
                    Time Limit (minutes, 0 for no limit)
                  </label>
                  <Input
                    id="timeLimit"
                    name="timeLimit"
                    type="number"
                    min="0"
                    value={assessmentData.timeLimit}
                    onChange={handleInputChange}
                    placeholder="Enter time limit in minutes"
                  />
                </div>
                
                <div>
                  <label htmlFor="passingScore" className="block text-sm font-medium text-grey-700 mb-1">
                    Passing Score (%)
                  </label>
                  <Input
                    id="passingScore"
                    name="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    value={assessmentData.passingScore}
                    onChange={handleInputChange}
                    placeholder="Enter passing score percentage"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-centre">
                    <input
                      id="showResults"
                      name="showResults"
                      type="checkbox"
                      checked={assessmentData.showResults}
                      onChange={(e) => setAssessmentData({
                        ...assessmentData,
                        showResults: e.target.checked,
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-grey-300 rounded"
                    />
                    <label htmlFor="showResults" className="ml-2 block text-sm text-grey-700">
                      Show results to students immediately
                    </label>
                  </div>
                  
                  <div className="flex items-centre">
                    <input
                      id="randomizeQuestions"
                      name="randomizeQuestions"
                      type="checkbox"
                      checked={assessmentData.randomizeQuestions}
                      onChange={(e) => setAssessmentData({
                        ...assessmentData,
                        randomizeQuestions: e.target.checked,
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-grey-300 rounded"
                    />
                    <label htmlFor="randomizeQuestions" className="ml-2 block text-sm text-grey-700">
                      Randomize question order
                    </label>
                  </div>
                  
                  <div className="flex items-centre">
                    <input
                      id="allowRetakes"
                      name="allowRetakes"
                      type="checkbox"
                      checked={assessmentData.allowRetakes}
                      onChange={(e) => setAssessmentData({
                        ...assessmentData,
                        allowRetakes: e.target.checked,
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-grey-300 rounded"
                    />
                    <label htmlFor="allowRetakes" className="ml-2 block text-sm text-grey-700">
                      Allow students to retake assessment
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              
              {activeTab === 'details' ? (
                <Button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                >
                  Next: Settings
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" className="mr-2" /> : null}
                  Create Assessment
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* AI Generation Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="Generate Assessment with AI"
      >
        <div className="space-y-4">
          <p className="text-grey-700">
            Describe the assessment you want to create, and our AI will generate a starting point for you.
            Be specific about the subject, key stage, and type of assessment you need.
          </p>
          
          {aiError && (
            <Alert type="error">
              {aiError}
            </Alert>
          )}
          
          <div>
            <label htmlFor="aiPrompt" className="block text-sm font-medium text-grey-700 mb-1">
              Your Description
            </label>
            <textarea
              id="aiPrompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="E.g., Create a Year 6 Mathematics quiz about fractions and decimals for Key Stage 2 students"
              rows={4}
              className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAIModal(false)}
              disabled={aiLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAIGenerate}
              disabled={aiLoading}
            >
              {aiLoading ? <Spinner size="sm" className="mr-2" /> : null}
              Generate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
