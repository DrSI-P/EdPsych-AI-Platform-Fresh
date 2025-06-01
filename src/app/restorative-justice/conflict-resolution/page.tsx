'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  FileText,
  Calendar,
  Clock,
  Bookmark
} from 'lucide-react';
import Link from 'next/link';

export default function ConflictResolutionPage() {
  const [activeTab, setActiveTab] = useState('process');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Sample templates for conflict resolution
  const templates = [
    {
      id: 1,
      title: "Peer Conflict Resolution",
      description: "For resolving conflicts between students of similar age",
      ageGroup: "Primary",
      steps: [
        "Establish a calm environment",
        "Allow each person to share their perspective",
        "Identify feelings and needs",
        "Brainstorm solutions together",
        "Agree on a solution and follow-up plan"
      ]
    },
    {
      id: 2,
      title: "Teacher-Student Mediation",
      description: "For addressing misunderstandings between teachers and students",
      ageGroup: "Secondary",
      steps: [
        "Create a private, neutral setting",
        "Clarify the purpose of the conversation",
        "Exchange perspectives with active listening",
        "Identify underlying needs and concerns",
        "Develop mutual agreements and check understanding"
      ]
    },
    {
      id: 3,
      title: "Group Conflict Resolution",
      description: "For addressing conflicts involving multiple students",
      ageGroup: "All",
      steps: [
        "Establish ground rules for the discussion",
        "Allow each group member to speak without interruption",
        "Identify common interests and goals",
        "Generate solutions that address everyone's concerns",
        "Create an action plan with specific responsibilities"
      ]
    }
  ];
  
  // Sample case studies
  const caseStudies = [
    {
      id: 1,
      title: "Playground Dispute Resolution",
      school: "Oakwood Primary School",
      outcome: "95% reduction in playground incidents",
      description: "Implemented peer mediation programme for Year 5-6 students to resolve minor playground conflicts."
    },
    {
      id: 2,
      title: "Classroom Harmony Project",
      school: "Westfield Secondary Academy",
      outcome: "Improved classroom behaviour and engagement",
      description: "Weekly circle time using restorative practices to address classroom tensions and build community."
    },
    {
      id: 3,
      title: "Whole-School Approach",
      school: "Riverdale Community School",
      outcome: "50% reduction in exclusions over one year",
      description: "Comprehensive restorative justice implementation across all year groups and staff training."
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Conflict Resolution Tools</h1>
        <p className="text-muted-foreground text-lg">
          Evidence-based approaches to resolve conflicts and build stronger relationships
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tabs Navigation */}
          <Tabs defaultValue="process" onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
            </TabsList>
            
            {/* Process Tab */}
            <TabsContent value="process">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>The Restorative Justice Process</CardTitle>
                    <CardDescription>
                      A step-by-step approach to resolving conflicts through restorative practices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div variants={itemVariants} className="mb-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="flex items-center justify-center bg-primary text-white rounded-full w-8 h-8 mr-3">1</span>
                        Preparation
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Create a safe, neutral environment for all participants. Ensure everyone understands the process and agrees to participate voluntarily.
                      </p>
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <h4 className="font-medium mb-2">Key Considerations:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Ensure private, comfortable space</li>
                          <li>Allow adequate time without interruptions</li>
                          <li>Consider power dynamics and seating arrangements</li>
                          <li>Prepare participants with clear expectations</li>
                        </ul>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="mb-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="flex items-center justify-center bg-primary text-white rounded-full w-8 h-8 mr-3">2</span>
                        Perspective Sharing
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Each person shares their experience of what happened, how they were affected, and what they need to move forward. Active listening is essential.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                          <h4 className="font-medium text-green-700 mb-2">Effective Questions:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-green-800">
                            <li>"What happened from your perspective?"</li>
                            <li>"How did this situation affect you?"</li>
                            <li>"What were you thinking/feeling at the time?"</li>
                          </ul>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                          <h4 className="font-medium text-red-700 mb-2">Avoid:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-red-800">
                            <li>"Why did you do that?"</li>
                            <li>Leading or accusatory questions</li>
                            <li>Interrupting or dismissing feelings</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="mb-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="flex items-center justify-center bg-primary text-white rounded-full w-8 h-8 mr-3">3</span>
                        Exploring Impact
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Participants discuss how the situation has affected them, their relationships, and the wider community. This builds empathy and understanding.
                      </p>
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <h4 className="font-medium mb-2">Impact Areas to Explore:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-start">
                            <div className="bg-primary/20 p-2 rounded mr-2">
                              <Users size={18} className="text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium">Relationships</h5>
                              <p className="text-sm text-muted-foreground">Trust, communication, cooperation</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-primary/20 p-2 rounded mr-2">
                              <MessageSquare size={18} className="text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium">Emotional</h5>
                              <p className="text-sm text-muted-foreground">Feelings, stress, wellbeing</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="mb-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="flex items-center justify-center bg-primary text-white rounded-full w-8 h-8 mr-3">4</span>
                        Finding Solutions
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Participants work together to identify solutions that address everyone's needs and repair harm. Focus on specific, actionable agreements.
                      </p>
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <h4 className="font-medium mb-2">Solution Criteria:</h4>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <CheckCircle size={20} className="text-green-500 mr-2 mt-0.5" />
                            <div>
                              <h5 className="font-medium">Specific & Measurable</h5>
                              <p className="text-sm text-muted-foreground">Clear actions that can be observed</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle size={20} className="text-green-500 mr-2 mt-0.5" />
                            <div>
                              <h5 className="font-medium">Agreed by All</h5>
                              <p className="text-sm text-muted-foreground">Everyone commits to the solution</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle size={20} className="text-green-500 mr-2 mt-0.5" />
                            <div>
                              <h5 className="font-medium">Realistic & Achievable</h5>
                              <p className="text-sm text-muted-foreground">Can be accomplished with available resources</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle size={20} className="text-green-500 mr-2 mt-0.5" />
                            <div>
                              <h5 className="font-medium">Time-bound</h5>
                              <p className="text-sm text-muted-foreground">Clear timeline for implementation</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="flex items-center justify-center bg-primary text-white rounded-full w-8 h-8 mr-3">5</span>
                        Agreement & Follow-up
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Document agreements, establish monitoring mechanisms, and schedule follow-up meetings to ensure progress and accountability.
                      </p>
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <h4 className="font-medium mb-2">Follow-up Plan:</h4>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="bg-primary/20 p-2 rounded mr-2">
                              <FileText size={18} className="text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium">Document Agreement</h5>
                              <p className="text-sm text-muted-foreground">Written record of commitments</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-primary/20 p-2 rounded mr-2">
                              <Calendar size={18} className="text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium">Schedule Check-ins</h5>
                              <p className="text-sm text-muted-foreground">Regular monitoring of progress</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-primary/20 p-2 rounded mr-2">
                              <Users size={18} className="text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium">Support Network</h5>
                              <p className="text-sm text-muted-foreground">Identify resources for ongoing support</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* Templates Tab */}
            <TabsContent value="templates">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Conflict Resolution Templates</CardTitle>
                    <CardDescription>
                      Age-appropriate templates for different conflict scenarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {templates.map((template) => (
                        <motion.div 
                          key={template.id}
                          variants={itemVariants}
                          className="cursor-pointer"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <Card className={`hover:shadow-md transition-shadow ${selectedTemplate?.id === template.id ? 'border-primary' : ''}`}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{template.title}</CardTitle>
                                <Badge variant="outline">{template.ageGroup}</Badge>
                              </div>
                              <CardDescription>{template.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className="pt-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-primary"
                                onClick={() => setSelectedTemplate(template)}
                              >
                                View Template <ArrowRight className="ml-1 h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                    
                    {selectedTemplate && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card className="border-primary/50 bg-primary/5">
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <CardTitle>{selectedTemplate.title}</CardTitle>
                              <Badge>{selectedTemplate.ageGroup}</Badge>
                            </div>
                            <CardDescription>{selectedTemplate.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <h3 className="font-medium mb-3">Process Steps:</h3>
                            <div className="space-y-3">
                              {selectedTemplate.steps.map((step, index) => (
                                <div key={index} className="flex items-start">
                                  <div className="flex items-center justify-center bg-primary text-white rounded-full w-6 h-6 mr-3 text-sm">
                                    {index + 1}
                                  </div>
                                  <p>{step}</p>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-6 space-y-4">
                              <h3 className="font-medium">Guiding Questions:</h3>
                              <div className="bg-white p-4 rounded-lg border">
                                <h4 className="text-sm font-medium text-primary mb-2">For the Affected Person:</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                  <li>What happened from your perspective?</li>
                                  <li>How has this affected you?</li>
                                  <li>What has been the hardest part for you?</li>
                                  <li>What do you need to make things right?</li>
                                </ul>
                              </div>
                              
                              <div className="bg-white p-4 rounded-lg border">
                                <h4 className="text-sm font-medium text-primary mb-2">For the Person Responsible:</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                  <li>What happened from your perspective?</li>
                                  <li>What were you thinking/feeling at the time?</li>
                                  <li>Who has been affected by your actions?</li>
                                  <li>What can you do to make things right?</li>
                                </ul>
                              </div>
                              
                              <div className="bg-white p-4 rounded-lg border">
                                <h4 className="text-sm font-medium text-primary mb-2">For Both Parties:</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                  <li>What would help resolve this situation?</li>
                                  <li>What support do you need moving forward?</li>
                                  <li>How can we prevent this from happening again?</li>
                                  <li>What have you learned from this experience?</li>
                                </ul>
                              </div>
                            </div>
                            
                            <div className="mt-6">
                              <Button className="w-full">Download Template</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* Case Studies Tab */}
            <TabsContent value="case-studies">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>UK School Case Studies</CardTitle>
                    <CardDescription>
                      Real-world examples of restorative justice implementation in UK schools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {caseStudies.map((study) => (
                        <motion.div key={study.id} variants={itemVariants}>
                          <Card>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{study.title}</CardTitle>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                  {study.school}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                              <p className="mb-3">{study.description}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                <span className="font-medium text-green-700">Outcome: {study.outcome}</span>
                              </div>
                            </CardContent>
                            <CardFooter className="border-t pt-4">
                              <Button variant="outline" size="sm" className="mr-2">
                                <FileText className="mr-1 h-4 w-4" /> Full Case Study
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Bookmark className="mr-1 h-4 w-4" /> Save
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-8">
          {/* UK Educational Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  UK Educational Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Restorative approaches align with the UK Department for Education's guidance on behaviour management and social-emotional learning.
                  </p>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">Key UK Policy Connections:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Behaviour and Discipline in Schools (DfE)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>PSHE Curriculum Framework</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Mental Health and Behaviour in Schools (DfE)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Ofsted Framework for Personal Development</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Research Evidence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Research Evidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">UK Research Findings:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Youth Justice Board (2018)</p>
                          <p className="text-muted-foreground">21-26% reduction in reoffending rates</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Education Endowment Foundation</p>
                          <p className="text-muted-foreground">Improved behaviour and attendance outcomes</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Restorative Justice Council</p>
                          <p className="text-muted-foreground">85% victim satisfaction with restorative processes</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Training Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Training Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full">Access Training Module</Button>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">Available Resources:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Clock className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>30-minute introductory video</span>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Downloadable facilitation guides</span>
                      </li>
                      <li className="flex items-start">
                        <Users className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Role-play scenarios with guidance</span>
                      </li>
                      <li className="flex items-start">
                        <MessageSquare className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Script templates for different ages</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Implementation Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-primary" />
              Implementation Support
            </CardTitle>
            <CardDescription>
              Resources to help you implement restorative practices in your educational setting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Staff Training</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive training materials for all staff levels, from introductory to advanced facilitation.
                  </p>
                  <Button variant="outline" className="w-full">Access Training</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Implementation Guide</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Step-by-step guide for implementing restorative approaches across your school or organisation.
                  </p>
                  <Button variant="outline" className="w-full">Download Guide</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Consultation Support</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with educational psychologists and restorative practice experts for personalised guidance.
                  </p>
                  <Button variant="outline" className="w-full">Book Consultation</Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link href="/educator/dashboard">
            Back to Dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/restorative-justice/agreement-tracking">
            Agreement Tracking <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
