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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FileText, 
  Image, 
  Link, 
  Share2, 
  Download, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  BarChart3, 
  Calendar as CalendarIcon,
  Upload
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Sample data for demonstration
const sampleUserProfile = {
  name: "Sarah Johnson",
  title: "Secondary Mathematics Teacher",
  school: "Oakwood Academy",
  yearsExperience: 8,
  email: "s.johnson@oakwood.edu",
  phone: "+44 7700 900123",
  avatar: "/avatars/sarah-johnson.jpg",
  biography: "Experienced mathematics teacher with a passion for making complex concepts accessible to all learners. Specialising in differentiated instruction and technology integration to enhance mathematical understanding.",
  qualifications: [
    {
      id: 1,
      title: "PGCE Secondary Mathematics",
      institution: "University of Manchester",
      year: "2017",
      verified: true
    },
    {
      id: 2,
      title: "BSc Mathematics",
      institution: "University of Leeds",
      year: "2016",
      verified: true
    },
    {
      id: 3,
      title: "National Professional Qualification for Middle Leadership",
      institution: "Department for Education",
      year: "2020",
      verified: true
    }
  ],
  specialisations: ["Secondary Mathematics", "Technology Integration", "Differentiated Instruction", "Assessment for Learning"],
  teachingPhilosophy: "I believe that every student can succeed in mathematics with the right support and approach. My teaching focuses on building confidence, developing problem-solving skills, and creating real-world connections to mathematical concepts."
};

const sampleAchievements = [
  {
    id: 1,
    title: "Mathematics Department Lead",
    description: "Led the mathematics department to achieve a 15% improvement in GCSE results over two years through curriculum redesign and targeted intervention strategies.",
    date: "2021 - Present",
    type: "Leadership",
    evidence: ["Department improvement plan", "GCSE results analysis"],
    visibility: "public"
  },
  {
    id: 2,
    title: "Digital Learning Champion",
    description: "Implemented innovative digital tools across the school, training staff and developing resources that enhanced remote learning during the pandemic.",
    date: "2020 - 2022",
    type: "Initiative",
    evidence: ["Training materials", "Digital strategy document"],
    visibility: "public"
  },
  {
    id: 3,
    title: "Regional Mathematics Conference Presenter",
    description: "Delivered workshop on 'Making Mathematics Accessible for All' at the North West Mathematics Teachers Conference.",
    date: "November 2023",
    type: "Professional Contribution",
    evidence: ["Presentation slides", "Attendee feedback"],
    visibility: "public"
  }
];

const sampleEvidence = [
  {
    id: 1,
    title: "Year 9 Algebra Unit Plan",
    description: "Comprehensive unit plan with differentiated resources for teaching algebraic concepts to Year 9 students.",
    type: "Teaching Resource",
    date: "September 2023",
    fileUrl: "/evidence/algebra-unit-plan.pdf",
    fileType: "PDF",
    tags: ["Algebra", "Year 9", "Differentiation"],
    visibility: "public",
    associatedAchievements: [1]
  },
  {
    id: 2,
    title: "Digital Mathematics Tools Guide",
    description: "Guide created for staff on implementing digital tools in mathematics teaching, including tutorials and best practices.",
    type: "Resource",
    date: "January 2022",
    fileUrl: "/evidence/digital-maths-tools.pdf",
    fileType: "PDF",
    tags: ["Digital Learning", "Staff Development", "Mathematics"],
    visibility: "public",
    associatedAchievements: [2]
  },
  {
    id: 3,
    title: "Making Mathematics Accessible Presentation",
    description: "Slides and handouts from regional conference presentation on accessibility in mathematics education.",
    type: "Presentation",
    date: "November 2023",
    fileUrl: "/evidence/maths-accessibility-presentation.pptx",
    fileType: "PowerPoint",
    tags: ["Accessibility", "Conference", "Professional Development"],
    visibility: "public",
    associatedAchievements: [3]
  },
  {
    id: 4,
    title: "Student Progress Analysis",
    description: "Analysis of student progress data showing impact of intervention strategies on underperforming students.",
    type: "Data Analysis",
    date: "July 2023",
    fileUrl: "/evidence/progress-analysis.xlsx",
    fileType: "Excel",
    tags: ["Data", "Intervention", "Student Progress"],
    visibility: "private",
    associatedAchievements: [1]
  }
];

const sampleReflections = [
  {
    id: 1,
    title: "Implementing Mastery Approach",
    content: "Reflecting on my journey implementing a mastery approach in mathematics teaching, I\'ve observed significant improvements in student conceptual understanding. The key challenges included adjusting pacing to ensure deep learning while covering curriculum requirements. Moving forward, I plan to develop more formative assessment tools to better track conceptual development.",
    date: "2023-12-15",
    tags: ["Mastery Learning", "Curriculum Development", "Assessment"],
    visibility: "public"
  },
  {
    id: 2,
    title: "Digital Learning During Pandemic",
    content: "The rapid shift to digital learning during the pandemic presented both challenges and opportunities. While initially difficult to maintain student engagement, the development of interactive digital resources ultimately enhanced my teaching practise. I\'ve continued to incorporate these tools even after returning to classroom teaching, creating a more blended approach.",
    date: "2022-06-30",
    tags: ["Digital Learning", "Remote Teaching", "Student Engagement"],
    visibility: "public"
  },
  {
    id: 3,
    title: "Leadership Development Reflection",
    content: "Taking on the mathematics department lead role has developed my leadership skills significantly. I\'ve learned the importance of distributed leadership, clear communication, and data-informed decision making. Areas for further development include managing difficult conversations and strategic planning for longer-term department development.",
    date: "2023-08-20",
    tags: ["Leadership", "Department Management", "Professional Growth"],
    visibility: "private"
  }
];

const sampleCPDActivities = [
  {
    id: 1,
    title: "Advanced Differentiation in Mathematics",
    type: "Course",
    provider: "National Centre for Excellence in Teaching Mathematics",
    date: "2023-10-15",
    duration: 12,
    points: 12,
    status: "Completed",
    certificate: true
  },
  {
    id: 2,
    title: "Leading Effective Departments",
    type: "Webinar Series",
    provider: "Education Endowment Foundation",
    date: "2023-09-05",
    duration: 6,
    points: 6,
    status: "Completed",
    certificate: true
  },
  {
    id: 3,
    title: "Assessment for Learning in Mathematics",
    type: "Conference",
    provider: "Mathematical Association",
    date: "2023-11-20",
    duration: 7,
    points: 7,
    status: "Completed",
    certificate: false
  }
];

// Analytics data
const viewsData = [
  { month: 'Jan', views: 12 },
  { month: 'Feb', views: 19 },
  { month: 'Mar', views: 25 },
  { month: 'Apr', views: 32 },
  { month: 'May', views: 40 },
  { month: 'Jun', views: 35 },
  { month: 'Jul', views: 28 },
  { month: 'Aug', views: 22 },
  { month: 'Sep', views: 30 },
  { month: 'Oct', views: 45 },
  { month: 'Nov', views: 52 },
  { month: 'Dec', views: 38 }
];

const sectionViewsData = [
  { name: 'Profile', value: 35 },
  { name: 'Achievements', value: 25 },
  { name: 'Evidence', value: 20 },
  { name: 'Reflections', value: 15 },
  { name: 'CPD', value: 5 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ProfessionalPortfolio() {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(sampleUserProfile);
  const [achievements, setAchievements] = useState(sampleAchievements);
  const [evidence, setEvidence] = useState(sampleEvidence);
  const [reflections, setReflections] = useState(sampleReflections);
  const [cpdActivities, setCpdActivities] = useState(sampleCPDActivities);
  const [portfolioCompleteness, setPortfolioCompleteness] = useState(85);
  const [showAddAchievement, setShowAddAchievement] = useState(false);
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [showAddReflection, setShowAddReflection] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calculate portfolio completeness
  useEffect(() => {
    // In a real implementation, this would calculate based on filled sections
    // For now, we'll use the sample value
  }, [profile, achievements, evidence, reflections]);

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // In a real implementation, this would save to the database
    setEditMode(false);
    // Show success message
    alert("Profile updated successfully");
  };

  // Handle achievement visibility toggle
  const handleVisibilityToggle = (id, section) => {
    if (section === 'achievements') {
      setAchievements(achievements.map(item => 
        item.id === id 
          ? { ...item, visibility: item.visibility === 'public' ? 'private' : 'public' } 
          : item
      ));
    } else if (section === 'evidence') {
      setEvidence(evidence.map(item => 
        item.id === id 
          ? { ...item, visibility: item.visibility === 'public' ? 'private' : 'public' } 
          : item
      ));
    } else if (section === 'reflections') {
      setReflections(reflections.map(item => 
        item.id === id 
          ? { ...item, visibility: item.visibility === 'public' ? 'private' : 'public' } 
          : item
      ));
    }
  };

  // Generate portfolio PDF
  const generatePortfolioPDF = () => {
    // In a real implementation, this would generate a PDF
    alert("Portfolio PDF generation started. The file will be available for download shortly.");
  };

  // Share portfolio
  const sharePortfolio = () => {
    // In a real implementation, this would generate a shareable link
    alert("Portfolio shared. The link has been copied to your clipboard.");
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professional Portfolio</h1>
          <p className="text-muted-foreground">
            Showcase your professional journey, achievements, and expertise
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={sharePortfolio}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Portfolio
          </Button>
          <Button onClick={generatePortfolioPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Portfolio Completeness</CardTitle>
              <Badge variant="outline">{portfolioCompleteness}%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={portfolioCompleteness} className="h-2" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === 'profile' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <User className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Profile</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === 'achievements' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <Award className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Achievements</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === 'evidence' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <FileText className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Evidence</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === 'reflections' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Reflections</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTab === 'analytics' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <BarChart3 className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Analytics</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddAchievement(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddEvidence(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Evidence
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddReflection(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Reflection
            </Button>
            <Separator className="my-2" />
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("analytics")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="reflections">Reflections</TabsTrigger>
          <TabsTrigger value="cpd">CPD</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Professional Profile</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
                  {editMode ? "Cancel" : <><Edit className="mr-2 h-4 w-4" />Edit Profile</>}
                </Button>
              </div>
              <CardDescription>
                Your professional information and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!editMode ? (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="font-medium">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">{profile.title}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">About</h3>
                        <p className="mt-1">{profile.biography}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Teaching Philosophy</h3>
                        <p className="mt-1">{profile.teachingPhilosophy}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Specialisations</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.specialisations.map((specialisation, i) => (
                            <Badge key={i} variant="secondary">{specialisation}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Qualifications</h3>
                    <div className="space-y-2">
                      {profile.qualifications.map((qualification) => (
                        <div key={qualification.id} className="flex justify-between items-center p-2 border rounded-md">
                          <div>
                            <h4 className="font-medium">{qualification.title}</h4>
                            <p className="text-sm text-muted-foreground">{qualification.institution}, {qualification.year}</p>
                          </div>
                          {qualification.verified && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Verified
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p>{profile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p>{profile.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">School</p>
                        <p>{profile.school}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Experience</p>
                        <p>{profile.yearsExperience} years</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Edit form fields would go here */}
                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tabs would go here */}
      </Tabs>
    </div>
  );
}
