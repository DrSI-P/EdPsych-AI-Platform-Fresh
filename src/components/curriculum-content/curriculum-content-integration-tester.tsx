import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, BookOpen, Check, ChevronRight, FileText, Info, Loader2, RefreshCw } from 'lucide-react';

import { 
  CurriculumContent, 
  ContentMetadata,
  ContentDifficultyLevel,
  ContentType,
  ContentFormat
} from '@/lib/curriculum-content/types';
import { 
  LearningStyle, 
  UKKeyStage, 
  UKSubject, 
  LearningPathItem,
  LearningProfile,
  ProficiencyLevel
} from '@/lib/learning-path/types';
import { 
  findMatchingCurriculumContent,
  generateLearningPathItemsFromContent,
  getRecommendedNextContent,
  identifyLearningGaps
} from '@/lib/learning-path/curriculum-content-integration';

/**
 * Component for testing curriculum content integration with learning paths
 */
export function CurriculumContentIntegrationTester() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('find-content');
  const [matchingContent, setMatchingContent] = useState<CurriculumContent[]>([]);
  const [learningPathItems, setLearningPathItems] = useState<LearningPathItem[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<CurriculumContent[]>([]);
  const [gapContent, setGapContent] = useState<CurriculumContent[]>([]);
  
  // Mock learning profile for testing
  const [learningProfile, setLearningProfile] = useState<LearningProfile>({
    id: 'test-profile',
    userId: 'test-user',
    keyStage: UKKeyStage.KS2,
    currentSubject: UKSubject.MATHEMATICS,
    learningStyle: LearningStyle.VISUAL,
    interests: ['space', 'animals', 'sports'],
    proficiencyLevels: {
      [UKSubject.MATHEMATICS]: ProficiencyLevel.DEVELOPING,
      [UKSubject.ENGLISH]: ProficiencyLevel.PROFICIENT,
      [UKSubject.SCIENCE]: ProficiencyLevel.BEGINNER
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  // Mock completed content IDs for testing
  const [completedContentIds, setCompletedContentIds] = useState<string[]>([
    'math-ks2-place-value-001',
    'math-ks2-addition-001'
  ]);
  
  // Handle learning profile change
  const handleProfileChange = (field: keyof LearningProfile, value: any) => {
    setLearningProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Find matching content
  const handleFindContent = async () => {
    try {
      setLoading(true);
      
      const content = await findMatchingCurriculumContent(
        learningProfile.keyStage,
        learningProfile.currentSubject,
        [],
        learningProfile.proficiencyLevels[learningProfile.currentSubject] || ProficiencyLevel.DEVELOPING,
        learningProfile.learningStyle,
        learningProfile.interests
      );
      
      setMatchingContent(content);
      
      toast({
        title: 'Content Found',
        description: `Found ${content.length} matching curriculum content items.`
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error finding content:', error);
      toast({
        title: 'Error',
        description: 'Failed to find matching curriculum content.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };
  
  // Generate learning path items
  const handleGeneratePath = () => {
    if (matchingContent.length === 0) {
      toast({
        title: 'No Content',
        description: 'Please find matching content first.',
        variant: 'destructive'
      });
      return;
    }
    
    const pathItems = generateLearningPathItemsFromContent(
      matchingContent,
      learningProfile
    );
    
    setLearningPathItems(pathItems);
    
    toast({
      title: 'Path Generated',
      description: `Generated ${pathItems.length} learning path items.`
    });
  };
  
  // Get recommended content
  const handleGetRecommendations = async () => {
    try {
      setLoading(true);
      
      const content = await getRecommendedNextContent(
        learningProfile,
        completedContentIds
      );
      
      setRecommendedContent(content);
      
      toast({
        title: 'Recommendations Found',
        description: `Found ${content.length} recommended content items.`
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to get recommended content.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };
  
  // Identify learning gaps
  const handleIdentifyGaps = async () => {
    try {
      setLoading(true);
      
      const content = await identifyLearningGaps(
        learningProfile,
        completedContentIds
      );
      
      setGapContent(content);
      
      toast({
        title: 'Gaps Identified',
        description: `Found ${content.length} content items to address learning gaps.`
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error identifying gaps:', error);
      toast({
        title: 'Error',
        description: 'Failed to identify learning gaps.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };
  
  // Render content card
  const renderContentCard = (content: CurriculumContent) => {
    return (
      <Card key={content.metadata.id} className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{content.metadata.title}</CardTitle>
              <CardDescription>{content.metadata.description}</CardDescription>
            </div>
            <Badge>{content.metadata.difficultyLevel}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{content.metadata.keyStage}</Badge>
            <Badge variant="outline">{content.metadata.subject}</Badge>
            <Badge variant="outline">{content.metadata.contentType}</Badge>
            {content.metadata.topics?.map((topic, index) => (
              <Badge key={index} variant="secondary">{topic}</Badge>
            ))}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Learning Objectives:</p>
            <ul className="list-disc pl-5 text-sm">
              {content.metadata.learningObjectives?.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Duration: {content.metadata.estimatedDuration} minutes
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Render learning path item card
  const renderPathItemCard = (item: LearningPathItem) => {
    return (
      <Card key={item.id} className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </div>
            <Badge>{item.difficultyLevel}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{item.keyStage}</Badge>
            <Badge variant="outline">{item.subject}</Badge>
            <Badge variant="outline">{item.contentType}</Badge>
            {item.topics?.map((topic, index) => (
              <Badge key={index} variant="secondary">{topic}</Badge>
            ))}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Learning Style: {item.learningStyle}</p>
            <p className="text-sm">Content ID: {item.contentId}</p>
            {item.variantId && <p className="text-sm">Variant ID: {item.variantId}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Duration: {item.estimatedDuration} minutes
          </div>
          <Button variant="outline" size="sm">
            Start Learning
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Curriculum Content Integration Tester
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Learning Profile</CardTitle>
            <CardDescription>
              Configure the test learning profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Key Stage</label>
              <Select 
                value={learningProfile.keyStage} 
                onValueChange={(value) => handleProfileChange('keyStage', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select key stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UKKeyStage.EYFS}>Early Years (EYFS)</SelectItem>
                  <SelectItem value={UKKeyStage.KS1}>Key Stage 1</SelectItem>
                  <SelectItem value={UKKeyStage.KS2}>Key Stage 2</SelectItem>
                  <SelectItem value={UKKeyStage.KS3}>Key Stage 3</SelectItem>
                  <SelectItem value={UKKeyStage.KS4}>Key Stage 4</SelectItem>
                  <SelectItem value={UKKeyStage.KS5}>Key Stage 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select 
                value={learningProfile.currentSubject} 
                onValueChange={(value) => handleProfileChange('currentSubject', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UKSubject.ENGLISH}>English</SelectItem>
                  <SelectItem value={UKSubject.MATHEMATICS}>Mathematics</SelectItem>
                  <SelectItem value={UKSubject.SCIENCE}>Science</SelectItem>
                  <SelectItem value={UKSubject.HISTORY}>History</SelectItem>
                  <SelectItem value={UKSubject.GEOGRAPHY}>Geography</SelectItem>
                  <SelectItem value={UKSubject.ART_AND_DESIGN}>Art and Design</SelectItem>
                  <SelectItem value={UKSubject.COMPUTING}>Computing</SelectItem>
                  <SelectItem value={UKSubject.DESIGN_AND_TECHNOLOGY}>Design and Technology</SelectItem>
                  <SelectItem value={UKSubject.LANGUAGES}>Languages</SelectItem>
                  <SelectItem value={UKSubject.MUSIC}>Music</SelectItem>
                  <SelectItem value={UKSubject.PHYSICAL_EDUCATION}>Physical Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Learning Style</label>
              <Select 
                value={learningProfile.learningStyle} 
                onValueChange={(value) => handleProfileChange('learningStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select learning style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LearningStyle.VISUAL}>Visual</SelectItem>
                  <SelectItem value={LearningStyle.AUDITORY}>Auditory</SelectItem>
                  <SelectItem value={LearningStyle.KINESTHETIC}>Kinesthetic</SelectItem>
                  <SelectItem value={LearningStyle.READ_WRITE}>Read/Write</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Proficiency Level</label>
              <Select 
                value={learningProfile.proficiencyLevels[learningProfile.currentSubject]?.toString() || ProficiencyLevel.DEVELOPING.toString()} 
                onValueChange={(value) => {
                  const proficiencyLevels = { ...learningProfile.proficiencyLevels };
                  proficiencyLevels[learningProfile.currentSubject] = parseInt(value) as ProficiencyLevel;
                  handleProfileChange('proficiencyLevels', proficiencyLevels);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProficiencyLevel.BEGINNER.toString()}>Beginner</SelectItem>
                  <SelectItem value={ProficiencyLevel.DEVELOPING.toString()}>Developing</SelectItem>
                  <SelectItem value={ProficiencyLevel.PROFICIENT.toString()}>Proficient</SelectItem>
                  <SelectItem value={ProficiencyLevel.ADVANCED.toString()}>Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
            <CardDescription>
              Student interests for content filtering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {learningProfile.interests.map((interest, index) => (
                <Badge key={index}>{interest}</Badge>
              ))}
            </div>
            
            <p className="text-sm text-gray-500">
              These interests will be used to filter and prioritize content.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Completed Content</CardTitle>
            <CardDescription>
              Content already completed by the student
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {completedContentIds.map((id, index) => (
                <li key={index} className="text-sm flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  {id}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="find-content">Find Content</TabsTrigger>
          <TabsTrigger value="learning-path">Learning Path</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="learning-gaps">Learning Gaps</TabsTrigger>
        </TabsList>
        
        <TabsContent value="find-content">
          <Card>
            <CardHeader>
              <CardTitle>Find Matching Curriculum Content</CardTitle>
              <CardDescription>
                Find content matching the learning profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleFindContent} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Content...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Find Matching Content
                  </>
                )}
              </Button>
              
              <Separator className="my-6" />
              
              {matchingContent.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Matching Content ({matchingContent.length})</h3>
                  {matchingContent.map(content => renderContentCard(content))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No matching content found. Try adjusting the learning profile or click "Find Matching Content".</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="learning-path">
          <Card>
            <CardHeader>
              <CardTitle>Generate Learning Path</CardTitle>
              <CardDescription>
                Convert curriculum content to learning path items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <Button onClick={handleFindContent} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Content...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Find Content
                    </>
                  )}
                </Button>
                
                <Button onClick={handleGeneratePath} disabled={matchingContent.length === 0 || loading}>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Generate Path
                </Button>
              </div>
              
              {matchingContent.length === 0 && (
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertTitle>No Content</AlertTitle>
                  <AlertDescription>
                    Please find matching content first before generating a learning path.
                  </AlertDescription>
                </Alert>
              )}
              
              <Separator className="my-6" />
              
              {learningPathItems.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Learning Path Items ({learningPathItems.length})</h3>
                  {learningPathItems.map(item => renderPathItemCard(item))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No learning path items generated yet. Click "Generate Path" after finding content.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Content Recommendations</CardTitle>
              <CardDescription>
                Get recommended content based on learning profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGetRecommendations} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Recommendations...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </>
                )}
              </Button>
              
              <Separator className="my-6" />
              
              {recommendedContent.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recommended Content ({recommendedContent.length})</h3>
                  {recommendedContent.map(content => renderContentCard(content))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No recommendations found. Click "Get Recommendations" to find content.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="learning-gaps">
          <Card>
            <CardHeader>
              <CardTitle>Learning Gaps</CardTitle>
              <CardDescription>
                Identify learning gaps based on curriculum coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleIdentifyGaps} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Identifying Gaps...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Identify Gaps
                  </>
                )}
              </Button>
              
              <Separator className="my-6" />
              
              {gapContent.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Content for Learning Gaps ({gapContent.length})</h3>
                  {gapContent.map(content => renderContentCard(content))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No learning gaps identified. Click "Identify Gaps" to analyze curriculum coverage.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
