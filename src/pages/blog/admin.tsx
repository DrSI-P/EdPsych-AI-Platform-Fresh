import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma-client';
import { BlogAdminDashboard } from '@/components/blog/BlogAdminDashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BlogAdminPageProps {
  initialTab: string;
}

export default function BlogAdminPage({ initialTab }: BlogAdminPageProps) {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>Blog Administration | EdPsych Connect</title>
        <meta name="description" content="Manage blog content and automated generation" />
      </Head>
      
      <div className="container py-8 md:py-12">
        <BlogAdminDashboard initialTab={initialTab} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { tab } = context.query;
  
  // Check if user is authenticated and has permission
  if (!session || !['admin', 'teacher'].includes(session.user.role as string)) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=/blog/admin',
        permanent: false,
      },
    };
  }
  
  // Validate tab parameter
  const validTabs = ['schedules', 'generations', 'analytics'];
  const initialTab = validTabs.includes(tab as string) ? tab : 'schedules';
  
  return {
    props: {
      initialTab,
    },
  };
};
