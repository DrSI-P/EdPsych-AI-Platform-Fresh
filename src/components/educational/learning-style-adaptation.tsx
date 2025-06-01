import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BookOpen, PenTool, Eye, EyeOff, Filter, Search, Plus, Download, Check } from 'lucide-react';

/**
 * Learning Style Adaptation component for EdPsych Connect
 * Provides tools for assessing and adapting content to different learning styles
 */
const LearningStyleAdaptation = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assessment');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStyle, setFilterStyle] = useState('all');
  const [assessments, setAssessments] = useState([]);
  const [resources, setResources] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Check if user has appropriate permissions
  const canManage = session?.user?.role === 'educator' || session?.user?.role === 'admin' || session?.user?.role === 'professional';
  
  // Fetch learning style data
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;
      
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        
        // Mock user profile data
        const mockUserProfile = {
          primaryStyle: 'visual',
          secondaryStyle: 'kinesthetic',
          assessmentDate: '2023-05-10T14:30:00Z',
          strengths: ['Visual pattern recognition', 'Spatial awareness', 'Physical coordination'],
          recommendations: [
            'Use diagrams and charts when studying',
            'Create mind maps for complex topics',
            'Incorporate movement into learning activities'
          ]
        };
        
        // Mock assessments data
        const mockAssessments = [
          {
            id: '1',
            name: 'Learning Style Inventory',
            description: 'Comprehensive assessment to identify primary and secondary learning styles',
            ageRange: '10-18',
            duration: '15-20 minutes',
            completions: 342,
            lastUpdated: '2023-04-15T11:30:00Z'
          },
          {
            id: '2',
            name: 'Early Years Learning Preference',
            description: 'Age-appropriate assessment for younger students to identify learning preferences',
            ageRange: '5-9',
            duration: '10-15 minutes',
            completions: 218,
            lastUpdated: '2023-04-20T09:45:00Z'
          },
          {
            id: '3',
            name: 'Sensory Processing Profile',
            description: 'Detailed assessment of sensory processing preferences and needs',
            ageRange: '6-16',
            duration: '20-25 minutes',
            completions: 175,
            lastUpdated: '2023-05-02T14:15:00Z'
          }
        ];
        
        // Mock resources data
        const mockResources = [
          {
            id: '1',
            title: 'Visual Learning Activities Pack',
            style: 'visual',
            type: 'activities',
            description: 'Collection of visual learning activities for various subjects',
            targetAges: '7-14',
            downloads: 245,
            lastUpdated: '2023-05-10T14:30:00Z'
          },
          {
            id: '2',
            title: 'Auditory Learning Strategies Guide',
            style: 'auditory',
            type: 'guide',
            description: 'Comprehensive guide for educators on supporting auditory learners',
            targetAges: 'All',
            downloads: 178,
            lastUpdated: '2023-05-15T09:45:00Z'
          },
          {
            id: '3',
            title: 'Kinesthetic Classroom Ideas',
            style: 'kinesthetic',
            type: 'guide',
            description: 'Ideas for incorporating movement and hands-on activities in the classroom',
            targetAges: '5-16',
            downloads: 312,
            lastUpdated: '2023-05-18T11:20:00Z'
          },
          {
            id: '4',
            title: 'Reading/Writing Exercises Collection',
            style: 'reading-writing',
            type: 'activities',
            description: 'Structured exercises for students who prefer reading and writing',
            targetAges: '8-18',
            downloads: 198,
            lastUpdated: '2023-05-05T16:15:00Z'
          },
          {
            id: '5',
            title: 'Multi-Modal Lesson Planning Templates',
            style: 'multi-modal',
            type: 'templates',
            description: 'Templates for creating lessons that engage multiple learning styles',
            targetAges: 'All',
            downloads: 289,
            lastUpdated: '2023-05-12T13:40:00Z'
          },
          {
            id: '6',
            title: 'Visual Timetables and Schedules',
            style: 'visual',
            type: 'templates',
            description: 'Customisable visual timetables and schedules for classroom use',
            targetAges: '4-11',
            downloads: 356,
            lastUpdated: '2023-05-20T10:30:00Z'
          }
        ];
        
        setUserProfile(mockUserProfile);
        setAssessments(mockAssessments);
        setResources(mockResources);
      } catch (error) {
        setErrorMessage('Failed to load learning style data');
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
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterStyle(e.target.value);
  };
  
  // Get learning style badge styling
  const getStyleBadge = (style) => {
    const styles = {
      'visual': { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-300', label: 'Visual' },
      'auditory': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-300', label: 'Auditory' },
      'kinesthetic': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-300', label: 'Kinesthetic' },
      'reading-writing': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-300', label: 'Reading/Writing' },
      'multi-modal': { bg: 'bg-teal-100 dark:bg-teal-900', text: 'text-teal-800 dark:text-teal-300', label: 'Multi-Modal' }
    };
    
    const style_info = styles[style] || { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', label: style };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${style_info.bg} ${style_info.text}`}>
        {style_info.label}
      </span>
    );
  };
  
  // Filter resources based on search and style
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStyle = filterStyle === 'all' || resource.style === filterStyle;
    
    return matchesSearch && matchesStyle;
  });
  
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Style Adaptation</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tools for assessing and adapting content to different learning styles
            </p>
          </div>
          
          {canManage && (
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center gap-2 hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add Resource
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
                <PenTool className="h-4 w-4" />
                Create Assessment
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab('assessment')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'assessment'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <PenTool className="inline-block h-4 w-4 mr-2" />
            Assessment
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'profile'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Eye className="inline-block h-4 w-4 mr-2" />
            Learning Profile
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'resources'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <BookOpen className="inline-block h-4 w-4 mr-2" />
            Resources
          </button>
        </nav>
      </div>
      
      {/* Assessment Tab */}
      {activeTab === 'assessment' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Learning Style Assessments
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete an assessment to identify your learning style preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map(assessment => (
              <div 
                key={assessment.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                    {assessment.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {assessment.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Age Range</p>
                      <p className="text-gray-700 dark:text-gray-300">{assessment.ageRange}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="text-gray-700 dark:text-gray-300">{assessment.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Completions</p>
                      <p className="text-gray-700 dark:text-gray-300">{assessment.completions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                      <p className="text-gray-700 dark:text-gray-300">{formatDate(assessment.lastUpdated)}</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-750 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {assessment.duration} to complete
                  </span>
                  <Link href={`/learning-styles/assessments/${assessment.id}`}>
                    <span className="text-xs text-primary hover:text-primary/80">
                      Start Assessment
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {assessments.length === 0 && (
            <div className="text-center py-8">
              <PenTool className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No assessments found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are no learning style assessments available yet.
              </p>
              {canManage && (
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Create First Assessment
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Learning Profile Tab */}
      {activeTab === 'profile' && (
        <div className="p-6">
          {userProfile ? (
            <>
              <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
                  Your Learning Style Profile
                </h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                    Last assessed: {formatDate(userProfile.assessmentDate)}
                  </span>
                  <Link href="/learning-styles/assessments">
                    <span className="text-sm text-primary hover:text-primary/80">
                      Reassess
                    </span>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Learning Style Preferences
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Primary Style</span>
                        {getStyleBadge(userProfile.primaryStyle)}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Secondary Style</span>
                        {getStyleBadge(userProfile.secondaryStyle)}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Auditory</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Reading/Writing</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Learning Strengths
                  </h4>
                  <ul className="space-y-2">
                    {userProfile.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Personalised Recommendations
                </h4>
                <ul className="space-y-2">
                  {userProfile.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <Link href="/learning-styles/resources">
                  <span className="text-sm text-primary hover:text-primary/80">
                    View Recommended Resources
                  </span>
                </Link>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
                  <Download className="h-4 w-4" />
                  Download Profile
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <EyeOff className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No learning profile found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't completed a learning style assessment yet.
              </p>
              <Link href="/learning-styles/assessments">
                <span className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <PenTool className="h-4 w-4" />
                  Take Assessment
                </span>
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Learning Style Resources
            </h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilterStyle('all')}
                className={`px-3 py-1 text-xs rounded-full ${
                  filterStyle === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                All Styles
              </button>
              {['visual', 'auditory', 'kinesthetic', 'reading-writing', 'multi-modal'].map(style => (
                <button 
                  key={style}
                  onClick={() => setFilterStyle(style)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filterStyle === style 
                      ? 'bg-primary text-white' 
                      : getStyleBadge(style).props.className
                  }`}
                >
                  {getStyleBadge(style).props.children}
                </button>
              ))}
            </div>
          </div>
          
          {/* Search */}
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
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
                    {getStyleBadge(resource.style)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {resource.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                      <p className="text-gray-700 dark:text-gray-300 capitalize">{resource.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Target Ages</p>
                      <p className="text-gray-700 dark:text-gray-300">{resource.targetAges}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Downloads</p>
                      <p className="text-gray-700 dark:text-gray-300">{resource.downloads}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Updated</p>
                      <p className="text-gray-700 dark:text-gray-300">{formatDate(resource.lastUpdated)}</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-750 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {resource.style === userProfile?.primaryStyle || resource.style === userProfile?.secondaryStyle 
                      ? '✨ Recommended for you' 
                      : `For ${getStyleBadge(resource.style).props.children} learners`}
                  </span>
                  <div className="flex space-x-2">
                    <Link href={`/learning-styles/resources/${resource.id}`}>
                      <span className="text-xs text-primary hover:text-primary/80">
                        View
                      </span>
                    </Link>
                    <Link href={`/learning-styles/resources/${resource.id}/download`}>
                      <span className="text-xs text-primary hover:text-primary/80 flex items-center">
                        <Download className="h-3 w-3 mr-1" />
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
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No resources found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || filterStyle !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'There are no learning style resources available yet'}
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

export default LearningStyleAdaptation;
