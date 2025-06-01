'use client';

import React, { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Calendar, 
  ChartBarIcon, 
  ChartPieIcon, 
  Clock, 
  Download, 
  Filter, 
  LineChart, 
  RefreshCw, 
  Share2 
} from "lucide-react";

// Sample data for demonstration
const overviewData = [
  { name: 'Jan', hours: 12 },
  { name: 'Feb', hours: 15 },
  { name: 'Mar', hours: 8 },
  { name: 'Apr', hours: 10 },
  { name: 'May', hours: 5 },
  { name: 'Jun', hours: 20 },
  { name: 'Jul', hours: 18 },
  { name: 'Aug', hours: 12 },
  { name: 'Sep', hours: 14 },
  { name: 'Oct', hours: 10 },
  { name: 'Nov', hours: 7 },
  { name: 'Dec', hours: 4 }
];

const categoryData = [
  { name: 'Teaching Methods', value: 35 },
  { name: 'Subject Knowledge', value: 25 },
  { name: 'Assessment', value: 15 },
  { name: 'SEND', value: 10 },
  { name: 'Leadership', value: 15 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const competencyData = [
  { name: 'Pedagogy', score: 85 },
  { name: 'Subject Knowledge', score: 70 },
  { name: 'Assessment', score: 60 },
  { name: 'Classroom Management', score: 75 },
  { name: 'Digital Skills', score: 50 },
  { name: 'SEND', score: 65 },
  { name: 'Leadership', score: 40 }
];

const goalData = [
  { name: 'Goal 1: Improve Assessment Methods', progress: 75 },
  { name: 'Goal 2: Develop Leadership Skills', progress: 40 },
  { name: 'Goal 3: Enhance Digital Teaching', progress: 60 },
  { name: 'Goal 4: Deepen Subject Knowledge', progress: 85 }
];

export default function ProfessionalDevelopmentAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('year');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-centre mb-6 gap-4">
        <h1 className="text-3xl font-bold">Professional Development Analytics</h1>
        
        <div className="flex items-centre gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="competencies">Competencies</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CPD Hours by Month</CardTitle>
              <CardDescription>
                Your professional development activity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={overviewData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="hours" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
