'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MainNavigation from '@/components/navigation/main-navigation';
import { 
  Search,
  BookOpen,
  Users,
  Brain,
  Heart,
  Target,
  Lightbulb,
  FileText,
  Video,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock search data - in a real app, this would come from an API
  const searchData = [
    {
      id: 1,
      title: "Learning Analytics Dashboard",
      description: "Comprehensive analytics and insights for tracking student progress, attendance trends, and curriculum completion.",
      category: "analytics",
      type: "feature",
      url: "/learning-analytics",
      tags: ["analytics", "progress", "tracking", "dashboard"]
    },
    {
      id: 2,
      title: "AI-Powered Assessment Tools",
      description: "Advanced algorithms that personalise education to each student's unique needs and learning style.",
      category: "ai",
      type: "feature",
      url: "/ai-powered-tools",
      tags: ["ai", "assessment", "personalised", "learning"]
    },
    {
      id: 3,
      title: "Student Portal",
      description: "Dedicated portal for students to access learning materials, track progress, and communicate with educators.",
      category: "portal",
      type: "feature",
      url: "/student-portal",
      tags: ["student", "portal", "learning", "materials"]
    },
    {
      id: 4,
      title: "Educator Platform",
      description: "Comprehensive tools for educators to manage classrooms, create content, and monitor student progress.",
      category: "educator",
      type: "feature",
      url: "/educator-platform",
      tags: ["educator", "classroom", "management", "tools"]
    },
    {
      id: 5,
      title: "Ask Dr. Scott",
      description: "Get expert guidance from Dr. Scott I-Patrick, Chartered Educational Psychologist with over 20 years of experience.",
      category: "support",
      type: "service",
      url: "/meet-dr-scott",
      tags: ["expert", "guidance", "psychology", "support"]
    },
    {
      id: 6,
      title: "Accessibility Features",
      description: "Comprehensive accessibility tools including voice navigation, screen reader support, and learning disability assistance.",
      category: "accessibility",
      type: "feature",
      url: "/accessibility",
      tags: ["accessibility", "voice", "screen reader", "disability"]
    },
    {
      id: 7,
      title: "About Our Team",
      description: "Meet the passionate minds behind EdPsych Connect, dedicated to transforming education through psychology and technology.",
      category: "about",
      type: "page",
      url: "/about/team",
      tags: ["team", "about", "psychology", "education"]
    },
    {
      id: 8,
      title: "Contact Us",
      description: "Get in touch with our team for support, partnerships, or general enquiries about the EdPsych Connect platform.",
      category: "contact",
      type: "page",
      url: "/contact",
      tags: ["contact", "support", "enquiries", "help"]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Results', icon: Search },
    { id: 'analytics', label: 'Analytics', icon: Target },
    { id: 'ai', label: 'AI Tools', icon: Brain },
    { id: 'portal', label: 'Portals', icon: Users },
    { id: 'support', label: 'Support', icon: MessageCircle },
    { id: 'accessibility', label: 'Accessibility', icon: Heart },
    { id: 'about', label: 'About', icon: FileText }
  ];

  // Perform search
  const performSearch = (query: string, category: string = 'all') => {
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      let results = searchData;
      
      // Filter by category
      if (category !== 'all') {
        results = results.filter(item => item.category === category);
      }
      
      // Filter by search query
      if (query.trim()) {
        const searchTerms = query.toLowerCase().split(' ');
        results = results.filter(item => {
          const searchableText = `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase();
          return searchTerms.some(term => searchableText.includes(term));
        });
      }
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery, selectedCategory);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    performSearch(searchQuery, category);
  };

  // Initial load - show all results
  useEffect(() => {
    performSearch('', 'all');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <MainNavigation />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Search EdPsych Connect</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Find features, tools, resources, and information across our comprehensive educational psychology platform.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for features, tools, resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-3 text-lg border-0 bg-white/90 backdrop-blur-sm"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 px-8"
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'All Features & Resources'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                </p>
              </div>
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                              <a href={result.url}>{result.title}</a>
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{result.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {result.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={result.url} className="flex items-center space-x-1">
                            <span>View</span>
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or browse by category.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    performSearch('', 'all');
                  }}>
                    Show All Results
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

