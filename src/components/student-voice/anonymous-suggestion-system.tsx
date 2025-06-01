'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, ThumbsUp, ThumbsDown, Send, RefreshCw, User, UserPlus, Users, Lock, Unlock } from 'lucide-react';

// Mock data for suggestion categories
const suggestionCategories = [
  { id: 'learning', label: 'Learning Experience' },
  { id: 'teaching', label: 'Teaching Methods' },
  { id: 'curriculum', label: 'Curriculum Content' },
  { id: 'environment', label: 'Learning Environment' },
  { id: 'resources', label: 'Resources & Materials' },
  { id: 'support', label: 'Support & Help' },
  { id: 'wellbeing', label: 'Wellbeing & Inclusion' },
  { id: 'other', label: 'Other' }
];

// Mock data for year groups
const yearGroups = [
  'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
];

// Interface for suggestion
interface Suggestion {
  id: string;
  category: string;
  title: string;
  content: string;
  yearGroup?: string;
  status: 'pending' | 'reviewing' | 'implemented' | 'declined';
  visibility: 'private' | 'public';
  votes: {
    up: number;
    down: number;
  };
  responses: {
    id: string;
    content: string;
    fromStaff: boolean;
    createdAt: string;
  }[];
  createdAt: string;
}

export default function AnonymousSuggestionSystem() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('submit');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVisibility, setSelectedVisibility] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Suggestion form state
  const [suggestionForm, setSuggestionForm] = useState({
    category: '',
    title: '',
    content: '',
    yearGroup: '',
    visibility: 'private'
  });
  
  // Response form state
  const [responseForm, setResponseForm] = useState({
    suggestionId: '',
    content: ''
  });
  
  // Load mock data on component mount
  React.useEffect(() => {
    // Mock suggestions
    const mockSuggestions: any[] = [
      {
        id: '1',
        category: 'environment',
        title: 'Quiet reading area in the classroom',
        content: 'It would be helpful to have a designated quiet area in the classroom for reading or working independently. Sometimes it\'s hard to concentrate with all the noise.',
        yearGroup: 'Year 5',
        status: 'implemented',
        visibility: 'public',
        votes: {
          up: 15,
          down: 2
        },
        responses: [
          {
            id: '1-1',
            content: 'Thank you for your suggestion! We\'ve created a reading corner with cushions and a small bookshelf in the back of the classroom.',
            fromStaff: true,
            createdAt: '2025-05-10T14:30:00Z'
          }
        ],
        createdAt: '2025-05-08T09:15:00Z'
      },
      {
        id: '2',
        category: 'curriculum',
        title: 'More practical science experiments',
        content: 'I think we should do more hands-on science experiments instead of just reading from textbooks. It would make the lessons more interesting and help us understand the concepts better.',
        yearGroup: 'Year 8',
        status: 'reviewing',
        visibility: 'public',
        votes: {
          up: 23,
          down: 1
        },
        responses: [
          {
            id: '2-1',
            content: 'I agree! Practical experiments are much more fun and help me remember what we learn.',
            fromStaff: false,
            createdAt: '2025-05-12T10:45:00Z'
          },
          {
            id: '2-2',
            content: 'We\'re currently reviewing this suggestion and looking at ways to incorporate more practical work into our science curriculum. Thank you for your input!',
            fromStaff: true,
            createdAt: '2025-05-13T16:20:00Z'
          }
        ],
        createdAt: '2025-05-12T08:30:00Z'
      },
      {
        id: '3',
        category: 'support',
        title: 'Homework help club',
        content: 'Could we start an after-school homework club where students can get help from teachers or older students? Sometimes I struggle with homework and don\'t have anyone to ask at home.',
        yearGroup: 'Year 7',
        status: 'pending',
        visibility: 'private',
        votes: {
          up: 8,
          down: 0
        },
        responses: [],
        createdAt: '2025-05-14T15:45:00Z'
      }
    ];
    
    setSuggestions(mockSuggestions);
    setFilteredSuggestions(mockSuggestions);
  }, []);
  
  // Filter suggestions based on selected filters and search term
  React.useEffect(() => {
    let filtered = [...suggestions];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(suggestion => suggestion.category === selectedCategory);
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(suggestion => suggestion.status === selectedStatus);
    }
    
    // Filter by visibility
    if (selectedVisibility !== 'all') {
      filtered = filtered.filter(suggestion => suggestion.visibility === selectedVisibility);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(suggestion => 
        suggestion.title.toLowerCase().includes(term) || 
        suggestion.content.toLowerCase().includes(term)
      );
    }
    
    setFilteredSuggestions(filtered);
  }, [suggestions, selectedCategory, selectedStatus, selectedVisibility, searchTerm]);
  
  // Handle suggestion form change
  const handleSuggestionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSuggestionForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle visibility change
  const handleVisibilityChange = (visibility: 'private' | 'public') => {
    setSuggestionForm(prev => ({ ...prev, visibility }));
  };
  
  // Handle response form change
  const handleResponseFormChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponseForm(prev => ({ ...prev, content: e.target.value }));
  };
  
  // Handle suggestion submission
  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!suggestionForm.category) {
      toast({
        title: "Category required",
        description: "Please select a category for your suggestion.",
        variant: "destructive"
      });
      return;
    }
    
    if (!suggestionForm.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your suggestion.",
        variant: "destructive"
      });
      return;
    }
    
    if (!suggestionForm.content.trim()) {
      toast({
        title: "Content required",
        description: "Please provide details for your suggestion.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, this would send the suggestion to an API
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Create a new suggestion
      const newSuggestion: Suggestion = {
        id: Date.now().toString(),
        category: suggestionForm.category,
        title: suggestionForm.title,
        content: suggestionForm.content,
        yearGroup: suggestionForm.yearGroup || undefined,
        status: 'pending',
        visibility: suggestionForm.visibility as 'private' | 'public',
        votes: {
          up: 0,
          down: 0
        },
        responses: [],
        createdAt: new Date().toISOString()
      };
      
      // Add to suggestions
      setSuggestions(prev => [newSuggestion, ...prev]);
      
      // Reset form
      setSuggestionForm({
        category: '',
        title: '',
        content: '',
        yearGroup: '',
        visibility: 'private'
      });
      
      setIsLoading(false);
      
      toast({
        title: "Suggestion submitted",
        description: "Thank you for your suggestion! It has been submitted anonymously.",
      });
      
      // Switch to browse tab
      setActiveTab('browse');
    }, 1500);
  };
  
  // Handle response submission
  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!responseForm.content.trim()) {
      toast({
        title: "Response required",
        description: "Please provide a response.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, this would send the response to an API
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Create a new response
      const newResponse = {
        id: Date.now().toString(),
        content: responseForm.content,
        fromStaff: false,
        createdAt: new Date().toISOString()
      };
      
      // Add response to the suggestion
      setSuggestions(prev => 
        prev.map(suggestion => {
          if (suggestion.id === responseForm.suggestionId) {
            return {
              ...suggestion,
              responses: [...suggestion.responses, newResponse]
            };
          }
          return suggestion;
        })
      );
      
      // Reset form
      setResponseForm({
        suggestionId: '',
        content: ''
      });
      
      setIsLoading(false);
      
      toast({
        title: "Response submitted",
        description: "Your response has been added to the suggestion.",
      });
    }, 1000);
  };
  
  // Handle voting
  const handleVote = (suggestionId: string, voteType: 'up' | 'down') => {
    setSuggestions(prev => 
      prev.map(suggestion => {
        if (suggestion.id === suggestionId) {
          return {
            ...suggestion,
            votes: {
              ...suggestion.votes,
              [voteType]: suggestion.votes[voteType] + 1
            }
          };
        }
        return suggestion;
      })
    );
    
    toast({
      title: "Vote recorded",
      description: `You ${voteType === 'up' ? 'upvoted' : 'downvoted'} this suggestion.`,
    });
  };
  
  // Set up response form for a suggestion
  const setupResponseForm = (suggestionId: string) => {
    setResponseForm({
      suggestionId,
      content: ''
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Get status badge
  const getStatusBadge = (status: Suggestion['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'reviewing':
        return <Badge variant="secondary">Reviewing</Badge>;
      case 'implemented':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Implemented</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Anonymous Suggestion System</h1>
      <p className="text-muted-foreground mb-6">
        Share your ideas and suggestions anonymously to help improve our school
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="submit">Submit Suggestion</TabsTrigger>
          <TabsTrigger value="browse">Browse Suggestions</TabsTrigger>
        </TabsList>
        
        {/* Submit Suggestion Tab */}
        <TabsContent value="submit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Ideas</CardTitle>
              <CardDescription>
                Your suggestions are anonymous and help make our school better
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitSuggestion} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={suggestionForm.category} 
                      onValueChange={(value) => setSuggestionForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {suggestionCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="yearGroup">Year Group (Optional)</Label>
                    <Select 
                      value={suggestionForm.yearGroup} 
                      onValueChange={(value) => setSuggestionForm(prev => ({ ...prev, yearGroup: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not specified</SelectItem>
                        {yearGroups.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="title">Suggestion Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={suggestionForm.title}
                    onChange={handleSuggestionFormChange}
                    placeholder="Enter a brief title for your suggestion"
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Suggestion Details</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={suggestionForm.content}
                    onChange={handleSuggestionFormChange}
                    placeholder="Describe your suggestion in detail..."
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant={suggestionForm.visibility === 'private' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleVisibilityChange('private')}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Private
                      </Button>
                      <Button
                        type="button"
                        variant={suggestionForm.visibility === 'public' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleVisibilityChange('public')}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Public
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {suggestionForm.visibility === 'private' 
                        ? 'Only staff can see this suggestion' 
                        : 'All students and staff can see this suggestion'}
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmitSuggestion} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Suggestion
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Browse Suggestions Tab */}
        <TabsContent value="browse" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Browse Suggestions</CardTitle>
              <CardDescription>
                View and respond to suggestions from the school community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search suggestions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                </div>
                
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {suggestionCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={selectedStatus} 
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="implemented">Implemented</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={selectedVisibility} 
                  onValueChange={setSelectedVisibility}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Visibility</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {filteredSuggestions.length === 0 ? (
                <div className="text-center py-10 border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">No suggestions found matching your criteria</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSuggestions.map(suggestion => (
                    <Card key={suggestion.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {suggestionCategories.find(c => c.id === suggestion.category) && (
                                <Badge variant="outline">
                                  {suggestionCategories.find(c => c.id === suggestion.category)?.label}
                                </Badge>
                              )}
                              {suggestion.yearGroup && (
                                <Badge variant="outline">{suggestion.yearGroup}</Badge>
                              )}
                              {getStatusBadge(suggestion.status)}
                              <Badge variant="outline" className="flex items-center gap-1">
                                {suggestion.visibility === 'private' ? (
                                  <Lock className="h-3 w-3" />
                                ) : (
                                  <Unlock className="h-3 w-3" />
                                )}
                                {suggestion.visibility === 'private' ? 'Private' : 'Public'}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(suggestion.createdAt)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="whitespace-pre-line">{suggestion.content}</p>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center text-green-600"
                              onClick={() => handleVote(suggestion.id, 'up')}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {suggestion.votes.up}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center text-red-600"
                              onClick={() => handleVote(suggestion.id, 'down')}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              {suggestion.votes.down}
                            </Button>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {suggestion.responses.length} {suggestion.responses.length === 1 ? 'response' : 'responses'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      
                      {suggestion.responses.length > 0 && (
                        <div className="px-6 py-3 bg-muted/20 border-t">
                          <h4 className="text-sm font-medium mb-2">Responses</h4>
                          <div className="space-y-3">
                            {suggestion.responses.map(response => (
                              <div key={response.id} className="flex gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  {response.fromStaff ? (
                                    <UserPlus className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <User className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div className="font-medium text-sm">
                                      {response.fromStaff ? 'Staff Member' : 'Anonymous Student'}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {formatDate(response.createdAt)}
                                    </div>
                                  </div>
                                  <p className="text-sm mt-1">{response.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <CardFooter className="pt-3 pb-4">
                        {responseForm.suggestionId === suggestion.id ? (
                          <form onSubmit={handleSubmitResponse} className="w-full space-y-3">
                            <Textarea
                              placeholder="Write your response..."
                              value={responseForm.content}
                              onChange={handleResponseFormChange}
                              className="min-h-[80px]"
                            />
                            <div className="flex justify-end space-x-2">
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => setResponseForm({ suggestionId: '', content: '' })}
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="submit"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Submit Response
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setupResponseForm(suggestion.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Response
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
