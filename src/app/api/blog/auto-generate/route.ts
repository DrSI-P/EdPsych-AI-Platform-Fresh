import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import { db } from '@/lib/db';

// Constants for validation
const BLOG_CATEGORIES = [
  'educational-psychology',
  'inclusive-education',
  'teaching-strategies',
  'assessment',
  'technology',
  'professional-development',
  'research',
  'policy',
  'case-studies'
];

const BLOG_AUDIENCES = [
  'teachers',
  'parents',
  'students',
  'administrators',
  'researchers',
  'policymakers',
  'general'
];

interface BlogGenerationParams {
  topic: string;
  audience: any[];
  category: string;
  keyPoints?: string[];
  tone?: string;
  wordCount?: number;
}

interface BlogPostData {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: any[];
  targetAudience: any[];
  status: string;
  authorId: string;
  aiGenerationPrompt: string;
  seoTitle: string;
  seoDescription: string;
}

interface BlogPostIdea {
  title: string;
  description: string;
  targetAudience: any[];
  estimatedReadTime: number;
}

// Mock function for blog post generation
async function generateBlogPost(params: BlogGenerationParams) {
  // In a real implementation, this would call an AI service
  // For now, we'll return a mock response
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
  
  return {
    title: `${params.topic}: A Guide for ${params.audience.join(' and ')}`,
    content: `# ${params.topic}\n\nThis is an automatically generated blog post about ${params.topic} for ${params.audience.join(' and ')}.\n\n${params.keyPoints?.map(point => `## ${point}\n\nContent about ${point}...\n\n`).join('') || ''}`,
    summary: `A comprehensive guide about ${params.topic} specifically designed for ${params.audience.join(' and ')}.`,
    tags: [params.category, ...params.audience, params.topic.toLowerCase().replace(/\s+/g, '-')],
    seoTitle: `${params.topic} | EdPsych Connect`,
    seoDescription: `Learn about ${params.topic} in this guide created specifically for ${params.audience.join(' and ')}.`,
  };
}

// Mock function for saving blog post to database
async function saveBlogPost(postData: BlogPostData) {
  // In a real implementation, this would save to the database
  // For now, we'll return a mock ID
  return `post-${Date.now()}`;
}

// Mock function for generating blog post ideas
async function generateBlogPostIdeas(count: number, topics?: string[]): Promise<BlogPostIdea[]> {
  // In a real implementation, this would call an AI service
  // For now, we'll return mock ideas
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  const ideas: any[] = [];
  
  for (let i = 0; i < count; i++) {
    ideas.push({
      title: topics ? `How to Implement ${topics[i % topics.length]} in the Classroom` : `Blog Post Idea ${i + 1}`,
      description: `A comprehensive guide for educators on implementing effective strategies.`,
      targetAudience: ['teachers', 'administrators'],
      estimatedReadTime: 5 + Math.floor(Math.random() * 10),
    });
  }
  
  return ideas;
}

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user has admin or content creator role
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true, role: true }
    });
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'CONTENT_CREATOR')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Extract parameters
    const {
      topic,
      audience,
      category,
      keyPoints,
      tone,
      wordCount,
      action = 'generate' // Default action is to generate a blog post
    } = body;
    
    // Handle different actions
    if (action === 'generate') {
      // Validate required fields
      if (!topic || !audience || !category) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
      
      // Validate category
      if (!BLOG_CATEGORIES.includes(category)) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        );
      }
      
      // Validate audience (can be an array)
      const audienceArray = Array.isArray(audience) ? audience : [audience];
      for (const aud of audienceArray) {
        if (!BLOG_AUDIENCES.includes(aud)) {
          return NextResponse.json(
            { error: `Invalid audience: ${aud}` },
            { status: 400 }
          );
        }
      }
      
      // Generate the blog post
      const generatedPost = await generateBlogPost({
        topic,
        audience: audienceArray,
        category,
        keyPoints,
        tone,
        wordCount,
      });
      
      // Save the blog post to the database
      const postId = await saveBlogPost({
        title: generatedPost.title,
        content: generatedPost.content,
        summary: generatedPost.summary,
        category,
        tags: generatedPost.tags,
        targetAudience: audienceArray,
        status: 'draft',
        authorId: user.id,
        aiGenerationPrompt: JSON.stringify({
          topic,
          audience: audienceArray,
          category,
          keyPoints,
          tone,
          wordCount,
        }),
        seoTitle: generatedPost.seoTitle,
        seoDescription: generatedPost.seoDescription,
      });
      
      return NextResponse.json({
        id: postId,
        ...generatedPost,
        status: 'draft',
      });
    } else if (action === 'generate-ideas') {
      // Generate blog post ideas
      const count = body.count || 5;
      const topics = body.topics;
      
      const ideas = await generateBlogPostIdeas(count, topics);
      
      return NextResponse.json({ ideas });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error generating blog post:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || 'draft';
    const category = url.searchParams.get('category');
    const audience = url.searchParams.get('audience');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Check if user has admin or content creator role
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true, role: true }
    });
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'CONTENT_CREATOR')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Get blog posts with filtering
    const result = await db.blogPost.findMany({
      where: {
        status: status as string,
        ...(category ? { category } : {}),
        ...(audience ? { targetAudience: { has: audience } } : {}),
        isAutomaticallyGenerated: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // Get total count for pagination
    const total = await db.blogPost.count({
      where: {
        status: status as string,
        ...(category ? { category } : {}),
        ...(audience ? { targetAudience: { has: audience } } : {}),
        isAutomaticallyGenerated: true,
      }
    });
    
    return NextResponse.json({
      posts: result,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
