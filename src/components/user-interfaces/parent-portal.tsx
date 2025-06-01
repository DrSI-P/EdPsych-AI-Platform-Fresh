import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, MessageSquare, BookOpen, FileText, Users, Bell, Settings } from 'lucide-react';

/**
 * Parent/Guardian Monitoring & Support Portal for EdPsych Connect
 * Provides tools for parents to monitor their child's progress and communicate with educators.
 */
const ParentPortal = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample parent data
  const [parentData, setParentData] = useState({
    name: 'Mr. Johnson',
    avatar: '/assets/avatars/parent-1.jpg',
    children: [
      { id: 'child1', name: 'Alex Johnson', yearGroup: 'Year 5', school: 'Oakwood Primary School' }
    ],
    notifications: [
      { id: 'notif1', type: 'message', from: 'Ms. Thompson', subject: 'Weekly Update', date: '2025-05-29', read: false },
      { id: 'notif2', type: 'alert', subject: 'Homework Submission', date: '2025-05-28', read: true },
      { id: 'notif3', type: 'event', subject: 'Parent-Teacher Conference', date: '2025-05-27', read: true }
    ]
  });
  
  // Sample child progress data
  const [childProgress, setChildProgress] = useState({
    attendance: { present: 95, late: 3, absent: 2 },
    subjects: [
      { name: 'Mathematics', progress: 75, grade: 'B+', strengths: ['Problem solving', 'Number operations'], areas_for_improvement: ['Fractions', 'Word problems'] },
      { name: 'English', progress: 68, grade: 'B', strengths: ['Reading comprehension', 'Vocabulary'], areas_for_improvement: ['Writing structure', 'Grammar'] },
      { name: 'Science', progress: 82, grade: 'A-', strengths: ['Scientific inquiry', 'Plant biology'], areas_for_improvement: ['Data recording'] },
      { name: 'Social Studies', progress: 60, grade: 'C+', strengths: ['Historical knowledge'], areas_for_improvement: ['Geography', 'Current events'] }
    ],
    recentActivities: [
      { id: 'act1', type: 'assignment', title: 'Mathematics Quiz', date: '2025-05-29', score: 85, status: 'completed' },
      { id: 'act2', type: 'lesson', title: 'Plant Life Cycles', date: '2025-05-28', status: 'completed' },
      { id: 'act3', type: 'resource', title: 'Reading Comprehension', date: '2025-05-27', status: 'in-progress' }
    ],
    upcomingAssignments: [
      { id: 'assign1', title: 'Fractions Worksheet', subject: 'Mathematics', dueDate: '2025-06-02' },
      { id: 'assign2', title: 'Book Report', subject: 'English', dueDate: '2025-06-05' },
      { id: 'assign3', title: 'Plant Diagram', subject: 'Science', dueDate: '2025-06-07' }
    ],
    behaviourNotes: [
      { id: 'note1', date: '2025-05-25', teacher: 'Ms. Thompson', note: 'Alex was very helpful in group activities today.', type: 'positive' },
      { id: 'note2', date: '2025-05-20', teacher: 'Mr. Roberts', note: 'Alex had difficulty focusing during afternoon lessons.', type: 'concern' }
    ]
  });
  
  // Sample communication data
  const [communications, setCommunications] = useState([
    { id: 'comm1', type: 'message', with: 'Ms. Thompson (Teacher)', subject: 'Progress Update', date: '2025-05-28', status: 'received', preview: 'Alex has been making good progress in mathematics...' },
    { id: 'comm2', type: 'message', with: 'Mr. Roberts (Science Teacher)', subject: 'Science Project', date: '2025-05-25', status: 'sent', preview: 'Thank you for the information about the upcoming science project...' },
    { id: 'comm3', type: 'message', with: 'School Admin', subject: 'Attendance', date: '2025-05-22', status: 'sent', preview: 'I wanted to inform you that Alex will be absent next Monday due to...' }
  ]);
  
  // Sample events data
  const [events, setEvents] = useState([
    { id: 'evt1', title: 'Parent-Teacher Conference', date: '2025-06-10', time: '16:00', location: 'Classroom 5B', description: 'Discuss Alex\'s progress and development.' },
    { id: 'evt2', title: 'School Assembly', date: '2025-06-15', time: '09:30', location: 'Main Hall', description: 'End of term assembly with student presentations.' },
    { id: 'evt3', title: 'Science Fair', date: '2025-06-20', time: '13:00', location: 'School Gymnasium', description: 'Students will present their science projects.' }
  ]);
  
  // Sample resources data
  const [resources, setResources] = useState([
    { id: 'res1', title: 'Supporting Your Child\'s Learning', type: 'guide', category: 'Educational Support', dateAdded: '2025-05-20' },
    { id: 'res2', title: 'Understanding the UK Curriculum', type: 'document', category: 'Curriculum', dateAdded: '2025-05-18' },
    { id: 'res3', title: 'Helping with Mathematics Homework', type: 'video', category: 'Subject Support', dateAdded: '2025-05-15' },
    { id: 'res4', title: 'Emotional Wellbeing for Children', type: 'guide', category: 'Wellbeing', dateAdded: '2025-05-10' },
    { id: 'res5', title: 'Reading with Your Child', type: 'video', category: 'Subject Support', dateAdded: '2025-05-05' }
  ]);
  
  // Sample support requests data
  const [supportRequests, setSupportRequests] = useState([
    { id: 'supp1', topic: 'Login Issues', dateSubmitted: '2025-05-26', status: 'resolved', response: 'Password has been reset. Please check your email for instructions.' },
    { id: 'supp2', topic: 'Assignment Access', dateSubmitted: '2025-05-22', status: 'pending', description: 'Unable to access the science project materials.' }
  ]);
  
  // Mark notification as read
  const markNotificationAsRead = (notificationId) => {
    setParentData(prevData => ({
      ...prevData,
      notifications: prevData.notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    }));
  };
  
  // Send new message (placeholder)
  const sendMessage = (recipient, subject, message) => {
    const newMessage = {
      id: `comm${communications.length + 1}`,
      type: 'message',
      with: recipient,
      subject,
      date: new Date().toISOString().split('T')[0],
      status: 'sent',
      preview: message.substring(0, 50) + (message.length > 50 ? '...' : '')
    };
    
    setCommunications(prev => [newMessage, ...prev]);
  };
  
  // Submit support request (placeholder)
  const submitSupportRequest = (topic, description) => {
    const newRequest = {
      id: `supp${supportRequests.length + 1}`,
      topic,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'pending',
      description
    };
    
    setSupportRequests(prev => [newRequest, ...prev]);
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
              <img 
                src={parentData.avatar} 
                alt={parentData.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Welcome, {parentData.name}!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Parent/Guardian Portal
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-500 dark:text-gray-400 cursor-pointer" />
              {parentData.notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </div>
            <Settings className="h-6 w-6 text-gray-500 dark:text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>
      
      {/* Child Selector (for parents with multiple children) */}
      {parentData.children.length > 1 && (
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <select className="w-full md:w-auto text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
            {parentData.children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name} - {child.yearGroup}, {child.school}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Child Overview</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'progress'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Academic Progress</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('communication')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'communication'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Teacher Communication</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'events'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Events & Calendar</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'resources'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Family Resources</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'support'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Support</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Child Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Child Information</h3>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                    <img 
                      src="/assets/avatars/student-1.jpg" 
                      alt={parentData.children[0].name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {parentData.children[0].name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {parentData.children[0].yearGroup} • {parentData.children[0].school}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Attendance</h5>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${childProgress.attendance.present}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {childProgress.attendance.present}%
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="mr-2">Present: {childProgress.attendance.present}</span>
                      <span className="mr-2">Late: {childProgress.attendance.late}</span>
                      <span>Absent: {childProgress.attendance.absent}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Overall Progress</h5>
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(childProgress.subjects.reduce((acc, subj) => acc + subj.progress, 0) / childProgress.subjects.length)}%
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Across all subjects
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Upcoming</h5>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {childProgress.upcomingAssignments[0].title}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Due: {childProgress.upcomingAssignments[0].dueDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {childProgress.recentActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-center p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    <div className="mr-3">
                      {activity.type === 'assignment' && <FileText className="h-5 w-5 text-amber-500" />}
                      {activity.type === 'lesson' && <BookOpen className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'resource' && <BookOpen className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="flex-grow">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {activity.type} • {activity.date}
                      </p>
                    </div>
                    <div>
                      {activity.status === 'completed' && activity.score !== undefined && (
                        <div className="flex items-center text-green-500">
                          <span className="text-xs font-medium">
                            {activity.score}%
                          </span>
                        </div>
                      )}
                      {activity.status === 'completed' && activity.score === undefined && (
                        <div className="flex items-center text-green-500">
                          <span className="text-xs font-medium">
                            Completed
                          </span>
                        </div>
                      )}
                      {activity.status === 'in-progress' && (
                        <div className="flex items-center text-amber-500">
                          <span className="text-xs font-medium">
                            In Progress
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Behaviour Notes */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Behaviour Notes</h3>
              <div className="space-y-3">
                {childProgress.behaviourNotes.map((note) => (
                  <div 
                    key={note.id}
                    className={`p-3 border rounded-md ${
                      note.type === 'positive' 
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900' 
                        : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h5 className={`text-sm font-medium ${
                        note.type === 'positive' 
                          ? 'text-green-800 dark:text-green-300' 
                          : 'text-amber-800 dark:text-amber-300'
                      }`}>
                        {note.teacher}
                      </h5>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {note.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {note.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Upcoming Assignments */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upcoming Assignments</h3>
              <div className="space-y-3">
                {childProgress.upcomingAssignments.map((assignment) => (
                  <div 
                    key={assignment.id}
                    className="flex items-center p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    <div className="mr-3">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-grow">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        {assignment.title}
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {assignment.subject} • Due: {assignment.dueDate}
                      </p>
                    </div>
                    <button className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Academic Progress Tab */}
        {activeTab === 'progress' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Academic Progress</h3>
            
            {/* Subject Progress */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Subject Progress</h4>
              <div className="space-y-4">
                {childProgress.subjects.map((subject, index) => (
                  <div 
                    key={index}
                    className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-md font-medium text-gray-900 dark:text-white">
                        {subject.name}
                      </h5>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                          {subject.progress}%
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          subject.grade.startsWith('A') 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : subject.grade.startsWith('B')
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                        }`}>
                          Grade: {subject.grade}
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                      <div 
                        className={`h-2.5 rounded-full ${
                          subject.progress >= 80 
                            ? 'bg-green-500' 
                            : subject.progress >= 65 
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                        }`} 
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Strengths:</h6>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                          {subject.strengths.map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Areas for Improvement:</h6>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                          {subject.areas_for_improvement.map((area, i) => (
                            <li key={i}>{area}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Progress Over Time */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Progress Over Time</h4>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
                {/* Placeholder for progress chart */}
                <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  Chart Placeholder (e.g., Line chart showing progress over terms)
                </div>
              </div>
            </div>
            
            {/* Learning Style Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Learning Style Information</h4>
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Alex has been identified as primarily a <span className="font-medium text-primary">Visual Learner</span>, with secondary strengths in kinesthetic learning.
                </p>
                
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">How You Can Support This Learning Style:</h5>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <li>Use diagrams, charts, and pictures when helping with homework</li>
                  <li>Encourage color-coding and highlighting in notes</li>
                  <li>Provide visual examples of concepts</li>
                  <li>Use educational videos to supplement learning</li>
                  <li>Create mind maps for organizing information</li>
                </ul>
                
                <button className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20">
                  Learn More About Learning Styles
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Teacher Communication Tab */}
        {activeTab === 'communication' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Teacher Communication</h3>
              <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>New Message</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {communications.map(comm => (
                <div 
                  key={comm.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {comm.subject}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      comm.status === 'received' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {comm.status === 'received' ? 'Received' : 'Sent'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span className="mr-3">{comm.with}</span>
                    <span>{comm.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {comm.preview}
                  </p>
                  <div className="flex justify-end">
                    <button className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20">
                      View Full Conversation
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Form */}
            <div className="mt-6 bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Send New Message</h4>
              <div className="space-y-3">
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipient
                  </label>
                  <select
                    id="recipient"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                  >
                    <option value="">Select recipient</option>
                    <option value="Ms. Thompson">Ms. Thompson (Class Teacher)</option>
                    <option value="Mr. Roberts">Mr. Roberts (Science Teacher)</option>
                    <option value="School Admin">School Administration</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="Message subject"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Type your message here..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const recipient = document.getElementById('recipient').value;
                      const subject = document.getElementById('subject').value;
                      const message = document.getElementById('message').value;
                      
                      if (recipient && subject && message) {
                        sendMessage(recipient, subject, message);
                        
                        // Clear form
                        document.getElementById('recipient').value = '';
                        document.getElementById('subject').value = '';
                        document.getElementById('message').value = '';
                      }
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Events & Calendar Tab */}
        {activeTab === 'events' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Events & Calendar</h3>
            
            {/* Calendar Placeholder */}
            <div className="mb-6 bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Calendar Component Placeholder
              </div>
            </div>
            
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Upcoming Events</h4>
            <div className="space-y-4">
              {events.map(event => (
                <div 
                  key={event.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-md flex flex-col items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {event.date.split('-')[1]}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {event.date.split('-')[2]}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                        {event.title}
                      </h5>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="mr-3">Time: {event.time}</span>
                        <span>Location: {event.location}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Family Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Family Resources</h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Categories</option>
                  <option value="educational">Educational Support</option>
                  <option value="curriculum">Curriculum</option>
                  <option value="subject">Subject Support</option>
                  <option value="wellbeing">Wellbeing</option>
                </select>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Types</option>
                  <option value="guide">Guides</option>
                  <option value="document">Documents</option>
                  <option value="video">Videos</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map(resource => (
                <div 
                  key={resource.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {resource.type === 'guide' && (
                      <BookOpen className="h-12 w-12 text-blue-500" />
                    )}
                    {resource.type === 'document' && (
                      <FileText className="h-12 w-12 text-red-500" />
                    )}
                    {resource.type === 'video' && (
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                      {resource.title}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="mr-3 capitalize">{resource.type}</span>
                      <span>{resource.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Added: {resource.dateAdded}
                      </span>
                      <button className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20">
                        View Resource
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Support Tab */}
        {activeTab === 'support' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Support & Help</h3>
            
            {/* Support Request Form */}
            <div className="mb-6 bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Submit Support Request</h4>
              <div className="space-y-3">
                <div>
                  <label htmlFor="supportTopic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    id="supportTopic"
                    placeholder="What do you need help with?"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="supportDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="supportDescription"
                    rows={4}
                    placeholder="Please describe your issue in detail..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const topic = document.getElementById('supportTopic').value;
                      const description = document.getElementById('supportDescription').value;
                      
                      if (topic && description) {
                        submitSupportRequest(topic, description);
                        
                        // Clear form
                        document.getElementById('supportTopic').value = '';
                        document.getElementById('supportDescription').value = '';
                      }
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
            
            {/* Support Request History */}
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Your Support Requests</h4>
            <div className="space-y-4">
              {supportRequests.map(request => (
                <div 
                  key={request.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-md font-medium text-gray-900 dark:text-white">
                      {request.topic}
                    </h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'resolved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {request.status === 'resolved' ? 'Resolved' : 'Pending'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Submitted: {request.dateSubmitted}
                  </div>
                  
                  {request.description && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.description}
                      </p>
                    </div>
                  )}
                  
                  {request.response && (
                    <div className="bg-gray-50 dark:bg-neutral-750 p-3 rounded-md">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Response:</span> {request.response}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Quick Help Links */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Quick Help Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md flex items-center">
                  <BookOpen className="h-5 w-5 text-primary mr-3" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">User Guide & FAQs</span>
                </div>
                <div className="p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md flex items-center">
                  <MessageSquare className="h-5 w-5 text-primary mr-3" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Live Chat Support</span>
                </div>
                <div className="p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md flex items-center">
                  <Users className="h-5 w-5 text-primary mr-3" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Contact School Admin</span>
                </div>
                <div className="p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md flex items-center">
                  <Settings className="h-5 w-5 text-primary mr-3" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Account Settings</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentPortal;
