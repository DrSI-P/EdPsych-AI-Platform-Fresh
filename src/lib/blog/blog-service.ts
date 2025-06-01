/**
 * Automatic Blog Post Feature for EdPsych AI Education Platform
 * 
 * This module provides functionality for automatically generating, scheduling,
 * and publishing educational blog posts with AI assistance and human review.
 */

import { db } from '@/lib/db';
import { OpenAI } from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Blog post types and categories
export const BLOG_CATEGORIES = [
  'educational-psychology',
  'learning-strategies',
  'special-needs',
  'curriculum-insights',
  'teacher-resources',
  'parent-guides',
  'student-tips',
  'educational-technology',
  'research-highlights',
  'case-studies'
];

export const BLOG_AUDIENCES = [
  'educators',
  'parents',
  'students-primary',
  'students-secondary',
  'educational-psychologists',
  'school-administrators'
];

// Blog post status types
export type BlogPostStatus = 
  | 'draft'
  | 'review'
  | 'scheduled'
  | 'published'
  | 'archived';

// Blog post interface
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  targetAudience: string[];
  status: BlogPostStatus;
  authorId: string;
  reviewerId?: string;
  publishDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  isAutomaticallyGenerated: boolean;
  aiGenerationPrompt?: string;
  seoTitle?: string;
  seoDescription?: string;
  readingTime?: number;
}

// Author interface
export interface Author {
  id: string;
  name: string;
  image?: string;
}

// Reviewer interface
export interface Reviewer {
  id: string;
  name: string;
}

// Extended blog post interface with author and reviewer
export interface BlogPostWithRelations extends BlogPost {
  author: Author;
  reviewer?: Reviewer;
}

// Blog post generation parameters
export interface BlogPostGenerationParams {
  topic: string;
  audience: string[];
  category: string;
  keyPoints?: string[];
  tone?: 'professional' | 'conversational' | 'academic';
  wordCount?: number;
}

// Blog post generation result
export interface BlogPostGenerationResult {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
}

// Blog post save parameters
export interface BlogPostSaveParams {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  targetAudience: string[];
  status?: BlogPostStatus;
  publishDate?: Date;
  authorId: string;
  featuredImage?: string;
  aiGenerationPrompt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

// Blog post filter parameters
export interface BlogPostFilterParams {
  status?: BlogPostStatus | BlogPostStatus[];
  category?: string;
  audience?: string;
  page?: number;
  limit?: number;
  authorId?: string;
}

// Blog post filter result
export interface BlogPostFilterResult {
  posts: BlogPostWithRelations[];
  total: number;
  pages: number;
}

// SEO recommendations result
export interface SeoRecommendationsResult {
  title: string;
  description: string;
  keywords: string[];
  suggestions: string[];
}

// Blog analytics result
export interface BlogAnalyticsResult {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  topPosts: Array<{ id: string; title: string; views: number }>;
  categoryBreakdown: Record<string, number>;
  audienceBreakdown: Record<string, number>;
}

// Blog post idea
export interface BlogPostIdea {
  title: string;
  summary: string;
  category: string;
  targetAudience: string[];
  keyPoints: string[];
}

/**
 * Generate a blog post using AI based on specified parameters
 */
export async function generateBlogPost({
  topic,
  audience,
  category,
  keyPoints,
  tone = 'professional',
  wordCount = 800,
}: BlogPostGenerationParams): Promise<BlogPostGenerationResult> {
  // Construct the prompt for the AI
  const audienceStr = audience.join(', ');
  const keyPointsStr = keyPoints ? keyPoints.join('; ') : '';
  
  const prompt = `
    Write a comprehensive, engaging, and educational blog post about "${topic}" for the EdPsych AI Education Platform.
    
    Target audience: ${audienceStr}
    Category: ${category}
    Key points to include: ${keyPointsStr}
    Tone: ${tone}
    Word count: approximately ${wordCount} words
    
    The blog post should follow UK spelling and educational standards, and be aligned with the UK Department for Education (DFE) curriculum where relevant.
    
    Please format your response as a JSON object with the following fields:
    - title: An engaging title for the blog post
    - content: The full blog post content with proper markdown formatting, including headings, paragraphs, and bullet points
    - summary: A concise 2-3 sentence summary of the blog post
    - tags: An array of 5-8 relevant tags for the post
    - seoTitle: An SEO-optimized title (max 60 characters)
    - seoDescription: An SEO-optimized meta description (max 160 characters)
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert educational content creator specializing in UK educational psychology and curriculum." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error("Failed to generate blog post content");
    }

    // Parse the JSON response
    const blogData = JSON.parse(responseText);
    
    return {
      title: blogData.title,
      content: blogData.content,
      summary: blogData.summary,
      tags: blogData.tags,
      seoTitle: blogData.seoTitle,
      seoDescription: blogData.seoDescription,
    };
  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error("Failed to generate blog post. Please try again later.");
  }
}

/**
 * Create a slug from a title
 */
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculate estimated reading time for content
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Save a generated blog post to the database
 */
export async function saveBlogPost({
  title,
  content,
  summary,
  category,
  tags,
  targetAudience,
  status = 'draft',
  publishDate,
  authorId,
  featuredImage,
  aiGenerationPrompt,
  seoTitle,
  seoDescription,
}: BlogPostSaveParams): Promise<string> {
  const slug = createSlug(title);
  const readingTime = calculateReadingTime(content);
  
  const post = await db.blogPost.create({
    data: {
      title,
      slug,
      summary,
      content,
      featuredImage,
      category,
      tags,
      targetAudience,
      status,
      authorId,
      publishDate,
      readingTime,
      isAutomaticallyGenerated: !!aiGenerationPrompt,
      aiGenerationPrompt,
      seoTitle,
      seoDescription,
    }
  });
  
  return post.id;
}

/**
 * Schedule a blog post for publication
 */
export async function scheduleBlogPost(
  postId: string,
  publishDate: Date,
  reviewerId: string
): Promise<void> {
  await db.blogPost.update({
    where: { id: postId },
    data: {
      status: 'scheduled',
      publishDate,
      reviewerId,
    }
  });
}

/**
 * Publish a blog post immediately
 */
export async function publishBlogPost(
  postId: string,
  reviewerId: string
): Promise<void> {
  await db.blogPost.update({
    where: { id: postId },
    data: {
      status: 'published',
      publishDate: new Date(),
      reviewerId,
    }
  });
}

/**
 * Get blog posts with filtering options
 */
export async function getBlogPosts({
  status,
  category,
  audience,
  page = 1,
  limit = 10,
  authorId,
}: BlogPostFilterParams): Promise<BlogPostFilterResult> {
  const skip = (page - 1) * limit;
  
  // Build the where clause
  const where = {};
  
  if (status) {
    where.status = Array.isArray(status) ? { in: status } : status;
  }
  
  if (category) {
    where.category = category;
  }
  
  if (audience) {
    where.targetAudience = {
      has: audience
    };
  }
  
  if (authorId) {
    where.authorId = authorId;
  }
  
  // Get total count for pagination
  const total = await db.blogPost.count({ where });
  
  // Get the posts
  const posts = await db.blogPost.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      publishDate: 'desc'
    },
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
  
  return {
    posts: posts as unknown as BlogPostWithRelations[],
    total,
    pages: Math.ceil(total / limit)
  };
}

/**
 * Get a single blog post by ID or slug
 */
export async function getBlogPost(
  idOrSlug: string
): Promise<BlogPostWithRelations | null> {
  // Determine if the input is an ID or slug
  const isId = idOrSlug.length === 24; // Assuming MongoDB ObjectId length
  
  const post = await db.blogPost.findFirst({
    where: isId ? { id: idOrSlug } : { slug: idOrSlug },
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
  
  return post as unknown as BlogPostWithRelations | null;
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(
  id: string,
  data: Partial<BlogPost>
): Promise<void> {
  // If title is updated, update the slug as well
  if (data.title) {
    data.slug = createSlug(data.title);
  }
  
  // If content is updated, recalculate reading time
  if (data.content) {
    data.readingTime = calculateReadingTime(data.content);
  }
  
  await db.blogPost.update({
    where: { id },
    data: data as any
  });
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string): Promise<void> {
  await db.blogPost.delete({
    where: { id }
  });
}

/**
 * Generate blog post ideas based on user interests and curriculum topics
 */
export async function generateBlogPostIdeas(count: number = 5, topics?: string[]): Promise<BlogPostIdea[]> {
  const topicsStr = topics ? topics.join(', ') : 'educational psychology, learning strategies, special needs education, curriculum development';
  
  const prompt = `
    Generate ${count} blog post ideas for the EdPsych AI Education Platform.
    
    Topics to focus on: ${topicsStr}
    
    For each idea, provide:
    - A compelling title
    - A brief summary (1-2 sentences)
    - The most appropriate category from this list: ${BLOG_CATEGORIES.join(', ')}
    - Target audience from this list: ${BLOG_AUDIENCES.join(', ')}
    - 3-5 key points that should be covered in the post
    
    Format your response as a JSON array of objects.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert educational content strategist specializing in UK educational psychology and curriculum." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error("Failed to generate blog post ideas");
    }

    // Parse the JSON response
    const ideasData = JSON.parse(responseText);
    return ideasData.ideas || [];
  } catch (error) {
    console.error("Error generating blog post ideas:", error);
    throw new Error("Failed to generate blog post ideas. Please try again later.");
  }
}

/**
 * Process scheduled blog posts that are due for publication
 * This should be run by a cron job or similar scheduled task
 */
export async function processScheduledBlogPosts(): Promise<number> {
  const now = new Date();
  
  // Find all scheduled posts that are due for publication
  const duePosts = await db.blogPost.findMany({
    where: {
      status: 'scheduled',
      publishDate: {
        lte: now
      }
    }
  });
  
  // Publish each post
  for (const post of duePosts) {
    await db.blogPost.update({
      where: { id: post.id },
      data: {
        status: 'published'
      }
    });
  }
  
  return duePosts.length;
}

/**
 * Share a blog post to social media
 */
export async function shareBlogPostToSocialMedia(
  postId: string,
  platforms: Array<'twitter' | 'facebook' | 'linkedin'>
): Promise<Record<string, boolean>> {
  const post = await getBlogPost(postId);
  if (!post) {
    throw new Error("Blog post not found");
  }
  
  const results: Record<string, boolean> = {};
  
  // This would integrate with actual social media APIs
  // For now, we'll simulate the sharing process
  for (const platform of platforms) {
    try {
      // Simulate API call to share post
      console.log(`Sharing post "${post.title}" to ${platform}`);
      
      // In a real implementation, this would use the appropriate API
      // For example, using the Twitter API, Facebook Graph API, etc.
      
      // Record successful share
      results[platform] = true;
      
      // Log the share in the database
      await db.socialMediaShare.create({
        data: {
          blogPostId: post.id,
          platform,
          shareDate: new Date(),
          successful: true
        }
      });
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      results[platform] = false;
      
      // Log the failed share
      await db.socialMediaShare.create({
        data: {
          blogPostId: post.id,
          platform,
          shareDate: new Date(),
          successful: false,
          errorMessage: (error as Error).message
        }
      });
    }
  }
  
  return results;
}

/**
 * Generate SEO recommendations for a blog post
 */
export async function generateSeoRecommendations(
  postId: string
): Promise<SeoRecommendationsResult> {
  const post = await getBlogPost(postId);
  if (!post) {
    throw new Error("Blog post not found");
  }
  
  const prompt = `
    Analyze this blog post and provide SEO recommendations:
    
    Title: ${post.title}
    Summary: ${post.summary}
    Content: ${post.content.substring(0, 1000)}... (truncated)
    Category: ${post.category}
    Tags: ${post.tags.join(', ')}
    
    Please provide:
    1. An SEO-optimized title (max 60 characters)
    2. An SEO-optimized meta description (max 160 characters)
    3. 5-8 recommended keywords
    4. 3-5 suggestions for improving the content for SEO
    
    Format your response as a JSON object.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert SEO specialist for educational content." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error("Failed to generate SEO recommendations");
    }

    // Parse the JSON response
    const seoData = JSON.parse(responseText);
    
    return {
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords,
      suggestions: seoData.suggestions
    };
  } catch (error) {
    console.error("Error generating SEO recommendations:", error);
    throw new Error("Failed to generate SEO recommendations. Please try again later.");
  }
}

/**
 * Get analytics for blog posts
 */
export async function getBlogAnalytics(
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<BlogAnalyticsResult> {
  // Calculate the start date based on the period
  const now = new Date();
  let startDate = new Date();
  
  switch (period) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  // Get total posts
  const totalPosts = await db.blogPost.count();
  
  // Get published posts in the period
  const publishedPosts = await db.blogPost.count({
    where: {
      status: 'published',
      publishDate: {
        gte: startDate
      }
    }
  });
  
  // Get total views in the period
  const viewsData = await db.blogPostView.aggregate({
    where: {
      viewDate: {
        gte: startDate
      }
    },
    _sum: {
      count: true
    }
  });
  
  const totalViews = viewsData._sum.count || 0;
  
  // Get top posts by views
  const topPostsData = await db.blogPostView.groupBy({
    by: ['blogPostId'],
    where: {
      viewDate: {
        gte: startDate
      }
    },
    _sum: {
      count: true
    },
    orderBy: {
      _sum: {
        count: 'desc'
      }
    },
    take: 5
  });
  
  // Get post titles for top posts
  const topPosts = await Promise.all(
    topPostsData.map(async (item) => {
      const post = await db.blogPost.findUnique({
        where: { id: item.blogPostId },
        select: { title: true }
      });
      
      return {
        id: item.blogPostId,
        title: post?.title || 'Unknown',
        views: item._sum.count || 0
      };
    })
  );
  
  // Get category breakdown
  const categoryData = await db.blogPost.groupBy({
    by: ['category'],
    where: {
      status: 'published'
    },
    _count: true
  });
  
  const categoryBreakdown: Record<string, number> = {};
  categoryData.forEach(item => {
    categoryBreakdown[item.category] = item._count;
  });
  
  // Get audience breakdown (this is more complex as targetAudience is an array)
  // For simplicity, we'll count each audience once per post
  const audienceBreakdown: Record<string, number> = {};
  
  // Initialize with zeros
  BLOG_AUDIENCES.forEach(audience => {
    audienceBreakdown[audience] = 0;
  });
  
  // Get all published posts with their target audiences
  const postsWithAudiences = await db.blogPost.findMany({
    where: {
      status: 'published'
    },
    select: {
      targetAudience: true
    }
  });
  
  // Count each audience
  postsWithAudiences.forEach(post => {
    post.targetAudience.forEach(audience => {
      audienceBreakdown[audience] = (audienceBreakdown[audience] || 0) + 1;
    });
  });
  
  return {
    totalPosts,
    publishedPosts,
    totalViews,
    topPosts,
    categoryBreakdown,
    audienceBreakdown
  };
}
