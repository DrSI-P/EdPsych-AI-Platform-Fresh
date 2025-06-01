import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  count: number;
  children: {
    id: string;
  }[];
}

interface BlogCategoriesPageProps {
  categories: any[];
}

export default function BlogCategoriesPage({ categories }: BlogCategoriesPageProps) {
  return (
    <>
      <Head>
        <title>Blog Categories | EdPsych Connect</title>
        <meta name="description" content="Browse educational blog posts by category" />
      </Head>
      
      <div className="container py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Blog Categories</h1>
            <p className="text-muted-foreground mt-2">
              Browse educational content by subject area and topic
            </p>
          </div>
          
          <Link href="/blog" className="text-primary hover:underline">
            Back to Blog
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link href={`/blog/category/${category.slug}`} key={category.id}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {category.description || `Educational resources and articles about ${category.name}`}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{category.count} posts</Badge>
                    {category.children && category.children.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {category.children.length} subcategories
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  try {
    // Fetch categories with post counts
    const categories = await prisma.blogCategory.findMany({
      where: {
        parentId: null, // Only top-level categories
      },
      include: {
        children: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    
    // Format categories for frontend
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      count: category._count.posts,
      children: category.children,
    }));
    
    return {
      props: {
        categories: formattedCategories,
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
