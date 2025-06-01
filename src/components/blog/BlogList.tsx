import React from 'react';
import { BlogCard } from './BlogCard';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BlogPost {
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
}

interface BlogListProps {
  posts: any[];
  isLoading?: boolean;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  featuredPostIndex?: number;
}

export function BlogList({
  posts,
  isLoading = false,
  error,
  pagination,
  onPageChange,
  emptyMessage = "No blog posts found",
  featuredPostIndex = 0
}: BlogListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-48 w-full rounded-md" />
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4 rounded-md" />
              <Skeleton className="h-4 w-1/4 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Alert>
        <AlertDescription>{emptyMessage}</AlertDescription>
      </Alert>
    );
  }

  // Create a copy of posts to avoid mutating props
  const displayPosts = [...posts];
  
  // If we have enough posts and featuredPostIndex is valid, set up featured post
  const hasFeaturedPost = displayPosts.length > 0 && 
    featuredPostIndex >= 0 && 
    featuredPostIndex < displayPosts.length;
  
  // Extract featured post if applicable
  const featuredPost = hasFeaturedPost ? displayPosts[featuredPostIndex] : null;
  
  // Remove featured post from regular list if it exists
  if (hasFeaturedPost) {
    displayPosts.splice(featuredPostIndex, 1);
  }

  return (
    <div className="space-y-8">
      {/* Featured post */}
      {featuredPost && (
        <div className="mb-8">
          <BlogCard post={featuredPost} variant="featured" />
        </div>
      )}
      
      {/* Regular posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      
      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
