import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Book, Calendar, Award, BarChart2, Clock, CheckCircle, AlertCircle, BookOpen, FileText, Users, Star } from 'lucide-react';

/**
 * Student Dashboard & Learning Portal for EdPsych Connect
 * Provides personalized learning experience for students
 */
const StudentDashboard = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample student data
  const [studentData, setStudentData] = useState({
    name: 'Alex Johnson',
    avatar: '/assets/avatars/student-1.jpg',
    yearGroup: 'Year 5',
    school: 'Oakwood Primary School',
    learningStyle: 'Visual',
    interests: ['Science', 'Art', 'Reading'],
    recentActivity: [
      { id: 'act1', type: 'lesson', title: 'Introduction to Fractions', date: '2025-05-29', status: 'completed' },
      { id: 'act2', type: 'quiz', title: 'Fractions Quiz', date: '2025-05-29', status: 'completed', score: 85 },
      { id: 'act3', type: 'video', title: 'Understanding Emotions', date: '2025-05-28', status: 'completed' },
      { id: 'act4', type: 'assignment', title: 'Reading Comprehension', date: '2025-05-27', status: 'in-progress' },
      { id: 'act5', type: 'resource', title: 'Mindfulness Guide', date: '2025-05-26', status: 'viewed' }
    ]
  });
  
  // Sample learning path data
  const [learningPath, setLearningPath] = useState({
    currentModule: 'Mathematics: Fractions',
    progress: 65,
    nextSteps: [
      { id: 'step1', title: 'Comparing Fractions', type: 'lesson', dueDate: '2025-06-01', completed: false },
      { id: 'step2', title: 'Equivalent Fractions', type: 'interactive', dueDate: '2025-06-03', completed: false },
      { id: 'step3', title: 'Fractions Assessment', type: 'quiz', dueDate: '2025-06-05', completed: false }
    ],
    recommendations: [
      { id: 'rec1', title: 'Visual Fraction Models', type: 'resource', relevance: 'high' },
      { id: 'rec2', title: 'Fraction Games', type: 'interactive', relevance: 'medium' },
      { id: 'rec3', title: 'Real-world Applications', type: 'video', relevance: 'high' }
    ]
  });
  
  // Sample assignments data
  const [assignments, setAssignments] = useState([
    { 
      id: 'assign1', 
      title: 'Reading Comprehension Exercise', 
      subject: 'English',
      dueDate: '2025-06-01',
      status: 'in-progress',
      description: 'Read the passage and answer the questions about the main characters and plot.',
      resources: [
        { title: 'Story Passage', type: 'pdf' },
        { title: 'Question Sheet', type: 'worksheet' }
      ]
    },
    { 
      id: 'assign2', 
      title: 'Fractions Worksheet', 
      subject: 'Mathematics',
      dueDate: '2025-06-03',
      status: 'not-started',
      description: 'Complete the worksheet on adding and subtracting fractions with different denominators.',
      resources: [
        { title: 'Fractions Worksheet', type: 'worksheet' },
        { title: 'Fractions Guide', type: 'reference' }
      ]
    },
    { 
      id: 'assign3', 
      title: 'Plant Life Cycle Diagram', 
      subject: 'Science',
      dueDate: '2025-06-05',
      status: 'not-started',
      description: 'Create a diagram showing the life cycle of a flowering plant.',
      resources: [
        { title: 'Plant Life Cycle Reference', type: 'pdf' },
        { title: 'Diagram Template', type: 'worksheet' }
      ]
    }
  ]);
  
  // Sample achievements data
  const [achievements, setAchievements] = useState([
    { 
      id: 'ach1', 
      title: 'Math Master', 
      description: 'Completed 10 math lessons with 80% or higher score',
      dateEarned: '2025-05-20',
      icon: 'award',
      category: 'academic'
    },
    { 
      id: 'ach2', 
      title: 'Reading Explorer', 
      description: 'Read 5 different stories and completed comprehension activities',
      dateEarned: '2025-05-15',
      icon: 'book',
      category: 'academic'
    },
    { 
      id: 'ach3', 
      title: 'Emotion Detective', 
      description: 'Completed the emotional awareness course',
      dateEarned: '2025-05-10',
      icon: 'heart',
      category: 'social-emotional'
    },
    { 
      id: 'ach4', 
      title: 'Consistent Learner', 
      description: 'Logged in for 10 consecutive days',
      dateEarned: '2025-05-05',
      icon: 'calendar',
      category: 'engagement'
    },
    { 
      id: 'ach5', 
      title: 'Helping Hand', 
      description: 'Provided helpful responses to 5 classmates in discussion forums',
      dateEarned: '2025-04-28',
      icon: 'users',
      category: 'social'
    }
  ]);
  
  // Sample resources data
  const [resources, setResources] = useState([
    { 
      id: 'res1', 
      title: 'Fractions Visual Guide', 
      type: 'pdf',
      subject: 'Mathematics',
      dateAdded: '2025-05-25',
      recommended: true,
      viewed: true
    },
    { 
      id: 'res2', 
      title: 'Reading Comprehension Strategies', 
      type: 'video',
      subject: 'English',
      dateAdded: '2025-05-23',
      recommended: true,
      viewed: false
    },
    { 
      id: 'res3', 
      title: 'Plant Life Cycle Diagram', 
      type: 'interactive',
      subject: 'Science',
      dateAdded: '2025-05-20',
      recommended: false,
      viewed: true
    },
    { 
      id: 'res4', 
      title: 'Mindfulness for Focus', 
      type: 'audio',
      subject: 'Wellbeing',
      dateAdded: '2025-05-18',
      recommended: true,
      viewed: true
    },
    { 
      id: 'res5', 
      title: 'Times Tables Practice', 
      type: 'game',
      subject: 'Mathematics',
      dateAdded: '2025-05-15',
      recommended: false,
      viewed: true
    }
  ]);
  
  // Sample help requests data
  const [helpRequests, setHelpRequests] = useState([
    { 
      id: 'help1', 
      topic: 'Fractions Division', 
      subject: 'Mathematics',
      dateSubmitted: '2025-05-28',
      status: 'answered',
      response: 'When dividing fractions, remember to flip the second fraction and multiply. I\'ve added a visual guide to your resources.',
      responder: 'Ms. Thompson'
    },
    { 
      id: 'help2', 
      topic: 'Reading Assignment Question', 
      subject: 'English',
      dateSubmitted: '2025-05-26',
      status: 'pending',
      question: 'I\'m having trouble understanding the main character\'s motivation in chapter 3. Can you explain it?'
    }
  ]);
  
  // Sample progress data for charts
  const [progressData, setProgressData] = useState({
    subjects: [
      { name: 'Mathematics', progress: 75, target: 80 },
      { name: 'English', progress: 68, target: 75 },
      { name: 'Science', progress: 82, target: 75 },
      { name: 'Social Studies', progress: 60, target: 70 }
    ],
    skills: [
      { name: 'Critical Thinking', level: 4, maxLevel: 5 },
      { name: 'Problem Solving', level: 3, maxLevel: 5 },
      { name: 'Communication', level: 4, maxLevel: 5 },
      { name: 'Creativity', level: 5, maxLevel: 5 },
      { name: 'Collaboration', level: 3, maxLevel: 5 }
    ],
    weeklyActivity: [
      { day: 'Monday', minutes: 45 },
      { day: 'Tuesday', minutes: 30 },
      { day: 'Wednesday', minutes: 60 },
      { day: 'Thursday', minutes: 45 },
      { day: 'Friday', minutes: 20 },
      { day: 'Saturday', minutes: 15 },
      { day: 'Sunday', minutes: 0 }
    ]
  });
  
  // Mark assignment as started
  const startAssignment = (assignmentId) => {
    setAssignments(prevAssignments => 
      prevAssignments.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: 'in-progress' } 
          : assignment
      )
    );
  };
  
  // Mark resource as viewed
  const viewResource = (resourceId) => {
    setResources(prevResources => 
      prevResources.map(resource => 
        resource.id === resourceId 
          ? { ...resource, viewed: true } 
          : resource
      )
    );
  };
  
  // Submit new help request
  const submitHelpRequest = (topic, subject, question) => {
    const newRequest = {
      id: `help${helpRequests.length + 1}`,
      topic,
      subject,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'pending',
      question
    };
    
    setHelpRequests(prevRequests => [newRequest, ...prevRequests]);
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
              <img 
                src={studentData.avatar} 
                alt={studentData.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Welcome back, {studentData.name}!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {studentData.yearGroup} • {studentData.school}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-primary">
              Learning Style: {studentData.learningStyle}
            </div>
            <div className="flex mt-1 space-x-1">
              {studentData.interests.map((interest, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
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
              <BarChart2 className="h-4 w-4 mr-2" />
              <span>Overview</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('learning-path')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'learning-path'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Book className="h-4 w-4 mr-2" />
              <span>Learning Path</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'assignments'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Assignments</span>
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
              <span>Resources</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2" />
              <span>Achievements</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'help'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Help & Support</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Current Module Progress */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Module Progress</h3>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    {learningPath.currentModule}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {learningPath.progress}% Complete
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${learningPath.progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Next: {learningPath.nextSteps[0].title}</span>
                  <span>Due: {learningPath.nextSteps[0].dueDate}</span>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {studentData.recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-center p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    <div className="mr-3">
                      {activity.type === 'lesson' && <Book className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'quiz' && <FileText className="h-5 w-5 text-amber-500" />}
                      {activity.type === 'video' && <BookOpen className="h-5 w-5 text-purple-500" />}
                      {activity.type === 'assignment' && <FileText className="h-5 w-5 text-green-500" />}
                      {activity.type === 'resource' && <BookOpen className="h-5 w-5 text-red-500" />}
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
                      {activity.status === 'completed' && (
                        <div className="flex items-center text-green-500">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">
                            {activity.score ? `${activity.score}%` : 'Completed'}
                          </span>
                        </div>
                      )}
                      {activity.status === 'in-progress' && (
                        <div className="flex items-center text-amber-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-xs">In Progress</span>
                        </div>
                      )}
                      {activity.status === 'viewed' && (
                        <div className="flex items-center text-blue-500">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">Viewed</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Subject Progress */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subject Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {progressData.subjects.map((subject, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">
                        {subject.name}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {subject.progress}% / Target: {subject.target}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                      <div 
                        className={`h-2.5 rounded-full ${
                          subject.progress >= subject.target 
                            ? 'bg-green-500' 
                            : subject.progress >= subject.target * 0.8 
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }`} 
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Weekly Activity */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly Activity</h3>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
                <div className="flex items-end h-40 space-x-4">
                  {progressData.weeklyActivity.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-primary rounded-t-md" 
                        style={{ 
                          height: `${(day.minutes / 60) * 100}%`,
                          minHeight: day.minutes > 0 ? '4px' : '0'
                        }}
                      ></div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {day.day.substring(0, 3)}
                      </div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {day.minutes}m
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Learning Path Tab */}
        {activeTab === 'learning-path' && (
          <div>
            {/* Current Module */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Learning Path</h3>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    {learningPath.currentModule}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {learningPath.progress}% Complete
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${learningPath.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Next Steps</h4>
              <div className="space-y-3 mb-6">
                {learningPath.nextSteps.map((step, index) => (
                  <div 
                    key={step.id}
                    className="flex items-center p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        {step.title}
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {step.type} • Due: {step.dueDate}
                      </p>
                    </div>
                    <div>
                      <button className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary/90">
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Recommended Resources</h4>
              <div className="space-y-3">
                {learningPath.recommendations.map(rec => (
                  <div 
                    key={rec.id}
                    className="flex justify-between items-center p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        {rec.type === 'resource' && <BookOpen className="h-5 w-5 text-blue-500" />}
                        {rec.type === 'interactive' && <Book className="h-5 w-5 text-amber-500" />}
                        {rec.type === 'video' && <BookOpen className="h-5 w-5 text-purple-500" />}
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          {rec.title}
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {rec.type}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        rec.relevance === 'high' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {rec.relevance} relevance
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Skills Progress */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Skills Development</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {progressData.skills.map((skill, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Level {skill.level}/{skill.maxLevel}
                      </span>
                    </div>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: skill.maxLevel }).map((_, i) => (
                        <div 
                          key={i}
                          className={`h-2 flex-1 rounded-full ${
                            i < skill.level ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Assignments</h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Subjects</option>
                  <option value="english">English</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                </select>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {assignments.map(assignment => (
                <div 
                  key={assignment.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                          {assignment.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span className="mr-3">{assignment.subject}</span>
                          <span>Due: {assignment.dueDate}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {assignment.description}
                        </p>
                      </div>
                      <div>
                        {assignment.status === 'completed' && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Completed
                          </span>
                        )}
                        {assignment.status === 'in-progress' && (
                          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                            In Progress
                          </span>
                        )}
                        {assignment.status === 'not-started' && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            Not Started
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {assignment.resources.map((resource, index) => (
                        <div 
                          key={index}
                          className="flex items-center px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                        >
                          <BookOpen className="h-3 w-3 mr-1" />
                          {resource.title}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end">
                      {assignment.status === 'not-started' && (
                        <button 
                          onClick={() => startAssignment(assignment.id)}
                          className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                        >
                          Start Assignment
                        </button>
                      )}
                      {assignment.status === 'in-progress' && (
                        <button 
                          className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                        >
                          Continue Assignment
                        </button>
                      )}
                      {assignment.status === 'completed' && (
                        <button 
                          className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                        >
                          View Feedback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Learning Resources</h3>
              <div className="flex space-x-2">
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Subjects</option>
                  <option value="english">English</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="wellbeing">Wellbeing</option>
                </select>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Types</option>
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="interactive">Interactive</option>
                  <option value="audio">Audio</option>
                  <option value="game">Game</option>
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
                    {resource.type === 'pdf' && (
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
                    {resource.type === 'interactive' && (
                      <Book className="h-12 w-12 text-blue-500" />
                    )}
                    {resource.type === 'audio' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    )}
                    {resource.type === 'game' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                      </svg>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">
                        {resource.title}
                      </h4>
                      {resource.recommended && (
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="mr-3 capitalize">{resource.type}</span>
                      <span>{resource.subject}</span>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={() => viewResource(resource.id)}
                        className={`px-3 py-1.5 text-sm rounded-md ${
                          resource.viewed
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                      >
                        {resource.viewed ? 'View Again' : 'View Resource'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Achievements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                >
                  <div className="p-4 flex items-center">
                    <div className="mr-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {achievement.icon === 'award' && <Award className="h-6 w-6 text-primary" />}
                      {achievement.icon === 'book' && <Book className="h-6 w-6 text-primary" />}
                      {achievement.icon === 'heart' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      )}
                      {achievement.icon === 'calendar' && <Calendar className="h-6 w-6 text-primary" />}
                      {achievement.icon === 'users' && <Users className="h-6 w-6 text-primary" />}
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {achievement.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span className="mr-2">Earned: {achievement.dateEarned}</span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          achievement.category === 'academic'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : achievement.category === 'social-emotional'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                              : achievement.category === 'engagement'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                        }`}>
                          {achievement.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Help & Support Tab */}
        {activeTab === 'help' && (
          <div>
            {/* Ask for Help Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ask for Help</h3>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="helpTopic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Topic
                    </label>
                    <input
                      type="text"
                      id="helpTopic"
                      placeholder="What do you need help with?"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="helpSubject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject
                    </label>
                    <select
                      id="helpSubject"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="English">English</option>
                      <option value="Science">Science</option>
                      <option value="Social Studies">Social Studies</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="helpQuestion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Question
                    </label>
                    <textarea
                      id="helpQuestion"
                      rows={4}
                      placeholder="Describe what you need help with in detail..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        const topic = document.getElementById('helpTopic').value;
                        const subject = document.getElementById('helpSubject').value;
                        const question = document.getElementById('helpQuestion').value;
                        
                        if (topic && subject && question) {
                          submitHelpRequest(topic, subject, question);
                          
                          // Clear form
                          document.getElementById('helpTopic').value = '';
                          document.getElementById('helpSubject').value = '';
                          document.getElementById('helpQuestion').value = '';
                        }
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Submit Question
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Help Requests */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Help Requests</h3>
              
              {helpRequests.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-neutral-750 rounded-md">
                  <p className="text-gray-500 dark:text-gray-400">You haven't submitted any help requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {helpRequests.map(request => (
                    <div 
                      key={request.id}
                      className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-md font-medium text-gray-900 dark:text-white">
                            {request.topic}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.status === 'answered'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                          }`}>
                            {request.status === 'answered' ? 'Answered' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span className="mr-3">{request.subject}</span>
                          <span>Submitted: {request.dateSubmitted}</span>
                        </div>
                        
                        {request.question && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Your question:</span> {request.question}
                            </p>
                          </div>
                        )}
                        
                        {request.response && (
                          <div className="bg-gray-50 dark:bg-neutral-750 p-3 rounded-md mb-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">{request.responder}:</span> {request.response}
                            </p>
                          </div>
                        )}
                        
                        {request.status === 'answered' && (
                          <div className="flex justify-end">
                            <button className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20">
                              Ask Follow-up
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
