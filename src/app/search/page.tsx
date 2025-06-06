'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import MainNavigation from '@/components/navigation/main-navigation';
import { 
  Search,
  BookOpen,
  Users,
  Brain,
  Target,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  Filter,
  Clock,
  Star
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Comprehensive feature database for search
  const allFeatures = [
    {
      id: 1,
      title: "Learning Analytics",
      description: "Comprehensive tracking of student learning progress across all subjects and skills",
      category: "Analytics",
      path: "/learning-analytics",
      keywords: ["analytics", "progress", "tracking", "data", "insights", "performance"]
    },
    {
      id: 2,
      title: "AI-Powered Tools",
      description: "Intelligent tutoring system that adapts to individual learning styles",
      category: "AI",
      path: "/ai-powered-tools",
      keywords: ["ai", "artificial intelligence", "smart", "adaptive", "personalized", "intelligent"]
    },
    {
      id: 3,
      title: "Student Dashboard",
      description: "Personalized dashboard for students to track their learning journey",
      category: "Student",
      path: "/student/dashboard",
      keywords: ["student", "dashboard", "personal", "journey", "overview"]
    },
    {
      id: 4,
      title: "Educator Dashboard",
      description: "Comprehensive tools for educators to manage classrooms and track student progress",
      category: "Educator",
      path: "/innovations/educator-dashboard",
      keywords: ["educator", "teacher", "classroom", "management", "tools"]
    },
    {
      id: 5,
      title: "Speech-to-Text",
      description: "Advanced speech recognition technology for accessibility and voice input",
      category: "Accessibility",
      path: "/accessibility/speech-to-text",
      keywords: ["speech", "voice", "accessibility", "recognition", "input", "audio"]
    },
    {
      id: 6,
      title: "Ask Dr. Scott",
      description: "Get expert guidance from Dr. Scott I-Patrick, Chartered Educational Psychologist",
      category: "Support",
      path: "/meet-dr-scott",
      keywords: ["dr scott", "expert", "guidance", "psychologist", "help", "questions"]
    },
    {
      id: 7,
      title: "Special Needs Support",
      description: "Comprehensive tools and resources for supporting students with special educational needs",
      category: "Special Needs",
      path: "/special-needs",
      keywords: ["special needs", "send", "support", "disabilities", "inclusive", "accessibility"]
    },
    {
      id: 8,
      title: "Restorative Justice",
      description: "Building relationships and understanding through restorative practices",
      category: "Restorative",
      path: "/restorative-justice",
      keywords: ["restorative", "justice", "relationships", "community", "healing", "conflict"]
    },
    {
      id: 9,
      title: "Assessment Tools",
      description: "Comprehensive assessment and evaluation systems for measuring learning outcomes",
      category: "Assessment",
      path: "/assessment",
      keywords: ["assessment", "evaluation", "testing", "outcomes", "measurement", "progress"]
    },
    {
      id: 10,
      title: "Curriculum Planning",
      description: "Evidence-based curriculum design aligned with UK Department for Education standards",
      category: "Curriculum",
      path: "/curriculum-planning",
      keywords: ["curriculum", "planning", "design", "standards", "education", "uk"]
    },
    {
      id: 11,
      title: "Parent Portal",
      description: "Dedicated portal for parents to track their child's progress and communicate with educators",
      category: "Parent",
      path: "/parent-portal",
      keywords: ["parent", "portal", "communication", "progress", "family", "involvement"]
    },
    {
      id: 12,
      title: "Professional Development",
      description: "Training and development resources for educational professionals",
      category: "Professional",
      path: "/professional-development",
      keywords: ["professional", "development", "training", "education", "skills", "growth"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Analytics', name: 'Analytics' },
    { id: 'AI', name: 'AI Tools' },
    { id: 'Student', name: 'Student Features' },
    { id: 'Educator', name: 'Educator Tools' },
    { id: 'Accessibility', name: 'Accessibility' },
    { id: 'Special Needs', name: 'Special Needs' },
    { id: 'Assessment', name: 'Assessment' },
    { id: 'Support', name: 'Support' }
  ];

  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    }
  }, [searchTerm, selectedCategory]);

  const performSearch = (term: string) => {
    setIsLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = allFeatures.filter(feature => {
        const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
        const matchesSearch = 
          feature.title.toLowerCase().includes(term.toLowerCase()) ||
          feature.description.toLowerCase().includes(term.toLowerCase()) ||
          feature.keywords.some(keyword => keyword.toLowerCase().includes(term.toLowerCase()));
        
        return matchesCategory && matchesSearch;
      });
      
      setSearchResults(results);
      setIsLoading(false);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      performSearch(searchTerm);
    }
  };

  const popularSearches = [
    "learning analytics",
    "ai tools",
    "student dashboard",
    "speech to text",
    "special needs",
    "assessment",
    "dr scott",
    "restorative justice"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <MainNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Search Platform Features</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Discover the comprehensive educational psychology tools and resources available on EdPsych Connect.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for features, tools, or resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-lg shadow-lg"
                />
                <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                <Button 
                  type="submit"
                  className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Searches */}
              <Card className="border-0 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Popular Searches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => {
                          setSearchTerm(search);
                          performSearch(search);
                        }}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:w-3/4">
              {searchTerm && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Search Results for "{searchTerm}"
                  </h2>
                  <p className="text-gray-600">
                    {isLoading ? 'Searching...' : `Found ${searchResults.length} results`}
                  </p>
                </div>
              )}

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-0 shadow-lg animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-6">
                  {searchResults.map((result) => (
                    <Card key={result.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">{result.title}</h3>
                              <Badge variant="outline">{result.category}</Badge>
                            </div>
                            <p className="text-gray-600 mb-4">{result.description}</p>
                            <div className="flex items-center gap-4">
                              <Button
                                onClick={() => window.location.href = result.path}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              >
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Explore Feature
                              </Button>
                              <span className="text-sm text-gray-500">{result.path}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : searchTerm ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms or browse our popular features below.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {popularSearches.slice(0, 4).map((search, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => {
                            setSearchTerm(search);
                            performSearch(search);
                          }}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Search</h3>
                    <p className="text-gray-600 mb-6">
                      Enter a search term above to discover EdPsych Connect's comprehensive features and tools.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {popularSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => {
                            setSearchTerm(search);
                            performSearch(search);
                          }}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}

