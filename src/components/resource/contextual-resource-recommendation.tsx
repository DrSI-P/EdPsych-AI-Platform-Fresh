/**
 * Manual fix for contextual-resource-recommendation.tsx
 * This file contains targeted fixes for TypeScript errors
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/loading";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Link, 
  FileSpreadsheet, 
  Star, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  X, 
  Info, 
  BookmarkPlus,
  ExternalLink,
  Download,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useAIService } from '@/lib/ai/ai-service';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'audio' | 'link' | 'worksheet';
  url?: string;
  file?: string;
  tags: string[];
  ageRange: string;
  subject: string;
  curriculum: string;
  relevanceScore?: number;
  relevanceReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContextualResourceRecommendationProps {
  contextSource?: 'lesson-plan' | 'meeting-notes' | 'student-profile' | 'manual';
  contextId?: string;
  contextContent?: string;
  onResourceSelect?: (resource: Resource) => void;
  className?: string;
}

export function ContextualResourceRecommendation({
  contextSource = 'manual',
  contextId,
  contextContent = '',
  onResourceSelect,
  className = ''
}: ContextualResourceRecommendationProps) {
  const { toast } = useToast();
  const aiService = useAIService();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendedResources, setRecommendedResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState('recommended');
  const [manualQuery, setManualQuery] = useState('');
  const [showExplanations, setShowExplanations] = useState(true);
  const [filterType, setFilterType] = useState<string | null>(null);
  
  // Resource type icons mapping
  const resourceTypeIcons: Record<string, React.ReactNode> = {
    document: <FileText className="h-5 w-5" />,
    video: <Video className="h-5 w-5" />,
    audio: <BookOpen className="h-5 w-5" />,
    link: <Link className="h-5 w-5" />,
    worksheet: <FileSpreadsheet className="h-5 w-5" />
  };

  // Get recommendations based on context
  useEffect(() => {
    if ((contextSource !== 'manual' && (contextId || contextContent)) || 
        (contextSource === 'manual' && manualQuery && manualQuery.trim().length > 0)) {
      getRecommendations();
    }
  }, [contextSource, contextId, contextContent]);

  const getRecommendations = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate the API call and response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock recommendations based on context
      let mockRecommendations: Resource[] = [];
      
      if (contextSource === 'lesson-plan') {
        mockRecommendations = generateLessonPlanRecommendations();
      } else if (contextSource === 'meeting-notes') {
        mockRecommendations = generateMeetingNotesRecommendations();
      } else if (contextSource === 'student-profile') {
        mockRecommendations = generateStudentProfileRecommendations();
      } else if (contextSource === 'manual' && manualQuery) {
        mockRecommendations = generateManualQueryRecommendations();
      }
      
      setRecommendedResources(mockRecommendations);
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError('Failed to retrieve resource recommendations');
      toast({
        title: "Error",
        description: "Failed to retrieve resource recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate mock recommendations for lesson plans
  const generateLessonPlanRecommendations = (): Resource[] => {
    // Extract context from contextContent or use default
    const context = contextContent || 'Mathematics lesson on fractions for Year 5 students';
    
    // For demo purposes, we'll return mock data
    return [
      {
        id: 'rec-1',
        title: 'Fractions Visual Models Collection',
        description: 'A comprehensive set of visual models for teaching fractions, including fraction bars, number lines, and area models.',
        type: 'document',
        file: '/resources/fractions_visual_models.pdf',
        tags: ['mathematics', 'fractions', 'visual models', 'primary'],
        ageRange: 'primary',
        subject: 'mathematics',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.95,
        relevanceReason: 'Directly supports visual learning of fractions for Year 5 students',
        createdAt: '2025-01-15T12:00:00Z',
        updatedAt: '2025-01-15T12:00:00Z'
      },
      {
        id: 'rec-2',
        title: 'Equivalent Fractions Interactive Game',
        description: 'An engaging digital game that helps students practise identifying equivalent fractions through visual comparisons.',
        type: 'link',
        url: 'https://example.com/games/equivalent-fractions',
        tags: ['mathematics', 'fractions', 'interactive', 'game', 'primary'],
        ageRange: 'primary',
        subject: 'mathematics',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.89,
        relevanceReason: 'Interactive tool for practicing equivalent fractions concepts',
        createdAt: '2025-02-10T14:30:00Z',
        updatedAt: '2025-02-10T14:30:00Z'
      },
      {
        id: 'rec-3',
        title: 'Fractions Assessment Worksheet',
        description: 'A printable worksheet with a variety of fraction problems to assess student understanding.',
        type: 'worksheet',
        file: '/resources/fractions_assessment.pdf',
        tags: ['mathematics', 'fractions', 'assessment', 'primary'],
        ageRange: 'primary',
        subject: 'mathematics',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.82,
        relevanceReason: 'Provides assessment materials aligned with Year 5 fraction objectives',
        createdAt: '2025-03-05T09:15:00Z',
        updatedAt: '2025-03-05T09:15:00Z'
      },
      {
        id: 'rec-4',
        title: 'Fractions in Real Life Video Series',
        description: 'Short videos showing how fractions are used in everyday situations, from cooking to construction.',
        type: 'video',
        url: 'https://example.com/videos/fractions-real-life',
        tags: ['mathematics', 'fractions', 'real-world applications', 'primary'],
        ageRange: 'primary',
        subject: 'mathematics',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.78,
        relevanceReason: 'Connects fraction concepts to real-world applications',
        createdAt: '2025-01-20T10:45:00Z',
        updatedAt: '2025-01-20T10:45:00Z'
      }
    ];
  };
  
  // Generate mock recommendations for meeting notes
  const generateMeetingNotesRecommendations = (): Resource[] => {
    // Extract context from contextContent or use default
    const context = contextContent || 'EHCNA meeting discussing communication difficulties and social interaction challenges';
    
    // For demo purposes, we'll return mock data
    return [
      {
        id: 'rec-5',
        title: 'Communication Strategies for SEND Students',
        description: 'A comprehensive guide to supporting students with communication difficulties in the classroom.',
        type: 'document',
        file: '/resources/communication_strategies_send.pdf',
        tags: ['SEND', 'communication', 'strategies', 'inclusion'],
        ageRange: 'all',
        subject: 'special educational needs',
        curriculum: 'UK SEND Code of Practise',
        relevanceScore: 0.94,
        relevanceReason: 'Directly addresses communication difficulties mentioned in EHCNA meeting',
        createdAt: '2025-01-15T12:00:00Z',
        updatedAt: '2025-01-15T12:00:00Z'
      },
      {
        id: 'rec-6',
        title: 'Social Skills Development Activities',
        description: 'A collection of structured activities to support social interaction skills development.',
        type: 'document',
        file: '/resources/social_skills_activities.pdf',
        tags: ['social skills', 'SEMH', 'activities', 'inclusion'],
        ageRange: 'all',
        subject: 'special educational needs',
        curriculum: 'UK SEND Code of Practise',
        relevanceScore: 0.91,
        relevanceReason: 'Provides practical activities to address social interaction challenges',
        createdAt: '2025-02-10T14:30:00Z',
        updatedAt: '2025-02-10T14:30:00Z'
      },
      {
        id: 'rec-7',
        title: 'Visual Support Systems for Classrooms',
        description: 'Guide to implementing visual supports to enhance communication and understanding.',
        type: 'document',
        file: '/resources/visual_support_systems.pdf',
        tags: ['visual supports', 'communication', 'SEND', 'classroom strategies'],
        ageRange: 'all',
        subject: 'special educational needs',
        curriculum: 'UK SEND Code of Practise',
        relevanceScore: 0.85,
        relevanceReason: 'Visual supports can help address communication difficulties',
        createdAt: '2025-03-05T09:15:00Z',
        updatedAt: '2025-03-05T09:15:00Z'
      }
    ];
  };
  
  // Generate mock recommendations for student profiles
  const generateStudentProfileRecommendations = (): Resource[] => {
    // Extract context from contextContent or use default
    const context = contextContent || 'Year 8 student with dyslexia who enjoys science and has strengths in verbal reasoning';
    
    // For demo purposes, we'll return mock data
    return [
      {
        id: 'rec-8',
        title: 'Science Texts with Dyslexia-Friendly Formatting',
        description: 'Science reading materials specifically formatted for students with dyslexia, featuring appropriate fonts, spacing, and layout.',
        type: 'document',
        file: '/resources/dyslexia_friendly_science.pdf',
        tags: ['science', 'dyslexia', 'accessible', 'secondary'],
        ageRange: 'secondary',
        subject: 'science',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.97,
        relevanceReason: 'Specifically designed for Year 8 students with dyslexia who enjoy science',
        createdAt: '2025-01-15T12:00:00Z',
        updatedAt: '2025-01-15T12:00:00Z'
      },
      {
        id: 'rec-9',
        title: 'Audio Science Experiments Guide',
        description: 'Audio narration of science experiments suitable for KS3, allowing students to listen while conducting experiments.',
        type: 'audio',
        file: '/resources/audio_science_experiments.mp3',
        tags: ['science', 'experiments', 'audio', 'secondary'],
        ageRange: 'secondary',
        subject: 'science',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.89,
        relevanceReason: 'Leverages verbal reasoning strengths while supporting dyslexia',
        createdAt: '2025-02-10T14:30:00Z',
        updatedAt: '2025-02-10T14:30:00Z'
      },
      {
        id: 'rec-10',
        title: 'Verbal Reasoning Science Quiz Game',
        description: 'Interactive quiz game that tests science knowledge through verbal reasoning challenges.',
        type: 'link',
        url: 'https://example.com/games/verbal-science-quiz',
        tags: ['science', 'verbal reasoning', 'quiz', 'secondary'],
        ageRange: 'secondary',
        subject: 'science',
        curriculum: 'UK National Curriculum',
        relevanceScore: 0.86,
        relevanceReason: 'Builds on verbal reasoning strengths while reinforcing science concepts',
        createdAt: '2025-03-05T09:15:00Z',
        updatedAt: '2025-03-05T09:15:00Z'
      }
    ];
  };
  
  // Generate mock recommendations for manual queries
  const generateManualQueryRecommendations = (): Resource[] => {
    // For demo purposes, we'll return mock data based on the query
    const query = manualQuery.toLowerCase();
    
    if (query.includes('math') || query.includes('maths')) {
      return [
        {
          id: 'rec-11',
          title: 'Mathematics Curriculum Guide',
          description: 'Comprehensive guide to the UK mathematics curriculum with teaching strategies and resources.',
          type: 'document',
          file: '/resources/mathematics_curriculum_guide.pdf',
          tags: ['mathematics', 'curriculum', 'teaching guide'],
          ageRange: 'all',
          subject: 'mathematics',
          curriculum: 'UK National Curriculum',
          relevanceScore: 0.88,
          relevanceReason: 'Matches mathematics query with comprehensive curriculum coverage',
          createdAt: '2025-01-15T12:00:00Z',
          updatedAt: '2025-01-15T12:00:00Z'
        },
        {
          id: 'rec-12',
          title: 'Mathematics Manipulatives Guide',
          description: 'Guide to using physical and digital manipulatives in mathematics instruction.',
          type: 'document',
          file: '/resources/mathematics_manipulatives.pdf',
          tags: ['mathematics', 'manipulatives', 'hands-on learning'],
          ageRange: 'all',
          subject: 'mathematics',
          curriculum: 'UK National Curriculum',
          relevanceScore: 0.82,
          relevanceReason: 'Provides practical mathematics teaching tools and strategies',
          createdAt: '2025-02-10T14:30:00Z',
          updatedAt: '2025-02-10T14:30:00Z'
        }
      ];
    } else if (query.includes('literacy') || query.includes('reading') || query.includes('writing')) {
      return [
        {
          id: 'rec-13',
          title: 'Literacy Development Framework',
          description: 'Structured framework for developing literacy skills across age groups and abilities.',
          type: 'document',
          file: '/resources/literacy_framework.pdf',
          tags: ['literacy', 'reading', 'writing', 'framework'],
          ageRange: 'all',
          subject: 'english',
          curriculum: 'UK National Curriculum',
          relevanceScore: 0.90,
          relevanceReason: 'Comprehensive literacy resource matching query terms',
          createdAt: '2025-01-15T12:00:00Z',
          updatedAt: '2025-01-15T12:00:00Z'
        },
        {
          id: 'rec-14',
          title: 'Reading Comprehension Strategies',
          description: 'Collection of evidence-based strategies to improve reading comprehension.',
          type: 'document',
          file: '/resources/reading_comprehension.pdf',
          tags: ['reading', 'comprehension', 'strategies'],
          ageRange: 'all',
          subject: 'english',
          curriculum: 'UK National Curriculum',
          relevanceScore: 0.85,
          relevanceReason: 'Directly addresses reading skills mentioned in query',
          createdAt: '2025-02-10T14:30:00Z',
          updatedAt: '2025-02-10T14:30:00Z'
        }
      ];
    } else {
      return [
        {
          id: 'rec-15',
          title: 'General Teaching Strategies',
          description: 'Collection of versatile teaching strategies applicable across subjects and age groups.',
          type: 'document',
          file: '/resources/general_teaching_strategies.pdf',
          tags: ['teaching', 'strategies', 'pedagogy'],
          ageRange: 'all',
          subject: 'cross-curricular',
          curriculum: 'UK National Curriculum',
          relevanceScore: 0.75,
          relevanceReason: 'General teaching resource that may be relevant to query',
          createdAt: '2025-01-15T12:00:00Z',
          updatedAt: '2025-01-15T12:00:00Z'
        }
      ];
    }
  };

  // Handle resource selection
  const handleResourceSelect = (resource: Resource) => {
    if (onResourceSelect) {
      onResourceSelect(resource);
    }
  };

  // Render resource card
  const renderResourceCard = (resource: Resource) => {
    return (
      <Card key={resource.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {resourceTypeIcons[resource.type]}
              <CardTitle className="ml-2 text-lg">{resource.title}</CardTitle>
            </div>
            <Badge variant="outline">{resource.type}</Badge>
          </div>
          <CardDescription className="mt-2">{resource.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-1 mb-2">
            {resource.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
          
          {showExplanations && resource.relevanceReason && (
            <div className="bg-muted p-2 rounded-md text-sm mt-2 flex items-start">
              <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <p>{resource.relevanceReason}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleResourceSelect(resource)}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Open
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleResourceSelect(resource)}
            >
              <BookmarkPlus className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className={`contextual-resource-recommendation ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Educational Resources</CardTitle>
          <CardDescription>
            {contextSource === 'manual' 
              ? 'Search for educational resources' 
              : `Recommended resources based on ${contextSource}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contextSource === 'manual' && (
            <div className="mb-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search for resources..."
                  className="flex-1 p-2 border rounded-md"
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && getRecommendations()}
                />
                <Button onClick={getRecommendations}>
                  Search
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFilterType(null)}
                className={filterType === null ? 'bg-primary text-primary-foreground' : ''}
              >
                All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFilterType('document')}
                className={filterType === 'document' ? 'bg-primary text-primary-foreground' : ''}
              >
                <FileText className="h-4 w-4 mr-1" />
                Documents
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFilterType('video')}
                className={filterType === 'video' ? 'bg-primary text-primary-foreground' : ''}
              >
                <Video className="h-4 w-4 mr-1" />
                Videos
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowExplanations(!showExplanations)}
            >
              <Info className="h-4 w-4 mr-1" />
              {showExplanations ? 'Hide' : 'Show'} Explanations
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner />
              <span className="ml-2">Finding relevant resources...</span>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              <p>{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={getRecommendations}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Try Again
              </Button>
            </div>
          ) : recommendedResources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {contextSource === 'manual' 
                ? 'Enter a search query to find resources' 
                : 'No resources found for this context'}
            </div>
          ) : (
            <div>
              {recommendedResources
                .filter(resource => filterType === null || resource.type === filterType)
                .map(resource => renderResourceCard(resource))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
