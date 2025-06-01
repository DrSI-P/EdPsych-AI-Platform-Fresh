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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Users, 
  Calendar, 
  Clock, 
  Star, 
  Award, 
  BookOpen, 
  FileText, 
  Settings, 
  Plus, 
  X, 
  Check, 
  ArrowLeft, 
  Share2, 
  UserPlus, 
  Bell, 
  Lock, 
  Globe, 
  Shield, 
  Bookmark, 
  MoreHorizontal 
} from "lucide-react";

// Sample data for demonstration
const MOCK_RECOMMENDED_MENTORS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Senior Educational Psychologist",
    school: "Oakwood Academy",
    experience: 15,
    specialties: ["ADHD", "Dyslexia", "Behavior Management"],
    rating: 4.9,
    reviews: 27,
    availability: "Available for new mentees",
    matchScore: 95,
    matchReasons: [
      "Specializes in your areas of interest",
      "Similar teaching philosophy",
      "Experience with your student age group"
    ],
    avatar: "/avatars/mentor1.jpg"
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    role: "Educational Psychology Researcher",
    school: "University of Cambridge",
    experience: 20,
    specialties: ["Assessment", "Research Methods", "Cognitive Development"],
    rating: 4.8,
    reviews: 34,
    availability: "Limited availability (1 slot)",
    matchScore: 87,
    matchReasons: [
      "Research focus aligns with your interests",
      "Published in areas you're developing",
      "Strong academic background"
    ],
    avatar: "/avatars/mentor2.jpg"
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Lead School Psychologist",
    school: "Riverside School District",
    experience: 12,
    specialties: ["Trauma-Informed Practice", "Family Systems", "Early Intervention"],
    rating: 4.7,
    reviews: 19,
    availability: "Available for new mentees",
    matchScore: 82,
    matchReasons: [
      "Experience in your school setting",
      "Complementary skill set to yours",
      "Strong practical focus"
    ],
    avatar: "/avatars/mentor3.jpg"
  }
];

const MOCK_RECOMMENDED_MENTEES = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Early Career Educational Psychologist",
    school: "Hillside Elementary",
    experience: 2,
    interests: ["ADHD", "Classroom Interventions", "Assessment"],
    goals: "Develop expertise in neurodevelopmental assessments",
    availability: "Weekly meetings preferred",
    matchScore: 91,
    matchReasons: [
      "Interests align with your expertise",
      "Seeking guidance in your specialty areas",
      "Compatible scheduling preferences"
    ],
    avatar: "/avatars/mentee1.jpg"
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "School Psychology Trainee",
    school: "University of Manchester",
    experience: 1,
    interests: ["Autism", "Evidence-Based Interventions", "Consultation Skills"],
    goals: "Bridge research-practice gap in school settings",
    availability: "Flexible schedule",
    matchScore: 88,
    matchReasons: [
      "Research interests complement your practical experience",
      "Eager to learn in your areas of expertise",
      "Strong academic foundation"
    ],
    avatar: "/avatars/mentee2.jpg"
  },
  {
    id: 3,
    name: "James Wilson",
    role: "Newly Qualified Educational Psychologist",
    school: "Westfield Comprehensive",
    experience: 3,
    interests: ["Adolescent Mental Health", "Group Interventions", "Staff Training"],
    goals: "Develop confidence in delivering staff training",
    availability: "Evenings and weekends",
    matchScore: 85,
    matchReasons: [
      "Working in similar school setting",
      "Seeking to develop skills you excel in",
      "Complementary professional background"
    ],
    avatar: "/avatars/mentee3.jpg"
  }
];

export default function MentorMatchingDashboard() {
  const [profileType, setProfileType] = useState('mentor');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecommendations, setFilteredRecommendations] = useState(
    profileType === 'mentee' ? MOCK_RECOMMENDED_MENTORS : MOCK_RECOMMENDED_MENTEES
  );
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize recommendations based on profile type
  useEffect(() => {
    setFilteredRecommendations(
      profileType === 'mentee' ? MOCK_RECOMMENDED_MENTORS : MOCK_RECOMMENDED_MENTEES
    );
  }, [profileType]);

  // Filter recommendations based on search
  useEffect(() => {
    const recommendations = profileType === 'mentee' ? MOCK_RECOMMENDED_MENTORS : MOCK_RECOMMENDED_MENTEES;
    
    if (!searchQuery) {
      setFilteredRecommendations(recommendations);
      return;
    }
    
    const filtered = recommendations.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.matchReasons.some(reason => reason.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredRecommendations(filtered);
  }, [searchQuery, profileType]);

  // Handle profile type change
  const handleProfileTypeChange = (type) => {
    setProfileType(type);
    // In a real implementation, this would load the appropriate data
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentor Matching Dashboard</h1>
          <p className="text-muted-foreground">
            Connect with mentors or mentees to grow professionally
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={profileType} onValueChange={handleProfileTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select profile type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mentor">I want to be a Mentor</SelectItem>
              <SelectItem value="mentee">I want to find a Mentor</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {profileType === 'mentee' ? 'Recommended Mentors' : 'Potential Mentees'}
                </CardTitle>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, role, or interests..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <CardDescription>
                {profileType === 'mentee' 
                  ? 'Mentors matched to your professional goals and interests' 
                  : 'Educational psychologists seeking your mentorship'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecommendations.map((person) => (
                  <Card key={person.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={person.avatar} alt={person.name} />
                          <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold">{person.name}</h3>
                              <p className="text-sm text-muted-foreground">{person.role} • {person.school}</p>
                            </div>
                            <Badge variant="outline" className="h-fit">
                              {person.matchScore}% Match
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {(person.specialties || person.interests || []).slice(0, 3).map((item, i) => (
                              <Badge key={i} variant="secondary">{item}</Badge>
                            ))}
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Why we matched:</p>
                            <ul className="text-sm space-y-1">
                              {person.matchReasons.map((reason, i) => (
                                <li key={i} className="flex items-start">
                                  <Check className="h-4 w-4 mr-1 text-green-500 shrink-0 mt-0.5" />
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm font-medium">{person.rating}</span>
                              <span className="text-sm text-muted-foreground ml-1">({person.reviews} reviews)</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                              <Button size="sm">
                                {profileType === 'mentee' ? (
                                  <>
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Request Mentorship
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-1" />
                                    Accept as Mentee
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredRecommendations.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No matches found. Try adjusting your search or preferences.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View More Recommendations
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Mentorship Profile</CardTitle>
              <CardDescription>
                {profileType === 'mentee' 
                  ? 'Complete your profile to find better mentor matches' 
                  : 'Update your profile to attract suitable mentees'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/avatars/user.jpg" alt="Your profile" />
                  <AvatarFallback>YP</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Your Name</h3>
                  <p className="text-sm text-muted-foreground">Educational Psychologist • Your School</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile Completeness</span>
                  <span>75%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Complete these items:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-muted-foreground">Basic information</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-muted-foreground">Professional experience</span>
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 mr-2 text-red-500" />
                    <span>Upload profile photo</span>
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 mr-2 text-red-500" />
                    <span>Add mentorship preferences</span>
                  </li>
                </ul>
              </div>
              
              <Button className="w-full">
                Complete Your Profile
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {profileType === 'mentee' ? 'Your Mentor' : 'Your Mentees'}
              </CardTitle>
              <CardDescription>
                {profileType === 'mentee' 
                  ? 'Current mentorship relationship' 
                  : 'Educational psychologists you are mentoring'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profileType === 'mentee' ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have a mentor yet.</p>
                  <Button variant="outline">Find a Mentor</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/avatars/mentee1.jpg" alt="Alex Rivera" />
                      <AvatarFallback>AR</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">Alex Rivera</h4>
                      <p className="text-sm text-muted-foreground">Since April 2025</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add More Mentees
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Scheduled mentorship meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-muted p-2 rounded-md">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Initial Consultation</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>May 30, 2025</span>
                      <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                      <span>15:00 - 16:00</span>
                    </div>
                    <p className="text-sm mt-1">
                      {profileType === 'mentee' 
                        ? 'Meeting with Dr. Sarah Johnson' 
                        : 'Meeting with Alex Rivera'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Schedule Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
