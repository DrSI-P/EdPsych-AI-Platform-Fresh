'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Download, FileText, Book, Video, Image, File, ExternalLink } from 'lucide-react';

import { 
  ContentItem, 
  ContentType, 
  ContentFormat, 
  ReviewStatus, 
  DifficultyLevel,
  ContentVariant
} from '@/lib/content-management/types';
import { UKKeyStage, UKSubject } from '@/lib/assessment/types';
import { LearningStyle } from '@/lib/learning-path/types';
import { Badge } from '@/components/ui/badge';

interface ContentViewerProps {
  content: ContentItem;
  onBack?: () => void;
  onEdit?: (content: ContentItem) => void;
  className?: string;
}

export function ContentViewer({
  content,
  onBack,
  onEdit,
  className = ''
}: ContentViewerProps) {
  const { toast } = useToast();
  const [activeVariant, setActiveVariant] = useState<string>(
    content.content.find(v => v.isDefault)?.learningStyle || content.content[0]?.learningStyle
  );

  // Get icon for content type
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case ContentType.LESSON:
        return <Book className="h-5 w-5" />;
      case ContentType.VIDEO:
        return <Video className="h-5 w-5" />;
      case ContentType.READING:
        return <FileText className="h-5 w-5" />;
      case ContentType.INTERACTIVE:
        return <ExternalLink className="h-5 w-5" />;
      case ContentType.WORKSHEET:
        return <File className="h-5 w-5" />;
      case ContentType.PRESENTATION:
        return <Image className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  // Get color for review status
  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case ReviewStatus.DRAFT:
        return 'bg-gray-200 text-gray-800';
      case ReviewStatus.UNDER_REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      case ReviewStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case ReviewStatus.PUBLISHED:
        return 'bg-blue-100 text-blue-800';
      case ReviewStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800';
      case ReviewStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get learning style color
  const getLearningStyleColor = (style: LearningStyle) => {
    switch (style) {
      case LearningStyle.VISUAL:
        return 'bg-blue-50 border-blue-200';
      case LearningStyle.AUDITORY:
        return 'bg-green-50 border-green-200';
      case LearningStyle.KINESTHETIC:
        return 'bg-purple-50 border-purple-200';
      case LearningStyle.READING_WRITING:
        return 'bg-amber-50 border-amber-200';
      case LearningStyle.LOGICAL:
        return 'bg-cyan-50 border-cyan-200';
      case LearningStyle.SOCIAL:
        return 'bg-pink-50 border-pink-200';
      case LearningStyle.SOLITARY:
        return 'bg-indigo-50 border-indigo-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Render content metadata
  const renderMetadata = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getContentTypeIcon(content.type)}
          <h2 className="text-2xl font-bold">{content.title}</h2>
        </div>
        <Badge className={getStatusColor(content.reviewStatus)}>
          {content.reviewStatus.replace('_', ' ')}
        </Badge>
      </div>

      <p className="text-muted-foreground">{content.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <h3 className="text-sm font-medium">Subject</h3>
          <p>{content.subject}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Key Stage</h3>
          <p>{content.keyStage}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Year Groups</h3>
          <p>{content.yearGroup.join(', ')}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Difficulty</h3>
          <p>{content.difficulty}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Duration</h3>
          <p>{content.estimatedDuration} minutes</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Author</h3>
          <p>{content.author}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium">Tags</h3>
        <div className="flex flex-wrap gap-2 mt-1">
          {content.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium">Learning Objectives</h3>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          {content.learningObjectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>

      {content.curriculumStandards?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium">Curriculum Standards</h3>
          <div className="space-y-2 mt-1">
            {content.curriculumStandards.map((standard, index) => (
              <div key={index} className="border rounded p-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{standard.code}</Badge>
                  <span className="text-sm">{standard.description}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {standard.subject} | {standard.keyStage} | {standard.category}
                  {standard.subcategory && ` | ${standard.subcategory}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render content variant
  const renderContentVariant = (variant: ContentVariant) => (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg border ${getLearningStyleColor(variant.learningStyle)}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{variant.learningStyle} Learning Style</h3>
          {variant.isDefault && (
            <Badge variant="secondary">Default</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          This content is optimized for {variant.learningStyle.toLowerCase()} learners.
        </p>
        
        <div className="prose max-w-none">
          {variant.data.body.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {variant.data.mediaUrls && variant.data.mediaUrls.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Media Resources</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variant.data.mediaUrls.map((url, index) => {
                // Determine if it's an image, video, or other media
                const isImage = /\.(jpeg|jpg|gif|png|svg)$/i.test(url);
                const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
                
                return (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    {isImage ? (
                      <img src={url} alt={`Media ${index + 1}`} className="w-full h-48 object-cover" />
                    ) : isVideo ? (
                      <video controls className="w-full h-48">
                        <source src={url} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="flex items-center justify-center h-48 bg-gray-100">
                        <ExternalLink className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="p-2">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                        {url.split('/').pop()}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {variant.data.externalResources && variant.data.externalResources.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">External Resources</h4>
            <div className="space-y-2">
              {variant.data.externalResources.map((resource, index) => (
                <div key={index} className="border rounded p-3">
                  <h5 className="font-medium">{resource.title}</h5>
                  {resource.description && (
                    <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{resource.type}</Badge>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                      Visit Resource
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {variant.data.interactiveElements && variant.data.interactiveElements.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Interactive Elements</h4>
            <div className="space-y-4">
              {variant.data.interactiveElements.map((element, index) => (
                <div key={index} className="border rounded p-3">
                  <h5 className="font-medium">{element.title}</h5>
                  {element.description && (
                    <p className="text-sm text-muted-foreground mt-1">{element.description}</p>
                  )}
                  <Badge variant="outline" className="mt-2">{element.type}</Badge>
                  
                  {/* Placeholder for interactive element rendering */}
                  <div className="mt-4 p-4 bg-gray-50 rounded text-center">
                    <p className="text-sm text-muted-foreground">
                      Interactive {element.type} would be rendered here
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Content Viewer</CardTitle>
              <CardDescription>
                View and explore curriculum content
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  Back
                </Button>
              )}
              {onEdit && (
                <Button onClick={() => onEdit(content)}>
                  Edit Content
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {renderMetadata()}

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Content</h3>
              
              {content.content.length > 1 ? (
                <Tabs value={activeVariant} onValueChange={setActiveVariant}>
                  <TabsList className="mb-4">
                    {content.content.map((variant) => (
                      <TabsTrigger 
                        key={variant.learningStyle} 
                        value={variant.learningStyle}
                        className={variant.isDefault ? 'font-medium' : ''}
                      >
                        {variant.learningStyle}
                        {variant.isDefault && ' (Default)'}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {content.content.map((variant) => (
                    <TabsContent key={variant.learningStyle} value={variant.learningStyle}>
                      {renderContentVariant(variant)}
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                renderContentVariant(content.content[0])
              )}
            </div>

            {(content.prerequisites?.length > 0 || content.relatedContent?.length > 0) && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Related Content</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.prerequisites?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Prerequisites</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {content.prerequisites.map((prerequisite, index) => (
                          <li key={index}>{prerequisite}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {content.relatedContent?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Related Content</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {content.relatedContent.map((related, index) => (
                          <li key={index}>{related}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {content.assessments?.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Associated Assessments</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {content.assessments.map((assessment, index) => (
                    <li key={index}>{assessment}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => {
              toast({
                title: "Content downloaded",
                description: "The content has been downloaded for offline use",
              });
            }}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            
            <Button onClick={() => {
              toast({
                title: "Content added to your learning path",
                description: "This content has been added to your personalized learning path",
              });
            }}>
              Add to Learning Path
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
