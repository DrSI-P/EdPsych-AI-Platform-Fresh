'use client';

import React, { useState, useEffect } from 'react';
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, FileText, Award, BarChart3, Target, Clock, Upload, Download } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

// Sample CPD categories with UK educational standards alignment
const cpdCategories = [
  { id: 1, name: "Subject Knowledge", color: "#4f46e5" },
  { id: 2, name: "Pedagogy", color: "#0ea5e9" },
  { id: 3, name: "Assessment", color: "#10b981" },
  { id: 4, name: "Behaviour Management", color: "#f59e0b" },
  { id: 5, name: "SEND", color: "#8b5cf6" },
  { id: 6, name: "Leadership", color: "#ec4899" },
  { id: 7, name: "Wellbeing", color: "#06b6d4" },
  { id: 8, name: "Digital Skills", color: "#f43f5e" }
];

// Sample CPD activity types
const activityTypes = [
  { id: 1, name: "Course", pointsPerHour: 1 },
  { id: 2, name: "Webinar", pointsPerHour: 1 },
  { id: 3, name: "Conference", pointsPerHour: 1 },
  { id: 4, name: "Reading", pointsPerHour: 0.5 },
  { id: 5, name: "Research", pointsPerHour: 1.5 },
  { id: 6, name: "Peer Observation", pointsPerHour: 1 },
  { id: 7, name: "Mentoring", pointsPerHour: 1.5 },
  { id: 8, name: "Self-study", pointsPerHour: 0.5 }
];

// Sample UK teaching standards
const teachingStandards = [
  { id: 1, code: "TS1", description: "Set high expectations which inspire, motivate and challenge pupils" },
  { id: 2, code: "TS2", description: "Promote good progress and outcomes by pupils" },
  { id: 3, code: "TS3", description: "Demonstrate good subject and curriculum knowledge" },
  { id: 4, code: "TS4", description: "Plan and teach well-structured lessons" },
  { id: 5, code: "TS5", description: "Adapt teaching to respond to the strengths and needs of all pupils" },
  { id: 6, code: "TS6", description: "Make accurate and productive use of assessment" },
  { id: 7, code: "TS7", description: "Manage behaviour effectively to ensure a good and safe learning environment" },
  { id: 8, code: "TS8", description: "Fulfil wider professional responsibilities" }
];

// Sample CPD data for demonstration
const sampleCpdActivities = [
  {
    id: 1,
    title: "Effective Differentiation Strategies",
    type: "Course",
    provider: "EdPsych Connect",
    date: "2025-04-15",
    duration: 6,
    points: 6,
    categories: [2, 5],
    standards: [3, 5],
    status: "Completed",
    evidence: "Certificate",
    reflection: "This course provided valuable strategies for differentiating instruction to meet diverse learning needs. I've implemented the tiered assignment approach in my Year 8 class with positive results."
  },
  {
    id: 2,
    title: "Supporting Pupils with ADHD",
    type: "Webinar",
    provider: "SEND Network",
    date: "2025-04-22",
    duration: 1.5,
    points: 1.5,
    categories: [5, 7],
    standards: [5, 7],
    status: "Completed",
    evidence: "Notes",
    reflection: "The webinar offered practical classroom strategies for supporting pupils with ADHD. I've implemented the structured break system and visual timetables."
  },
  {
    id: 3,
    title: "Assessment for Learning Conference",
    type: "Conference",
    provider: "Education Trust",
    date: "2025-05-10",
    duration: 7,
    points: 7,
    categories: [3],
    standards: [6],
    status: "Planned",
    evidence: "",
    reflection: ""
  },
  {
    id: 4,
    title: "Mentoring NQT in Mathematics Department",
    type: "Mentoring",
    provider: "School",
    date: "2025-03-01",
    duration: 10,
    points: 15,
    categories: [1, 6],
    standards: [3, 8],
    status: "In Progress",
    evidence: "Meeting logs",
    reflection: "Ongoing mentoring relationship that has been mutually beneficial. I've found explaining mathematical concepts to my mentee has deepened my own understanding."
  }
];

// Sample analytics data
const categoryData = [
  { name: "Subject Knowledge", value: 15 },
  { name: "Pedagogy", value: 6 },
  { name: "Assessment", value: 7 },
  { name: "Behaviour Management", value: 0 },
  { name: "SEND", value: 7.5 },
  { name: "Leadership", value: 15 },
  { name: "Wellbeing", value: 1.5 },
  { name: "Digital Skills", value: 0 }
];

const monthlyData = [
  { name: "Sep", points: 3 },
  { name: "Oct", points: 5 },
  { name: "Nov", points: 7 },
  { name: "Dec", points: 2 },
  { name: "Jan", points: 0 },
  { name: "Feb", points: 8 },
  { name: "Mar", points: 15 },
  { name: "Apr", points: 7.5 },
  { name: "May", points: 0 },
  { name: "Jun", points: 0 },
  { name: "Jul", points: 0 },
  { name: "Aug", points: 0 }
];

const standardsData = [
  { name: "TS1", value: 0 },
  { name: "TS2", value: 0 },
  { name: "TS3", value: 21 },
  { name: "TS4", value: 0 },
  { name: "TS5", value: 7.5 },
  { name: "TS6", value: 7 },
  { name: "TS7", value: 1.5 },
  { name: "TS8", value: 15 }
];

export default function CPDTracking() {
  const [activities, setActivities] = useState(sampleCpdActivities);
  const [showAddForm, setShowAddForm] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStandards, setSelectedStandards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [yearlyTarget, setYearlyTarget] = useState(50);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newActivity, setNewActivity] = useState({
    title: "",
    type: "",
    provider: "",
    date: format(new Date(), "yyyy-MM-dd"),
    duration: 0,
    points: 0,
    categories: [],
    standards: [],
    status: "Planned",
    evidence: "",
    reflection: ""
  });

  // Calculate total CPD points
  useEffect(() => {
    const completed = activities.filter(a => a.status === "Completed");
    const total = completed.reduce((sum, activity) => sum + activity.points, 0);
    setTotalPoints(total);
  }, [activities]);

  // Handle form input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewActivity({
      ...newActivity,
      [name]: value
    });
  };

  // Handle activity type selection
  const handleTypeChange = (value) => {
    const selectedType = activityTypes.find(type => type.name === value);
    setNewActivity({
      ...newActivity,
      type: value,
      points: selectedType ? newActivity.duration * selectedType.pointsPerHour : 0
    });
  };

  // Handle duration change
  const handleDurationChange = (value) => {
    const duration = parseFloat(value) || 0;
    const selectedType = activityTypes.find(type => type.name === newActivity.type);
    setNewActivity({
      ...newActivity,
      duration: duration,
      points: selectedType ? duration * selectedType.pointsPerHour : 0
    });
  };

  // Handle category selection
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Handle standard selection
  const handleStandardToggle = (standardId) => {
    setSelectedStandards(prev => {
      if (prev.includes(standardId)) {
        return prev.filter(id => id !== standardId);
      } else {
        return [...prev, standardId];
      }
    });
  };

  // Handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newActivityWithId = {
      ...newActivity,
      id: activities.length + 1,
      categories: selectedCategories,
      standards: selectedStandards,
      date: format(date, "yyyy-MM-dd")
    };
    setActivities([...activities, newActivityWithId]);
    setShowAddForm(false);
    setNewActivity({
      title: "",
      type: "",
      provider: "",
      date: format(new Date(), "yyyy-MM-dd"),
      duration: 0,
      points: 0,
      categories: [],
      standards: [],
      status: "Planned",
      evidence: "",
      reflection: ""
    });
    setSelectedCategories([]);
    setSelectedStandards([]);
  };

  // Handle activity status change
  const handleStatusChange = (id: any, newStatus) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, status: newStatus } : activity
    ));
  };

  // Get category name by ID
  const getCategoryName = (id: any) => {
    const category = cpdCategories.find(cat => cat.id === id);
    return category ? category.name : "";
  };

  // Get category colour by ID
  const getCategoryColor = (id: any) => {
    const category = cpdCategories.find(cat => cat.id === id);
    return category ? category.colour : "#cccccc";
  };

  // Get standard code by ID
  const getStandardCode = (id: any) => {
    const standard = teachingStandards.find(std => std.id === id);
    return standard ? standard.code : "";
  };

  // Generate CPD report
  const generateReport = () => {
    // In a real implementation, this would generate a PDF report
    console.log("Generating CPD report...");
    alert("CPD report generated and ready for download.");
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-centre">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CPD Tracking</h1>
          <p className="text-muted-foreground">
            Record, reflect on, and analyse your continuing professional development activities.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add CPD Activity
          </Button>
          <Button variant="outline" onClick={generateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total CPD Points
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPoints}</div>
                <p className="text-xs text-muted-foreground">
                  Target: {yearlyTarget} points
                </p>
                <Progress 
                  value={(totalPoints / yearlyTarget: any) * 100} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Activities Completed
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activities.filter(a => a.status === "Completed").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Out of {activities.length} total activities
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Hours Invested
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activities.reduce((sum: any, activity) => sum + parseFloat(activity.duration: any), 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all CPD activities
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Your most recent CPD activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {activities.slice(0: any, 3).map(activity => (
                  <div key={activity.id} className="flex items-centre p-2 border rounded-md">
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.type} • {activity.date}
                      </p>
                    </div>
                    <Badge variant={
                      activity.status === "Completed" ? "default" : 
                      activity.status === "In Progress" ? "secondary" : 
                      "outline"
                    }>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" onClick={() => setActiveTab("activities")}>
                  View all activities
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CPD by Category</CardTitle>
                <CardDescription>
                  Distribution of your CPD points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData.filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry: any, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={cpdCategories[index].colour} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" onClick={() => setActiveTab("analytics")}>
                  View detailed analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CPD Activities</CardTitle>
              <CardDescription>
                Manage and reflect on your professional development activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map(activity => (
                  <Card key={activity.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{activity.title}</CardTitle>
                          <CardDescription>
                            {activity.type} • {activity.provider} • {activity.date}
                          </CardDescription>
                        </div>
                        <Badge variant={
                          activity.status === "Completed" ? "default" : 
                          activity.status === "In Progress" ? "secondary" : 
                          "outline"
                        }>
                          {activity.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-semibold mb-2">Details</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">Duration:</div>
                            <div>{activity.duration} hours</div>
                            <div className="text-muted-foreground">CPD Points:</div>
                            <div>{activity.points} points</div>
                            <div className="text-muted-foreground">Categories:</div>
                            <div className="flex flex-wrap gap-1">
                              {activity.categories.map(catId => (
                                <Badge 
                                  key={catId} 
                                  style={{backgroundColor: getCategoryColor(catId)}}
                                >
                                  {getCategoryName(catId: any)}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-muted-foreground">Standards:</div>
                            <div className="flex flex-wrap gap-1">
                              {activity.standards.map(stdId => (
                                <Badge key={stdId} variant="outline">
                                  {getStandardCode(stdId: any)}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-muted-foreground">Evidence:</div>
                            <div>{activity.evidence || "None"}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Reflection</h4>
                          <p className="text-sm">
                            {activity.reflection || "No reflection recorded yet."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/50">
                      <div className="flex gap-2">
                        {activity.status !== "Completed" && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusChange(activity.id: any, "Completed")}
                          >
                            Mark Complete
                          </Button>
                        )}
                        {activity.status === "Planned" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(activity.id: any, "In Progress")}
                          >
                            Start Activity
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-1" />
                          Add Evidence
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly CPD Points</CardTitle>
                <CardDescription>
                  Your CPD points accumulation over the academic year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="points" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CPD by Teaching Standard</CardTitle>
                <CardDescription>
                  Distribution across UK teaching standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={standardsData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>CPD Impact Analysis</CardTitle>
              <CardDescription>
                Evaluating the impact of your professional development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Strengths</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Strong focus on Subject Knowledge (TS3: any)</li>
                      <li>Good development in Leadership skills</li>
                      <li>Regular engagement with CPD activities</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Areas for Development</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Limited focus on Behaviour Management (TS7: any)</li>
                      <li>No recent activities for Digital Skills</li>
                      <li>Consider more activities aligned with TS1 and TS2</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Recommendations</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Consider webinars on behaviour management</li>
                      <li>Explore digital skills courses to enhance teaching</li>
                      <li>Balance CPD across all teaching standards</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Planning Tab */}
        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CPD Planning</CardTitle>
              <CardDescription>
                Set goals and plan your professional development journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Annual CPD Targets</h3>
                  <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearly-target">Yearly CPD Points Target</Label>
                      <div className="flex items-centre gap-2">
                        <Input 
                          id="yearly-target" 
                          type="number" 
                          value={yearlyTarget}
                          onChange={(e: any) => setYearlyTarget(parseInt(e.target.value: any))}
                        />
                        <Button>Update</Button>
                      </div>
                    </div>
                    <div>
                      <Label>Progress</Label>
                      <div className="mt-2">
                        <Progress 
                          value={(totalPoints / yearlyTarget: any) * 100} 
                          className="h-4" 
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {totalPoints} of {yearlyTarget} points ({((totalPoints / yearlyTarget: any) * 100).toFixed(0: any)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Development Focus Areas</h3>
                  <div className="grid gap-4 md:grid-cols-3 mt-4">
                    {cpdCategories.map(category => (
                      <Card key={category.id} className="overflow-hidden">
                        <div 
                          className="h-2" 
                          style={{ backgroundColor: category.colour }}
                        ></div>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">{category.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="flex justify-between text-sm">
                            <span>Current points:</span>
                            <span className="font-medium">
                              {categoryData.find(c => c.name === category.name)?.value || 0}
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="py-2 border-t">
                          <Button variant="ghost" size="sm" className="w-full">
                            Find Activities
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Recommended CPD Activities</h3>
                  <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Digital Assessment Strategies</CardTitle>
                        <CardDescription>
                          Webinar • EdTech Learning • 1.5 hours
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Learn effective strategies for implementing digital assessment tools in your classroom.
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Badge style={{backgroundColor: getCategoryColor(3: any)}}>Assessment</Badge>
                          <Badge style={{backgroundColor: getCategoryColor(8: any)}}>Digital Skills</Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t">
                        <Button size="sm">Add to My CPD Plan</Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Behaviour Management for Secondary</CardTitle>
                        <CardDescription>
                          Course • Behaviour Support Network • 3 hours
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Practical techniques for effective behaviour management in secondary classrooms.
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Badge style={{backgroundColor: getCategoryColor(4: any)}}>Behaviour Management</Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t">
                        <Button size="sm">Add to My CPD Plan</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add CPD Activity Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-centre justify-centre z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add CPD Activity</CardTitle>
              <CardDescription>
                Record a new professional development activity
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Activity Title</Label>
                    <Input 
                      id="title" 
                      name="title"
                      value={newActivity.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Activity Type</Label>
                    <Select 
                      onValueChange={handleTypeChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTypes.map(type => (
                          <SelectItem key={type.id} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Input 
                      id="provider" 
                      name="provider"
                      value={newActivity.provider}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date: any, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hours: any)</Label>
                    <Input 
                      id="duration" 
                      type="number"
                      step="0.5"
                      min="0"
                      value={newActivity.duration}
                      onChange={(e: any) => handleDurationChange(e.target.value: any)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">CPD Points</Label>
                    <Input 
                      id="points" 
                      type="number"
                      step="0.5"
                      min="0"
                      value={newActivity.points}
                      readOnly
                    />
                    <p className="text-xs text-muted-foreground">
                      Points calculated based on activity type and duration
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {cpdCategories.map(category => (
                      <Badge
                        key={category.id}
                        variant={selectedCategories.includes(category.id: any) ? "default" : "outline"}
                        style={selectedCategories.includes(category.id: any) ? {backgroundColor: category.colour} : {}}
                        className="cursor-pointer"
                        onClick={() => handleCategoryToggle(category.id: any)}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Teaching Standards</Label>
                  <div className="flex flex-wrap gap-2">
                    {teachingStandards.map(standard => (
                      <Badge
                        key={standard.id}
                        variant={selectedStandards.includes(standard.id: any) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleStandardToggle(standard.id: any)}
                      >
                        {standard.code}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    defaultValue="Planned"
                    onValueChange={(value: any) => setNewActivity({...newActivity, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planned">Planned</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidence">Evidence</Label>
                  <Input 
                    id="evidence" 
                    name="evidence"
                    value={newActivity.evidence}
                    onChange={handleInputChange}
                    placeholder="e.g., Certificate, Notes, Recording"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reflection">Reflection</Label>
                  <Textarea 
                    id="reflection" 
                    name="reflection"
                    value={newActivity.reflection}
                    onChange={handleInputChange}
                    placeholder="Reflect on what you learned and how you will apply it"
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false: any)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add CPD Activity
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
