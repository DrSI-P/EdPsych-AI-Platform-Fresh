'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { SimpleTabs  } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';

// Dynamically import chart components to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Question {
  id: string;
  type: string;
  content: string;
  points: number;
  order: number;
}

interface Answer {
  id: string;
  questionId: string;
  content;
  isCorrect: boolean | null;
  feedback: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Response {
  id: string;
  userId: string;
  assessmentId: string;
  score: number | null;
  feedback: string | null;
  startedAt: string;
  completedAt: string;
  user: User;
  answers: any[];
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: string;
  subject: string;
  keyStage: string;
  passingScore: number;
  questions: any[];
  responses: any[];
}

export default function AssessmentResultsPage() {
  const router = useRouter();
  const params = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [responseDetails, setResponseDetails] = useState<Response | null>(null);
  const [responseLoading, setResponseLoading] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessment/${params.id}/results`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch assessment results');
        }
        
        const data = await response.json();
        setAssessment(data);
      } catch (err) {
        console.error('Error fetching assessment results:', err);
        setError('An error occurred while fetching the assessment results');
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchAssessment();
    }
  }, [params.id]);

  useEffect(() => {
    const fetchResponseDetails = async () => {
      if (!selectedResponse) return;
      
      setResponseLoading(true);
      
      try {
        const response = await fetch(`/api/assessment/response/${selectedResponse}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch response details');
        }
        
        const data = await response.json();
        setResponseDetails(data);
      } catch (err) {
        console.error('Error fetching response details:', err);
        setError('An error occurred while fetching the response details');
      } finally {
        setResponseLoading(false);
      }
    };
    
    if (selectedResponse) {
      fetchResponseDetails();
    } else {
      setResponseDetails(null);
    }
  }, [selectedResponse]);

  const calculateStats = () => {
    if (!assessment || !assessment.responses || assessment.responses.length === 0) {
      return {
        totalResponses: 0,
        averageScore: 0,
        passingRate: 0,
        highestScore: 0,
        lowestScore: 0,
        medianScore: 0,
        scoreDistribution: [] as number[],
        questionSuccessRates: [] as { question: string; rate: number }[]
      };
    }
    
    const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    const scores = assessment.responses.map(r => r.score || 0);
    
    // Sort scores for median and min/max
    const sortedScores = [...scores].sort((a, b) => a - b);
    
    // Calculate median
    const mid = Math.floor(sortedScores.length / 2);
    const median = sortedScores.length % 2 === 0
      ? (sortedScores[mid - 1] + sortedScores[mid]) / 2
      : sortedScores[mid];
    
    // Calculate passing rate
    const passingThreshold = (assessment.passingScore / 100) * totalPoints;
    const passingCount = scores.filter(score => score >= passingThreshold).length;
    
    // Calculate score distribution (0-10%, 11-20%, etc.)
    const distribution = Array(10).fill(0);
    scores.forEach(score => {
      const percentage = (score / totalPoints) * 100;
      const bucket = Math.min(Math.floor(percentage / 10), 9);
      distribution[bucket]++;
    });
    
    // Calculate question success rates
    const questionSuccessRates = assessment.questions.map(question => {
      const correctCount = assessment.responses.reduce((count, response) => {
        const answer = response.answers.find(a => a.questionId === question.id);
        return count + (answer && answer.isCorrect === true ? 1 : 0);
      }, 0);
      
      return {
        question: `Q${question.order + 1}`,
        rate: (correctCount / assessment.responses.length) * 100
      };
    });
    
    return {
      totalResponses: assessment.responses.length,
      averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      passingRate: (passingCount / assessment.responses.length) * 100,
      highestScore: sortedScores[sortedScores.length - 1],
      lowestScore: sortedScores[0],
      medianScore: median,
      scoreDistribution: distribution,
      questionSuccessRates
    };
  };

  const stats = calculateStats();

  const renderOverviewTab = () => {
    if (!assessment) return null;
    
    const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Total Responses</h3>
              <p className="text-3xl font-bold">{stats.totalResponses}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Average Score</h3>
              <p className="text-3xl font-bold">
                {stats.averageScore.toFixed(1)}/{totalPoints} ({((stats.averageScore / totalPoints) * 100).toFixed(1)}%)
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Passing Rate</h3>
              <p className="text-3xl font-bold">{stats.passingRate.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Score Distribution</h3>
            </CardHeader>
            <CardContent>
              {typeof window !== 'undefined' && (
                <Chart
                  options={{
                    chart: {
                      type: 'bar',
                      toolbar: {
                        show: false
                      }
                    },
                    xaxis: {
                      categories: [
                        '0-10%', '11-20%', '21-30%', '31-40%', '41-50%',
                        '51-60%', '61-70%', '71-80%', '81-90%', '91-100%'
                      ]
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        horizontal: false,
                      }
                    },
                    dataLabels: {
                      enabled: false
                    },
                    colors: ['#4F46E5']
                  }}
                  series={[
                    {
                      name: 'Students',
                      data: stats.scoreDistribution
                    }
                  ]}
                  type="bar"
                  height={300}
                />
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Question Success Rates</h3>
            </CardHeader>
            <CardContent>
              {typeof window !== 'undefined' && (
                <Chart
                  options={{
                    chart: {
                      type: 'bar',
                      toolbar: {
                        show: false
                      }
                    },
                    xaxis: {
                      categories: stats.questionSuccessRates.map(q => q.question)
                    },
                    yaxis: {
                      max: 100,
                      labels: {
                        formatter: (value) => `${value.toFixed(0)}%`
                      }
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        horizontal: false,
                      }
                    },
                    dataLabels: {
                      enabled: false
                    },
                    colors: ['#10B981']
                  }}
                  series={[
                    {
                      name: 'Success Rate',
                      data: stats.questionSuccessRates.map(q => q.rate)
                    }
                  ]}
                  type="bar"
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Additional Statistics</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-grey-500">Highest Score</p>
                <p className="text-xl font-medium">
                  {stats.highestScore}/{totalPoints} ({((stats.highestScore / totalPoints) * 100).toFixed(1)}%)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-grey-500">Lowest Score</p>
                <p className="text-xl font-medium">
                  {stats.lowestScore}/{totalPoints} ({((stats.lowestScore / totalPoints) * 100).toFixed(1)}%)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-grey-500">Median Score</p>
                <p className="text-xl font-medium">
                  {stats.medianScore}/{totalPoints} ({((stats.medianScore / totalPoints) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button
            onClick={() => {
              // This would generate a PDF report in a real implementation
              alert('Report generation would be implemented here');
            }}
          >
            Generate Report
          </Button>
        </div>
      </div>
    );
  };

  const renderResponsesTab = () => {
    if (!assessment) return null;
    
    const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    
    return (
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-grey-200">
            <thead className="bg-grey-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-grey-200">
              {assessment.responses.map((response) => {
                const score = response.score || 0;
                const percentage = (score / totalPoints) * 100;
                const isPassing = percentage >= assessment.passingScore;
                
                return (
                  <tr key={response.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-grey-900">{response.user.name}</div>
                      <div className="text-sm text-grey-500">{response.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-grey-900">
                        {new Date(response.completedAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-grey-500">
                        {new Date(response.completedAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-grey-900">
                        {score}/{totalPoints} ({percentage.toFixed(1)}%)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        isPassing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isPassing ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedResponse(response.id)}
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
        
        {selectedResponse && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-centre">
                  <h3 className="text-lg font-medium">Response Details</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedResponse(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {responseLoading ? (
                  <div className="flex justify-centre py-8">
                    <Spinner size="large" />
                  </div>
                ) : responseDetails ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-grey-50 p-4 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-grey-500">Student</p>
                        <p className="text-base font-medium text-grey-900">{responseDetails.user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-grey-500">Submitted</p>
                        <p className="text-base font-medium text-grey-900">
                          {new Date(responseDetails.completedAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-grey-500">Score</p>
                        <p className="text-base font-medium text-grey-900">
                          {responseDetails.score}/{totalPoints} ({((responseDetails.score || 0) / totalPoints * 100).toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                    
                    {responseDetails.feedback && (
                      <div className="bg-blue-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-blue-800 mb-1">Overall Feedback</p>
                        <p className="text-sm text-blue-900">{responseDetails.feedback}</p>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <h4 className="text-md font-medium">Question Responses</h4>
                      
                      {assessment.questions.map((question, index) => {
                        const answer = responseDetails.answers.find(a => a.questionId === question.id);
                        
                        return (
                          <div key={question.id} className="border rounded-md p-4">
                            <div className="flex justify-between mb-2">
                              <h5 className="font-medium">Question {index + 1}</h5>
                              <div className="flex items-centre">
                                {answer?.isCorrect === true && (
                                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Correct
                                  </span>
                                )}
                                {answer?.isCorrect === false && (
                                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                    Incorrect
                                  </span>
                                )}
                                {answer?.isCorrect === null && (
                                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Manually Graded
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <p className="mb-2">{question.content}</p>
                            
                            {answer && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-grey-500 mb-1">Student's Answer:</p>
                                <div className="p-2 bg-grey-50 rounded-md text-sm">
                                  {typeof answer.content === 'string' ? (
                                    answer.content
                                  ) : (
                                    <pre className="whitespace-pre-wrap">{JSON.stringify(answer.content, null, 2)}</pre>
                                  )}
                                </div>
                                
                                {answer.feedback && (
                                  <div className="mt-2">
                                    <p className="text-sm font-medium text-grey-500 mb-1">Feedback:</p>
                                    <p className="text-sm p-2 bg-blue-50 rounded-md">{answer.feedback}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/assessment/grade/${responseDetails.id}`)}
                      >
                        Grade Response
                      </Button>
                      <Button
                        onClick={() => {
                          // This would generate a PDF report in a real implementation
                          alert('Individual report generation would be implemented here');
                        }}
                      >
                        Generate Report
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-grey-500">No response details available</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const renderQuestionsTab = () => {
    if (!assessment) return null;
    
    return (
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-grey-200">
            <thead className="bg-grey-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Question
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Points
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-grey-200">
              {assessment.questions.map((question, index) => {
                const successRate = stats.questionSuccessRates[index]?.rate || 0;
                
                return (
                  <tr key={question.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-grey-900">
                      <div className="line-clamp-2">{question.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-900">
                      {question.type.replace('-', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-900">
                      {question.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-centre">
                        <div className="w-full bg-grey-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              successRate >= 70 ? 'bg-green-600' : 
                              successRate >= 40 ? 'bg-yellow-500' : 
                              'bg-red-600'
                            }`} 
                            style={{ width: `${successRate}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-grey-900">{successRate.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Question Performance Analysis</h3>
          </CardHeader>
          <CardContent>
            {typeof window !== 'undefined' && (
              <Chart
                options={{
                  chart: {
                    type: 'radar',
                    toolbar: {
                      show: false
                    }
                  },
                  xaxis: {
                    categories: stats.questionSuccessRates.map(q => q.question)
                  },
                  yaxis: {
                    max: 100,
                    labels: {
                      formatter: (value) => `${value.toFixed(0)}%`
                    }
                  },
                  fill: {
                    opacity: 0.5
                  },
                  markers: {
                    size: 4
                  },
                  colors: ['#4F46E5']
                }}
                series={[
                  {
                    name: 'Success Rate',
                    data: stats.questionSuccessRates.map(q => q.rate)
                  }
                ]}
                type="radar"
                height={350}
              />
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.questionSuccessRates.filter(q => q.rate < 50).map((q, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h4 className="font-medium text-red-600 mb-2">Low Success Rate: {q.question}</h4>
                  <p className="text-sm text-grey-700">
                    This question has a low success rate of {q.rate.toFixed(1)}%. Consider reviewing the question for clarity, 
                    difficulty level, or providing additional teaching materials on this topic.
                  </p>
                </CardContent>
              </Card>
            ))}
            
            {stats.questionSuccessRates.filter(q => q.rate >= 90).map((q, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h4 className="font-medium text-green-600 mb-2">High Success Rate: {q.question}</h4>
                  <p className="text-sm text-grey-700">
                    This question has a high success rate of {q.rate.toFixed(1)}%. This indicates students have a strong 
                    understanding of this concept. Consider increasing difficulty or expanding on this topic.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
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
      <div className="mb-6">
        <div className="flex items-centre justify-between">
          <h1 className="text-2xl font-bold text-grey-900">Assessment Results</h1>
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>
        <p className="mt-2 text-grey-600">
          {assessment.title}
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <SimpleTabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'responses', label: 'Student Responses' },
              { id: 'questions', label: 'Question Analysis' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-6"
          />

          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'responses' && renderResponsesTab()}
          {activeTab === 'questions' && renderQuestionsTab()}
        </CardContent>
      </Card>
    </div>
  );
}
