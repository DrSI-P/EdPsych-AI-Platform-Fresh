import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, BarChart2, FileText, Users, MessageSquare, Settings, Clock, CheckCircle, AlertCircle, BookOpen, Mail, Edit, Trash2, Download, Upload, Filter, Search } from 'lucide-react';

/**
 * Educator Tools & Administrative Automation for EdPsych Connect
 * Provides tools for educators to manage students, content, and administrative tasks.
 */
const EducatorTools = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  // Sample educator data
  const [educatorData, setEducatorData] = useState({
    name: 'Ms. Thompson',
    avatar: '/assets/avatars/educator-1.jpg',
    role: 'Year 5 Teacher',
    school: 'Oakwood Primary School',
    classes: ['Year 5A', 'Year 5B'],
    upcomingEvents: [
      { id: 'evt1', title: 'Parent-Teacher Conferences', date: '2025-06-10', time: '16:00' },
      { id: 'evt2', title: 'Staff Meeting', date: '2025-06-12', time: '08:30' },
      { id: 'evt3', title: 'Year 5 Field Trip', date: '2025-06-15', time: '09:00' }
    ]
  });

  // Sample student data for management
  const [students, setStudents] = useState([
    { id: 'stu1', name: 'Alex Johnson', yearGroup: 'Year 5A', progress: 75, alerts: 1, lastLogin: '2025-05-30' },
    { id: 'stu2', name: 'Ben Carter', yearGroup: 'Year 5A', progress: 68, alerts: 0, lastLogin: '2025-05-29' },
    { id: 'stu3', name: 'Chloe Davis', yearGroup: 'Year 5B', progress: 82, alerts: 0, lastLogin: '2025-05-30' },
    { id: 'stu4', name: 'David Evans', yearGroup: 'Year 5B', progress: 60, alerts: 3, lastLogin: '2025-05-28' },
    { id: 'stu5', name: 'Emily Green', yearGroup: 'Year 5A', progress: 90, alerts: 0, lastLogin: '2025-05-30' }
  ]);

  // Sample lesson plan data
  const [lessonPlans, setLessonPlans] = useState([
    { id: 'lp1', title: 'Introduction to Fractions', subject: 'Mathematics', date: '2025-06-02', status: 'draft', resources: 3, objectives: ['Understand basic fraction concepts', 'Identify numerator and denominator'] },
    { id: 'lp2', title: 'Plant Life Cycles', subject: 'Science', date: '2025-06-04', status: 'published', resources: 5, objectives: ['Describe the stages of a plant life cycle', 'Compare different plant life cycles'] },
    { id: 'lp3', title: 'Character Development', subject: 'English', date: '2025-06-06', status: 'draft', resources: 2, objectives: ['Analyze character traits', 'Understand character motivation'] }
  ]);

  // Sample communication data
  const [communications, setCommunications] = useState([
    { id: 'comm1', type: 'message', recipient: 'Alex Johnson (Parent)', subject: 'Progress Update', date: '2025-05-28', status: 'sent' },
    { id: 'comm2', type: 'announcement', recipient: 'Year 5A', subject: 'Field Trip Reminder', date: '2025-05-29', status: 'sent' },
    { id: 'comm3', type: 'message', recipient: 'Ben Carter (Parent)', subject: 'Meeting Request', date: '2025-05-30', status: 'draft' }
  ]);

  // Sample report data
  const [reports, setReports] = useState([
    { id: 'rep1', title: 'Year 5A Progress Report - May', dateGenerated: '2025-05-30', type: 'progress', format: 'pdf' },
    { id: 'rep2', title: 'Student Engagement Analysis', dateGenerated: '2025-05-28', type: 'engagement', format: 'csv' },
    { id: 'rep3', title: 'Class Performance Summary', dateGenerated: '2025-05-25', type: 'performance', format: 'pdf' }
  ]);

  // Sample meeting notes data
  const [meetingNotes, setMeetingNotes] = useState([
    { id: 'note1', title: 'Parent Conference - Alex Johnson', date: '2025-05-20', attendees: ['Ms. Thompson', 'Mr. Johnson'], summary: 'Discussed progress in Math and reading strategies.', transcriptAvailable: true },
    { id: 'note2', title: 'Year 5 Team Meeting', date: '2025-05-22', attendees: ['Ms. Thompson', 'Mr. Smith'], summary: 'Planned upcoming science fair activities.', transcriptAvailable: false }
  ]);

  // Function to generate a report (placeholder)
  const generateReport = (type) => {
    setIsLoading(true);
    console.log(`Generating ${type} report...`);
    // Simulate report generation
    setTimeout(() => {
      const newReport = {
        id: `rep${reports.length + 1}`,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
        dateGenerated: new Date().toISOString().split('T')[0],
        type: type,
        format: 'pdf'
      };
      setReports(prev => [newReport, ...prev]);
      setIsLoading(false);
      console.log('Report generated.');
    }, 2000);
  };

  // Function to transcribe meeting notes (placeholder)
  const transcribeMeeting = (noteId) => {
    setIsLoading(true);
    console.log(`Transcribing meeting ${noteId}...`);
    // Simulate transcription
    setTimeout(() => {
      setMeetingNotes(prev => 
        prev.map(note => 
          note.id === noteId ? { ...note, transcriptAvailable: true } : note
        )
      );
      setIsLoading(false);
      console.log('Transcription complete.');
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
              <img 
                src={educatorData.avatar} 
                alt={educatorData.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Welcome, {educatorData.name}!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {educatorData.role} • {educatorData.school}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-primary">
              Managing Classes: {educatorData.classes.join(', ')}
            </div>
            <button className="mt-1 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 flex items-center">
              <Settings className="h-3 w-3 mr-1" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-2" />
              <span>Dashboard</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'students'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Student Management</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('lesson-planning')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'lesson-planning'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Lesson Planning</span>
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
              <span>Communication</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'reports'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Reports & Analytics</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Calendar & Events</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('meetings')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'meetings'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Meeting Notes</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md shadow">
                <div className="flex items-center mb-2">
                  <Users className="h-6 w-6 text-primary mr-3" />
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Total Students</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{students.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Across {educatorData.classes.length} classes</p>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md shadow">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Active Alerts</h4>
                </div>
                <p className="text-3xl font-bold text-red-500">
                  {students.reduce((acc, stu) => acc + stu.alerts, 0)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Requiring attention</p>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md shadow">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Assignments Graded</h4>
                </div>
                <p className="text-3xl font-bold text-green-500">85%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">For this week</p>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md shadow">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-6 w-6 text-blue-500 mr-3" />
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Unread Messages</h4>
                </div>
                <p className="text-3xl font-bold text-blue-500">3</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">From parents & students</p>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {educatorData.upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-start">
                    <Calendar className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.date} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20">
                View Full Calendar
              </button>
            </div>

            {/* Class Performance Overview */}
            <div className="lg:col-span-3 bg-gray-50 dark:bg-neutral-750 p-4 rounded-md shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Class Performance Overview</h3>
              {/* Placeholder for chart */} 
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Chart Placeholder (e.g., Average progress per class)
              </div>
            </div>
          </div>
        )}

        {/* Student Management Tab */}
        {activeTab === 'students' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Student Management</h3>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search students..." 
                    className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                  />
                </div>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white px-3 py-1.5">
                  <option value="all">All Classes</option>
                  {educatorData.classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
                <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 flex items-center">
                  <Filter className="h-4 w-4 mr-1" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-neutral-750">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Class</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Progress</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Alerts</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Login</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.yearGroup}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                        </div>
                        <span className="ml-2">{student.progress}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {student.alerts > 0 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            {student.alerts} Alert{student.alerts > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            No Alerts
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.lastLogin}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-primary hover:text-primary/80"><Users className="h-4 w-4 inline"/> Profile</button>
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"><MessageSquare className="h-4 w-4 inline"/> Message</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lesson Planning Tab */}
        {activeTab === 'lesson-planning' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Lesson Planning</h3>
              <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 flex items-center">
                <Edit className="h-4 w-4 mr-1" />
                <span>Create New Lesson Plan</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {lessonPlans.map(plan => (
                <div key={plan.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">{plan.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="mr-3">{plan.subject}</span>
                        <span>Date: {plan.date}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span className="font-medium">Objectives:</span>
                        <ul className="list-disc list-inside ml-2">
                          {plan.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${plan.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'}`}>
                        {plan.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{plan.resources} Resources Attached</span>
                    <div className="space-x-2">
                      <button className="text-primary hover:text-primary/80 text-sm"><Edit className="h-4 w-4 inline mr-1"/> Edit</button>
                      <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"><Trash2 className="h-4 w-4 inline mr-1"/> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* AI Smart Lesson Planning suggestion section could go here */}
            <div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-md border border-primary/20">
              <h4 className="text-md font-medium text-primary mb-2">AI Lesson Plan Suggestions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Based on recent class performance and upcoming curriculum topics, consider creating lessons on:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Advanced Fraction Operations (Year 5A)</li>
                <li>Comparing Plant and Animal Life Cycles (Year 5B)</li>
                <li>Using Descriptive Language in Stories (Year 5A & 5B)</li>
              </ul>
              <button className="mt-3 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90">
                Generate Draft Plans
              </button>
            </div>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Communication Center</h3>
              <div className="space-x-2">
                <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>Compose Message</span>
                </button>
                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>New Announcement</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {communications.map(comm => (
                <div key={comm.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">{comm.subject}</h4>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="mr-3 capitalize">{comm.type} to: {comm.recipient}</span>
                        <span>Date: {comm.date}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${comm.status === 'sent' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'}`}>
                        {comm.status === 'sent' ? 'Sent' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button className="text-primary hover:text-primary/80 text-sm"><BookOpen className="h-4 w-4 inline mr-1"/> View</button>
                    {comm.status === 'draft' && <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"><Edit className="h-4 w-4 inline mr-1"/> Edit</button>}
                    <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"><Trash2 className="h-4 w-4 inline mr-1"/> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports & Analytics Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Reports & Analytics</h3>
              <div className="space-x-2">
                <button onClick={() => generateReport('progress')} disabled={isLoading} className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 flex items-center disabled:opacity-50">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Generate Progress Report</span>
                </button>
                <button onClick={() => generateReport('engagement')} disabled={isLoading} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50">
                  <BarChart2 className="h-4 w-4 mr-1" />
                  <span>Generate Engagement Report</span>
                </button>
              </div>
            </div>
            
            {/* Data Visualization Dashboard Placeholder */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-neutral-750 rounded-md shadow">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Data Visualization Dashboard</h4>
              <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Placeholder for interactive charts (e.g., class progress trends, engagement levels)
              </div>
            </div>

            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Generated Reports</h4>
            <div className="space-y-4">
              {reports.map(report => (
                <div key={report.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Generated: {report.dateGenerated} • Type: {report.type} • Format: {report.format.toUpperCase()}</p>
                  </div>
                  <div className="space-x-2">
                    <button className="text-primary hover:text-primary/80 text-sm"><Download className="h-4 w-4 inline mr-1"/> Download</button>
                    <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"><Trash2 className="h-4 w-4 inline mr-1"/> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar & Events Tab */}
        {activeTab === 'calendar' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Calendar & Events</h3>
            {/* Placeholder for a full calendar component */}
            <div className="h-96 bg-gray-50 dark:bg-neutral-750 rounded-md shadow flex items-center justify-center text-gray-400 dark:text-gray-500">
              Full Calendar Component Placeholder (e.g., using react-big-calendar)
            </div>
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Upcoming Events List</h4>
              <div className="space-y-3">
                {educatorData.upcomingEvents.map(event => (
                  <div key={event.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{event.date} at {event.time}</p>
                    </div>
                    <button className="text-primary hover:text-primary/80 text-sm">View Details</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Meeting Notes Tab */}
        {activeTab === 'meetings' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Meeting Notes</h3>
              <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 flex items-center">
                <Edit className="h-4 w-4 mr-1" />
                <span>Add New Meeting Note</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {meetingNotes.map(note => (
                <div key={note.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">{note.title}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{note.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="font-medium">Attendees:</span> {note.attendees.join(', ')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="font-medium">Summary:</span> {note.summary}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => transcribeMeeting(note.id)} 
                      disabled={note.transcriptAvailable || isLoading}
                      className={`px-3 py-1.5 text-xs rounded-md flex items-center ${note.transcriptAvailable ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'}`}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      {note.transcriptAvailable ? 'Transcript Available' : 'Transcribe Audio'}
                    </button>
                    <button className="text-primary hover:text-primary/80 text-sm"><BookOpen className="h-4 w-4 inline mr-1"/> View Details</button>
                    <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"><Trash2 className="h-4 w-4 inline mr-1"/> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducatorTools;

