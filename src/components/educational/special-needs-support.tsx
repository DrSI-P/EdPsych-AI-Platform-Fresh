import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Heart, Brain, Activity, Settings, Filter, Search, Plus, Download, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Special Needs Support System component for EdPsych Connect
 * Provides tools and resources for supporting students with special educational needs
 */
const SpecialNeedsSupport = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tools');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [tools, setTools] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [resources, setResources] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  
  // Check if user has appropriate permissions
  const canManage = session?.user?.role === 'educator' || session?.user?.role === 'admin' || session?.user?.role === 'professional';
  
  // Fetch special needs support data
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;
      
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        
        // Mock tools data
        const mockTools = [
          {
            id: '1',
            name: 'Visual Schedule Creator',
            category: 'executive-function',
            description: 'Create customisable visual schedules to support routine and transitions',
            targetAges: '5-16',
            usageCount: 245,
            lastUpdated: '2023-05-10T14:30:00Z'
          },
          {
            id: '2',
            name: 'Sensory Profile Assessment',
            category: 'sensory',
            description: 'Evaluate sensory processing patterns and create personalised sensory diets',
            targetAges: '4-18',
            usageCount: 178,
            lastUpdated: '2023-05-15T09:45:00Z'
          },
          {
            id: '3',
            name: 'Emotion Recognition Trainer',
            category: 'social-emotional',
            description: 'Interactive activities to help identify and understand emotions',
            targetAges: '6-14',
            usageCount: 312,
            lastUpdated: '2023-05-18T11:20:00Z'
          },
          {
            id: '4',
            name: 'Text-to-Speech Reader',
            category: 'literacy',
            description: 'Converts text to speech with adjustable reading speed and highlighting',
            targetAges: '7-18',
            usageCount: 427,
            lastUpdated: '2023-05-05T16:15:00Z'
          },
          {
            id: '5',
            name: 'Behaviour Tracking System',
            category: 'behaviour',
            description: 'Record, analyse, and identify patterns in behaviour for targeted support',
            targetAges: '4-18',
            usageCount: 289,
            lastUpdated: '2023-05-12T13:40:00Z'
          },
          {
            id: '6',
            name: 'Mindfulness Activities',
            category: 'wellbeing',
            description: 'Age-appropriate mindfulness exercises for emotional regulation',
            targetAges: '5-18',
            usageCount: 356,
            lastUpdated: '2023-05-20T10:30:00Z'
          }
        ];
        
        // Mock interventions data
        const mockInterventions = [
          {
            id: '1',
            name: 'Reading Fluency Programme',
            category: 'literacy',
            description: 'Structured intervention to improve reading speed and comprehension',
            targetNeeds: ['Dyslexia', 'Reading Difficulties'],
            duration: '6-8 weeks',
            sessions: 12,
            evidenceRating: 'Strong',
            implementationCount: 45
          },
          {
            id: '2',
            name: 'Executive Function Coaching',
            category: 'executive-function',
            description: 'One-to-one coaching to develop planning, organisation, and time management skills',
            targetNeeds: ['ADHD', 'Executive Function Difficulties'],
            duration: '10-12 weeks',
            sessions: 10,
            evidenceRating: 'Moderate',
            implementationCount: 32
          },
          {
            id: '3',
            name: 'Social Skills Group',
            category: 'social-emotional',
            description: 'Small group intervention focusing on social communication and friendship skills',
            targetNeeds: ['Autism Spectrum', 'Social Communication Difficulties'],
            duration: '12 weeks',
            sessions: 12,
            evidenceRating: 'Strong',
            implementationCount: 28
          },
          {
            id: '4',
            name: 'Sensory Integration Therapy',
            category: 'sensory',
            description: 'Structured activities to improve sensory processing and regulation',
            targetNeeds: ['Sensory Processing Disorder', 'Autism Spectrum'],
            duration: 'Ongoing',
            sessions: 'Variable',
            evidenceRating: 'Moderate',
            implementationCount: 19
          },
          {
            id: '5',
            name: 'Emotional Literacy Support',
            category: 'wellbeing',
            description: 'Targeted support to develop emotional vocabulary and self-regulation',
            targetNeeds: ['Emotional Regulation Difficulties', 'Anxiety'],
            duration: '8 weeks',
            sessions: 8,
            evidenceRating: 'Strong',
            implementationCount: 37
          }
        ];
        
        // Mock resources data
        const mockResources = [
          {
            id: '1',
            title: 'Supporting Dyslexia in the Classroom',
            category: 'literacy',
            type: 'guide',
            audience: 'educators',
            format: 'pdf',
            downloads: 187,
            lastUpdated: '2023-04-15T11:30:00Z'
          },
          {
            id: '2',
            title: 'Sensory Strategies for Home',
            category: 'sensory',
            type: 'handout',
            audience: 'parents',
            format: 'pdf',
            downloads: 145,
            lastUpdated: '2023-04-20T09:45:00Z'
          },
          {
            id: '3',
            title: 'Executive Function Skills Development',
            category: 'executive-function',
            type: 'toolkit',
            audience: 'educators',
            format: 'interactive',
            downloads: 203,
            lastUpdated: '2023-05-02T14:15:00Z'
          },
          {
            id: '4',
            title: 'Understanding Autism Spectrum',
            category: 'social-emotional',
            type: 'guide',
            audience: 'all',
            format: 'pdf',
            downloads: 256,
            lastUpdated: '2023-04-10T10:20:00Z'
          },
          {
            id: '5',
            title: 'Anxiety Management Strategies',
            category: 'wellbeing',
            type: 'toolkit',
            audience: 'students',
            format: 'interactive',
            downloads: 178,
            lastUpdated: '2023-05-08T13:40:00Z'
          },
          {
            id: '6',
            title: 'Positive Behaviour Support',
            category: 'behaviour',
            type: 'guide',
            audience: 'educators',
            format: 'pdf',
            downloads: 219,
            lastUpdated: '2023-04-25T15:30:00Z'
          }
        ];
        
        setTools(mockTools);
        setInterventions(mockInterventions);
        setResources(mockResources);
      } catch (error) {
        setErrorMessage('Failed to load special needs support data');
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
    setFilterCategory(e.target.value);
  };
  
  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Get category badge styling
  const getCategoryBadge = (category) => {
    const categories = {
      'literacy': { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-300', label: 'Literacy' },
      'executive-function': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-300', label: 'Executive Function' },
      'social-emotional': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-300', label: 'Social-Emotional' },
      'sensory': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-300', label: 'Sensory' },
      'behaviour': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-300', label: 'Behaviour' },
      'wellbeing': { bg: 'bg-teal-100 dark:bg-teal-900', text: 'text-teal-800 dark:text-teal-300', label: 'Wellbeing' }
    };
    
    const style = categories[category] || { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', label: category };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };
  
  // Filter data based on search and category
  const filterData = (data) => {
    return data.filter(item => {
      const matchesSearch = 
        (item.name || item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  };
  
  // Filtered data
  const filteredTools = filterData(tools);
  const filteredInterventions = filterData(interventions);
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Special Needs Support</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tools and resources for supporting students with special educational needs
            </p>
          </div>
          
          {canManage && (
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center gap-2 hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add New
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
                <Settings className="h-4 w-4" />
                Settings
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
            placeholder="Search tools, interventions, and resources..."
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
            className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white appearance-none"
          >
            <option value="all">All Categories</option>
            <option value="literacy">Literacy</option>
            <option value="executive-function">Executive Function</option>
            <option value="social-emotional">Social-Emotional</option>
            <option value="sensory">Sensory</option>
            <option value="behaviour">Behaviour</option>
            <option value="wellbeing">Wellbeing</option>
          </select>
          <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'tools'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Brain className="inline-block h-4 w-4 mr-2" />
            Support Tools
          </button>
          <button 
            onClick={() => setActiveTab('interventions')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'interventions'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Activity className="inline-block h-4 w-4 mr-2" />
            Interventions
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'resources'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Heart className="inline-block h-4 w-4 mr-2" />
            Resources
          </button>
        </nav>
      </div>
      
      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Special Needs Support Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {['literacy', 'executive-function', 'social-emotional', 'sensory', 'behaviour', 'wellbeing'].map(category => (
                <button 
                  key={category}
                  onClick={() => setFilterCategory(filterCategory === category ? 'all' : category)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filterCategory === category 
                      ? 'bg-primary text-white' 
                      : getCategoryBadge(category).props.className
                  }`}
                >
                  {getCategoryBadge(category).props.children}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <div 
                key={tool.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {tool.name}
                    </h4>
                    {getCategoryBadge(tool.category)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {tool.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Target Ages</p>
                      <p className="text-gray-700 dark:text-gray-300">{tool.targetAges}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Usage Count</p>
                      <p className="text-gray-700 dark:text-gray-300">{tool.usageCount}</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-750 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Updated: {formatDate(tool.lastUpdated)}
                  </span>
                  <Link href={`/special-needs/tools/${tool.id}`}>
                    <span className="text-xs text-primary hover:text-primary/80">
                      Open Tool
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTools.length === 0 && (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tools found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'There are no support tools available yet'}
              </p>
              {canManage && (
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Add New Tool
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Interventions Tab */}
      {activeTab === 'interventions' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Evidence-Based Interventions
            </h3>
            <div className="flex flex-wrap gap-2">
              {['literacy', 'executive-function', 'social-emotional', 'sensory', 'wellbeing'].map(category => (
                <button 
                  key={category}
                  onClick={() => setFilterCategory(filterCategory === category ? 'all' : category)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filterCategory === category 
                      ? 'bg-primary text-white' 
                      : getCategoryBadge(category).props.className
                  }`}
                >
                  {getCategoryBadge(category).props.children}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredInterventions.map(intervention => (
              <div 
                key={intervention.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleSection(intervention.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mr-3">
                        {intervention.name}
                      </h4>
                      {getCategoryBadge(intervention.category)}
                    </div>
                    {expandedSections[intervention.id] ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                </div>
                
                {expandedSections[intervention.id] && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {intervention.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Target Needs</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {intervention.targetNeeds.map((need, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {need}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Duration & Sessions</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {intervention.duration} ({intervention.sessions} sessions)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Evidence Rating</p>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            intervention.evidenceRating === 'Strong' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : intervention.evidenceRating === 'Moderate'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {intervention.evidenceRating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Implemented by {intervention.implementationCount} educators
                      </span>
                      <div className="flex space-x-2">
                        <Link href={`/special-needs/interventions/${intervention.id}`}>
                          <span className="text-xs text-primary hover:text-primary/80">
                            View Details
                          </span>
                        </Link>
                        {canManage && (
                          <Link href={`/special-needs/interventions/${intervention.id}/implement`}>
                            <span className="text-xs text-primary hover:text-primary/80">
                              Implement
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredInterventions.length === 0 && (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No interventions found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'There are no interventions available yet'}
              </p>
              {canManage && (
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Add New Intervention
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
              Special Needs Resources
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Educators
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Students
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Parents
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
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getCategoryBadge(resource.category)}
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
                      {resource.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Audience</p>
                      <p className="text-gray-700 dark:text-gray-300 capitalize">{resource.audience}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Downloads</p>
                      <p className="text-gray-700 dark:text-gray-300">{resource.downloads}</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-750 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Updated: {formatDate(resource.lastUpdated)}
                  </span>
                  <div className="flex space-x-2">
                    <Link href={`/special-needs/resources/${resource.id}`}>
                      <span className="text-xs text-primary hover:text-primary/80">
                        View
                      </span>
                    </Link>
                    <Link href={`/special-needs/resources/${resource.id}/download`}>
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
              <Heart className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
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

export default SpecialNeedsSupport;
