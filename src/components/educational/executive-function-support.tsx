import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CheckSquare, Calendar, Clock, List, Search, Plus, Download, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Executive Function Support component for EdPsych Connect
 * Provides tools and resources for supporting executive function skills
 */
const ExecutiveFunctionSupport = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [planners, setPlanners] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [resources, setResources] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  
  // Check if user has appropriate permissions
  const isStudent = session?.user?.role === 'student';
  const canManage = session?.user?.role === 'educator' || session?.user?.role === 'admin' || session?.user?.role === 'professional';
  
  // Fetch executive function data
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;
      
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        
        // Mock tasks data
        const mockTasks = [
          {
            id: '1',
            title: 'Complete Maths Homework',
            category: 'school',
            priority: 'high',
            dueDate: '2023-05-31T15:00:00Z',
            status: 'pending',
            steps: [
              { id: '1-1', text: 'Review lesson notes', completed: true },
              { id: '1-2', text: 'Complete practice problems 1-10', completed: false },
              { id: '1-3', text: 'Check answers with worked examples', completed: false }
            ],
            reminders: ['2023-05-30T18:00:00Z']
          },
          {
            id: '2',
            title: 'Prepare Science Project',
            category: 'school',
            priority: 'medium',
            dueDate: '2023-06-05T09:00:00Z',
            status: 'in-progress',
            steps: [
              { id: '2-1', text: 'Choose topic', completed: true },
              { id: '2-2', text: 'Research information', completed: true },
              { id: '2-3', text: 'Create presentation slides', completed: false },
              { id: '2-4', text: 'Practice presentation', completed: false }
            ],
            reminders: ['2023-06-02T16:00:00Z', '2023-06-04T18:00:00Z']
          },
          {
            id: '3',
            title: 'Clean Bedroom',
            category: 'home',
            priority: 'low',
            dueDate: '2023-06-01T12:00:00Z',
            status: 'pending',
            steps: [
              { id: '3-1', text: 'Put away clothes', completed: false },
              { id: '3-2', text: 'Organize desk', completed: false },
              { id: '3-3', text: 'Vacuum floor', completed: false }
            ],
            reminders: ['2023-05-31T17:00:00Z']
          },
          {
            id: '4',
            title: 'Read Book for English Class',
            category: 'school',
            priority: 'medium',
            dueDate: '2023-06-07T09:00:00Z',
            status: 'pending',
            steps: [
              { id: '4-1', text: 'Read chapters 1-3', completed: false },
              { id: '4-2', text: 'Take notes on main characters', completed: false },
              { id: '4-3', text: 'Identify key themes', completed: false },
              { id: '4-4', text: 'Prepare discussion points', completed: false }
            ],
            reminders: ['2023-06-03T18:00:00Z', '2023-06-06T18:00:00Z']
          }
        ];
        
        // Mock planners data
        const mockPlanners = [
          {
            id: '1',
            name: 'Weekly Schedule',
            type: 'time',
            description: 'Visual weekly timetable with colour-coded subjects and activities',
            lastUpdated: '2023-05-28T14:30:00Z'
          },
          {
            id: '2',
            name: 'Homework Tracker',
            type: 'task',
            description: 'Track assignments, due dates, and completion status',
            lastUpdated: '2023-05-29T09:45:00Z'
          },
          {
            id: '3',
            name: 'Project Planner',
            type: 'project',
            description: 'Break down large projects into manageable steps with timelines',
            lastUpdated: '2023-05-25T16:20:00Z'
          },
          {
            id: '4',
            name: 'Study Schedule',
            type: 'time',
            description: 'Organize study sessions with specific subjects and goals',
            lastUpdated: '2023-05-27T11:15:00Z'
          }
        ];
        
        // Mock strategies data
        const mockStrategies = [
          {
            id: '1',
            name: 'Pomodoro Technique',
            category: 'time-management',
            description: 'Work in focused 25-minute intervals with short breaks in between',
            steps: [
              'Choose a task to work on',
              'Set a timer for 25 minutes',
              'Work on the task until the timer rings',
              'Take a short 5-minute break',
              'After 4 pomodoros, take a longer 15-30 minute break'
            ],
            effectiveness: 4.5,
            usageCount: 245
          },
          {
            id: '2',
            name: 'Task Prioritization Matrix',
            category: 'organization',
            description: 'Categorize tasks by importance and urgency to determine priority',
            steps: [
              'List all tasks',
              'Evaluate each task for importance (high/low)',
              'Evaluate each task for urgency (high/low)',
              'Place in appropriate quadrant: Important & Urgent, Important & Not Urgent, Not Important & Urgent, Not Important & Not Urgent',
              'Focus on Important & Urgent first, then Important & Not Urgent'
            ],
            effectiveness: 4.2,
            usageCount: 178
          },
          {
            id: '3',
            name: 'Chunking Information',
            category: 'working-memory',
            description: 'Break down complex information into smaller, manageable chunks',
            steps: [
              'Review the information to be learned',
              'Identify natural groupings or categories',
              'Create meaningful chunks of 3-5 items',
              'Practice recalling each chunk',
              'Gradually connect chunks together'
            ],
            effectiveness: 4.3,
            usageCount: 203
          },
          {
            id: '4',
            name: 'Visual Schedules',
            category: 'planning',
            description: 'Create visual representations of daily routines and schedules',
            steps: [
              'Identify activities for the day/week',
              'Create or select visual symbols for each activity',
              'Arrange in chronological order',
              'Review schedule at the start of each day',
              'Check off or move items as completed'
            ],
            effectiveness: 4.4,
            usageCount: 189
          },
          {
            id: '5',
            name: 'Two-Minute Rule',
            category: 'task-management',
            description: 'If a task takes less than two minutes, do it immediately',
            steps: [
              'When you encounter a task, estimate how long it will take',
              'If it takes less than two minutes, do it right away',
              'If it takes longer, schedule it or delegate it',
              'Apply to emails, small chores, and quick decisions'
            ],
            effectiveness: 4.1,
            usageCount: 267
          }
        ];
        
        // Mock resources data
        const mockResources = [
          {
            id: '1',
            title: 'Executive Function Skills Guide',
            type: 'guide',
            audience: 'educators',
            category: 'general',
            format: 'pdf',
            downloads: 312,
            lastUpdated: '2023-04-15T11:30:00Z'
          },
          {
            id: '2',
            title: 'Time Management Strategies',
            type: 'toolkit',
            audience: 'students',
            category: 'time-management',
            format: 'interactive',
            downloads: 287,
            lastUpdated: '2023-04-20T09:45:00Z'
          },
          {
            id: '3',
            title: 'Organization Skills Workbook',
            type: 'workbook',
            audience: 'students',
            category: 'organization',
            format: 'pdf',
            downloads: 245,
            lastUpdated: '2023-05-02T14:15:00Z'
          },
          {
            id: '4',
            title: 'Supporting Working Memory in the Classroom',
            type: 'guide',
            audience: 'educators',
            category: 'working-memory',
            format: 'pdf',
            downloads: 178,
            lastUpdated: '2023-04-10T10:20:00Z'
          },
          {
            id: '5',
            title: 'Planning and Prioritization Activities',
            type: 'toolkit',
            audience: 'all',
            category: 'planning',
            format: 'interactive',
            downloads: 298,
            lastUpdated: '2023-05-08T13:40:00Z'
          }
        ];
        
        setTasks(mockTasks);
        setPlanners(mockPlanners);
        setStrategies(mockStrategies);
        setResources(mockResources);
      } catch (error) {
        setErrorMessage('Failed to load executive function data');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [session]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  // Format date for tasks
  const formatTaskDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };
  
  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    const priorities = {
      'high': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-300', label: 'High' },
      'medium': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-300', label: 'Medium' },
      'low': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-300', label: 'Low' }
    };
    
    const style = priorities[priority] || { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', label: priority };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };
  
  // Get category badge styling
  const getCategoryBadge = (category) => {
    const categories = {
      'school': { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-300', label: 'School' },
      'home': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-300', label: 'Home' },
      'personal': { bg: 'bg-teal-100 dark:bg-teal-900', text: 'text-teal-800 dark:text-teal-300', label: 'Personal' },
      'time-management': { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-300', label: 'Time Management' },
      'organization': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-300', label: 'Organization' },
      'working-memory': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-300', label: 'Working Memory' },
      'planning': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-300', label: 'Planning' },
      'task-management': { bg: 'bg-teal-100 dark:bg-teal-900', text: 'text-teal-800 dark:text-teal-300', label: 'Task Management' }
    };
    
    const style = categories[category] || { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', label: category };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };
  
  // Filter data based on search and category
  const filterData = (data, searchField = 'title', categoryField = 'category') => {
    return data.filter(item => {
      const searchValue = item[searchField] || '';
      const categoryValue = item[categoryField] || '';
      
      const matchesSearch = searchValue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || categoryValue === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  };
  
  // Filtered data
  const filteredTasks = filterData(tasks);
  const filteredPlanners = filterData(planners, 'name', 'type');
  const filteredStrategies = filterData(strategies, 'name');
  const filteredResources = filterData(resources);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Executive Function Support</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tools and resources for supporting planning, organization, and time management
            </p>
          </div>
          
          {isStudent && (
            <div className="mt-4 md:mt-0">
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center gap-2 hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add New Task
              </button>
            </div>
          )}
          
          {canManage && (
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center gap-2 hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add Resource
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
        
        {/* Category Filter */}
        <div className="relative">
          <select
            value={filterCategory}
            onChange={handleFilterChange}
            className="pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white appearance-none"
          >
            <option value="all">All Categories</option>
            {activeTab === 'tasks' && (
              <>
                <option value="school">School</option>
                <option value="home">Home</option>
                <option value="personal">Personal</option>
              </>
            )}
            {activeTab === 'strategies' && (
              <>
                <option value="time-management">Time Management</option>
                <option value="organization">Organization</option>
                <option value="working-memory">Working Memory</option>
                <option value="planning">Planning</option>
                <option value="task-management">Task Management</option>
              </>
            )}
            {activeTab === 'resources' && (
              <>
                <option value="general">General</option>
                <option value="time-management">Time Management</option>
                <option value="organization">Organization</option>
                <option value="working-memory">Working Memory</option>
                <option value="planning">Planning</option>
              </>
            )}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'tasks'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <CheckSquare className="inline-block h-4 w-4 mr-2" />
            Task Management
          </button>
          <button 
            onClick={() => setActiveTab('planners')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'planners'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Calendar className="inline-block h-4 w-4 mr-2" />
            Planners
          </button>
          <button 
            onClick={() => setActiveTab('strategies')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'strategies'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <List className="inline-block h-4 w-4 mr-2" />
            Strategies
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'resources'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Clock className="inline-block h-4 w-4 mr-2" />
            Resources
          </button>
        </nav>
      </div>
      
      {/* Task Management Tab */}
      {activeTab === 'tasks' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Task Management
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                School
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Home
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">
                Personal
              </button>
            </div>
          </div>
          
          {isStudent && (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <div 
                  key={task.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleSection(task.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <input 
                            type="checkbox" 
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
                            checked={task.status === 'completed'}
                            readOnly
                          />
                        </div>
                        <div>
                          <h4 className={`text-md font-medium ${
                            task.status === 'completed' 
                              ? 'text-gray-500 dark:text-gray-400 line-through' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h4>
                          <div className="flex items-center mt-1 space-x-2">
                            {getCategoryBadge(task.category)}
                            {getPriorityBadge(task.priority)}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Due: {formatTaskDate(task.dueDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {expandedSections[task.id] ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {expandedSections[task.id] && (
                    <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="pt-3">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Steps:</h5>
                        <ul className="space-y-2">
                          {task.steps.map(step => (
                            <li key={step.id} className="flex items-center">
                              <input 
                                type="checkbox" 
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700 mr-2"
                                checked={step.completed}
                                readOnly
                              />
                              <span className={`text-sm ${
                                step.completed 
                                  ? 'text-gray-500 dark:text-gray-400 line-through' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {step.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {task.reminders && task.reminders.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reminders:</h5>
                          <ul className="space-y-1">
                            {task.reminders.map((reminder, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                {formatTaskDate(reminder)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-end space-x-2">
                        <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary/90">
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {!isStudent && (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Task Management</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Task management is available for student accounts. As an educator, you can view and manage resources to support executive function skills.
              </p>
            </div>
          )}
          
          {isStudent && filteredTasks.length === 0 && (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tasks found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'You have no tasks yet. Add your first task to get started!'}
              </p>
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add First Task
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Planners Tab */}
      {activeTab === 'planners' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Planning Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Time
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Task
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Project
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlanners.map(planner => (
              <div 
                key={planner.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {planner.name}
                    </h4>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
                      {planner.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {planner.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: {formatDate(planner.lastUpdated)}
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-750 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {planner.type === 'time' ? 'Schedule your time' : 
                     planner.type === 'task' ? 'Organize your tasks' : 
                     'Plan your projects'}
                  </span>
                  <Link href={`/executive-function/planners/${planner.id}`}>
                    <span className="text-xs text-primary hover:text-primary/80">
                      Open Planner
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {filteredPlanners.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No planners found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'There are no planners available yet'}
              </p>
              {isStudent && (
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Create New Planner
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Strategies Tab */}
      {activeTab === 'strategies' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Executive Function Strategies
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Time Management
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Organization
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Working Memory
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStrategies.map(strategy => (
              <div 
                key={strategy.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {strategy.name}
                    </h4>
                    {getCategoryBadge(strategy.category)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {strategy.description}
                  </p>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">How to use:</h5>
                    <ol className="list-decimal list-inside space-y-1">
                      {strategy.steps.map((step, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-gray-700 dark:text-gray-300">{strategy.effectiveness.toFixed(1)}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">effectiveness</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Used {strategy.usageCount} times
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-750 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Good for: {strategy.category === 'time-management' ? 'managing time effectively' : 
                              strategy.category === 'organization' ? 'staying organized' :
                              strategy.category === 'working-memory' ? 'remembering information' :
                              strategy.category === 'planning' ? 'planning ahead' : 'managing tasks'}
                  </span>
                  <Link href={`/executive-function/strategies/${strategy.id}`}>
                    <span className="text-xs text-primary hover:text-primary/80">
                      Learn More
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {filteredStrategies.length === 0 && (
            <div className="text-center py-8">
              <List className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No strategies found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'There are no strategies available yet'}
              </p>
              {canManage && (
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Add New Strategy
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Executive Function Resources
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Students
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Educators
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <div 
                key={resource.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {resource.title}
                    </h4>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 uppercase">
                      {resource.format}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
                      {resource.type}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
                      For {resource.audience}
                    </span>
                    {getCategoryBadge(resource.category)}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Updated: {formatDate(resource.lastUpdated)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {resource.downloads} downloads
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-750 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {resource.audience === 'all' ? 'For everyone' : `For ${resource.audience}`}
                  </span>
                  <div className="flex space-x-2">
                    <Link href={`/executive-function/resources/${resource.id}`}>
                      <span className="text-xs text-primary hover:text-primary/80">
                        View
                      </span>
                    </Link>
                    <Link href={`/executive-function/resources/${resource.id}/download`}>
                      <span className="text-xs text-primary hover:text-primary/80">
                        <Download className="h-3 w-3 inline-block mr-1" />
                        Download
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No resources found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'There are no resources available yet'}
              </p>
              {canManage && (
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Add New Resource
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutiveFunctionSupport;
