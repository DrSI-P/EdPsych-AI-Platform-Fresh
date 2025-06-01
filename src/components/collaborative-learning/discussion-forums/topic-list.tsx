'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Eye, Clock, Tag } from 'lucide-react';
import { ForumTopic } from '@/lib/collaborative-learning/types';

/**
 * Topic List Component
 * 
 * Displays a list of forum topics with key information and actions.
 */
export function TopicList({ topics, currentUserId }) {
  if (!topics || topics.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No topics found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {topics.map(topic => (
        <TopicCard 
          key={topic.id} 
          topic={topic} 
          currentUserId={currentUserId} 
        />
      ))}
    </div>
  );
}

/**
 * Topic Card Component
 * 
 * Displays information about a forum topic
 */
function TopicCard({ topic, currentUserId }) {
  // Format dates
  const createdDate = new Date(topic.createdAt).toLocaleDateString();
  const lastPostDate = new Date(topic.lastPostAt).toLocaleDateString();
  
  // Determine if current user is the creator
  const isCreator = topic.createdBy === currentUserId;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Avatar and creator info */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/avatars/${topic.createdBy}.png`} alt="User avatar" />
              <AvatarFallback>{topic.createdBy.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground mt-1">
              {isCreator ? 'You' : `User ${topic.createdBy.substring(0, 4)}`}
            </span>
          </div>
          
          {/* Topic content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{topic.title}</h3>
              <Badge>{topic.category.replace('_', ' ')}</Badge>
            </div>
            
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {topic.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {topic.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {topic.replyCount} replies
                </span>
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {topic.viewCount} views
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {topic.lastPostAt === topic.createdAt ? 
                    `Created ${createdDate}` : 
                    `Last post ${lastPostDate}`
                  }
                </span>
              </div>
              
              <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                View Topic
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
