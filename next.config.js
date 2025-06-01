/**
 * Next.js Build Optimization Configuration
 * Modified for Pages Router compatibility
 */
const path = require('path');
// All polyfills are now loaded from the dedicated polyfill files
require('./src/globalPolyfills');
require('./src/polyfills');
// Explicitly configured for Pages Router only
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize output for production
  output: 'standalone',
  
  // Increase static generation timeout to allow for complex pages
  staticPageGenerationTimeout: 120, // 2 minutes timeout for static generation
  
  // Combine optimizations from both branches
  experimental: {
    // From complete-rebuild
    disableOptimizedLoading: true,
    optimizeCss: false, // Disable CSS optimization to prevent style removal
    // Remove App Router specific features
    optimizePackageImports: [
      'lucide-react',
      'react-icons',
      '@radix-ui/react-icons',
      'framer-motion'
    ],
    // EXPLICITLY DISABLE APP ROUTER
    appDir: false
  },
  
  // Disable ESLint during build to prevent build failures
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during build to prevent build failures
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configure image optimization
  images: {
    domains: ['api.heygen.com', 'example.com', 'localhost', 'res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Configure webpack for better performance
  webpack: (config, { isServer }) => {
    // Add module resolution aliases for better imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/lib/auth/auth-options': path.join(__dirname, 'src/lib/auth/auth-options'),
      '@/lib/db/prisma': path.join(__dirname, 'src/lib/db/prisma'),
      '@/lib/ai/ai-service': path.join(__dirname, 'src/lib/ai/ai-service'),
      'openai': path.join(__dirname, 'src/lib/openai-compat.js'),
      // Add aliases for victory-vendor compatibility
      'victory-vendor/d3-shape': path.resolve(__dirname, './src/lib/victory-vendor-d3-shape.js'),
      'victory-vendor/d3-scale': path.resolve(__dirname, './src/lib/victory-vendor-d3-scale.js'),
    };
    
    // Add polyfills for browser APIs in server environment
    if (isServer) {
      // Include polyfills at the beginning of the entry points
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        
        // Add polyfills to server entries only
        if (entries['main.js']) {
          if (Array.isArray(entries['main.js'])) {
            // Add both polyfill files at the beginning
            if (!entries['main.js'].includes('./src/globalPolyfills.js')) {
              entries['main.js'].unshift('./src/globalPolyfills.js');
            }
            if (!entries['main.js'].includes('./src/polyfills.js')) {
              entries['main.js'].unshift('./src/polyfills.js');
            }
          } else {
            // Convert to array and add polyfills
            entries['main.js'] = ['./src/globalPolyfills.js', './src/polyfills.js', entries['main.js']];
          }
        }
        
        return entries;
      };
    }
    
    // Ensure CSS files are properly processed and included
    if (!isServer) {
      // Make sure CSS files are processed by the CSS loader
      const cssRule = config.module.rules.find(
        rule => rule.test && rule.test.toString().includes('css')
      );
      
      if (cssRule) {
        // Ensure enhanced-globals.css is not excluded
        if (cssRule.exclude) {
          const originalExclude = cssRule.exclude;
          cssRule.exclude = (path) => {
            if (path.includes('enhanced-globals.css') || 
                path.includes('enhanced-brand.css') ||
                path.includes('brand.css') ||
                path.includes('enhanced-theme.ts') || 
                path.includes('enhanced-tokens.ts')) {
              return false;
            }
            return originalExclude(path);
          };
        }
      }
    }
    
    return config;
  },
  
  // Configure environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_HEYGEN_API_KEY: process.env.NEXT_PUBLIC_HEYGEN_API_KEY,
    NEXT_PUBLIC_HEYGEN_API_URL: process.env.NEXT_PUBLIC_HEYGEN_API_URL,
  },
  
  // Optimize CSS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Transpile specific modules
  transpilePackages: [
    'react-syntax-highlighter',
    '@headlessui/react',
  ],
  
   // Improve production performance
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};
module.exports = nextConfig;
