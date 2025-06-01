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
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditFAQPage({ question, categories }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/faq/questions?id=${question.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update FAQ');
      }
      
      toast({
        title: 'FAQ updated',
        description: 'Your FAQ has been updated successfully.',
      });
      
      // Redirect to the FAQ
      router.push(`/faq/questions/${question.id}`);
    } catch (error) {
      console.error('Error updating FAQ:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update FAQ',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };
  
  const handleBack = () => {
    router.push(`/faq/questions/${question.id}`);
  };
  
  return (
    <>
      <Head>
        <title>Edit FAQ | EdPsych Connect</title>
        <meta name="description" content="Edit a frequently asked question for EdPsych Connect" />
      </Head>
      
      <div className="container py-8 md:py-12">
        <Button variant="ghost" className="mb-4" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to FAQ
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Edit FAQ</h1>
        
        <FAQForm 
          initialData={question}
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          mode="edit"
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { id } = context.params || {};
  
  // Check if user is authenticated and has permission
  if (!session || !['admin', 'teacher'].includes(session.user.role)) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=/faq/edit/${id}',
        permanent: false,
      },
    };
  }
  
  if (!id || typeof id !== 'string') {
    return {
      notFound: true,
    };
  }
  
  try {
    // Fetch question
    const question = await prisma.fAQQuestion.findUnique({
      where: { id: id as string },
    });
    
    if (!question) {
      return {
        notFound: true,
      };
    }
    
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
        question,
        categories,
      },
    };
  } catch (error) {
    console.error('Error fetching FAQ data:', error);
    return {
      props: {
        question: null,
        categories: [],
      },
    };
  }
}
