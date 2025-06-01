import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    featuredImage?: string;
    publishedAt: string | Date | null;
    keyStage?: string | null;
    curriculumArea?: string | null;
    tags: any[];
    readingTime?: number | null;
    readingLevel?: string | null;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
    viewCount: number;
    likeCount: number;
  };
  variant?: 'default' | 'compact' | 'featured';
}

export function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  
  // Format the published date
  const publishedDate = post.publishedAt 
    ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
    : 'Draft';
  
  // Default placeholder image if none provided
  const imageUrl = post.featuredImage || '/images/blog-placeholder.jpg';
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isFeatured ? 'border-primary' : ''
    }`}>
      <Link href={`/blog/${post.slug}`} className="block">
        <div className={`relative ${isFeatured ? 'h-64' : isCompact ? 'h-32' : 'h-48'}`}>
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes={isFeatured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
          />
          {post.keyStage && (
            <Badge className="absolute top-2 right-2 bg-primary text-white">
              KS{post.keyStage}
            </Badge>
          )}
        </div>
        
        <CardHeader className={`${isCompact ? 'p-3' : 'p-4'}`}>
          <div className="flex justify-between items-start">
            <h3 className={`font-bold ${isFeatured ? 'text-2xl' : isCompact ? 'text-lg' : 'text-xl'} line-clamp-2`}>
              {post.title}
            </h3>
          </div>
        </CardHeader>
        
        {!isCompact && (
          <CardContent className={`${isCompact ? 'p-3' : 'p-4'} pt-0`}>
            <p className="text-muted-foreground line-clamp-3">{post.summary}</p>
          </CardContent>
        )}
        
        <CardFooter className={`flex justify-between items-center text-sm text-muted-foreground ${isCompact ? 'p-3' : 'p-4'} pt-0`}>
          <div className="flex items-center gap-2">
            {post.author.image && (
              <Image
                src={post.author.image}
                alt={post.author.name || 'Author'}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center gap-4">
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {post.readingTime} min
              </span>
            )}
            <span>{publishedDate}</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
