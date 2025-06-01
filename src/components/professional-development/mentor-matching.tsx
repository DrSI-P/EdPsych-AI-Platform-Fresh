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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { 
  Search, 
  Filter, 
  User, 
  Users, 
  Calendar, 
  Clock, 
  Star, 
  StarHalf, 
  MessageSquare, 
  BookOpen, 
  Award, 
  Briefcase, 
  School, 
  GraduationCap, 
  Target, 
  Compass, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  Edit, 
  Trash, 
  FileText, 
  Download, 
  Upload, 
  Link, 
  ExternalLink, 
  Mail, 
  Phone, 
  Video, 
  Share2, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  BarChart2, 
  PieChart, 
  LineChart, 
  Loader2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

// Mock data for development
const EXPERTISE_AREAS = [
  { id: 1, name: "Special Educational Needs", category: "Inclusion" },
  { id: 2, name: "Behaviour Management", category: "Classroom Management" },
  { id: 3, name: "Curriculum Design", category: "Teaching & Learning" },
  { id: 4, name: "Assessment for Learning", category: "Assessment" },
  { id: 5, name: "Differentiation", category: "Teaching & Learning" },
  { id: 6, name: "Digital Learning", category: "EdTech" },
  { id: 7, name: "Early Years Education", category: "Phase Specific" },
  { id: 8, name: "Secondary Mathematics", category: "Subject Specific" },
  { id: 9, name: "Leadership Development", category: "Leadership" },
  { id: 10, name: "Wellbeing & Mental Health", category: "Pastoral" },
  { id: 11, name: "Restorative Practise", category: "Behaviour" },
  { id: 12, name: "Literacy Across Curriculum", category: "Literacy" },
  { id: 13, name: "STEM Integration", category: "Cross-Curricular" },
  { id: 14, name: "Educational Research", category: "Professional Learning" },
  { id: 15, name: "Parent Engagement", category: "Community" }
];

const SCHOOL_PHASES = [
  "Early Years", "Primary", "Secondary", "Further Education", "Higher Education", "Special Education", "Alternative Provision"
];

const SUBJECTS = [
  "English", "Mathematics", "Science", "History", "Geography", "Modern Foreign Languages", 
  "Art & Design", "Music", "Physical Education", "Computing", "Design & Technology", 
  "Religious Education", "PSHE", "Citizenship", "Business Studies", "Psychology", "Sociology"
];

const MOCK_MENTORS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Head of Inclusion",
    school: "Oakwood Academy",
    phase: "Secondary",
    yearsExperience: 15,
    expertise: [1, 5, 10],
    subjects: ["Psychology", "PSHE"],
    bio: "Experienced SEN coordinator with a doctorate in educational psychology. Passionate about inclusive education and supporting teachers to develop differentiated approaches.",
    rating: 4.9,
    reviewCount: 27,
    availability: "Weekly, evenings",
    menteeCount: 12,
    avatarUrl: ""
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Lead Practitioner - Mathematics",
    school: "Riverside School",
    phase: "Secondary",
    yearsExperience: 8,
    expertise: [3, 5, 8],
    subjects: ["Mathematics"],
    bio: "Mathematics specialist with experience in curriculum design and assessment. Focused on developing problem-solving approaches and mathematical reasoning.",
    rating: 4.7,
    reviewCount: 19,
    availability: "Fortnightly, weekends",
    menteeCount: 5,
    avatarUrl: ""
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Early Years Coordinator",
    school: "Sunshine Nursery",
    phase: "Early Years",
    yearsExperience: 12,
    expertise: [7, 10, 12],
    subjects: ["Early Years"],
    bio: "Specialist in early childhood development with a focus on language acquisition and play-based learning. Experienced in supporting new practitioners.",
    rating: 5.0,
    reviewCount: 31,
    availability: "Weekly, afternoons",
    menteeCount: 8,
    avatarUrl: ""
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Assistant Headteacher",
    school: "Hillside Comprehensive",
    phase: "Secondary",
    yearsExperience: 10,
    expertise: [2, 9, 11],
    subjects: ["Science", "Leadership"],
    bio: "Senior leader with responsibility for behaviour and pastoral care. Experienced in implementing restorative approaches and supporting staff wellbeing.",
    rating: 4.8,
    reviewCount: 23,
    availability: "Monthly, flexible",
    menteeCount: 15,
    avatarUrl: ""
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "EdTech Lead",
    school: "Future Academy Trust",
    phase: "Primary",
    yearsExperience: 7,
    expertise: [6, 13, 14],
    subjects: ["Computing", "Science"],
    bio: "Digital learning specialist supporting schools across a multi-academy trust. Experienced in implementing technology to enhance teaching and learning.",
    rating: 4.6,
    reviewCount: 14,
    availability: "Fortnightly, online",
    menteeCount: 9,
    avatarUrl: ""
  }
];

const MOCK_MENTEES = [
  {
    id: 101,
    name: "Alex Taylor",
    role: "NQT - English",
    school: "Meadowview School",
    phase: "Secondary",
    yearsExperience: 1,
    interests: [2, 5, 12],
    subjects: ["English"],
    goals: "Developing effective behaviour management strategies and differentiation techniques for mixed ability classes.",
    mentorId: 4,
    avatarUrl: ""
  },
  {
    id: 102,
    name: "Olivia Garcia",
    role: "Teacher - Science",
    school: "Westfield Academy",
    phase: "Secondary",
    yearsExperience: 3,
    interests: [3, 6, 13],
    subjects: ["Science"],
    goals: "Integrating technology into science lessons and developing cross-curricular STEM projects.",
    mentorId: 5,
    avatarUrl: ""
  },
  {
    id: 103,
    name: "Daniel Ahmed",
    role: "Teaching Assistant",
    school: "Sunshine Nursery",
    phase: "Early Years",
    yearsExperience: 2,
    interests: [1, 7, 10],
    subjects: ["Early Years"],
    goals: "Developing skills in supporting children with special educational needs in an early years setting.",
    mentorId: 3,
    avatarUrl: ""
  }
];

const MOCK_MENTORSHIPS = [
  {
    id: 1001,
    mentorId: 4,
    menteeId: 101,
    status: "Active",
    startDate: "2025-01-15",
    endDate: "2025-07-15",
    focusAreas: [2, 5],
    goals: [
      { id: 1, text: "Develop a toolkit of behaviour management strategies", status: "In Progress" },
      { id: 2, text: "Create differentiated resources for a scheme of work", status: "Not Started" },
      { id: 3, text: "Observe and reflect on experienced teachers' practise", status: "Completed" }
    ],
    meetings: [
      { id: 1, date: "2025-01-20", status: "Completed", notes: "Initial meeting to establish goals and expectations" },
      { id: 2, date: "2025-02-10", status: "Completed", notes: "Discussed behaviour management strategies and observed a lesson" },
      { id: 3, date: "2025-03-05", status: "Completed", notes: "Reviewed progress on behaviour management toolkit" },
      { id: 4, date: "2025-04-02", status: "Scheduled", notes: "" }
    ],
    resources: [
      { id: 1, title: "Behaviour Management Guide", type: "PDF", shared: "2025-01-25" },
      { id: 2, title: "Differentiation Templates", type: "Document", shared: "2025-02-15" }
    ],
    feedback: [
      { id: 1, date: "2025-02-10", rating: 5, comment: "Very helpful session with practical strategies I could implement immediately." },
      { id: 2, date: "2025-03-05", rating: 4, comment: "Good follow-up and useful resources shared." }
    ]
  },
  {
    id: 1002,
    mentorId: 5,
    menteeId: 102,
    status: "Active",
    startDate: "2025-02-01",
    endDate: "2025-08-01",
    focusAreas: [6, 13],
    goals: [
      { id: 1, text: "Develop skills in using digital tools for science teaching", status: "In Progress" },
      { id: 2, text: "Create a cross-curricular STEM project", status: "In Progress" },
      { id: 3, text: "Implement and evaluate a technology-enhanced learning unit", status: "Not Started" }
    ],
    meetings: [
      { id: 1, date: "2025-02-05", status: "Completed", notes: "Initial meeting to establish goals and discuss digital tools" },
      { id: 2, date: "2025-02-25", status: "Completed", notes: "Explored specific applications and planned implementation" },
      { id: 3, date: "2025-03-15", status: "Scheduled", notes: "" }
    ],
    resources: [
      { id: 1, title: "EdTech Tools for Science", type: "Website", shared: "2025-02-06" },
      { id: 2, title: "STEM Project Ideas", type: "Presentation", shared: "2025-02-26" }
    ],
    feedback: [
      { id: 1, date: "2025-02-25", rating: 5, comment: "Excellent session with hands-on practise with the tools." }
    ]
  },
  {
    id: 1003,
    mentorId: 3,
    menteeId: 103,
    status: "Active",
    startDate: "2025-01-10",
    endDate: "2025-04-10",
    focusAreas: [1, 7],
    goals: [
      { id: 1, text: "Develop understanding of early years SEN support strategies", status: "Completed" },
      { id: 2, text: "Create visual supports for children with communication needs", status: "In Progress" },
      { id: 3, text: "Implement and evaluate a sensory activity programme", status: "In Progress" }
    ],
    meetings: [
      { id: 1, date: "2025-01-15", status: "Completed", notes: "Initial meeting to establish goals and discuss SEN in early years" },
      { id: 2, date: "2025-02-01", status: "Completed", notes: "Observed practise and discussed visual support strategies" },
      { id: 3, date: "2025-02-20", status: "Completed", notes: "Reviewed visual supports created and planned sensory activities" },
      { id: 4, date: "2025-03-10", status: "Scheduled", notes: "" }
    ],
    resources: [
      { id: 1, title: "Early Years SEN Toolkit", type: "PDF", shared: "2025-01-16" },
      { id: 2, title: "Visual Support Templates", type: "Resource Pack", shared: "2025-02-02" },
      { id: 3, title: "Sensory Activity Ideas", type: "Document", shared: "2025-02-21" }
    ],
    feedback: [
      { id: 1, date: "2025-02-01", rating: 5, comment: "Incredibly helpful observation and feedback session." },
      { id: 2, date: "2025-02-20", rating: 5, comment: "Great practical advice and resources that I can use immediately." }
    ]
  }
];

export default function MentorMatching() {
  const [activeTab, setActiveTab] = useState('find');
  const [profileType, setProfileType] = useState('mentee');
  const [expertiseFilter, setExpertiseFilter] = useState([]);
  const [phaseFilter, setPhaseFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMentors, setFilteredMentors] = useState(MOCK_MENTORS);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showMentorDetails, setShowMentorDetails] = useState(false);
  const [activeMentorships, setActiveMentorships] = useState(MOCK_MENTORSHIPS);
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [showMentorshipDetails, setShowMentorshipDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    role: '',
    school: '',
    phase: '',
    yearsExperience: 0,
    expertise: [],
    subjects: [],
    bio: '',
    availability: '',
    goals: ''
  });

  // Initialize with mock data for development
  useEffect(() => {
    // Simulate loading user profile
    setIsLoading(true);
    setTimeout(() => {
      // For demo purposes, set as mentee profile
      setUserProfile(MOCK_MENTEES[0]);
      setProfileData({
        role: MOCK_MENTEES[0].role,
        school: MOCK_MENTEES[0].school,
        phase: MOCK_MENTEES[0].phase,
        yearsExperience: MOCK_MENTEES[0].yearsExperience,
        expertise: MOCK_MENTEES[0].interests || [],
        subjects: MOCK_MENTEES[0].subjects || [],
        bio: MOCK_MENTEES[0].bio || '',
        availability: MOCK_MENTEES[0].availability || '',
        goals: MOCK_MENTEES[0].goals || ''
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter mentors based on search and filters
  useEffect(() => {
    let filtered = [...MOCK_MENTORS];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(mentor => 
        mentor.name.toLowerCase().includes(query) || 
        mentor.role.toLowerCase().includes(query) || 
        mentor.school.toLowerCase().includes(query) ||
        mentor.bio.toLowerCase().includes(query)
      );
    }
    
    // Apply expertise filter
    if (expertiseFilter.length > 0) {
      filtered = filtered.filter(mentor => 
        expertiseFilter.some(id => mentor.expertise.includes(id))
      );
    }
    
    // Apply phase filter
    if (phaseFilter) {
      filtered = filtered.filter(mentor => 
        mentor.phase === phaseFilter
      );
    }
    
    // Apply subject filter
    if (subjectFilter) {
      filtered = filtered.filter(mentor => 
        mentor.subjects.includes(subjectFilter)
      );
    }
    
    setFilteredMentors(filtered);
  }, [searchQuery, expertiseFilter, phaseFilter, subjectFilter]);

  // Handle mentor selection
  const handleSelectMentor = (mentor) => {
    setSelectedMentor(mentor);
    setShowMentorDetails(true);
  };

  // Handle mentorship selection
  const handleSelectMentorship = (mentorship) => {
    setSelectedMentorship(mentorship);
    setShowMentorshipDetails(true);
  };

  // Handle profile type change
  const handleProfileTypeChange = (type) => {
    setProfileType(type);
    // In a real implementation, this would load the appropriate profile data
  };

  // Handle profile data change
  const handleProfileDataChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  // Handle expertise selection
  const handleExpertiseChange = (id) => {
    if (profileData.expertise.includes(id)) {
      setProfileData({
        ...profileData,
        expertise: profileData.expertise.filter(item => item !== id)
      });
    } else {
      setProfileData({
        ...profileData,
        expertise: [...profileData.expertise, id]
      });
    }
  };

  // Handle subject selection
  const handleSubjectChange = (subject) => {
    if (profileData.subjects.includes(subject)) {
      setProfileData({
        ...profileData,
        subjects: profileData.subjects.filter(item => item !== subject)
      });
    } else {
      setProfileData({
        ...profileData,
        subjects: [...profileData.subjects, subject]
      });
    }
  };

  // Save profile changes
  const handleSaveProfile = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUserProfile({
        ...userProfile,
        ...profileData
      });
      setIsEditingProfile(false);
      setIsLoading(false);
    }, 1000);
  };

  // Request mentorship
  const handleRequestMentorship = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real implementation, this would create a mentorship request
      setIsLoading(false);
      setShowMentorDetails(false);
      // Show success message
    }, 1500);
  };

  // Analytics data for dashboard
  const mentorshipProgressData = [
    { name: 'Goal 1', completed: 75 },
    { name: 'Goal 2', completed: 30 },
    { name: 'Goal 3', completed: 100 }
  ];

  const mentorshipActivityData = [
    { name: 'Jan', meetings: 2, resources: 3 },
    { name: 'Feb', meetings: 3, resources: 5 },
    { name: 'Mar', meetings: 2, resources: 4 },
    { name: 'Apr', meetings: 4, resources: 6 }
  ];

  const expertiseDistributionData = [
    { name: 'SEN', value: 25 },
    { name: 'Behaviour', value: 15 },
    { name: 'Curriculum', value: 20 },
    { name: 'Assessment', value: 10 },
    { name: 'EdTech', value: 30 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-centre">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentor Matching</h1>
          <p className="text-muted-foreground">
            Connect with mentors and mentees to enhance your professional development
          </p>
        </div>
        <div className="flex items-centre space-x-2">
          <div className="flex items-centre space-x-2 bg-muted p-2 rounded-md">
            <Label htmlFor="profileType" className="text-sm">I am a:</Label>
            <Select 
              value={profileType} 
              onValueChange={handleProfileTypeChange}
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mentee">Mentee</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="find" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="find">Find a Mentor</TabsTrigger>
          <TabsTrigger value="mentorships">My Mentorships</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        {/* Find a Mentor Tab */}
        <TabsContent value="find" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Find Your Perfect Mentor</CardTitle>
              <CardDescription>
                Search for mentors based on expertise, subject area, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, role, or school..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-centre gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Filter Mentors</DialogTitle>
                        <DialogDescription>
                          Refine your search to find the most suitable mentors
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Expertise Areas</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {EXPERTISE_AREAS.map((area) => (
                              <div key={area.id} className="flex items-centre space-x-2">
                                <Checkbox 
                                  id={`expertise-${area.id}`} 
                                  checked={expertiseFilter.includes(area.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setExpertiseFilter([...expertiseFilter, area.id]);
                                    } else {
                                      setExpertiseFilter(expertiseFilter.filter(id => id !== area.id));
                                    }
                                  }}
                                />
                                <Label 
                                  htmlFor={`expertise-${area.id}`}
                                  className="text-sm font-normal"
                                >
                                  {area.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phase">School Phase</Label>
                          <Select 
                            value={phaseFilter} 
                            onValueChange={setPhaseFilter}
                          >
                            <SelectTrigger id="phase">
                              <SelectValue placeholder="All phases" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All phases</SelectItem>
                              {SCHOOL_PHASES.map((phase) => (
                                <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject Area</Label>
                          <Select 
                            value={subjectFilter} 
                            onValueChange={setSubjectFilter}
                          >
                            <SelectTrigger id="subject">
                              <SelectValue placeholder="All subjects" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All subjects</SelectItem>
                              {SUBJECTS.map((subject) => (
                                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setExpertiseFilter([]);
                            setPhaseFilter('');
                            setSubjectFilter('');
                          }}
                        >
                          Reset
                        </Button>
                        <Button type="submit">Apply Filters</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by: Relevance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="experience">Most Experienced</SelectItem>
                      <SelectItem value="recent">Recently Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMentors.map((mentor) => (
                  <Card key={mentor.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-centre space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                            <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{mentor.name}</CardTitle>
                            <CardDescription>{mentor.role}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-centre">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium ml-1">{mentor.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex items-centre text-sm">
                          <School className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{mentor.school}</span>
                        </div>
                        <div className="flex items-centre text-sm">
                          <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{mentor.phase} • {mentor.yearsExperience} years experience</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {mentor.expertise.slice(0, 3).map((expertiseId) => {
                            const expertise = EXPERTISE_AREAS.find(e => e.id === expertiseId);
                            return expertise ? (
                              <Badge key={expertise.id} variant="secondary" className="text-xs">
                                {expertise.name}
                              </Badge>
                            ) : null;
                          })}
                          {mentor.expertise.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{mentor.expertise.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {mentor.bio}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full" 
                        onClick={() => handleSelectMentor(mentor)}
                      >
                        View Profile
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredMentors.length === 0 && (
                <div className="text-centre py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No mentors found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mentor Details Dialog */}
          <Dialog open={showMentorDetails} onOpenChange={setShowMentorDetails}>
            <DialogContent className="sm:max-w-[600px]">
              {selectedMentor && (
                <>
                  <DialogHeader>
                    <div className="flex items-centre space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedMentor.avatarUrl} alt={selectedMentor.name} />
                        <AvatarFallback>{selectedMentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <DialogTitle className="text-xl">{selectedMentor.name}</DialogTitle>
                        <DialogDescription className="text-base">{selectedMentor.role} at {selectedMentor.school}</DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedMentor.rating}</span>
                        <span className="text-muted-foreground">({selectedMentor.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-centre space-x-1">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span>{selectedMentor.menteeCount} mentees</span>
                      </div>
                      <div className="flex items-centre space-x-1">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span>{selectedMentor.availability}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">About</h4>
                      <p className="text-muted-foreground">{selectedMentor.bio}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMentor.expertise.map((expertiseId) => {
                          const expertise = EXPERTISE_AREAS.find(e => e.id === expertiseId);
                          return expertise ? (
                            <Badge key={expertise.id} variant="secondary">
                              {expertise.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Teaching Context</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Phase</p>
                          <p>{selectedMentor.phase}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Experience</p>
                          <p>{selectedMentor.yearsExperience} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Subjects</p>
                          <p>{selectedMentor.subjects.join(', ')}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Recent Feedback</h4>
                      <div className="space-y-3">
                        <div className="bg-muted p-3 rounded-md">
                          <div className="flex items-centre justify-between mb-1">
                            <div className="flex items-centre">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </div>
                            <span className="text-xs text-muted-foreground">2 weeks ago</span>
                          </div>
                          <p className="text-sm">
                            "Incredibly supportive and knowledgeable. Provided practical strategies that I could implement immediately in my classroom."
                          </p>
                        </div>
                        <div className="bg-muted p-3 rounded-md">
                          <div className="flex items-centre justify-between mb-1">
                            <div className="flex items-centre">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Star className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-xs text-muted-foreground">1 month ago</span>
                          </div>
                          <p className="text-sm">
                            "Great mentor who really takes the time to understand your needs. Very responsive and always has helpful resources to share."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowMentorDetails(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRequestMentorship} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Request Mentorship'
                      )}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* My Mentorships Tab */}
        <TabsContent value="mentorships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Mentorships</CardTitle>
              <CardDescription>
                Manage your active and past mentorship relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="mt-4 space-y-4">
                  {activeMentorships.map((mentorship) => {
                    const mentor = MOCK_MENTORS.find(m => m.id === mentorship.mentorId);
                    const mentee = MOCK_MENTEES.find(m => m.id === mentorship.menteeId);
                    
                    // Calculate progress
                    const totalGoals = mentorship.goals.length;
                    const completedGoals = mentorship.goals.filter(g => g.status === 'Completed').length;
                    const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
                    
                    return (
                      <Card key={mentorship.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-centre space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={mentor?.avatarUrl} alt={mentor?.name} />
                                <AvatarFallback>{mentor?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">
                                  {profileType === 'mentor' ? mentee?.name : mentor?.name}
                                </CardTitle>
                                <CardDescription>
                                  {profileType === 'mentor' ? mentee?.role : mentor?.role}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge>{mentorship.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-3">
                            <div className="flex items-centre justify-between text-sm">
                              <div className="flex items-centre">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>Started: {new Date(mentorship.startDate).toLocaleDateString('en-GB')}</span>
                              </div>
                              <div className="flex items-centre">
                                <Target className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>Focus: {mentorship.focusAreas.map(id => {
                                  const area = EXPERTISE_AREAS.find(e => e.id === id);
                                  return area ? area.name : '';
                                }).join(', ')}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{completedGoals}/{totalGoals} goals</span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                            </div>
                            
                            <div className="flex justify-between items-centre text-sm">
                              <div>
                                <span className="text-muted-foreground">Next meeting: </span>
                                {mentorship.meetings.find(m => m.status === 'Scheduled')?.date ? (
                                  new Date(mentorship.meetings.find(m => m.status === 'Scheduled')?.date).toLocaleDateString('en-GB')
                                ) : (
                                  'None scheduled'
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2"
                                onClick={() => handleSelectMentorship(mentorship)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {activeMentorships.length === 0 && (
                    <div className="text-centre py-12">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No active mentorships</h3>
                      <p className="text-muted-foreground mt-2">
                        Find a mentor to start your professional development journey
                      </p>
                      <Button className="mt-4" onClick={() => setActiveTab('find')}>
                        Find a Mentor
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="pending" className="mt-4">
                  <div className="text-centre py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No pending requests</h3>
                    <p className="text-muted-foreground mt-2">
                      You don't have any pending mentorship requests
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="past" className="mt-4">
                  <div className="text-centre py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No past mentorships</h3>
                    <p className="text-muted-foreground mt-2">
                      Your completed mentorships will appear here
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Mentorship Details Dialog */}
          <Dialog open={showMentorshipDetails} onOpenChange={setShowMentorshipDetails}>
            <DialogContent className="sm:max-w-[700px]">
              {selectedMentorship && (
                <>
                  <DialogHeader>
                    <DialogTitle>Mentorship Details</DialogTitle>
                    <DialogDescription>
                      View and manage your mentorship relationship
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={MOCK_MENTORS.find(m => m.id === selectedMentorship.mentorId)?.avatarUrl} 
                            alt={MOCK_MENTORS.find(m => m.id === selectedMentorship.mentorId)?.name} 
                          />
                          <AvatarFallback>
                            {MOCK_MENTORS.find(m => m.id === selectedMentorship.mentorId)?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {MOCK_MENTORS.find(m => m.id === selectedMentorship.mentorId)?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {MOCK_MENTORS.find(m => m.id === selectedMentorship.mentorId)?.role}
                          </p>
                        </div>
                      </div>
                      <Badge>{selectedMentorship.status}</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-medium">{new Date(selectedMentorship.startDate).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">End Date</p>
                        <p className="font-medium">{new Date(selectedMentorship.endDate).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Focus Areas</p>
                        <p className="font-medium">
                          {selectedMentorship.focusAreas.map(id => {
                            const area = EXPERTISE_AREAS.find(e => e.id === id);
                            return area ? area.name : '';
                          }).join(', ')}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Goals</h4>
                      <div className="space-y-2">
                        {selectedMentorship.goals.map((goal) => (
                          <div key={goal.id} className="flex items-centre justify-between p-2 border rounded-md">
                            <div className="flex items-centre space-x-2">
                              {goal.status === 'Completed' ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : goal.status === 'In Progress' ? (
                                <Clock className="h-5 w-5 text-blue-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                              <span>{goal.text}</span>
                            </div>
                            <Badge variant={
                              goal.status === 'Completed' ? 'default' : 
                              goal.status === 'In Progress' ? 'secondary' : 
                              'outline'
                            }>
                              {goal.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Tabs defaultValue="meetings">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="meetings">Meetings</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                        <TabsTrigger value="feedback">Feedback</TabsTrigger>
                      </TabsList>
                      <TabsContent value="meetings" className="mt-4 space-y-4">
                        <div className="flex justify-between items-centre">
                          <h4 className="font-medium">Meeting History</h4>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Schedule Meeting
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {selectedMentorship.meetings.map((meeting) => (
                            <div key={meeting.id} className="flex items-centre justify-between p-3 border rounded-md">
                              <div className="flex items-centre space-x-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{new Date(meeting.date).toLocaleDateString('en-GB')}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {meeting.notes || 'No notes added'}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={
                                meeting.status === 'Completed' ? 'default' : 
                                meeting.status === 'Scheduled' ? 'secondary' : 
                                'outline'
                              }>
                                {meeting.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="resources" className="mt-4 space-y-4">
                        <div className="flex justify-between items-centre">
                          <h4 className="font-medium">Shared Resources</h4>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Share Resource
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {selectedMentorship.resources.map((resource) => (
                            <div key={resource.id} className="flex items-centre justify-between p-3 border rounded-md">
                              <div className="flex items-centre space-x-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{resource.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {resource.type} • Shared on {new Date(resource.shared).toLocaleDateString('en-GB')}
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="feedback" className="mt-4 space-y-4">
                        <div className="flex justify-between items-centre">
                          <h4 className="font-medium">Feedback</h4>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Feedback
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {selectedMentorship.feedback.map((feedback) => (
                            <div key={feedback.id} className="p-3 border rounded-md">
                              <div className="flex items-centre justify-between mb-2">
                                <div className="flex items-centre">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(feedback.date).toLocaleDateString('en-GB')}
                                </span>
                              </div>
                              <p className="text-sm">{feedback.comment}</p>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowMentorshipDetails(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* My Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-centre">
                <div>
                  <CardTitle>My {profileType === 'mentor' ? 'Mentor' : 'Mentee'} Profile</CardTitle>
                  <CardDescription>
                    Manage your profile information and preferences
                  </CardDescription>
                </div>
                {!isEditingProfile ? (
                  <Button onClick={() => setIsEditingProfile(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && !isEditingProfile ? (
                <div className="flex justify-centre items-centre py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-centre space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={userProfile?.avatarUrl} alt={userProfile?.name} />
                      <AvatarFallback>{userProfile?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-medium">{userProfile?.name}</h3>
                      {!isEditingProfile ? (
                        <p className="text-muted-foreground">{profileData.role} at {profileData.school}</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="space-y-1">
                            <Label htmlFor="role">Role</Label>
                            <Input 
                              id="role" 
                              value={profileData.role} 
                              onChange={(e) => handleProfileDataChange('role', e.target.value)} 
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="school">School/Institution</Label>
                            <Input 
                              id="school" 
                              value={profileData.school} 
                              onChange={(e) => handleProfileDataChange('school', e.target.value)} 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Teaching Context</h4>
                      {!isEditingProfile ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Phase</p>
                              <p>{profileData.phase}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Experience</p>
                              <p>{profileData.yearsExperience} years</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Subjects</p>
                            <p>{profileData.subjects.join(', ')}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label htmlFor="phase">School Phase</Label>
                              <Select 
                                value={profileData.phase} 
                                onValueChange={(value) => handleProfileDataChange('phase', value)}
                              >
                                <SelectTrigger id="phase">
                                  <SelectValue placeholder="Select phase" />
                                </SelectTrigger>
                                <SelectContent>
                                  {SCHOOL_PHASES.map((phase) => (
                                    <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="yearsExperience">Years Experience</Label>
                              <Input 
                                id="yearsExperience" 
                                type="number" 
                                min="0"
                                value={profileData.yearsExperience} 
                                onChange={(e) => handleProfileDataChange('yearsExperience', parseInt(e.target.value))} 
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label>Subjects</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {SUBJECTS.slice(0, 10).map((subject) => (
                                <div key={subject} className="flex items-centre space-x-2">
                                  <Checkbox 
                                    id={`subject-${subject}`} 
                                    checked={profileData.subjects.includes(subject)}
                                    onCheckedChange={() => handleSubjectChange(subject)}
                                  />
                                  <Label 
                                    htmlFor={`subject-${subject}`}
                                    className="text-sm font-normal"
                                  >
                                    {subject}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <Button variant="outline" size="sm" className="mt-2">
                              Show More Subjects
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">
                        {profileType === 'mentee' ? 'Development Goals' : 'Mentoring Preferences'}
                      </h4>
                      {!isEditingProfile ? (
                        <div className="space-y-2">
                          <p className="text-sm">{profileData.goals}</p>
                          {profileType === 'mentor' && (
                            <div>
                              <p className="text-sm text-muted-foreground">Availability</p>
                              <p>{profileData.availability || 'Not specified'}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="goals">
                              {profileType === 'mentee' ? 'What are your professional development goals?' : 'What can you offer as a mentor?'}
                            </Label>
                            <Textarea 
                              id="goals" 
                              value={profileData.goals} 
                              onChange={(e) => handleProfileDataChange('goals', e.target.value)} 
                              rows={4}
                            />
                          </div>
                          {profileType === 'mentor' && (
                            <div className="space-y-1">
                              <Label htmlFor="availability">Availability</Label>
                              <Input 
                                id="availability" 
                                value={profileData.availability} 
                                onChange={(e) => handleProfileDataChange('availability', e.target.value)} 
                                placeholder="e.g., Weekly, evenings"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">
                      {profileType === 'mentee' ? 'Areas of Interest' : 'Areas of Expertise'}
                    </h4>
                    {!isEditingProfile ? (
                      <div className="flex flex-wrap gap-2">
                        {profileData.expertise.map((expertiseId) => {
                          const expertise = EXPERTISE_AREAS.find(e => e.id === expertiseId);
                          return expertise ? (
                            <Badge key={expertise.id} variant="secondary">
                              {expertise.name}
                            </Badge>
                          ) : null;
                        })}
                        {profileData.expertise.length === 0 && (
                          <p className="text-muted-foreground">No areas specified</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          {EXPERTISE_AREAS.map((area) => (
                            <div key={area.id} className="flex items-centre space-x-2">
                              <Checkbox 
                                id={`expertise-${area.id}`} 
                                checked={profileData.expertise.includes(area.id)}
                                onCheckedChange={() => handleExpertiseChange(area.id)}
                              />
                              <Label 
                                htmlFor={`expertise-${area.id}`}
                                className="text-sm font-normal"
                              >
                                {area.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {profileType === 'mentor' && (
                          <div className="mt-4">
                            <Label className="mb-2 block">Proficiency Levels</Label>
                            <div className="space-y-4">
                              {profileData.expertise.slice(0, 3).map((expertiseId) => {
                                const expertise = EXPERTISE_AREAS.find(e => e.id === expertiseId);
                                return expertise ? (
                                  <div key={expertise.id} className="space-y-2">
                                    <div className="flex justify-between items-centre">
                                      <Label>{expertise.name}</Label>
                                      <span className="text-sm">Advanced</span>
                                    </div>
                                    <Slider defaultValue={[75]} max={100} step={1} />
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!isEditingProfile && profileType === 'mentor' && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h4 className="font-medium">Mentorship Statistics</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-centre">
                                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                                <p className="text-2xl font-bold">12</p>
                                <p className="text-sm text-muted-foreground">Active Mentees</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-centre">
                                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold">4.8</p>
                                <p className="text-sm text-muted-foreground">Average Rating</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-centre">
                                <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold">24</p>
                                <p className="text-sm text-muted-foreground">Goals Achieved</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Mentorship Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Mentorships</p>
                      <p className="text-2xl font-bold">{activeMentorships.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Goals Completed</span>
                      <span>8/12</span>
                    </div>
                    <Progress value={66} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Meetings Attended</span>
                      <span>12/15</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Resources Shared</span>
                      <span>18</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Goal Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mentorshipProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="completed" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Expertise Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={expertiseDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expertiseDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mentorship Activity</CardTitle>
              <CardDescription>
                Track your mentorship engagement over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={mentorshipActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="meetings" stroke="#0ea5e9" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="resources" stroke="#10b981" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeMentorships.flatMap(mentorship => 
                    mentorship.meetings
                      .filter(meeting => meeting.status === 'Scheduled')
                      .map(meeting => ({
                        id: meeting.id,
                        mentorshipId: mentorship.id,
                        date: meeting.date,
                        mentor: MOCK_MENTORS.find(m => m.id === mentorship.mentorId)?.name,
                        mentee: MOCK_MENTEES.find(m => m.id === mentorship.menteeId)?.name
                      }))
                  ).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3).map(meeting => (
                    <div key={meeting.id} className="flex items-centre justify-between p-3 border rounded-md">
                      <div className="flex items-centre space-x-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{new Date(meeting.date).toLocaleDateString('en-GB')}</p>
                          <p className="text-sm text-muted-foreground">
                            With {profileType === 'mentor' ? meeting.mentee : meeting.mentor}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                  {activeMentorships.flatMap(m => m.meetings).filter(m => m.status === 'Scheduled').length === 0 && (
                    <div className="text-centre py-8">
                      <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No upcoming meetings</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre justify-between p-3 border rounded-md">
                    <div className="flex items-centre space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Effective Questioning Techniques</p>
                        <p className="text-sm text-muted-foreground">PDF Guide • Teaching & Learning</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-centre justify-between p-3 border rounded-md">
                    <div className="flex items-centre space-x-3">
                      <Video className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Differentiation in Practise</p>
                        <p className="text-sm text-muted-foreground">Video • 28 mins • Inclusion</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-centre justify-between p-3 border rounded-md">
                    <div className="flex items-centre space-x-3">
                      <BookOpen className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Behaviour Management Toolkit</p>
                        <p className="text-sm text-muted-foreground">Resource Pack • Classroom Management</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
