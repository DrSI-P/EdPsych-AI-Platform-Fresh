'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, Clock, Calendar, User, Tag, ThumbsUp, MessageSquare, 
  Share2, Bookmark, Search, Filter, TrendingUp, Award, Lightbulb,
  BookMarked, School, GraduationCap, Users, Heart, ChevronRight,
  ArrowRight, PlusCircle, Settings, Bell, RefreshCw, FileText,
  Edit, Eye, Printer, Download, ExternalLink, BarChart2, Zap
} from 'lucide-react';

// Sample blog post data
const sampleBlogPosts = [
  {
    id: 1,
    title: "Evidence-Based Strategies for Supporting Executive Function in the Classroom",
    excerpt: "Practical approaches to help students develop organisation, time management, and self-regulation skills based on the latest research.",
    author: {
      name: "Dr. Emma Thompson",
      avatar: "/avatars/emma-thompson.jpg",
      role: "Educational Psychologist"
    },
    category: "Teaching Strategies",
    tags: ["Executive Function", "Self-Regulation", "Classroom Management"],
    publishedAt: "2025-05-15T10:30:00Z",
    readTime: 8,
    imageUrl: "/blog/executive-function-strategies.jpg",
    likes: 124,
    comments: 32,
    aiGenerated: false,
    featured: true
  },
  {
    id: 2,
    title: "The Impact of Formative Assessment on Student Metacognition",
    excerpt: "How regular, low-stakes assessment can develop students' awareness of their own learning processes and improve academic outcomes.",
    author: {
      name: "AI Education Assistant",
      avatar: "/avatars/ai-assistant.jpg",
      role: "AI Content Creator"
    },
    category: "Assessment",
    tags: ["Formative Assessment", "Metacognition", "Feedback"],
    publishedAt: "2025-05-12T14:15:00Z",
    readTime: 6,
    imageUrl: "/blog/formative-assessment.jpg",
    likes: 98,
    comments: 17,
    aiGenerated: true,
    featured: false
  },
  {
    id: 3,
    title: "Neurodiversity in the Classroom: Beyond Labels to Strengths",
    excerpt: "Moving from deficit-based approaches to strength-based support for neurodiverse learners, with practical classroom applications.",
    author: {
      name: "Sarah Williams",
      avatar: "/avatars/sarah-williams.jpg",
      role: "SENCO Specialist"
    },
    category: "Inclusive Education",
    tags: ["Neurodiversity", "Strengths-Based", "Inclusion"],
    publishedAt: "2025-05-10T09:45:00Z",
    readTime: 10,
    imageUrl: "/blog/neurodiversity-classroom.jpg",
    likes: 156,
    comments: 41,
    aiGenerated: false,
    featured: true
  },
  {
    id: 4,
    title: "Applying Cognitive Load Theory to Lesson Design",
    excerpt: "Practical strategies for optimising instruction based on how the brain processes and retains information.",
    author: {
      name: "AI Education Assistant",
      avatar: "/avatars/ai-assistant.jpg",
      role: "AI Content Creator"
    },
    category: "Lesson Planning",
    tags: ["Cognitive Load", "Instructional Design", "Memory"],
    publishedAt: "2025-05-08T11:20:00Z",
    readTime: 7,
    imageUrl: "/blog/cognitive-load-theory.jpg",
    likes: 112,
    comments: 23,
    aiGenerated: true,
    featured: false
  },
  {
    id: 5,
    title: "Building Emotional Literacy Through Literature",
    excerpt: "Using children's books and young adult fiction to develop emotional vocabulary, empathy, and self-awareness.",
    author: {
      name: "Dr. James Roberts",
      avatar: "/avatars/james-roberts.jpg",
      role: "Literacy Specialist"
    },
    category: "Social-Emotional Learning",
    tags: ["Emotional Literacy", "Literature", "Empathy"],
    publishedAt: "2025-05-05T15:30:00Z",
    readTime: 9,
    imageUrl: "/blog/emotional-literacy.jpg",
    likes: 143,
    comments: 38,
    aiGenerated: false,
    featured: false
  },
  {
    id: 6,
    title: "The Science of Effective Revision Strategies",
    excerpt: "Evidence-based approaches to help students prepare for exams, based on cognitive psychology research.",
    author: {
      name: "AI Education Assistant",
      avatar: "/avatars/ai-assistant.jpg",
      role: "AI Content Creator"
    },
    category: "Study Skills",
    tags: ["Revision", "Memory", "Exam Preparation"],
    publishedAt: "2025-05-03T13:10:00Z",
    readTime: 8,
    imageUrl: "/blog/revision-strategies.jpg",
    likes: 187,
    comments: 45,
    aiGenerated: true,
    featured: false
  }
];

// Sample categories
const categories = [
  { id: 1, name: "Teaching Strategies", count: 42 },
  { id: 2, name: "Assessment", count: 28 },
  { id: 3, name: "Inclusive Education", count: 35 },
  { id: 4, name: "Social-Emotional Learning", count: 31 },
  { id: 5, name: "Lesson Planning", count: 24 },
  { id: 6, name: "Study Skills", count: 19 },
  { id: 7, name: "Educational Technology", count: 26 },
  { id: 8, name: "Professional Development", count: 22 },
  { id: 9, name: "Research Insights", count: 17 },
  { id: 10, name: "Classroom Management", count: 29 }
];

// Sample popular tags
const popularTags = [
  { id: 1, name: "Executive Function", count: 18 },
  { id: 2, name: "Metacognition", count: 24 },
  { id: 3, name: "Inclusion", count: 32 },
  { id: 4, name: "Differentiation", count: 27 },
  { id: 5, name: "Feedback", count: 21 },
  { id: 6, name: "Self-Regulation", count: 19 },
  { id: 7, name: "Assessment", count: 35 },
  { id: 8, name: "Neurodiversity", count: 26 },
  { id: 9, name: "Literacy", count: 30 },
  { id: 10, name: "Wellbeing", count: 28 }
];

// Featured Blog Post Component
const FeaturedPost = ({ post }: { post: any }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-[300px] w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10" />
        <div className="absolute bottom-6 left-6 right-6 z-20">
          <div className="flex items-centre space-x-2 mb-2">
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {post.category}
            </Badge>
            {post.aiGenerated && (
              <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                <Zap className="mr-1 h-3 w-3" />
                AI Generated
              </Badge>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{post.title}</h2>
          <p className="text-white/80 mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-centre justify-between">
            <div className="flex items-centre space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{post.author.name}</p>
                <p className="text-xs text-white/70">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-centre space-x-4">
              <div className="flex items-centre text-white/80 text-sm">
                <Clock className="mr-1 h-4 w-4" />
                {post.readTime} min read
              </div>
              <Button variant="secondary" size="sm" className="text-xs">
                Read Article
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <img 
          src={post.imageUrl || "https://placehold.co/800x400/e2e8f0/1e293b?text=Featured+Article"} 
          alt={post.title}
          className="h-full w-full object-cover"
        />
      </div>
    </Card>
  );
};

// Blog Post Card Component
const BlogPostCard = ({ post }: { post: any }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={post.imageUrl || "https://placehold.co/400x300/e2e8f0/1e293b?text=Blog+Post"} 
          alt={post.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-3 left-3 flex space-x-2">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            {post.category}
          </Badge>
          {post.aiGenerated && (
            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
              <Zap className="mr-1 h-3 w-3" />
              AI
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="flex-grow pt-4">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-centre justify-between mt-auto">
          <div className="flex items-centre space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>
          <div className="flex items-centre text-muted-foreground text-sm">
            <Clock className="mr-1 h-4 w-4" />
            {post.readTime} min
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="flex items-centre space-x-4 text-muted-foreground">
          <div className="flex items-centre">
            <ThumbsUp className="mr-1 h-4 w-4" />
            <span className="text-sm">{post.likes}</span>
          </div>
          <div className="flex items-centre">
            <MessageSquare className="mr-1 h-4 w-4" />
            <span className="text-sm">{post.comments}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          Read More
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Category List Component
const CategoryList = ({ categories }: { categories: any[] }) => {
  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <div 
          key={category.id}
          className="flex items-centre justify-between py-2 px-3 rounded-md hover:bg-muted cursor-pointer"
        >
          <span className="font-medium">{category.name}</span>
          <Badge variant="secondary">{category.count}</Badge>
        </div>
      ))}
    </div>
  );
};

// Tag Cloud Component
const TagCloud = ({ tags }: { tags: any[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge 
          key={tag.id} 
          variant="outline"
          className="cursor-pointer hover:bg-muted"
        >
          {tag.name} ({tag.count})
        </Badge>
      ))}
    </div>
  );
};

// AI Content Generator Component
const AIContentGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  
  const handleGenerate = () => {
    if (!prompt) return;
    setGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGenerating(false);
      setPrompt("");
      // In a real implementation, this would call an API to generate content
    }, 2000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-centre">
          <Zap className="mr-2 h-5 w-5 text-purple-500" />
          AI Content Assistant
        </CardTitle>
        <CardDescription>
          Generate educational content with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="text-sm font-medium block mb-1">
              What would you like to write about?
            </label>
            <Input
              id="prompt"
              placeholder="e.g., Strategies for supporting dyslexic students in the classroom"
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Teaching strategies</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Assessment methods</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Inclusive education</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Classroom management</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          disabled={!prompt || generating}
          className="w-full"
        >
          {generating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating Content...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main Educational AI Blog Component
export function EducationalAIBlog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter featured posts
  const featuredPosts = sampleBlogPosts.filter(post => post.featured);
  
  // Filter posts based on active tab
  const filteredPosts = sampleBlogPosts.filter(post => {
    if (activeTab === "all") return true;
    if (activeTab === "ai-generated") return post.aiGenerated;
    if (activeTab === "human-authored") return !post.aiGenerated;
    return post.category.toLowerCase() === activeTab.toLowerCase();
  });
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-centre md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Educational AI Blog</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Evidence-based insights and strategies for educational excellence
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Subscribe
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>
      
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPosts.slice(0, 2).map(post => (
              <FeaturedPost key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <CategoryList categories={categories} />
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Popular Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <TagCloud tags={popularTags} />
            </CardContent>
          </Card>
          
          {/* AI Content Generator */}
          <AIContentGenerator />
        </div>
        
        {/* Main Blog Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs for filtering */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-centre justify-between">
              <TabsList>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="ai-generated">AI Generated</TabsTrigger>
                <TabsTrigger value="human-authored">Human Authored</TabsTrigger>
              </TabsList>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="comments">Most Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map(post => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="ai-generated" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map(post => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="human-authored" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map(post => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Pagination */}
          <div className="flex items-centre justify-centre mt-8">
            <div className="flex items-centre space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EducationalAIBlog;
