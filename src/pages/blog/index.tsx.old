import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma-client';
import { BlogList } from '@/components/blog/BlogList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BlogPage({ initialPosts, categories, featuredPost, totalPosts }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedKeyStage, setSelectedKeyStage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('latest');
  
  const fetchPosts = async (options = {}) => {
    setIsLoading(true);
    
    const params = new URLSearchParams();
    
    if (searchTerm) params.append('search', searchTerm);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedKeyStage) params.append('keyStage', selectedKeyStage);
    if (options.page) params.append('page', options.page.toString());
    if (activeTab === 'popular') params.append('sort', 'popular');
    
    try {
      const response = await fetch(`/api/blog/posts?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (searchTerm || selectedCategory || selectedKeyStage || activeTab !== 'latest') {
      fetchPosts({ page: 1 });
      setCurrentPage(1);
    }
  }, [searchTerm, selectedCategory, selectedKeyStage, activeTab]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPosts({ page });
    window.scrollTo(0, 0);
  };
  
  return (
    <>
      <Head>
        <title>Blog | EdPsych Connect</title>
        <meta name="description" content="Educational psychology resources, articles, and insights for teachers, parents, and professionals." />
      </Head>
      
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Educational Blog</h1>
            <p className="text-muted-foreground mt-2">
              Evidence-based resources and insights for educational psychology
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/blog/categories')}>
              Categories
            </Button>
            <Button onClick={() => router.push('/blog/admin')}>
              Dashboard
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedKeyStage} onValueChange={setSelectedKeyStage}>
              <SelectTrigger>
                <SelectValue placeholder="Key Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Key Stages</SelectItem>
                <SelectItem value="1">KS1</SelectItem>
                <SelectItem value="2">KS2</SelectItem>
                <SelectItem value="3">KS3</SelectItem>
                <SelectItem value="4">KS4</SelectItem>
                <SelectItem value="5">KS5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="latest" onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="latest">Latest</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <BlogList
          posts={posts.posts}
          isLoading={isLoading}
          pagination={posts.pagination}
          onPageChange={handlePageChange}
          featuredPostIndex={activeTab === 'latest' && currentPage === 1 ? 0 : -1}
          emptyMessage={
            searchTerm || selectedCategory || selectedKeyStage
              ? "No posts match your search criteria"
              : "No blog posts found"
          }
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  try {
    // Fetch initial posts
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'published',
      },
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
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: 10,
    });
    
    // Fetch categories
    const categories = await prisma.blogCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    
    // Get total post count
    const totalPosts = await prisma.blogPost.count({
      where: {
        status: 'published',
      },
    });
    
    // Format posts for frontend
    const formattedPosts = posts.map(post => ({
      ...post,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      categories: post.categories.map(c => c.category),
    }));
    
    return {
      props: {
        initialPosts: {
          posts: formattedPosts,
          pagination: {
            total: totalPosts,
            page: 1,
            limit: 10,
            pages: Math.ceil(totalPosts / 10),
          },
        },
        categories: categories.filter(c => c._count.posts > 0).map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          count: c._count.posts,
        })),
        featuredPost: formattedPosts[0] || null,
        totalPosts,
      },
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return {
      props: {
        initialPosts: {
          posts: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            pages: 0,
          },
        },
        categories: [],
        featuredPost: null,
        totalPosts: 0,
      },
    };
  }
};