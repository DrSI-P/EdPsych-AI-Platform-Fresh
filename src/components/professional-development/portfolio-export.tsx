'use client';

import React, { useState } from 'react';
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
  MoreHorizontal,
  Download,
  Copy,
  Link,
  Eye,
  Mail,
  Loader2
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Sample data for demonstration
const sampleUserProfile = {
  name: "Dr. Sarah Johnson",
  role: "Educational Psychologist",
  school: "Oakwood Academy",
  email: "sarah.johnson@oakwood.edu",
  phone: "+44 7700 900123",
  bio: "Educational Psychologist with 10+ years of experience working with children and young people with special educational needs. Specializing in assessment, intervention, and support for students with learning difficulties.",
  qualifications: [
    "PhD in Educational Psychology, University of Cambridge",
    "MSc in Child Psychology, University College London",
    "BSc in Psychology, University of Manchester"
  ],
  specialties: ["ADHD", "Dyslexia", "Autism", "Behavior Management"],
  profileImage: "/avatars/user.jpg"
};

const sampleAchievements = [
  {
    id: 1,
    title: "School-Wide Intervention Program",
    description: "Developed and implemented a school-wide intervention program for students with reading difficulties, resulting in a 35% improvement in literacy scores.",
    date: "March 2025",
    type: "Professional",
    evidence: ["report.pdf", "presentation.pptx"]
  },
  {
    id: 2,
    title: "Research Publication",
    description: "Published research on effective strategies for supporting students with ADHD in mainstream classrooms in the Journal of Educational Psychology.",
    date: "January 2025",
    type: "Academic",
    evidence: ["publication.pdf"]
  },
  {
    id: 3,
    title: "Conference Presentation",
    description: "Presented at the International Educational Psychology Conference on innovative assessment techniques for identifying learning needs.",
    date: "November 2024",
    type: "Professional",
    evidence: ["conference_slides.pdf", "certificate.pdf"]
  }
];

const sampleEvidence = [
  {
    id: 1,
    title: "Intervention Program Documentation",
    description: "Comprehensive documentation of the school-wide intervention program, including methodology, resources, and outcomes.",
    date: "March 2025",
    type: "Document",
    files: ["program_documentation.pdf", "resources.zip"]
  },
  {
    id: 2,
    title: "Assessment Framework",
    description: "Developed assessment framework for identifying specific learning difficulties, now adopted by multiple schools in the district.",
    date: "February 2025",
    type: "Framework",
    files: ["assessment_framework.pdf", "templates.docx"]
  },
  {
    id: 3,
    title: "Parent Workshop Materials",
    description: "Materials developed for parent workshops on supporting children with special educational needs at home.",
    date: "December 2024",
    type: "Resources",
    files: ["workshop_slides.pptx", "handouts.pdf", "activities.pdf"]
  }
];

const sampleReflections = [
  {
    id: 1,
    title: "Implementing Multi-Tiered Support Systems",
    content: "Reflecting on the challenges and successes of implementing MTSS in a diverse school environment. The key learning points included the importance of staff buy-in, consistent data collection, and regular review meetings. Moving forward, I plan to develop more streamlined progress monitoring tools.",
    date: "April 2025",
    tags: ["MTSS", "Implementation", "School Systems"]
  },
  {
    id: 2,
    title: "Case Study: Supporting a Student with Complex Needs",
    content: "This reflection explores my work with a student presenting with both ADHD and anxiety. The intervention approach combined environmental modifications, cognitive-behavioral strategies, and collaborative work with teachers and parents. The most significant challenge was balancing academic expectations with emotional support needs.",
    date: "February 2025",
    tags: ["Case Study", "ADHD", "Anxiety", "Intervention"]
  },
  {
    id: 3,
    title: "Professional Development Journey",
    content: "Reflecting on my professional development over the past year, including the impact of specialized training in trauma-informed practices. This has significantly changed my approach to behavioral interventions and assessment practices. Areas for future development include advanced therapeutic techniques and supervision skills.",
    date: "January 2025",
    tags: ["Professional Development", "Trauma-Informed Practice", "Reflection"]
  }
];

const sampleCPDActivities = [
  {
    id: 1,
    title: "Trauma-Informed Practice in Schools",
    provider: "National Association of Educational Psychologists",
    type: "Course",
    date: "March 2025",
    hours: 15,
    status: "Completed",
    certificate: "certificate_trauma_informed.pdf",
    notes: "Excellent course providing practical strategies for implementing trauma-informed approaches in educational settings."
  },
  {
    id: 2,
    title: "Advanced Assessment Techniques",
    provider: "Educational Psychology Institute",
    type: "Workshop",
    date: "February 2025",
    hours: 8,
    status: "Completed",
    certificate: "certificate_assessment.pdf",
    notes: "Focused on dynamic assessment approaches and ecological evaluation methods."
  },
  {
    id: 3,
    title: "Supervision Skills for Educational Psychologists",
    provider: "British Psychological Society",
    type: "Course",
    date: "Ongoing",
    hours: 20,
    status: "In Progress",
    certificate: "",
    notes: "Currently completing modules on reflective practice and ethical supervision."
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function PortfolioExport() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeContent, setIncludeContent] = useState({
    profile: true,
    achievements: true,
    evidence: true,
    reflections: true,
    cpd: true
  });

  // Handle form field change
  const handleFieldChange = (field) => {
    setIncludeContent({
      ...includeContent,
      [field]: !includeContent[field]
    });
  };

  // Generate PDF
  const handleGeneratePDF = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setShowExportSuccess(true);
    }, 3000);
  };

  // Generate shareable link
  const handleGenerateLink = () => {
    setIsSharing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSharing(false);
      setGeneratedLink('https://edpsych-connect.com/portfolio/share/abc123');
      setShowShareSuccess(true);
    }, 2000);
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    // Show copy success message
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Showcase & Export</h1>
          <p className="text-muted-foreground">
            Create professional exports of your portfolio for sharing or accreditation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab('preview')}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => setActiveTab('export')}>
            <Download className="h-4 w-4 mr-2" />
            Export Options
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
          <TabsTrigger value="share">Share Portfolio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Preview</CardTitle>
              <CardDescription>
                Preview how your portfolio will appear when exported
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Professional Profile</h2>
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={sampleUserProfile.profileImage} alt={sampleUserProfile.name} />
                    <AvatarFallback>{sampleUserProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{sampleUserProfile.name}</h3>
                    <p className="text-muted-foreground">{sampleUserProfile.role} • {sampleUserProfile.school}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sampleUserProfile.specialties.map((specialty, i) => (
                        <Badge key={i} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Biography</h4>
                  <p>{sampleUserProfile.bio}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Qualifications</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {sampleUserProfile.qualifications.map((qualification, i) => (
                      <li key={i}>{qualification}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Professional Achievements</h2>
                <div className="grid gap-4">
                  {sampleAchievements.map((achievement) => (
                    <Card key={achievement.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.date} • {achievement.type}</p>
                          </div>
                          <Badge>{achievement.type}</Badge>
                        </div>
                        <p className="mt-2">{achievement.description}</p>
                        {achievement.evidence.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Evidence:</p>
                            <div className="flex gap-2 mt-1">
                              {achievement.evidence.map((item, i) => (
                                <Badge key={i} variant="outline">{item}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline">View Full Preview</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Portfolio</CardTitle>
              <CardDescription>
                Create a professional export of your portfolio for sharing or accreditation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Export Format</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer ${exportFormat === 'pdf' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                      onClick={() => setExportFormat('pdf')}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-medium">PDF Document</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Professional document format suitable for printing and sharing</p>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer ${exportFormat === 'web' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                      onClick={() => setExportFormat('web')}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        <span className="font-medium">Web Portfolio</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Interactive web version with links and multimedia content</p>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer ${exportFormat === 'docx' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                      onClick={() => setExportFormat('docx')}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-medium">Word Document</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Editable document format for further customization</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Content to Include</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="profile" 
                        checked={includeContent.profile}
                        onCheckedChange={() => handleFieldChange('profile')}
                      />
                      <label
                        htmlFor="profile"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Professional Profile
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="achievements" 
                        checked={includeContent.achievements}
                        onCheckedChange={() => handleFieldChange('achievements')}
                      />
                      <label
                        htmlFor="achievements"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Professional Achievements
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="evidence" 
                        checked={includeContent.evidence}
                        onCheckedChange={() => handleFieldChange('evidence')}
                      />
                      <label
                        htmlFor="evidence"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Evidence & Documentation
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="reflections" 
                        checked={includeContent.reflections}
                        onCheckedChange={() => handleFieldChange('reflections')}
                      />
                      <label
                        htmlFor="reflections"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Professional Reflections
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cpd" 
                        checked={includeContent.cpd}
                        onCheckedChange={() => handleFieldChange('cpd')}
                      />
                      <label
                        htmlFor="cpd"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        CPD Activities
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Additional Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cover" />
                      <label
                        htmlFor="cover"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include Cover Page
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="toc" />
                      <label
                        htmlFor="toc"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include Table of Contents
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="appendix" />
                      <label
                        htmlFor="appendix"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include Appendices
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="contact" />
                      <label
                        htmlFor="contact"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include Contact Information
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('preview')}>
                Preview
              </Button>
              <Button onClick={handleGeneratePDF} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate {exportFormat.toUpperCase()}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {showExportSuccess && (
            <Card className="border-green-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="font-medium text-green-500">Portfolio export generated successfully!</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download Portfolio
                  </Button>
                  <Button variant="outline" onClick={() => setShowExportSuccess(false)}>
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="share" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Portfolio</CardTitle>
              <CardDescription>
                Create a shareable link to your portfolio for colleagues or accreditation bodies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Sharing Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Link className="h-5 w-5 text-primary" />
                        <span className="font-medium">Shareable Link</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Generate a link that can be shared with others</p>
                      <div className="mt-4">
                        <Button onClick={handleGenerateLink} disabled={isSharing} className="w-full">
                          {isSharing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Link className="mr-2 h-4 w-4" />
                              Generate Link
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="font-medium">Email Portfolio</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Send your portfolio directly via email</p>
                      <div className="mt-4">
                        <Button variant="outline" className="w-full">
                          <Mail className="mr-2 h-4 w-4" />
                          Email Portfolio
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Access Control</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroup defaultValue="view">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="view" id="view" />
                          <Label htmlFor="view">View Only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="download" id="download" />
                          <Label htmlFor="download">Allow Download</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="password" />
                      <label
                        htmlFor="password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Require Password
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="expiry" />
                      <label
                        htmlFor="expiry"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Set Expiry Date
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {showShareSuccess && (
            <Card className="border-green-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="font-medium text-green-500">Shareable link generated successfully!</p>
                </div>
                <div className="mt-4">
                  <div className="flex">
                    <Input value={generatedLink} readOnly className="rounded-r-none" />
                    <Button variant="outline" className="rounded-l-none" onClick={handleCopyLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This link will allow others to view your portfolio online.
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" onClick={() => setShowShareSuccess(false)}>
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
