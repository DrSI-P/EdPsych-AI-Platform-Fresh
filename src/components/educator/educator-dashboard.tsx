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

interface EducatorDashboardProps {
  className?: string;
}

export function EducatorDashboard({
  className = ''
}: EducatorDashboardProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Mock data for demonstration
  const [stats, setStats] = useState({
    students: 87,
    classes: 4,
    assessments: 12,
    resources: 45,
    completionRate: 78,
    averageScore: 72
  });
  
  const [recentActivity, setRecentActivity] = useState([
    {
      id: '1',
      type: 'assessment',
      title: 'Year 8 Algebra Quiz',
      date: '2025-05-14',
      details: '24 students completed, average score: 68%'
    },
    {
      id: '2',
      type: 'resource',
      title: 'Fractions Interactive Worksheet',
      date: '2025-05-12',
      details: '32 students accessed, average time spent: 18 minutes'
    },
    {
      id: '3',
      type: 'feedback',
      title: 'End of Term Progress Reports',
      date: '2025-05-10',
      details: 'Generated for 87 students, 42 parent views'
    }
  ]);
  
  const [students, setStudents] = useState([
    {
      id: '1',
      name: 'Emma Thompson',
      year: 'Year 8',
      progress: 85,
      lastActive: '2025-05-15',
      subjects: [
        { name: 'Mathematics', score: 78 },
        { name: 'English', score: 92 },
        { name: 'Science', score: 84 }
      ]
    },
    {
      id: '2',
      name: 'James Wilson',
      year: 'Year 8',
      progress: 62,
      lastActive: '2025-05-14',
      subjects: [
        { name: 'Mathematics', score: 65 },
        { name: 'English', score: 70 },
        { name: 'Science', score: 58 }
      ]
    },
    {
      id: '3',
      name: 'Sophia Ahmed',
      year: 'Year 8',
      progress: 91,
      lastActive: '2025-05-15',
      subjects: [
        { name: 'Mathematics', score: 94 },
        { name: 'English', score: 88 },
        { name: 'Science', score: 92 }
      ]
    },
    {
      id: '4',
      name: 'Oliver Chen',
      year: 'Year 8',
      progress: 73,
      lastActive: '2025-05-13',
      subjects: [
        { name: 'Mathematics', score: 82 },
        { name: 'English', score: 68 },
        { name: 'Science', score: 76 }
      ]
    }
  ]);
  
  const [classes, setClasses] = useState([
    {
      id: '1',
      name: '8A Mathematics',
      students: 24,
      averageProgress: 76,
      nextLesson: '2025-05-17 09:00',
      currentTopic: 'Algebraic Expressions'
    },
    {
      id: '2',
      name: '8B Mathematics',
      students: 22,
      averageProgress: 68,
      nextLesson: '2025-05-17 11:00',
      currentTopic: 'Algebraic Expressions'
    },
    {
      id: '3',
      name: '8A English',
      students: 24,
      averageProgress: 82,
      nextLesson: '2025-05-18 13:30',
      currentTopic: 'Shakespeare: Romeo and Juliet'
    },
    {
      id: '4',
      name: '8B English',
      students: 22,
      averageProgress: 74,
      nextLesson: '2025-05-18 14:45',
      currentTopic: 'Shakespeare: Romeo and Juliet'
    }
  ]);
  
  // Fetch data on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Handle feedback generation
  const handleGenerateFeedback = (studentId: string, aiResponse: string) => {
    showToast({
      title: 'Feedback generated successfully',
      type: 'success'
    });
  };
  
  // Handle lesson plan generation
  const handleGenerateLessonPlan = (classId: string, aiResponse: string) => {
    showToast({
      title: 'Lesson plan generated successfully',
      type: 'success'
    });
  };
  
  // Define the tabs
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-centre">
                      <h3 className="text-lg font-semibold text-grey-700">Students</h3>
                      <p className="text-3xl font-bold mt-2">{stats.students}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-centre">
                      <h3 className="text-lg font-semibold text-grey-700">Classes</h3>
                      <p className="text-3xl font-bold mt-2">{stats.classes}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-centre">
                      <h3 className="text-lg font-semibold text-grey-700">Assessments</h3>
                      <p className="text-3xl font-bold mt-2">{stats.assessments}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-centre">
                      <h3 className="text-lg font-semibold text-grey-700">Resources</h3>
                      <p className="text-3xl font-bold mt-2">{stats.resources}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-centre">
                      <h3 className="text-lg font-semibold text-grey-700">Completion Rate</h3>
                      <p className="text-3xl font-bold mt-2">{stats.completionRate}%</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-centre">
                      <h3 className="text-lg font-semibold text-grey-700">Average Score</h3>
                      <p className="text-3xl font-bold mt-2">{stats.averageScore}%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <div className="space-y-2">
                  {recentActivity.map(activity => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-centre">
                          <div>
                            <h3 className="font-medium">{activity.title}</h3>
                            <p className="text-sm text-grey-600">{activity.details}</p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {activity.type}
                            </span>
                            <p className="text-xs text-grey-500 mt-1">{activity.date}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Upcoming Classes</h2>
                  <div className="space-y-2">
                    {classes.slice(0, 2).map(cls => (
                      <Card key={cls.id}>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{cls.name}</h3>
                          <p className="text-sm text-grey-600">
                            {cls.nextLesson.split(' ')[0]} at {cls.nextLesson.split(' ')[1]}
                          </p>
                          <p className="text-sm text-grey-600">
                            <span className="font-medium">Topic:</span> {cls.currentTopic}
                          </p>
                          <div className="flex justify-between items-centre mt-2">
                            <span className="text-sm text-grey-500">{cls.students} students</span>
                            <span className="text-sm">
                              Average progress: <span className="font-medium">{cls.averageProgress}%</span>
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Student Highlights</h2>
                  <div className="space-y-2">
                    {students.slice(0, 2).map(student => (
                      <Card key={student.id}>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-grey-600">{student.year}</p>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{student.progress}%</span>
                            </div>
                            <div className="w-full bg-grey-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-grey-600">
                            Last active: {student.lastActive}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'students',
      label: 'Students',
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
                <h2 className="text-xl font-semibold">Student Management</h2>
                <Input
                  placeholder="Search students..."
                  className="max-w-xs"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map(student => (
                  <Card key={student.id} className="h-full flex flex-col">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">{student.name}</h3>
                      <p className="text-sm text-grey-600">{student.year}</p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Progress</span>
                          <span>{student.progress}%</span>
                        </div>
                        <div className="w-full bg-grey-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              student.progress >= 80 ? 'bg-green-600' :
                              student.progress >= 60 ? 'bg-blue-600' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Subject Performance</h4>
                        {student.subjects.map(subject => (
                          <div key={subject.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{subject.name}</span>
                              <span>{subject.score}%</span>
                            </div>
                            <div className="w-full bg-grey-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  subject.score >= 80 ? 'bg-green-500' :
                                  subject.score >= 60 ? 'bg-blue-500' :
                                  'bg-orange-400'
                                }`}
                                style={{ width: `${subject.score}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-sm text-grey-600">
                        Last active: {student.lastActive}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                      <Button 
                        className="w-full"
                        variant="outline"
                      >
                        View Profile
                      </Button>
                      
                      <div className="w-full">
                        <h4 className="text-sm font-medium mb-2">Generate Personalised Feedback</h4>
                        <AIPrompt
                          placeholder="Describe feedback focus (e.g., recent progress, areas for improvement)..."
                          systemPrompt={`You are an experienced educator providing personalised feedback for ${student.name}, a ${student.year} student. Their overall progress is ${student.progress}% with the following subject scores: ${student.subjects.map(s => `${s.name}: ${s.score}%`).join(', ')}. Generate constructive, encouraging feedback based on this data and the educator's focus. Use UK English spelling and follow UK educational standards. Keep feedback positive, specific, and actionable.`}
                          onCompletion={(response) => handleGenerateFeedback(student.id, response)}
                        />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'classes',
      label: 'Classes',
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
                <h2 className="text-xl font-semibold">Class Management</h2>
                <Input
                  placeholder="Search classes..."
                  className="max-w-xs"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map(cls => (
                  <Card key={cls.id} className="h-full flex flex-col">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">{cls.name}</h3>
                      <p className="text-sm text-grey-600">{cls.students} students</p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Average Progress</span>
                          <span>{cls.averageProgress}%</span>
                        </div>
                        <div className="w-full bg-grey-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              cls.averageProgress >= 80 ? 'bg-green-600' :
                              cls.averageProgress >= 60 ? 'bg-blue-600' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${cls.averageProgress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Next Lesson:</span>
                          <span className="text-sm ml-2">
                            {cls.nextLesson.split(' ')[0]} at {cls.nextLesson.split(' ')[1]}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Current Topic:</span>
                          <span className="text-sm ml-2">{cls.currentTopic}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                      <div className="flex space-x-2 w-full">
                        <Button 
                          className="flex-1"
                          variant="outline"
                        >
                          View Class
                        </Button>
                        <Button 
                          className="flex-1"
                          variant="outline"
                        >
                          Assessments
                        </Button>
                      </div>
                      
                      <div className="w-full">
                        <h4 className="text-sm font-medium mb-2">Generate Lesson Plan</h4>
                        <AIPrompt
                          placeholder="Describe lesson focus and learning objectives..."
                          systemPrompt={`You are an experienced educator creating a lesson plan for ${cls.name} on the topic of "${cls.currentTopic}". The class has ${cls.students} students with an average progress of ${cls.averageProgress}%. Generate a structured lesson plan based on the educator's focus and learning objectives. Include: 1) Learning objectives, 2) Starter activity, 3) Main activities, 4) Plenary, and 5) Assessment for learning. Use UK English spelling and follow UK educational standards and curriculum.`}
                          onCompletion={(response) => handleGenerateLessonPlan(cls.id, response)}
                        />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'reports',
      label: 'Reports',
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
                <h2 className="text-xl font-semibold">Reports & Analytics</h2>
                <div className="flex space-x-2">
                  <Select
                    options={[
                      { value: 'all', label: 'All Classes' },
                      { value: '8A', label: '8A Mathematics' },
                      { value: '8B', label: '8B Mathematics' },
                      { value: '8A_english', label: '8A English' },
                      { value: '8B_english', label: '8B English' }
                    ]}
                    className="w-40"
                  />
                  <Select
                    options={[
                      { value: 'term', label: 'This Term' },
                      { value: 'month', label: 'This Month' },
                      { value: 'week', label: 'This Week' },
                      { value: 'custom', label: 'Custom Range' }
                    ]}
                    className="w-40"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Assessment Performance</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-centre justify-centre bg-grey-100 rounded-md">
                      <p className="text-grey-500">Assessment performance chart would appear here</p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Score:</span>
                        <span className="font-medium">72%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Highest Performing Topic:</span>
                        <span className="font-medium">Number Systems</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Lowest Performing Topic:</span>
                        <span className="font-medium">Algebraic Fractions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Engagement Metrics</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-centre justify-centre bg-grey-100 rounded-md">
                      <p className="text-grey-500">Engagement metrics chart would appear here</p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Time Spent:</span>
                        <span className="font-medium">42 minutes/day</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Resource Completion Rate:</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Most Engaged Day:</span>
                        <span className="font-medium">Tuesday</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Progress Over Time</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-centre justify-centre bg-grey-100 rounded-md">
                      <p className="text-grey-500">Progress over time chart would appear here</p>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Mathematics</h4>
                        <div className="flex justify-between text-sm">
                          <span>Starting Point:</span>
                          <span>58%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Current Level:</span>
                          <span>72%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Improvement:</span>
                          <span className="text-green-600">+14%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">English</h4>
                        <div className="flex justify-between text-sm">
                          <span>Starting Point:</span>
                          <span>64%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Current Level:</span>
                          <span>79%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Improvement:</span>
                          <span className="text-green-600">+15%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Science</h4>
                        <div className="flex justify-between text-sm">
                          <span>Starting Point:</span>
                          <span>61%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Current Level:</span>
                          <span>76%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Improvement:</span>
                          <span className="text-green-600">+15%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Generate Comprehensive Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
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
