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

// Mock data for charts and visualizations
const MOCK_CATEGORY_DISTRIBUTION = [
  { category: "Trauma-Informed Practice", percentage: 25 },
  { category: "Neurodevelopment", percentage: 20 },
  { category: "Mental Health", percentage: 30 },
  { category: "Digital Assessment", percentage: 15 },
  { category: "Parental Engagement", percentage: 10 }
];

// Sample data for research collaboration opportunities
const researchProjects = [
  {
    id: 1,
    title: "Impact of Trauma-Informed Practices on Student Outcomes",
    institution: "University of Cambridge",
    department: "Faculty of Education",
    lead: "Prof. Emma Thompson",
    status: "Recruiting",
    deadline: "June 30, 2025",
    description: "This research project aims to evaluate the effectiveness of trauma-informed practices in educational settings. We are seeking educational psychologists to collaborate on data collection and analysis across multiple school settings.",
    requirements: ["Experience with trauma-informed approaches", "Access to school settings", "Quantitative research skills"],
    commitment: "5-10 hours per month for 12 months",
    focusAreas: ["Trauma-Informed Practice", "Student Outcomes", "School Psychology"]
  },
  {
    id: 2,
    title: "Neurodevelopmental Profiles and Personalized Learning Strategies",
    institution: "University College London",
    department: "Institute of Education",
    lead: "Dr. James Wilson",
    status: "Recruiting",
    deadline: "July 15, 2025",
    description: "This project explores the relationship between neurodevelopmental profiles and effective personalized learning strategies. We are looking for educational psychologists to contribute to assessment protocol development and implementation.",
    requirements: ["Experience with neurodevelopmental assessments", "Knowledge of personalized learning approaches", "Qualitative research skills"],
    commitment: "8-12 hours per month for 18 months",
    focusAreas: ["Neurodevelopment", "Personalized Learning", "Assessment"]
  },
  {
    id: 3,
    title: "School-Based Mental Health Interventions: Comparative Effectiveness",
    institution: "King's College London",
    department: "Institute of Psychiatry, Psychology & Neuroscience",
    lead: "Dr. Sarah Ahmed",
    status: "Ongoing",
    deadline: "Open",
    description: "This longitudinal study compares the effectiveness of different school-based mental health interventions. We are seeking educational psychologists to join our research team for implementation and evaluation phases.",
    requirements: ["Mental health intervention experience", "School-based research experience", "Mixed methods research skills"],
    commitment: "10-15 hours per month for 24 months",
    focusAreas: ["Mental Health", "Intervention", "School Psychology"]
  },
  {
    id: 4,
    title: "Digital Assessment Tools for Special Educational Needs",
    institution: "University of Edinburgh",
    department: "School of Education",
    lead: "Prof. Robert Campbell",
    status: "Planning",
    deadline: "August 31, 2025",
    description: "This project aims to develop and validate digital assessment tools for identifying special educational needs in primary school settings. We are looking for educational psychologists to contribute to tool design and validation.",
    requirements: ["Experience with SEN assessment", "Interest in digital tools", "Access to primary school settings"],
    commitment: "6-10 hours per month for 15 months",
    focusAreas: ["Digital Assessment", "SEN", "Primary Education"]
  },
  {
    id: 5,
    title: "Parental Engagement in Educational Psychology Interventions",
    institution: "University of Manchester",
    department: "School of Environment, Education and Development",
    lead: "Dr. Lisa Chen",
    status: "Recruiting",
    deadline: "July 1, 2025",
    description: "This research examines factors affecting parental engagement in educational psychology interventions. We are seeking practicing educational psychologists to contribute case studies and participate in collaborative analysis.",
    requirements: ["Experience with parent-focused interventions", "Case study documentation", "Qualitative analysis skills"],
    commitment: "4-8 hours per month for 12 months",
    focusAreas: ["Parental Engagement", "Intervention", "Case Study Research"]
  }
];

const researchPublications = [
  {
    id: 1,
    title: "Trauma-Informed Educational Psychology Practice: A Systematic Review",
    authors: "Thompson, E., Wilson, J., & Johnson, S.",
    journal: "Journal of Educational Psychology",
    year: 2024,
    doi: "10.1234/jep.2024.001",
    abstract: "This systematic review examines the evidence base for trauma-informed approaches in educational psychology practice. The review identifies key principles, implementation challenges, and outcomes across 45 studies published between 2010-2023.",
    keywords: ["Trauma-Informed Practice", "Educational Psychology", "Systematic Review"],
    citations: 12,
    link: "https://doi.org/10.1234/jep.2024.001"
  },
  {
    id: 2,
    title: "Neurodevelopmental Profiles and Academic Achievement: Implications for Personalized Learning",
    authors: "Wilson, J., Ahmed, S., & Johnson, S.",
    journal: "Educational Psychology Review",
    year: 2024,
    doi: "10.1234/epr.2024.002",
    abstract: "This study investigates the relationship between neurodevelopmental profiles and academic achievement in a sample of 250 primary school students. Results indicate specific patterns of strengths and challenges that can inform personalized learning approaches.",
    keywords: ["Neurodevelopment", "Academic Achievement", "Personalized Learning"],
    citations: 8,
    link: "https://doi.org/10.1234/epr.2024.002"
  },
  {
    id: 3,
    title: "School-Based Mental Health Interventions: A Comparative Analysis",
    authors: "Ahmed, S., Campbell, R., & Johnson, S.",
    journal: "School Psychology International",
    year: 2023,
    doi: "10.1234/spi.2023.003",
    abstract: "This study compares the effectiveness of three different school-based mental health interventions across 15 schools. Results indicate differential effectiveness based on school context and implementation factors.",
    keywords: ["Mental Health", "School-Based Intervention", "Comparative Analysis"],
    citations: 15,
    link: "https://doi.org/10.1234/spi.2023.003"
  },
  {
    id: 4,
    title: "Digital Assessment Tools for Special Educational Needs: Development and Validation",
    authors: "Campbell, R., Chen, L., & Johnson, S.",
    journal: "Journal of Special Education Technology",
    year: 2023,
    doi: "10.1234/jset.2023.004",
    abstract: "This paper describes the development and validation of a suite of digital assessment tools for identifying special educational needs in primary school settings. Psychometric properties and user experience data are presented.",
    keywords: ["Digital Assessment", "Special Educational Needs", "Validation"],
    citations: 6,
    link: "https://doi.org/10.1234/jset.2023.004"
  },
  {
    id: 5,
    title: "Parental Engagement in Educational Psychology Interventions: Barriers and Facilitators",
    authors: "Chen, L., Thompson, E., & Johnson, S.",
    journal: "Educational and Child Psychology",
    year: 2022,
    doi: "10.1234/ecp.2022.005",
    abstract: "This qualitative study explores factors affecting parental engagement in educational psychology interventions. Thematic analysis of interviews with 30 parents and 15 educational psychologists identifies key barriers and facilitators.",
    keywords: ["Parental Engagement", "Educational Psychology", "Qualitative Research"],
    citations: 20,
    link: "https://doi.org/10.1234/ecp.2022.005"
  }
];

const researchNetworks = [
  {
    id: 1,
    name: "Educational Psychology Research Collaborative",
    members: 156,
    focus: "Collaborative research in educational psychology practice",
    events: ["Annual Research Symposium", "Monthly Online Seminars", "Collaborative Grant Writing Workshops"],
    benefits: ["Access to research partners", "Collaborative funding opportunities", "Shared resources and tools"],
    joining: "Open to practicing educational psychologists and researchers"
  },
  {
    id: 2,
    name: "Neurodevelopmental Assessment Network",
    members: 89,
    focus: "Advancing neurodevelopmental assessment approaches",
    events: ["Quarterly Assessment Workshops", "Case Study Discussions", "Tool Development Sprints"],
    benefits: ["Assessment protocol sharing", "Peer supervision", "Joint publication opportunities"],
    joining: "Application-based membership for specialists in neurodevelopmental assessment"
  },
  {
    id: 3,
    name: "School Mental Health Research Alliance",
    members: 124,
    focus: "Evidence-based mental health interventions in schools",
    events: ["Biannual Conference", "Intervention Showcase Events", "Data Analysis Workshops"],
    benefits: ["Multi-site research opportunities", "Intervention resource library", "Implementation support"],
    joining: "Open to researchers and practitioners focused on school mental health"
  }
];

export default function ResearchCollaborationDashboard() {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusArea, setFocusArea] = useState('all');
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Analytics</h1>
          <p className="text-muted-foreground">
            Discover research opportunities, publications, and collaboration networks
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            My Research
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="opportunities">Research Opportunities</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="networks">Research Networks</TabsTrigger>
          <TabsTrigger value="analytics">Research Impact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="opportunities" className="space-y-4">
          {!selectedProject ? (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search research opportunities..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={focusArea} onValueChange={setFocusArea}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by focus area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Focus Areas</SelectItem>
                    <SelectItem value="Trauma-Informed Practice">Trauma-Informed Practice</SelectItem>
                    <SelectItem value="Neurodevelopment">Neurodevelopment</SelectItem>
                    <SelectItem value="Mental Health">Mental Health</SelectItem>
                    <SelectItem value="Digital Assessment">Digital Assessment</SelectItem>
                    <SelectItem value="Parental Engagement">Parental Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-4">
                {researchProjects
                  .filter(project => 
                    (searchQuery === '' || 
                      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      project.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
                    (focusArea === 'all' || project.focusAreas.includes(focusArea))
                  )
                  .map(project => (
                    <Card key={project.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{project.title}</h3>
                              <p className="text-sm text-muted-foreground">{project.institution} • {project.department}</p>
                            </div>
                            <Badge variant={project.status === 'Recruiting' ? 'default' : 'secondary'}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="mt-2 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.focusAreas.map((area, i) => (
                              <Badge key={i} variant="outline">{area}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="bg-muted p-4 flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">Lead:</span> {project.lead} • 
                            <span className="font-medium ml-2">Deadline:</span> {project.deadline}
                          </div>
                          <Button size="sm" onClick={() => setSelectedProject(project)}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => setSelectedProject(null)}>
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to opportunities
                    </Button>
                    <CardTitle>{selectedProject.title}</CardTitle>
                    <CardDescription>{selectedProject.institution} • {selectedProject.department}</CardDescription>
                  </div>
                  <Badge variant={selectedProject.status === 'Recruiting' ? 'default' : 'secondary'}>
                    {selectedProject.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Project Description</h3>
                  <p>{selectedProject.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-1">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedProject.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Project Details</h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="font-medium w-24">Lead:</span>
                        <span>{selectedProject.lead}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-24">Deadline:</span>
                        <span>{selectedProject.deadline}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-24">Commitment:</span>
                        <span>{selectedProject.commitment}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Focus Areas</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.focusAreas.map((area, i) => (
                      <Badge key={i} variant="outline">{area}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Lead Researcher
                </Button>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Express Interest
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="publications" className="space-y-4">
          <div className="relative flex-1 mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search publications..."
              className="pl-8"
            />
          </div>
          
          <div className="grid gap-4">
            {researchPublications.map(publication => (
              <Card key={publication.id}>
                <CardContent className="p-4">
                  <div>
                    <h3 className="font-semibold">{publication.title}</h3>
                    <p className="text-sm text-muted-foreground">{publication.authors} • {publication.journal}, {publication.year}</p>
                  </div>
                  <p className="mt-2 text-sm">{publication.abstract}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {publication.keywords.map((keyword, i) => (
                      <Badge key={i} variant="outline">{keyword}</Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>DOI: {publication.doi}</span>
                      <Star className="h-4 w-4 ml-3 mr-1" />
                      <span>{publication.citations} citations</span>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={publication.link} target="_blank" rel="noopener noreferrer">
                        View Publication
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="networks" className="space-y-4">
          <div className="grid gap-4">
            {researchNetworks.map(network => (
              <Card key={network.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{network.name}</h3>
                      <p className="text-sm text-muted-foreground">{network.members} members • {network.focus}</p>
                    </div>
                    <Button size="sm">Join Network</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Events & Activities</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {network.events.map((event, i) => (
                          <li key={i}>{event}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Membership Benefits</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {network.benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">How to Join</h4>
                    <p className="text-sm">{network.joining}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Publication Impact</CardTitle>
                <CardDescription>Your research citation metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Publications</span>
                    <span className="text-2xl font-bold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Citations</span>
                    <span className="text-2xl font-bold">87</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">h-index</span>
                    <span className="text-2xl font-bold">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">i10-index</span>
                    <span className="text-2xl font-bold">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Research Focus</CardTitle>
                <CardDescription>Your research area distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <div className="text-center">
                  {MOCK_CATEGORY_DISTRIBUTION.map((item, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div className="w-24 text-sm text-left">{item.category}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-10 text-sm text-right ml-2">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Collaboration Network</CardTitle>
                <CardDescription>Your research collaborators</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  [Collaboration Network Visualization]
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Citation Trends</CardTitle>
              <CardDescription>Your citation metrics over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                [Citation Trends Chart]
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Research Impact</CardTitle>
              <CardDescription>Metrics beyond academic citations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Academic Impact</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Journal Articles</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conference Papers</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Book Chapters</span>
                    <span className="font-medium">2</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Practice Impact</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Practice Guidelines</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Assessment Tools</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Intervention Programs</span>
                    <span className="font-medium">1</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Public Impact</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Media Mentions</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Policy Citations</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Public Engagement Events</span>
                    <span className="font-medium">7</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
