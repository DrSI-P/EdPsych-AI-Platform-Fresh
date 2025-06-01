'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  BarChart,
  PieChart,
  LineChart,
  CheckSquare,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function AgreementTrackingPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Sample agreements data
  const agreements = [
    {
      id: 1,
      title: "Classroom Respect Agreement",
      participants: ["James Wilson", "Emma Thompson"],
      date: "15 May 2025",
      status: "In Progress",
      progress: 65,
      type: "Peer Conflict",
      commitments: [
        { text: "Speak respectfully during class discussions", status: "Completed", assignedTo: "James Wilson" },
        { text: "Allow others to finish speaking before responding", status: "In Progress", assignedTo: "Emma Thompson" },
        { text: "Use 'I' statements when expressing concerns", status: "Completed", assignedTo: "Both" },
        { text: "Meet weekly to review progress", status: "In Progress", assignedTo: "Both" }
      ],
      notes: "Both students showing good progress. Weekly check-ins are helping maintain accountability."
    },
    {
      id: 2,
      title: "Group Project Collaboration",
      participants: ["Year 8 Science Group 3"],
      date: "10 May 2025",
      status: "Completed",
      progress: 100,
      type: "Group Conflict",
      commitments: [
        { text: "Create fair division of tasks", status: "Completed", assignedTo: "Group" },
        { text: "Establish communication schedule", status: "Completed", assignedTo: "Group" },
        { text: "Document all contributions", status: "Completed", assignedTo: "Group" },
        { text: "Address concerns promptly", status: "Completed", assignedTo: "Group" }
      ],
      notes: "Group successfully completed project with improved collaboration. All members reported satisfaction with the process."
    },
    {
      id: 3,
      title: "Playground Behaviour Plan",
      participants: ["Oliver Brown", "Noah Davis", "Playground Monitors"],
      date: "20 May 2025",
      status: "At Risk",
      progress: 30,
      type: "Recurring Conflict",
      commitments: [
        { text: "Stay in designated playground areas", status: "At Risk", assignedTo: "Oliver Brown" },
        { text: "Use kind language during play", status: "In Progress", assignedTo: "Noah Davis" },
        { text: "Seek monitor help when needed", status: "Completed", assignedTo: "Both" },
        { text: "Participate in different activities", status: "Not Started", assignedTo: "Both" }
      ],
      notes: "Some challenges with consistent implementation. Additional support may be needed."
    },
    {
      id: 4,
      title: "Teacher-Student Communication Plan",
      participants: ["Ms. Johnson", "Aiden Parker"],
      date: "5 May 2025",
      status: "In Progress",
      progress: 75,
      type: "Teacher-Student",
      commitments: [
        { text: "Weekly check-in meetings", status: "Completed", assignedTo: "Both" },
        { text: "Use agreed signal for assistance", status: "Completed", assignedTo: "Aiden Parker" },
        { text: "Provide written feedback on assignments", status: "In Progress", assignedTo: "Ms. Johnson" },
        { text: "Self-assessment after each unit", status: "In Progress", assignedTo: "Aiden Parker" }
      ],
      notes: "Communication has improved significantly. Both parties report better understanding."
    }
  ];
  
  // Filter agreements based on search and status
  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = agreement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agreement.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || agreement.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });
  
  // Calculate statistics
  const stats = {
    total: agreements.length,
    completed: agreements.filter(a => a.status === "Completed").length,
    inProgress: agreements.filter(a => a.status === "In Progress").length,
    atRisk: agreements.filter(a => a.status === "At Risk").length,
    averageProgress: Math.round(agreements.reduce((sum, a) => sum + a.progress, 0) / agreements.length)
  };
  
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
  
  // Status badge color mapping
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'at risk':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'not started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Progress color mapping
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Agreement Tracking</h1>
        <p className="text-muted-foreground text-lg">
          Monitor and visualize progress on restorative agreements
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tabs Navigation */}
          <Tabs defaultValue="dashboard" onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="agreements">Agreements</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Agreement Tracking Dashboard</CardTitle>
                    <CardDescription>
                      Overview of all restorative agreements and their progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Statistics Cards */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <Card className="bg-primary/5">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold">{stats.total}</div>
                          <div className="text-sm text-muted-foreground">Total Agreements</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-green-50">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
                          <div className="text-sm text-green-600">Completed</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-50">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-700">{stats.inProgress}</div>
                          <div className="text-sm text-blue-600">In Progress</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-amber-50">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-amber-700">{stats.atRisk}</div>
                          <div className="text-sm text-amber-600">At Risk</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    {/* Overall Progress */}
                    <motion.div variants={itemVariants} className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Overall Progress</h3>
                        <span className="text-sm font-medium">{stats.averageProgress}%</span>
                      </div>
                      <Progress value={stats.averageProgress} className="h-2" />
                    </motion.div>
                    
                    {/* Recent Agreements */}
                    <motion.div variants={itemVariants}>
                      <h3 className="font-medium mb-4">Recent Agreements</h3>
                      <div className="space-y-4">
                        {agreements.slice(0, 3).map((agreement) => (
                          <Card key={agreement.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{agreement.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {agreement.participants.join(', ')}
                                  </p>
                                </div>
                                <Badge className={getStatusColor(agreement.status)}>
                                  {agreement.status}
                                </Badge>
                              </div>
                              
                              <div className="mt-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-muted-foreground">Progress</span>
                                  <span className="text-xs font-medium">{agreement.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full ${getProgressColor(agreement.progress)}`}
                                    style={{ width: `${agreement.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {agreement.date}
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-primary text-xs"
                                  onClick={() => {
                                    setSelectedAgreement(agreement);
                                    setActiveTab('agreements');
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-center">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('agreements')}
                        >
                          View All Agreements
                        </Button>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* Agreements Tab */}
            <TabsContent value="agreements">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Restorative Agreements</CardTitle>
                        <CardDescription>
                          Track and manage all restorative agreements
                        </CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" /> New Agreement
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Search and Filter */}
                    <motion.div variants={itemVariants} className="mb-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Search agreements..." 
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-muted-foreground" />
                          <select 
                            className="border rounded-md p-2 text-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="all">All Statuses</option>
                            <option value="completed">Completed</option>
                            <option value="in progress">In Progress</option>
                            <option value="at risk">At Risk</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Agreements List */}
                    <motion.div variants={itemVariants} className="space-y-4">
                      {filteredAgreements.length > 0 ? (
                        filteredAgreements.map((agreement) => (
                          <Card 
                            key={agreement.id} 
                            className={`hover:shadow-md transition-shadow cursor-pointer ${selectedAgreement?.id === agreement.id ? 'border-primary' : ''}`}
                            onClick={() => setSelectedAgreement(agreement)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{agreement.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {agreement.participants.join(', ')}
                                  </p>
                                </div>
                                <Badge className={getStatusColor(agreement.status)}>
                                  {agreement.status}
                                </Badge>
                              </div>
                              
                              <div className="mt-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-muted-foreground">Progress</span>
                                  <span className="text-xs font-medium">{agreement.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full ${getProgressColor(agreement.progress)}`}
                                    style={{ width: `${agreement.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {agreement.date}
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Users className="h-3 w-3 mr-1" />
                                    {agreement.type}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Edit className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Agreements Found</h3>
                          <p className="text-muted-foreground">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
                
                {/* Selected Agreement Details */}
                {selectedAgreement && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8"
                  >
                    <Card className="border-primary/50">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{selectedAgreement.title}</CardTitle>
                          <Badge className={getStatusColor(selectedAgreement.status)}>
                            {selectedAgreement.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          Created on {selectedAgreement.date} • {selectedAgreement.type}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Participants */}
                          <div>
                            <h3 className="font-medium mb-2">Participants</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedAgreement.participants.map((participant, index) => (
                                <Badge key={index} variant="outline" className="bg-primary/5">
                                  {participant}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Progress */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">Overall Progress</h3>
                              <span className="text-sm font-medium">{selectedAgreement.progress}%</span>
                            </div>
                            <Progress 
                              value={selectedAgreement.progress} 
                              className={`h-2 ${getProgressColor(selectedAgreement.progress)}`} 
                            />
                          </div>
                          
                          {/* Commitments */}
                          <div>
                            <h3 className="font-medium mb-4">Commitments</h3>
                            <div className="space-y-3">
                              {selectedAgreement.commitments.map((commitment, index) => (
                                <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                                  <div className={`p-1 rounded-full mr-3 ${getStatusColor(commitment.status)}`}>
                                    <CheckSquare className="h-5 w-5" />
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                      <p className="font-medium">{commitment.text}</p>
                                      <Badge className={getStatusColor(commitment.status)}>
                                        {commitment.status}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Assigned to: {commitment.assignedTo}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Notes */}
                          <div>
                            <h3 className="font-medium mb-2">Notes</h3>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p>{selectedAgreement.notes}</p>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            <Button>
                              <Edit className="h-4 w-4 mr-2" /> Update Progress
                            </Button>
                            <Button variant="outline">
                              <FileText className="h-4 w-4 mr-2" /> Generate Report
                            </Button>
                            <Button variant="ghost">
                              <Download className="h-4 w-4 mr-2" /> Export
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
            
            {/* Reports Tab */}
            <TabsContent value="reports">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Agreement Analytics</CardTitle>
                    <CardDescription>
                      Visual reports and analytics on restorative agreements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Status Distribution */}
                      <motion.div variants={itemVariants}>
                        <h3 className="font-medium mb-4">Agreement Status Distribution</h3>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex justify-center items-center h-64">
                            <div className="flex flex-col items-center">
                              <PieChart className="h-32 w-32 text-primary mb-4" />
                              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                  <span className="text-sm">Completed ({stats.completed})</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                  <span className="text-sm">In Progress ({stats.inProgress})</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                                  <span className="text-sm">At Risk ({stats.atRisk})</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                                  <span className="text-sm">Not Started (0)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Progress Over Time */}
                      <motion.div variants={itemVariants}>
                        <h3 className="font-medium mb-4">Progress Over Time</h3>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex justify-center items-center h-64">
                            <div className="flex flex-col items-center">
                              <LineChart className="h-32 w-32 text-primary mb-4" />
                              <p className="text-center text-sm text-muted-foreground">
                                This chart shows the average progress of all agreements over time.
                                <br />
                                The trend indicates steady improvement in agreement completion rates.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Agreement Types */}
                      <motion.div variants={itemVariants}>
                        <h3 className="font-medium mb-4">Agreement Types</h3>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex justify-center items-center h-64">
                            <div className="flex flex-col items-center">
                              <BarChart className="h-32 w-32 text-primary mb-4" />
                              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                                  <span className="text-sm">Peer Conflict (1)</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-primary/80 rounded-full mr-2"></div>
                                  <span className="text-sm">Group Conflict (1)</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-primary/60 rounded-full mr-2"></div>
                                  <span className="text-sm">Recurring Conflict (1)</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-primary/40 rounded-full mr-2"></div>
                                  <span className="text-sm">Teacher-Student (1)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Report Actions */}
                      <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                        <Button>
                          <FileText className="h-4 w-4 mr-2" /> Generate Full Report
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" /> Export Data
                        </Button>
                        <Button variant="ghost">
                          <Calendar className="h-4 w-4 mr-2" /> Schedule Reports
                        </Button>
                      </motion.div>
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
                <CardTitle className="text-lg">UK Educational Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    Agreement tracking aligns with UK educational frameworks for behaviour management and restorative practices.
                  </p>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">UK Policy Alignment:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Supports Ofsted requirements for behaviour monitoring</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Aligns with DfE guidance on pupil behaviour</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Complements PSHE curriculum objectives</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" /> Create New Agreement
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" /> Agreement Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" /> Export Agreements
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" /> Manage Participants
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Implementation Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Implementation Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Regular Check-ins</p>
                      <p className="text-muted-foreground">Schedule consistent follow-ups to monitor progress</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Visual Progress</p>
                      <p className="text-muted-foreground">Share progress visuals with participants</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Celebrate Milestones</p>
                      <p className="text-muted-foreground">Acknowledge and celebrate progress achievements</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Adjust as Needed</p>
                      <p className="text-muted-foreground">Be flexible and modify agreements when necessary</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Resources Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>Agreement Tracking Resources</CardTitle>
            <CardDescription>
              Tools and resources to support effective agreement tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Templates</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Age-appropriate agreement templates for different conflict types and educational contexts.
                  </p>
                  <Button variant="outline" className="w-full">Access Templates</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Visual Aids</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Printable progress charts, visual trackers, and other resources for monitoring agreements.
                  </p>
                  <Button variant="outline" className="w-full">Download Visuals</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Training Materials</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Staff training resources on effective agreement monitoring and support strategies.
                  </p>
                  <Button variant="outline" className="w-full">View Training</Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link href="/restorative-justice/conflict-resolution">
            Conflict Resolution
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/restorative-justice/community-building">
            Community Building <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
