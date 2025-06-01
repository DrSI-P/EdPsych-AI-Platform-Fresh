'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, BookOpen, Download, Heart, Home, Info, MessageCircle, Search, Share2, Star } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";

// Define types for parent education resources
type ResourceCategory = 'guide' | 'video' | 'activity' | 'printable' | 'course';
type AgeGroup = 'early-years' | 'primary' | 'secondary' | 'all-ages';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface ParentResource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  ageGroups: any[];
  difficultyLevel: DifficultyLevel;
  content: string;
  videoUrl?: string;
  downloadUrl?: string;
  estimatedTime?: string;
  tags: any[];
  isFavorite: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: any[];
  completed: boolean;
  progress: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  completed: boolean;
  estimatedTime: string;
}

interface FamilyActivity {
  id: string;
  title: string;
  description: string;
  ageGroups: any[];
  materials: any[];
  steps: any[];
  tips: any[];
  estimatedTime: string;
  isFavorite: boolean;
}

// Mock data for parent resources
const mockResources: any[] = [
  {
    id: '1',
    title: 'Introduction to Restorative Approaches at Home',
    description: 'A comprehensive guide to understanding and implementing restorative practices in family settings.',
    category: 'guide',
    ageGroups: ['all-ages'],
    difficultyLevel: 'beginner',
    content: `
      <h2>Understanding Restorative Approaches</h2>
      <p>Restorative approaches focus on building and repairing relationships rather than assigning blame and punishment. These approaches help children develop empathy, responsibility, and communication skills while strengthening family bonds.</p>
      
      <h3>Key Principles</h3>
      <ul>
        <li><strong>Relationships First:</strong> Prioritizing connection and understanding</li>
        <li><strong>Responsibility:</strong> Encouraging ownership of actions and their impact</li>
        <li><strong>Repair:</strong> Finding ways to make things right</li>
        <li><strong>Reintegration:</strong> Bringing everyone back into the family community</li>
      </ul>
      
      <h3>Benefits for Families</h3>
      <p>Research shows that restorative approaches at home can lead to:</p>
      <ul>
        <li>Stronger parent-child relationships</li>
        <li>Improved communication skills</li>
        <li>Better conflict resolution abilities</li>
        <li>Reduced behaviour challenges</li>
        <li>Greater emotional intelligence</li>
        <li>Consistency between home and school approaches</li>
      </ul>
    `,
    tags: ['introduction', 'basics', 'principles'],
    isFavorite: false
  },
  {
    id: '2',
    title: 'Restorative Conversations: A Guide for Parents',
    description: 'Learn how to have effective restorative conversations with your children when things go wrong.',
    category: 'guide',
    ageGroups: ['primary', 'secondary'],
    difficultyLevel: 'intermediate',
    content: `
      <h2>Restorative Conversations at Home</h2>
      <p>When conflicts or problems arise, restorative conversations provide a structured way to address the situation while maintaining connection and supporting growth.</p>
      
      <h3>Key Questions</h3>
      <p>Restorative conversations typically follow this structure:</p>
      <ol>
        <li><strong>What happened?</strong> (Allow each person to share their perspective)</li>
        <li><strong>What were you thinking/feeling at the time?</strong></li>
        <li><strong>Who has been affected and how?</strong></li>
        <li><strong>What do you need now to make things right?</strong></li>
        <li><strong>How can we prevent this from happening again?</strong></li>
      </ol>
      
      <h3>Tips for Parents</h3>
      <ul>
        <li>Stay calm and neutral during the conversation</li>
        <li>Listen actively without interrupting</li>
        <li>Focus on the behaviour, not the child</li>
        <li>Allow time for reflection</li>
        <li>Support children in finding their own solutions</li>
        <li>Follow up to check how agreements are working</li>
      </ul>
      
      <h3>Adapting for Different Ages</h3>
      <p><strong>For younger children:</strong> Simplify questions, use visual supports, keep conversations brief</p>
      <p><strong>For older children:</strong> Allow more independence in the process, explore deeper impacts, encourage self-reflection</p>
    `,
    tags: ['conversations', 'conflict resolution', 'communication'],
    isFavorite: false
  },
  {
    id: '3',
    title: 'Building a Restorative Home Environment',
    description: 'Practical strategies for creating a home culture that supports restorative approaches.',
    category: 'guide',
    ageGroups: ['all-ages'],
    difficultyLevel: 'intermediate',
    content: `
      <h2>Creating a Restorative Home Culture</h2>
      <p>A restorative home environment provides the foundation for effective restorative practices and supports children's social and emotional development.</p>
      
      <h3>Key Elements</h3>
      <ul>
        <li><strong>Family Agreements:</strong> Collaboratively created expectations for how family members treat each other</li>
        <li><strong>Regular Family Meetings:</strong> Dedicated time for connection, problem-solving, and celebration</li>
        <li><strong>Emotional Vocabulary:</strong> Helping children name and understand their feelings</li>
        <li><strong>Affective Statements:</strong> "I feel..." statements that express impact</li>
        <li><strong>Celebration Rituals:</strong> Ways to acknowledge positive moments and growth</li>
      </ul>
      
      <h3>Creating Family Agreements</h3>
      <ol>
        <li>Gather all family members</li>
        <li>Ask: "What do we need from each other to thrive as a family?"</li>
        <li>Record all suggestions</li>
        <li>Group similar ideas</li>
        <li>Create 3-5 positive, simple agreements</li>
        <li>Display prominently in your home</li>
        <li>Review and revise regularly</li>
      </ol>
      
      <h3>Sample Family Agreements</h3>
      <ul>
        <li>We speak kindly to each other</li>
        <li>We listen to understand</li>
        <li>We help each other</li>
        <li>We take responsibility for our actions</li>
        <li>We celebrate each other's successes</li>
      </ul>
    `,
    tags: ['family culture', 'agreements', 'environment'],
    isFavorite: false
  },
  {
    id: '4',
    title: 'Restorative Parenting: Video Introduction',
    description: 'A video overview of restorative parenting principles and practices.',
    category: 'video',
    ageGroups: ['all-ages'],
    difficultyLevel: 'beginner',
    content: 'Video content description and transcript would appear here.',
    videoUrl: 'https://example.com/restorative-parenting-video',
    tags: ['video', 'introduction', 'overview'],
    isFavorite: false
  },
  {
    id: '5',
    title: 'Family Circle Activity Cards',
    description: 'Printable cards with prompts and activities for family circle time.',
    category: 'printable',
    ageGroups: ['primary', 'secondary'],
    difficultyLevel: 'beginner',
    content: 'Description of the printable cards and how to use them.',
    downloadUrl: '/resources/family-circle-cards.pdf',
    tags: ['printable', 'activities', 'family circles'],
    isFavorite: false
  }
];

// Mock data for learning modules
const mockModules: any[] = [
  {
    id: '1',
    title: 'Foundations of Restorative Parenting',
    description: 'Learn the core principles and practices of restorative approaches for parents.',
    lessons: [
      {
        id: '1-1',
        title: 'Understanding Restorative Philosophy',
        description: 'An introduction to the key concepts and principles of restorative justice.',
        content: 'Lesson content would appear here.',
        completed: false,
        estimatedTime: '15 minutes'
      },
      {
        id: '1-2',
        title: 'The Science Behind Restorative Approaches',
        description: 'Explore the research and evidence supporting restorative practices.',
        content: 'Lesson content would appear here.',
        completed: false,
        estimatedTime: '20 minutes'
      },
      {
        id: '1-3',
        title: 'Comparing Approaches: Restorative vs. Traditional',
        description: 'Understand the differences between restorative and punitive approaches.',
        content: 'Lesson content would appear here.',
        completed: false,
        estimatedTime: '15 minutes'
      }
    ],
    completed: false,
    progress: 0
  },
  {
    id: '2',
    title: 'Restorative Conversations at Home',
    description: 'Master the art of having effective restorative conversations with your children.',
    lessons: [
      {
        id: '2-1',
        title: 'Preparing for Restorative Conversations',
        description: 'Learn how to create the right conditions for effective conversations.',
        content: 'Lesson content would appear here.',
        completed: false,
        estimatedTime: '10 minutes'
      },
      {
        id: '2-2',
        title: 'The Five Key Questions',
        description: 'Explore the essential questions that guide restorative conversations.',
        content: 'Lesson content would appear here.',
        completed: false,
        estimatedTime: '25 minutes'
      },
      {
        id: '2-3',
        title: 'Practise Scenarios',
        description: 'Apply what you\'ve learned to common family situations.',
        content: 'Lesson content would appear here.',
        completed: false,
        estimatedTime: '20 minutes'
      }
    ],
    completed: false,
    progress: 0
  }
];

// Mock data for family activities
const mockActivities: any[] = [
  {
    id: '1',
    title: 'Family Circle Check-In',
    description: 'A simple activity to build connection and communication through regular family circles.',
    ageGroups: ['all-ages'],
    materials: ['Talking piece (special object)', 'Comfortable seating arranged in a circle', 'Timer (optional)'],
    steps: [
      'Gather family members in a circle',
      'Explain that only the person holding the talking piece may speak',
      'Pass the talking piece around and have each person answer a check-in question',
      'Listen respectfully to each person without interrupting',
      'Thank everyone for sharing'
    ],
    tips: [
      'Start with simple, positive questions like "What was the best part of your day?"',
      'Keep sessions short (5-10 minutes) when starting out',
      'Make this a regular routine (daily or weekly)',
      'Let children take turns choosing the check-in question',
      'Model active listening and respect'
    ],
    estimatedTime: '10-15 minutes',
    isFavorite: false
  },
  {
    id: '2',
    title: 'Family Agreements Workshop',
    description: 'Create collaborative agreements about how family members will treat each other.',
    ageGroups: ['primary', 'secondary'],
    materials: ['Large paper or poster board', 'Markers or pens', 'Sticky notes', 'Blu-tack or tape'],
    steps: [
       'Gather the family and explain that you\'ll be creating agreements together',      'Ask: "What do we need from each other to thrive as a family?"',
      'Have everyone write ideas on sticky notes (help younger children)',
      'Group similar ideas together',
      'Discuss and refine into 3-5 positive, simple agreements',
      'Write the final agreements on a poster',
      'Have everyone sign the poster',
      'Display prominently in your home'
    ],
    tips: [
      'Focus on positive statements (what to do) rather than negative ones (what not to do)',
      'Keep agreements simple and memorable',
      'Ensure everyone contributes to the process',
      'Revisit and revise agreements periodically',
      'Refer to agreements when conflicts arise'
    ],
    estimatedTime: '30-45 minutes',
    isFavorite: false
  }
];

export default function ParentEducationResources() {
  const [resources, setResources] = useState<ParentResource[]>(mockResources);
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [activities, setActivities] = useState<FamilyActivity[]>(mockActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeResource, setActiveResource] = useState<ParentResource | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeActivity, setActiveActivity] = useState<FamilyActivity | null>(null);

  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAgeGroup = selectedAgeGroup === 'all' || resource.ageGroups.includes(selectedAgeGroup as AgeGroup);
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficultyLevel === selectedDifficulty;
    
    return matchesSearch && matchesAgeGroup && matchesCategory && matchesDifficulty;
  });

  // Toggle favourite status
  const toggleFavorite = (id: string, type: 'resource' | 'activity') => {
    if (type === 'resource') {
      setResources(resources.map(resource => 
        resource.id === id ? { ...resource, isFavorite: !resource.isFavorite } : resource
      ));
    } else {
      setActivities(activities.map(activity => 
        activity.id === id ? { ...activity, isFavorite: !activity.isFavorite } : activity
      ));
    }
    
    toast({
      title: "Success",
      description: "Item has been added to your favorites.",
    });
  };

  // Mark lesson as completed
  const completeLesson = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        const updatedLessons = module.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        );
        
        const completedLessons = updatedLessons.filter(lesson => lesson.completed).length;
        const progress = Math.round((completedLessons / updatedLessons.length) * 100);
        const allCompleted = completedLessons === updatedLessons.length;
        
        return {
          ...module,
          lessons: updatedLessons,
          progress,
          completed: allCompleted
        };
      }
      return module;
    });
    
    setModules(updatedModules);
    
    toast({
      title: "Lesson Completed",
      description: "Your progress has been saved.",
    });
  };

  // View resource details
  const viewResource = (resource: ParentResource) => {
    setActiveResource(resource);
    setActiveModule(null);
    setActiveLesson(null);
    setActiveActivity(null);
  };

  // View module details
  const viewModule = (module: Module) => {
    setActiveModule(module);
    setActiveResource(null);
    setActiveLesson(null);
    setActiveActivity(null);
  };

  // View lesson details
  const viewLesson = (module: Module, lesson: Lesson) => {
    setActiveModule(module);
    setActiveLesson(lesson);
    setActiveResource(null);
    setActiveActivity(null);
  };

  // View activity details
  const viewActivity = (activity: FamilyActivity) => {
    setActiveActivity(activity);
    setActiveResource(null);
    setActiveModule(null);
    setActiveLesson(null);
  };

  // Reset active views
  const resetViews = () => {
    setActiveResource(null);
    setActiveModule(null);
    setActiveLesson(null);
    setActiveActivity(null);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Parent Education Resources</h1>
      <p className="text-muted-foreground mb-6">
        Evidence-based resources to help parents implement restorative approaches at home
      </p>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="resources">Resources Library</TabsTrigger>
          <TabsTrigger value="learning">Learning Modules</TabsTrigger>
          <TabsTrigger value="activities">Family Activities</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        {/* Resources Library Tab */}
        <TabsContent value="resources" className="space-y-4">
          {!activeResource ? (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Resource Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="guide">Guides</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="activity">Activities</SelectItem>
                      <SelectItem value="printable">Printables</SelectItem>
                      <SelectItem value="course">Courses</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Age Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="early-years">Early Years (3-5)</SelectItem>
                      <SelectItem value="primary">Primary (5-11)</SelectItem>
                      <SelectItem value="secondary">Secondary (11-18)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <Card key={resource.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(resource.id, 'resource')}
                          >
                            <Heart className={`h-5 w-5 ${resource.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                        </div>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {resource.category === 'guide' && (
                            <Badge variant="outline">Guide</Badge>
                          )}
                          {resource.category === 'video' && (
                            <Badge variant="outline">Video</Badge>
                          )}
                          {resource.category === 'printable' && (
                            <Badge variant="outline">Printable</Badge>
                          )}
                          {resource.category === 'activity' && (
                            <Badge variant="outline">Activity</Badge>
                          )}
                          {resource.category === 'course' && (
                            <Badge variant="outline">Course</Badge>
                          )}
                          
                          {resource.ageGroups.includes('early-years') && (
                            <Badge>Early Years</Badge>
                          )}
                          {resource.ageGroups.includes('primary') && (
                            <Badge>Primary</Badge>
                          )}
                          {resource.ageGroups.includes('secondary') && (
                            <Badge>Secondary</Badge>
                          )}
                          {resource.ageGroups.includes('all-ages') && (
                            <Badge>All Ages</Badge>
                          )}
                          
                          <Badge variant="secondary">{resource.difficultyLevel}</Badge>
                        </div>
                        
                        {resource.estimatedTime && (
                          <div className="text-sm text-muted-foreground">
                            Time: {resource.estimatedTime}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => viewResource(resource)}>View Resource</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 p-8 text-centre">
                    <div className="mb-4 flex justify-centre">
                      <AlertCircle className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No resources found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <Button onClick={() => {
                      setSearchQuery('');
                      setSelectedAgeGroup('all');
                      setSelectedCategory('all');
                      setSelectedDifficulty('all');
                    }}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-centre">
                <Button variant="outline" onClick={resetViews}>
                  Back to Resources
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(activeResource.id, 'resource')}
                  >
                    <Heart className={`h-5 w-5 ${activeResource.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  {activeResource.downloadUrl && (
                    <Button variant="outline" size="icon">
                      <Download className="h-5 w-5" />
                    </Button>
                  )}
                  <Button variant="outline" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>{activeResource.title}</CardTitle>
                  <CardDescription>{activeResource.description}</CardDescription>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">{activeResource.category}</Badge>
                    {activeResource.ageGroups.map(age => (
                      <Badge key={age}>{age.replace('-', ' ')}</Badge>
                    ))}
                    <Badge variant="secondary">{activeResource.difficultyLevel}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {activeResource.videoUrl ? (
                    <div className="aspect-video bg-muted rounded-md flex items-centre justify-centre mb-4">
                      <p className="text-muted-foreground">Video player would be embedded here</p>
                    </div>
                  ) : null}
                  
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: activeResource.content }} />
                  
                  {activeResource.downloadUrl && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Downloads</h3>
                      <Button variant="outline" className="flex items-centre gap-2">
                        <Download className="h-4 w-4" />
                        Download Resource
                      </Button>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex flex-col items-start gap-4">
                  <div className="w-full">
                    <h3 className="text-lg font-medium mb-2">Related Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {resources
                        .filter(r => r.id !== activeResource.id && r.tags.some(tag => 
                          activeResource.tags.includes(tag)
                        ))
                        .slice(0, 2)
                        .map(resource => (
                          <Card key={resource.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-md">{resource.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {resource.description}
                              </p>
                            </CardContent>
                            <CardFooter>
                              <Button variant="outline" size="sm" onClick={() => viewResource(resource)}>
                                View
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Learning Modules Tab */}
        <TabsContent value="learning" className="space-y-4">
          {!activeModule ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((module) => (
                <Card key={module.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {module.lessons.length} lessons • {
                        module.lessons.reduce((total, lesson) => {
                          const time = parseInt(lesson.estimatedTime.split(' ')[0]);
                          return total + time;
                        }, 0)
                      } minutes total
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => viewModule(module)}>
                      {module.progress > 0 ? 'Continue' : 'Start'} Module
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : activeLesson ? (
            <div className="space-y-4">
              <div className="flex justify-between items-centre">
                <Button variant="outline" onClick={() => {
                  setActiveLesson(null);
                }}>
                  Back to Module
                </Button>
                <div className="flex items-centre gap-2">
                  <span className="text-sm text-muted-foreground">
                    {activeModule.lessons.findIndex(l => l.id === activeLesson.id) + 1} of {activeModule.lessons.length}
                  </span>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>{activeLesson.title}</CardTitle>
                  <CardDescription>{activeLesson.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="prose max-w-none">
                    <p>This is where the lesson content would appear. It would include text, images, videos, and interactive elements to help parents learn about restorative approaches.</p>
                    
                    <h3>Key Points</h3>
                    <ul>
                      <li>Important concept one</li>
                      <li>Important concept two</li>
                      <li>Important concept three</li>
                    </ul>
                    
                    <h3>Practical Application</h3>
                    <p>Here's how you can apply this concept in your home...</p>
                    
                    <div className="bg-muted p-4 rounded-md my-4">
                      <h4>Reflection Question</h4>
                      <p>How might this approach change how you respond to conflicts in your family?</p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col items-start gap-4">
                  <div className="w-full flex justify-between">
                    <Button 
                      variant="outline"
                      disabled={activeModule.lessons.findIndex(l => l.id === activeLesson.id) === 0}
                      onClick={() => {
                        const currentIndex = activeModule.lessons.findIndex(l => l.id === activeLesson.id);
                        if (currentIndex > 0) {
                          setActiveLesson(activeModule.lessons[currentIndex - 1]);
                        }
                      }}
                    >
                      Previous Lesson
                    </Button>
                    
                    {activeLesson.completed ? (
                      <div className="flex items-centre gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completed
                        </Badge>
                        <Button
                          onClick={() => {
                            const currentIndex = activeModule.lessons.findIndex(l => l.id === activeLesson.id);
                            if (currentIndex < activeModule.lessons.length - 1) {
                              setActiveLesson(activeModule.lessons[currentIndex + 1]);
                            } else {
                              setActiveLesson(null);
                            }
                          }}
                        >
                          {activeModule.lessons.findIndex(l => l.id === activeLesson.id) < activeModule.lessons.length - 1 
                            ? 'Next Lesson' 
                            : 'Finish Module'}
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => completeLesson(activeModule.id, activeLesson.id)}
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-centre">
                <Button variant="outline" onClick={resetViews}>
                  Back to Modules
                </Button>
                <div className="flex items-centre gap-2">
                  <span className="text-sm text-muted-foreground">
                    {activeModule.lessons.filter(l => l.completed).length} of {activeModule.lessons.length} completed
                  </span>
                  <Progress value={activeModule.progress} className="w-24 h-2" />
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>{activeModule.title}</CardTitle>
                  <CardDescription>{activeModule.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {activeModule.lessons.map((lesson, index) => (
                      <div 
                        key={lesson.id}
                        className="flex items-centre justify-between p-3 rounded-md border"
                      >
                        <div className="flex items-centre gap-3">
                          <div className={`flex items-centre justify-centre w-6 h-6 rounded-full text-xs font-medium ${
                            lesson.completed 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <p className="text-sm text-muted-foreground">{lesson.estimatedTime}</p>
                          </div>
                        </div>
                        <Button 
                          variant={lesson.completed ? "outline" : "default"}
                          onClick={() => viewLesson(activeModule, lesson)}
                        >
                          {lesson.completed ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  {activeModule.completed ? (
                    <div className="w-full">
                      <Alert className="bg-green-50 text-green-700 border-green-200">
                        <div className="flex items-centre gap-2">
                          <div className="h-4 w-4 rounded-full bg-green-500" />
                          <AlertTitle>Module Completed</AlertTitle>
                        </div>
                        <AlertDescription>
                          Congratulations! You've completed all lessons in this module.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="mt-4 flex justify-centre">
                        <Button>Download Certificate</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <p className="text-centre text-muted-foreground mb-4">
                        Complete all lessons to finish this module
                      </p>
                      <div className="flex justify-centre">
                        <Button 
                          onClick={() => {
                            const firstIncomplete = activeModule.lessons.find(l => !l.completed);
                            if (firstIncomplete) {
                              viewLesson(activeModule, firstIncomplete);
                            }
                          }}
                        >
                          Continue Module
                        </Button>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Family Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          {!activeActivity ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(activity.id, 'activity')}
                      >
                        <Heart className={`h-5 w-5 ${activity.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {activity.ageGroups.map(age => (
                        <Badge key={age}>{age.replace('-', ' ')}</Badge>
                      ))}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Time: {activity.estimatedTime}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => viewActivity(activity)}>View Activity</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-centre">
                <Button variant="outline" onClick={resetViews}>
                  Back to Activities
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(activeActivity.id, 'activity')}
                  >
                    <Heart className={`h-5 w-5 ${activeActivity.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>{activeActivity.title}</CardTitle>
                  <CardDescription>{activeActivity.description}</CardDescription>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activeActivity.ageGroups.map(age => (
                      <Badge key={age}>{age.replace('-', ' ')}</Badge>
                    ))}
                    <Badge variant="outline">{activeActivity.estimatedTime}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Materials Needed</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {activeActivity.materials.map((material, index) => (
                          <li key={index}>{material}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Steps</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        {activeActivity.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Tips for Success</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {activeActivity.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col items-start gap-4">
                  <div className="w-full">
                    <h3 className="text-lg font-medium mb-2">Related Activities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {activities
                        .filter(a => a.id !== activeActivity.id)
                        .slice(0, 2)
                        .map(activity => (
                          <Card key={activity.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-md">{activity.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {activity.description}
                              </p>
                            </CardContent>
                            <CardFooter>
                              <Button variant="outline" size="sm" onClick={() => viewActivity(activity)}>
                                View
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Parent Education Resources</CardTitle>
              <CardDescription>
                Evidence-based resources to support parents in implementing restorative approaches at home
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <h3>What are Restorative Approaches?</h3>
                <p>
                  Restorative approaches focus on building and repairing relationships rather than assigning blame and punishment. 
                  These approaches help children develop empathy, responsibility, and communication skills while strengthening family bonds.
                </p>
                
                <h3>Benefits for Families</h3>
                <p>Research shows that restorative approaches at home can lead to:</p>
                <ul>
                  <li>Stronger parent-child relationships</li>
                  <li>Improved communication skills</li>
                  <li>Better conflict resolution abilities</li>
                  <li>Reduced behaviour challenges</li>
                  <li>Greater emotional intelligence</li>
                  <li>Consistency between home and school approaches</li>
                </ul>
                
                <h3>Core Principles</h3>
                <ol>
                  <li><strong>Relationships First:</strong> Prioritizing connection and understanding</li>
                  <li><strong>Responsibility:</strong> Encouraging ownership of actions and their impact</li>
                  <li><strong>Repair:</strong> Finding ways to make things right</li>
                  <li><strong>Reintegration:</strong> Bringing everyone back into the family community</li>
                </ol>
                
                <h3>Evidence Base</h3>
                <p>
                  These resources are based on established research in restorative justice, educational psychology, 
                  and family systems theory. They have been adapted specifically for home use, ensuring they are 
                  practical and accessible for parents.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>How to Use These Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Resources Library</h3>
                    <p className="text-muted-foreground">
                      Browse guides, videos, and printable materials to learn about restorative approaches and how to implement them at home.
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Learning Modules</h3>
                    <p className="text-muted-foreground">
                      Complete structured courses to build your knowledge and skills in restorative parenting, tracking your progress as you go.
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Family Activities</h3>
                    <p className="text-muted-foreground">
                      Find practical activities to do with your family that build relationships and practise restorative skills together.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>References</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  Hopkins, B. (2004). Just Schools: A Whole School Approach to Restorative Justice. Jessica Kingsley Publishers.
                </p>
                <p className="text-sm">
                  Zehr, H. (2015). The Little Book of Restorative Justice: Revised and Updated. Good Books.
                </p>
                <p className="text-sm">
                  Thorsborne, M., & Blood, P. (2013). Implementing Restorative Practices in Schools. Jessica Kingsley Publishers.
                </p>
                <p className="text-sm">
                  Boyes-Watson, C., & Pranis, K. (2015). Circle Forward: Building a Restorative School Community. Living Justice Press.
                </p>
                <p className="text-sm">
                  Morrison, B. (2007). Restoring Safe School Communities: A Whole School Response to Bullying, Violence and Alienation. Federation Press.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
