'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, BookOpen, ClipboardList, BarChart2, Settings, Bell, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const studentData = [
  { name: 'Reading', current: 72, target: 85, previous: 65 },
  { name: 'Writing', current: 68, target: 80, previous: 62 },
  { name: 'Mathematics', current: 80, target: 85, previous: 75 },
  { name: 'Science', current: 75, target: 80, previous: 70 },
  { name: 'Social Studies', current: 82, target: 85, previous: 78 },
];

const attendanceData = [
  { month: 'Sep', attendance: 98 },
  { month: 'Oct', attendance: 96 },
  { month: 'Nov', attendance: 97 },
  { month: 'Dec', attendance: 95 },
  { month: 'Jan', attendance: 94 },
  { month: 'Feb', attendance: 98 },
  { month: 'Mar', attendance: 97 },
  { month: 'Apr', attendance: 96 },
  { month: 'May', attendance: 98 },
];

export default function EducatorDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-centre mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Educator Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your classroom, track student progress, and plan your curriculum
          </p>
        </div>
        <div className="flex items-centre gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] pl-8 md:w-[300px] rounded-full bg-background"
            />
          </div>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last term
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Attendance
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.5%</div>
                <p className="text-xs text-muted-foreground">
                  +1.2% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Curriculum Progress
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72%</div>
                <p className="text-xs text-muted-foreground">
                  On track for term completion
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Assessment Completion
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last assessment period
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Student Progress Overview</CardTitle>
                <CardDescription>
                  Current vs. target achievement levels across subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={studentData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="previous" fill="#94a3b8" name="Previous Term" />
                    <Bar dataKey="current" fill="#3b82f6" name="Current Level" />
                    <Bar dataKey="target" fill="#10b981" name="Target Level" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>
                  Monthly attendance percentage
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={attendanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Schedule and important dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-centre">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Parent-Teacher Conferences</p>
                      <p className="text-sm text-muted-foreground">May 22-23, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <Separator />
                  <div className="flex items-centre">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">End of Term Assessment</p>
                      <p className="text-sm text-muted-foreground">June 10-14, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <Separator />
                  <div className="flex items-centre">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Field Trip - Science Museum</p>
                      <p className="text-sm text-muted-foreground">May 28, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <Separator />
                  <div className="flex items-centre">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Professional Development Day</p>
                      <p className="text-sm text-muted-foreground">June 3, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Events
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>
                  Plan your schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-centre">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
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
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                View and manage your students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-centre mb-4">
                <div className="flex gap-2">
                  <Input placeholder="Search students..." className="w-[300px]" />
                  <Button variant="outline">Search</Button>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="group-a">Group A</SelectItem>
                      <SelectItem value="group-b">Group B</SelectItem>
                      <SelectItem value="sen">SEN Support</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Add Student</Button>
                </div>
              </div>
              
              <div className="border rounded-md">
                <div className="grid grid-cols-6 bg-muted p-3 rounded-t-md font-medium">
                  <div>Name</div>
                  <div>ID</div>
                  <div>Group</div>
                  <div>Attendance</div>
                  <div>Progress</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y">
                  {[
                    { name: "Emma Wilson", id: "S2025-001", group: "Group A", attendance: "98%", progress: "Good" },
                    { name: "James Smith", id: "S2025-002", group: "Group A", attendance: "95%", progress: "Excellent" },
                    { name: "Sophia Chen", id: "S2025-003", group: "Group B", attendance: "97%", progress: "Good" },
                    { name: "Mohammed Ali", id: "S2025-004", group: "Group B", attendance: "92%", progress: "Needs Support" },
                    { name: "Olivia Johnson", id: "S2025-005", group: "SEN", attendance: "94%", progress: "Improving" },
                  ].map((student, i) => (
                    <div key={i} className="grid grid-cols-6 p-3 items-centre">
                      <div>{student.name}</div>
                      <div>{student.id}</div>
                      <div>{student.group}</div>
                      <div>{student.attendance}</div>
                      <div>{student.progress}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">Showing 5 of 28 students</div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Curriculum Planning</CardTitle>
              <CardDescription>
                Manage your curriculum and lesson plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-centre mb-4">
                <div className="flex gap-2">
                  <Select defaultValue="current">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Term</SelectItem>
                      <SelectItem value="next">Next Term</SelectItem>
                      <SelectItem value="previous">Previous Term</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-subjects">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-subjects">All Subjects</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="maths">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Create New Plan</Button>
              </div>
              
              <div className="border rounded-md">
                <div className="grid grid-cols-5 bg-muted p-3 rounded-t-md font-medium">
                  <div>Subject</div>
                  <div>Unit</div>
                  <div>Progress</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y">
                  {[
                    { subject: "English", unit: "Poetry Analysis", progress: "75%", status: "On Track" },
                    { subject: "Mathematics", unit: "Algebra Fundamentals", progress: "80%", status: "On Track" },
                    { subject: "Science", unit: "Ecosystems", progress: "65%", status: "Behind Schedule" },
                    { subject: "History", unit: "Industrial Revolution", progress: "90%", status: "Ahead of Schedule" },
                    { subject: "Geography", unit: "Climate Patterns", progress: "70%", status: "On Track" },
                  ].map((plan, i) => (
                    <div key={i} className="grid grid-cols-5 p-3 items-centre">
                      <div>{plan.subject}</div>
                      <div>{plan.unit}</div>
                      <div>{plan.progress}</div>
                      <div>{plan.status}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Curriculum Plans
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Management</CardTitle>
              <CardDescription>
                Create and manage student assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-centre mb-4">
                <div className="flex gap-2">
                  <Select defaultValue="all-types">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Assessment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">All Types</SelectItem>
                      <SelectItem value="formative">Formative</SelectItem>
                      <SelectItem value="summative">Summative</SelectItem>
                      <SelectItem value="diagnostic">Diagnostic</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-subjects">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-subjects">All Subjects</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="maths">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Create Assessment</Button>
              </div>
              
              <div className="border rounded-md">
                <div className="grid grid-cols-6 bg-muted p-3 rounded-t-md font-medium">
                  <div>Title</div>
                  <div>Subject</div>
                  <div>Type</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y">
                  {[
                    { title: "End of Unit Test", subject: "Mathematics", type: "Summative", date: "May 25, 2025", status: "Scheduled" },
                    { title: "Reading Comprehension", subject: "English", type: "Formative", date: "May 20, 2025", status: "Scheduled" },
                    { title: "Scientific Method Quiz", subject: "Science", type: "Formative", date: "May 18, 2025", status: "Completed" },
                    { title: "Vocabulary Assessment", subject: "English", type: "Diagnostic", date: "May 15, 2025", status: "Completed" },
                    { title: "Geometry Concepts", subject: "Mathematics", type: "Summative", date: "May 10, 2025", status: "Graded" },
                  ].map((assessment, i) => (
                    <div key={i} className="grid grid-cols-6 p-3 items-centre">
                      <div>{assessment.title}</div>
                      <div>{assessment.subject}</div>
                      <div>{assessment.type}</div>
                      <div>{assessment.date}</div>
                      <div>{assessment.status}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Assessments
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Resources</CardTitle>
              <CardDescription>
                Access and manage your teaching materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-centre mb-4">
                <div className="flex gap-2">
                  <Input placeholder="Search resources..." className="w-[300px]" />
                  <Button variant="outline">Search</Button>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all-types">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Resource Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">All Types</SelectItem>
                      <SelectItem value="lesson-plans">Lesson Plans</SelectItem>
                      <SelectItem value="worksheets">Worksheets</SelectItem>
                      <SelectItem value="presentations">Presentations</SelectItem>
                      <SelectItem value="activities">Activities</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Upload Resource</Button>
                </div>
              </div>
              
              <div className="border rounded-md">
                <div className="grid grid-cols-5 bg-muted p-3 rounded-t-md font-medium">
                  <div>Title</div>
                  <div>Type</div>
                  <div>Subject</div>
                  <div>Date Added</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y">
                  {[
                    { title: "Fractions Worksheet", type: "Worksheet", subject: "Mathematics", date: "May 15, 2025" },
                    { title: "Poetry Analysis Guide", type: "Lesson Plan", subject: "English", date: "May 12, 2025" },
                    { title: "Photosynthesis Presentation", type: "Presentation", subject: "Science", date: "May 10, 2025" },
                    { title: "Historical Timeline Activity", type: "Activity", subject: "History", date: "May 8, 2025" },
                    { title: "Grammar Rules Reference", type: "Worksheet", subject: "English", date: "May 5, 2025" },
                  ].map((resource, i) => (
                    <div key={i} className="grid grid-cols-5 p-3 items-centre">
                      <div>{resource.title}</div>
                      <div>{resource.type}</div>
                      <div>{resource.subject}</div>
                      <div>{resource.date}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Resources
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
