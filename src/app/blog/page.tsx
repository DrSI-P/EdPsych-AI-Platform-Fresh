'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';

// Dynamically import components with SSR disabled
const EducationalAIBlog = dynamic(
  () => import('@/components/blog/educational-ai-blog'),
  { ssr: false }
);

const BlogPostEditor = dynamic(
  () => import('@/components/blog/blog-post-editor'),
  { ssr: false }
);

const BlogPostDetail = dynamic(
  () => import('@/components/blog/blog-post-detail'),
  { ssr: false }
);

const CommentModerationDashboard = dynamic(
  () => import('@/components/blog/comment-moderation-dashboard'),
  { ssr: false }
);

const BlogPage = () => {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="blog" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
          <TabsTrigger value="view">View Post</TabsTrigger>
          <TabsTrigger value="moderate">Moderation</TabsTrigger>
        </TabsList>
        <TabsContent value="blog">
          <EducationalAIBlog />
        </TabsContent>
        <TabsContent value="create">
          <BlogPostEditor />
        </TabsContent>
        <TabsContent value="view">
          <BlogPostDetail />
        </TabsContent>
        <TabsContent value="moderate">
          <CommentModerationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogPage;
