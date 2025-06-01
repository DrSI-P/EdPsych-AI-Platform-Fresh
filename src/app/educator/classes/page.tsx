'use client';

import React from 'react';
import { TenantProvider } from '@/components/multi-tenant/tenant-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Users, 
  BookOpen, 
  ChevronRight,
  ChevronDown,
  Lightbulb
} from 'lucide-react';

/**
 * Educator Classes Page
 * 
 * This page allows educators to view and manage their classes.
 */
export default function EducatorClassesPage() {
  return (
    <TenantProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Classes</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search classes..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Create Class
          </Button>
        </div>
        
        <Tabs defaultValue="active" className="mb-6">
          <TabsList>
            <TabsTrigger value="active">Active Classes</TabsTrigger>
            <TabsTrigger value="archived">Archived Classes</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {/* Class Cards */}
              <ClassCard 
                title="Year 5 Mathematics"
                description="Advanced mathematics for Year 5 students"
                students={28}
                nextSession="Monday, 10:00 AM"
                topics={["Fractions", "Decimals", "Percentages"]}
              />
              <ClassCard 
                title="Year 6 English"
                description="English language and literature for Year 6"
                students={24}
                nextSession="Tuesday, 1:30 PM"
                topics={["Shakespeare", "Poetry", "Creative Writing"]}
              />
              <ClassCard 
                title="Year 4 Science"
                description="Introduction to scientific concepts for Year 4"
                students={26}
                nextSession="Wednesday, 11:15 AM"
                topics={["States of Matter", "Electricity", "Sound"]}
              />
            </div>
          </TabsContent>
          <TabsContent value="archived">
            <Alert className="mt-6">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>No archived classes</AlertTitle>
              <AlertDescription>
                You don't have any archived classes. When you archive a class, it will appear here.
              </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="upcoming">
            <Alert className="mt-6">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>No upcoming classes</AlertTitle>
              <AlertDescription>
                You don't have any upcoming classes scheduled. When you create a new class with a future start date, it will appear here.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </TenantProvider>
  );
}

interface ClassCardProps {
  title: string;
  description: string;
  students: number;
  nextSession: string;
  topics: string[];
}

function ClassCard({ title, description, students, nextSession, topics }: ClassCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{students} Students</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Next: {nextSession}</span>
          </div>
          <div className="flex items-start text-sm">
            <BookOpen className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="block mb-1">Current Topics:</span>
              <div className="flex flex-wrap gap-1">
                {topics.map((topic, i) => (
                  <span key={i} className="bg-muted px-2 py-1 rounded-md text-xs">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full flex items-center justify-center">
          View Class
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
