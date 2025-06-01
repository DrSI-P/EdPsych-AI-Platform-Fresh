'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  MousePointer, 
  FileSpreadsheet, 
  Presentation,
  Eye,
  Download,
  Share2
} from 'lucide-react';

import { 
  ContentFormat, 
  ContentStatus,
  LearningStyle,
  CurriculumContent
} from '@/lib/curriculum-content/types';

/**
 * Curriculum Content Viewer Component
 * 
 * Displays curriculum content with learning style variants
 */
export function CurriculumContentViewer({ 
  content,
  onBack
}: { 
  content: CurriculumContent,
  onBack?: () => void
}) {
  const [activeTab, setActiveTab] = useState<string>('visual');
  
  // Get icon for content format
  const getFormatIcon = (format: ContentFormat) => {
    switch (format) {
      case ContentFormat.TEXT:
        return <FileText className="h-4 w-4" />;
      case ContentFormat.VIDEO:
        return <Video className="h-4 w-4" />;
      case ContentFormat.AUDIO:
        return <Headphones className="h-4 w-4" />;
      case ContentFormat.INTERACTIVE:
        return <MousePointer className="h-4 w-4" />;
      case ContentFormat.DOCUMENT:
        return <FileSpreadsheet className="h-4 w-4" />;
      case ContentFormat.PRESENTATION:
        return <Presentation className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };
  
  // Get color for content status
  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case ContentStatus.DRAFT:
        return 'bg-yellow-500';
      case ContentStatus.REVIEW:
        return 'bg-blue-500';
      case ContentStatus.APPROVED:
        return 'bg-green-500';
      case ContentStatus.PUBLISHED:
        return 'bg-purple-500';
      case ContentStatus.ARCHIVED:
        return 'bg-gray-500';
      case ContentStatus.REJECTED:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get variant by learning style
  const getVariant = (style: LearningStyle) => {
    return content.variants.find(v => v.learningStyle === style) || content.defaultVariant;
  };
  
  // Check if variant exists
  const hasVariant = (style: LearningStyle) => {
    return content.variants.some(v => v.learningStyle === style);
  };
  
  // Format content with basic markdown-like syntax
  const formatContent = (text: string) => {
    if (!text) return <p>No content available for this learning style.</p>;
    
    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n\n+/);
    
    return (
      <>
        {paragraphs.map((paragraph, i) => {
          // Check if it's a heading (starts with # or ##)
          if (paragraph.startsWith('# ')) {
            return <h2 key={i} className="text-2xl font-bold mt-4 mb-2">{paragraph.substring(2)}</h2>;
          } else if (paragraph.startsWith('## ')) {
            return <h3 key={i} className="text-xl font-bold mt-3 mb-2">{paragraph.substring(3)}</h3>;
          } else if (paragraph.startsWith('* ')) {
            // Simple bullet list
            const items = paragraph.split('\n* ');
            return (
              <ul key={i} className="list-disc pl-6 my-2">
                {items.map((item, j) => (
                  <li key={j}>{item.replace('* ', '')}</li>
                ))}
              </ul>
            );
          } else {
            // Regular paragraph
            return <p key={i} className="my-2">{paragraph}</p>;
          }
        })}
      </>
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{content.metadata.title}</h1>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(content.metadata.status)}`}></div>
          </div>
          <p className="text-muted-foreground">{content.metadata.description}</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Subject & Key Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{content.metadata.keyStage}</Badge>
              <Badge>{content.metadata.subject}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Content Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {getFormatIcon(content.metadata.contentFormat)}
                {content.metadata.contentFormat}
              </Badge>
              <Badge variant="outline">{content.metadata.contentType}</Badge>
              <Badge variant="outline">{content.metadata.difficultyLevel}</Badge>
              <Badge variant="outline">{content.metadata.estimatedDuration} mins</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-1">
              {content.metadata.learningObjectives?.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Topics & Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {content.metadata.topics?.map((topic, index) => (
                  <Badge key={index} variant="secondary">{topic}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {content.metadata.keywords?.map((keyword, index) => (
                  <Badge key={index}>{keyword}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Learning Style Content</CardTitle>
          <CardDescription>
            View content adapted for different learning styles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger 
                value="visual" 
                disabled={!hasVariant(LearningStyle.VISUAL)}
              >
                Visual
              </TabsTrigger>
              <TabsTrigger 
                value="auditory" 
                disabled={!hasVariant(LearningStyle.AUDITORY)}
              >
                Auditory
              </TabsTrigger>
              <TabsTrigger 
                value="kinesthetic" 
                disabled={!hasVariant(LearningStyle.KINESTHETIC)}
              >
                Kinesthetic
              </TabsTrigger>
              <TabsTrigger 
                value="read-write" 
                disabled={!hasVariant(LearningStyle.READ_WRITE)}
              >
                Read/Write
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual" className="space-y-4">
              <div className="prose max-w-none">
                {formatContent(getVariant(LearningStyle.VISUAL).content)}
              </div>
              
              {getVariant(LearningStyle.VISUAL).mediaUrls?.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Visual Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getVariant(LearningStyle.VISUAL).mediaUrls.map((url, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="h-40 bg-muted flex items-center justify-center">
                            <Eye className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <CardFooter className="p-2">
                            <Button variant="ghost" size="sm" className="w-full">
                              View Resource {index + 1}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="auditory" className="space-y-4">
              <div className="prose max-w-none">
                {formatContent(getVariant(LearningStyle.AUDITORY).content)}
              </div>
              
              {getVariant(LearningStyle.AUDITORY).mediaUrls?.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Auditory Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getVariant(LearningStyle.AUDITORY).mediaUrls.map((url, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="h-40 bg-muted flex items-center justify-center">
                            <Headphones className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <CardFooter className="p-2">
                            <Button variant="ghost" size="sm" className="w-full">
                              Listen to Resource {index + 1}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="kinesthetic" className="space-y-4">
              <div className="prose max-w-none">
                {formatContent(getVariant(LearningStyle.KINESTHETIC).content)}
              </div>
              
              {getVariant(LearningStyle.KINESTHETIC).mediaUrls?.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Activity Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getVariant(LearningStyle.KINESTHETIC).mediaUrls.map((url, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="h-40 bg-muted flex items-center justify-center">
                            <MousePointer className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <CardFooter className="p-2">
                            <Button variant="ghost" size="sm" className="w-full">
                              View Activity {index + 1}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="read-write" className="space-y-4">
              <div className="prose max-w-none">
                {formatContent(getVariant(LearningStyle.READ_WRITE).content)}
              </div>
              
              {getVariant(LearningStyle.READ_WRITE).mediaUrls?.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Reading Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getVariant(LearningStyle.READ_WRITE).mediaUrls.map((url, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="h-40 bg-muted flex items-center justify-center">
                            <FileText className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <CardFooter className="p-2">
                            <Button variant="ghost" size="sm" className="w-full">
                              Read Resource {index + 1}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
