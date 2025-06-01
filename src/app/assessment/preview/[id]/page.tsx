'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { SimpleTabs } from '@/components/ui/tabs';

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

export default function AssessmentPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessment/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch assessment');
        }
        
        const data = await response.json();
        setAssessment(data);
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
  }, [params.id]);

  const handlePublish = async () => {
    if (!assessment) return;
    
    setPublishing(true);
    setError('');
    
    try {
      const response = await fetch(`/api/assessment/${assessment.id}/publish`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish assessment');
      }
      
      setPublishSuccess(true);
      
      // Update local state
      setAssessment({
        ...assessment,
        status: 'published'
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/assessment');
      }, 2000);
    } catch (err) {
      console.error('Error publishing assessment:', err);
      setError('An error occurred while publishing the assessment');
    } finally {
      setPublishing(false);
    }
  };

  const renderQuestionPreview = (question: Question, index: number) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="mb-6 p-4 border rounded-md bg-white">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-medium">Question {index + 1}</h3>
              <span className="text-sm text-grey-500">{question.points} {question.points === 1 ? 'point' : 'points'}</span>
            </div>
            <p className="mb-4">{question.content}</p>
            <div className="space-y-2">
              {question.options?.map((option, i) => (
                <div key={i} className="flex items-centre">
                  <input
                    type="radio"
                    id={`q${index}-option${i}`}
                    name={`question-${index}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-grey-300"
                    disabled
                  />
                  <label htmlFor={`q${index}-option${i}`} className="ml-2 block text-sm text-grey-700">
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'open-ended':
        return (
          <div className="mb-6 p-4 border rounded-md bg-white">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-medium">Question {index + 1}</h3>
              <span className="text-sm text-grey-500">{question.points} {question.points === 1 ? 'point' : 'points'}</span>
            </div>
            <p className="mb-4">{question.content}</p>
            {question.wordLimit ? (
              <p className="text-sm text-grey-500 mb-2">Word limit: {question.wordLimit} words</p>
            ) : null}
            <textarea
              className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Student answer will appear here"
              disabled
            ></textarea>
          </div>
        );
        
      case 'matching':
        return (
          <div className="mb-6 p-4 border rounded-md bg-white">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-medium">Question {index + 1}</h3>
              <span className="text-sm text-grey-500">{question.points} {question.points === 1 ? 'point' : 'points'}</span>
            </div>
            <p className="mb-4">{question.content}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {question.items?.map((item, i) => (
                  <div key={i} className="p-2 border rounded bg-grey-50">
                    {item.left}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {question.items?.map((item, i) => (
                  <div key={i} className="p-2 border rounded bg-grey-50">
                    {item.right}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'file-upload':
        return (
          <div className="mb-6 p-4 border rounded-md bg-white">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-medium">Question {index + 1}</h3>
              <span className="text-sm text-grey-500">{question.points} {question.points === 1 ? 'point' : 'points'}</span>
            </div>
            <p className="mb-4">{question.content}</p>
            <div className="p-4 border-2 border-dashed rounded-md text-centre">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-grey-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-1 text-sm text-grey-600">
                Upload a file
              </p>
              <p className="mt-1 text-xs text-grey-500">
                Allowed file types: {question.allowedFileTypes?.map(type => `.${type}`).join(', ')}
              </p>
              <p className="mt-1 text-xs text-grey-500">
                Maximum file size: {question.maxFileSize} MB
              </p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="mb-6 p-4 border rounded-md bg-white">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-medium">Question {index + 1}</h3>
              <span className="text-sm text-grey-500">{question.points} {question.points === 1 ? 'point' : 'points'}</span>
            </div>
            <p>{question.content}</p>
          </div>
        );
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-centre justify-between">
          <h1 className="text-3xl font-bold text-grey-900">{assessment.title}</h1>
          <div className="flex items-centre space-x-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              assessment.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {assessment.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
        <p className="mt-2 text-grey-600">{assessment.description}</p>
      </div>

      {publishSuccess && (
        <Alert type="success" className="mb-6">
          Assessment published successfully! Redirecting...
        </Alert>
      )}

      <Card className="mb-6">
        <CardContent className="p-6">
          <SimpleTabs
            tabs={[
              { id: 'preview', label: 'Preview' },
              { id: 'settings', label: 'Settings' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-6"
          />

          {activeTab === 'preview' && (
            <div>
              <div className="bg-grey-50 p-4 rounded-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-grey-500">Subject</p>
                    <p className="text-base font-medium text-grey-900 capitalize">{assessment.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Key Stage</p>
                    <p className="text-base font-medium text-grey-900 capitalize">
                      {assessment.keyStage === 'eyfs' ? 'Early Years Foundation Stage' :
                       assessment.keyStage === 'ks1' ? 'Key Stage 1' :
                       assessment.keyStage === 'ks2' ? 'Key Stage 2' :
                       assessment.keyStage === 'ks3' ? 'Key Stage 3' :
                       assessment.keyStage === 'ks4' ? 'Key Stage 4' :
                       assessment.keyStage === 'ks5' ? 'Key Stage 5' : assessment.keyStage}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Assessment Type</p>
                    <p className="text-base font-medium text-grey-900 capitalize">{assessment.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Time Limit</p>
                    <p className="text-base font-medium text-grey-900">
                      {assessment.timeLimit > 0 ? `${assessment.timeLimit} minutes` : 'No time limit'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Passing Score</p>
                    <p className="text-base font-medium text-grey-900">{assessment.passingScore}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-grey-500">Total Questions</p>
                    <p className="text-base font-medium text-grey-900">{assessment.questions.length}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Questions</h2>
                {assessment.questions.length === 0 ? (
                  <div className="text-centre py-8 bg-grey-50 rounded-md">
                    <p className="text-grey-500">No questions have been added to this assessment yet.</p>
                    <Button 
                      className="mt-4"
                      onClick={() => router.push(`/assessment/edit/${assessment.id}`)}
                    >
                      Add Questions
                    </Button>
                  </div>
                ) : (
                  <div>
                    {assessment.questions.map((question, index) => (
                      renderQuestionPreview(question, index)
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Assessment Settings</h3>
                  <div className="space-y-4 bg-grey-50 p-4 rounded-md">
                    <div className="flex items-centre">
                      <div className={`h-5 w-5 rounded-full flex items-centre justify-centre ${assessment.showResults ? 'bg-green-500' : 'bg-grey-300'}`}>
                        {assessment.showResults && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="ml-2 text-sm text-grey-700">Show results to students immediately</span>
                    </div>
                    <div className="flex items-centre">
                      <div className={`h-5 w-5 rounded-full flex items-centre justify-centre ${assessment.randomizeQuestions ? 'bg-green-500' : 'bg-grey-300'}`}>
                        {assessment.randomizeQuestions && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="ml-2 text-sm text-grey-700">Randomize question order</span>
                    </div>
                    <div className="flex items-centre">
                      <div className={`h-5 w-5 rounded-full flex items-centre justify-centre ${assessment.allowRetakes ? 'bg-green-500' : 'bg-grey-300'}`}>
                        {assessment.allowRetakes && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="ml-2 text-sm text-grey-700">Allow students to retake assessment</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Actions</h3>
                  <div className="space-y-4">
                    <Button
                      onClick={() => router.push(`/assessment/edit/${assessment.id}`)}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Assessment
                    </Button>
                    
                    {assessment.status !== 'published' && (
                      <Button
                        onClick={handlePublish}
                        disabled={publishing || assessment.questions.length === 0}
                        className="w-full justify-start"
                      >
                        {publishing ? (
                          <>
                            <Spinner size="sm" className="mr-2" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Publish Assessment
                          </>
                        )}
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => router.push('/assessment')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Assessments
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
