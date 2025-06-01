'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { SimpleTabs  } from '@/components/ui/tabs';

export default function PreviewPupilVoiceSurveyPage() {
  const router = useRouter();
  const params = useParams();
  const surveyId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [survey, setSurvey] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [responses, setResponses] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`/api/assessment/pupil-voice/${surveyId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch pupil voice survey');
        }
        
        const data = await response.json();
        setSurvey(data);
        
        // If survey is not in draft status, fetch responses
        if (data.status !== 'draft') {
          const responsesResponse = await fetch(`/api/assessment/pupil-voice/${surveyId}/responses`);
          
          if (responsesResponse.ok) {
            const responsesData = await responsesResponse.json();
            setResponses(responsesData);
          }
        }
      } catch (err) {
        console.error('Error fetching pupil voice survey:', err);
        setError('An error occurred while fetching the pupil voice survey');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurvey();
  }, [surveyId]);

  const handlePublishSurvey = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/assessment/pupil-voice/${surveyId}/publish`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish survey');
      }
      
      router.push(`/assessment/pupil-voice/share/${surveyId}`);
    } catch (err) {
      console.error('Error publishing survey:', err);
      setError('An error occurred while publishing the survey');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSurvey = () => {
    router.push(`/assessment/pupil-voice/edit/${surveyId}`);
  };

  const handleTakeSurvey = () => {
    router.push(`/assessment/pupil-voice/take/${surveyId}`);
  };

  const handleViewResults = () => {
    router.push(`/assessment/pupil-voice/results/${surveyId}`);
  };

  const renderPreviewTab = () => {
    if (!survey) {
      return null;
    }
    
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">{survey.title}</h2>
          {survey.description && (
            <p className="text-grey-600 mb-4">{survey.description}</p>
          )}
          
          <div className="space-y-8 mt-6">
            {survey.questions.map((question, index: number) => (
              <div key={question.id} className="border border-grey-200 rounded-md p-4">
                <div className="flex items-start">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-centre justify-centre mr-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium mb-2">{question.text}</h3>
                    
                    {question.type === 'multiple_choice' && (
                      <div className="space-y-2 mt-3">
                        {question.options.map((option: string, optionIndex: number) => (
                          <div key={optionIndex} className="flex items-centre">
                            <input
                              type="radio"
                              name={`question_${question.id}`}
                              id={`option_${question.id}_${optionIndex}`}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300"
                              disabled
                            />
                            <label htmlFor={`option_${question.id}_${optionIndex}`} className="ml-2 block text-sm text-grey-900">
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'likert_scale' && (
                      <div className="mt-3">
                        <div className="flex justify-between items-centre">
                          {question.options.map((option: string, optionIndex: number) => (
                            <div key={optionIndex} className="text-centre">
                              <div className="flex flex-col items-centre">
                                <input
                                  type="radio"
                                  name={`question_${question.id}`}
                                  id={`option_${question.id}_${optionIndex}`}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300"
                                  disabled
                                />
                                <label htmlFor={`option_${question.id}_${optionIndex}`} className="mt-1 block text-xs text-grey-500">
                                  {option}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {question.type === 'emoji_scale' && (
                      <div className="mt-3">
                        <div className="flex justify-between items-centre">
                          {question.options.map((emoji: string, optionIndex: number) => (
                            <div key={optionIndex} className="text-centre">
                              <div className="flex flex-col items-centre">
                                <input
                                  type="radio"
                                  name={`question_${question.id}`}
                                  id={`option_${question.id}_${optionIndex}`}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300"
                                  disabled
                                />
                                <label htmlFor={`option_${question.id}_${optionIndex}`} className="mt-1 block text-2xl">
                                  {emoji}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {question.type === 'yes_no' && (
                      <div className="flex space-x-4 mt-3">
                        <div className="flex items-centre">
                          <input
                            type="radio"
                            name={`question_${question.id}`}
                            id={`option_${question.id}_yes`}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300"
                            disabled
                          />
                          <label htmlFor={`option_${question.id}_yes`} className="ml-2 block text-sm text-grey-900">
                            Yes
                          </label>
                        </div>
                        <div className="flex items-centre">
                          <input
                            type="radio"
                            name={`question_${question.id}`}
                            id={`option_${question.id}_no`}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-grey-300"
                            disabled
                          />
                          <label htmlFor={`option_${question.id}_no`} className="ml-2 block text-sm text-grey-900">
                            No
                          </label>
                        </div>
                      </div>
                    )}
                    
                    {question.type === 'open_ended' && (
                      <div className="mt-3">
                        <textarea
                          className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          rows={3}
                          placeholder="Type your answer here..."
                          disabled
                        />
                      </div>
                    )}
                    
                    {question.required && (
                      <div className="mt-2 text-xs text-red-600">
                        * Required
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsTab = () => {
    if (!survey) {
      return null;
    }
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Survey Settings</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-grey-700">Status</h4>
                <p className="mt-1">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    survey.status === 'draft' 
                      ? 'bg-grey-100 text-grey-800' 
                      : survey.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {survey.status === 'draft' 
                      ? 'Draft' 
                      : survey.status === 'active' 
                      ? 'Active' 
                      : 'Completed'}
                  </span>
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-grey-700">Created</h4>
                <p className="mt-1 text-sm text-grey-600">
                  {new Date(survey.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-grey-700">Last Updated</h4>
                <p className="mt-1 text-sm text-grey-600">
                  {new Date(survey.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-grey-700">Questions</h4>
                <p className="mt-1 text-sm text-grey-600">
                  {survey.questions.length} questions ({survey.questions.filter((q) => q.required).length} required)
                </p>
              </div>
              
              {survey.status !== 'draft' && (
                <div>
                  <h4 className="text-sm font-medium text-grey-700">Responses</h4>
                  <p className="mt-1 text-sm text-grey-600">
                    {responses.length} responses received
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col space-y-2 w-full">
              {survey.status === 'draft' && (
                <>
                  <Button
                    onClick={handlePublishSurvey}
                    className="w-full"
                  >
                    Publish Survey
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleEditSurvey}
                    className="w-full"
                  >
                    Edit Survey
                  </Button>
                </>
              )}
              
              {survey.status === 'active' && (
                <>
                  <Button
                    onClick={handleTakeSurvey}
                    className="w-full"
                  >
                    Take Survey
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleViewResults}
                    className="w-full"
                  >
                    View Results
                  </Button>
                </>
              )}
              
              {survey.status === 'completed' && (
                <Button
                  onClick={handleViewResults}
                  className="w-full"
                >
                  View Results
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-centre justify-between">
          <h1 className="text-2xl font-bold text-grey-900">{survey.title}</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/assessment/pupil-voice')}
          >
            Back to Surveys
          </Button>
        </div>
        {survey.description && (
          <p className="mt-2 text-grey-600">
            {survey.description}
          </p>
        )}
      </div>

      <div className="mb-6">
        <SimpleTabs
          tabs={[
            { id: 'preview', label: 'Preview' },
            { id: 'settings', label: 'Settings' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-4"
        />

        {activeTab === 'preview' && renderPreviewTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
}
