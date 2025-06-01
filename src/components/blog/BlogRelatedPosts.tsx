import React from 'react';
import { BlogCard } from './BlogCard';

interface BlogRelatedPostsProps {
  posts: Array<{
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
  }>;
}

export function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} variant="compact" />
      ))}
    </div>
  );
}
