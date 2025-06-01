'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, FileText, Info, Search, Settings } from "lucide-react";

export default function UKEducationalCompliance() {
  const [selectedKeyStage, setSelectedKeyStage] = useState("ks2");
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-centre mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">UK Educational Compliance</h1>
          <p className="text-muted-foreground">
            Ensure alignment with UK Department for Education standards and curriculum requirements
          </p>
        </div>
        <div className="flex items-centre gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search standards..."
              className="w-[200px] pl-8 md:w-[300px] rounded-full bg-background"
            />
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="curriculum" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="curriculum">National Curriculum</TabsTrigger>
          <TabsTrigger value="assessment">Assessment Standards</TabsTrigger>
          <TabsTrigger value="safeguarding">Safeguarding</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Checker</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>National Curriculum Standards</CardTitle>
              <CardDescription>
                Align content with the UK National Curriculum requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-centre mb-6">
                <div className="flex gap-2">
                  <Select value={selectedKeyStage} onValueChange={setSelectedKeyStage}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Key Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eyfs">Early Years Foundation Stage</SelectItem>
                      <SelectItem value="ks1">Key Stage 1</SelectItem>
                      <SelectItem value="ks2">Key Stage 2</SelectItem>
                      <SelectItem value="ks3">Key Stage 3</SelectItem>
                      <SelectItem value="ks4">Key Stage 4</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="english">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="geography">Geography</SelectItem>
                      <SelectItem value="art">Art and Design</SelectItem>
                      <SelectItem value="computing">Computing</SelectItem>
                      <SelectItem value="design">Design and Technology</SelectItem>
                      <SelectItem value="languages">Languages</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="pe">Physical Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Export Curriculum Map
                </Button>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {selectedKeyStage === "ks2" && (
                  <>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <div className="flex items-centre">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Reading - Word Reading</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pl-6">
                          <div className="flex items-centre justify-between">
                            <div className="flex-1">
                              <p className="font-medium">Apply growing knowledge of root words, prefixes and suffixes</p>
                              <p className="text-sm text-muted-foreground">Both to read aloud and to understand the meaning of new words they meet</p>
                            </div>
                            <div className="flex items-centre gap-2">
                              <span className="text-sm font-medium text-green-500">Implemented</span>
                              <Button variant="outline" size="sm">View Content</Button>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-centre justify-between">
                            <div className="flex-1">
                              <p className="font-medium">Read further exception words</p>
                              <p className="text-sm text-muted-foreground">Noting the unusual correspondences between spelling and sound, and where these occur in the word</p>
                            </div>
                            <div className="flex items-centre gap-2">
                              <span className="text-sm font-medium text-green-500">Implemented</span>
                              <Button variant="outline" size="sm">View Content</Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        <div className="flex items-centre">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Reading - Comprehension</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pl-6">
                          <div className="flex items-centre justify-between">
                            <div className="flex-1">
                              <p className="font-medium">Develop positive attitudes to reading and understanding of what they read</p>
                              <p className="text-sm text-muted-foreground">By listening to and discussing a wide range of fiction, poetry, plays, non-fiction and reference books</p>
                            </div>
                            <div className="flex items-centre gap-2">
                              <span className="text-sm font-medium text-green-500">Implemented</span>
                              <Button variant="outline" size="sm">View Content</Button>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-centre justify-between">
                            <div className="flex-1">
                              <p className="font-medium">Understand what they read</p>
                              <p className="text-sm text-muted-foreground">By checking that the text makes sense to them, discussing their understanding and explaining the meaning of words in context</p>
                            </div>
                            <div className="flex items-centre gap-2">
                              <span className="text-sm font-medium text-green-500">Implemented</span>
                              <Button variant="outline" size="sm">View Content</Button>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-centre justify-between">
                            <div className="flex-1">
                              <p className="font-medium">Retrieve and record information from non-fiction</p>
                              <p className="text-sm text-muted-foreground">Using features such as indexes, contents pages, and subheadings</p>
                            </div>
                            <div className="flex items-centre gap-2">
                              <span className="text-sm font-medium text-green-500">Implemented</span>
                              <Button variant="outline" size="sm">View Content</Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        <div className="flex items-centre">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Writing - Transcription</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pl-6">
                          <div className="flex items-centre justify-between">
                            <div className="flex-1">
                              <p className="font-medium">Use further prefixes and suffixes and understand how to add them</p>
                              <p className="text-sm text-muted-foreground">Including understanding the rules for adding prefixes and suffixes</p>
                            </div>
                            <div className="flex items-centre gap-2">
                              <span className="text-sm font-medium text-green-500">Implemented</span>
                              <Button variant="outline" size="sm">View Content</Button>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-centre justify-between">
                            <div className="flex-1">
                              <p className="font-medium">Spell words that are often misspelt</p>
                              <p className="text-sm text-muted-foreground">From the Year 3/4 spelling list</p>
                            </div>
                            <div className="flex items-centre gap-2">
                              <span className="text-sm font-medium text-green-500">Implemented</span>
                              <Button variant="outline" size="sm">View Content</Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>
                        <div className="flex items-centre">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Writing - Composition</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pl-6">
                          <div className="flex items-centre justify-between">
                            <div className="flex-1">
                              <p className="font-medium">Plan their writing</p>
                              <p className="text-sm text-muted-foreground">By discussing writing similar to that which they are planning to write</p>
                            </div>
                            <div className="flex items-centre gap-2">
                              <span className="text-sm font-medium text-green-500">Implemented</span>
                              <Button variant="outline" size="sm">View Content</Button>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-centre justify-between">
                            <div className="flex-1">
                              <p className="font-medium">Draft and write</p>
                              <p className="text-sm text-muted-foreground">By composing and rehearsing sentences orally, progressively building a varied and rich vocabulary</p>
                            </div>
                            <div className="flex items-centre gap-2">
                              <span className="text-sm font-medium text-green-500">Implemented</span>
                              <Button variant="outline" size="sm">View Content</Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger>
                        <div className="flex items-centre">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Grammar and Punctuation</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pl-6">
                          <div className="flex items-centre justify-between">
                            <div className="flex-1">
                              <p className="font-medium">Develop understanding of grammatical concepts</p>
                              <p className="text-sm text-muted-foreground">Including extending the range of sentences with more than one clause</p>
                            </div>
                            <div className="flex items-centre gap-2">
                              <span className="text-sm font-medium text-green-500">Implemented</span>
                              <Button variant="outline" size="sm">View Content</Button>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-centre justify-between">
                            <div className="flex-1">
                              <p className="font-medium">Use and understand grammatical terminology accurately</p>
                              <p className="text-sm text-muted-foreground">When discussing their writing and reading</p>
                            </div>
                            <div className="flex items-centre gap-2">
                              <span className="text-sm font-medium text-green-500">Implemented</span>
                              <Button variant="outline" size="sm">View Content</Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </>
                )}
              </Accordion>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full Curriculum Standards
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Standards</CardTitle>
              <CardDescription>
                Align with UK assessment frameworks and reporting requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-centre mb-6">
                <div className="flex gap-2">
                  <Select defaultValue="ks2">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Key Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eyfs">Early Years Foundation Stage</SelectItem>
                      <SelectItem value="ks1">Key Stage 1</SelectItem>
                      <SelectItem value="ks2">Key Stage 2</SelectItem>
                      <SelectItem value="ks3">Key Stage 3</SelectItem>
                      <SelectItem value="ks4">Key Stage 4</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="formative">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Assessment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formative">Formative Assessment</SelectItem>
                      <SelectItem value="summative">Summative Assessment</SelectItem>
                      <SelectItem value="diagnostic">Diagnostic Assessment</SelectItem>
                      <SelectItem value="statutory">Statutory Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Export Assessment Framework
                </Button>
              </div>

              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Key Stage 2 Statutory Assessment Tests (SATs)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    National curriculum assessments typically taken by pupils at the end of KS2 (Year 6)
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-1">English Grammar, Punctuation and Spelling</h4>
                      <p className="text-sm text-muted-foreground mb-2">Paper 1: Questions and Paper 2: Spelling</p>
                      <div className="flex justify-between items-centre">
                        <span className="text-sm font-medium text-green-500">Fully Implemented</span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-1">English Reading</h4>
                      <p className="text-sm text-muted-foreground mb-2">Reading booklet and associated answer booklet</p>
                      <div className="flex justify-between items-centre">
                        <span className="text-sm font-medium text-green-500">Fully Implemented</span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-1">Mathematics</h4>
                      <p className="text-sm text-muted-foreground mb-2">Paper 1: Arithmetic and Papers 2 & 3: Reasoning</p>
                      <div className="flex justify-between items-centre">
                        <span className="text-sm font-medium text-green-500">Fully Implemented</span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-1">Science Sampling Tests</h4>
                      <p className="text-sm text-muted-foreground mb-2">Selected schools only - Biology, Chemistry, Physics</p>
                      <div className="flex justify-between items-centre">
                        <span className="text-sm font-medium text-green-500">Fully Implemented</span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Teacher Assessment Frameworks</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Frameworks for teacher assessments at the end of KS2
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-centre justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">English Writing</h4>
                        <p className="text-sm text-muted-foreground">Working towards, working at, or working at greater depth within the expected standard</p>
                      </div>
                      <div className="flex items-centre gap-2">
                        <span className="text-sm font-medium text-green-500">Implemented</span>
                        <Button variant="outline" size="sm">View Framework</Button>
                      </div>
                    </div>
                    <div className="flex items-centre justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">Science</h4>
                        <p className="text-sm text-muted-foreground">Working at the expected standard</p>
                      </div>
                      <div className="flex items-centre gap-2">
                        <span className="text-sm font-medium text-green-500">Implemented</span>
                        <Button variant="outline" size="sm">View Framework</Button>
                      </div>
                    </div>
                    <div className="flex items-centre justify-between">
                      <div>
                        <h4 className="font-medium">Pre-key stage Standards</h4>
                        <p className="text-sm text-muted-foreground">For pupils working below the standard of national curriculum assessments</p>
                      </div>
                      <div className="flex items-centre gap-2">
                        <span className="text-sm font-medium text-green-500">Implemented</span>
                        <Button variant="outline" size="sm">View Framework</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Assessment Standards
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="safeguarding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safeguarding Compliance</CardTitle>
              <CardDescription>
                Ensure adherence to UK safeguarding requirements and best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Keeping Children Safe in Education (KCSIE)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Statutory guidance for schools and colleges on safeguarding children and safer recruitment
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-centre justify-between">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Data Protection and Privacy</p>
                          <p className="text-sm text-muted-foreground">Compliant with UK GDPR and Data Protection Act 2018 requirements for educational data</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                    <Separator />
                    <div className="flex items-centre justify-between">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Content Filtering and Monitoring</p>
                          <p className="text-sm text-muted-foreground">Age-appropriate content filtering and monitoring systems in place</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                    <Separator />
                    <div className="flex items-centre justify-between">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Reporting Mechanisms</p>
                          <p className="text-sm text-muted-foreground">Clear procedures for reporting safeguarding concerns</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                    <Separator />
                    <div className="flex items-centre justify-between">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Staff Training and Awareness</p>
                          <p className="text-sm text-muted-foreground">Resources for staff training on safeguarding responsibilities</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Online Safety</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Measures to ensure online safety in accordance with UK requirements
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-1">Content Filtering</h4>
                      <p className="text-sm text-muted-foreground mb-2">Age-appropriate content filtering systems</p>
                      <div className="flex justify-between items-centre">
                        <span className="text-sm font-medium text-green-500">Implemented</span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-1">Communication Monitoring</h4>
                      <p className="text-sm text-muted-foreground mb-2">Systems to monitor and moderate communications</p>
                      <div className="flex justify-between items-centre">
                        <span className="text-sm font-medium text-green-500">Implemented</span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-1">Digital Literacy Education</h4>
                      <p className="text-sm text-muted-foreground mb-2">Resources to teach safe online behaviour</p>
                      <div className="flex justify-between items-centre">
                        <span className="text-sm font-medium text-green-500">Implemented</span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-1">Incident Response</h4>
                      <p className="text-sm text-muted-foreground mb-2">Procedures for responding to online safety incidents</p>
                      <div className="flex justify-between items-centre">
                        <span className="text-sm font-medium text-green-500">Implemented</span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full Safeguarding Documentation
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checker</CardTitle>
              <CardDescription>
                Verify your content and assessments against UK educational standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Content Compliance Check</h3>
                  <div className="space-y-4">
                    <div className="flex items-centre gap-4">
                      <div className="flex-1">
                        <Label htmlFor="content-url" className="text-sm font-medium">
                          Content URL or ID
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input id="content-url" placeholder="Enter content URL or ID" />
                          <Button>Check</Button>
                        </div>
                      </div>
                      <div className="w-[200px]">
                        <Label htmlFor="key-stage" className="text-sm font-medium">
                          Key Stage
                        </Label>
                        <Select defaultValue="ks2">
                          <SelectTrigger id="key-stage" className="mt-1">
                            <SelectValue placeholder="Select Key Stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eyfs">EYFS</SelectItem>
                            <SelectItem value="ks1">KS1</SelectItem>
                            <SelectItem value="ks2">KS2</SelectItem>
                            <SelectItem value="ks3">KS3</SelectItem>
                            <SelectItem value="ks4">KS4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-[200px]">
                        <Label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </Label>
                        <Select defaultValue="english">
                          <SelectTrigger id="subject" className="mt-1">
                            <SelectValue placeholder="Select Subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="history">History</SelectItem>
                            <SelectItem value="geography">Geography</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="border rounded-md p-4 bg-muted/50">
                      <div className="flex items-centre gap-2 mb-4">
                        <Info className="h-5 w-5 text-blue-500" />
                        <p className="text-sm font-medium">Enter a content URL or ID above to check compliance</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The compliance checker will analyse your content against the UK National Curriculum standards for the selected key stage and subject. It will provide a detailed report on alignment, gaps, and recommendations for improvement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Batch Compliance Verification</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="content-type" className="text-sm font-medium">
                          Content Type
                        </Label>
                        <Select defaultValue="lesson">
                          <SelectTrigger id="content-type" className="mt-1">
                            <SelectValue placeholder="Select Content Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lesson">Lesson Plans</SelectItem>
                            <SelectItem value="assessment">Assessments</SelectItem>
                            <SelectItem value="resource">Learning Resources</SelectItem>
                            <SelectItem value="curriculum">Curriculum Units</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="compliance-standard" className="text-sm font-medium">
                          Compliance Standard
                        </Label>
                        <Select defaultValue="curriculum">
                          <SelectTrigger id="compliance-standard" className="mt-1">
                            <SelectValue placeholder="Select Standard" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="curriculum">National Curriculum</SelectItem>
                            <SelectItem value="assessment">Assessment Standards</SelectItem>
                            <SelectItem value="safeguarding">Safeguarding</SelectItem>
                            <SelectItem value="accessibility">Accessibility</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-centre justify-between p-4 border rounded-md">
                      <div className="flex items-centre gap-3">
                        <div className="flex h-10 w-10 items-centre justify-centre rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Upload Content for Batch Verification</p>
                          <p className="text-sm text-muted-foreground">Upload CSV file with content IDs or URLs</p>
                        </div>
                      </div>
                      <Button>Upload File</Button>
                    </div>

                    <div className="flex items-centre gap-4 p-4 border rounded-md">
                      <div className="flex-1">
                        <div className="flex items-centre justify-between mb-2">
                          <Label htmlFor="auto-verification" className="text-sm font-medium">
                            Automatic Compliance Verification
                          </Label>
                          <Switch id="auto-verification" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Automatically check all new content against UK educational standards
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Compliance Reports</h3>
                  <div className="space-y-4">
                    <div className="flex items-centre justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">Platform-wide Compliance Report</h4>
                        <p className="text-sm text-muted-foreground">Overall compliance status across all content</p>
                      </div>
                      <Button>Generate Report</Button>
                    </div>
                    <div className="flex items-centre justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">Subject-specific Compliance</h4>
                        <p className="text-sm text-muted-foreground">Detailed compliance analysis by subject area</p>
                      </div>
                      <Button>Generate Report</Button>
                    </div>
                    <div className="flex items-centre justify-between">
                      <div>
                        <h4 className="font-medium">Safeguarding Compliance Audit</h4>
                        <p className="text-sm text-muted-foreground">Audit of safeguarding measures and policies</p>
                      </div>
                      <Button>Generate Report</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Run Comprehensive Compliance Check
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
