'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { SimpleTabs  } from '@/components/ui/tabs';

export default function PupilVoiceResultsPage() {
  const router = useRouter();
  const params = useParams();
  const surveyId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [survey, setSurvey] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchSurveyAndResponses = async () => {
      try {
        // Fetch survey details
        const surveyResponse = await fetch(`/api/assessment/pupil-voice/${surveyId}`);
        
        if (!surveyResponse.ok) {
          throw new Error('Failed to fetch pupil voice survey');
        }
        
        const surveyData = await surveyResponse.json();
        setSurvey(surveyData);
        
        // Fetch responses
        const responsesResponse = await fetch(`/api/assessment/pupil-voice/${surveyId}/responses`);
        
        if (!responsesResponse.ok) {
          throw new Error('Failed to fetch survey responses');
        }
        
        const responsesData = await responsesResponse.json();
        setResponses(responsesData);
      } catch (err) {
        console.error('Error fetching survey data:', err);
        setError('An error occurred while fetching the survey data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurveyAndResponses();
  }, [surveyId]);

  // Calculate response statistics
  const calculateStats = () => {
    if (!survey || !responses.length) return null;
    
    const stats = {
      totalResponses: responses.length,
      completionRate: 0,
      averageTimeToComplete: 0,
      questionStats: {} as {[key: string]}
    };
    
    // Calculate completion rate and average time
    const completedResponses = responses.filter(r => r.status === 'completed');
    stats.completionRate = (completedResponses.length / responses.length) * 100;
    
    // Calculate average time to complete (if timestamps available)
    const responsesWithDuration = completedResponses.filter(r => r.startedAt && r.completedAt);
    if (responsesWithDuration.length) {
      const totalDuration = responsesWithDuration.reduce((sum, r) => {
        const start = new Date(r.startedAt).getTime();
        const end = new Date(r.completedAt).getTime();
        return sum + (end - start);
      }, 0);
      stats.averageTimeToComplete = totalDuration / responsesWithDuration.length / 1000; // in seconds
    }
    
    // Calculate per-question statistics
    survey.questions.forEach((question) => {
      const questionResponses = responses.map(r => r.answers[question.id]).filter(Boolean);
      
      if (question.type === 'multiple_choice' || question.type === 'likert_scale' || 
          question.type === 'emoji_scale' || question.type === 'yes_no') {
        // For choice-based questions, calculate option frequencies
        const optionCounts: {[key: string]: number} = {};
        
        questionResponses.forEach(response => {
          optionCounts[response] = (optionCounts[response] || 0) + 1;
        });
        
        stats.questionStats[question.id] = {
          responseCount: questionResponses.length,
          optionCounts,
          responseRate: (questionResponses.length / responses.length) * 100
        };
      } else if (question.type === 'open_ended') {
        // For open-ended questions, just count responses
        stats.questionStats[question.id] = {
          responseCount: questionResponses.length,
          responseRate: (questionResponses.length / responses.length) * 100,
          responses: questionResponses
        };
      }
    });
    
    return stats;
  };

  const stats = calculateStats();

  const renderOverviewTab = () => {
    if (!survey || !stats) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Response Summary</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-grey-200">
                <h4 className="text-sm font-medium text-grey-500">Total Responses</h4>
                <p className="text-2xl font-bold mt-1">{stats.totalResponses}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-grey-200">
                <h4 className="text-sm font-medium text-grey-500">Completion Rate</h4>
                <p className="text-2xl font-bold mt-1">{stats.completionRate.toFixed(1)}%</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-grey-200">
                <h4 className="text-sm font-medium text-grey-500">Avg. Time to Complete</h4>
                <p className="text-2xl font-bold mt-1">
                  {stats.averageTimeToComplete ? 
                    `${Math.floor(stats.averageTimeToComplete / 60)}m ${Math.round(stats.averageTimeToComplete % 60)}s` : 
                    'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Question Response Rates</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {survey.questions.map((question, index: number) => {
                const questionStats = stats.questionStats[question.id];
                if (!questionStats) return null;
                
                return (
                  <div key={question.id} className="flex items-centre space-x-2">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full flex items-centre justify-centre flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-centre mb-1">
                        <p className="text-sm font-medium truncate" title={question.text}>
                          {question.text.length > 60 ? `${question.text.substring(0, 60)}...` : question.text}
                        </p>
                        <span className="text-sm text-grey-500">
                          {questionStats.responseRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-grey-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${questionStats.responseRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderQuestionsTab = () => {
    if (!survey || !stats) return null;
    
    return (
      <div className="space-y-6">
        {survey.questions.map((question, index: number) => {
          const questionStats = stats.questionStats[question.id];
          if (!questionStats) return null;
          
          return (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full flex items-centre justify-centre mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{question.text}</h3>
                    <p className="text-sm text-grey-500 mt-1">
                      {questionStats.responseCount} responses ({questionStats.responseRate.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(question.type === 'multiple_choice' || question.type === 'likert_scale' || 
                 question.type === 'emoji_scale' || question.type === 'yes_no') && (
                  <div className="space-y-3">
                    {Object.entries(questionStats.optionCounts).sort((a, b) => b[1] - a[1]).map(([option, count]: [string, any]) => {
                      const percentage = (count / questionStats.responseCount) * 100;
                      
                      return (
                        <div key={option}>
                          <div className="flex justify-between items-centre mb-1">
                            <span className="text-sm font-medium">
                              {question.type === 'emoji_scale' ? (
                                <span className="text-xl">{option}</span>
                              ) : (
                                option
                              )}
                            </span>
                            <span className="text-sm text-grey-500">
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-grey-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {question.type === 'open_ended' && (
                  <div className="space-y-3">
                    <p className="text-sm text-grey-500 mb-2">
                      {questionStats.responseCount} text responses
                    </p>
                    
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {questionStats.responses.map((response: string, i: number) => (
                        <div key={i} className="p-3 bg-grey-50 rounded-md border border-grey-200">
                          <p className="text-sm">{response}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderResponsesTab = () => {
    if (!survey || !responses.length) return null;
    
    return (
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-grey-200">
            <thead className="bg-grey-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Respondent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Completion Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-grey-200">
              {responses.map((response, index) => {
                const startTime = response.startedAt ? new Date(response.startedAt) : null;
                const endTime = response.completedAt ? new Date(response.completedAt) : null;
                const completionTime = startTime && endTime ? 
                  (endTime.getTime() - startTime.getTime()) / 1000 : null;
                
                return (
                  <tr key={response.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-grey-900">
                      {response.respondentId || response.respondentName || `Anonymous ${index + 1}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-500">
                      {response.completedAt ? new Date(response.completedAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        response.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {response.status === 'completed' ? 'Completed' : 'Partial'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-500">
                      {completionTime ? 
                        `${Math.floor(completionTime / 60)}m ${Math.round(completionTime % 60)}s` : 
                        'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-500">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/assessment/pupil-voice/response/${response.id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-centre items-centre min-h-screen">
        <Spinner size="large" />
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

  if (!responses.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-centre justify-between">
            <h1 className="text-2xl font-bold text-grey-900">{survey.title} - Results</h1>
            <Button
              variant="outline"
              onClick={() => router.push('/assessment/pupil-voice')}
            >
              Back to Surveys
            </Button>
          </div>
        </div>
        
        <Alert type="info" className="mb-6">
          No responses have been collected for this survey yet.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-centre justify-between">
          <h1 className="text-2xl font-bold text-grey-900">{survey.title} - Results</h1>
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
            { id: 'overview', label: 'Overview' },
            { id: 'questions', label: 'Questions' },
            { id: 'responses', label: 'Individual Responses' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-4"
        />

        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'questions' && renderQuestionsTab()}
        {activeTab === 'responses' && renderResponsesTab()}
      </div>
    </div>
  );
}
