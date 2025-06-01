'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  BookOpen, 
  CheckCircle, 
  Download, 
  FileText, 
  Filter, 
  Info, 
  Layers, 
  Play, 
  Plus, 
  RefreshCw, 
  Search, 
  Settings, 
  Sliders, 
  ThumbsUp, 
  Volume2 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

// Types for type safety
interface SensoryActivity {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  intensity: number;
  suitableFor: any[];
  materials: any[];
  steps: any[];
  benefits: any[];
  cautions: any[];
  imageUrl?: string;
}

interface SensoryProfile {
  id: string;
  name: string;
  visual: number;
  auditory: number;
  tactile: number;
  vestibular: number;
  proprioceptive: number;
  olfactory: number;
  gustatory: number;
  notes: string;
}

export function SensoryRegulationEngine() {
  const { toast } = useToast();
  
  // State for activities and profiles
  const [activities, setActivities] = useState<SensoryActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [sensoryProfile, setSensoryProfile] = useState<SensoryProfile | null>(null);
  
  // State for UI
  const [activeTab, setActiveTab] = useState('activities');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [intensityFilter, setIntensityFilter] = useState('all');
  
  // Sample sensory activities
  const sampleActivities: any[] = [
    {
      id: 'act1',
      name: 'Deep Pressure Squeeze',
      description: 'A calming activity that provides deep pressure input to help with regulation.',
      category: 'proprioceptive',
      duration: '5-10 minutes',
      intensity: 2,
      suitableFor: ['Sensory seeking', 'Anxiety', 'Hyperactivity'],
      materials: ['Therapy blanket or mat (optional)'],
      steps: [
        'Find a quiet, comfortable space',
        'Sit or lie down in a comfortable position',
        'Apply gentle, firm pressure across the body',
        'Hold pressure for 5-10 seconds, then release',
        'Repeat as needed for regulation'
      ],
      benefits: [
        'Promotes calm and focus',
        'Reduces anxiety and stress',
        'Improves body awareness',
        'Helps with emotional regulation'
      ],
      cautions: [
        'Always respect personal boundaries',
        'Adjust pressure based on individual comfort',
        'Discontinue if signs of distress appear'
      ],
      imageUrl: '/images/deep-pressure.jpg'
    },
    {
      id: 'act2',
      name: 'Calming Sound Journey',
      description: 'An auditory activity using specific sounds and music to promote regulation and focus.',
      category: 'auditory',
      duration: '10-15 minutes',
      intensity: 1,
      suitableFor: ['Auditory sensitivity', 'Anxiety', 'Focus challenges'],
      materials: [
        'Headphones',
        'Device for playing sounds',
        'Calming sound tracks or white noise'
      ],
      steps: [
        'Find a quiet, comfortable space',
        'Put on headphones',
        'Select appropriate calming sounds or music',
        'Close eyes and focus on breathing',
        'Listen for 10-15 minutes'
      ],
      benefits: [
        'Reduces auditory overstimulation',
        'Promotes relaxation and calm',
        'Improves focus and attention',
        'Supports emotional regulation'
      ],
      cautions: [
        'Keep volume at a safe level',
        'Select sounds appropriate for individual sensitivities',
        'Monitor for signs of discomfort'
      ],
      imageUrl: '/images/sound-journey.jpg'
    },
    {
      id: 'act3',
      name: 'Tactile Exploration Box',
      description: 'A sensory activity using various textures and materials for tactile input and exploration.',
      category: 'tactile',
      duration: '15-20 minutes',
      intensity: 3,
      suitableFor: ['Tactile sensitivity', 'Sensory seeking', 'Fine motor development'],
      materials: [
        'Container or box',
        'Various textured materials (soft, rough, smooth, etc.)',
        'Small objects with different textures',
        'Sensory tools (brushes, balls, etc.)'
      ],
      steps: [
        'Prepare box with various tactile materials',
        'Introduce the activity calmly',
        'Allow exploration at individual pace',
        'Encourage description of sensations',
        'Provide guidance for uncomfortable textures'
      ],
      benefits: [
        'Develops tactile discrimination',
        'Reduces tactile defensiveness',
        'Improves sensory processing',
        'Enhances fine motor skills'
      ],
      cautions: [
        'Monitor for signs of tactile overload',
        'Introduce new textures gradually',
        'Respect preferences and boundaries',
        'Ensure all materials are safe'
      ],
      imageUrl: '/images/tactile-box.jpg'
    },
    {
      id: 'act4',
      name: 'Vestibular Balance Course',
      description: 'A movement-based activity to provide vestibular input and improve balance and coordination.',
      category: 'vestibular',
      duration: '15-20 minutes',
      intensity: 4,
      suitableFor: ['Vestibular seeking', 'Balance challenges', 'Coordination development'],
      materials: [
        'Balance beam or line on floor',
        'Stepping stones or markers',
        'Balance board (optional)',
        'Soft surface for safety'
      ],
      steps: [
        'Set up a simple obstacle course',
        'Demonstrate each movement',
        'Start with simpler movements',
        'Progress to more challenging activities',
        'Include a calming activity at the end'
      ],
      benefits: [
        'Improves balance and coordination',
        'Develops body awareness',
        'Enhances vestibular processing',
        'Builds confidence in movement'
      ],
      cautions: [
        'Ensure safety with proper supervision',
        'Monitor for signs of overstimulation',
        'Provide physical support when needed',
        'Adjust difficulty based on individual needs'
      ],
      imageUrl: '/images/balance-course.jpg'
    },
    {
      id: 'act5',
      name: 'Calming Visual Bottle',
      description: 'A visual sensory tool that provides calming visual input through movement and color.',
      category: 'visual',
      duration: '5-10 minutes',
      intensity: 1,
      suitableFor: ['Visual stimulation', 'Anxiety', 'Self-regulation'],
      materials: [
        'Clear bottle with lid',
        'Water',
        'Glitter or small objects',
        'Food coloring (optional)',
        'Glue for sealing'
      ],
      steps: [
        'Fill bottle with water and materials',
        'Secure lid tightly',
        'Shake bottle to activate',
        'Observe the movement of materials',
        'Focus on breathing while watching'
      ],
      benefits: [
        'Provides calming visual input',
        'Supports mindfulness and focus',
        'Helps with emotional regulation',
        'Creates a visual break from stimulation'
      ],
      cautions: [
        'Ensure bottle is securely sealed',
        'Monitor for appropriate use',
        'Replace if damaged',
        'Use as a tool, not a distraction'
      ],
      imageUrl: '/images/visual-bottle.jpg'
    }
  ];
  
  // Sample sensory profile
  const sampleProfile: SensoryProfile = {
    id: 'profile1',
    name: 'Default Sensory Profile',
    visual: 3,
    auditory: 4,
    tactile: 2,
    vestibular: 5,
    proprioceptive: 3,
    olfactory: 2,
    gustatory: 1,
    notes: 'This is a sample sensory profile. In a real implementation, this would be personalized based on assessment.'
  };
  
  // Load data on component mount
  useEffect(() => {
    // Simulate API call to load activities
    const loadActivities = async () => {
      try {
        // In a real implementation, this would be an API call
        setTimeout(() => {
          setActivities(sampleActivities);
          setSensoryProfile(sampleProfile);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading activities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load sensory activities. Please try again.',
          variant: 'destructive'
        });
      }
    };
    
    loadActivities();
  }, [toast]);
  
  // Handle activity selection
  const handleActivitySelect = (activity: SensoryActivity) => {
    setSelectedActivity(activity);
  };
  
  // Filter activities based on search query and filters
  const filteredActivities = activities.filter(activity => {
    // Search query filter
    if (searchQuery && !activity.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !activity.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== 'all' && activity.category !== categoryFilter) {
      return false;
    }
    
    // Intensity filter
    if (intensityFilter !== 'all') {
      const intensity = parseInt(intensityFilter);
      if (activity.intensity !== intensity) {
        return false;
      }
    }
    
    return true;
  });
  
  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'visual':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'auditory':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'tactile':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'vestibular':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'proprioceptive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'olfactory':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'gustatory':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Get intensity label
  const getIntensityLabel = (intensity: number) => {
    switch (intensity) {
      case 1:
        return 'Very Calm';
      case 2:
        return 'Calm';
      case 3:
        return 'Moderate';
      case 4:
        return 'Energetic';
      case 5:
        return 'Very Energetic';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activities">Sensory Activities</TabsTrigger>
          <TabsTrigger value="profile">Sensory Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Sensory Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Sensory Regulation Activities
              </CardTitle>
              <CardDescription>
                Explore and implement sensory activities for regulation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search activities..." 
                    className="pl-8" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select 
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="visual">Visual</SelectItem>
                    <SelectItem value="auditory">Auditory</SelectItem>
                    <SelectItem value="tactile">Tactile</SelectItem>
                    <SelectItem value="vestibular">Vestibular</SelectItem>
                    <SelectItem value="proprioceptive">Proprioceptive</SelectItem>
                    <SelectItem value="olfactory">Olfactory</SelectItem>
                    <SelectItem value="gustatory">Gustatory</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={intensityFilter}
                  onValueChange={setIntensityFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Intensities</SelectItem>
                    <SelectItem value="1">Very Calm</SelectItem>
                    <SelectItem value="2">Calm</SelectItem>
                    <SelectItem value="3">Moderate</SelectItem>
                    <SelectItem value="4">Energetic</SelectItem>
                    <SelectItem value="5">Very Energetic</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredActivities.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredActivities.map((activity) => (
                    <Card 
                      key={activity.id} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleActivitySelect(activity)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{activity.name}</CardTitle>
                            <div className="flex space-x-2 mt-1">
                              <Badge className={getCategoryColor(activity.category)}>
                                {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                              </Badge>
                              <Badge variant="outline">
                                {getIntensityLabel(activity.intensity)}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="text-sm font-medium">{activity.duration}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm mb-3">{activity.description}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          {activity.suitableFor.map((item, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivitySelect(activity);
                          }}
                        >
                          <Info className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivitySelect(activity);
                            toast({
                              title: 'Activity Added',
                              description: `${activity.name} has been added to your schedule.`,
                            });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Schedule
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] bg-muted/50 rounded-md">
                  <p className="text-muted-foreground mb-4">No activities found matching your filters</p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setIntensityFilter('all');
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Activity
              </Button>
            </CardFooter>
          </Card>
          
          {selectedActivity && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedActivity.name}</CardTitle>
                    <CardDescription>
                      Detailed information and implementation guide
                    </CardDescription>
                  </div>
                  <Badge className={getCategoryColor(selectedActivity.category)}>
                    {selectedActivity.category.charAt(0).toUpperCase() + selectedActivity.category.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm">{selectedActivity.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Materials Needed</h3>
                    <ul className="space-y-1">
                      {selectedActivity.materials.map((material, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                          {material}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Suitable For</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedActivity.suitableFor.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="text-sm font-medium mt-4 mb-2">Intensity</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">Calm</span>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(selectedActivity.intensity / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">Energetic</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Implementation Steps</h3>
                  <ol className="space-y-1">
                    {selectedActivity.steps.map((step, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="font-medium mr-2">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Benefits</h3>
                    <ul className="space-y-1">
                      {selectedActivity.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <ThumbsUp className="h-4 w-4 mr-2 text-blue-600 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Cautions</h3>
                    <ul className="space-y-1">
                      {selectedActivity.cautions.map((caution, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <Info className="h-4 w-4 mr-2 text-amber-600 mt-0.5" />
                          {caution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Guide
                </Button>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Start Activity
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        {/* Sensory Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="mr-2 h-5 w-5" />
                Sensory Profile
              </CardTitle>
              <CardDescription>
                View and manage sensory processing profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : sensoryProfile ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{sensoryProfile.name}</h3>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Full Assessment
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Visual Processing</h4>
                        <span className="text-sm">
                          {sensoryProfile.visual < 3 ? 'Under-responsive' : 
                           sensoryProfile.visual > 3 ? 'Over-responsive' : 'Typical'}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(sensoryProfile.visual / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Auditory Processing</h4>
                        <span className="text-sm">
                          {sensoryProfile.auditory < 3 ? 'Under-responsive' : 
                           sensoryProfile.auditory > 3 ? 'Over-responsive' : 'Typical'}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-purple-600 h-2.5 rounded-full" 
                          style={{ width: `${(sensoryProfile.auditory / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Tactile Processing</h4>
                        <span className="text-sm">
                          {sensoryProfile.tactile < 3 ? 'Under-responsive' : 
                           sensoryProfile.tactile > 3 ? 'Over-responsive' : 'Typical'}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${(sensoryProfile.tactile / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Vestibular Processing</h4>
                        <span className="text-sm">
                          {sensoryProfile.vestibular < 3 ? 'Under-responsive' : 
                           sensoryProfile.vestibular > 3 ? 'Over-responsive' : 'Typical'}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-amber-600 h-2.5 rounded-full" 
                          style={{ width: `${(sensoryProfile.vestibular / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Proprioceptive Processing</h4>
                        <span className="text-sm">
                          {sensoryProfile.proprioceptive < 3 ? 'Under-responsive' : 
                           sensoryProfile.proprioceptive > 3 ? 'Over-responsive' : 'Typical'}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-red-600 h-2.5 rounded-full" 
                          style={{ width: `${(sensoryProfile.proprioceptive / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Olfactory Processing</h4>
                        <span className="text-sm">
                          {sensoryProfile.olfactory < 3 ? 'Under-responsive' : 
                           sensoryProfile.olfactory > 3 ? 'Over-responsive' : 'Typical'}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${(sensoryProfile.olfactory / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Gustatory Processing</h4>
                        <span className="text-sm">
                          {sensoryProfile.gustatory < 3 ? 'Under-responsive' : 
                           sensoryProfile.gustatory > 3 ? 'Over-responsive' : 'Typical'}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-pink-600 h-2.5 rounded-full" 
                          style={{ width: `${(sensoryProfile.gustatory / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Notes</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm">{sensoryProfile.notes}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recommended Activities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activities.slice(0, 4).map((activity) => (
                        <Card key={activity.id} className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium">{activity.name}</h4>
                              <Badge className={getCategoryColor(activity.category)} variant="secondary" className="mt-1 text-xs">
                                {activity.category}
                              </Badge>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => handleActivitySelect(activity)}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] bg-muted/50 rounded-md">
                  <p className="text-muted-foreground mb-4">No sensory profile found</p>
                  <Button>Create New Profile</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Profile
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Update Assessment
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Sensory Regulation Settings
              </CardTitle>
              <CardDescription>
                Customize sensory regulation tools and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Environment Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reducedVisual">Reduced Visual Stimulation</Label>
                      <p className="text-xs text-muted-foreground">
                        Minimize visual distractions and bright elements
                      </p>
                    </div>
                    <Switch id="reducedVisual" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reducedAudio">Reduced Auditory Stimulation</Label>
                      <p className="text-xs text-muted-foreground">
                        Lower volume and minimize background sounds
                      </p>
                    </div>
                    <Switch id="reducedAudio" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brightness">Screen Brightness</Label>
                    <div className="flex items-center space-x-2">
                      <Sliders className="h-4 w-4" />
                      <Slider
                        id="brightness"
                        defaultValue={[70]}
                        max={100}
                        step={10}
                        className="flex-1"
                      />
                      <Sliders className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="volume">Audio Volume</Label>
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-4 w-4" />
                      <Slider
                        id="volume"
                        defaultValue={[50]}
                        max={100}
                        step={10}
                        className="flex-1"
                      />
                      <Volume2 className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Activity Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="timerVisual">Visual Timer</Label>
                      <p className="text-xs text-muted-foreground">
                        Show visual countdown timer during activities
                      </p>
                    </div>
                    <Switch id="timerVisual" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="audioPrompts">Audio Prompts</Label>
                      <p className="text-xs text-muted-foreground">
                        Provide verbal instructions and prompts
                      </p>
                    </div>
                    <Switch id="audioPrompts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="visualSupports">Visual Supports</Label>
                      <p className="text-xs text-muted-foreground">
                        Include visual aids and demonstrations
                      </p>
                    </div>
                    <Switch id="visualSupports" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="breakReminders">Break Reminders</Label>
                      <p className="text-xs text-muted-foreground">
                        Prompt for sensory breaks at regular intervals
                      </p>
                    </div>
                    <Switch id="breakReminders" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scheduleReminders">Schedule Reminders</Label>
                      <p className="text-xs text-muted-foreground">
                        Send reminders for scheduled sensory activities
                      </p>
                    </div>
                    <Switch id="scheduleReminders" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="progressUpdates">Progress Updates</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive updates on sensory regulation progress
                      </p>
                    </div>
                    <Switch id="progressUpdates" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newActivities">New Activities</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when new sensory activities are available
                      </p>
                    </div>
                    <Switch id="newActivities" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Data Collection</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="trackEffectiveness">Track Effectiveness</Label>
                      <p className="text-xs text-muted-foreground">
                        Record effectiveness of sensory activities
                      </p>
                    </div>
                    <Switch id="trackEffectiveness" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoSuggestions">Automatic Suggestions</Label>
                      <p className="text-xs text-muted-foreground">
                        Suggest activities based on collected data
                      </p>
                    </div>
                    <Switch id="autoSuggestions" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dataSharing">Data Sharing</Label>
                    <Select defaultValue="team">
                      <SelectTrigger id="dataSharing">
                        <SelectValue placeholder="Select sharing option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No sharing</SelectItem>
                        <SelectItem value="team">Educational team only</SelectItem>
                        <SelectItem value="parents">Include parents/guardians</SelectItem>
                        <SelectItem value="all">All stakeholders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
