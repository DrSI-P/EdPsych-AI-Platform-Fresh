import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma-client';
import { BlogForm } from '@/components/blog/BlogForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

interface Category {
  id: string;
  name: string;
}

interface NewBlogPostPageProps {
  categories: any[];
}

export default function NewBlogPostPage({ categories }: NewBlogPostPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create blog post');
      }
      
      toast({
        title: 'Blog post created',
        description: `Your post "${result.post.title}" has been created successfully.`,
      });
      
      // Redirect to the new post
      router.push(`/blog/${result.post.slug}`);
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create blog post',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>Create New Blog Post | EdPsych Connect</title>
        <meta name="description" content="Create a new blog post on EdPsych Connect" />
      </Head>
      
      <div className="container py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
        
        <BlogForm 
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          mode="create"
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  // Check if user is authenticated and has permission
  if (!session || !['admin', 'teacher'].includes(session.user.role as string)) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=/blog/new',
        permanent: false,
      },
    };
  }
  
  try {
    // Fetch categories
    const categories = await prisma.blogCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
    
    return {
      props: {
        categories,
      },
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      props: {
        categories: [],
      },
    };
  }
};
