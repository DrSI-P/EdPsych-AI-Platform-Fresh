'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  FileText, 
  Heart, 
  Home, 
  User,
  Download,
  ExternalLink
} from 'lucide-react';

import { HomeLearningResource } from '@/lib/parent-portal/types';

// Mock data for demonstration
const mockResources: HomeLearningResource[] = [
  {
    id: 'r1',
    title: 'Fractions Made Easy',
    description: 'Interactive lessons on fractions with visual examples and practice exercises.',
    subject: 'MATHEMATICS',
    keyStage: 'KS2',
    learningStyle: 'VISUAL',
    type: 'activity',
    estimatedDuration: 20,
    url: '/resources/fractions-made-easy',
    thumbnailUrl: '/images/resources/fractions.png',
    tags: ['fractions', 'numeracy', 'visual learning'],
    difficulty: 'medium',
    parentGuidance: 'Help your child visualize fractions using everyday objects like pizza slices or chocolate bars.'
  },
  {
    id: 'r2',
    title: 'Spelling Practice',
    description: 'Interactive spelling games focusing on common mistakes and challenging words.',
    subject: 'ENGLISH',
    keyStage: 'KS2',
    learningStyle: 'AUDITORY',
    type: 'game',
    estimatedDuration: 15,
    url: '/resources/spelling-practice',
    thumbnailUrl: '/images/resources/spelling.png',
    tags: ['spelling', 'literacy', 'interactive'],
    difficulty: 'medium',
    parentGuidance: 'Encourage your child to say the words aloud before spelling them.'
  },
  {
    id: 'r3',
    title: 'Map Skills Tutorial',
    description: 'Video tutorial on reading and interpreting different types of maps.',
    subject: 'GEOGRAPHY',
    keyStage: 'KS2',
    learningStyle: 'VISUAL',
    type: 'video',
    estimatedDuration: 10,
    url: '/resources/map-skills',
    thumbnailUrl: '/images/resources/maps.png',
    tags: ['geography', 'maps', 'spatial awareness'],
    difficulty: 'easy',
    parentGuidance: 'After watching, practice map skills during family walks or car journeys.'
  },
  {
    id: 'r4',
    title: 'Times Tables Practice',
    description: 'Interactive games to improve times tables recall and speed.',
    subject: 'MATHEMATICS',
    keyStage: 'KS2',
    learningStyle: 'KINESTHETIC',
    type: 'game',
    estimatedDuration: 15,
    url: '/resources/times-tables',
    thumbnailUrl: '/images/resources/times-tables.png',
    tags: ['multiplication', 'numeracy', 'speed'],
    difficulty: 'medium',
    parentGuidance: 'Try to practice times tables in short, regular sessions rather than one long session.'
  },
  {
    id: 'r5',
    title: 'Reading Comprehension Stories',
    description: 'A collection of short stories with comprehension questions to improve understanding.',
    subject: 'ENGLISH',
    keyStage: 'KS2',
    learningStyle: 'VISUAL',
    type: 'reading',
    estimatedDuration: 25,
    url: '/resources/reading-comprehension',
    thumbnailUrl: '/images/resources/reading.png',
    tags: ['reading', 'comprehension', 'literacy'],
    difficulty: 'challenging',
    parentGuidance: 'Discuss the story with your child before they answer the questions to check their understanding.'
  },
  {
    id: 'r6',
    title: 'Science Experiments at Home',
    description: 'Simple science experiments that can be done at home with everyday materials.',
    subject: 'SCIENCE',
    keyStage: 'KS2',
    learningStyle: 'KINESTHETIC',
    type: 'activity',
    estimatedDuration: 30,
    url: '/resources/home-science',
    thumbnailUrl: '/images/resources/science.png',
    tags: ['science', 'experiments', 'hands-on'],
    difficulty: 'medium',
    parentGuidance: 'Adult supervision required for all experiments. Discuss predictions before starting.'
  }
];

// Mock learning styles guidance
const learningStylesGuidance = {
  VISUAL: {
    title: 'Visual Learner',
    description: 'Visual learners learn best through seeing. They prefer pictures, diagrams, and written directions.',
    tips: [
      'Use diagrams and charts when explaining concepts',
      'Encourage mind mapping for organizing ideas',
      'Provide colourful visual aids for key information',
      'Use videos and demonstrations when teaching new skills',
      'Encourage highlighting and colour-coding in notes'
    ]
  },
  AUDITORY: {
    title: 'Auditory Learner',
    description: 'Auditory learners learn best through listening. They prefer verbal instructions and discussions.',
    tips: [
      'Read aloud when studying together',
      'Discuss concepts verbally rather than just writing them down',
      'Use rhymes or songs to remember information',
      'Encourage participation in group discussions',
      'Record lessons or information for replay later'
    ]
  },
  KINESTHETIC: {
    title: 'Kinesthetic Learner',
    description: 'Kinesthetic learners learn best through doing. They prefer hands-on activities and movement.',
    tips: [
      'Incorporate physical activities into learning',
      'Use manipulatives and objects they can touch',
      'Take frequent breaks for movement',
      'Create models or act out concepts',
      'Apply learning to real-world situations'
    ]
  },
  READING_WRITING: {
    title: 'Reading/Writing Learner',
    description: 'Reading/Writing learners learn best through words. They prefer reading and writing activities.',
    tips: [
      'Encourage note-taking and summarizing',
      'Provide written instructions and explanations',
      'Use word-based games and activities',
      'Create lists and glossaries of important terms',
      'Encourage journal writing about what they have learned'
    ]
  }
};

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('recommended');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<HomeLearningResource | null>(null);
  
  // Filter resources based on selections
  const filteredResources = mockResources.filter(resource => {
    if (selectedSubject && resource.subject !== selectedSubject) return false;
    if (selectedDifficulty && resource.difficulty !== selectedDifficulty) return false;
    if (selectedType && resource.type !== selectedType) return false;
    return true;
  });
  
  // Format duration for display
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minutes` : ''}`;
    }
  };
  
  // Get subject display name
  const getSubjectDisplayName = (subject: string) => {
    return subject.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'medium':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'challenging':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default:
        return '';
    }
  };
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'activity':
        return <FileText className="h-5 w-5" />;
      case 'game':
        return <div className="h-5 w-5 flex items-center justify-center">🎮</div>;
      case 'video':
        return <div className="h-5 w-5 flex items-center justify-center">🎬</div>;
      case 'reading':
        return <BookOpen className="h-5 w-5" />;
      case 'worksheet':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Home Learning Resources</h1>
          <p className="text-muted-foreground mt-1">
            Support your child's learning at home with these resources
          </p>
        </div>
      </div>
      
      {selectedResource ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setSelectedResource(null)}>
              Back to Resources
            </Button>
            
            <div className="flex gap-2">
              <Badge className={getDifficultyColor(selectedResource.difficulty)}>
                {selectedResource.difficulty.charAt(0).toUpperCase() + selectedResource.difficulty.slice(1)}
              </Badge>
              <Badge variant="outline">{getSubjectDisplayName(selectedResource.subject)}</Badge>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{selectedResource.title}</CardTitle>
              <CardDescription>
                {selectedResource.type.charAt(0).toUpperCase() + selectedResource.type.slice(1)} • {formatDuration(selectedResource.estimatedDuration)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                  {selectedResource.thumbnailUrl ? (
                    <img 
                      src={selectedResource.thumbnailUrl} 
                      alt={selectedResource.title} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-muted-foreground">Resource Preview</div>
                  )}
                </div>
                
                <div className="prose max-w-none">
                  <h3>Description</h3>
                  <p>{selectedResource.description}</p>
                  
                  <h3>Parent Guidance</h3>
                  <p>{selectedResource.parentGuidance}</p>
                  
                  <h3>Learning Style</h3>
                  <p>This resource is particularly suitable for {selectedResource.learningStyle.toLowerCase().replace(/_/g, '/')} learners.</p>
                  
                  <h3>Tags</h3>
                  <div className="flex flex-wrap gap-2 not-prose">
                    {selectedResource.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resource
                  </Button>
                  
                  <Button>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Resource
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Supporting Your Child</CardTitle>
              <CardDescription>
                Tips for helping your child with this resource
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    {learningStylesGuidance[selectedResource.learningStyle as keyof typeof learningStylesGuidance].title}
                  </h4>
                  <p className="text-sm mb-4">
                    {learningStylesGuidance[selectedResource.learningStyle as keyof typeof learningStylesGuidance].description}
                  </p>
                  
                  <h5 className="text-sm font-medium mb-2">How to support at home:</h5>
                  <ul className="text-sm space-y-2">
                    {learningStylesGuidance[selectedResource.learningStyle as keyof typeof learningStylesGuidance].tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Related Skills</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Problem Solving</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="bg-blue-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Critical Thinking</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} className="bg-blue-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Creativity</span>
                        <span>80%</span>
                      </div>
                      <Progress value={80} className="bg-blue-500" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    These skills are developed through this resource and align with your child's learning goals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="recommended">
                <Heart className="h-4 w-4 mr-2" />
                Recommended
              </TabsTrigger>
              <TabsTrigger value="subjects">
                <BookOpen className="h-4 w-4 mr-2" />
                By Subject
              </TabsTrigger>
              <TabsTrigger value="learning-styles">
                <User className="h-4 w-4 mr-2" />
                Learning Styles
              </TabsTrigger>
            </TabsList>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Subject:</span>
                <select 
                  className="border rounded-md p-1 text-sm"
                  value={selectedSubject || ''}
                  onChange={(e) => setSelectedSubject(e.target.value || null)}
                >
                  <option value="">All Subjects</option>
                  <option value="ENGLISH">English</option>
                  <option value="MATHEMATICS">Mathematics</option>
                  <option value="SCIENCE">Science</option>
                  <option value="GEOGRAPHY">Geography</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Difficulty:</span>
                <select 
                  className="border rounded-md p-1 text-sm"
                  value={selectedDifficulty || ''}
                  onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                >
                  <option value="">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="challenging">Challenging</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Type:</span>
                <select 
                  className="border rounded-md p-1 text-sm"
                  value={selectedType || ''}
                  onChange={(e) => setSelectedType(e.target.value || null)}
                >
                  <option value="">All Types</option>
                  <option value="activity">Activity</option>
                  <option value="game">Game</option>
                  <option value="video">Video</option>
                  <option value="reading">Reading</option>
                  <option value="worksheet">Worksheet</option>
                </select>
              </div>
              
              {(selectedSubject || selectedDifficulty || selectedType) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedSubject(null);
                    setSelectedDifficulty(null);
                    setSelectedType(null);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
            
            <TabsContent value="recommended" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <Card 
                    key={resource.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <div className="aspect-video bg-slate-100 rounded-t-lg overflow-hidden">
                      {resource.thumbnailUrl ? (
                        <img 
                          src={resource.thumbnailUrl} 
                          alt={resource.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Preview
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <Badge className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>
                        {getSubjectDisplayName(resource.subject)} • {formatDuration(resource.estimatedDuration)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-2 mb-4">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1.5 rounded-full">
                            {getTypeIcon(resource.type)}
                          </div>
                          <span className="text-sm font-medium">
                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          </span>
                        </div>
                        <Badge variant="outline">
                          {resource.learningStyle.replace(/_/g, '/')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="subjects" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <div className="text-blue-600">🔤</div>
                      </div>
                      English
                    </CardTitle>
                    <CardDescription>
                      Reading, writing, spelling, and grammar resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredResources
                        .filter(r => r.subject === 'ENGLISH')
                        .slice(0, 3)
                        .map((resource) => (
                          <div 
                            key={resource.id} 
                            className="flex items-start gap-3 p-2 border rounded-lg cursor-pointer hover:bg-slate-50"
                            onClick={() => setSelectedResource(resource)}
                          >
                            <div className="bg-blue-100 p-1.5 rounded-full">
                              {getTypeIcon(resource.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{resource.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {formatDuration(resource.estimatedDuration)} • {resource.learningStyle.replace(/_/g, '/')}
                              </p>
                            </div>
                            <Badge className={getDifficultyColor(resource.difficulty)}>
                              {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                            </Badge>
                          </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" onClick={() => {
                      setSelectedSubject('ENGLISH');
                      setActiveTab('recommended');
                    }}>
                      View All English Resources
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-full">
                        <div className="text-green-600">🔢</div>
                      </div>
                      Mathematics
                    </CardTitle>
                    <CardDescription>
                      Number, calculation, geometry, and problem-solving resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredResources
                        .filter(r => r.subject === 'MATHEMATICS')
                        .slice(0, 3)
                        .map((resource) => (
                          <div 
                            key={resource.id} 
                            className="flex items-start gap-3 p-2 border rounded-lg cursor-pointer hover:bg-slate-50"
                            onClick={() => setSelectedResource(resource)}
                          >
                            <div className="bg-green-100 p-1.5 rounded-full">
                              {getTypeIcon(resource.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{resource.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {formatDuration(resource.estimatedDuration)} • {resource.learningStyle.replace(/_/g, '/')}
                              </p>
                            </div>
                            <Badge className={getDifficultyColor(resource.difficulty)}>
                              {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                            </Badge>
                          </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" onClick={() => {
                      setSelectedSubject('MATHEMATICS');
                      setActiveTab('recommended');
                    }}>
                      View All Mathematics Resources
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <div className="text-purple-600">🧪</div>
                      </div>
                      Science
                    </CardTitle>
                    <CardDescription>
                      Biology, chemistry, physics, and scientific investigation resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredResources
                        .filter(r => r.subject === 'SCIENCE')
                        .slice(0, 3)
                        .map((resource) => (
                          <div 
                            key={resource.id} 
                            className="flex items-start gap-3 p-2 border rounded-lg cursor-pointer hover:bg-slate-50"
                            onClick={() => setSelectedResource(resource)}
                          >
                            <div className="bg-purple-100 p-1.5 rounded-full">
                              {getTypeIcon(resource.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{resource.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {formatDuration(resource.estimatedDuration)} • {resource.learningStyle.replace(/_/g, '/')}
                              </p>
                            </div>
                            <Badge className={getDifficultyColor(resource.difficulty)}>
                              {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                            </Badge>
                          </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" onClick={() => {
                      setSelectedSubject('SCIENCE');
                      setActiveTab('recommended');
                    }}>
                      View All Science Resources
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <div className="text-amber-600">🌍</div>
                      </div>
                      Geography
                    </CardTitle>
                    <CardDescription>
                      Maps, locations, environments, and geographical skills resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredResources
                        .filter(r => r.subject === 'GEOGRAPHY')
                        .slice(0, 3)
                        .map((resource) => (
                          <div 
                            key={resource.id} 
                            className="flex items-start gap-3 p-2 border rounded-lg cursor-pointer hover:bg-slate-50"
                            onClick={() => setSelectedResource(resource)}
                          >
                            <div className="bg-amber-100 p-1.5 rounded-full">
                              {getTypeIcon(resource.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{resource.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {formatDuration(resource.estimatedDuration)} • {resource.learningStyle.replace(/_/g, '/')}
                              </p>
                            </div>
                            <Badge className={getDifficultyColor(resource.difficulty)}>
                              {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                            </Badge>
                          </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" onClick={() => {
                      setSelectedSubject('GEOGRAPHY');
                      setActiveTab('recommended');
                    }}>
                      View All Geography Resources
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="learning-styles" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(learningStylesGuidance).map(([style, guidance]) => (
                  <Card key={style}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className={`bg-${style === 'VISUAL' ? 'blue' : style === 'AUDITORY' ? 'green' : style === 'KINESTHETIC' ? 'purple' : 'amber'}-100 p-2 rounded-full`}>
                          <User className={`h-5 w-5 text-${style === 'VISUAL' ? 'blue' : style === 'AUDITORY' ? 'green' : style === 'KINESTHETIC' ? 'purple' : 'amber'}-600`} />
                        </div>
                        {guidance.title}
                      </CardTitle>
                      <CardDescription>
                        {guidance.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">How to support at home:</h4>
                          <ul className="space-y-2">
                            {guidance.tips.map((tip, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className={`text-${style === 'VISUAL' ? 'blue' : style === 'AUDITORY' ? 'green' : style === 'KINESTHETIC' ? 'purple' : 'amber'}-500`}>•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Recommended Resources:</h4>
                          <div className="space-y-2">
                            {filteredResources
                              .filter(r => r.learningStyle === style)
                              .slice(0, 2)
                              .map((resource) => (
                                <div 
                                  key={resource.id} 
                                  className="flex items-start gap-3 p-2 border rounded-lg cursor-pointer hover:bg-slate-50"
                                  onClick={() => setSelectedResource(resource)}
                                >
                                  <div className={`bg-${style === 'VISUAL' ? 'blue' : style === 'AUDITORY' ? 'green' : style === 'KINESTHETIC' ? 'purple' : 'amber'}-100 p-1.5 rounded-full`}>
                                    {getTypeIcon(resource.type)}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium">{resource.title}</h4>
                                    <p className="text-xs text-muted-foreground">
                                      {getSubjectDisplayName(resource.subject)} • {formatDuration(resource.estimatedDuration)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                          <Button variant="outline" className="w-full mt-2" onClick={() => {
                            // Filter by this learning style
                            setActiveTab('recommended');
                          }}>
                            View All {guidance.title} Resources
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
