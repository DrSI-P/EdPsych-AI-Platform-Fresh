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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Award, 
  School, 
  GraduationCap, 
  Target, 
  Compass, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  Edit, 
  Download, 
  ExternalLink, 
  BarChart2, 
  PieChart, 
  LineChart, 
  Loader2,
  Lock,
  LockOpen,
  Eye,
  EyeOff,
  Share2,
  Globe,
  Shield,
  UserPlus,
  Settings,
  Bell,
  Bookmark,
  Star,
  Heart,
  ThumbsUp,
  MessageCircle,
  Send,
  Image,
  Link,
  Paperclip,
  Trash2,
  MoreHorizontal,
  Tag,
  Hash,
  Zap,
  TrendingUp,
  Lightbulb,
  Sparkles,
  Puzzle,
  Layers,
  FolderPlus,
  RefreshCw,
  UserCheck,
  Building,
  Briefcase,
  Activity
} from "lucide-react";

// Mock data for development
const MOCK_COMMUNITIES = [
  {
    id: 1,
    name: "Early Years Literacy Development",
    description: "A community focused on evidence-based approaches to early literacy development and phonics teaching.",
    members: 128,
    schools: 42,
    privacy: "open",
    categories: ["Early Years", "Literacy", "Phonics"],
    activity: "high",
    featured: true,
    image: ""
  },
  {
    id: 2,
    name: "Secondary Mathematics Teaching",
    description: "Collaboration on innovative approaches to teaching mathematics in secondary schools, with focus on problem-solving and real-world applications.",
    members: 96,
    schools: 31,
    privacy: "open",
    categories: ["Secondary", "Mathematics", "Problem-solving"],
    activity: "medium",
    featured: true,
    image: ""
  },
  {
    id: 3,
    name: "SEND Coordination Network",
    description: "A professional network for SENDCOs to share best practices, resources, and support strategies for inclusive education.",
    members: 154,
    schools: 67,
    privacy: "restricted",
    categories: ["SEND", "Inclusion", "Coordination"],
    activity: "high",
    featured: false,
    image: ""
  },
  {
    id: 4,
    name: "School Leadership Innovation",
    description: "Senior leaders collaborating on strategic approaches to school improvement, staff development, and educational innovation.",
    members: 82,
    schools: 45,
    privacy: "restricted",
    categories: ["Leadership", "Strategy", "Innovation"],
    activity: "medium",
    featured: false,
    image: ""
  },
  {
    id: 5,
    name: "Behaviour Management Strategies",
    description: "Sharing effective approaches to positive behaviour management, restorative practise, and creating supportive learning environments.",
    members: 112,
    schools: 38,
    privacy: "open",
    categories: ["Behaviour", "Restorative Practise", "Classroom Management"],
    activity: "high",
    featured: true,
    image: ""
  },
  {
    id: 6,
    name: "Educational Technology Integration",
    description: "Exploring effective uses of technology to enhance teaching and learning across the curriculum.",
    members: 103,
    schools: 29,
    privacy: "open",
    categories: ["EdTech", "Digital Learning", "Innovation"],
    activity: "high",
    featured: false,
    image: ""
  },
  {
    id: 7,
    name: "Assessment for Learning",
    description: "Developing effective formative assessment strategies and feedback approaches to support student progress.",
    members: 89,
    schools: 33,
    privacy: "open",
    categories: ["Assessment", "Feedback", "Progress"],
    activity: "medium",
    featured: false,
    image: ""
  },
  {
    id: 8,
    name: "Curriculum Design Collaborative",
    description: "Collaborative approach to curriculum development, sequencing, and implementation across schools.",
    members: 76,
    schools: 28,
    privacy: "restricted",
    categories: ["Curriculum", "Planning", "Sequencing"],
    activity: "medium",
    featured: false,
    image: ""
  }
];

const MOCK_MY_COMMUNITIES = [
  {
    id: 1,
    name: "Early Years Literacy Development",
    role: "Member",
    unread: 12,
    lastActivity: "2 hours ago"
  },
  {
    id: 3,
    name: "SEND Coordination Network",
    role: "Facilitator",
    unread: 5,
    lastActivity: "1 day ago"
  },
  {
    id: 5,
    name: "Behaviour Management Strategies",
    role: "Member",
    unread: 0,
    lastActivity: "3 days ago"
  }
];

const MOCK_DISCUSSIONS = [
  {
    id: 1,
    title: "Effective phonics interventions for struggling readers",
    author: {
      name: "Sarah Johnson",
      role: "Literacy Lead",
      school: "Oakwood Primary",
      avatar: ""
    },
    date: "2 hours ago",
    replies: 18,
    views: 142,
    lastReply: "15 minutes ago",
    pinned: true,
    tags: ["Phonics", "Intervention", "Reading"]
  },
  {
    id: 2,
    title: "Implementing synthetic phonics across EYFS and KS1",
    author: {
      name: "Michael Chen",
      role: "Early Years Teacher",
      school: "Riverside Academy",
      avatar: ""
    },
    date: "1 day ago",
    replies: 24,
    views: 198,
    lastReply: "3 hours ago",
    pinned: false,
    tags: ["Synthetic Phonics", "EYFS", "Implementation"]
  },
  {
    id: 3,
    title: "Balancing phonics and whole language approaches",
    author: {
      name: "Emma Thompson",
      role: "English Coordinator",
      school: "Meadowview School",
      avatar: ""
    },
    date: "3 days ago",
    replies: 32,
    views: 256,
    lastReply: "Yesterday",
    pinned: false,
    tags: ["Balanced Literacy", "Teaching Approaches", "Research"]
  },
  {
    id: 4,
    title: "Phonics assessment tools and tracking progress",
    author: {
      name: "David Wilson",
      role: "Assessment Lead",
      school: "St. Mary's Primary",
      avatar: ""
    },
    date: "5 days ago",
    replies: 15,
    views: 178,
    lastReply: "2 days ago",
    pinned: false,
    tags: ["Assessment", "Tracking", "Progress"]
  },
  {
    id: 5,
    title: "Supporting EAL learners with phonics instruction",
    author: {
      name: "Priya Patel",
      role: "EAL Specialist",
      school: "Highfield Primary",
      avatar: ""
    },
    date: "1 week ago",
    replies: 27,
    views: 215,
    lastReply: "4 days ago",
    pinned: false,
    tags: ["EAL", "Differentiation", "Support Strategies"]
  }
];

const MOCK_RESOURCES = [
  {
    id: 1,
    title: "Systematic Synthetic Phonics Teaching Guide",
    type: "PDF Guide",
    author: {
      name: "Dr. Sarah Johnson",
      school: "Oakwood Primary"
    },
    downloads: 156,
    rating: 4.8,
    reviews: 32,
    date: "2 months ago",
    featured: true,
    tags: ["Phonics", "Teaching Guide", "Systematic"]
  },
  {
    id: 2,
    title: "Phonics Assessment Toolkit",
    type: "Resource Pack",
    author: {
      name: "David Wilson",
      school: "St. Mary's Primary"
    },
    downloads: 124,
    rating: 4.6,
    reviews: 28,
    date: "3 months ago",
    featured: true,
    tags: ["Assessment", "Toolkit", "Tracking"]
  },
  {
    id: 3,
    title: "Early Reading Intervention Strategies",
    type: "Presentation",
    author: {
      name: "Emma Thompson",
      school: "Meadowview School"
    },
    downloads: 98,
    rating: 4.5,
    reviews: 21,
    date: "1 month ago",
    featured: false,
    tags: ["Intervention", "Early Reading", "Strategies"]
  },
  {
    id: 4,
    title: "Phonics Games and Activities Collection",
    type: "Interactive Resources",
    author: {
      name: "Michael Chen",
      school: "Riverside Academy"
    },
    downloads: 187,
    rating: 4.9,
    reviews: 45,
    date: "2 weeks ago",
    featured: true,
    tags: ["Games", "Activities", "Engagement"]
  },
  {
    id: 5,
    title: "Differentiated Phonics Planning Templates",
    type: "Editable Templates",
    author: {
      name: "Priya Patel",
      school: "Highfield Primary"
    },
    downloads: 112,
    rating: 4.7,
    reviews: 19,
    date: "1 month ago",
    featured: false,
    tags: ["Planning", "Differentiation", "Templates"]
  },
  {
    id: 6,
    title: "Research Summary: Effective Phonics Teaching",
    type: "Research Brief",
    author: {
      name: "Dr. James Wilson",
      school: "University of Education"
    },
    downloads: 76,
    rating: 4.4,
    reviews: 12,
    date: "4 months ago",
    featured: false,
    tags: ["Research", "Evidence-based", "Summary"]
  }
];

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Phonics Teaching Masterclass",
    type: "Workshop",
    date: "15 June 2025",
    time: "16:00 - 17:30",
    location: "Online",
    host: {
      name: "Sarah Johnson",
      school: "Oakwood Primary"
    },
    attendees: 42,
    capacity: 50,
    description: "An interactive workshop exploring effective techniques for teaching systematic synthetic phonics."
  },
  {
    id: 2,
    title: "Early Reading Research Discussion",
    type: "Discussion",
    date: "22 June 2025",
    time: "17:00 - 18:00",
    location: "Online",
    host: {
      name: "Dr. James Wilson",
      school: "University of Education"
    },
    attendees: 28,
    capacity: 40,
    description: "A discussion of recent research findings on early reading development and implications for classroom practise."
  },
  {
    id: 3,
    title: "Phonics Resources Showcase",
    type: "Showcase",
    date: "5 July 2025",
    time: "16:30 - 18:00",
    location: "Online",
    host: {
      name: "Michael Chen",
      school: "Riverside Academy"
    },
    attendees: 35,
    capacity: 60,
    description: "Community members share their most effective phonics teaching resources and explain implementation strategies."
  }
];

const MOCK_COLLABORATIONS = [
  {
    id: 1,
    title: "Phonics Assessment Framework Development",
    type: "Resource Creation",
    schools: ["Oakwood Primary", "St. Mary's Primary", "Riverside Academy"],
    members: 8,
    status: "In Progress",
    progress: 65,
    dueDate: "30 June 2025",
    description: "Collaborative development of a comprehensive phonics assessment framework aligned with UK curriculum standards."
  },
  {
    id: 2,
    title: "EAL Phonics Support Strategies Research",
    type: "Research Project",
    schools: ["Highfield Primary", "Meadowview School", "Westside Academy"],
    members: 6,
    status: "In Progress",
    progress: 40,
    dueDate: "15 August 2025",
    description: "Joint research project investigating effective phonics teaching strategies for EAL learners across participating schools."
  },
  {
    id: 3,
    title: "Phonics Intervention Impact Study",
    type: "Research Project",
    schools: ["Oakwood Primary", "Riverside Academy", "University of Education"],
    members: 5,
    status: "Planning",
    progress: 15,
    dueDate: "1 September 2025",
    description: "Collaborative study measuring the impact of specific phonics interventions on reading progress across different school contexts."
  }
];

export default function LearningCommunities() {
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [communityTab, setCommunityTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [privacyFilter, setPrivacyFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateCommunityDialog, setShowCreateCommunityDialog] = useState(false);
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [showPrivacySettingsDialog, setShowPrivacySettingsDialog] = useState(false);
  
  // Filter communities based on search and filters
  const filteredCommunities = MOCK_COMMUNITIES.filter(community => {
    // Search filter
    if (searchQuery && !community.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !community.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== 'all' && !community.categories.includes(categoryFilter)) {
      return false;
    }
    
    // Privacy filter
    if (privacyFilter !== 'all' && community.privacy !== privacyFilter) {
      return false;
    }
    
    // Activity filter
    if (activityFilter !== 'all' && community.activity !== activityFilter) {
      return false;
    }
    
    return true;
  });
  
  // Handle community selection
  const handleCommunitySelect = (community) => {
    setSelectedCommunity(community);
    setActiveTab('community');
    setCommunityTab('discussions');
  };
  
  // Handle back to communities list
  const handleBackToCommunities = () => {
    setSelectedCommunity(null);
    setActiveTab('discover');
  };
  
  // Get all unique categories from communities
  const allCategories = [...new Set(MOCK_COMMUNITIES.flatMap(community => community.categories))];
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-centre">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Communities</h1>
          <p className="text-muted-foreground">
            Connect, collaborate, and share with educators across schools
          </p>
        </div>
        <Button onClick={() => setShowCreateCommunityDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Community
        </Button>
      </div>
      
      {!selectedCommunity ? (
        <Tabs defaultValue="discover" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="my-communities">My Communities</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-3/4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-centre gap-4">
                      <CardTitle>Discover Communities</CardTitle>
                      <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search communities..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {allCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Privacy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Privacy</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="restricted">Restricted</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={activityFilter} onValueChange={setActivityFilter}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Activity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Activity</SelectItem>
                          <SelectItem value="high">High Activity</SelectItem>
                          <SelectItem value="medium">Medium Activity</SelectItem>
                          <SelectItem value="low">Low Activity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredCommunities.length > 0 ? (
                        filteredCommunities.map(community => (
                          <Card key={community.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleCommunitySelect(community)}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex items-centre space-x-4">
                                  <div className="bg-primary/10 rounded-md p-3">
                                    <Users className="h-6 w-6 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{community.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{community.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-centre space-x-2">
                                  {community.privacy === 'restricted' ? (
                                    <Badge variant="outline" className="flex items-centre">
                                      <Lock className="h-3 w-3 mr-1" /> Restricted
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="flex items-centre">
                                      <Globe className="h-3 w-3 mr-1" /> Open
                                    </Badge>
                                  )}
                                  {community.featured && (
                                    <Badge className="bg-primary">Featured</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {community.categories.map(category => (
                                  <Badge key={category} variant="secondary" className="text-xs">
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-4 flex justify-between items-centre">
                                <div className="flex space-x-4 text-sm text-muted-foreground">
                                  <span className="flex items-centre">
                                    <Users className="h-4 w-4 mr-1" /> {community.members} members
                                  </span>
                                  <span className="flex items-centre">
                                    <School className="h-4 w-4 mr-1" /> {community.schools} schools
                                  </span>
                                </div>
                                <Button size="sm" variant="ghost">View Community</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-centre py-12">
                          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium">No communities found</h3>
                          <p className="text-muted-foreground mt-2">
                            Try adjusting your search terms or filters
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:w-1/4 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Featured Communities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {MOCK_COMMUNITIES.filter(c => c.featured).slice(0, 3).map(community => (
                        <div key={community.id} className="flex items-start space-x-3 cursor-pointer" onClick={() => handleCommunitySelect(community)}>
                          <div className="bg-primary/10 rounded-md p-2 mt-0.5">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{community.name}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{community.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Popular Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {allCategories.slice(0, 10).map(category => (
                        <Badge 
                          key={category} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => setCategoryFilter(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Community Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>Our learning communities are designed to foster professional collaboration while maintaining privacy and confidentiality.</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Respect confidentiality of shared information</li>
                        <li>Contribute constructively to discussions</li>
                        <li>Properly attribute shared resources</li>
                        <li>Follow data protection guidelines</li>
                      </ul>
                      <Button variant="link" className="p-0 h-auto">Read full guidelines</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* My Communities Tab */}
          <TabsContent value="my-communities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_MY_COMMUNITIES.map(community => {
                const fullCommunity = MOCK_COMMUNITIES.find(c => c.id === community.id);
                return (
                  <Card key={community.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleCommunitySelect(fullCommunity)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{community.name}</CardTitle>
                        {community.unread > 0 && (
                          <Badge>{community.unread} new</Badge>
                        )}
                      </div>
                      <CardDescription>
                        {community.role} • Last active {community.lastActivity}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Discussions</span>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Resources</span>
                          <span className="font-medium">8</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Upcoming Events</span>
                          <span className="font-medium">2</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View Community</Button>
                    </CardFooter>
                  </Card>
                );
              })}
              
              <Card className="border-dashed border-2 flex flex-col items-centre justify-centre p-6 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveTab('discover')}>
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">Join New Communities</h3>
                <p className="text-centre text-muted-foreground text-sm mb-4">
                  Discover and join communities aligned with your professional interests
                </p>
                <Button variant="outline">Browse Communities</Button>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity in Your Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-3 rounded-md border">
                    <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">New discussion in Early Years Literacy Development</p>
                      <p className="text-sm text-muted-foreground">Sarah Johnson posted "Effective phonics interventions for struggling readers" • 2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 rounded-md border">
                    <FileText className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">New resource in SEND Coordination Network</p>
                      <p className="text-sm text-muted-foreground">Emma Thompson shared "Inclusive Classroom Strategies Guide" • 1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 rounded-md border">
                    <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Upcoming event in Behaviour Management Strategies</p>
                      <p className="text-sm text-muted-foreground">Restorative Practise Workshop • 15 June 2025, 16:00-17:30</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 rounded-md border">
                    <Users className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium">New collaboration in Early Years Literacy Development</p>
                      <p className="text-sm text-muted-foreground">Phonics Assessment Framework Development • Started 3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform-Wide Activity</CardTitle>
                <CardDescription>
                  Recent activity across all learning communities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Today</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-4 p-3 rounded-md border">
                        <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">New discussion in Early Years Literacy Development</p>
                          <p className="text-sm text-muted-foreground">Sarah Johnson posted "Effective phonics interventions for struggling readers" • 2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 p-3 rounded-md border">
                        <FileText className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">New resource in Secondary Mathematics Teaching</p>
                          <p className="text-sm text-muted-foreground">David Wilson shared "Problem-Solving Strategies Toolkit" • 4 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 p-3 rounded-md border">
                        <Users className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">New community created</p>
                          <p className="text-sm text-muted-foreground">James Thompson created "Science Practical Assessment" • 6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Yesterday</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-4 p-3 rounded-md border">
                        <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="font-medium">New event in SEND Coordination Network</p>
                          <p className="text-sm text-muted-foreground">Emma Thompson scheduled "Inclusive Assessment Strategies Workshop" • Yesterday</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 p-3 rounded-md border">
                        <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Active discussion in Educational Technology Integration</p>
                          <p className="text-sm text-muted-foreground">"AI tools in the classroom" received 15 new replies • Yesterday</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 p-3 rounded-md border">
                        <FileText className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Popular resource in Behaviour Management Strategies</p>
                          <p className="text-sm text-muted-foreground">"Restorative Conversation Templates" reached 100 downloads • Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">This Week</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-4 p-3 rounded-md border">
                        <Users className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">New collaboration started</p>
                          <p className="text-sm text-muted-foreground">"EAL Phonics Support Strategies Research" launched with 3 schools • 2 days ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 p-3 rounded-md border">
                        <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Community milestone</p>
                          <p className="text-sm text-muted-foreground">Early Years Literacy Development reached 100 members • 3 days ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 p-3 rounded-md border">
                        <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Successful event</p>
                          <p className="text-sm text-muted-foreground">"Assessment for Learning Workshop" had 45 attendees • 4 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Trending Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-md border">
                      <div className="bg-blue-100 rounded-full p-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">AI tools in the classroom</p>
                        <p className="text-xs text-muted-foreground">Educational Technology Integration • 32 replies</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 rounded-md border">
                      <div className="bg-blue-100 rounded-full p-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Effective phonics interventions</p>
                        <p className="text-xs text-muted-foreground">Early Years Literacy Development • 18 replies</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 rounded-md border">
                      <div className="bg-blue-100 rounded-full p-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Supporting neurodivergent learners</p>
                        <p className="text-xs text-muted-foreground">SEND Coordination Network • 27 replies</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Popular Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-md border">
                      <div className="bg-green-100 rounded-full p-2">
                        <FileText className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Phonics Games and Activities Collection</p>
                        <p className="text-xs text-muted-foreground">Early Years Literacy Development • 187 downloads</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 rounded-md border">
                      <div className="bg-green-100 rounded-full p-2">
                        <FileText className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Restorative Conversation Templates</p>
                        <p className="text-xs text-muted-foreground">Behaviour Management Strategies • 112 downloads</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 rounded-md border">
                      <div className="bg-green-100 rounded-full p-2">
                        <FileText className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Problem-Solving Strategies Toolkit</p>
                        <p className="text-xs text-muted-foreground">Secondary Mathematics Teaching • 98 downloads</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        // Community View
        <div className="space-y-6">
          <div className="flex justify-between items-centre">
            <Button variant="outline" onClick={handleBackToCommunities}>
              <ChevronUp className="mr-2 h-4 w-4" /> Back to Communities
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowPrivacySettingsDialog(true)}>
                <Shield className="mr-2 h-4 w-4" /> Privacy Settings
              </Button>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Invite Members
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{selectedCommunity.name}</CardTitle>
                      <CardDescription className="mt-2">{selectedCommunity.description}</CardDescription>
                    </div>
                    <Badge variant={selectedCommunity.privacy === 'restricted' ? 'outline' : 'secondary'} className="flex items-centre">
                      {selectedCommunity.privacy === 'restricted' ? (
                        <><Lock className="h-3 w-3 mr-1" /> Restricted</>
                      ) : (
                        <><Globe className="h-3 w-3 mr-1" /> Open</>
                      )}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCommunity.categories.map(category => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="discussions" value={communityTab} onValueChange={setCommunityTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="discussions">Discussions</TabsTrigger>
                      <TabsTrigger value="resources">Resources</TabsTrigger>
                      <TabsTrigger value="events">Events</TabsTrigger>
                      <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
                    </TabsList>
                    
                    {/* Discussions Tab */}
                    <TabsContent value="discussions" className="space-y-4">
                      <div className="flex justify-between items-centre">
                        <div className="relative w-full md:w-64">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search discussions..."
                            className="pl-8"
                          />
                        </div>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> New Discussion
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {MOCK_DISCUSSIONS.map(discussion => (
                          <Card key={discussion.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-centre space-x-2 mb-1">
                                    {discussion.pinned && (
                                      <Badge variant="outline" className="text-xs">Pinned</Badge>
                                    )}
                                    <h3 className="font-medium">{discussion.title}</h3>
                                  </div>
                                  <div className="flex items-centre space-x-3 text-sm text-muted-foreground">
                                    <div className="flex items-centre">
                                      <Avatar className="h-5 w-5 mr-1">
                                        <AvatarFallback>{discussion.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                      </Avatar>
                                      <span>{discussion.author.name}</span>
                                    </div>
                                    <span>•</span>
                                    <span>{discussion.date}</span>
                                  </div>
                                </div>
                                <div className="flex items-centre space-x-4 text-sm text-muted-foreground">
                                  <span className="flex items-centre">
                                    <MessageSquare className="h-4 w-4 mr-1" /> {discussion.replies}
                                  </span>
                                  <span className="flex items-centre">
                                    <Eye className="h-4 w-4 mr-1" /> {discussion.views}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {discussion.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-3 text-sm text-muted-foreground">
                                Last reply {discussion.lastReply}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    {/* Resources Tab */}
                    <TabsContent value="resources" className="space-y-4">
                      <div className="flex justify-between items-centre">
                        <div className="relative w-full md:w-64">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search resources..."
                            className="pl-8"
                          />
                        </div>
                        <Button onClick={() => setShowResourceDialog(true)}>
                          <Plus className="mr-2 h-4 w-4" /> Share Resource
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MOCK_RESOURCES.map(resource => (
                          <Card key={resource.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <div className="bg-primary/10 rounded-md p-3">
                                  <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-medium">{resource.title}</h3>
                                    {resource.featured && (
                                      <Badge className="bg-primary">Featured</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{resource.type}</p>
                                  <div className="flex items-centre space-x-3 text-sm text-muted-foreground mt-1">
                                    <span>{resource.author.name}</span>
                                    <span>•</span>
                                    <span>{resource.date}</span>
                                  </div>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {resource.tags.map(tag => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="mt-3 flex justify-between items-centre">
                                    <div className="flex items-centre space-x-4 text-sm text-muted-foreground">
                                      <span className="flex items-centre">
                                        <Download className="h-4 w-4 mr-1" /> {resource.downloads}
                                      </span>
                                      <span className="flex items-centre">
                                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" /> {resource.rating} ({resource.reviews})
                                      </span>
                                    </div>
                                    <Button size="sm">Download</Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    {/* Events Tab */}
                    <TabsContent value="events" className="space-y-4">
                      <div className="flex justify-between items-centre">
                        <div className="relative w-full md:w-64">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search events..."
                            className="pl-8"
                          />
                        </div>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Create Event
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {MOCK_EVENTS.map(event => (
                          <Card key={event.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <div className="bg-primary/10 rounded-md p-3">
                                  <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-medium">{event.title}</h3>
                                      <Badge variant="outline" className="mt-1">{event.type}</Badge>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">{event.date}</p>
                                      <p className="text-sm text-muted-foreground">{event.time}</p>
                                    </div>
                                  </div>
                                  <p className="text-sm mt-2">{event.description}</p>
                                  <div className="flex items-centre space-x-3 text-sm text-muted-foreground mt-2">
                                    <span>Hosted by: {event.host.name}</span>
                                    <span>•</span>
                                    <span>{event.location}</span>
                                  </div>
                                  <div className="mt-3 flex justify-between items-centre">
                                    <div className="text-sm text-muted-foreground">
                                      {event.attendees} attendees ({Math.round((event.attendees / event.capacity) * 100)}% full)
                                    </div>
                                    <Button size="sm">Register</Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    {/* Collaborations Tab */}
                    <TabsContent value="collaborations" className="space-y-4">
                      <div className="flex justify-between items-centre">
                        <div className="relative w-full md:w-64">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search collaborations..."
                            className="pl-8"
                          />
                        </div>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Start Collaboration
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {MOCK_COLLABORATIONS.map(collab => (
                          <Card key={collab.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <div className="bg-primary/10 rounded-md p-3">
                                  <Users className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-medium">{collab.title}</h3>
                                      <Badge variant="outline" className="mt-1">{collab.type}</Badge>
                                    </div>
                                    <Badge className={
                                      collab.status === 'Completed' ? 'bg-green-500' : 
                                      collab.status === 'In Progress' ? 'bg-blue-500' : 
                                      'bg-amber-500'
                                    }>
                                      {collab.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm mt-2">{collab.description}</p>
                                  <div className="mt-3">
                                    <p className="text-sm text-muted-foreground mb-1">Participating Schools:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {collab.schools.map(school => (
                                        <Badge key={school} variant="secondary" className="text-xs">
                                          {school}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="mt-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Progress</span>
                                      <span>{collab.progress}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                      <div 
                                        className="bg-primary h-2.5 rounded-full" 
                                        style={{ width: `${collab.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="mt-3 flex justify-between items-centre">
                                    <div className="flex items-centre space-x-4 text-sm text-muted-foreground">
                                      <span className="flex items-centre">
                                        <Users className="h-4 w-4 mr-1" /> {collab.members} members
                                      </span>
                                      <span className="flex items-centre">
                                        <Calendar className="h-4 w-4 mr-1" /> Due: {collab.dueDate}
                                      </span>
                                    </div>
                                    <Button size="sm">View Details</Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Community Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-centre">
                      <span className="text-sm text-muted-foreground">Members</span>
                      <span className="font-medium">{selectedCommunity.members}</span>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span className="text-sm text-muted-foreground">Schools</span>
                      <span className="font-medium">{selectedCommunity.schools}</span>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="font-medium">March 2025</span>
                    </div>
                    <div className="flex justify-between items-centre">
                      <span className="text-sm text-muted-foreground">Activity Level</span>
                      <Badge variant={
                        selectedCommunity.activity === 'high' ? 'default' : 
                        selectedCommunity.activity === 'medium' ? 'secondary' : 
                        'outline'
                      }>
                        {selectedCommunity.activity.charAt(0).toUpperCase() + selectedCommunity.activity.slice(1)}
                      </Badge>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Facilitators</h4>
                      <div className="space-y-2">
                        <div className="flex items-centre space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>SJ</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">Sarah Johnson</span>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>DW</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">David Wilson</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-centre justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Community Visibility</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedCommunity.privacy === 'restricted' ? 
                            'Only visible to approved schools' : 
                            'Visible to all platform users'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowPrivacySettingsDialog(true)}>
                        <Settings className="h-4 w-4 mr-2" /> Manage
                      </Button>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-base">Content Sharing</Label>
                      <div className="space-y-2">
                        <div className="flex items-centre space-x-2">
                          <Badge variant="outline" className="flex items-centre">
                            <MessageSquare className="h-3 w-3 mr-1" /> Discussions
                          </Badge>
                          <span className="text-sm text-muted-foreground">Community members only</span>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <Badge variant="outline" className="flex items-centre">
                            <FileText className="h-3 w-3 mr-1" /> Resources
                          </Badge>
                          <span className="text-sm text-muted-foreground">Controlled sharing</span>
                        </div>
                        <div className="flex items-centre space-x-2">
                          <Badge variant="outline" className="flex items-centre">
                            <Calendar className="h-3 w-3 mr-1" /> Events
                          </Badge>
                          <span className="text-sm text-muted-foreground">Public registration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>SJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Sarah Johnson</p>
                          <p className="text-xs text-muted-foreground">Oakwood Primary</p>
                        </div>
                      </div>
                      <Badge>Facilitator</Badge>
                    </div>
                    
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>MC</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Michael Chen</p>
                          <p className="text-xs text-muted-foreground">Riverside Academy</p>
                        </div>
                      </div>
                      <Badge variant="outline">Member</Badge>
                    </div>
                    
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>ET</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Emma Thompson</p>
                          <p className="text-xs text-muted-foreground">Meadowview School</p>
                        </div>
                      </div>
                      <Badge variant="outline">Member</Badge>
                    </div>
                    
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>DW</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">David Wilson</p>
                          <p className="text-xs text-muted-foreground">St. Mary's Primary</p>
                        </div>
                      </div>
                      <Badge>Facilitator</Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full text-sm">
                      View All Members
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Community Dialog */}
      <Dialog open={showCreateCommunityDialog} onOpenChange={setShowCreateCommunityDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Learning Community</DialogTitle>
            <DialogDescription>
              Create a space for educators to connect, collaborate, and share resources.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Community Name</Label>
              <Input id="name" placeholder="e.g., Early Years Literacy Development" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the purpose and focus of this community..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Categories (select up to 3)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allCategories.slice(0, 10).map(category => (
                  <Badge 
                    key={category} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Privacy Settings</Label>
              <RadioGroup defaultValue="open">
                <div className="flex items-centre space-x-2 mt-2">
                  <RadioGroupItem value="open" id="open" />
                  <Label htmlFor="open" className="flex items-centre">
                    <Globe className="h-4 w-4 mr-2" />
                    Open Community
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6 mb-2">
                  Visible to all platform users. Anyone can join and participate.
                </p>
                
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="restricted" id="restricted" />
                  <Label htmlFor="restricted" className="flex items-centre">
                    <Lock className="h-4 w-4 mr-2" />
                    Restricted Community
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Visible only to approved schools. Membership requires approval.
                </p>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Advanced Privacy Controls</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-centre space-x-2">
                  <Checkbox id="anonymize" />
                  <Label htmlFor="anonymize" className="text-sm">Enable AI-assisted anonymization for shared resources</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <Checkbox id="approval" />
                  <Label htmlFor="approval" className="text-sm">Require facilitator approval for all shared content</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <Checkbox id="attribution" />
                  <Label htmlFor="attribution" className="text-sm">Maintain school attribution for all shared resources</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCommunityDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowCreateCommunityDialog(false)}>Create Community</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Resource Dialog */}
      <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Share Resource</DialogTitle>
            <DialogDescription>
              Share a resource with the community. All shared resources will be reviewed for privacy concerns.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Resource Title</Label>
              <Input id="title" placeholder="e.g., Phonics Assessment Toolkit" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the resource and how it can be used..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Resource Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="worksheet">Worksheet</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input placeholder="Add tags separated by commas" />
            </div>
            <div className="space-y-2">
              <Label>Upload File</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-centre cursor-pointer hover:bg-muted/50 transition-colors">
                <Paperclip className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop a file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max file size: 50MB
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Privacy Settings</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-centre justify-between">
                  <div className="flex items-centre space-x-2">
                    <Checkbox id="anonymize-resource" defaultChecked />
                    <Label htmlFor="anonymize-resource" className="text-sm">Apply AI anonymization</Label>
                  </div>
                  <Badge variant="outline" className="text-xs">Recommended</Badge>
                </div>
                <p className="text-xs text-muted-foreground ml-6 mb-2">
                  Automatically detect and remove sensitive information while preserving educational value
                </p>
                
                <div className="flex items-centre space-x-2">
                  <Checkbox id="attribution-resource" defaultChecked />
                  <Label htmlFor="attribution-resource" className="text-sm">Include school attribution</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <Checkbox id="review-resource" defaultChecked />
                  <Label htmlFor="review-resource" className="text-sm">Request review before publishing</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sharing Scope</Label>
              <RadioGroup defaultValue="community">
                <div className="flex items-centre space-x-2 mt-2">
                  <RadioGroupItem value="community" id="community" />
                  <Label htmlFor="community">This community only</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="selected" id="selected" />
                  <Label htmlFor="selected">Selected schools only</Label>
                </div>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="platform" id="platform" />
                  <Label htmlFor="platform">All platform users</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResourceDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowResourceDialog(false)}>Share Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Privacy Settings Dialog */}
      <Dialog open={showPrivacySettingsDialog} onOpenChange={setShowPrivacySettingsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Community Privacy Settings</DialogTitle>
            <DialogDescription>
              Configure privacy and sharing settings for this community
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <h3 className="font-medium">Community Visibility</h3>
              <RadioGroup defaultValue={selectedCommunity?.privacy || 'open'}>
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="open" id="open-privacy" />
                  <Label htmlFor="open-privacy" className="flex items-centre">
                    <Globe className="h-4 w-4 mr-2" />
                    Open Community
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6 mb-2">
                  Visible to all platform users. Anyone can join and participate.
                </p>
                
                <div className="flex items-centre space-x-2">
                  <RadioGroupItem value="restricted" id="restricted-privacy" />
                  <Label htmlFor="restricted-privacy" className="flex items-centre">
                    <Lock className="h-4 w-4 mr-2" />
                    Restricted Community
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Visible only to approved schools. Membership requires approval.
                </p>
              </RadioGroup>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="font-medium">Content Sharing Permissions</h3>
              <div className="space-y-4">
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Discussions</Label>
                    <p className="text-sm text-muted-foreground">
                      Who can view and participate in discussions
                    </p>
                  </div>
                  <Select defaultValue="members">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="members">Community members only</SelectItem>
                      <SelectItem value="selected">Selected schools only</SelectItem>
                      <SelectItem value="all">All platform users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Resources</Label>
                    <p className="text-sm text-muted-foreground">
                      Who can access shared resources
                    </p>
                  </div>
                  <Select defaultValue="controlled">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="members">Community members only</SelectItem>
                      <SelectItem value="controlled">Controlled sharing</SelectItem>
                      <SelectItem value="all">All platform users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Events</Label>
                    <p className="text-sm text-muted-foreground">
                      Who can view and register for events
                    </p>
                  </div>
                  <Select defaultValue="public">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="members">Community members only</SelectItem>
                      <SelectItem value="selected">Selected schools only</SelectItem>
                      <SelectItem value="public">Public registration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-centre justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Collaborations</Label>
                    <p className="text-sm text-muted-foreground">
                      Who can view and join collaborations
                    </p>
                  </div>
                  <Select defaultValue="members">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="members">Community members only</SelectItem>
                      <SelectItem value="selected">Selected schools only</SelectItem>
                      <SelectItem value="all">All platform users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="font-medium">Privacy Protection</h3>
              <div className="space-y-2">
                <div className="flex items-centre space-x-2">
                  <Switch id="anonymize-switch" defaultChecked />
                  <Label htmlFor="anonymize-switch">Enable AI-assisted anonymization</Label>
                </div>
                <p className="text-sm text-muted-foreground ml-10">
                  Automatically detect and anonymize sensitive information in shared content
                </p>
                
                <div className="flex items-centre space-x-2 mt-4">
                  <Switch id="approval-switch" defaultChecked />
                  <Label htmlFor="approval-switch">Require content approval</Label>
                </div>
                <p className="text-sm text-muted-foreground ml-10">
                  All shared resources must be approved by a facilitator before publishing
                </p>
                
                <div className="flex items-centre space-x-2 mt-4">
                  <Switch id="attribution-switch" defaultChecked />
                  <Label htmlFor="attribution-switch">Maintain school attribution</Label>
                </div>
                <p className="text-sm text-muted-foreground ml-10">
                  Display school name with shared resources while protecting individual identities
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="font-medium">Approved Schools</h3>
              <p className="text-sm text-muted-foreground">
                Select schools that can access this community if restricted
              </p>
              <div className="h-[150px] overflow-y-auto border rounded-md p-2">
                <div className="space-y-2">
                  <div className="flex items-centre space-x-2">
                    <Checkbox id="school1" defaultChecked />
                    <Label htmlFor="school1" className="text-sm">Oakwood Primary</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Checkbox id="school2" defaultChecked />
                    <Label htmlFor="school2" className="text-sm">St. Mary's Primary</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Checkbox id="school3" defaultChecked />
                    <Label htmlFor="school3" className="text-sm">Riverside Academy</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Checkbox id="school4" defaultChecked />
                    <Label htmlFor="school4" className="text-sm">Meadowview School</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Checkbox id="school5" />
                    <Label htmlFor="school5" className="text-sm">Highfield Primary</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Checkbox id="school6" />
                    <Label htmlFor="school6" className="text-sm">Westside Academy</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Checkbox id="school7" />
                    <Label htmlFor="school7" className="text-sm">Northgate School</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Checkbox id="school8" />
                    <Label htmlFor="school8" className="text-sm">Southview Primary</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrivacySettingsDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowPrivacySettingsDialog(false)}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
