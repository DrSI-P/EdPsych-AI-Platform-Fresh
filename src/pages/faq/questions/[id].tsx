import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { FAQDetail } from '@/components/faq/FAQDetail';
import { FAQBrowser } from '@/components/faq/FAQBrowser';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FAQQuestionPage({ question, relatedQuestions }) {
  const router = useRouter();
  const { id } = router.query;
  
  const handleBack = () => {
    router.push('/faq');
  };
  
  return (
    <>
      <Head>
        <title>{question?.question || 'FAQ Question'} | EdPsych Connect</title>
        <meta 
          name="description" 
          content={question?.answer?.substring(0, 160) || 'Frequently asked questions and answers from EdPsych Connect'} 
        />
      </Head>

      <div className="container py-8 md:py-12">
        <Button variant="ghost" className="mb-4" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to FAQ
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FAQDetail 
              questionId={id as string} 
              showBackButton={false}
              initialQuestion={question}
              initialRelatedQuestions={relatedQuestions}
            />
          </div>
          <div>
            <FAQBrowser 
              showTabs={false}
              className="sticky top-4"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { id } = context.params || {};
  
  if (!id || typeof id !== 'string') {
    return {
      notFound: true,
    };
  }
  
  try {
    // Fetch question
    const question = await prisma.fAQQuestion.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    
    if (!question) {
      return {
        notFound: true,
      };
    }
    
    // Increment view count
    await prisma.fAQQuestion.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    
    // Fetch related questions
    const relatedQuestions = await prisma.fAQQuestion.findMany({
      where: {
        categoryId: question.categoryId,
        id: { not: id },
        isPublished: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { viewCount: 'desc' },
      take: 3,
    });
    
    return {
      props: {
        question,
        relatedQuestions,
      },
    };
  } catch (error) {
    console.error('Error fetching FAQ question:', error);
    return {
      props: {
        question: null,
        relatedQuestions: [],
      },
    };
  }
}
