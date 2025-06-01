import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BarChart, PieChart, LineChart, Calendar, Download, Filter } from 'lucide-react';

/**
 * Analytics dashboard component for EdPsych Connect
 * Provides data visualization and reporting for user activity and learning progress
 */
const AnalyticsDashboard = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Check if user has appropriate permissions
  const hasPermission = session?.user?.role === 'educator' || session?.user?.role === 'admin' || session?.user?.role === 'professional';
  
  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!session?.user?.email) return;
      
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockData = {
          overview: {
            totalUsers: 256,
            activeUsers: 187,
            averageEngagementTime: 45, // minutes
            completionRate: 73, // percentage
            userGrowth: 12 // percentage
          },
          engagement: {
            dailyActiveUsers: [42, 45, 50, 47, 52, 58, 60],
            weeklyActiveUsers: [180, 185, 190, 187, 195, 205, 210],
            averageSessionDuration: [38, 40, 42, 39, 44, 45, 45],
            pageViews: [1250, 1300, 1280, 1350, 1400, 1450, 1500]
          },
          learning: {
            assignmentsCompleted: 1245,
            averageScore: 82, // percentage
            skillsImproved: 18,
            learningPathProgress: 67, // percentage
            topPerformingAreas: [
              { name: 'Reading Comprehension', score: 88 },
              { name: 'Mathematical Reasoning', score: 85 },
              { name: 'Scientific Inquiry', score: 82 },
              { name: 'Critical Thinking', score: 80 },
              { name: 'Creative Expression', score: 78 }
            ]
          },
          demographics: {
            ageGroups: [
              { name: '5-7', value: 15 },
              { name: '8-11', value: 25 },
              { name: '12-14', value: 30 },
              { name: '15-16', value: 20 },
              { name: '17-18', value: 10 }
            ],
            learningStyles: [
              { name: 'Visual', value: 40 },
              { name: 'Auditory', value: 25 },
              { name: 'Kinesthetic', value: 20 },
              { name: 'Reading/Writing', value: 15 }
            ],
            specialNeeds: {
              total: 45,
              categories: [
                { name: 'Dyslexia', value: 15 },
                { name: 'ADHD', value: 12 },
                { name: 'Autism Spectrum', value: 8 },
                { name: 'Other', value: 10 }
              ]
            }
          }
        };
        
        setAnalyticsData(mockData);
      } catch (error) {
        setErrorMessage('Failed to load analytics data');
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [session, timeRange]);
  
  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // If user doesn't have permission, show unauthorized message
  if (!isLoading && !hasPermission) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center text-red-500 mb-4">
          <BarChart className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Analytics Access Restricted
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          You do not have permission to access the analytics dashboard.
        </p>
        <div className="flex justify-center">
          <Link href="/dashboard">
            <span className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90">
              Return to Dashboard
            </span>
          </Link>
        </div>
      </div>
    );
  }
  
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monitor user engagement and learning progress
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            
            <button className="px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center gap-2 hover:bg-primary/90">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>
      
      {/* Analytics tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('engagement')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'engagement'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            User Engagement
          </button>
          <button 
            onClick={() => setActiveTab('learning')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'learning'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Learning Progress
          </button>
          <button 
            onClick={() => setActiveTab('demographics')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'demographics'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Demographics
          </button>
        </nav>
      </div>
      
      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatNumber(analyticsData.overview.totalUsers)}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  +{analyticsData.overview.userGrowth}%
                </span>
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  since last {timeRange}
                </span>
              </div>
            </div>
            
            {/* Active Users */}
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatNumber(analyticsData.overview.activeUsers)}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round((analyticsData.overview.activeUsers / analyticsData.overview.totalUsers) * 100)}% of total users
                </span>
              </div>
            </div>
            
            {/* Average Engagement */}
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Engagement Time</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {analyticsData.overview.averageEngagementTime} min
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  +5%
                </span>
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  since last {timeRange}
                </span>
              </div>
            </div>
            
            {/* Completion Rate */}
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {analyticsData.overview.completionRate}%
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 dark:text-yellow-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  +3%
                </span>
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  since last {timeRange}
                </span>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Growth</h4>
              <div className="h-64 flex items-center justify-center">
                <LineChart className="h-32 w-32 text-gray-400 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                  Chart visualization would be implemented here with actual data
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Learning Activity</h4>
              <div className="h-64 flex items-center justify-center">
                <BarChart className="h-32 w-32 text-gray-400 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                  Chart visualization would be implemented here with actual data
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Engagement tab */}
      {activeTab === 'engagement' && (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Daily Active Users</h4>
              <div className="h-64 flex items-center justify-center">
                <LineChart className="h-32 w-32 text-gray-400 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                  Chart visualization would be implemented here with actual data
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Average Session Duration</h4>
              <div className="h-64 flex items-center justify-center">
                <LineChart className="h-32 w-32 text-gray-400 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                  Chart visualization would be implemented here with actual data
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Page Views</h4>
              <div className="h-64 flex items-center justify-center">
                <BarChart className="h-32 w-32 text-gray-400 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                  Chart visualization would be implemented here with actual data
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Retention</h4>
              <div className="h-64 flex items-center justify-center">
                <BarChart className="h-32 w-32 text-gray-400 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                  Chart visualization would be implemented here with actual data
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Learning Progress tab */}
      {activeTab === 'learning' && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Assignments Completed */}
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Assignments Completed</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatNumber(analyticsData.learning.assignmentsCompleted)}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Average Score */}
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {analyticsData.learning.averageScore}%
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Skills Improved */}
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Skills Improved</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {analyticsData.learning.skillsImproved}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Learning Path Progress */}
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Learning Path Progress</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {analyticsData.learning.learningPathProgress}%
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 dark:text-yellow-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Top Performing Areas */}
          <div className="mt-8 bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Performing Areas</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Area
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {analyticsData.learning.topPerformingAreas.map((area, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {area.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {area.score}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${area.score}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Demographics tab */}
      {activeTab === 'demographics' && (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Age Groups</h4>
              <div className="h-64 flex items-center justify-center">
                <PieChart className="h-32 w-32 text-gray-400 dark:text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Chart visualization would be implemented here with actual data
                  </p>
                  <ul className="space-y-1">
                    {analyticsData.demographics.ageGroups.map((group, index) => (
                      <li key={index} className="text-xs flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 bg-primary-${(index % 5) * 100 + 300}`}></span>
                        <span className="text-gray-700 dark:text-gray-300">{group.name}: {group.value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Learning Styles</h4>
              <div className="h-64 flex items-center justify-center">
                <PieChart className="h-32 w-32 text-gray-400 dark:text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Chart visualization would be implemented here with actual data
                  </p>
                  <ul className="space-y-1">
                    {analyticsData.demographics.learningStyles.map((style, index) => (
                      <li key={index} className="text-xs flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 bg-blue-${(index % 5) * 100 + 300}`}></span>
                        <span className="text-gray-700 dark:text-gray-300">{style.name}: {style.value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4 lg:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Special Needs Support ({analyticsData.demographics.specialNeeds.total} students)
              </h4>
              <div className="h-64 flex items-center justify-center">
                <BarChart className="h-32 w-32 text-gray-400 dark:text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Chart visualization would be implemented here with actual data
                  </p>
                  <ul className="space-y-1">
                    {analyticsData.demographics.specialNeeds.categories.map((category, index) => (
                      <li key={index} className="text-xs flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 bg-green-${(index % 5) * 100 + 300}`}></span>
                        <span className="text-gray-700 dark:text-gray-300">{category.name}: {category.value} students</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
