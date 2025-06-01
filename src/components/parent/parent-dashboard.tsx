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

interface ParentDashboardProps {
  className?: string;
}

export function ParentDashboard({
  className = ''
}: ParentDashboardProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Mock data for demonstration
  const [children, setChildren] = useState([
    {
      id: '1',
      name: 'Emma Thompson',
      year: 'Year 8',
      school: 'Oakwood Secondary School',
      overallProgress: 78,
      subjects: [
        { name: 'Mathematics', progress: 72 },
        { name: 'English', progress: 85 },
        { name: 'Science', progress: 76 }
      ],
      recentActivity: [
        { 
          id: '1-1', 
          type: 'assessment', 
          title: 'Weekly Mathematics Quiz', 
          date: '2025-05-15', 
          score: 78 
        },
        { 
          id: '1-2', 
          type: 'resource', 
          title: 'Romeo and Juliet Chapter 3', 
          date: '2025-05-14', 
          duration: '45 minutes' 
        }
      ],
      upcomingAssignments: [
        {
          id: '1-1',
          title: 'Algebraic Expressions Worksheet',
          subject: 'Mathematics',
          dueDate: '2025-05-18'
        },
        {
          id: '1-2',
          title: 'Character Analysis: Romeo',
          subject: 'English',
          dueDate: '2025-05-19'
        }
      ]
    },
    {
      id: '2',
      name: 'Oliver Thompson',
      year: 'Year 5',
      school: 'Oakwood Primary School',
      overallProgress: 82,
      subjects: [
        { name: 'Mathematics', progress: 85 },
        { name: 'English', progress: 78 },
        { name: 'Science', progress: 84 }
      ],
      recentActivity: [
        { 
          id: '2-1', 
          type: 'assessment', 
          title: 'Fractions Quiz', 
          date: '2025-05-15', 
          score: 85 
        },
        { 
          id: '2-2', 
          type: 'resource', 
          title: 'Reading Comprehension: The Lion and the Mouse', 
          date: '2025-05-14', 
          duration: '30 minutes' 
        }
      ],
      upcomingAssignments: [
        {
          id: '2-1',
          title: 'Multiplication and Division Practise',
          subject: 'Mathematics',
          dueDate: '2025-05-17'
        },
        {
          id: '2-2',
          title: 'Animal Habitats Poster',
          subject: 'Science',
          dueDate: '2025-05-20'
        }
      ]
    }
  ]);
  
  const [messages, setMessages] = useState([
    {
      id: '1',
      from: 'Ms. Johnson (Mathematics)',
      subject: 'Weekly Mathematics Update',
      date: '2025-05-15',
      read: false,
      content: 'Emma has been making good progress in algebra this week. She scored 78% on the weekly quiz, showing improvement in solving equations. She still needs some practise with algebraic fractions.'
    },
    {
      id: '2',
      from: 'Mr. Williams (English)',
      subject: 'Romeo and Juliet Assignment',
      date: '2025-05-14',
      read: true,
      content: 'Just a reminder that Emma\'s character analysis of Romeo is due on Monday, 19th May. Please encourage her to include textual evidence in her analysis.'
    },
    {
      id: '3',
      from: 'Mrs. Davies (Year 5 Teacher)',
      subject: 'Oliver\'s Science Project',
      date: '2025-05-13',
      read: true,
      content: 'Oliver has been enthusiastic about the animal habitats project. His research is thorough, but he needs to start working on the visual presentation aspect of the assignment.'
    }
  ]);
  
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Parent-Teacher Conference',
      date: '2025-05-25',
      time: '16:00 - 18:30',
      location: 'Oakwood Secondary School',
      description: 'End of term parent-teacher conferences. Book your 15-minute slot with each subject teacher.'
    },
    {
      id: '2',
      title: 'Year 5 Science Fair',
      date: '2025-06-10',
      time: '13:00 - 15:00',
      location: 'Oakwood Primary School Hall',
      description: 'Students will present their science projects. Parents are welcome to attend.'
    },
    {
      id: '3',
      title: 'Year 8 Drama Performance: Romeo and Juliet',
      date: '2025-06-15',
      time: '18:00 - 20:00',
      location: 'Oakwood Secondary School Theatre',
      description: 'Year 8 students will perform scenes from Shakespeare\'s Romeo and Juliet.'
    }
  ]);
  
  const [selectedChild, setSelectedChild] = useState(children[0].id);
  
  // Fetch data on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Get the currently selected child
  const currentChild = children.find(child => child.id === selectedChild) || children[0];
  
  // Handle message read
  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId 
          ? { ...message, read: true } 
          : message
      )
    );
  };
  
  // Handle AI support request
  const handleAISupport = (aiResponse: string) => {
    showToast({
      title: 'Support information generated successfully',
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
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">Parent Dashboard</h2>
                <Select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  options={children.map(child => ({
                    value: child.id,
                    label: child.name
                  }))}
                  className="w-48"
                />
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">{currentChild.name}'s Progress</h3>
                  <p className="text-sm text-grey-600">{currentChild.year} • {currentChild.school}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>{currentChild.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-grey-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          currentChild.overallProgress >= 80 ? 'bg-green-600' :
                          currentChild.overallProgress >= 60 ? 'bg-blue-600' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${currentChild.overallProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Subject Progress</h4>
                    {currentChild.subjects.map(subject => (
                      <div key={subject.name} className="space-y-1">
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
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    View Detailed Progress Report
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {currentChild.recentActivity.map(activity => (
                      <div key={activity.id} className="p-3 rounded-md border hover:bg-grey-50">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{activity.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            activity.type === 'assessment' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {activity.type}
                          </span>
                        </div>
                        <p className="text-sm text-grey-600">Date: {activity.date}</p>
                        {activity.score && (
                          <p className="text-sm text-grey-600">Score: {activity.score}%</p>
                        )}
                        {activity.duration && (
                          <p className="text-sm text-grey-600">Time spent: {activity.duration}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      View All Activity
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Upcoming Assignments</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {currentChild.upcomingAssignments.map(assignment => (
                      <div key={assignment.id} className="p-3 rounded-md border hover:bg-grey-50">
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-grey-600">Subject: {assignment.subject}</p>
                        <p className="text-sm text-grey-600">Due: {assignment.dueDate}</p>
                      </div>
                    ))}
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
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">How to Support Your Child</h3>
                </CardHeader>
                <CardContent>
                  <AIPrompt
                    placeholder="Ask for specific support strategies (e.g., how to help with algebra, encouraging reading)..."
                    systemPrompt={`You are an educational expert providing advice to parents on how to support their child's learning. The child is ${currentChild.name}, a ${currentChild.year} student. Their subject progress is: ${currentChild.subjects.map(s => `${s.name}: ${s.progress}%`).join(', ')}. Provide practical, evidence-based strategies that parents can use at home to support their child's learning based on the parent's specific query. Use UK English spelling and follow UK educational standards and curriculum. Keep advice practical, specific, and actionable.`}
                    onCompletion={handleAISupport}
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )
    },
    {
      id: 'messages',
      label: 'Messages',
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
                <h2 className="text-xl font-semibold">Teacher Messages</h2>
                <Button>
                  Compose Message
                </Button>
              </div>
              
              <div className="space-y-4">
                {messages.map(message => (
                  <Card key={message.id} className={`${!message.read ? 'border-blue-300 bg-blue-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{message.subject}</h3>
                          <p className="text-sm text-grey-600">From: {message.from}</p>
                          <p className="text-sm text-grey-500">Date: {message.date}</p>
                        </div>
                        {!message.read && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <div className="mt-3 p-3 bg-grey-50 rounded-md">
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="mt-3 flex justify-end gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                        >
                          Reply
                        </Button>
                        {!message.read && (
                          <Button 
                            size="sm"
                            onClick={() => handleMarkAsRead(message.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'events',
      label: 'School Events',
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
                <h2 className="text-xl font-semibold">Upcoming School Events</h2>
                <Select
                  options={[
                    { value: 'all', label: 'All Schools' },
                    { value: 'secondary', label: 'Oakwood Secondary' },
                    { value: 'primary', label: 'Oakwood Primary' }
                  ]}
                  className="w-48"
                />
              </div>
              
              <div className="space-y-4">
                {events.map(event => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="md:flex-1">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <p className="text-sm text-grey-600">{event.date} at {event.time}</p>
                          <p className="text-sm text-grey-600">Location: {event.location}</p>
                          <p className="mt-2">{event.description}</p>
                        </div>
                        <div className="flex flex-col gap-2 md:w-40">
                          <Button>
                            Add to Calendar
                          </Button>
                          <Button variant="outline">
                            More Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'resources',
      label: 'Parent Resources',
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
                <h2 className="text-xl font-semibold">Resources for Parents</h2>
                <Input
                  placeholder="Search resources..."
                  className="max-w-xs"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Supporting Mathematics Learning</h3>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-grey-600 mb-4">
                      Practical strategies to support your child's mathematics learning at home, including everyday applications and resources.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-centre gap-2">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm">Guide: Mathematics at Home</span>
                      </div>
                      <div className="flex items-centre gap-2">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Video: Maths Anxiety Tips</span>
                      </div>
                      <div className="flex items-centre gap-2">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Infographic: Key Concepts</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Access Resources
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Encouraging Reading Habits</h3>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-grey-600 mb-4">
                      Strategies to foster a love of reading, recommended book lists by age group, and activities to enhance comprehension.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-centre gap-2">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm">Guide: Reading Together</span>
                      </div>
                      <div className="flex items-centre gap-2">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-sm">Book Lists by Age Group</span>
                      </div>
                      <div className="flex items-centre gap-2">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-sm">Reading Comprehension Activities</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Access Resources
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Supporting Wellbeing</h3>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-grey-600 mb-4">
                      Resources to support your child's mental health and wellbeing, including managing academic stress and building resilience.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-centre gap-2">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm">Guide: Supporting Exam Stress</span>
                      </div>
                      <div className="flex items-centre gap-2">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Video: Building Resilience</span>
                      </div>
                      <div className="flex items-centre gap-2">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Workshop: Parent Wellbeing Session</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Access Resources
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Personalised Support</h3>
                </CardHeader>
                <CardContent>
                  <AIPrompt
                    placeholder="Ask for specific parental support resources or guidance..."
                    systemPrompt={`You are an educational expert providing resources and guidance to parents. The parent has children in UK schools and is looking for specific resources or guidance. Provide helpful, evidence-based information tailored to their query, including specific resources they might find useful. Use UK English spelling and follow UK educational standards. Keep advice practical and actionable, with specific resource recommendations where possible.`}
                    onCompletion={handleAISupport}
                  />
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
