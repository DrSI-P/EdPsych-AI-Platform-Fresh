import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Brain, Sparkles, MessageSquare, Bot, Zap, Lightbulb, BookOpen, RefreshCw, Settings, Check } from 'lucide-react';

/**
 * AI Components for EdPsych Connect
 * Provides adaptive learning, content suggestions, and AI-powered educational support
 */
const AIComponents = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('adaptive');
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    adaptiveContentEnabled: true,
    contentComplexity: 'medium', // simple, medium, advanced
    learningStyle: 'visual', // visual, auditory, reading/writing, kinesthetic
    interestAreas: ['mathematics', 'science'],
    aiSuggestions: true,
    contentTransformation: true,
    emotionalSupport: true,
    executiveFunctionSupport: true
  });
  
  // Sample learning path data
  const [learningPath, setLearningPath] = useState({
    currentModule: 'Fractions and Decimals',
    progress: 68,
    nextSteps: [
      { id: 'step1', title: 'Converting Fractions to Decimals', type: 'lesson', completed: false },
      { id: 'step2', title: 'Decimal Place Value', type: 'interactive', completed: false },
      { id: 'step3', title: 'Comparing Fractions and Decimals', type: 'assessment', completed: false }
    ],
    recommendations: [
      { id: 'rec1', title: 'Visual Fraction Models', type: 'resource', relevance: 'high' },
      { id: 'rec2', title: 'Decimal Games', type: 'interactive', relevance: 'medium' },
      { id: 'rec3', title: 'Real-world Applications', type: 'video', relevance: 'high' }
    ]
  });
  
  // Sample AI feedback data
  const [feedbackHistory, setFeedbackHistory] = useState([
    {
      id: 'feedback1',
      assignment: 'Weekly Math Quiz',
      date: '2025-05-28',
      strengths: [
        'Strong understanding of multiplication concepts',
        'Good application of problem-solving strategies'
      ],
      areasForImprovement: [
        'Review division with remainders',
        'Practice word problems with multiple steps'
      ],
      suggestedResources: [
        { title: 'Division Practice Set', type: 'interactive' },
        { title: 'Multi-step Word Problems', type: 'lesson' }
      ]
    },
    {
      id: 'feedback2',
      assignment: 'Reading Comprehension Exercise',
      date: '2025-05-25',
      strengths: [
        'Excellent identification of main ideas',
        'Good vocabulary application'
      ],
      areasForImprovement: [
        'Focus on inferential questions',
        'Practice summarizing longer passages'
      ],
      suggestedResources: [
        { title: 'Making Inferences', type: 'lesson' },
        { title: 'Summarization Techniques', type: 'video' }
      ]
    }
  ]);
  
  // Sample AI-generated content
  const [generatedContent, setGeneratedContent] = useState({
    images: [
      { id: 'img1', title: 'Water Cycle Diagram', preview: '/assets/sample/water-cycle-preview.jpg' },
      { id: 'img2', title: 'Fraction Visualization', preview: '/assets/sample/fractions-preview.jpg' }
    ],
    explanations: [
      { 
        id: 'exp1', 
        topic: 'Photosynthesis', 
        content: 'Photosynthesis is the process by which plants convert light energy into chemical energy. Plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.',
        complexity: 'medium'
      },
      { 
        id: 'exp2', 
        topic: 'Gravity', 
        content: 'Gravity is a force that pulls objects toward each other. The more mass an object has, the stronger its gravitational pull. Earth\'s gravity keeps us on the ground and keeps the moon orbiting around us.',
        complexity: 'simple'
      }
    ]
  });
  
  // Sample emotional wellbeing AI data
  const [emotionalSupport, setEmotionalSupport] = useState({
    currentMood: 'focused',
    recentMoods: ['anxious', 'focused', 'focused', 'frustrated', 'focused'],
    suggestions: [
      { id: 'sugg1', title: 'Quick Breathing Exercise', type: 'activity', duration: '2 min' },
      { id: 'sugg2', title: 'Break Down Your Task', type: 'strategy', duration: '5 min' },
      { id: 'sugg3', title: 'Positive Affirmations', type: 'resource', duration: '3 min' }
    ]
  });
  
  // Sample executive function support data
  const [executiveSupport, setExecutiveSupport] = useState({
    upcomingTasks: [
      { id: 'task1', title: 'Math Assignment', dueDate: '2025-06-02', priority: 'high', completed: false },
      { id: 'task2', title: 'Science Project Research', dueDate: '2025-06-05', priority: 'medium', completed: false },
      { id: 'task3', title: 'Reading Log', dueDate: '2025-06-01', priority: 'low', completed: true }
    ],
    timeManagement: {
      suggestedSchedule: [
        { time: '15:00-15:45', activity: 'Math Assignment', focus: 'high' },
        { time: '15:45-16:00', activity: 'Break', focus: 'rest' },
        { time: '16:00-16:30', activity: 'Science Project Research', focus: 'medium' }
      ]
    },
    organizationTips: [
      'Break down the math assignment into smaller parts',
      'Gather all science project materials before starting',
      'Use the provided template for your reading log'
    ]
  });
  
  // Simulate loading AI recommendations
  const refreshRecommendations = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Update with new recommendations
      setLearningPath(prev => ({
        ...prev,
        recommendations: [
          { id: 'rec4', title: 'Decimal Place Value Game', type: 'interactive', relevance: 'high' },
          { id: 'rec5', title: 'Fraction and Decimal Conversion Chart', type: 'resource', relevance: 'high' },
          { id: 'rec6', title: 'Real-world Decimal Problems', type: 'practice', relevance: 'medium' }
        ]
      }));
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Generate AI content based on topic
  const generateContent = (topic, complexity) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Add new generated content
      const newExplanation = {
        id: `exp${generatedContent.explanations.length + 1}`,
        topic: topic,
        content: `This is a ${complexity} explanation of ${topic} that would be generated by the AI. The content would be tailored to the student's learning style, reading level, and prior knowledge.`,
        complexity: complexity
      };
      
      setGeneratedContent(prev => ({
        ...prev,
        explanations: [...prev.explanations, newExplanation]
      }));
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Update user preferences
  const updatePreference = (key, value) => {
    setUserPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Mark task as complete
  const completeTask = (taskId) => {
    setExecutiveSupport(prev => ({
      ...prev,
      upcomingTasks: prev.upcomingTasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      )
    }));
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Brain className="h-6 w-6 mr-2 text-primary" />
          AI Learning Components
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Personalized learning powered by artificial intelligence
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('adaptive')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'adaptive'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Adaptive Learning</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>AI Feedback</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'content'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Bot className="h-4 w-4 mr-2" />
              <span>Generated Content</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('emotional')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'emotional'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              <span>Emotional Support</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('executive')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'executive'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              <span>Executive Function</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              <span>AI Settings</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* Adaptive Learning Tab */}
        {activeTab === 'adaptive' && (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Learning Path</h3>
                <button
                  onClick={refreshRecommendations}
                  className="flex items-center px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </button>
              </div>
              
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
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        {step.title}
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {step.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">AI Recommendations</h4>
              <div className="space-y-3">
                {learningPath.recommendations.map(rec => (
                  <div 
                    key={rec.id}
                    className="flex justify-between items-center p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        {rec.type === 'resource' && <BookOpen className="h-5 w-5 text-blue-500" />}
                        {rec.type === 'interactive' && <Zap className="h-5 w-5 text-amber-500" />}
                        {rec.type === 'video' && <Bot className="h-5 w-5 text-purple-500" />}
                        {rec.type === 'practice' && <Brain className="h-5 w-5 text-green-500" />}
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
          </div>
        )}
        
        {/* AI Feedback Tab */}
        {activeTab === 'feedback' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">AI-Generated Feedback</h3>
            
            <div className="space-y-6">
              {feedbackHistory.map(feedback => (
                <div 
                  key={feedback.id}
                  className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {feedback.assignment}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {feedback.date}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                      Strengths
                    </h5>
                    <ul className="list-disc list-inside space-y-1">
                      {feedback.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                      Areas for Improvement
                    </h5>
                    <ul className="list-disc list-inside space-y-1">
                      {feedback.areasForImprovement.map((area, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                      Suggested Resources
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {feedback.suggestedResources.map((resource, index) => (
                        <div 
                          key={index}
                          className="flex items-center p-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md"
                        >
                          <BookOpen className="h-4 w-4 text-primary mr-2" />
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {resource.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {resource.type}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Generated Content Tab */}
        {activeTab === 'content' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">AI Content Generator</h3>
              
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md mb-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Generate New Content
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Topic
                    </label>
                    <input
                      type="text"
                      id="topic"
                      placeholder="Enter a topic (e.g., Photosynthesis, Fractions)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Complexity Level
                    </label>
                    <select
                      id="complexity"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                    >
                      <option value="simple">Simple (Ages 5-8)</option>
                      <option value="medium">Medium (Ages 9-12)</option>
                      <option value="advanced">Advanced (Ages 13+)</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={() => generateContent(document.getElementById('topic').value, document.getElementById('complexity').value)}
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Generated Explanations</h4>
              <div className="space-y-4 mb-6">
                {generatedContent.explanations.map(explanation => (
                  <div 
                    key={explanation.id}
                    className="p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-md font-medium text-gray-900 dark:text-white">
                        {explanation.topic}
                      </h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        explanation.complexity === 'simple' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : explanation.complexity === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {explanation.complexity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {explanation.content}
                    </p>
                  </div>
                ))}
              </div>
              
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Generated Images</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedContent.images.map(image => (
                  <div 
                    key={image.id}
                    className="p-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-md mb-2">
                      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                        [Image Preview: {image.title}]
                      </div>
                    </div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      {image.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Emotional Support Tab */}
        {activeTab === 'emotional' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Emotional Wellbeing AI</h3>
            
            <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  Current Mood
                </h4>
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 capitalize">
                  {emotionalSupport.currentMood}
                </span>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mood History
                </h5>
                <div className="flex space-x-2">
                  {emotionalSupport.recentMoods.map((mood, index) => (
                    <div 
                      key={index}
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                        mood === 'focused' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : mood === 'anxious'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}
                      title={mood}
                    >
                      {mood.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Personalized Suggestions</h4>
            <div className="space-y-3">
              {emotionalSupport.suggestions.map(suggestion => (
                <div 
                  key={suggestion.id}
                  className="flex justify-between items-center p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md"
                >
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      {suggestion.title}
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {suggestion.type} • {suggestion.duration}
                    </p>
                  </div>
                  <button className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20">
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Executive Function Tab */}
        {activeTab === 'executive' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Executive Function Support</h3>
            
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Task Management</h4>
              <div className="space-y-3">
                {executiveSupport.upcomingTasks.map(task => (
                  <div 
                    key={task.id}
                    className={`flex justify-between items-center p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md ${
                      task.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => completeTask(task.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700 mr-3"
                      />
                      <div>
                        <h5 className={`text-sm font-medium ${
                          task.completed 
                            ? 'text-gray-500 dark:text-gray-400 line-through' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Due: {task.dueDate}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Suggested Schedule</h4>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
                <div className="space-y-3">
                  {executiveSupport.timeManagement.suggestedSchedule.map((block, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md"
                    >
                      <div className="w-20 text-sm font-medium text-gray-900 dark:text-white">
                        {block.time}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {block.activity}
                        </p>
                      </div>
                      <div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          block.focus === 'high' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            : block.focus === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : block.focus === 'rest'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {block.focus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Organization Tips</h4>
              <div className="bg-gray-50 dark:bg-neutral-750 p-4 rounded-md">
                <ul className="space-y-2">
                  {executiveSupport.organizationTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* AI Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">AI Personalization Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Content Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="adaptiveContentEnabled" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Adaptive Content
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Automatically adjust content to your learning progress
                      </p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="adaptiveContentEnabled"
                        checked={userPreferences.adaptiveContentEnabled}
                        onChange={(e) => updatePreference('adaptiveContentEnabled', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label
                        htmlFor="adaptiveContentEnabled"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          userPreferences.adaptiveContentEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      ></label>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="contentComplexity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content Complexity
                    </label>
                    <select
                      id="contentComplexity"
                      value={userPreferences.contentComplexity}
                      onChange={(e) => updatePreference('contentComplexity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                    >
                      <option value="simple">Simple (Ages 5-8)</option>
                      <option value="medium">Medium (Ages 9-12)</option>
                      <option value="advanced">Advanced (Ages 13+)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="learningStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preferred Learning Style
                    </label>
                    <select
                      id="learningStyle"
                      value={userPreferences.learningStyle}
                      onChange={(e) => updatePreference('learningStyle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                    >
                      <option value="visual">Visual</option>
                      <option value="auditory">Auditory</option>
                      <option value="reading">Reading/Writing</option>
                      <option value="kinesthetic">Kinesthetic</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">AI Features</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="aiSuggestions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        AI Suggestions
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Receive personalized content and resource recommendations
                      </p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="aiSuggestions"
                        checked={userPreferences.aiSuggestions}
                        onChange={(e) => updatePreference('aiSuggestions', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label
                        htmlFor="aiSuggestions"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          userPreferences.aiSuggestions ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="contentTransformation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Content Transformation
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Automatically adapt content to your preferred learning style
                      </p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="contentTransformation"
                        checked={userPreferences.contentTransformation}
                        onChange={(e) => updatePreference('contentTransformation', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label
                        htmlFor="contentTransformation"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          userPreferences.contentTransformation ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="emotionalSupport" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Emotional Support
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Receive personalized emotional wellbeing support
                      </p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="emotionalSupport"
                        checked={userPreferences.emotionalSupport}
                        onChange={(e) => updatePreference('emotionalSupport', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label
                        htmlFor="emotionalSupport"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          userPreferences.emotionalSupport ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="executiveFunctionSupport" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Executive Function Support
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Receive assistance with organization and planning
                      </p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="executiveFunctionSupport"
                        checked={userPreferences.executiveFunctionSupport}
                        onChange={(e) => updatePreference('executiveFunctionSupport', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label
                        htmlFor="executiveFunctionSupport"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          userPreferences.executiveFunctionSupport ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      ></label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Interest Areas</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Select topics you're interested in to receive more relevant content
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {['mathematics', 'science', 'reading', 'writing', 'history', 'geography', 'art', 'music'].map(interest => (
                    <div 
                      key={interest}
                      className={`p-2 border rounded-md cursor-pointer ${
                        userPreferences.interestAreas.includes(interest)
                          ? 'bg-primary/10 border-primary'
                          : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => {
                        const newInterests = userPreferences.interestAreas.includes(interest)
                          ? userPreferences.interestAreas.filter(i => i !== interest)
                          : [...userPreferences.interestAreas, interest];
                        updatePreference('interestAreas', newInterests);
                      }}
                    >
                      <div className="flex items-center">
                        {userPreferences.interestAreas.includes(interest) && (
                          <Check className="h-4 w-4 text-primary mr-2" />
                        )}
                        <span className={`text-sm ${
                          userPreferences.interestAreas.includes(interest)
                            ? 'text-primary font-medium'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {interest.charAt(0).toUpperCase() + interest.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom CSS for toggle switches */}
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #fff;
        }
        .toggle-checkbox {
          right: 4px;
          transition: all 0.3s;
        }
        .toggle-label {
          transition: background-color 0.3s;
        }
      `}</style>
    </div>
  );
};

export default AIComponents;
