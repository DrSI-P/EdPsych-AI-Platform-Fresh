'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, CheckCircle2, Calendar as CalendarIcon2, Award, Target, ArrowUpRight, Trash2 } from "lucide-react";

export default function CollaborativeGoalSetting() {
  const [activeTab, setActiveTab] = useState("active");
  
  // Sample goals data
  const [goals, setGoals] = useState([
    {
      id: "1",
      title: "Improve my public speaking skills",
      description: "Become more confident when presenting to the class and participate more in discussions",
      category: "personal",
      status: "active",
      progress: 40,
      dueDate: new Date("2025-07-15"),
      milestones: [
        { id: "1-1", title: "Volunteer to answer at least once per lesson", completed: true },
        { id: "1-2", title: "Present to a small group of classmates", completed: true },
        { id: "1-3", title: "Lead a class discussion", completed: false },
        { id: "1-4", title: "Give a presentation to the whole class", completed: false }
      ]
    },
    {
      id: "2",
      title: "Master multiplication tables up to 12",
      description: "Learn all multiplication facts to improve my mental math skills",
      category: "academic",
      status: "active",
      progress: 75,
      dueDate: new Date("2025-06-01"),
      milestones: [
        { id: "2-1", title: "Learn tables 1-5", completed: true },
        { id: "2-2", title: "Learn tables 6-9", completed: true },
        { id: "2-3", title: "Learn tables 10-12", completed: true },
        { id: "2-4", title: "Complete timed test with 90% accuracy", completed: false }
      ]
    },
    {
      id: "3",
      title: "Read 15 books this year",
      description: "Expand my reading by exploring different genres and authors",
      category: "academic",
      status: "active",
      progress: 20,
      dueDate: new Date("2025-12-15"),
      milestones: [
        { id: "3-1", title: "Read 3 books", completed: true },
        { id: "3-2", title: "Read 7 books", completed: false },
        { id: "3-3", title: "Read 11 books", completed: false },
        { id: "3-4", title: "Read 15 books", completed: false }
      ]
    },
    {
      id: "4",
      title: "Improve my organisation skills",
      description: "Keep my notes, assignments, and materials better organised",
      category: "behavioural",
      status: "achieved",
      progress: 100,
      dueDate: new Date("2025-03-30"),
      milestones: [
        { id: "4-1", title: "Create an organisation system for my notes", completed: true },
        { id: "4-2", title: "Use a planner consistently for 2 weeks", completed: true },
        { id: "4-3", title: "Organise my backpack daily", completed: true },
        { id: "4-4", title: "Maintain system for one month", completed: true }
      ]
    }
  ]);
  
  // Filter goals based on active tab
  const filteredGoals = goals.filter(goal => {
    if (activeTab === "active") return goal.status === "active";
    if (activeTab === "achieved") return goal.status === "achieved";
    return true; // "all" tab
  });
  
  // Sample goal categories with colors
  const categories = [
    { id: "academic", name: "Academic", color: "bg-blue-100 text-blue-800" },
    { id: "social", name: "Social", color: "bg-purple-100 text-purple-800" },
    { id: "behavioural", name: "Behavioural", color: "bg-amber-100 text-amber-800" },
    { id: "personal", name: "Personal Growth", color: "bg-green-100 text-green-800" }
  ]  // Get category badge style
  const getCategoryStyle = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.colour : "bg-grey-100 text-grey-800";
  };
  
  // Get category name
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  // Sample reflections for the selected goal
  const goalReflections = [
    {
      id: "r1",
      content: "I've been practicing speaking up in class more often. It's still a bit scary, but I'm getting more comfortable each time.",
      author: "Jamie Smith",
      role: "Student",
      date: "2025-05-01"
    },
    {
      id: "r2",
      content: "Jamie has shown great improvement in class participation. I've noticed increased confidence when answering questions.",
      author: "Ms. Johnson",
      role: "Teacher",
      date: "2025-05-05"
    },
    {
      id: "r3",
      content: "We've been practicing presentations at home. Jamie is working hard on making eye contact and speaking clearly.",
      author: "Mr. Smith",
      role: "Parent",
      date: "2025-05-10"
    }
  ];
  
  // Selected date for new goal
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Collaborative Goal Setting</CardTitle>
          <CardDescription>
            Set, track, and achieve personalized learning goals with support from teachers and parents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="active">Active Goals</TabsTrigger>
              <TabsTrigger value="achieved">Achieved</TabsTrigger>
              <TabsTrigger value="all">All Goals</TabsTrigger>
              <TabsTrigger value="new">Create New</TabsTrigger>
            </TabsList>
            
            {/* Active, Achieved, and All Goals Tabs */}
            {(activeTab === "active" || activeTab === "achieved" || activeTab === "all") && (
              <TabsContent value={activeTab} className="space-y-6">
                <div className="flex justify-between items-centre">
                  <h3 className="text-lg font-medium">
                    {activeTab === "active" ? "My Active Goals" : 
                     activeTab === "achieved" ? "My Achieved Goals" : "All My Goals"}
                  </h3>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {activeTab !== "new" && (
                      <Button onClick={() => setActiveTab("new")}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Goal
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredGoals.length === 0 ? (
                    <div className="text-centre py-8 text-muted-foreground">
                      <p>No goals found in this category.</p>
                    </div>
                  ) : (
                    filteredGoals.map((goal) => (
                      <Card key={goal.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{goal.title}</CardTitle>
                              <CardDescription className="mt-1">{goal.description}</CardDescription>
                            </div>
                            <Badge className={getCategoryStyle(goal.category)}>
                              {getCategoryName(goal.category)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress: {goal.progress}%</span>
                                <span>Due: {format(goal.dueDate, "PPP")}</span>
                              </div>
                              <Progress value={goal.progress} className="h-2" />
                            </div>
                            
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Milestones:</p>
                              <div className="space-y-1">
                                {goal.milestones.map((milestone) => (
                                  <div key={milestone.id} className="flex items-centre">
                                    <div className={`mr-2 ${milestone.completed ? "text-primary" : "text-muted-foreground"}`}>
                                      <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <span className={`text-sm ${milestone.completed ? "line-through text-muted-foreground" : ""}`}>
                                      {milestone.title}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          {goal.status === "active" ? (
                            <>
                              <Button variant="outline">Update Progress</Button>
                              <Button>View Details</Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outline">View Certificate</Button>
                              <Button>View Details</Button>
                            </>
                          )}
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            )}
            
            {/* Create New Goal Tab */}
            <TabsContent value="new" className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Create New Goal</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-title">Goal Title</Label>
                      <Input id="goal-title" placeholder="Enter a clear, specific goal" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goal-category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="goal-description">Description</Label>
                      <Textarea 
                        id="goal-description" 
                        placeholder="Describe your goal in more detail. What do you want to achieve and why is it important to you?"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date);
                              setShowCalendar(false);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goal-collaborators">Collaborators</Label>
                      <div className="flex flex-wrap gap-2 border rounded-md p-2">
                        <Badge>Ms. Johnson (Teacher)</Badge>
                        <Badge>Mr. Smith (Parent)</Badge>
                        <Button variant="ghost" size="sm" className="h-6">
                          <PlusCircle className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-centre mb-2">
                      <Label>Milestones</Label>
                      <Button variant="ghost" size="sm">
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add Milestone
                      </Button>
                    </div>
                    
                    <div className="space-y-3 border rounded-md p-3">
                      <div className="flex items-centre gap-2">
                        <Input placeholder="Milestone 1" className="flex-1" defaultValue="Complete first step toward my goal" />
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-centre gap-2">
                        <Input placeholder="Milestone 2" className="flex-1" defaultValue="Reach halfway point" />
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-centre gap-2">
                        <Input placeholder="Milestone 3" className="flex-1" defaultValue="Practise consistently for two weeks" />
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-centre gap-2">
                        <Input placeholder="Milestone 4" className="flex-1" defaultValue="Achieve final goal" />
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setActiveTab("active")}>Cancel</Button>
                    <Button>Create Goal</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Goal Details View */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Goal Details: Improve my public speaking skills</CardTitle>
              <CardDescription className="mt-1">
                Become more confident when presenting to the class and participate more in discussions
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800">
              Personal Growth
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-centre">
                    <Target className="h-4 w-4 mr-2" />
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-centre">
                    <div className="text-3xl font-bold mb-2">40%</div>
                    <Progress value={40} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">2 of 4 milestones completed</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-centre">
                    <CalendarIcon2 className="h-4 w-4 mr-2" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-centre">
                    <div className="text-sm text-muted-foreground mb-1">Started</div>
                    <div className="font-medium mb-2">March 15, 2025</div>
                    <div className="text-sm text-muted-foreground mb-1">Due Date</div>
                    <div className="font-medium">July 15, 2025</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-centre">
                    <Award className="h-4 w-4 mr-2" />
                    Collaborators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-centre">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-centre justify-centre mr-2">JS</div>
                      <div>
                        <div className="font-medium">Jamie Smith</div>
                        <div className="text-xs text-muted-foreground">Student</div>
                      </div>
                    </div>
                    <div className="flex items-centre">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-centre justify-centre mr-2">MJ</div>
                      <div>
                        <div className="font-medium">Ms. Johnson</div>
                        <div className="text-xs text-muted-foreground">Teacher</div>
                      </div>
                    </div>
                    <div className="flex items-centre">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-centre justify-centre mr-2">PS</div>
                      <div>
                        <div className="font-medium">Mr. Smith</div>
                        <div className="text-xs text-muted-foreground">Parent</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Milestones</h3>
              <div className="space-y-3">
                <div className="flex items-start p-3 border rounded-md bg-muted/50">
                  <div className="text-primary mr-3">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium line-through text-muted-foreground">Volunteer to answer at least once per lesson</h4>
                    <p className="text-sm text-muted-foreground">Completed on April 2, 2025</p>
                  </div>
                  <Button variant="ghost" size="sm">Update</Button>
                </div>
                
                <div className="flex items-start p-3 border rounded-md bg-muted/50">
                  <div className="text-primary mr-3">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium line-through text-muted-foreground">Present to a small group of classmates</h4>
                    <p className="text-sm text-muted-foreground">Completed on April 18, 2025</p>
                  </div>
                  <Button variant="ghost" size="sm">Update</Button>
                </div>
                
                <div className="flex items-start p-3 border rounded-md">
                  <div className="text-muted-foreground mr-3">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Lead a class discussion</h4>
                    <p className="text-sm text-muted-foreground">Planned for May 20, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">Mark Complete</Button>
                </div>
                
                <div className="flex items-start p-3 border rounded-md">
                  <div className="text-muted-foreground mr-3">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Give a presentation to the whole class</h4>
                    <p className="text-sm text-muted-foreground">Planned for June 15, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">Mark Complete</Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-centre">
                <h3 className="text-lg font-medium">Reflections & Feedback</h3>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Reflection
                </Button>
              </div>
              
              <div className="space-y-4">
                {goalReflections.map((reflection) => (
                  <Card key={reflection.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-centre">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-centre justify-centre mr-2">
                            {reflection.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <CardTitle className="text-base">{reflection.author}</CardTitle>
                            <CardDescription>{reflection.role}</CardDescription>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{reflection.date}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{reflection.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Share Progress
          </Button>
          <div className="space-x-2">
            <Button variant="outline">Edit Goal</Button>
            <Button>Mark as Achieved</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
