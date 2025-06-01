'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Bell, FileText, Users, Settings, HelpCircle } from 'lucide-react';

/**
 * UK Curriculum Integration Component
 * 
 * This component enhances the Educator Dashboard with UK curriculum-specific
 * features, ensuring alignment with UK educational standards and terminology.
 */
export function UKCurriculumIntegration() {
  const [selectedKeyStage, setSelectedKeyStage] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  // Mock data for UK curriculum
  const keyStages = [
    { id: 'ks1', name: 'Key Stage 1', years: 'Years 1-2', ages: 'Ages 5-7' },
    { id: 'ks2', name: 'Key Stage 2', years: 'Years 3-6', ages: 'Ages 7-11' },
    { id: 'ks3', name: 'Key Stage 3', years: 'Years 7-9', ages: 'Ages 11-14' },
    { id: 'ks4', name: 'Key Stage 4', years: 'Years 10-11', ages: 'Ages 14-16' }
  ];
  
  const subjects = [
    { id: 'english', name: 'English', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
    { id: 'mathematics', name: 'Mathematics', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
    { id: 'science', name: 'Science', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
    { id: 'history', name: 'History', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
    { id: 'geography', name: 'Geography', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
    { id: 'art', name: 'Art and Design', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
    { id: 'computing', name: 'Computing', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
    { id: 'design', name: 'Design and Technology', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
    { id: 'languages', name: 'Languages', keyStages: ['ks2', 'ks3', 'ks4'] },
    { id: 'music', name: 'Music', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
    { id: 'pe', name: 'Physical Education', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
    { id: 'citizenship', name: 'Citizenship', keyStages: ['ks3', 'ks4'] },
    { id: 'pshe', name: 'PSHE', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] }
  ];
  
  const curriculumResources = [
    { 
      id: 'english_ks3', 
      title: 'KS3 English: Shakespeare Exploration',
      keyStage: 'ks3',
      subject: 'english',
      type: 'Unit Plan',
      objectives: [
        'Understand Shakespeare\'s language and context',
        'Analyze character development and themes',
        'Compare and contrast with modern adaptations'
      ],
      assessments: [
        'Creative writing task',
        'Character analysis essay',
        'Group performance'
      ]
    },
    { 
      id: 'maths_ks2', 
      title: 'KS2 Mathematics: Fractions and Decimals',
      keyStage: 'ks2',
      subject: 'mathematics',
      type: 'Lesson Sequence',
      objectives: [
        'Recognize and write decimal equivalents of fractions',
        'Compare and order fractions',
        'Add and subtract fractions with different denominators'
      ],
      assessments: [
        'Problem-solving worksheet',
        'Interactive quiz',
        'End-of-unit test'
      ]
    },
    { 
      id: 'science_ks4', 
      title: 'KS4 Science: Forces and Motion',
      keyStage: 'ks4',
      subject: 'science',
      type: 'GCSE Preparation',
      objectives: [
        'Understand Newton\'s laws of motion',
        'Calculate velocity, acceleration, and momentum',
        'Analyze forces in equilibrium'
      ],
      assessments: [
        'Laboratory experiment report',
        'Problem-solving assessment',
        'GCSE-style questions'
      ]
    },
    { 
      id: 'history_ks3', 
      title: 'KS3 History: Industrial Revolution',
      keyStage: 'ks3',
      subject: 'history',
      type: 'Topic Overview',
      objectives: [
        'Explain key technological developments',
        'Analyze social and economic impacts',
        'Evaluate primary and secondary sources'
      ],
      assessments: [
        'Source analysis task',
        'Extended writing assignment',
        'Group presentation'
      ]
    }
  ];
  
  // Filter resources based on selected key stage and subject
  const filteredResources = curriculumResources.filter(resource => {
    const keyStageMatch = selectedKeyStage === 'all' || resource.keyStage === selectedKeyStage;
    const subjectMatch = selectedSubject === 'all' || resource.subject === selectedSubject;
    return keyStageMatch && subjectMatch;
  });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            UK Curriculum Integration
          </CardTitle>
          <CardDescription>
            Align your teaching with the UK National Curriculum
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="key-stage" className="mb-2 block">Key Stage</Label>
              <Select value={selectedKeyStage} onValueChange={setSelectedKeyStage}>
                <SelectTrigger id="key-stage">
                  <SelectValue placeholder="Select Key Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Key Stages</SelectItem>
                  {keyStages.map(stage => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name} ({stage.years})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="subject" className="mb-2 block">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="curriculum-updates" className="font-medium">Curriculum Updates</Label>
              <p className="text-sm text-muted-foreground">Receive notifications about UK curriculum changes</p>
            </div>
            <Switch id="curriculum-updates" defaultChecked={true} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ofsted-alignment" className="font-medium">Ofsted Alignment</Label>
              <p className="text-sm text-muted-foreground">Highlight Ofsted framework requirements</p>
            </div>
            <Switch id="ofsted-alignment" defaultChecked={true} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Resources</CardTitle>
          <CardDescription>
            UK curriculum-aligned teaching materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="resources">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="objectives">Objectives</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resources" className="pt-4 space-y-4">
              {filteredResources.length > 0 ? (
                filteredResources.map(resource => (
                  <Card key={resource.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {resource.type}
                        </span>
                      </div>
                      <CardDescription>
                        {keyStages.find(ks => ks.id === resource.keyStage)?.name} • 
                        {subjects.find(s => s.id === resource.subject)?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Objectives:</h4>
                        <ul className="text-sm space-y-1">
                          {resource.objectives.map((obj, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View Resource
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No resources found for the selected filters.</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setSelectedKeyStage('all');
                    setSelectedSubject('all');
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="objectives" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Curriculum Objectives</CardTitle>
                  <CardDescription>
                    Track progress against UK National Curriculum objectives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedKeyStage !== 'all' ? (
                      <div className="space-y-2">
                        <h3 className="font-medium">
                          {keyStages.find(ks => ks.id === selectedKeyStage)?.name} Objectives
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Select a specific subject to view detailed objectives.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h3 className="font-medium">UK National Curriculum Objectives</h3>
                        <p className="text-sm text-muted-foreground">
                          Select a key stage and subject to view specific objectives.
                        </p>
                      </div>
                    )}
                    
                    {selectedSubject !== 'all' && selectedKeyStage !== 'all' && (
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">
                          {subjects.find(s => s.id === selectedSubject)?.name} • 
                          {keyStages.find(ks => ks.id === selectedKeyStage)?.name}
                        </h3>
                        <div className="space-y-3">
                          {filteredResources
                            .filter(r => r.subject === selectedSubject && r.keyStage === selectedKeyStage)
                            .flatMap(r => r.objectives)
                            .map((obj, idx) => (
                              <div key={idx} className="flex items-center">
                                <Switch id={`obj-${idx}`} className="mr-3" />
                                <Label htmlFor={`obj-${idx}`} className="text-sm">{obj}</Label>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Generate Progress Report
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="assessments" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">UK-Aligned Assessments</CardTitle>
                  <CardDescription>
                    Assessment tools aligned with UK grading standards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Formative Assessments</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                              Exit tickets and quick checks
                            </li>
                            <li className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                              Peer and self-assessment tools
                            </li>
                            <li className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                              Guided questioning templates
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            Browse Formative Assessments
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Summative Assessments</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                              End of unit tests and quizzes
                            </li>
                            <li className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                              Project-based assessments
                            </li>
                            <li className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                              GCSE-style practice questions
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            Browse Summative Assessments
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md">
                      <h3 className="font-medium mb-2">UK Grading Standards</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <span className="font-medium">Key Stage 1-2:</span>
                          <p className="text-muted-foreground">Working towards, Expected, Greater depth</p>
                        </div>
                        <div>
                          <span className="font-medium">Key Stage 3:</span>
                          <p className="text-muted-foreground">Developing, Secure, Extended, Exceptional</p>
                        </div>
                        <div>
                          <span className="font-medium">GCSE (9-1):</span>
                          <p className="text-muted-foreground">Grades 9-1, with 9 being highest</p>
                        </div>
                        <div>
                          <span className="font-medium">A-Level:</span>
                          <p className="text-muted-foreground">Grades A*-E</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Generate Assessment Plan
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>UK Educational Resources</CardTitle>
          <CardDescription>
            Links to official UK educational bodies and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Official Curriculum Documents</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <a href="#" className="text-primary hover:underline">National Curriculum in England</a>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <a href="#" className="text-primary hover:underline">Curriculum for Wales</a>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <a href="#" className="text-primary hover:underline">Curriculum for Excellence (Scotland)</a>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <a href="#" className="text-primary hover:underline">Northern Ireland Curriculum</a>
                </li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Educational Organizations</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <a href="#" className="text-primary hover:underline">Department for Education (DfE)</a>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <a href="#" className="text-primary hover:underline">Ofsted</a>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <a href="#" className="text-primary hover:underline">Education Endowment Foundation</a>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <a href="#" className="text-primary hover:underline">NCETM (Mathematics)</a>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All UK Educational Resources
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
