import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Heart, Calendar, Clock, AlertTriangle, Check, ArrowUp, ArrowDown, BarChart } from 'lucide-react';

/**
 * Emotional Wellbeing Tools component for EdPsych Connect
 * Provides tools and resources for supporting emotional wellbeing and mental health
 */
const EmotionalWellbeingTools = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mood');
  const [moodEntries, setMoodEntries] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [resources, setResources] = useState([]);
  const [currentMood, setCurrentMood] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Check if user has appropriate permissions
  const isStudent = session?.user?.role === 'student';
  const canManage = session?.user?.role === 'educator' || session?.user?.role === 'admin' || session?.user?.role === 'professional';
  
  // Fetch emotional wellbeing data
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;
      
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        
        // Mock mood entries data
        const mockMoodEntries = [
          {
            id: '1',
            date: '2023-05-29T08:30:00Z',
            mood: 'happy',
            energy: 'high',
            notes: 'Feeling positive about the upcoming exam. Well prepared!',
            triggers: ['success', 'achievement']
          },
          {
            id: '2',
            date: '2023-05-28T19:15:00Z',
            mood: 'calm',
            energy: 'medium',
            notes: 'Relaxed evening after completing all homework',
            triggers: ['rest', 'completion']
          },
          {
            id: '3',
            date: '2023-05-27T14:45:00Z',
            mood: 'anxious',
            energy: 'high',
            notes: 'Worried about the maths test tomorrow',
            triggers: ['test', 'uncertainty']
          },
          {
            id: '4',
            date: '2023-05-26T12:30:00Z',
            mood: 'sad',
            energy: 'low',
            notes: 'Argument with friend during lunch break',
            triggers: ['conflict', 'misunderstanding']
          },
          {
            id: '5',
            date: '2023-05-25T16:20:00Z',
            mood: 'frustrated',
            energy: 'medium',
            notes: 'Struggling with science homework',
            triggers: ['difficulty', 'challenge']
          }
        ];
        
        // Mock coping strategies data
        const mockStrategies = [
          {
            id: '1',
            name: 'Deep Breathing',
            category: 'relaxation',
            description: 'Simple breathing technique to reduce stress and anxiety',
            steps: [
              'Find a comfortable position',
              'Breathe in slowly through your nose for 4 counts',
              'Hold your breath for 2 counts',
              'Exhale slowly through your mouth for 6 counts',
              'Repeat 5-10 times'
            ],
            effectiveness: 4.2,
            usageCount: 156
          },
          {
            id: '2',
            name: 'Positive Self-Talk',
            category: 'cognitive',
            description: 'Replace negative thoughts with positive affirmations',
            steps: [
              'Notice negative thoughts',
              'Challenge unhelpful thinking',
              'Replace with realistic, positive statements',
              'Practice regularly'
            ],
            effectiveness: 4.0,
            usageCount: 124
          },
          {
            id: '3',
            name: '5-4-3-2-1 Grounding',
            category: 'mindfulness',
            description: 'Grounding technique using your five senses to manage anxiety',
            steps: [
              'Acknowledge 5 things you can see',
              'Acknowledge 4 things you can touch',
              'Acknowledge 3 things you can hear',
              'Acknowledge 2 things you can smell',
              'Acknowledge 1 thing you can taste'
            ],
            effectiveness: 4.5,
            usageCount: 187
          },
          {
            id: '4',
            name: 'Progressive Muscle Relaxation',
            category: 'relaxation',
            description: 'Technique to reduce physical tension by tensing and relaxing muscle groups',
            steps: [
              'Find a quiet, comfortable place',
              'Tense each muscle group for 5 seconds',
              'Release and relax for 10 seconds',
              'Work through all major muscle groups',
              'Notice the difference between tension and relaxation'
            ],
            effectiveness: 4.3,
            usageCount: 98
          },
          {
            id: '5',
            name: 'Emotion Journaling',
            category: 'expressive',
            description: 'Write about emotions to process and understand them better',
            steps: [
              'Set aside 10-15 minutes',
              'Write freely about your feelings',
              'Explore what triggered them',
              'Consider different perspectives',
              'Reflect on what you've learned'
            ],
            effectiveness: 3.9,
            usageCount: 112
          }
        ];
        
        // Mock mindfulness exercises data
        const mockExercises = [
          {
            id: '1',
            title: 'Mindful Breathing',
            category: 'breathing',
            duration: 5,
            difficulty: 'beginner',
            description: 'Focus on your breath to anchor yourself in the present moment',
            completions: 245,
            audioUrl: '/exercises/mindful-breathing.mp3'
          },
          {
            id: '2',
            title: 'Body Scan Meditation',
            category: 'meditation',
            duration: 10,
            difficulty: 'intermediate',
            description: 'Gradually focus attention on different parts of your body',
            completions: 178,
            audioUrl: '/exercises/body-scan.mp3'
          },
          {
            id: '3',
            title: 'Mindful Walking',
            category: 'movement',
            duration: 15,
            difficulty: 'beginner',
            description: 'Practice mindfulness while walking, focusing on each step',
            completions: 132,
            audioUrl: '/exercises/mindful-walking.mp3'
          },
          {
            id: '4',
            title: 'Loving-Kindness Meditation',
            category: 'meditation',
            duration: 12,
            difficulty: 'intermediate',
            description: 'Develop feelings of goodwill, kindness, and warmth towards others',
            completions: 156,
            audioUrl: '/exercises/loving-kindness.mp3'
          },
          {
            id: '5',
            title: 'Mindful Listening',
            category: 'sensory',
            duration: 8,
            difficulty: 'beginner',
            description: 'Focus completely on sounds in your environment without judgment',
            completions: 198,
            audioUrl: '/exercises/mindful-listening.mp3'
          }
        ];
        
        // Mock resources data
        const mockResources = [
          {
            id: '1',
            title: 'Understanding Anxiety in Children',
            type: 'guide',
            audience: 'parents',
            format: 'pdf',
            downloads: 312,
            lastUpdated: '2023-04-15T11:30:00Z'
          },
          {
            id: '2',
            title: 'Emotional Regulation Strategies',
            type: 'toolkit',
            audience: 'educators',
            format: 'pdf',
            downloads: 287,
            lastUpdated: '2023-04-20T09:45:00Z'
          },
          {
            id: '3',
            title: 'Mindfulness for Teens',
            type: 'workbook',
            audience: 'students',
            format: 'interactive',
            downloads: 245,
            lastUpdated: '2023-05-02T14:15:00Z'
          },
          {
            id: '4',
            title: 'Supporting Children Through Grief',
            type: 'guide',
            audience: 'all',
            format: 'pdf',
            downloads: 178,
            lastUpdated: '2023-04-10T10:20:00Z'
          },
          {
            id: '5',
            title: 'Stress Management Techniques',
            type: 'toolkit',
            audience: 'students',
            format: 'interactive',
            downloads: 298,
            lastUpdated: '2023-05-08T13:40:00Z'
          }
        ];
        
        setMoodEntries(mockMoodEntries);
        setStrategies(mockStrategies);
        setExercises(mockExercises);
        setResources(mockResources);
      } catch (error) {
        setErrorMessage('Failed to load emotional wellbeing data');
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Format date for mood entries
  const formatMoodDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  };
  
  // Get mood emoji
  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'anxious': return '😰';
      case 'sad': return '😢';
      case 'frustrated': return '😤';
      case 'angry': return '😠';
      case 'tired': return '😴';
      case 'excited': return '😃';
      default: return '😐';
    }
  };
  
  // Get energy icon
  const getEnergyIcon = (energy) => {
    switch (energy) {
      case 'high': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'medium': return <span className="h-4 w-4 text-yellow-500">→</span>;
      case 'low': return <ArrowDown className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };
  
  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
  };
  
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Emotional Wellbeing Tools</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tools and resources for supporting emotional wellbeing and mental health
            </p>
          </div>
          
          {isStudent && (
            <div className="mt-4 md:mt-0">
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center gap-2 hover:bg-primary/90">
                <Heart className="h-4 w-4" />
                Log Mood
              </button>
            </div>
          )}
          
          {canManage && (
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center gap-2 hover:bg-primary/90">
                <BarChart className="h-4 w-4" />
                View Reports
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab('mood')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'mood'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Heart className="inline-block h-4 w-4 mr-2" />
            Mood Tracking
          </button>
          <button 
            onClick={() => setActiveTab('strategies')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'strategies'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Check className="inline-block h-4 w-4 mr-2" />
            Coping Strategies
          </button>
          <button 
            onClick={() => setActiveTab('mindfulness')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'mindfulness'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Clock className="inline-block h-4 w-4 mr-2" />
            Mindfulness
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'resources'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <AlertTriangle className="inline-block h-4 w-4 mr-2" />
            Resources
          </button>
        </nav>
      </div>
      
      {/* Mood Tracking Tab */}
      {activeTab === 'mood' && (
        <div className="p-6">
          {isStudent && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                How are you feeling today?
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                {['happy', 'calm', 'excited', 'tired', 'anxious', 'sad', 'frustrated', 'angry'].map(mood => (
                  <button
                    key={mood}
                    onClick={() => handleMoodSelect(mood)}
                    className={`flex flex-col items-center p-3 rounded-lg border ${
                      currentMood === mood
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary'
                    }`}
                  >
                    <span className="text-2xl mb-1">{getMoodEmoji(mood)}</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">{mood}</span>
                  </button>
                ))}
              </div>
              
              {currentMood && (
                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Energy Level
                    </label>
                    <div className="flex space-x-4">
                      {['low', 'medium', 'high'].map(energy => (
                        <button
                          key={energy}
                          className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm capitalize hover:border-primary dark:hover:border-primary"
                        >
                          {energy}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
                      rows={3}
                      placeholder="What's on your mind?"
                    ></textarea>
                  </div>
                  
                  <button className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90">
                    Save Entry
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Mood History
              </h3>
              <Link href="/emotional-wellbeing/mood/history">
                <span className="text-sm text-primary hover:text-primary/80">
                  View All
                </span>
              </Link>
            </div>
            
            {moodEntries.length > 0 ? (
              <div className="space-y-4">
                {moodEntries.map(entry => (
                  <div 
                    key={entry.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{getMoodEmoji(entry.mood)}</span>
                          <div>
                            <h4 className="text-md font-medium text-gray-900 dark:text-white capitalize">
                              {entry.mood}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatMoodDate(entry.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300 mr-1">Energy:</span>
                          <span className="flex items-center">
                            {getEnergyIcon(entry.energy)}
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 capitalize">{entry.energy}</span>
                          </span>
                        </div>
                      </div>
                      
                      {entry.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {entry.notes}
                        </p>
                      )}
                      
                      {entry.triggers && entry.triggers.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.triggers.map((trigger, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {trigger}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No mood entries yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start tracking your mood to see your emotional patterns
                </p>
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <Heart className="h-4 w-4" />
                  Log First Mood
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Coping Strategies Tab */}
      {activeTab === 'strategies' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Coping Strategies
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Relaxation
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Mindfulness
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Cognitive
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Expressive
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategies.map(strategy => (
              <div 
                key={strategy.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {strategy.name}
                    </h4>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
                      {strategy.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {strategy.description}
                  </p>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Steps:</h5>
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
                    Good for: {strategy.category === 'relaxation' ? 'stress & anxiety' : 
                              strategy.category === 'cognitive' ? 'negative thoughts' :
                              strategy.category === 'mindfulness' ? 'present focus' : 'emotional processing'}
                  </span>
                  <button className="text-xs text-primary hover:text-primary/80">
                    Try Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {strategies.length === 0 && (
            <div className="text-center py-8">
              <Check className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No strategies found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are no coping strategies available yet
              </p>
              {canManage && (
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <Check className="h-4 w-4" />
                  Add First Strategy
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Mindfulness Tab */}
      {activeTab === 'mindfulness' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Mindfulness Exercises
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Breathing
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Meditation
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Movement
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Sensory
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map(exercise => (
              <div 
                key={exercise.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {exercise.title}
                    </h4>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {exercise.duration} min
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
                      {exercise.category}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
                      {exercise.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {exercise.description}
                  </p>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-750 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {exercise.completions} completions
                  </span>
                  <Link href={`/emotional-wellbeing/exercises/${exercise.id}`}>
                    <span className="text-xs text-primary hover:text-primary/80">
                      Start Exercise
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {exercises.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No exercises found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are no mindfulness exercises available yet
              </p>
              {canManage && (
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <Clock className="h-4 w-4" />
                  Add First Exercise
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
              Wellbeing Resources
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Students
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Educators
              </button>
              <button className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Parents
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => (
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
                    <Link href={`/emotional-wellbeing/resources/${resource.id}`}>
                      <span className="text-xs text-primary hover:text-primary/80">
                        View
                      </span>
                    </Link>
                    <Link href={`/emotional-wellbeing/resources/${resource.id}/download`}>
                      <span className="text-xs text-primary hover:text-primary/80">
                        Download
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {resources.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No resources found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are no wellbeing resources available yet
              </p>
              {canManage && (
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <AlertTriangle className="h-4 w-4" />
                  Add First Resource
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Emergency Support */}
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-900/30 rounded-b-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Need urgent support?</h4>
            <p className="text-xs text-red-700 dark:text-red-400 mt-1">
              If you're in crisis or need immediate help, please talk to a trusted adult, school counsellor, or contact one of these support services:
            </p>
            <ul className="mt-2 space-y-1">
              <li className="text-xs text-red-700 dark:text-red-400">
                <span className="font-medium">Childline:</span> 0800 1111
              </li>
              <li className="text-xs text-red-700 dark:text-red-400">
                <span className="font-medium">Samaritans:</span> 116 123
              </li>
              <li className="text-xs text-red-700 dark:text-red-400">
                <span className="font-medium">Young Minds Crisis Messenger:</span> Text YM to 85258
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionalWellbeingTools;
