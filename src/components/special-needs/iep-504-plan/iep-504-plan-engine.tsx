'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, CheckCircle2, XCircle, FileText, Users, School, Briefcase, BookOpen, Pencil, Target, AlertCircle } from "lucide-react";

const IEP504PlanEngine = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for plan
  const [plan, setPlan] = useState({
    id: '',
    title: '',
    planType: 'iep', // iep or 504
    studentName: '',
    studentId: '',
    dateOfBirth: new Date(),
    startDate: new Date(),
    reviewDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    presentLevels: '',
    strengths: '',
    challenges: '',
    parentInput: '',
    studentInput: '',
    goals: [],
    accommodations: [],
    services: [],
    teamMembers: [],
    status: 'draft'
  });
  
  // State for goals
  const [newGoal, setNewGoal] = useState({
    title: '',
    area: 'academic',
    description: '',
    baselineData: '',
    evaluationMethod: 'observation',
    mastery: '',
    timeline: '3 months',
    objectives: [],
    progress: 0
  });
  
  // State for objectives
  const [newObjective, setNewObjective] = useState('');
  
  // State for accommodations
  const [newAccommodation, setNewAccommodation] = useState({
    title: '',
    category: 'instructional',
    description: '',
    frequency: 'daily',
    location: 'all classes',
    provider: '',
    notes: ''
  });
  
  // State for services
  const [newService, setNewService] = useState({
    title: '',
    provider: '',
    frequency: 'weekly',
    duration: '30 minutes',
    location: 'resource room',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    description: ''
  });
  
  // State for team members
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    role: 'teacher',
    email: '',
    phone: '',
    notes: ''
  });
  
  // State for plans list
  const [plans, setPlans] = useState([]);
  
  // Plan types
  const planTypes = [
    { value: 'iep', label: 'Individualised Education Plan (IEP)', icon: <BookOpen className="h-4 w-4" /> },
    { value: '504', label: '504 Accommodation Plan', icon: <FileText className="h-4 w-4" /> }
  ];
  
  // Goal areas
  const goalAreas = [
    { value: 'academic', label: 'Academic' },
    { value: 'social', label: 'Social/Emotional' },
    { value: 'behavioural', label: 'Behavioural' },
    { value: 'communication', label: 'Communication' },
    { value: 'motor', label: 'Motor Skills' },
    { value: 'functional', label: 'Functional/Life Skills' },
    { value: 'transition', label: 'Transition' }
  ];
  
  // Evaluation methods
  const evaluationMethods = [
    { value: 'observation', label: 'Teacher Observation' },
    { value: 'work_samples', label: 'Work Samples' },
    { value: 'assessment', label: 'Formal Assessment' },
    { value: 'rubric', label: 'Rubric' },
    { value: 'data_collection', label: 'Data Collection' },
    { value: 'self_assessment', label: 'Student Self-Assessment' }
  ];
  
  // Accommodation categories
  const accommodationCategories = [
    { value: 'instructional', label: 'Instructional' },
    { value: 'environmental', label: 'Environmental' },
    { value: 'assessment', label: 'Assessment/Testing' },
    { value: 'behavioural', label: 'Behavioural Support' },
    { value: 'communication', label: 'Communication' },
    { value: 'physical', label: 'Physical/Motor' },
    { value: 'sensory', label: 'Sensory' }
  ];
  
  // Service frequencies
  const serviceFrequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'termly', label: 'Termly' },
    { value: 'as_needed', label: 'As Needed' }
  ];
  
  // Team member roles
  const teamMemberRoles = [
    { value: 'teacher', label: 'Teacher' },
    { value: 'senco', label: 'SENCO' },
    { value: 'parent', label: 'Parent/Guardian' },
    { value: 'student', label: 'Student' },
    { value: 'ed_psych', label: 'Educational Psychologist' },
    { value: 'speech_therapist', label: 'Speech & Language Therapist' },
    { value: 'ot', label: 'Occupational Therapist' },
    { value: 'counselor', label: 'School Counsellor' },
    { value: 'admin', label: 'School Administrator' },
    { value: 'other', label: 'Other Professional' }
  ];
  
  // Fetch plans on component mount
  useEffect(() => {
    if (session?.user) {
      fetchPlans();
    }
  }, [session]);
  
  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/special-needs/iep-504-plan/plans');
      // const data = await response.json();
      // setPlans(data.plans || []);
      
      // Mock data for demonstration
      setTimeout(() => {
        setPlans([
          {
            id: '1',
            title: 'Literacy Support IEP',
            planType: 'iep',
            studentName: 'Alex Johnson',
            startDate: new Date(2025, 3, 15),
            reviewDate: new Date(2025, 9, 15),
            status: 'active',
            progress: 35
          },
          {
            id: '2',
            title: 'Classroom Accommodations Plan',
            planType: '504',
            studentName: 'Sam Taylor',
            startDate: new Date(2025, 4, 1),
            reviewDate: new Date(2025, 10, 1),
            status: 'draft',
            progress: 0
          }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setIsLoading(false);
    }
  };
  
  const handleAddObjective = () => {
    if (!newObjective) {
      return;
    }
    
    setNewGoal(prev => ({
      ...prev,
      objectives: [...prev.objectives, newObjective]
    }));
    
    setNewObjective('');
  };
  
  const handleRemoveObjective = (index) => {
    setNewGoal(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.description) {
      toast({
        title: "Missing information",
        description: "Please provide a title and description for the goal.",
        variant: "destructive",
      });
      return;
    }
    
    setPlan(prev => ({
      ...prev,
      goals: [...prev.goals, { ...newGoal, id: Date.now().toString() }]
    }));
    
    setNewGoal({
      title: '',
      area: 'academic',
      description: '',
      baselineData: '',
      evaluationMethod: 'observation',
      mastery: '',
      timeline: '3 months',
      objectives: [],
      progress: 0
    });
  };
  
  const handleAddAccommodation = () => {
    if (!newAccommodation.title || !newAccommodation.description) {
      toast({
        title: "Missing information",
        description: "Please provide a title and description for the accommodation.",
        variant: "destructive",
      });
      return;
    }
    
    setPlan(prev => ({
      ...prev,
      accommodations: [...prev.accommodations, { ...newAccommodation, id: Date.now().toString() }]
    }));
    
    setNewAccommodation({
      title: '',
      category: 'instructional',
      description: '',
      frequency: 'daily',
      location: 'all classes',
      provider: '',
      notes: ''
    });
  };
  
  const handleAddService = () => {
    if (!newService.title || !newService.provider) {
      toast({
        title: "Missing information",
        description: "Please provide a title and provider for the service.",
        variant: "destructive",
      });
      return;
    }
    
    setPlan(prev => ({
      ...prev,
      services: [...prev.services, { ...newService, id: Date.now().toString() }]
    }));
    
    setNewService({
      title: '',
      provider: '',
      frequency: 'weekly',
      duration: '30 minutes',
      location: 'resource room',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      description: ''
    });
  };
  
  const handleAddTeamMember = () => {
    if (!newTeamMember.name || !newTeamMember.role) {
      toast({
        title: "Missing information",
        description: "Please provide a name and role for the team member.",
        variant: "destructive",
      });
      return;
    }
    
    setPlan(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { ...newTeamMember, id: Date.now().toString() }]
    }));
    
    setNewTeamMember({
      name: '',
      role: 'teacher',
      email: '',
      phone: '',
      notes: ''
    });
  };
  
  const handleRemoveGoal = (id) => {
    setPlan(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== id)
    }));
  };
  
  const handleRemoveAccommodation = (id) => {
    setPlan(prev => ({
      ...prev,
      accommodations: prev.accommodations.filter(accommodation => accommodation.id !== id)
    }));
  };
  
  const handleRemoveService = (id) => {
    setPlan(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== id)
    }));
  };
  
  const handleRemoveTeamMember = (id) => {
    setPlan(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== id)
    }));
  };
  
  const handleSavePlan = async () => {
    if (!plan.title || !plan.studentName) {
      toast({
        title: "Missing information",
        description: "Please provide a title and student name.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/special-needs/iep-504-plan/plans', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(plan),
      // });
      
      // Mock successful save
      setTimeout(() => {
        toast({
          title: "Plan saved",
          description: `Your ${plan.planType === 'iep' ? 'IEP' : '504 Plan'} has been saved successfully.`,
        });
        
        // Update the list with the new plan
        if (!plan.id) {
          const newPlan = {
            ...plan,
            id: Date.now().toString(),
            progress: 0
          };
          setPlans(prev => [...prev, newPlan]);
          setPlan(newPlan);
        } else {
          setPlans(prev => 
            prev.map(p => p.id === plan.id ? plan : p)
          );
        }
        
        setIsLoading(false);
        setActiveTab('dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "Error",
        description: "Failed to save plan. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const handleCreateNewPlan = () => {
    setPlan({
      id: '',
      title: '',
      planType: 'iep',
      studentName: '',
      studentId: '',
      dateOfBirth: new Date(),
      startDate: new Date(),
      reviewDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      presentLevels: '',
      strengths: '',
      challenges: '',
      parentInput: '',
      studentInput: '',
      goals: [],
      accommodations: [],
      services: [],
      teamMembers: [],
      status: 'draft'
    });
    setActiveTab('create');
  };
  
  const handleEditPlan = (planId) => {
    const planToEdit = plans.find(p => p.id === planId);
    if (planToEdit) {
      setPlan(planToEdit);
      setActiveTab('create');
    }
  };
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-grey-100 text-grey-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-grey-100 text-grey-800';
    }
  };
  
  const getPlanTypeIcon = (type) => {
    const planType = planTypes.find(t => t.value === type);
    return planType ? planType.icon : <FileText className="h-4 w-4" />;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>IEP/504 Plan Management</CardTitle>
          <CardDescription>
            Create and manage Individualised Education Plans (IEPs) and 504 Accommodation Plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="create">Create/Edit Plan</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6 py-4">
              <div className="flex justify-between items-centre">
                <h3 className="text-lg font-medium">Your Plans</h3>
                <Button onClick={handleCreateNewPlan} className="flex items-centre gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Plan
                </Button>
              </div>
              
              {isLoading ? (
                <div className="text-centre py-8">
                  <p>Loading plans...</p>
                </div>
              ) : plans.length === 0 ? (
                <div className="text-centre py-8 border rounded-md bg-grey-50">
                  <h3 className="font-medium mb-2">No plans yet</h3>
                  <p className="text-sm text-grey-500 mb-4">
                    Create your first IEP or 504 plan to support student success.
                  </p>
                  <Button onClick={handleCreateNewPlan} variant="outline" className="flex items-centre gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create New Plan
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {plans.map((p) => (
                    <Card key={p.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-centre gap-2">
                            {getPlanTypeIcon(p.planType)}
                            <CardTitle className="text-lg">{p.title}</CardTitle>
                          </div>
                          <Badge className={getStatusBadgeColor(p.status)}>
                            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription>
                          {p.planType === 'iep' ? 'Individualised Education Plan' : '504 Accommodation Plan'} for {p.studentName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-grey-500">Start Date:</span>
                            <span>{format(new Date(p.startDate), 'PPP')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-grey-500">Review Date:</span>
                            <span>{format(new Date(p.reviewDate), 'PPP')}</span>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-grey-500">Progress:</span>
                              <span>{p.progress}%</span>
                            </div>
                            <div className="w-full bg-grey-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${p.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button 
                          onClick={() => handleEditPlan(p.id)} 
                          variant="outline" 
                          className="w-full"
                        >
                          View & Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Upcoming Reviews</h3>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-800 mb-2">UK SEND Review Timelines</h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <span className="font-medium">IEP Reviews:</span>
                      <span>At least three times per year, typically once per term</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Annual Reviews:</span>
                      <span>Required annually for students with Education, Health and Care Plans (EHCPs)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Transition Reviews:</span>
                      <span>Additional reviews at key transition points (Year 5, Year 9, Year 11)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            {/* Create/Edit Plan Tab */}
            <TabsContent value="create" className="space-y-6 py-4">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="plan-title">Plan Title</Label>
                    <Input
                      id="plan-title"
                      placeholder="e.g., Literacy Support IEP"
                      value={plan.title}
                      onChange={(e) => setPlan(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="plan-type">Plan Type</Label>
                    <Select
                      value={plan.planType}
                      onValueChange={(value) => setPlan(prev => ({ ...prev, planType: value }))}
                    >
                      <SelectTrigger id="plan-type">
                        <SelectValue placeholder="Select plan type" />
                      </SelectTrigger>
                      <SelectContent>
                        {planTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-centre gap-2">
                              {type.icon}
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="student-name">Student Name</Label>
                    <Input
                      id="student-name"
                      placeholder="Full name"
                      value={plan.studentName}
                      onChange={(e) => setPlan(prev => ({ ...prev, studentName: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID (Optional)</Label>
                    <Input
                      id="student-id"
                      placeholder="School ID number"
                      value={plan.studentId}
                      onChange={(e) => setPlan(prev => ({ ...prev, studentId: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {plan.dateOfBirth ? format(plan.dateOfBirth, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={plan.dateOfBirth}
                          onSelect={(date) => setPlan(prev => ({ ...prev, dateOfBirth: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {plan.startDate ? format(plan.startDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={plan.startDate}
                          onSelect={(date) => setPlan(prev => ({ ...prev, startDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Review Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {plan.reviewDate ? format(plan.reviewDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={plan.reviewDate}
                          onSelect={(date) => setPlan(prev => ({ ...prev, reviewDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Student Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="present-levels">Present Levels of Performance</Label>
                    <Textarea
                      id="present-levels"
                      placeholder="Describe the student's current academic and functional performance levels"
                      value={plan.presentLevels}
                      onChange={(e) => setPlan(prev => ({ ...prev, presentLevels: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="strengths">Strengths</Label>
                      <Textarea
                        id="strengths"
                        placeholder="Student's strengths and interests"
                        value={plan.strengths}
                        onChange={(e) => setPlan(prev => ({ ...prev, strengths: e.target.value }))}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="challenges">Areas of Need</Label>
                      <Textarea
                        id="challenges"
                        placeholder="Areas where the student needs support"
                        value={plan.challenges}
                        onChange={(e) => setPlan(prev => ({ ...prev, challenges: e.target.value }))}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="parent-input">Parent/Guardian Input</Label>
                      <Textarea
                        id="parent-input"
                        placeholder="Input from parents/guardians"
                        value={plan.parentInput}
                        onChange={(e) => setPlan(prev => ({ ...prev, parentInput: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="student-input">Student Input</Label>
                      <Textarea
                        id="student-input"
                        placeholder="Input from the student"
                        value={plan.studentInput}
                        onChange={(e) => setPlan(prev => ({ ...prev, studentInput: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Goals Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Goals</h3>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Add New Goal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="goal-title">Goal Title</Label>
                          <Input
                            id="goal-title"
                            placeholder="e.g., Improve reading comprehension"
                            value={newGoal.title}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="goal-area">Area</Label>
                          <Select
                            value={newGoal.area}
                            onValueChange={(value) => setNewGoal(prev => ({ ...prev, area: value }))}
                          >
                            <SelectTrigger id="goal-area">
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                            <SelectContent>
                              {goalAreas.map((area) => (
                                <SelectItem key={area.value} value={area.value}>
                                  {area.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="goal-description">Description</Label>
                        <Textarea
                          id="goal-description"
                          placeholder="Describe the goal in detail"
                          value={newGoal.description}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="baseline-data">Baseline Data</Label>
                          <Textarea
                            id="baseline-data"
                            placeholder="Current performance level"
                            value={newGoal.baselineData}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, baselineData: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="evaluation-method">Evaluation Method</Label>
                          <Select
                            value={newGoal.evaluationMethod}
                            onValueChange={(value) => setNewGoal(prev => ({ ...prev, evaluationMethod: value }))}
                          >
                            <SelectTrigger id="evaluation-method">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              {evaluationMethods.map((method) => (
                                <SelectItem key={method.value} value={method.value}>
                                  {method.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="mastery">Mastery Criteria</Label>
                          <Input
                            id="mastery"
                            placeholder="e.g., 80% accuracy on 3 consecutive assessments"
                            value={newGoal.mastery}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, mastery: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="timeline">Timeline</Label>
                          <Input
                            id="timeline"
                            placeholder="e.g., 3 months"
                            value={newGoal.timeline}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, timeline: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-centre justify-between">
                          <Label htmlFor="objectives">Short-term Objectives</Label>
                          <div className="flex items-centre space-x-2">
                            <Input
                              id="objectives"
                              placeholder="Add an objective"
                              value={newObjective}
                              onChange={(e) => setNewObjective(e.target.value)}
                              className="w-64"
                            />
                            <Button 
                              type="button" 
                              size="sm" 
                              onClick={handleAddObjective}
                              disabled={!newObjective}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                        
                        {newGoal.objectives.length > 0 ? (
                          <ul className="space-y-2 mt-2">
                            {newGoal.objectives.map((objective, index) => (
                              <li key={index} className="flex items-centre justify-between bg-grey-50 p-2 rounded">
                                <span>{index + 1}. {objective}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRemoveObjective(index)}
                                  className="h-8 w-8 p-0"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-grey-500 mt-2">No objectives added yet</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleAddGoal} 
                        disabled={!newGoal.title || !newGoal.description}
                        className="w-full"
                      >
                        Add Goal to Plan
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {plan.goals.length > 0 ? (
                    <div className="space-y-4 mt-4">
                      <h4 className="font-medium">Goals for this Plan:</h4>
                      {plan.goals.map((goal) => (
                        <Card key={goal.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-md">{goal.title}</CardTitle>
                              <Badge>
                                {goalAreas.find(a => a.value === goal.area)?.label || goal.area}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm mb-4">{goal.description}</p>
                            
                            <div className="grid gap-4 md:grid-cols-2 text-sm">
                              <div>
                                <p className="font-medium">Baseline:</p>
                                <p className="text-grey-600">{goal.baselineData || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="font-medium">Evaluation Method:</p>
                                <p className="text-grey-600">
                                  {evaluationMethods.find(m => m.value === goal.evaluationMethod)?.label || goal.evaluationMethod}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium">Mastery Criteria:</p>
                                <p className="text-grey-600">{goal.mastery || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="font-medium">Timeline:</p>
                                <p className="text-grey-600">{goal.timeline || 'Not specified'}</p>
                              </div>
                            </div>
                            
                            {goal.objectives.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <h5 className="text-sm font-medium">Short-term Objectives:</h5>
                                <ul className="space-y-1">
                                  {goal.objectives.map((objective, index) => (
                                    <li key={index} className="text-sm flex items-centre gap-2">
                                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-centre justify-centre text-xs">
                                        {index + 1}
                                      </span>
                                      {objective}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">Progress:</span>
                                <span>{goal.progress}%</span>
                              </div>
                              <div className="w-full bg-grey-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${goal.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRemoveGoal(goal.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove Goal
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-centre py-4 border rounded-md bg-grey-50">
                      <p className="text-sm text-grey-500">No goals added yet</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Accommodations Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Accommodations</h3>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Add New Accommodation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="accommodation-title">Accommodation Title</Label>
                          <Input
                            id="accommodation-title"
                            placeholder="e.g., Extended time for assignments"
                            value={newAccommodation.title}
                            onChange={(e) => setNewAccommodation(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="accommodation-category">Category</Label>
                          <Select
                            value={newAccommodation.category}
                            onValueChange={(value) => setNewAccommodation(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger id="accommodation-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {accommodationCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="accommodation-description">Description</Label>
                        <Textarea
                          id="accommodation-description"
                          placeholder="Describe the accommodation in detail"
                          value={newAccommodation.description}
                          onChange={(e) => setNewAccommodation(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="accommodation-frequency">Frequency</Label>
                          <Input
                            id="accommodation-frequency"
                            placeholder="e.g., Daily, As needed"
                            value={newAccommodation.frequency}
                            onChange={(e) => setNewAccommodation(prev => ({ ...prev, frequency: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="accommodation-location">Location</Label>
                          <Input
                            id="accommodation-location"
                            placeholder="e.g., All classes, Math only"
                            value={newAccommodation.location}
                            onChange={(e) => setNewAccommodation(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="accommodation-provider">Provider</Label>
                          <Input
                            id="accommodation-provider"
                            placeholder="Who will provide this accommodation?"
                            value={newAccommodation.provider}
                            onChange={(e) => setNewAccommodation(prev => ({ ...prev, provider: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="accommodation-notes">Additional Notes</Label>
                          <Input
                            id="accommodation-notes"
                            placeholder="Any additional information"
                            value={newAccommodation.notes}
                            onChange={(e) => setNewAccommodation(prev => ({ ...prev, notes: e.target.value }))}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleAddAccommodation} 
                        disabled={!newAccommodation.title || !newAccommodation.description}
                        className="w-full"
                      >
                        Add Accommodation to Plan
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {plan.accommodations.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 mt-4">
                      {plan.accommodations.map((accommodation) => (
                        <Card key={accommodation.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-md">{accommodation.title}</CardTitle>
                              <Badge>
                                {accommodationCategories.find(c => c.value === accommodation.category)?.label || accommodation.category}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm mb-3">{accommodation.description}</p>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Frequency:</span> {accommodation.frequency}
                              </div>
                              <div>
                                <span className="font-medium">Location:</span> {accommodation.location}
                              </div>
                              {accommodation.provider && (
                                <div>
                                  <span className="font-medium">Provider:</span> {accommodation.provider}
                                </div>
                              )}
                              {accommodation.notes && (
                                <div>
                                  <span className="font-medium">Notes:</span> {accommodation.notes}
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRemoveAccommodation(accommodation.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-centre py-4 border rounded-md bg-grey-50">
                      <p className="text-sm text-grey-500">No accommodations added yet</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Services Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Related Services</h3>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Add New Service</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="service-title">Service Title</Label>
                          <Input
                            id="service-title"
                            placeholder="e.g., Speech Therapy"
                            value={newService.title}
                            onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="service-provider">Provider</Label>
                          <Input
                            id="service-provider"
                            placeholder="Who will provide this service?"
                            value={newService.provider}
                            onChange={(e) => setNewService(prev => ({ ...prev, provider: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="service-frequency">Frequency</Label>
                          <Select
                            value={newService.frequency}
                            onValueChange={(value) => setNewService(prev => ({ ...prev, frequency: value }))}
                          >
                            <SelectTrigger id="service-frequency">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceFrequencies.map((frequency) => (
                                <SelectItem key={frequency.value} value={frequency.value}>
                                  {frequency.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="service-duration">Duration</Label>
                          <Input
                            id="service-duration"
                            placeholder="e.g., 30 minutes"
                            value={newService.duration}
                            onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="service-location">Location</Label>
                        <Input
                          id="service-location"
                          placeholder="Where will the service be provided?"
                          value={newService.location}
                          onChange={(e) => setNewService(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newService.startDate ? format(newService.startDate, 'PPP') : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newService.startDate}
                                onSelect={(date) => setNewService(prev => ({ ...prev, startDate: date }))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newService.endDate ? format(newService.endDate, 'PPP') : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newService.endDate}
                                onSelect={(date) => setNewService(prev => ({ ...prev, endDate: date }))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="service-description">Description</Label>
                        <Textarea
                          id="service-description"
                          placeholder="Describe the service in detail"
                          value={newService.description}
                          onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleAddService} 
                        disabled={!newService.title || !newService.provider}
                        className="w-full"
                      >
                        Add Service to Plan
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {plan.services.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 mt-4">
                      {plan.services.map((service) => (
                        <Card key={service.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-md">{service.title}</CardTitle>
                            <CardDescription>Provider: {service.provider}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div>
                                <span className="font-medium">Frequency:</span> {service.frequency}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span> {service.duration}
                              </div>
                              <div>
                                <span className="font-medium">Location:</span> {service.location}
                              </div>
                              <div>
                                <span className="font-medium">Dates:</span> {format(new Date(service.startDate), 'PP')} - {format(new Date(service.endDate), 'PP')}
                              </div>
                            </div>
                            
                            {service.description && (
                              <p className="text-sm">
                                <span className="font-medium">Description:</span> {service.description}
                              </p>
                            )}
                          </CardContent>
                          <CardFooter className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRemoveService(service.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-centre py-4 border rounded-md bg-grey-50">
                      <p className="text-sm text-grey-500">No services added yet</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Team Members Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Team Members</h3>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Add Team Member</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="member-name">Name</Label>
                          <Input
                            id="member-name"
                            placeholder="Full name"
                            value={newTeamMember.name}
                            onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="member-role">Role</Label>
                          <Select
                            value={newTeamMember.role}
                            onValueChange={(value) => setNewTeamMember(prev => ({ ...prev, role: value }))}
                          >
                            <SelectTrigger id="member-role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMemberRoles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="member-email">Email</Label>
                          <Input
                            id="member-email"
                            placeholder="Email address"
                            type="email"
                            value={newTeamMember.email}
                            onChange={(e) => setNewTeamMember(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="member-phone">Phone</Label>
                          <Input
                            id="member-phone"
                            placeholder="Phone number"
                            value={newTeamMember.phone}
                            onChange={(e) => setNewTeamMember(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="member-notes">Notes</Label>
                        <Textarea
                          id="member-notes"
                          placeholder="Additional information about this team member"
                          value={newTeamMember.notes}
                          onChange={(e) => setNewTeamMember(prev => ({ ...prev, notes: e.target.value }))}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleAddTeamMember} 
                        disabled={!newTeamMember.name || !newTeamMember.role}
                        className="w-full"
                      >
                        Add Team Member
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {plan.teamMembers.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-3 mt-4">
                      {plan.teamMembers.map((member) => (
                        <Card key={member.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-md">{member.name}</CardTitle>
                            <CardDescription>
                              {teamMemberRoles.find(r => r.value === member.role)?.label || member.role}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            {member.email && (
                              <div className="text-sm mb-1">
                                <span className="font-medium">Email:</span> {member.email}
                              </div>
                            )}
                            {member.phone && (
                              <div className="text-sm mb-1">
                                <span className="font-medium">Phone:</span> {member.phone}
                              </div>
                            )}
                            {member.notes && (
                              <div className="text-sm">
                                <span className="font-medium">Notes:</span> {member.notes}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRemoveTeamMember(member.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-centre py-4 border rounded-md bg-grey-50">
                      <p className="text-sm text-grey-500">No team members added yet</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSavePlan} 
                    disabled={isLoading || !plan.title || !plan.studentName}
                  >
                    {isLoading ? "Saving..." : "Save Plan"}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6 py-4">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">IEP/504 Plan Resources</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">UK SEND Legislation & Guidance</CardTitle>
                      <CardDescription>Official guidance and resources</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">SEND Code of Practise 0-25</a>
                          <p className="text-grey-500">Statutory guidance for organisations working with children and young people with SEND</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Education, Health and Care Plans</a>
                          <p className="text-grey-500">Guidance on EHC plans and the assessment process</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Equality Act 2010</a>
                          <p className="text-grey-500">Legal framework for disability rights and reasonable adjustments</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Professional Organisations</CardTitle>
                      <CardDescription>Support and guidance from specialist organisations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">NASEN (National Association for Special Educational Needs)</a>
                          <p className="text-grey-500">Resources and guidance for SEND professionals</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Council for Disabled Children</a>
                          <p className="text-grey-500">Information and resources for supporting disabled children</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">IPSEA (Independent Provider of Special Education Advice)</a>
                          <p className="text-grey-500">Legal advice and resources for families</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Templates and Tools</CardTitle>
                      <CardDescription>Practical resources for plan development</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">IEP Template (Word format)</a>
                          <p className="text-grey-500">Customisable template for creating IEPs</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">504 Plan Template (Word format)</a>
                          <p className="text-grey-500">Customisable template for creating 504 plans</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Goal Bank by Subject Area</a>
                          <p className="text-grey-500">Sample goals and objectives for different areas</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Research and Evidence</CardTitle>
                      <CardDescription>Evidence-based approaches to SEND support</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Education Endowment Foundation</a>
                          <p className="text-grey-500">Research on effective interventions for SEND</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">British Journal of Special Education</a>
                          <p className="text-grey-500">Academic research on special education</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">What Works Clearinghouse</a>
                          <p className="text-grey-500">Evidence-based practices in education</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-800 mb-2">Evidence-Based Practices for IEPs and 504 Plans</h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">SMART Goals:</span> Ensure goals are Specific, Measurable, Achievable, Relevant, and Time-bound for effective progress monitoring.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Student Voice:</span> Include student input in the planning process to increase engagement and ownership.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Regular Review:</span> Schedule regular reviews of plans to assess progress and make necessary adjustments.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Collaborative Approach:</span> Involve all stakeholders including parents, teachers, specialists, and the student in plan development.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IEP504PlanEngine;
