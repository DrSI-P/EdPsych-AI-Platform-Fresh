'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Filter, BookOpen, Calendar, Tag, 
  MessageSquare, FileText, Bookmark, Share2, 
  Download, ArrowUpRight, ChevronRight, 
  Mic, Image, Video, Users, Clock,
  ThumbsUp, Eye, BarChart, Layers,
  Headphones, Volume2, VolumeX, Settings
} from "lucide-react";

export default function SearchableVoiceLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [contentType, setContentType] = useState("all");
  const [timeRange, setTimeRange] = useState("all-time");
  const [category, setCategory] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Sample voice library data
  const voiceLibraryData = {
    recentEntries: [
      {
        id: 1,
        title: "Improving outdoor learning spaces",
        type: "feedback",
        format: "text",
        date: "May 10, 2025",
        category: "Environmental Improvements",
        tags: ["outdoor spaces", "learning environment", "nature"],
        content: "I think we should create more outdoor learning spaces with shade and seating. Being outside helps me concentrate better and makes learning more enjoyable. We could use the area near the field to create a garden classroom with plants we study in science.",
        author: "Year 8 Student",
        views: 42,
        likes: 15,
        comments: 7,
        sentiment: "positive"
      },
      {
        id: 2,
        title: "Feedback on the new timetable structure",
        type: "survey response",
        format: "text",
        date: "May 5, 2025",
        category: "Academic Enhancements",
        tags: ["timetable", "scheduling", "breaks"],
        content: "The new timetable with longer but fewer lessons is working well for me. Having 60-minute lessons instead of 45-minute ones means we can go deeper into topics without feeling rushed. I also appreciate the longer break between morning lessons - it gives me time to reset my brain.",
        author: "Year 10 Student",
        views: 38,
        likes: 22,
        comments: 5,
        sentiment: "positive"
      },
      {
        id: 3,
        title: "Concerns about lunchtime supervision",
        type: "suggestion",
        format: "audio",
        date: "April 28, 2025",
        category: "Wellbeing Indicators",
        tags: ["lunch", "supervision", "safety"],
        content: "Audio recording - 1:24",
        author: "Year 7 Student",
        views: 56,
        likes: 31,
        comments: 12,
        sentiment: "negative"
      },
      {
        id: 4,
        title: "Ideas for community service projects",
        type: "idea",
        format: "text",
        date: "April 22, 2025",
        category: "Cultural Shifts",
        tags: ["community", "service", "projects"],
        content: "I'd like to suggest we organise monthly community service projects that connect to what we're learning in class. For example, when studying ecosystems in science, we could do a river cleanup. For history, we could interview elderly residents about local history and create an archive. This would make learning more meaningful and help us contribute to our community.",
        author: "Year 9 Student",
        views: 67,
        likes: 42,
        comments: 15,
        sentiment: "positive"
      },
      {
        id: 5,
        title: "Feedback on the new assessment policy",
        type: "feedback",
        format: "video",
        date: "April 15, 2025",
        category: "Policy Influence",
        tags: ["assessment", "feedback", "grading"],
        content: "Video recording - 2:47",
        author: "Year 11 Student",
        views: 89,
        likes: 37,
        comments: 23,
        sentiment: "mixed"
      }
    ],
    popularTopics: [
      { name: "Learning Environment", count: 87 },
      { name: "Curriculum Feedback", count: 76 },
      { name: "School Policies", count: 65 },
      { name: "Wellbeing Support", count: 58 },
      { name: "Technology Use", count: 52 },
      { name: "Extra-curricular Activities", count: 49 },
      { name: "Peer Relationships", count: 43 },
      { name: "Teaching Methods", count: 41 }
    ],
    contentTypes: [
      { name: "Text", count: 342, icon: <FileText className="h-4 w-4" /> },
      { name: "Audio", count: 127, icon: <Headphones className="h-4 w-4" /> },
      { name: "Video", count: 85, icon: <Video className="h-4 w-4" /> },
      { name: "Image", count: 64, icon: <Image className="h-4 w-4" /> }
    ],
    categories: [
      { name: "Academic Enhancements", count: 156 },
      { name: "Wellbeing Indicators", count: 142 },
      { name: "Environmental Improvements", count: 118 },
      { name: "Cultural Shifts", count: 105 },
      { name: "Policy Influence", count: 97 }
    ],
    savedSearches: [
      { name: "Curriculum feedback", query: "curriculum feedback suggestions", date: "April 10, 2025" },
      { name: "Technology requests", query: "technology digital tools requests", date: "March 22, 2025" },
      { name: "Wellbeing concerns", query: "wellbeing mental health support", date: "February 15, 2025" }
    ],
    collections: [
      { name: "Outdoor Learning Spaces", count: 12, date: "April 5, 2025" },
      { name: "Assessment Feedback", count: 18, date: "March 12, 2025" },
      { name: "Lunch and Break Time", count: 15, date: "February 28, 2025" }
    ]
  };
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      // Filter based on search query (in a real implementation, this would be a backend API call)
      const results = voiceLibraryData.recentEntries.filter(entry => 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(results);
      setIsSearching(false);
      setActiveTab("results");
    }, 800);
  };
  
  // Get format icon
  const getFormatIcon = (format) => {
    switch (format) {
      case "text":
        return <FileText className="h-4 w-4" />;
      case "audio":
        return <Headphones className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Get sentiment badge colour
  const getSentimentBadgeColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      case "mixed":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-grey-100 text-grey-800";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-centre">
            <BookOpen className="mr-2 h-5 w-5" />
            Searchable Voice Library
          </CardTitle>
          <CardDescription>
            Discover, explore, and analyse student perspectives from across the school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search the voice library..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-centre"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
              
              {/* Search Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="content-type">Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger id="content-type">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="time-range">Time Range</Label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger id="time-range">
                        <SelectValue placeholder="All Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-time">All Time</SelectItem>
                        <SelectItem value="past-week">Past Week</SelectItem>
                        <SelectItem value="past-month">Past Month</SelectItem>
                        <SelectItem value="past-term">Past Term</SelectItem>
                        <SelectItem value="past-year">Past Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {voiceLibraryData.categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name.toLowerCase().replace(/\s+/g, '-')}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="sentiment">Sentiment</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="sentiment">
                        <SelectValue placeholder="All Sentiments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sentiments</SelectItem>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {/* Voice Search Option */}
              <div className="flex justify-centre">
                <Button variant="outline" className="flex items-centre">
                  <Mic className="mr-2 h-4 w-4" />
                  Search with Voice
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="search">Explore</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              {/* Explore Tab */}
              <TabsContent value="search" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Entries</CardTitle>
                        <CardDescription>
                          Latest contributions to the voice library
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {voiceLibraryData.recentEntries.map((entry) => (
                          <div key={entry.id} className="p-4 border rounded-lg space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-centre">
                                {getFormatIcon(entry.format)}
                                <h3 className="ml-2 font-medium">{entry.title}</h3>
                              </div>
                              <Badge className={getSentimentBadgeColor(entry.sentiment)}>
                                {entry.sentiment.charAt(0).toUpperCase() + entry.sentiment.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="flex space-x-2 text-sm text-muted-foreground">
                              <span>{entry.type}</span>
                              <span>•</span>
                              <span>{entry.date}</span>
                              <span>•</span>
                              <span>{entry.category}</span>
                            </div>
                            
                            <p className="text-sm">
                              {entry.content.length > 150 
                                ? `${entry.content.substring(0, 150)}...` 
                                : entry.content}
                            </p>
                            
                            <div className="flex flex-wrap gap-2">
                              {entry.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-centre pt-2">
                              <div className="text-sm text-muted-foreground">
                                {entry.author}
                              </div>
                              <div className="flex space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-centre">
                                  <Eye className="mr-1 h-3 w-3" />
                                  <span>{entry.views}</span>
                                </div>
                                <div className="flex items-centre">
                                  <ThumbsUp className="mr-1 h-3 w-3" />
                                  <span>{entry.likes}</span>
                                </div>
                                <div className="flex items-centre">
                                  <MessageSquare className="mr-1 h-3 w-3" />
                                  <span>{entry.comments}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View More Entries
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Popular Topics</CardTitle>
                        <CardDescription>
                          Most discussed subjects in the library
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {voiceLibraryData.popularTopics.map((topic, index) => (
                            <div key={index} className="flex justify-between items-centre p-2 hover:bg-muted/20 rounded-lg cursor-pointer">
                              <div className="flex items-centre">
                                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{topic.name}</span>
                              </div>
                              <Badge variant="outline">{topic.count}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Content Types</CardTitle>
                        <CardDescription>
                          Breakdown by format
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {voiceLibraryData.contentTypes.map((type, index) => (
                            <div key={index} className="flex justify-between items-centre p-2 hover:bg-muted/20 rounded-lg cursor-pointer">
                              <div className="flex items-centre">
                                {type.icon}
                                <span className="ml-2">{type.name}</span>
                              </div>
                              <Badge variant="outline">{type.count}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>
                          Areas of impact
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {voiceLibraryData.categories.map((category, index) => (
                            <div key={index} className="flex justify-between items-centre p-2 hover:bg-muted/20 rounded-lg cursor-pointer">
                              <span>{category.name}</span>
                              <Badge variant="outline">{category.count}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Results Tab */}
              <TabsContent value="results" className="space-y-6">
                {searchResults.length > 0 ? (
                  <div>
                    <div className="flex justify-between items-centre mb-4">
                      <h2 className="text-xl font-bold">Search Results</h2>
                      <div className="text-sm text-muted-foreground">
                        Found {searchResults.length} results for "{searchQuery}"
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {searchResults.map((result) => (
                        <Card key={result.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg flex items-centre">
                                  {getFormatIcon(result.format)}
                                  <span className="ml-2">{result.title}</span>
                                </CardTitle>
                                <CardDescription>
                                  {result.type} • {result.date} • {result.category}
                                </CardDescription>
                              </div>
                              <Badge className={getSentimentBadgeColor(result.sentiment)}>
                                {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p>{result.content}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
                              {result.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <div className="text-sm text-muted-foreground">
                              {result.author}
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Bookmark className="mr-2 h-4 w-4" />
                                Save
                              </Button>
                              <Button variant="outline" size="sm">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-centre py-12">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No search results yet</h3>
                    <p className="mt-2 text-muted-foreground">
                      Enter a search term above to find student voices in the library
                    </p>
                  </div>
                )}
              </TabsContent>
              
              {/* Saved Tab */}
              <TabsContent value="saved" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Saved Searches</CardTitle>
                      <CardDescription>
                        Your frequently used search queries
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {voiceLibraryData.savedSearches.map((search, index) => (
                        <div key={index} className="flex justify-between items-centre p-3 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{search.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Query: "{search.query}"
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Search className="mr-2 h-3 w-3" />
                              Run
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Manage Saved Searches
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Collections</CardTitle>
                      <CardDescription>
                        Organised groups of related voices
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {voiceLibraryData.collections.map((collection, index) => (
                        <div key={index} className="flex justify-between items-centre p-3 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{collection.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {collection.count} items • Created {collection.date}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-3 w-3" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Create New Collection
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recently Viewed</CardTitle>
                    <CardDescription>
                      Entries you've recently accessed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {voiceLibraryData.recentEntries.slice(0, 3).map((entry) => (
                        <div key={entry.id} className="flex justify-between items-centre p-3 border rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {getFormatIcon(entry.format)}
                            </div>
                            <div>
                              <h3 className="font-medium">{entry.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {entry.type} • {entry.date} • {entry.category}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Distribution</CardTitle>
                      <CardDescription>
                        Breakdown of voice library by format and category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 w-full bg-muted/20 rounded-lg flex items-centre justify-centre">
                        <div className="text-centre">
                          <BarChart className="h-10 w-10 mx-auto text-primary" />
                          <p className="mt-2 text-sm text-muted-foreground">Content Distribution Chart</p>
                          <p className="text-xs text-muted-foreground">(Visualisation placeholder)</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">By Format</h4>
                          {voiceLibraryData.contentTypes.map((type, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <div className="flex items-centre">
                                {type.icon}
                                <span className="ml-1">{type.name}</span>
                              </div>
                              <span>{Math.round(type.count / 618 * 100)}%</span>
                            </div>
                          ))}
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">By Category</h4>
                          {voiceLibraryData.categories.slice(0, 4).map((category, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{category.name.split(' ')[0]}</span>
                              <span>{Math.round(category.count / 618 * 100)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Sentiment Analysis</CardTitle>
                      <CardDescription>
                        Emotional tone of student contributions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 w-full bg-muted/20 rounded-lg flex items-centre justify-centre">
                        <div className="text-centre">
                          <BarChart className="h-10 w-10 mx-auto text-primary" />
                          <p className="mt-2 text-sm text-muted-foreground">Sentiment Analysis Chart</p>
                          <p className="text-xs text-muted-foreground">(Visualisation placeholder)</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Positive</span>
                            <span className="text-sm font-medium">58%</span>
                          </div>
                          <div className="w-full bg-grey-200 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '58%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Negative</span>
                            <span className="text-sm font-medium">22%</span>
                          </div>
                          <div className="w-full bg-grey-200 rounded-full h-2.5">
                            <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '22%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Mixed</span>
                            <span className="text-sm font-medium">20%</span>
                          </div>
                          <div className="w-full bg-grey-200 rounded-full h-2.5">
                            <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Trending Topics Over Time</CardTitle>
                    <CardDescription>
                      How discussion topics have evolved
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full bg-muted/20 rounded-lg flex items-centre justify-centre">
                      <div className="text-centre">
                        <Layers className="h-10 w-10 mx-auto text-primary" />
                        <p className="mt-2 text-sm text-muted-foreground">Topic Trend Analysis</p>
                        <p className="text-xs text-muted-foreground">(Visualisation placeholder)</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Rising topics: </span>
                        Technology Use, Wellbeing Support
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Declining topics: </span>
                        Uniform Policy, Homework Structure
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Export Analytics Report
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Volume2 className="mr-2 h-4 w-4" />
              Text-to-Speech
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Accessibility Settings
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Total entries: 618 • Last updated: May 17, 2025
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
