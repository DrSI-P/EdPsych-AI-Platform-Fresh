'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Mail,
  Phone,
  Calendar,
  FileText,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  AlertCircle,
  BarChart
} from 'lucide-react';
import Link from 'next/link';

export default function ParentCommunicationPage() {
  const [messageType, setMessageType] = useState('individual');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for parent communication
  const classes = [
    { id: 'all', name: 'All Classes' },
    { id: 'year7a', name: 'Year 7A' },
    { id: 'year7b', name: 'Year 7B' },
    { id: 'year8a', name: 'Year 8A' },
    { id: 'year8b', name: 'Year 8B' }
  ];
  
  const students = [
    { id: 1, name: 'Emma Thompson', parent: 'Mr & Mrs Thompson', email: 'thompson@example.com', lastContact: '2 weeks ago' },
    { id: 2, name: 'James Wilson', parent: 'Mrs Wilson', email: 'wilson@example.com', lastContact: '1 day ago' },
    { id: 3, name: 'Sarah Johnson', parent: 'Dr Johnson', email: 'johnson@example.com', lastContact: '3 days ago' },
    { id: 4, name: 'Michael Brown', parent: 'Mr Brown', email: 'brown@example.com', lastContact: '1 week ago' },
    { id: 5, name: 'David Lee', parent: 'Mr & Mrs Lee', email: 'lee@example.com', lastContact: 'Never' }
  ];
  
  const templates = [
    { id: 1, title: 'Progress Update', content: 'Dear [Parent Name],\n\nI wanted to provide you with an update on [Student Name]\'s progress in class. [Student Name] has been [performance details].\n\nPlease let me know if you have any questions or would like to schedule a meeting to discuss further.\n\nBest regards,\n[Your Name]' },
    { id: 2, title: 'Behaviour Concern', content: 'Dear [Parent Name],\n\nI am writing to discuss a concern regarding [Student Name]\'s behaviour in class. Recently, [behaviour details].\n\nI would appreciate the opportunity to discuss this with you. Please let me know when you might be available for a brief call or meeting.\n\nThank you for your support,\n[Your Name]' },
    { id: 3, title: 'Upcoming Assessment', content: 'Dear [Parent Name],\n\nI wanted to inform you about an upcoming assessment for [Student Name]\'s class. The assessment will cover [topics] and is scheduled for [date].\n\nTo help [Student Name] prepare, I recommend [preparation tips].\n\nPlease feel free to contact me if you have any questions.\n\nBest regards,\n[Your Name]' },
    { id: 4, title: 'Parents\' Evening Reminder', content: 'Dear [Parent Name],\n\nThis is a reminder that our Parents\' Evening is scheduled for [date] from [time]. Your appointment to discuss [Student Name]\'s progress is at [specific time].\n\nPlease arrive 10 minutes before your appointment time. If you need to reschedule, please let me know as soon as possible.\n\nI look forward to meeting with you,\n[Your Name]' }
  ];
  
  const recentCommunications = [
    { id: 1, student: 'James Wilson', parent: 'Mrs Wilson', type: 'Email', subject: 'Progress Update', date: 'Yesterday', status: 'Replied' },
    { id: 2, student: 'Sarah Johnson', parent: 'Dr Johnson', type: 'Phone', subject: 'Behaviour Discussion', date: '3 days ago', status: 'Completed' },
    { id: 3, student: 'Michael Brown', parent: 'Mr Brown', type: 'Email', subject: 'Upcoming Assessment', date: '1 week ago', status: 'No Reply' }
  ];
  
  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.parent.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Parent Communication</h1>
        <p className="text-muted-foreground text-lg">
          Manage and streamline your communications with parents and guardians.
        </p>
      </motion.div>

      {/* Communication Tabs */}
      <Tabs defaultValue="compose" className="mb-8">
        <TabsList className="tabs-list mb-6">
          <TabsTrigger value="compose" className="tab">Compose Message</TabsTrigger>
          <TabsTrigger value="history" className="tab">Communication History</TabsTrigger>
          <TabsTrigger value="templates" className="tab">Message Templates</TabsTrigger>
          <TabsTrigger value="scheduled" className="tab">Scheduled Messages</TabsTrigger>
        </TabsList>

        {/* Compose Message Tab */}
        <TabsContent value="compose" className="tab-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Message Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                      Compose New Message
                    </CardTitle>
                    <CardDescription className="card-description">
                      Create and send messages to parents or guardians
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-4">
                      {/* Message Type Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Message Type</label>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="individual" 
                              name="messageType" 
                              value="individual"
                              checked={messageType === 'individual'}
                              onChange={() => setMessageType('individual')}
                              className="mr-2"
                            />
                            <label htmlFor="individual">Individual</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="group" 
                              name="messageType" 
                              value="group"
                              checked={messageType === 'group'}
                              onChange={() => setMessageType('group')}
                              className="mr-2"
                            />
                            <label htmlFor="group">Group/Class</label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Recipient Selection */}
                      {messageType === 'individual' ? (
                        <div>
                          <label className="block text-sm font-medium mb-2">Select Student/Parent</label>
                          <div className="relative">
                            <Input
                              placeholder="Search by student or parent name..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="input input-bordered w-full"
                            />
                          </div>
                          
                          {searchQuery && (
                            <div className="mt-2 border border-border rounded-md max-h-60 overflow-y-auto">
                              {filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                  <div 
                                    key={student.id} 
                                    className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-0"
                                    onClick={() => setSearchQuery(student.name)}
                                  >
                                    <div className="font-medium">{student.name}</div>
                                    <div className="text-sm text-muted-foreground">Parent: {student.parent}</div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-3 text-muted-foreground">No matching students found</div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium mb-2">Select Class</label>
                          <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="select select-bordered w-full"
                          >
                            {classes.map(cls => (
                              <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      {/* Communication Method */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Communication Method</label>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="email" 
                              name="communicationMethod" 
                              defaultChecked
                              className="mr-2"
                            />
                            <label htmlFor="email">Email</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="sms" 
                              name="communicationMethod" 
                              className="mr-2"
                            />
                            <label htmlFor="sms">SMS</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="portal" 
                              name="communicationMethod" 
                              className="mr-2"
                            />
                            <label htmlFor="portal">Portal Message</label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Message Subject */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <Input 
                          placeholder="Enter message subject..." 
                          className="input input-bordered w-full"
                        />
                      </div>
                      
                      {/* Message Content */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <Textarea 
                          placeholder="Type your message here..." 
                          className="textarea textarea-bordered w-full min-h-[200px]"
                          defaultValue="Dear Parent/Guardian,

I hope this message finds you well. 

[Your message here]

Please don't hesitate to contact me if you have any questions or concerns.

Best regards,
[Your Name]
[Your Position]
EdPsych Connect"
                        />
                      </div>
                      
                      {/* Attachments */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Attachments (Optional)</label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FileText className="w-8 h-8 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-medium">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">PDF, DOC, JPG, PNG (MAX. 10MB)</p>
                            </div>
                            <input type="file" className="hidden" />
                          </label>
                        </div>
                      </div>
                      
                      {/* Send Options */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        <Button variant="outline" className="btn btn-outline">
                          Save as Draft
                        </Button>
                        <Button variant="outline" className="btn btn-outline">
                          Schedule
                        </Button>
                        <Button className="btn btn-primary">
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Templates and AI Assistant */}
            <div className="space-y-8">
              {/* Quick Templates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Quick Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-3">
                      {templates.slice(0, 3).map(template => (
                        <Button 
                          key={template.id} 
                          variant="outline" 
                          className="w-full justify-start text-left btn btn-outline"
                        >
                          {template.title}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="card-footer">
                    <Button variant="ghost" size="sm" className="w-full btn btn-sm btn-ghost">
                      View All Templates
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* AI Message Assistant */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="card card-bordered bg-primary/5 hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                      AI Message Assistant
                    </CardTitle>
                    <CardDescription className="card-description">
                      Let AI help you draft professional communications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Describe what you want to communicate</label>
                        <Textarea 
                          placeholder="E.g., I need to inform parents about an upcoming field trip to the Science Museum..." 
                          className="textarea textarea-bordered w-full min-h-[100px]"
                        />
                      </div>
                      <Button className="w-full btn btn-primary">
                        Generate Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* UK GDPR Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardContent className="card-body p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm">UK GDPR Compliance</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          All communications are securely stored and comply with UK GDPR regulations. Please ensure all messages contain appropriate privacy notices.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        {/* Communication History Tab */}
        <TabsContent value="history" className="tab-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  Communication History
                </CardTitle>
                <CardDescription className="card-description">
                  View and manage your past communications with parents
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-grow">
                    <Input 
                      placeholder="Search communications..." 
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="flex gap-4">
                    <select className="select select-bordered">
                      <option value="all">All Types</option>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="phone">Phone</option>
                      <option value="portal">Portal</option>
                    </select>
                    <select className="select select-bordered">
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="term">This Term</option>
                    </select>
                  </div>
                </div>
                
                {/* Communications Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Student</th>
                        <th className="text-left py-3 px-4">Parent/Guardian</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Subject</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCommunications.map(comm => (
                        <tr key={comm.id} className="border-b border-border">
                          <td className="py-3 px-4">{comm.student}</td>
                          <td className="py-3 px-4">{comm.parent}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="badge badge-outline">
                              {comm.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{comm.subject}</td>
                          <td className="py-3 px-4">{comm.date}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              className={`badge ${
                                comm.status === 'Replied' 
                                  ? 'bg-green-100 text-green-800' 
                                  : comm.status === 'No Reply' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {comm.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                View
                              </Button>
                              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                Reply
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing 1-3 of 24 communications
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="btn btn-sm btn-outline">
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="btn btn-sm btn-outline">
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Communication Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8"
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-primary" />
                  Communication Analytics
                </CardTitle>
                <CardDescription className="card-description">
                  Insights into your parent communication patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary">87%</div>
                    <div className="text-sm text-muted-foreground">Response Rate</div>
                    <div className="text-xs text-green-500 mt-1">+12% from last term</div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary">24</div>
                    <div className="text-sm text-muted-foreground">Communications</div>
                    <div className="text-xs text-muted-foreground mt-1">This Month</div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary">1.8</div>
                    <div className="text-sm text-muted-foreground">Average Response Time</div>
                    <div className="text-xs text-muted-foreground mt-1">Days</div>
                  </div>
                </div>
                
                {/* Placeholder for chart */}
                <div className="bg-muted/20 border border-border rounded-lg p-4 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Communication volume by type and month</p>
                    <p className="text-sm text-muted-foreground">Chart visualization would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Message Templates Tab */}
        <TabsContent value="templates" className="tab-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Message Templates
                    </CardTitle>
                    <CardDescription className="card-description">
                      Create and manage reusable message templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-6">
                      {/* Template Categories */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className="badge bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
                          All Templates
                        </Badge>
                        <Badge className="badge bg-muted hover:bg-muted/80 cursor-pointer">
                          Academic Progress
                        </Badge>
                        <Badge className="badge bg-muted hover:bg-muted/80 cursor-pointer">
                          Behaviour
                        </Badge>
                        <Badge className="badge bg-muted hover:bg-muted/80 cursor-pointer">
                          Events
                        </Badge>
                        <Badge className="badge bg-muted hover:bg-muted/80 cursor-pointer">
                          Administrative
                        </Badge>
                      </div>
                      
                      {/* Templates List */}
                      <div className="space-y-4">
                        {templates.map(template => (
                          <Card key={template.id} className="card card-bordered hover:shadow-md transition-shadow">
                            <CardHeader className="card-header py-3">
                              <div className="flex justify-between items-center">
                                <CardTitle className="card-title text-lg">{template.title}</CardTitle>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                    Edit
                                  </Button>
                                  <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                    Use
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="card-body py-3">
                              <div className="bg-muted/30 p-3 rounded-md text-sm whitespace-pre-line">
                                {template.content}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {/* Create New Template Button */}
                      <div className="flex justify-center">
                        <Button className="btn btn-primary">
                          Create New Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="space-y-8">
              {/* Template Variables */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card className="card card-bordered hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Template Variables
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-3">
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="font-medium">[Student Name]</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Inserts the student's full name
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="font-medium">[Parent Name]</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Inserts the parent/guardian's name
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="font-medium">[Class Name]</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Inserts the class or form group name
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="font-medium">[Your Name]</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Inserts your name as the sender
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="card-footer">
                    <Button variant="ghost" size="sm" className="w-full btn btn-sm btn-ghost">
                      View All Variables
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* AI Template Generator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="card card-bordered bg-primary/5 hover:shadow-md transition-shadow">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                      AI Template Generator
                    </CardTitle>
                    <CardDescription className="card-description">
                      Let AI help you create new templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Describe the template you need</label>
                        <Textarea 
                          placeholder="E.g., I need a template for informing parents about upcoming exams and revision resources..." 
                          className="textarea textarea-bordered w-full min-h-[100px]"
                        />
                      </div>
                      <Button className="w-full btn btn-primary">
                        Generate Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        {/* Scheduled Messages Tab */}
        <TabsContent value="scheduled" className="tab-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Scheduled Messages
                </CardTitle>
                <CardDescription className="card-description">
                  View and manage your scheduled communications
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                {/* Upcoming Scheduled Messages */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Upcoming Scheduled Messages</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4">Subject</th>
                          <th className="text-left py-3 px-4">Recipients</th>
                          <th className="text-left py-3 px-4">Type</th>
                          <th className="text-left py-3 px-4">Scheduled Date</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4">End of Term Newsletter</td>
                          <td className="py-3 px-4">All Classes</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="badge badge-outline">
                              Email
                            </Badge>
                          </td>
                          <td className="py-3 px-4">15 July 2025, 9:00 AM</td>
                          <td className="py-3 px-4">
                            <Badge className="badge bg-blue-100 text-blue-800">
                              Scheduled
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                Cancel
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4">Exam Preparation Resources</td>
                          <td className="py-3 px-4">Year 11</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="badge badge-outline">
                              Email
                            </Badge>
                          </td>
                          <td className="py-3 px-4">10 June 2025, 4:00 PM</td>
                          <td className="py-3 px-4">
                            <Badge className="badge bg-blue-100 text-blue-800">
                              Scheduled
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                Cancel
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">Sports Day Information</td>
                          <td className="py-3 px-4">Year 7, Year 8</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="badge badge-outline">
                              Email
                            </Badge>
                          </td>
                          <td className="py-3 px-4">5 June 2025, 9:00 AM</td>
                          <td className="py-3 px-4">
                            <Badge className="badge bg-blue-100 text-blue-800">
                              Scheduled
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                Cancel
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Recurring Messages */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Recurring Messages</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4">Subject</th>
                          <th className="text-left py-3 px-4">Recipients</th>
                          <th className="text-left py-3 px-4">Type</th>
                          <th className="text-left py-3 px-4">Frequency</th>
                          <th className="text-left py-3 px-4">Next Send</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4">Weekly Homework Summary</td>
                          <td className="py-3 px-4">All Classes</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="badge badge-outline">
                              Email
                            </Badge>
                          </td>
                          <td className="py-3 px-4">Weekly (Friday)</td>
                          <td className="py-3 px-4">2 June 2025, 3:00 PM</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                Pause
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">Attendance Report</td>
                          <td className="py-3 px-4">Selected Parents</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="badge badge-outline">
                              Email
                            </Badge>
                          </td>
                          <td className="py-3 px-4">Monthly (1st)</td>
                          <td className="py-3 px-4">1 June 2025, 9:00 AM</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="btn btn-sm btn-ghost">
                                Pause
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Schedule New Message Button */}
                <div className="flex justify-center mt-8">
                  <Button className="btn btn-primary">
                    Schedule New Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Voice Input Feature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="card card-bordered bg-muted/30 hover:shadow-md transition-shadow">
          <CardContent className="card-body p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6 flex-grow">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                  Voice Input Available
                </h3>
                <p className="text-muted-foreground">
                  Save time by using voice commands to compose messages, select recipients, and schedule communications.
                </p>
              </div>
              <Button size="lg" className="btn btn-lg btn-primary whitespace-nowrap" asChild>
                <Link href="/speech-recognition?redirect=/educator/parent-communication">
                  Try Voice Input
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" className="btn btn-outline" asChild>
          <Link href="/educator/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <Button variant="outline" className="btn btn-outline" asChild>
          <Link href="/educator/administrative-automation">
            Administrative Automation <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
