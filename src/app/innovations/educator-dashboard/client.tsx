'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, BookOpen, ClipboardList, BarChart2, Settings, Bell, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StudentProgressChart, AttendanceChart } from './charts';

// Sample data - moved outside component to avoid recreation on each render
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

export function EducatorDashboardClient() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Educator Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your classroom, track student progress, and plan your curriculum
          </p>
        </div>
        <div className="flex items-center gap-4">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
                <StudentProgressChart studentData={studentData} />
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
                <AttendanceChart attendanceData={attendanceData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other tabs content simplified for build performance */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                View and manage your students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Student management interface will load here.</p>
            </CardContent>
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
              <p>Curriculum planning interface will load here.</p>
            </CardContent>
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
              <p>Assessment management interface will load here.</p>
            </CardContent>
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
              <p>Teaching resources interface will load here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}