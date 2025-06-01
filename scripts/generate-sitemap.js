/**
 * Memory-Optimized Sitemap Generator with Tenant Context Middleware
 * This script generates a sitemap.xml file with proper tenant context handling
 * and optimized memory usage for Vercel builds
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Try to load global tenant context if available
let globalTenantContext = null;
try {
  const globalContextPath = path.join(process.cwd(), 'lib', 'tenant-context-global.js');
  if (fs.existsSync(globalContextPath)) {
    globalTenantContext = require(globalContextPath);
    console.log('Loaded global tenant context:', globalTenantContext.TENANT_ID);
    
    // Set environment variable if not already set
    if (!process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID) {
      process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID = globalTenantContext.TENANT_ID;
    }
  }
} catch (error) {
  console.error('Error loading global tenant context:', error.message);
}

// Hardcoded default tenant ID from the database verification
const DEFAULT_TENANT_ID = globalTenantContext?.TENANT_ID || 'debdcb9f-f3d3-4dc5-8000-000000000000';

// Create a memory-optimized Prisma client with reduced connection pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Reduce connection pool size to save memory
  log: ['warn', 'error'],
  // Set low connection limits to reduce memory usage
  __internal: {
    engine: {
      connectionLimit: 1
    }
  }
});

// Site URL for sitemap
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edpsychconnect.com';

// Memory-optimized sitemap generation
async function generateSitemap() {
  console.log('Generating sitemap.xml...');
  
  // Static routes that don't require database access
  const staticRoutes = [
    '/',
    '/analytics',
    '/analytics-dashboard',
    '/avatar-library',
    '/css-test',
    '/educator',
    '/resources/adaptive-learning',
    '/resources/learning-styles',
    '/resources/restorative-justice',
    '/resources/special-needs',
    '/settings',
    '/student',
    '/testpage',
    '/professional-development',
    '/professional-development/foundations',
    '/professional-development/trauma-informed-practice',
    '/professional-development/technology-in-education',
    '/professional-development/teaching-assistant-development',
    '/professional-development/leadership-in-educational-psychology',
    '/professional-development/parent-family-engagement',
    '/professional-development/certification',
    '/professional-development/micro-learning',
    '/professional-development/emotionally-based-school-non-attendance',
    '/professional-development/analytics',
    '/professional-development/certificates',
    '/professional-development/cpd-tracking',
    '/professional-development/learning-communities',
    '/professional-development/mentor-matching',
    '/professional-development/portfolio',
    '/professional-development/research-collaboration',
    '/professional-development/webinars'
  ];
  
  // Dynamic routes from database (with error handling and pagination)
  let dynamicRoutes = [];
  
  // Set tenant context before any database operations
  try {
    // Use hardcoded tenant ID to avoid circular dependency
    await prisma.$executeRaw`SELECT set_tenant_context(${DEFAULT_TENANT_ID}::uuid)`;
    console.log('Set tenant context for database operations');
  } catch (error) {
    console.error('Error setting tenant context:', error.message);
    // Continue with static routes only if tenant context fails
  }
  
  // Blog posts - with pagination and memory optimization
  console.log('Fetching blog posts...');
  try {
    // Use pagination to reduce memory usage
    const PAGE_SIZE = 10;
    let page = 0;
    let hasMore = true;
    let blogPostRoutes = [];
    
    // Process blog posts in small batches to reduce memory usage
    while (hasMore) {
      const blogPosts = await prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true },
        take: PAGE_SIZE,
        skip: page * PAGE_SIZE,
      });
      
      if (blogPosts.length === 0) {
        hasMore = false;
      } else {
        // Process each batch and free memory
        const batchRoutes = blogPosts.map(post => `/blog/${post.slug}`);
        blogPostRoutes = [...blogPostRoutes, ...batchRoutes];
        page++;
        
        // Log progress
        console.log(`Processed ${blogPostRoutes.length} blog posts so far`);
        
        // Force garbage collection if available (Node.js with --expose-gc flag)
        if (global.gc) {
          global.gc();
        }
      }
    }
    
    dynamicRoutes = [...dynamicRoutes, ...blogPostRoutes];
    console.log(`Found ${blogPostRoutes.length} blog posts`);
  } catch (error) {
    console.log(`Warning: Could not fetch blog posts. Skipping blog posts in sitemap. \n${error.message}`);
    // Continue with other routes
  }
  
  // Blog categories - with memory optimization
  console.log('Fetching blog categories...');
  try {
    // Categories are typically small, so we can fetch them all at once
    const blogCategories = await prisma.blogCategory.findMany({
      select: { slug: true },
      // Add a reasonable limit to prevent memory issues
      take: 100
    });
    
    const blogCategoryRoutes = blogCategories.map(category => `/blog/category/${category.slug}`);
    dynamicRoutes = [...dynamicRoutes, ...blogCategoryRoutes];
    console.log(`Found ${blogCategoryRoutes.length} blog categories`);
  } catch (error) {
    console.log(`Warning: Could not fetch blog categories. Skipping blog categories in sitemap. \n${error.message}`);
    // Continue with other routes
  }
  
  // Courses - with memory optimization
  console.log('Fetching courses...');
  try {
    // Use pagination for courses too
    const PAGE_SIZE = 10;
    let page = 0;
    let hasMore = true;
    let courseRoutes = [];
    
    while (hasMore) {
      const courses = await prisma.course.findMany({
        select: { slug: true },
        take: PAGE_SIZE,
        skip: page * PAGE_SIZE,
      });
      
      if (courses.length === 0) {
        hasMore = false;
      } else {
        const batchRoutes = courses.map(course => `/course/${course.slug}`);
        courseRoutes = [...courseRoutes, ...batchRoutes];
        page++;
        
        // Log progress
        console.log(`Processed ${courseRoutes.length} courses so far`);
        
        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }
    }
    
    dynamicRoutes = [...dynamicRoutes, ...courseRoutes];
    console.log(`Found ${courseRoutes.length} courses`);
  } catch (error) {
    console.log(`Warning: Could not fetch courses. Skipping courses in sitemap. \n${error.message}`);
    // Continue with other routes
  }
  
  // Combine all routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  
  // Generate sitemap XML in chunks to reduce memory usage
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  // Write sitemap header
  fs.writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`);
  
  // Write routes in chunks to reduce memory usage
  const CHUNK_SIZE = 50;
  for (let i = 0; i < allRoutes.length; i += CHUNK_SIZE) {
    const chunk = allRoutes.slice(i, i + CHUNK_SIZE);
    const chunkXml = chunk.map(route => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n');
    
    // Append chunk to sitemap file
    fs.appendFileSync(sitemapPath, chunkXml + '\n');
    
    // Log progress
    console.log(`Processed sitemap chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(allRoutes.length / CHUNK_SIZE)}`);
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }
  
  // Write sitemap footer
  fs.appendFileSync(sitemapPath, '</urlset>');
  console.log(`Sitemap generated successfully at ${sitemapPath}`);
}

// Run the memory-optimized sitemap generator
generateSitemap()
  .catch(error => {
    console.error('Error generating sitemap:', error);
    // Create a minimal sitemap with just static routes to prevent build failure
    const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), staticSitemap);
    console.log('Created minimal fallback sitemap due to errors');
  })
  .finally(async () => {
    // Disconnect Prisma client to free resources
    await prisma.$disconnect();
    console.log('Sitemap generation completed');
  });
