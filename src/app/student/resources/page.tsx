'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  Download,
  Bookmark,
  Star,
  Filter,
  ChevronRight,
  ChevronLeft,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  // Mock data for resources
  const resources = [
    {
      id: 1,
      title: 'Maths Revision Guide',
      description: 'A comprehensive guide covering all Year 7 maths topics with practice questions and worked examples.',
      type: 'document',
      subject: 'maths',
      yearGroup: 'Year 7',
      rating: 4.8,
      downloads: 1245,
      thumbnail: '/images/resources/maths-guide.jpg'
    },
    {
      id: 2,
      title: 'English Writing Tips',
      description: 'Learn how to structure essays, use literary techniques, and develop your writing style for better marks.',
      type: 'document',
      subject: 'english',
      yearGroup: 'Year 7',
      rating: 4.6,
      downloads: 987,
      thumbnail: '/images/resources/english-tips.jpg'
    },
    {
      id: 3,
      title: 'Science Experiments',
      description: 'Watch and interact with science experiments covering key Year 7 topics in biology, chemistry and physics.',
      type: 'video',
      subject: 'science',
      yearGroup: 'Year 7',
      rating: 4.9,
      downloads: 1567,
      thumbnail: '/images/resources/science-experiments.jpg'
    },
    {
      id: 4,
      title: 'Algebra Interactive Lessons',
      description: 'Interactive lessons on algebraic expressions, equations, and formulas with practice exercises.',
      type: 'interactive',
      subject: 'maths',
      yearGroup: 'Year 7',
      rating: 4.7,
      downloads: 876,
      thumbnail: '/images/resources/algebra-lessons.jpg'
    },
    {
      id: 5,
      title: 'Poetry Analysis Guide',
      description: 'Learn how to analyse poetry with examples from famous poems and step-by-step guidance.',
      type: 'document',
      subject: 'english',
      yearGroup: 'Year 7',
      rating: 4.5,
      downloads: 723,
      thumbnail: '/images/resources/poetry-guide.jpg'
    },
    {
      id: 6,
      title: 'Forces and Motion Videos',
      description: 'A series of videos explaining forces, motion, and Newton\'s laws with real-world examples.',
      type: 'video',
      subject: 'science',
      yearGroup: 'Year 7',
      rating: 4.8,
      downloads: 1089,
      thumbnail: '/images/resources/forces-videos.jpg'
    },
    {
      id: 7,
      title: 'Fractions and Decimals Workbook',
      description: 'Printable workbook with exercises on fractions, decimals, and percentages with answer key.',
      type: 'document',
      subject: 'maths',
      yearGroup: 'Year 7',
      rating: 4.6,
      downloads: 932,
      thumbnail: '/images/resources/fractions-workbook.jpg'
    },
    {
      id: 8,
      title: 'Creative Writing Prompts',
      description: 'A collection of creative writing prompts and exercises to improve your storytelling skills.',
      type: 'interactive',
      subject: 'english',
      yearGroup: 'Year 7',
      rating: 4.7,
      downloads: 845,
      thumbnail: '/images/resources/writing-prompts.jpg'
    },
    {
      id: 9,
      title: 'Cells and Organisms Interactive',
      description: 'Interactive exploration of cells, tissues, organs, and organisms with 3D models.',
      type: 'interactive',
      subject: 'science',
      yearGroup: 'Year 7',
      rating: 4.9,
      downloads: 1234,
      thumbnail: '/images/resources/cells-interactive.jpg'
    }
  ];

  // Filter resources based on search query, category, and subject
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.type === selectedCategory;
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    
    return matchesSearch && matchesCategory && matchesSubject;
  });

  // Get resource type icon
  const getResourceTypeIcon = (type) => {
    switch(type) {
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'interactive':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Learning Resources</h1>
        <p className="text-muted-foreground text-lg">
          Explore our collection of educational resources to support your learning journey.
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8"
      >
        <Card className="card card-bordered hover:shadow-md transition-shadow">
          <CardContent className="card-body p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input input-bordered w-full"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="all">All Types</option>
                    <option value="document">Documents</option>
                    <option value="video">Videos</option>
                    <option value="interactive">Interactive</option>
                  </select>
                </div>
                
                <div>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="all">All Subjects</option>
                    <option value="maths">Mathematics</option>
                    <option value="english">English</option>
                    <option value="science">Science</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resources Tabs */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="tabs-list mb-6">
          <TabsTrigger value="all" className="tab">All Resources</TabsTrigger>
          <TabsTrigger value="recommended" className="tab">Recommended</TabsTrigger>
          <TabsTrigger value="popular" className="tab">Most Popular</TabsTrigger>
          <TabsTrigger value="saved" className="tab">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="tab-content">
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <ResourceCard key={resource.id} resource={resource} index={index} getResourceTypeIcon={getResourceTypeIcon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No resources found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4 btn btn-outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedSubject('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommended" className="tab-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources
              .filter(r => r.rating >= 4.7)
              .slice(0, 6)
              .map((resource, index) => (
                <ResourceCard key={resource.id} resource={resource} index={index} getResourceTypeIcon={getResourceTypeIcon} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="tab-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 6)
              .map((resource, index) => (
                <ResourceCard key={resource.id} resource={resource} index={index} getResourceTypeIcon={getResourceTypeIcon} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="tab-content">
          <div className="text-center py-12">
            <p className="text-muted-foreground">You haven't saved any resources yet.</p>
            <p className="text-muted-foreground mt-2">
              Click the bookmark icon on any resource to save it for later.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI-Generated Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12"
      >
        <Card className="card card-bordered bg-primary/5 hover:shadow-md transition-shadow">
          <CardHeader className="card-header">
            <CardTitle className="card-title flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
              AI-Generated Learning Resources
            </CardTitle>
            <CardDescription className="card-description">
              Create personalised learning materials tailored to your specific needs
            </CardDescription>
          </CardHeader>
          <CardContent className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card card-bordered hover:shadow-md transition-shadow">
                <CardHeader className="card-header pb-2">
                  <CardTitle className="card-title text-lg">Practice Questions</CardTitle>
                </CardHeader>
                <CardContent className="card-body">
                  <p className="text-sm text-muted-foreground">
                    Generate custom practice questions for any topic you're studying, with adjustable difficulty levels.
                  </p>
                </CardContent>
                <CardFooter className="card-footer pt-0">
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/student/ai-resources/practice">
                      Generate Questions
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="card card-bordered hover:shadow-md transition-shadow">
                <CardHeader className="card-header pb-2">
                  <CardTitle className="card-title text-lg">Study Notes</CardTitle>
                </CardHeader>
                <CardContent className="card-body">
                  <p className="text-sm text-muted-foreground">
                    Create condensed study notes on any curriculum topic, formatted to match your learning style.
                  </p>
                </CardContent>
                <CardFooter className="card-footer pt-0">
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/student/ai-resources/notes">
                      Generate Notes
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="card card-bordered hover:shadow-md transition-shadow">
                <CardHeader className="card-header pb-2">
                  <CardTitle className="card-title text-lg">Explanations</CardTitle>
                </CardHeader>
                <CardContent className="card-body">
                  <p className="text-sm text-muted-foreground">
                    Get simple explanations for complex topics, using examples and analogies that make sense to you.
                  </p>
                </CardContent>
                <CardFooter className="card-footer pt-0">
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/student/ai-resources/explain">
                      Get Explanations
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Voice Input Feature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="card card-bordered bg-muted/30 hover:shadow-md transition-shadow">
          <CardContent className="card-body p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6 flex-grow">
                <h3 className="text-xl font-semibold mb-2">Need help finding resources?</h3>
                <p className="text-muted-foreground">
                  Use our voice search feature to find resources by speaking. Just click the button and ask for what you need.
                </p>
              </div>
              <Button size="lg" className="btn btn-lg btn-primary whitespace-nowrap" asChild>
                <Link href="/speech-recognition?redirect=/student/resources">
                  Try Voice Search
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" className="btn btn-outline" asChild>
          <Link href="/student/learning-path">
            <ChevronLeft className="mr-2 h-4 w-4" /> Learning Path
          </Link>
        </Button>
        <Button variant="outline" className="btn btn-outline" asChild>
          <Link href="/student/dashboard">
            Back to Dashboard <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Resource Card Component
function ResourceCard({ resource, index, getResourceTypeIcon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
    >
      <Card className="card card-bordered hover:shadow-md transition-shadow h-full flex flex-col">
        <CardHeader className="card-header pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="card-title text-lg">{resource.title}</CardTitle>
            <Bookmark className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
          </div>
          <CardDescription className="card-description flex items-center">
            <Badge variant="outline" className="mr-2 badge badge-outline">
              {resource.subject.charAt(0).toUpperCase() + resource.subject.slice(1)}
            </Badge>
            <Badge variant="outline" className="badge badge-outline">
              {resource.yearGroup}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="card-body flex-grow">
          <p className="text-sm text-muted-foreground mb-4">
            {resource.description}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              {getResourceTypeIcon(resource.type)}
              <span className="ml-1 capitalize">{resource.type}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-500 mr-1" />
              <span>{resource.rating}</span>
              <span className="mx-2">•</span>
              <Download className="h-4 w-4 mr-1" />
              <span>{resource.downloads}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="card-footer">
          <Button className="w-full btn btn-primary" asChild>
            <Link href={`/student/resources/${resource.id}`}>
              View Resource
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
