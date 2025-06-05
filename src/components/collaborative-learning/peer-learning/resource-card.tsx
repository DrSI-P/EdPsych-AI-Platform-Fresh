'use client';

import React from 'react';
import { StudentResource } from '@/lib/collaborative-learning/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ThumbsUp } from 'lucide-react';

/**
 * Resource Card Component
 *
 * Displays information about a student resource
 */
export function ResourceCard({ 
  resource, 
  currentUserId 
}: { 
  resource: StudentResource; 
  currentUserId: string;
}) {
  // Format date
  const createdDate = new Date(resource.createdAt).toLocaleDateString();

  // Determine if current user is the creator
  const isCreator = resource.creatorId === currentUserId;

  // Get content type icon
  const getContentTypeIcon = () => {
    switch (resource.contentType) {
      case 'text':
        return <BookOpen className="h-5 w-5" />;
      case 'image':
        return <img src="/icons/image.svg" alt="Image" className="h-5 w-5" />;
      case 'video':
        return <img src="/icons/video.svg" alt="Video" className="h-5 w-5" />;
      case 'audio':
        return <img src="/icons/audio.svg" alt="Audio" className="h-5 w-5" />;
      case 'document':
        return <img src="/icons/document.svg" alt="Document" className="h-5 w-5" />;
      case 'link':
        return <img src="/icons/link.svg" alt="Link" className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className={`h-2 ${getContentTypeColor(resource.contentType)}`}></div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            {getContentTypeIcon()}
            <Badge className="ml-2" variant="outline">{resource.contentType}</Badge>
          </div>
          {resource.approved && (
            <Badge variant="secondary">Approved</Badge>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">{resource.description}</p>

        <div className="space-y-3 mt-auto">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subject:</span>
            <span className="font-medium">{resource.subject}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Key Stage:</span>
            <span className="font-medium">{resource.keyStage}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Created:</span>
            <span className="font-medium">{createdDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rating:</span>
            <span className="font-medium flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1 text-primary" />
              {resource.averageRating.toFixed(1)} ({resource.reviews?.length || 0})
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-4">
          {resource.tags.slice(0, 3).map((tag: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{resource.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 bg-muted/50">
        <Button variant="outline" className="w-full">
          View Resource
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Helper function to get color based on content type
 */
function getContentTypeColor(contentType: string): string {
  switch (contentType) {
    case 'text':
      return 'bg-blue-500';
    case 'image':
      return 'bg-green-500';
    case 'video':
      return 'bg-red-500';
    case 'audio':
      return 'bg-purple-500';
    case 'document':
      return 'bg-amber-500';
    case 'link':
      return 'bg-cyan-500';
    default:
      return 'bg-gray-500';
  }
}