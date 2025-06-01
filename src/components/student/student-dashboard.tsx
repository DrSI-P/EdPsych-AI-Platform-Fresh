'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toast';
import { AIPrompt } from '@/components/ai/ai-prompt';

interface StudentDashboardProps {
  className?: string;
}

export function StudentDashboard({
  className = ''
}: StudentDashboardProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Mock data for demonstration
  const [studentData, setStudentData] = useState({
    name: 'Emma Thompson',
    year: 'Year 8',
    school: 'Oakwood Secondary School',
    overallProgress: 78,
    subjects: [
      { 
        id: '1',
        name: 'Mathematics', 
        progress: 72, 
        currentTopic: 'Algebraic Expressions',
        nextAssessment: '2025-05-20',
        recentScores: [68, 75, 72, 74]
      },
      { 
        id: '2',
        name: 'English', 
        progress: 85, 
        currentTopic: 'Shakespeare: Romeo and Juliet',
        nextAssessment: '2025-05-22',
        recentScores: [82, 85, 88, 84]
      },
      { 
        id: '3',
        name: 'Science', 
        progress: 76, 
        currentTopic: 'Forces and Motion',
        nextAssessment: '2025-05-18',
        recentScores: [70, 75, 78, 80]
      }
    ],
    assignments: [
      {
        id: '1',
        title: 'Algebraic Expressions Worksheet',
        subject: 'Mathematics',
        dueDate: '2025-05-18',
        status: 'pending',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Character Analysis: Romeo',
        subject: 'English',
        dueDate: '2025-05-19',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Forces Lab Report',
        subject: 'Science',
        dueDate: '2025-05-17',
        status: 'pending',
        priority: 'high'
      },
      {
        id: '4',
        title: 'Weekly Vocabulary Quiz',
        subject: 'English',
        dueDate: '2025-05-16',
        status: 'completed',
        priority: 'medium',
        score: 85
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'Mathematics Mastery',
        description: 'Completed 10 consecutive mathematics assignments with scores above 80%',
        date: '2025-05-10',
        icon: '🏆'
      },
      {
        id: '2',
        title: 'Science Explorer',
        description: 'Completed all interactive science experiments in the current unit',
        date: '2025-05-05',
        icon: '🔬'
      },
      {
        id: '3',
        title: 'Consistent Learner',
        description: 'Logged in and completed activities for 30 consecutive days',
        date: '2025-04-28',
        icon: '📚'
      }
    ],
    recommendations: [
      {
        id: '1',
        type: 'resource',
        title: 'Algebraic Expressions: Visual Guide',
        subject: 'Mathematics',
        relevance: 'high',
        description: 'Interactive visual guide to help understand algebraic expressions'
      },
      {
        id: '2',
        type: 'practise',
        title: 'Romeo and Juliet Character Quiz',
        subject: 'English',
        relevance: 'medium',
        description: 'Test your understanding of the main characters in Romeo and Juliet'
      },
      {
        id: '3',
        type: 'video',
        title: 'Forces and Motion: Real-world Examples',
        subject: 'Science',
        relevance: 'high',
        description: 'Video explaining forces and motion with everyday examples'
      }
    ]
  });
  
  // Fetch data on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Handle AI study plan generation
  const handleGenerateStudyPlan = (aiResponse: string) => {
    showToast({
      title: 'Study plan generated successfully',
      type: 'success'
    });
  };
  
  // Handle assignment completion
  const handleCompleteAssignment = (assignmentId: string) => {
    setStudentData(prev => ({
      ...prev,
      assignments: prev.assignments.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: 'completed', score: Math.floor(Math.random() * 20) + 80 } 
          : assignment
      )
    }));
    
    showToast({
      title: 'Assignment marked as completed',
      type: 'success'
    });
  };
  
  // Define the tabs
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-6">
                <Card className="flex-1">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Welcome, {studentData.name}</h2>
                    <p className="text-sm text-grey-600">{studentData.year} • {studentData.school}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{studentData.overallProgress}%</span>
                      </div>
                      <div className="w-full bg-grey-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            studentData.overallProgress >= 80 ? 'bg-green-600' :
                            studentData.overallProgress >= 60 ? 'bg-blue-600' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${studentData.overallProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Subject Progress</h3>
                      {studentData.subjects.map(subject => (
                        <div key={subject.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{subject.name}</span>
                            <span>{subject.progress}%</span>
                          </div>
                          <div className="w-full bg-grey-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                subject.progress >= 80 ? 'bg-green-500' :
                                subject.progress >= 60 ? 'bg-blue-500' :
                                'bg-orange-400'
                              }`}
                              style={{ width: `${subject.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-grey-600">
                            Current topic: {subject.currentTopic}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Upcoming Assignments</h3>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {studentData.assignments
                        .filter(a => a.status === 'pending')
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .slice(0, 3)
                        .map(assignment => (
                          <div key={assignment.id} className="flex justify-between items-centre p-2 rounded-md hover:bg-grey-50">
                            <div>
                              <h4 className="font-medium">{assignment.title}</h4>
                              <p className="text-sm text-grey-600">{assignment.subject}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">Due: {assignment.dueDate}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {assignment.priority}
                              </span>
                            </div>
                          </div>
                        ))}
                      
                      {studentData.assignments.filter(a => a.status === 'pending').length === 0 && (
                        <p className="text-centre text-grey-500 py-2">No upcoming assignments</p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline"
                        className="w-full"
                      >
                        View All Assignments
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Recent Achievements</h3>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {studentData.achievements.slice(0, 2).map(achievement => (
                        <div key={achievement.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-grey-50">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-grey-600">{achievement.description}</p>
                            <p className="text-xs text-grey-500 mt-1">Earned on {achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline"
                        className="w-full"
                      >
                        View All Achievements
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recommended for You</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {studentData.recommendations.map(recommendation => (
                    <Card key={recommendation.id} className="h-full flex flex-col">
                      <CardContent className="pt-4 flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{recommendation.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            recommendation.type === 'resource' ? 'bg-blue-100 text-blue-800' :
                            recommendation.type === 'practise' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {recommendation.type}
                          </span>
                        </div>
                        <p className="text-sm text-grey-600 mb-2">{recommendation.description}</p>
                        <p className="text-xs text-grey-500">Subject: {recommendation.subject}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          Open
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Generate Personalised Study Plan</h3>
                </CardHeader>
                <CardContent>
                  <AIPrompt
                    placeholder="Describe what you want to focus on (e.g., preparing for upcoming assessments, improving in specific subjects)..."
                    systemPrompt={`You are an educational AI assistant helping ${studentData.name}, a ${studentData.year} student. Create a personalised study plan based on their current progress and the focus areas they mention. Their subject progress is: ${studentData.subjects.map(s => `${s.name}: ${s.progress}% (Current topic: ${s.currentTopic})`).join(', ')}. They have these upcoming assignments: ${studentData.assignments.filter(a => a.status === 'pending').map(a => `${a.title} (${a.subject}, due ${a.dueDate})`).join(', ')}. Create a structured, actionable study plan with specific activities, resources, and time management suggestions. Use UK English spelling and follow UK educational standards.`}
                    onCompletion={handleGenerateStudyPlan}
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )
    },
    {
      id: 'subjects',
      label: 'My Subjects',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {studentData.subjects.map(subject => (
                  <Card key={subject.id} className="h-full flex flex-col">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">{subject.name}</h3>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{subject.progress}%</span>
                      </div>
                      <div className="w-full bg-grey-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            subject.progress >= 80 ? 'bg-green-600' :
                            subject.progress >= 60 ? 'bg-blue-600' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium">Current Topic</h4>
                          <p className="text-sm">{subject.currentTopic}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium">Next Assessment</h4>
                          <p className="text-sm">{subject.nextAssessment}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium">Recent Scores</h4>
                          <div className="flex items-centre gap-1 mt-1">
                            {subject.recentScores.map((score, index) => (
                              <div 
                                key={index}
                                className={`h-8 w-8 rounded-md flex items-centre justify-centre text-xs text-white ${
                                  score >= 80 ? 'bg-green-500' :
                                  score >= 60 ? 'bg-blue-500' :
                                  'bg-orange-500'
                                }`}
                              >
                                {score}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button 
                        className="flex-1"
                      >
                        Resources
                      </Button>
                      <Button 
                        className="flex-1"
                        variant="outline"
                      >
                        Practise
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Subject Recommendations</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentData.subjects.map(subject => (
                      <div key={subject.id} className="space-y-2">
                        <h4 className="font-medium">{subject.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {studentData.recommendations
                            .filter(r => r.subject === subject.name)
                            .map(recommendation => (
                              <div 
                                key={recommendation.id} 
                                className="flex justify-between items-centre p-3 rounded-md border hover:bg-grey-50"
                              >
                                <div>
                                  <h5 className="font-medium">{recommendation.title}</h5>
                                  <p className="text-sm text-grey-600">{recommendation.description}</p>
                                </div>
                                <Button size="sm">Open</Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )
    },
    {
      id: 'assignments',
      label: 'Assignments',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">My Assignments</h2>
                <div className="flex gap-2">
                  <Select
                    options={[
                      { value: 'all', label: 'All Subjects' },
                      { value: 'mathematics', label: 'Mathematics' },
                      { value: 'english', label: 'English' },
                      { value: 'science', label: 'Science' }
                    ]}
                    className="w-40"
                  />
                  <Select
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'completed', label: 'Completed' }
                    ]}
                    className="w-40"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pending Assignments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentData.assignments
                    .filter(a => a.status === 'pending')
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map(assignment => (
                      <Card key={assignment.id} className="h-full flex flex-col">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <h4 className="text-lg font-semibold">{assignment.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {assignment.priority}
                            </span>
                          </div>
                          <p className="text-sm text-grey-600">{assignment.subject}</p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="flex justify-between text-sm">
                            <span>Due Date:</span>
                            <span className="font-medium">{assignment.dueDate}</span>
                          </div>
                          <div className="mt-4">
                            <div className="text-sm font-medium mb-1">Time Remaining:</div>
                            <div className="w-full bg-grey-200 rounded-full h-2">
                              {/* This would be calculated dynamically in a real app */}
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: '60%' }}
                              ></div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button 
                            className="flex-1"
                          >
                            Start Assignment
                          </Button>
                          <Button 
                            className="flex-1"
                            variant="outline"
                            onClick={() => handleCompleteAssignment(assignment.id)}
                          >
                            Mark as Completed
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    
                  {studentData.assignments.filter(a => a.status === 'pending').length === 0 && (
                    <div className="md:col-span-2 text-centre py-8 text-grey-500">
                      No pending assignments. Great job!
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Completed Assignments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentData.assignments
                    .filter(a => a.status === 'completed')
                    .map(assignment => (
                      <Card key={assignment.id} className="h-full flex flex-col">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <h4 className="text-lg font-semibold">{assignment.title}</h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                              completed
                            </span>
                          </div>
                          <p className="text-sm text-grey-600">{assignment.subject}</p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="flex justify-between text-sm">
                            <span>Due Date:</span>
                            <span className="font-medium">{assignment.dueDate}</span>
                          </div>
                          {assignment.score && (
                            <div className="mt-4">
                              <div className="text-sm font-medium mb-1">Score:</div>
                              <div className="flex items-centre gap-2">
                                <div className="w-full bg-grey-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      assignment.score >= 80 ? 'bg-green-600' :
                                      assignment.score >= 60 ? 'bg-blue-600' :
                                      'bg-orange-500'
                                    }`}
                                    style={{ width: `${assignment.score}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{assignment.score}%</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full"
                            variant="outline"
                          >
                            View Feedback
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    
                  {studentData.assignments.filter(a => a.status === 'completed').length === 0 && (
                    <div className="md:col-span-2 text-centre py-8 text-grey-500">
                      No completed assignments yet.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'achievements',
      label: 'Achievements',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">My Achievements</h2>
                <div className="text-sm">
                  <span className="font-medium">Total Achievements:</span> {studentData.achievements.length}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {studentData.achievements.map(achievement => (
                  <Card key={achievement.id} className="h-full flex flex-col">
                    <CardHeader className="text-centre">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h3 className="text-lg font-semibold">{achievement.title}</h3>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-grey-600 text-centre">{achievement.description}</p>
                    </CardContent>
                    <CardFooter className="text-centre text-sm text-grey-500">
                      Earned on {achievement.date}
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Achievement Progress</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Mathematics Master</h4>
                      <div className="flex items-centre gap-2">
                        <div className="w-full bg-grey-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: '75%' }}
                          ></div>
                        </div>
                        <span className="text-sm">75%</span>
                      </div>
                      <p className="text-xs text-grey-600">Complete 20 mathematics assignments with scores above 80%</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Literary Scholar</h4>
                      <div className="flex items-centre gap-2">
                        <div className="w-full bg-grey-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: '40%' }}
                          ></div>
                        </div>
                        <span className="text-sm">40%</span>
                      </div>
                      <p className="text-xs text-grey-600">Read and complete activities for 5 different literary works</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Scientific Investigator</h4>
                      <div className="flex items-centre gap-2">
                        <div className="w-full bg-grey-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <span className="text-sm">60%</span>
                      </div>
                      <p className="text-xs text-grey-600">Complete 10 science experiments with detailed observations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )
    }
  ];
  
  return (
    <div className={className}>
      <Tabs tabs={tabs} />
    </div>
  );
}
