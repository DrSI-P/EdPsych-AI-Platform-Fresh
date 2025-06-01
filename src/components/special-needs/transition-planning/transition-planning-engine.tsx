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
import { CalendarIcon, PlusCircle, CheckCircle2, XCircle, FileText, Users, School, Briefcase } from "lucide-react";

const TransitionPlanningEngine = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('plan');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for transition plan
  const [transitionPlan, setTransitionPlan] = useState({
    id: '',
    title: '',
    transitionType: 'school-to-school',
    startDate: new Date(),
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    studentStrengths: '',
    studentNeeds: '',
    studentPreferences: '',
    goals: [],
    supportTeam: [],
    resources: [],
    accommodations: [],
    status: 'draft'
  });
  
  // State for goals
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'academic',
    steps: [],
    status: 'not-started'
  });
  
  // State for steps
  const [newStep, setNewStep] = useState('');
  
  // State for support team member
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    role: '',
    contactInfo: '',
    responsibilities: ''
  });
  
  // State for resources
  const [newResource, setNewResource] = useState({
    title: '',
    type: 'document',
    link: '',
    description: ''
  });
  
  // State for accommodations
  const [newAccommodation, setNewAccommodation] = useState({
    title: '',
    category: 'environmental',
    description: '',
    implementationNotes: ''
  });
  
  // State for transition plans list
  const [transitionPlans, setTransitionPlans] = useState([]);
  
  // Transition types
  const transitionTypes = [
    { value: 'school-to-school', label: 'School to School', icon: <School className="h-4 w-4" /> },
    { value: 'year-to-year', label: 'Year to Year', icon: <School className="h-4 w-4" /> },
    { value: 'primary-to-secondary', label: 'Primary to Secondary', icon: <School className="h-4 w-4" /> },
    { value: 'secondary-to-college', label: 'Secondary to College/University', icon: <School className="h-4 w-4" /> },
    { value: 'education-to-employment', label: 'Education to Employment', icon: <Briefcase className="h-4 w-4" /> },
    { value: 'other', label: 'Other Transition', icon: <FileText className="h-4 w-4" /> }
  ];
  
  // Goal categories
  const goalCategories = [
    { value: 'academic', label: 'Academic' },
    { value: 'social', label: 'Social' },
    { value: 'emotional', label: 'Emotional' },
    { value: 'independence', label: 'Independence' },
    { value: 'communication', label: 'Communication' },
    { value: 'career', label: 'Career/Vocational' }
  ];
  
  // Team member roles
  const teamMemberRoles = [
    { value: 'teacher', label: 'Teacher' },
    { value: 'senco', label: 'SENCO' },
    { value: 'parent', label: 'Parent/Guardian' },
    { value: 'therapist', label: 'Therapist' },
    { value: 'psychologist', label: 'Educational Psychologist' },
    { value: 'student', label: 'Student' },
    { value: 'other', label: 'Other Support' }
  ];
  
  // Resource types
  const resourceTypes = [
    { value: 'document', label: 'Document' },
    { value: 'website', label: 'Website' },
    { value: 'video', label: 'Video' },
    { value: 'contact', label: 'Contact Information' },
    { value: 'tool', label: 'Tool/Aid' }
  ];
  
  // Accommodation categories
  const accommodationCategories = [
    { value: 'environmental', label: 'Environmental' },
    { value: 'instructional', label: 'Instructional' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'social', label: 'Social/Emotional' },
    { value: 'organizational', label: 'Organizational' },
    { value: 'sensory', label: 'Sensory' }
  ];
  
  // Fetch transition plans on component mount
  useEffect(() => {
    if (session?.user) {
      fetchTransitionPlans();
    }
  }, [session]);
  
  const fetchTransitionPlans = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/special-needs/transition-planning/plans');
      // const data = await response.json();
      // setTransitionPlans(data.plans || []);
      
      // Mock data for demonstration
      setTimeout(() => {
        setTransitionPlans([
          {
            id: '1',
            title: 'Year 6 to Year 7 Transition',
            transitionType: 'primary-to-secondary',
            startDate: new Date(2025, 4, 1),
            targetDate: new Date(2025, 8, 1),
            status: 'in-progress',
            progress: 40
          },
          {
            id: '2',
            title: 'Moving to New School',
            transitionType: 'school-to-school',
            startDate: new Date(2025, 5, 15),
            targetDate: new Date(2025, 7, 30),
            status: 'draft',
            progress: 10
          }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching transition plans:', error);
      setIsLoading(false);
    }
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
    
    setTransitionPlan(prev => ({
      ...prev,
      goals: [...prev.goals, { ...newGoal, id: Date.now().toString() }]
    }));
    
    setNewGoal({
      title: '',
      description: '',
      category: 'academic',
      steps: [],
      status: 'not-started'
    });
  };
  
  const handleAddStep = () => {
    if (!newStep) {
      return;
    }
    
    setNewGoal(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
    
    setNewStep('');
  };
  
  const handleRemoveStep = (index) => {
    setNewGoal(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
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
    
    setTransitionPlan(prev => ({
      ...prev,
      supportTeam: [...prev.supportTeam, { ...newTeamMember, id: Date.now().toString() }]
    }));
    
    setNewTeamMember({
      name: '',
      role: '',
      contactInfo: '',
      responsibilities: ''
    });
  };
  
  const handleAddResource = () => {
    if (!newResource.title) {
      toast({
        title: "Missing information",
        description: "Please provide a title for the resource.",
        variant: "destructive",
      });
      return;
    }
    
    setTransitionPlan(prev => ({
      ...prev,
      resources: [...prev.resources, { ...newResource, id: Date.now().toString() }]
    }));
    
    setNewResource({
      title: '',
      type: 'document',
      link: '',
      description: ''
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
    
    setTransitionPlan(prev => ({
      ...prev,
      accommodations: [...prev.accommodations, { ...newAccommodation, id: Date.now().toString() }]
    }));
    
    setNewAccommodation({
      title: '',
      category: 'environmental',
      description: '',
      implementationNotes: ''
    });
  };
  
  const handleRemoveGoal = (id) => {
    setTransitionPlan(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== id)
    }));
  };
  
  const handleRemoveTeamMember = (id) => {
    setTransitionPlan(prev => ({
      ...prev,
      supportTeam: prev.supportTeam.filter(member => member.id !== id)
    }));
  };
  
  const handleRemoveResource = (id) => {
    setTransitionPlan(prev => ({
      ...prev,
      resources: prev.resources.filter(resource => resource.id !== id)
    }));
  };
  
  const handleRemoveAccommodation = (id) => {
    setTransitionPlan(prev => ({
      ...prev,
      accommodations: prev.accommodations.filter(accommodation => accommodation.id !== id)
    }));
  };
  
  const handleSaveTransitionPlan = async () => {
    if (!transitionPlan.title || !transitionPlan.transitionType) {
      toast({
        title: "Missing information",
        description: "Please provide a title and transition type.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/special-needs/transition-planning/plans', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(transitionPlan),
      // });
      
      // Mock successful save
      setTimeout(() => {
        toast({
          title: "Transition plan saved",
          description: "Your transition plan has been saved successfully.",
        });
        
        // Update the list with the new plan
        if (!transitionPlan.id) {
          const newPlan = {
            ...transitionPlan,
            id: Date.now().toString(),
            progress: 0
          };
          setTransitionPlans(prev => [...prev, newPlan]);
          setTransitionPlan(newPlan);
        } else {
          setTransitionPlans(prev => 
            prev.map(plan => plan.id === transitionPlan.id ? transitionPlan : plan)
          );
        }
        
        setIsLoading(false);
        setActiveTab('dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving transition plan:', error);
      toast({
        title: "Error",
        description: "Failed to save transition plan. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const handleCreateNewPlan = () => {
    setTransitionPlan({
      id: '',
      title: '',
      transitionType: 'school-to-school',
      startDate: new Date(),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      studentStrengths: '',
      studentNeeds: '',
      studentPreferences: '',
      goals: [],
      supportTeam: [],
      resources: [],
      accommodations: [],
      status: 'draft'
    });
    setActiveTab('plan');
  };
  
  const handleEditPlan = (planId) => {
    const planToEdit = transitionPlans.find(plan => plan.id === planId);
    if (planToEdit) {
      setTransitionPlan(planToEdit);
      setActiveTab('plan');
    }
  };
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-grey-100 text-grey-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-grey-100 text-grey-800';
    }
  };
  
  const getTransitionTypeIcon = (type) => {
    const transitionType = transitionTypes.find(t => t.value === type);
    return transitionType ? transitionType.icon : <FileText className="h-4 w-4" />;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transition Planning Tools</CardTitle>
          <CardDescription>
            Create and manage transition plans for educational changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="plan">Create/Edit Plan</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6 py-4">
              <div className="flex justify-between items-centre">
                <h3 className="text-lg font-medium">Your Transition Plans</h3>
                <Button onClick={handleCreateNewPlan} className="flex items-centre gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Plan
                </Button>
              </div>
              
              {isLoading ? (
                <div className="text-centre py-8">
                  <p>Loading transition plans...</p>
                </div>
              ) : transitionPlans.length === 0 ? (
                <div className="text-centre py-8 border rounded-md bg-grey-50">
                  <h3 className="font-medium mb-2">No transition plans yet</h3>
                  <p className="text-sm text-grey-500 mb-4">
                    Create your first transition plan to help manage educational changes.
                  </p>
                  <Button onClick={handleCreateNewPlan} variant="outline" className="flex items-centre gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create New Plan
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {transitionPlans.map((plan) => (
                    <Card key={plan.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-centre gap-2">
                            {getTransitionTypeIcon(plan.transitionType)}
                            <CardTitle className="text-lg">{plan.title}</CardTitle>
                          </div>
                          <Badge className={getStatusBadgeColor(plan.status)}>
                            {plan.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <CardDescription>
                          {transitionTypes.find(t => t.value === plan.transitionType)?.label || 'Transition Plan'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-grey-500">Start Date:</span>
                            <span>{format(new Date(plan.startDate), 'PPP')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-grey-500">Target Date:</span>
                            <span>{format(new Date(plan.targetDate), 'PPP')}</span>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-grey-500">Progress:</span>
                              <span>{plan.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-grey-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${plan.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button 
                          onClick={() => handleEditPlan(plan.id)} 
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
                <h3 className="text-lg font-medium">Upcoming Transitions</h3>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-800 mb-2">UK Educational Transition Periods</h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Primary to Secondary:</span>
                      <span>Planning should begin in Year 5, with intensive preparation in Year 6 (Summer term)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Key Stage 3 to 4:</span>
                      <span>Subject choices and pathway planning in Year 9 (Spring term)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Secondary to Post-16:</span>
                      <span>Planning should begin in Year 10, with applications in Year 11 (Autumn term)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Post-16 to Higher Education/Employment:</span>
                      <span>Planning should begin in Year 12, with applications in Year 13 (Autumn term)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            {/* Plan Tab */}
            <TabsContent value="plan" className="space-y-6 py-4">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="plan-title">Plan Title</Label>
                    <Input
                      id="plan-title"
                      placeholder="e.g., Year 6 to Year 7 Transition"
                      value={transitionPlan.title}
                      onChange={(e) => setTransitionPlan(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transition-type">Transition Type</Label>
                    <Select
                      value={transitionPlan.transitionType}
                      onValueChange={(value) => setTransitionPlan(prev => ({ ...prev, transitionType: value }))}
                    >
                      <SelectTrigger id="transition-type">
                        <SelectValue placeholder="Select transition type" />
                      </SelectTrigger>
                      <SelectContent>
                        {transitionTypes.map((type) => (
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
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {transitionPlan.startDate ? format(transitionPlan.startDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={transitionPlan.startDate}
                          onSelect={(date) => setTransitionPlan(prev => ({ ...prev, startDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Target Completion Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {transitionPlan.targetDate ? format(transitionPlan.targetDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={transitionPlan.targetDate}
                          onSelect={(date) => setTransitionPlan(prev => ({ ...prev, targetDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-strengths">Student Strengths</Label>
                  <Textarea
                    id="student-strengths"
                    placeholder="What are the student's strengths and interests?"
                    value={transitionPlan.studentStrengths}
                    onChange={(e) => setTransitionPlan(prev => ({ ...prev, studentStrengths: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-needs">Student Needs</Label>
                  <Textarea
                    id="student-needs"
                    placeholder="What specific needs should be addressed during this transition?"
                    value={transitionPlan.studentNeeds}
                    onChange={(e) => setTransitionPlan(prev => ({ ...prev, studentNeeds: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-preferences">Student Preferences</Label>
                  <Textarea
                    id="student-preferences"
                    placeholder="What are the student's preferences for the transition process?"
                    value={transitionPlan.studentPreferences}
                    onChange={(e) => setTransitionPlan(prev => ({ ...prev, studentPreferences: e.target.value }))}
                  />
                </div>
                
                <Separator />
                
                {/* Goals Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Transition Goals</h3>
                  
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
                            placeholder="e.g., Learn school layout"
                            value={newGoal.title}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="goal-category">Category</Label>
                          <Select
                            value={newGoal.category}
                            onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger id="goal-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {goalCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
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
                          placeholder="Describe the goal and what success looks like"
                          value={newGoal.description}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-centre justify-between">
                          <Label htmlFor="goal-steps">Steps to Achieve</Label>
                          <div className="flex items-centre space-x-2">
                            <Input
                              id="goal-steps"
                              placeholder="Add a step"
                              value={newStep}
                              onChange={(e) => setNewStep(e.target.value)}
                              className="w-64"
                            />
                            <Button 
                              type="button" 
                              size="sm" 
                              onClick={handleAddStep}
                              disabled={!newStep}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                        
                        {newGoal.steps.length > 0 ? (
                          <ul className="space-y-2 mt-2">
                            {newGoal.steps.map((step, index) => (
                              <li key={index} className="flex items-centre justify-between bg-grey-50 p-2 rounded">
                                <span>{index + 1}. {step}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRemoveStep(index)}
                                  className="h-8 w-8 p-0"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-grey-500 mt-2">No steps added yet</p>
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
                  
                  {transitionPlan.goals.length > 0 ? (
                    <div className="space-y-4 mt-4">
                      <h4 className="font-medium">Goals for this Transition Plan:</h4>
                      {transitionPlan.goals.map((goal) => (
                        <Card key={goal.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-md">{goal.title}</CardTitle>
                              <Badge>
                                {goalCategories.find(c => c.value === goal.category)?.label || goal.category}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm mb-4">{goal.description}</p>
                            
                            {goal.steps.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium">Steps:</h5>
                                <ul className="space-y-1">
                                  {goal.steps.map((step, index) => (
                                    <li key={index} className="text-sm flex items-centre gap-2">
                                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-centre justify-centre text-xs">
                                        {index + 1}
                                      </span>
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
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
                
                {/* Support Team Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Support Team</h3>
                  
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
                            placeholder="Team member name"
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="member-contact">Contact Information</Label>
                        <Input
                          id="member-contact"
                          placeholder="Email or phone number"
                          value={newTeamMember.contactInfo}
                          onChange={(e) => setNewTeamMember(prev => ({ ...prev, contactInfo: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="member-responsibilities">Responsibilities</Label>
                        <Textarea
                          id="member-responsibilities"
                          placeholder="What will this person be responsible for in the transition process?"
                          value={newTeamMember.responsibilities}
                          onChange={(e) => setNewTeamMember(prev => ({ ...prev, responsibilities: e.target.value }))}
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
                  
                  {transitionPlan.supportTeam.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 mt-4">
                      {transitionPlan.supportTeam.map((member) => (
                        <Card key={member.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-md">{member.name}</CardTitle>
                              <Badge>
                                {teamMemberRoles.find(r => r.value === member.role)?.label || member.role}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            {member.contactInfo && (
                              <div className="text-sm mb-2">
                                <span className="font-medium">Contact:</span> {member.contactInfo}
                              </div>
                            )}
                            
                            {member.responsibilities && (
                              <div className="text-sm">
                                <span className="font-medium">Responsibilities:</span> {member.responsibilities}
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
                
                <Separator />
                
                {/* Resources Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Resources</h3>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Add Resource</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="resource-title">Title</Label>
                          <Input
                            id="resource-title"
                            placeholder="Resource title"
                            value={newResource.title}
                            onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="resource-type">Type</Label>
                          <Select
                            value={newResource.type}
                            onValueChange={(value) => setNewResource(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger id="resource-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {resourceTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="resource-link">Link or Location</Label>
                        <Input
                          id="resource-link"
                          placeholder="URL, file location, or contact details"
                          value={newResource.link}
                          onChange={(e) => setNewResource(prev => ({ ...prev, link: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="resource-description">Description</Label>
                        <Textarea
                          id="resource-description"
                          placeholder="How will this resource help with the transition?"
                          value={newResource.description}
                          onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleAddResource} 
                        disabled={!newResource.title}
                        className="w-full"
                      >
                        Add Resource
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {transitionPlan.resources.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 mt-4">
                      {transitionPlan.resources.map((resource) => (
                        <Card key={resource.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-md">{resource.title}</CardTitle>
                              <Badge>
                                {resourceTypes.find(t => t.value === resource.type)?.label || resource.type}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            {resource.link && (
                              <div className="text-sm mb-2 break-all">
                                <span className="font-medium">Link:</span> {resource.link}
                              </div>
                            )}
                            
                            {resource.description && (
                              <div className="text-sm">
                                <span className="font-medium">Description:</span> {resource.description}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRemoveResource(resource.id)}
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
                      <p className="text-sm text-grey-500">No resources added yet</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Accommodations Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Accommodations</h3>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Add Accommodation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="accommodation-title">Title</Label>
                          <Input
                            id="accommodation-title"
                            placeholder="Accommodation title"
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
                          placeholder="Describe the accommodation needed"
                          value={newAccommodation.description}
                          onChange={(e) => setNewAccommodation(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="accommodation-notes">Implementation Notes</Label>
                        <Textarea
                          id="accommodation-notes"
                          placeholder="How should this accommodation be implemented?"
                          value={newAccommodation.implementationNotes}
                          onChange={(e) => setNewAccommodation(prev => ({ ...prev, implementationNotes: e.target.value }))}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleAddAccommodation} 
                        disabled={!newAccommodation.title || !newAccommodation.description}
                        className="w-full"
                      >
                        Add Accommodation
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {transitionPlan.accommodations.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 mt-4">
                      {transitionPlan.accommodations.map((accommodation) => (
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
                            <div className="text-sm mb-2">
                              <span className="font-medium">Description:</span> {accommodation.description}
                            </div>
                            
                            {accommodation.implementationNotes && (
                              <div className="text-sm">
                                <span className="font-medium">Implementation:</span> {accommodation.implementationNotes}
                              </div>
                            )}
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
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveTransitionPlan} 
                    disabled={isLoading || !transitionPlan.title || !transitionPlan.transitionType}
                  >
                    {isLoading ? "Saving..." : "Save Transition Plan"}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6 py-4">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Transition Planning Resources</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">UK Department for Education</CardTitle>
                      <CardDescription>Official guidance and resources</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">SEND Code of Practise</a>
                          <p className="text-grey-500">Statutory guidance for organisations working with children and young people with SEND</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Transition to Adulthood</a>
                          <p className="text-grey-500">Guidance on preparing for adulthood for young people with SEND</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">School Admissions Code</a>
                          <p className="text-grey-500">Statutory guidance on school admissions</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">National Organisations</CardTitle>
                      <CardDescription>Support and guidance from specialist organisations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">National Autistic Society - Transition Support</a>
                          <p className="text-grey-500">Resources for supporting autistic students through transitions</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">IPSEA - Transition Planning</a>
                          <p className="text-grey-500">Legal advice and resources for transition planning</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Council for Disabled Children</a>
                          <p className="text-grey-500">Transition resources and case studies</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Templates and Tools</CardTitle>
                      <CardDescription>Practical resources for transition planning</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">One-Page Profile Template</a>
                          <p className="text-grey-500">Create a simple profile to share key information about the student</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Transition Meeting Agenda Template</a>
                          <p className="text-grey-500">Structure for effective transition planning meetings</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">School Visit Checklist</a>
                          <p className="text-grey-500">What to look for when visiting a new school</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">Research and Evidence</CardTitle>
                      <CardDescription>Evidence-based approaches to transition planning</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Education Endowment Foundation</a>
                          <p className="text-grey-500">Research on effective transition practices</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">British Journal of Special Education</a>
                          <p className="text-grey-500">Academic research on supporting transitions</p>
                        </li>
                        <li className="text-sm">
                          <a href="#" className="text-blue-600 hover:underline">Nuffield Foundation - School Transitions Research</a>
                          <p className="text-grey-500">Impact of transitions on educational outcomes</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-800 mb-2">Evidence-Based Transition Strategies</h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Familiarisation Visits:</span>
                        <span> Multiple visits to new settings before the transition significantly reduce anxiety and increase readiness.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Peer Buddying:</span>
                        <span> Pairing students with peers who have already made the transition improves social integration and reduces anxiety.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Information Sharing:</span>
                        <span> Structured information exchange between settings leads to better continuity of support.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Visual Supports:</span>
                        <span> Visual timetables, maps, and schedules significantly reduce anxiety for students with SEND during transitions.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Gradual Transition:</span>
                        <span> Phased or gradual transitions are more effective than abrupt changes, particularly for students with autism or anxiety.</span>
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

export default TransitionPlanningEngine;
