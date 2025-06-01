import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';
import { BlogPostView } from '@/components/blog/BlogPostView';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma-client';

interface BlogPostPageProps {
  post: any;
  relatedPosts: any[];
}

export default function BlogPostPage({ post, relatedPosts }: BlogPostPageProps) {
  const router = useRouter();
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  
  // If the page is being rendered via fallback, show loading state
  if (router.isFallback) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>
    );
  }
  
  // If no post found, show error
  if (!post) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertDescription>Blog post not found</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const handleLike = async () => {
    setIsLikeLoading(true);
    
    try {
      const response = await fetch(`/api/blog/posts/${post.id}/like`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      
      const data = await response.json();
      setCurrentPost(prev => ({
        ...prev,
        likeCount: data.likeCount,
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>{post.title} | EdPsych Connect Blog</title>
        <meta name="description" content={post.summary} />
        <meta property="og:title" content={`${post.title} | EdPsych Connect Blog`} />
        <meta property="og:description" content={post.summary} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
      </Head>
      
      <div className="container py-8 md:py-12">
        <BlogPostView 
          post={currentPost} 
          relatedPosts={relatedPosts}
          onLike={handleLike}
          isLikeLoading={isLikeLoading}
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  const session = await getServerSession(context.req, context.res, authOptions);
  
  try {
    // Fetch the post by slug
    const post = await prisma.blogPost.findUnique({
      where: { slug: slug as string },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        relatedResources: true,
      },
    });
    
    // If post not found or not published (and user is not author or admin)
    if (!post || (post.status !== 'published' && 
        (!session || 
         (session.user.id !== post.authorId && 
          !['admin', 'teacher'].includes(session.user.role as string))))) {
      return {
        notFound: true,
      };
    }
    
    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });
    
    // Fetch related posts based on categories and tags
    const categoryIds = post.categories.map(c => c.categoryId);
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        id: { not: post.id },
        status: 'published',
        OR: [
          { categories: { some: { categoryId: { in: categoryIds } } } },
          { tags: { hasSome: post.tags } },
          { curriculumArea: post.curriculumArea },
          { keyStage: post.keyStage },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });
    
    // Format post and related posts for frontend
    const formattedPost = {
      ...post,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.createdAt.toISOString(),
    };
    
    const formattedRelatedPosts = relatedPosts.map(relatedPost => ({
      ...relatedPost,
      publishedAt: relatedPost.publishedAt ? relatedPost.publishedAt.toISOString() : null,
    }));
    
    return {
      props: {
        post: formattedPost,
        relatedPosts: formattedRelatedPosts,
      },
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return {
      notFound: true,
    };
  }
};
