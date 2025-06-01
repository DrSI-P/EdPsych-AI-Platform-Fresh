'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter, 
  Download, 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  Star, 
  StarHalf, 
  Printer, 
  Share2, 
  Bookmark, 
  Heart 
} from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

// Activity type definitions
type ActivityCategory = 'ice-breaker' | 'team-building' | 'circle' | 'check-in' | 'celebration' | 'reflection' | 'conflict-resolution';
type AgeGroup = 'early-years' | 'primary' | 'secondary' | 'all-ages';
type TimeRequired = 'under-15' | '15-30' | '30-60' | 'over-60';
type GroupSize = 'small' | 'medium' | 'large' | 'any';

interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  ageGroups: string[];
  timeRequired: TimeRequired;
  groupSize: GroupSize;
  materials: string[];
  steps: string[];
  variations: string[];
  objectives: string[];
  facilitation_tips: string[];
  evidence_base: string;
  rating: number;
  favorites: number;
}

// Sample activities data
const sampleActivities: Activity[] = [
  {
    id: '1',
    title: 'Community Circle: Hopes and Dreams',
    description: 'A structured circle activity where participants share their hopes and dreams for the future, building connection and understanding.',
    category: 'circle',
    ageGroups: ['primary', 'secondary'],
    timeRequired: '15-30',
    groupSize: 'any',
    materials: ['Talking piece', 'Circle guidelines poster', 'Optional: visual prompts'],
    steps: [
      'Arrange seats in a circle with no barriers',
      'Introduce circle guidelines (respect, one voice, speak from heart, listen from heart)',
      'Begin with a simple check-in question',
      'Introduce the talking piece and its significance',
      'Share the prompt: "One hope or dream I have for the future is..."',
      'Model by sharing your own response first',
      'Pass the talking piece clockwise',
      'Allow participants to pass if they wish',
      'After everyone has had a turn, invite reflections on what was shared',
      'Close with a unity statement or gesture'
    ],
    variations: [
      'For younger children: "One thing I want to be when I grow up"',
      'For older students: "One way I hope to make a difference in the world"',
      'Add drawing component before verbal sharing',
      'Create a visual representation of shared hopes and dreams'
    ],
    objectives: [
      'Build community through shared aspirations',
      'Practise active listening skills',
      'Develop empathy and understanding',
      'Create a positive classroom culture'
    ],
    facilitation_tips: [
      'Ensure all voices are heard and respected',
      'Acknowledge contributions positively',
      'Be prepared to manage emotional responses',
      'Adapt language for different age groups',
      'Consider cultural sensitivities'
    ],
    evidence_base: 'Based on Indigenous circle practices and restorative approaches. Research shows regular community circles improve classroom climate and reduce behaviour incidents (Riestenberg, 2012).',
    rating: 4.8,
    favorites: 156
  },
  {
    id: '2',
    title: 'Human Knot',
    description: 'A collaborative problem-solving activity that requires communication, teamwork, and physical cooperation to untangle a human knot.',
    category: 'team-building',
    ageGroups: ['primary', 'secondary'],
    timeRequired: 'under-15',
    groupSize: 'medium',
    materials: ['Open space', 'Optional: reflection questions'],
    steps: [
      'Form a circle standing shoulder to shoulder',
      'Each person reaches across to hold hands with two different people (not adjacent)',
      'Without letting go of hands, the group must untangle themselves',
      'The goal is to end in a circle or multiple circles',
      'Encourage communication and problem-solving throughout',
      'If the knot cannot be untangled, allow one strategic disconnect and reconnect',
      'After completion, facilitate reflection on the process'
    ],
    variations: [
      'Silent version: No talking allowed during untangling',
      'Leader version: One person gives instructions but cannot physically help',
      'Split into multiple smaller groups and race',
      'Add reflection on how this relates to community problem-solving'
    ],
    objectives: [
      'Develop non-verbal communication skills',
      'Practise collaborative problem-solving',
      'Build trust and positive physical interaction',
      'Experience interdependence and cooperation'
    ],
    facilitation_tips: [
      'Consider physical abilities and comfort levels',
      'Ensure appropriate physical boundaries',
      'Be ready to offer hints if group gets stuck',
      'Connect the activity to classroom challenges',
      'Focus on process over outcome'
    ],
    evidence_base: 'Cooperative games like Human Knot have been shown to increase prosocial behaviour and improve group cohesion (Orlick, 2006).',
    rating: 4.5,
    favorites: 124
  },
  {
    id: '3',
    title: 'Appreciation Web',
    description: 'A reflective activity where participants create a visual web of appreciation and connection using a ball of yarn.',
    category: 'celebration',
    ageGroups: ['early-years', 'primary', 'secondary', 'all-ages'],
    timeRequired: '15-30',
    groupSize: 'any',
    materials: ['Ball of yarn or string', 'Optional: reflection cards'],
    steps: [
      'Arrange participants in a circle, seated or standing',
      'Explain that the group will create a web of appreciation',
      'Start with the ball of yarn and share an appreciation about someone in the circle',
      'While holding the end of the yarn, toss or roll the ball to that person',
      'That person shares an appreciation about someone else, holds onto the yarn, and passes the ball',
      'Continue until everyone has received at least one appreciation',
      'When complete, ask the group to notice the web they\'ve created',
      'Facilitate a discussion about connections and community',
      'Carefully lower the web to the ground or collect the yarn'
    ],
    variations: [
      'Theme the appreciations (e.g., helpfulness, creativity, kindness)',
      'For younger children: "I like when you..."',
      'For older students: "Something I admire about you is..."',
      'Take a photo of the completed web as a visual reminder',
      'Create a permanent display representing the web'
    ],
    objectives: [
      'Practise giving and receiving positive feedback',
      'Visualise community connections',
      'Build a positive classroom culture',
      'Develop gratitude and appreciation skills'
    ],
    facilitation_tips: [
      'Ensure everyone receives at least one appreciation',
      'Model specific, genuine appreciations',
      'For younger children, have sentence starters ready',
      'Be prepared to support students who struggle to receive positive feedback',
      'Connect the visual web to community interdependence'
    ],
    evidence_base: 'Regular appreciation activities have been linked to improved classroom climate and reduced bullying behaviors (Fredrickson & Losada, 2005).',
    rating: 4.9,
    favorites: 187
  }
];

// Main component
const CommunityBuildingActivities = () => {
  // State management
  const [activities, setActivities] = useState<Activity[]>(sampleActivities);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(sampleActivities);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ActivityCategory | 'all'>('all');
  const [ageFilter, setAgeFilter] = useState<AgeGroup | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState<TimeRequired | 'all'>('all');
  const [sizeFilter, setSizeFilter] = useState<GroupSize | 'all'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filter activities based on search and filters
  useEffect(() => {
    let result = activities;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(activity => 
        activity.title.toLowerCase().includes(query) || 
        activity.description.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(activity => activity.category === categoryFilter);
    }
    
    // Apply age filter
    if (ageFilter !== 'all') {
      result = result.filter(activity => activity.ageGroups.includes(ageFilter));
    }
    
    // Apply time filter
    if (timeFilter !== 'all') {
      result = result.filter(activity => activity.timeRequired === timeFilter);
    }
    
    // Apply size filter
    if (sizeFilter !== 'all') {
      result = result.filter(activity => activity.groupSize === sizeFilter);
    }
    
    setFilteredActivities(result);
  }, [activities, searchQuery, categoryFilter, ageFilter, timeFilter, sizeFilter]);

  // Handle activity selection
  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  // Handle favourite toggle
  const handleToggleFavorite = (activityId: string) => {
    if (favorites.includes(activityId)) {
      setFavorites(favorites.filter(id => id !== activityId));
      toast({
        title: "Removed from favorites",
        description: "Activity removed from your favorites",
      });
    } else {
      setFavorites([...favorites, activityId]);
      toast({
        title: "Added to favorites",
        description: "Activity added to your favorites",
      });
    }
  };

  // Handle print activity
  const handlePrintActivity = () => {
    if (!selectedActivity) return;
    
    // Create printable version
    const printContent = `
      <html>
        <head>
          <title>${selectedActivity.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2563eb; }
            h2 { color: #4b5563; margin-top: 20px; }
            ul { margin-bottom: 15px; }
            .header { border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 20px; }
            .footer { border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 20px; font-size: 0.8em; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${selectedActivity.title}</h1>
            <p>${selectedActivity.description}</p>
          </div>
          
          <h2>Activity Details</h2>
          <p><strong>Category:</strong> ${selectedActivity.category}</p>
          <p><strong>Age Groups:</strong> ${selectedActivity.ageGroups.join(', ')}</p>
          <p><strong>Time Required:</strong> ${selectedActivity.timeRequired}</p>
          <p><strong>Group Size:</strong> ${selectedActivity.groupSize}</p>
          
          <h2>Materials Needed</h2>
          <ul>
            ${selectedActivity.materials.map(item => `<li>${item}</li>`).join('')}
          </ul>
          
          <h2>Steps</h2>
          <ol>
            ${selectedActivity.steps.map(step => `<li>${step}</li>`).join('')}
          </ol>
          
          <h2>Variations</h2>
          <ul>
            ${selectedActivity.variations.map(variation => `<li>${variation}</li>`).join('')}
          </ul>
          
          <h2>Learning Objectives</h2>
          <ul>
            ${selectedActivity.objectives.map(objective => `<li>${objective}</li>`).join('')}
          </ul>
          
          <h2>Facilitation Tips</h2>
          <ul>
            ${selectedActivity.facilitation_tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
          
          <h2>Evidence Base</h2>
          <p>${selectedActivity.evidence_base}</p>
          
          <div class="footer">
            <p>From EdPsych Connect - Community Building Activities</p>
            <p>Printed on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      toast({
        title: "Print Error",
        description: "Unable to open print window. Please check your popup settings.",
        variant: "destructive"
      });
    }
  };

  // Render category badge
  const renderCategoryBadge = (category: ActivityCategory) => {
    const categoryStyles: Record<ActivityCategory, { color: string, bg: string }> = {
      'ice-breaker': { color: 'text-blue-700', bg: 'bg-blue-100' },
      'team-building': { color: 'text-green-700', bg: 'bg-green-100' },
      'circle': { color: 'text-purple-700', bg: 'bg-purple-100' },
      'check-in': { color: 'text-yellow-700', bg: 'bg-yellow-100' },
      'celebration': { color: 'text-pink-700', bg: 'bg-pink-100' },
      'reflection': { color: 'text-indigo-700', bg: 'bg-indigo-100' },
      'conflict-resolution': { color: 'text-orange-700', bg: 'bg-orange-100' }
    };
    
    const style = categoryStyles[category];
    return (
      <Badge className={`${style.bg} ${style.colour} hover:${style.bg}`}>
        {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  };

  // Format time required for display
  const formatTimeRequired = (time: TimeRequired) => {
    switch (time) {
      case 'under-15': return 'Under 15 minutes';
      case '15-30': return '15-30 minutes';
      case '30-60': return '30-60 minutes';
      case 'over-60': return 'Over 60 minutes';
    }
  };

  // Format group size for display
  const formatGroupSize = (size: GroupSize) => {
    switch (size) {
      case 'small': return 'Small (2-10)';
      case 'medium': return 'Medium (10-20)';
      case 'large': return 'Large (20+)';
      case 'any': return 'Any size';
    }
  };

  // Format age groups for display
  const formatAgeGroups = (ages: AgeGroup[]) => {
    const ageMap: Record<AgeGroup, string> = {
      'early-years': 'Early Years (3-5)',
      'primary': 'Primary (5-11)',
      'secondary': 'Secondary (11-18)',
      'all-ages': 'All Ages'
    };
    
    return ages.map(age => ageMap[age]).join(', ');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Building Activities</h1>
          <p className="text-muted-foreground mt-2">
            Evidence-based activities to build and strengthen community relationships in educational settings.
          </p>
        </div>
        
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Activities</TabsTrigger>
            <TabsTrigger value="favorites">My Favorites</TabsTrigger>
            <TabsTrigger value="about">About & Resources</TabsTrigger>
          </TabsList>
          
          {/* Browse Activities Tab */}
          <TabsContent value="browse" className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search activities..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Activity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ice-breaker">Ice Breaker</SelectItem>
                    <SelectItem value="team-building">Team Building</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="check-in">Check-In</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                    <SelectItem value="reflection">Reflection</SelectItem>
                    <SelectItem value="conflict-resolution">Conflict Resolution</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={ageFilter} onValueChange={(value) => setAgeFilter(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <Users className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Age Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="early-years">Early Years (3-5)</SelectItem>
                    <SelectItem value="primary">Primary (5-11)</SelectItem>
                    <SelectItem value="secondary">Secondary (11-18)</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Time Required" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Time</SelectItem>
                    <SelectItem value="under-15">Under 15 minutes</SelectItem>
                    <SelectItem value="15-30">15-30 minutes</SelectItem>
                    <SelectItem value="30-60">30-60 minutes</SelectItem>
                    <SelectItem value="over-60">Over 60 minutes</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sizeFilter} onValueChange={(value) => setSizeFilter(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <Users className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Group Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Size</SelectItem>
                    <SelectItem value="small">Small (2-10)</SelectItem>
                    <SelectItem value="medium">Medium (10-20)</SelectItem>
                    <SelectItem value="large">Large (20+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Activity List and Detail View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Activity List */}
              <div className="md:col-span-1 space-y-4">
                <h2 className="text-xl font-semibold">
                  Activities ({filteredActivities.length})
                </h2>
                
                {filteredActivities.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-centre text-muted-foreground">No activities match your filters</p>
                    </CardContent>
                  </Card>
                ) : (
                  <ScrollArea className="h-[600px] rounded-md border">
                    <div className="p-4 space-y-4">
                      {filteredActivities.map((activity) => (
                        <Card 
                          key={activity.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${selectedActivity?.id === activity.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => handleSelectActivity(activity)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{activity.title}</CardTitle>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(activity.id);
                                }}
                              >
                                <Heart 
                                  className={`h-5 w-5 ${favorites.includes(activity.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                                />
                              </Button>
                            </div>
                            <div className="flex items-centre space-x-1 mt-1">
                              {activity.rating >= 4.5 ? (
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              )}
                              <span className="text-sm text-muted-foreground">{activity.rating}</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {renderCategoryBadge(activity.category)}
                              <Badge variant="outline">{formatTimeRequired(activity.timeRequired)}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {activity.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
              
              {/* Activity Detail */}
              <div className="md:col-span-2">
                {selectedActivity ? (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl">{selectedActivity.title}</CardTitle>
                          <div className="flex items-centre space-x-1 mt-1">
                            {selectedActivity.rating >= 4.5 ? (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            )}
                            <span className="text-sm text-muted-foreground">{selectedActivity.rating} ({selectedActivity.favorites} favorites)</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePrintActivity()}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleToggleFavorite(selectedActivity.id)}
                          >
                            <Heart 
                              className={`h-4 w-4 ${favorites.includes(selectedActivity.id) ? 'fill-red-500 text-red-500' : ''}`} 
                            />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="mt-2">
                        {selectedActivity.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Activity Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium mb-2">Activity Details</h3>
                          <div className="space-y-2">
                            <div className="flex items-centre">
                              <div className="w-32 text-muted-foreground">Category:</div>
                              <div>{renderCategoryBadge(selectedActivity.category)}</div>
                            </div>
                            <div className="flex items-centre">
                              <div className="w-32 text-muted-foreground">Age Groups:</div>
                              <div>{formatAgeGroups(selectedActivity.ageGroups)}</div>
                            </div>
                            <div className="flex items-centre">
                              <div className="w-32 text-muted-foreground">Time Required:</div>
                              <div>{formatTimeRequired(selectedActivity.timeRequired)}</div>
                            </div>
                            <div className="flex items-centre">
                              <div className="w-32 text-muted-foreground">Group Size:</div>
                              <div>{formatGroupSize(selectedActivity.groupSize)}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Materials Needed</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedActivity.materials.map((material, index) => (
                              <li key={index}>{material}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Steps */}
                      <div>
                        <h3 className="font-medium mb-2">Steps</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                          {selectedActivity.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      
                      <Separator />
                      
                      {/* Variations and Objectives */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-2">Variations</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedActivity.variations.map((variation, index) => (
                              <li key={index}>{variation}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Learning Objectives</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedActivity.objectives.map((objective, index) => (
                              <li key={index}>{objective}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Facilitation Tips */}
                      <div>
                        <h3 className="font-medium mb-2">Facilitation Tips</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedActivity.facilitation_tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      {/* Evidence Base */}
                      <div>
                        <h3 className="font-medium mb-2">Evidence Base</h3>
                        <p className="text-muted-foreground">{selectedActivity.evidence_base}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setSelectedActivity(null)}>
                        Back to List
                      </Button>
                      <Button onClick={() => handlePrintActivity()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Activity
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-centre justify-centre p-12">
                      <Users className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">Select an Activity</h3>
                      <p className="text-centre text-muted-foreground">
                        Choose an activity from the list to view its details, steps, and resources.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>My Favourite Activities</CardTitle>
                <CardDescription>
                  Activities you've saved for quick access
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-centre py-8">
                    <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Save your favourite activities for quick access
                    </p>
                    <Button variant="outline" onClick={() => document.querySelector('[data-value="browse"]')?.click()}>
                      Browse Activities
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activities
                      .filter(activity => favorites.includes(activity.id))
                      .map(activity => (
                        <Card key={activity.id} className="cursor-pointer hover:shadow-md">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-lg">{activity.title}</CardTitle>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleFavorite(activity.id)}
                              >
                                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {renderCategoryBadge(activity.category)}
                              <Badge variant="outline">{formatTimeRequired(activity.timeRequired)}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {activity.description}
                            </p>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                setSelectedActivity(activity);
                                document.querySelector('[data-value="browse"]')?.click();
                              }}
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* About & Resources Tab */}
          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>About Community Building Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Community building activities are essential tools for creating positive, supportive educational environments where all students feel valued, connected, and engaged. These activities help establish the foundation for restorative practices by developing relationships, trust, and shared values within the classroom or school community.
                  </p>
                  <p>
                    The activities in this collection are designed to align with restorative justice principles and evidence-based educational psychology practices. They support the development of key social-emotional skills including empathy, communication, cooperation, and conflict resolution.
                  </p>
                  <p>
                    Regular implementation of these activities helps create the conditions where restorative approaches can flourish, reducing behaviour incidents and improving academic outcomes by fostering a sense of belonging and mutual respect.
                  </p>
                  
                  <h3 className="text-lg font-medium mt-6">Key Benefits</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Builds Trust and Safety:</strong> Creates environments where students feel safe to express themselves and take risks in their learning.
                    </li>
                    <li>
                      <strong>Develops Belonging:</strong> Fosters a sense of connection and inclusion that supports student wellbeing and engagement.
                    </li>
                    <li>
                      <strong>Improves Communication:</strong> Develops effective communication skills through structured, supportive interactions.
                    </li>
                    <li>
                      <strong>Prevents Conflict:</strong> Proactively builds relationships that reduce the likelihood of harmful behaviors.
                    </li>
                    <li>
                      <strong>Supports Restorative Practices:</strong> Creates the relational foundation necessary for effective restorative interventions when needed.
                    </li>
                  </ul>
                  
                  <h3 className="text-lg font-medium mt-6">Implementation Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Consistency:</strong> Schedule regular community building time (daily, weekly) rather than only using activities reactively.
                    </li>
                    <li>
                      <strong>Progression:</strong> Begin with simple activities and gradually introduce more complex ones as trust develops.
                    </li>
                    <li>
                      <strong>Inclusivity:</strong> Ensure activities are accessible to all students, with adaptations as needed.
                    </li>
                    <li>
                      <strong>Reflection:</strong> Include time for reflection to deepen learning and connection to classroom values.
                    </li>
                    <li>
                      <strong>Modelling:</strong> Participate authentically in activities alongside students to model vulnerability and engagement.
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Evidence Base</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      The activities in this collection are grounded in research from multiple fields:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Restorative Justice in Education</li>
                      <li>Social-Emotional Learning</li>
                      <li>Positive Behaviour Interventions and Supports</li>
                      <li>Trauma-Informed Practices</li>
                      <li>Cooperative Learning</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      Key references include works by Belinda Hopkins, Kay Pranis, Tom Cavanagh, Dorothy Vaandering, and research from the International Institute for Restorative Practices.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li>
                        <a href="#" className="flex items-centre text-primary hover:underline">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Circle Forward: Building a Restorative School Community
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-centre text-primary hover:underline">
                          <BookOpen className="mr-2 h-4 w-4" />
                          The Restorative Practices Handbook
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-centre text-primary hover:underline">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Better Than Carrots or Sticks
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-centre text-primary hover:underline">
                          <Download className="mr-2 h-4 w-4" />
                          Printable Activity Cards (PDF)
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-centre text-primary hover:underline">
                          <Download className="mr-2 h-4 w-4" />
                          Implementation Guide (PDF)
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityBuildingActivities;
