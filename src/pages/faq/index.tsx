import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ChatInterface } from '@/components/faq/ChatInterface';
import { FAQBrowser } from '@/components/faq/FAQBrowser';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FAQPage({ initialCategories, initialQuestions }) {
  return (
    <>
      <Head>
        <title>FAQ & Help | EdPsych Connect</title>
        <meta name="description" content="Frequently asked questions and AI-powered help for EdPsych Connect" />
      </Head>

      <div className="container py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">FAQ & Help Centre</h1>
        <p className="text-muted-foreground mb-8">
          Find answers to common questions or chat with our AI assistant
        </p>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
            <TabsTrigger value="faq">Browse FAQs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ChatInterface className="h-[600px]" />
              </div>
              <div className="hidden lg:block">
                <FAQBrowser 
                  initialCategories={initialCategories}
                  initialQuestions={initialQuestions}
                  showTabs={false}
                  className="h-[600px] overflow-y-auto"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="faq">
            <FAQBrowser 
              initialCategories={initialCategories}
              initialQuestions={initialQuestions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  try {
    // Fetch categories
    const categories = await prisma.fAQCategory.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    
    // Fetch popular questions
    const questions = await prisma.fAQQuestion.findMany({
      where: {
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
      take: 10,
    });
    
    return {
      props: {
        initialCategories: categories,
        initialQuestions: questions,
      },
    };
  } catch (error) {
    console.error('Error fetching FAQ data:', error);
    return {
      props: {
        initialCategories: [],
        initialQuestions: [],
      },
    };
  }
}
