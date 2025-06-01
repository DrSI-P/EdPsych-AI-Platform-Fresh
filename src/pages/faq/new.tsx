import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { FAQForm } from '@/components/faq/FAQForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

export default function NewFAQPage({ categories }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/faq/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create FAQ');
      }
      
      toast({
        title: 'FAQ created',
        description: 'Your FAQ has been created successfully.',
      });
      
      // Redirect to the new FAQ
      router.push(`/faq/questions/${result.question.id}`);
    } catch (error) {
      console.error('Error creating FAQ:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create FAQ',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>Create New FAQ | EdPsych Connect</title>
        <meta name="description" content="Create a new frequently asked question for EdPsych Connect" />
      </Head>
      
      <div className="container py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Create New FAQ</h1>
        
        <FAQForm 
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
  if (!session || !['admin', 'teacher'].includes(session.user.role)) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=/faq/new',
        permanent: false,
      },
    };
  }
  
  try {
    // Fetch categories
    const categories = await prisma.fAQCategory.findMany({
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
}
