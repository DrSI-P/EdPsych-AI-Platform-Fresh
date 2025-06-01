'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  AlertTriangle, 
  Bell, 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Download, 
  Eye, 
  Filter, 
  LineChart, 
  Mail, 
  MessageSquare, 
  Plus, 
  Search, 
  Settings, 
  Share2, 
  Trash2, 
  User
} from "lucide-react";

const TeacherAlertSystem = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [abccRecords, setAbccRecords] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [alertSettings, setAlertSettings] = useState({
    emotionalThreshold: 3,
    behavioralThreshold: 3,
    academicThreshold: 3,
    attendanceThreshold: 3,
    notificationMethods: ["email", "dashboard"],
    autoGenerateReports: true,
    alertFrequency: "daily"
  });
  const [newAbccRecord, setNewAbccRecord] = useState({
    studentId: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    setting: "",
    antecedent: "",
    behaviour: "",
    consequence: "",
    communication: "",
    intensity: "medium",
    duration: "",
    notes: ""
  });
  const [filterOptions, setFilterOptions] = useState({
    dateRange: "all",
    studentId: "all",
    alertType: "all",
    severity: "all",
    status: "all"
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for students
  const mockStudents = [
    { id: "s1", name: "Alex Thompson", year: "Year 5", class: "5A", supportPlan: "IEP", concerns: ["emotional regulation", "attention"] },
    { id: "s2", name: "Jamie Wilson", year: "Year 3", class: "3B", supportPlan: "None", concerns: ["social skills"] },
    { id: "s3", name: "Sam Roberts", year: "Year 6", class: "6C", supportPlan: "504", concerns: ["anxiety", "attendance"] },
    { id: "s4", name: "Casey Morgan", year: "Year 4", class: "4A", supportPlan: "IEP", concerns: ["behavioural", "academic"] },
    { id: "s5", name: "Jordan Taylor", year: "Year 2", class: "2B", supportPlan: "None", concerns: [] },
    { id: "s6", name: "Riley Johnson", year: "Year 5", class: "5B", supportPlan: "504", concerns: ["emotional regulation"] },
    { id: "s7", name: "Avery Williams", year: "Year 3", class: "3A", supportPlan: "IEP", concerns: ["attention", "academic"] },
    { id: "s8", name: "Quinn Davis", year: "Year 6", class: "6A", supportPlan: "None", concerns: ["social skills", "anxiety"] }
  ];
  
  // Mock data for alerts
  const mockAlerts = [
    { 
      id: "a1", 
      studentId: "s1", 
      type: "emotional", 
      description: "Showed signs of emotional distress during mathematics", 
      date: "2025-05-15", 
      time: "10:30", 
      severity: "medium", 
      status: "new", 
      patterns: ["Occurs primarily during mathematics", "Often follows group work activities"],
      recommendations: ["Schedule check-in before mathematics", "Offer alternative seating options"]
    },
    { 
      id: "a2", 
      studentId: "s3", 
      type: "attendance", 
      description: "Third absence this week", 
      date: "2025-05-16", 
      time: "09:00", 
      severity: "high", 
      status: "in-progress", 
      patterns: ["Absences typically on Mondays and Fridays", "Often returns with reports of minor illness"],
      recommendations: ["Contact parents to discuss attendance pattern", "Consider attendance support plan"]
    },
    { 
      id: "a3", 
      studentId: "s4", 
      type: "behavioural", 
      description: "Disruptive behaviour during transition periods", 
      date: "2025-05-16", 
      time: "11:45", 
      severity: "medium", 
      status: "new", 
      patterns: ["Occurs during transitions between activities", "More frequent in afternoons"],
      recommendations: ["Provide visual schedule for transitions", "Implement transition warnings"]
    },
    { 
      id: "a4", 
      studentId: "s7", 
      type: "academic", 
      description: "Significant drop in reading assessment scores", 
      date: "2025-05-14", 
      time: "14:15", 
      severity: "medium", 
      status: "resolved", 
      patterns: ["Performance decreases when reading longer passages", "Struggles with comprehension questions"],
      recommendations: ["Implement reading accommodations from IEP", "Schedule reading intervention sessions"]
    },
    { 
      id: "a5", 
      studentId: "s1", 
      type: "emotional", 
      description: "Withdrawal during playground activities", 
      date: "2025-05-13", 
      time: "12:30", 
      severity: "low", 
      status: "in-progress", 
      patterns: ["Tends to isolate during unstructured time", "More pronounced after academic challenges"],
      recommendations: ["Implement structured social opportunities", "Provide emotional check-in system"]
    },
    { 
      id: "a6", 
      studentId: "s8", 
      type: "social", 
      description: "Conflict with peers during group project", 
      date: "2025-05-16", 
      time: "13:20", 
      severity: "medium", 
      status: "new", 
      patterns: ["Difficulties with collaborative tasks", "Struggles with compromise"],
      recommendations: ["Teach explicit social skills for group work", "Provide structured roles in group activities"]
    },
    { 
      id: "a7", 
      studentId: "s6", 
      type: "emotional", 
      description: "Anxiety symptoms before class presentation", 
      date: "2025-05-15", 
      time: "09:45", 
      severity: "high", 
      status: "in-progress", 
      patterns: ["Anxiety increases before performance tasks", "Physical symptoms include stomachache and headache"],
      recommendations: ["Implement anxiety reduction strategies from 504 plan", "Offer alternative assessment options"]
    }
  ];
  
  // Mock data for ABCC records
  const mockAbccRecords = [
    {
      id: "abcc1",
      studentId: "s1",
      date: "2025-05-15",
      time: "10:25",
      setting: "Mathematics class, group work activity",
      antecedent: "Asked to explain solution to group members",
      behaviour: "Put head down on desk, refused to participate, said 'I can't do this'",
      consequence: "Teacher provided one-on-one support, allowed to work independently",
      communication: "Spoke with student after class, identified fear of being wrong in front of peers",
      intensity: "medium",
      duration: "15 minutes",
      notes: "Similar pattern observed in previous group activities. Consider pre-teaching concepts before group work."
    },
    {
      id: "abcc2",
      studentId: "s4",
      date: "2025-05-16",
      time: "11:40",
      setting: "Transition from reading to lunch",
      antecedent: "Class asked to put away materials and line up",
      behaviour: "Knocked books off desk, refused to line up, raised voice",
      consequence: "Given time to calm down, joined lunch line last",
      communication: "Visual schedule reviewed, reminder of expectations provided",
      intensity: "high",
      duration: "5 minutes",
      notes: "Transitions continue to be challenging. Visual countdown timer may help."
    },
    {
      id: "abcc3",
      studentId: "s3",
      date: "2025-05-14",
      time: "08:55",
      setting: "Morning arrival",
      antecedent: "Parent drop-off, saying goodbye",
      behaviour: "Complained of stomachache, asked to go to nurse",
      consequence: "Visited nurse, no temperature, returned to class after 20 minutes",
      communication: "Gentle encouragement to join morning activities, reminder of day's schedule",
      intensity: "medium",
      duration: "20 minutes",
      notes: "Third time this week with similar pattern. Possible school avoidance."
    },
    {
      id: "abcc4",
      studentId: "s6",
      date: "2025-05-15",
      time: "09:40",
      setting: "English class, presentation preparation",
      antecedent: "Reminder that presentations would begin in 5 minutes",
      behaviour: "Asked to use restroom, returned after 10 minutes, requested to present last",
      consequence: "Allowed to present last, provided written notes option",
      communication: "Discussed anxiety management strategies from 504 plan",
      intensity: "medium",
      duration: "10 minutes",
      notes: "Anxiety primarily performance-related. Consider gradual exposure to speaking opportunities."
    },
    {
      id: "abcc5",
      studentId: "s1",
      date: "2025-05-13",
      time: "12:25",
      setting: "Playground, free play time",
      antecedent: "Approached group playing football, asked to join",
      behaviour: "After being told to wait for next game, walked away and sat alone for remainder of break",
      consequence: "Teaching assistant checked in, student declined support",
      communication: "Brief discussion about friendship skills, encouraged to try again tomorrow",
      intensity: "low",
      duration: "15 minutes",
      notes: "Social initiation is improving, but resilience when faced with rejection needs development."
    }
  ];
  
  // Load data on component mount
  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, we would fetch data from the API
      // For now, we'll use mock data
      setTimeout(() => {
        setStudents(mockStudents);
        setAlerts(mockAlerts);
        setAbccRecords(mockAbccRecords);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/teacher-alerts/settings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(alertSettings),
      // });
      // const data = await response.json();
      
      // Simulating API response
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Alert settings have been saved.",
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCreateAbccRecord = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!newAbccRecord.studentId || !newAbccRecord.antecedent || !newAbccRecord.behaviour || !newAbccRecord.consequence) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/teacher-alerts/abcc', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newAbccRecord),
      // });
      // const data = await response.json();
      
      // Simulating API response and updating local state
      setTimeout(() => {
        const newRecord = {
          id: `abcc${abccRecords.length + 1}`,
          ...newAbccRecord,
          date: newAbccRecord.date || new Date().toISOString().split('T')[0],
          time: newAbccRecord.time || new Date().toTimeString().split(' ')[0].substring(0, 5)
        };
        
        setAbccRecords([newRecord, ...abccRecords]);
        
        // Reset form
        setNewAbccRecord({
          studentId: "",
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          setting: "",
          antecedent: "",
          behaviour: "",
          consequence: "",
          communication: "",
          intensity: "medium",
          duration: "",
          notes: ""
        });
        
        setIsLoading(false);
        toast({
          title: "Success",
          description: "ABCC record has been created.",
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error creating ABCC record:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to create ABCC record. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateAlertStatus = async (alertId, newStatus) => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch(`/api/special-needs/teacher-alerts/alerts/${alertId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });
      // const data = await response.json();
      
      // Update local state
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: newStatus } : alert
      ));
      
      toast({
        title: "Status Updated",
        description: `Alert status changed to ${newStatus}.`,
      });
      
    } catch (error) {
      console.error('Error updating alert status:', error);
      toast({
        title: "Error",
        description: "Failed to update alert status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteAlert = async (alertId) => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch(`/api/special-needs/teacher-alerts/alerts/${alertId}`, {
      //   method: 'DELETE',
      // });
      // const data = await response.json();
      
      // Update local state
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      
      toast({
        title: "Alert Deleted",
        description: "The alert has been deleted.",
      });
      
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: "Failed to delete alert. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteAbccRecord = async (recordId) => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch(`/api/special-needs/teacher-alerts/abcc/${recordId}`, {
      //   method: 'DELETE',
      // });
      // const data = await response.json();
      
      // Update local state
      setAbccRecords(abccRecords.filter(record => record.id !== recordId));
      
      toast({
        title: "Record Deleted",
        description: "The ABCC record has been deleted.",
      });
      
    } catch (error) {
      console.error('Error deleting ABCC record:', error);
      toast({
        title: "Error",
        description: "Failed to delete ABCC record. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleGenerateReport = async (studentId) => {
    try {
      setIsLoading(true);
      
      // This would be replaced with an actual API call
      // const response = await fetch(`/api/special-needs/teacher-alerts/reports/${studentId}`, {
      //   method: 'POST',
      // });
      // const data = await response.json();
      
      // Simulating API response
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Report Generated",
          description: "The behaviour pattern report has been generated and is available for download.",
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error generating report:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getStudentById = (id) => {
    return students.find(student => student.id === id) || { name: "Unknown Student" };
  };
  
  const getAlertTypeIcon = (type) => {
    switch (type) {
      case 'emotional':
        return <span className="bg-purple-100 text-purple-800 p-1 rounded-full"><AlertTriangle className="h-4 w-4" /></span>;
      case 'behavioural':
        return <span className="bg-red-100 text-red-800 p-1 rounded-full"><AlertTriangle className="h-4 w-4" /></span>;
      case 'academic':
        return <span className="bg-blue-100 text-blue-800 p-1 rounded-full"><AlertTriangle className="h-4 w-4" /></span>;
      case 'attendance':
        return <span className="bg-amber-100 text-amber-800 p-1 rounded-full"><AlertTriangle className="h-4 w-4" /></span>;
      case 'social':
        return <span className="bg-green-100 text-green-800 p-1 rounded-full"><AlertTriangle className="h-4 w-4" /></span>;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-700">High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-500">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getIntensityBadge = (intensity) => {
    switch (intensity) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-700">High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };
  
  const getFilteredAlerts = () => {
    let filtered = [...alerts];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(alert => {
        const student = getStudentById(alert.studentId);
        return (
          student.name.toLowerCase().includes(query) ||
          alert.description.toLowerCase().includes(query) ||
          alert.type.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply filters
    if (filterOptions.studentId !== "all") {
      filtered = filtered.filter(alert => alert.studentId === filterOptions.studentId);
    }
    
    if (filterOptions.alertType !== "all") {
      filtered = filtered.filter(alert => alert.type === filterOptions.alertType);
    }
    
    if (filterOptions.severity !== "all") {
      filtered = filtered.filter(alert => alert.severity === filterOptions.severity);
    }
    
    if (filterOptions.status !== "all") {
      filtered = filtered.filter(alert => alert.status === filterOptions.status);
    }
    
    if (filterOptions.dateRange !== "all") {
      const today = new Date();
      const startDate = new Date();
      
      switch (filterOptions.dateRange) {
        case "today":
          // No adjustment needed for today
          break;
        case "week":
          startDate.setDate(today.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(today.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(alert => {
        const alertDate = new Date(alert.date);
        return alertDate >= startDate && alertDate <= today;
      });
    }
    
    return filtered;
  };
  
  const getFilteredAbccRecords = () => {
    let filtered = [...abccRecords];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record => {
        const student = getStudentById(record.studentId);
        return (
          student.name.toLowerCase().includes(query) ||
          record.antecedent.toLowerCase().includes(query) ||
          record.behaviour.toLowerCase().includes(query) ||
          record.consequence.toLowerCase().includes(query) ||
          record.communication.toLowerCase().includes(query) ||
          record.setting.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply student filter
    if (filterOptions.studentId !== "all") {
      filtered = filtered.filter(record => record.studentId === filterOptions.studentId);
    }
    
    // Apply date range filter
    if (filterOptions.dateRange !== "all") {
      const today = new Date();
      const startDate = new Date();
      
      switch (filterOptions.dateRange) {
        case "today":
          // No adjustment needed for today
          break;
        case "week":
          startDate.setDate(today.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(today.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= today;
      });
    }
    
    return filtered;
  };
  
  const getStudentAlertCount = (studentId) => {
    return alerts.filter(alert => alert.studentId === studentId && alert.status !== "resolved").length;
  };
  
  const getStudentAbccCount = (studentId) => {
    return abccRecords.filter(record => record.studentId === studentId).length;
  };
  
  const getStudentConcernBadges = (concerns) => {
    return concerns.map((concern, index) => (
      <Badge key={index} variant="outline" className="mr-1 mb-1">
        {concern}
      </Badge>
    ));
  };
  
  const getRecentAlerts = () => {
    // Sort alerts by date and time, most recent first
    const sorted = [...alerts].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB - dateA;
    });
    
    // Return the 5 most recent alerts
    return sorted.slice(0, 5);
  };
  
  const getAlertsByType = () => {
    const counts = {
      emotional: 0,
      behavioural: 0,
      academic: 0,
      attendance: 0,
      social: 0
    };
    
    alerts.forEach(alert => {
      if (counts[alert.type] !== undefined) {
        counts[alert.type]++;
      }
    });
    
    return counts;
  };
  
  const getAlertsBySeverity = () => {
    const counts = {
      low: 0,
      medium: 0,
      high: 0
    };
    
    alerts.forEach(alert => {
      counts[alert.severity]++;
    });
    
    return counts;
  };
  
  const getAlertsByStatus = () => {
    const counts = {
      new: 0,
      "in-progress": 0,
      resolved: 0
    };
    
    alerts.forEach(alert => {
      counts[alert.status]++;
    });
    
    return counts;
  };
  
  const getStudentsWithMostAlerts = () => {
    const studentAlertCounts = {};
    
    students.forEach(student => {
      studentAlertCounts[student.id] = getStudentAlertCount(student.id);
    });
    
    // Sort students by alert count, descending
    return Object.entries(studentAlertCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([studentId, count]) => ({
        student: getStudentById(studentId),
        count
      }));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teacher Alert System for Concerning Patterns</CardTitle>
          <CardDescription>
            Monitor student behaviour patterns and receive alerts for potential concerns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="abcc">ABCC Chart</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex justify-centre items-centre py-12">
                <p>Loading data...</p>
              </div>
            ) : (
              <>
                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Total Alerts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{alerts.length}</div>
                        <p className="text-sm text-muted-foreground">
                          {alerts.filter(a => a.status === "new").length} new
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Students Monitored</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{students.length}</div>
                        <p className="text-sm text-muted-foreground">
                          {students.filter(s => s.supportPlan !== "None").length} with support plans
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">ABCC Records</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{abccRecords.length}</div>
                        <p className="text-sm text-muted-foreground">
                          Last added: {abccRecords.length > 0 ? formatDate(abccRecords[0].date) : "None"}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Alert Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex space-x-2">
                          <Badge className="bg-blue-500">{getAlertsByStatus().new}</Badge>
                          <Badge className="bg-amber-500">{getAlertsByStatus()["in-progress"]}</Badge>
                          <Badge className="bg-green-500">{getAlertsByStatus().resolved}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          New / In Progress / Resolved
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Alerts</CardTitle>
                        <CardDescription>
                          Most recent alerts across all students
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-4">
                            {getRecentAlerts().map(alert => (
                              <div key={alert.id} className="flex items-start space-x-4 p-2 rounded-md hover:bg-grey-50">
                                <div className="mt-0.5">
                                  {getAlertTypeIcon(alert.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-centre justify-between">
                                    <p className="font-medium">{getStudentById(alert.studentId).name}</p>
                                    <div className="flex items-centre space-x-2">
                                      {getStatusBadge(alert.status)}
                                      {getSeverityBadge(alert.severity)}
                                    </div>
                                  </div>
                                  <p className="text-sm">{alert.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(alert.date)} at {alert.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setActiveTab("alerts")}
                        >
                          View All Alerts
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Students with Most Alerts</CardTitle>
                        <CardDescription>
                          Students requiring additional attention
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-4">
                            {getStudentsWithMostAlerts().map(({ student, count }) => (
                              <div key={student.id} className="flex items-centre justify-between p-2 rounded-md hover:bg-grey-50">
                                <div className="flex items-centre space-x-4">
                                  <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                                    <User className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {student.year}, {student.class}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-centre space-x-2">
                                  <Badge variant="outline" className="bg-red-50 text-red-700">
                                    {count} alerts
                                  </Badge>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setActiveTab("students");
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setActiveTab("students")}
                        >
                          View All Students
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Alert Distribution</CardTitle>
                      <CardDescription>
                        Breakdown of alerts by type and severity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Alerts by Type</h3>
                          <div className="space-y-4">
                            {Object.entries(getAlertsByType()).map(([type, count]) => (
                              <div key={type} className="space-y-2">
                                <div className="flex justify-between items-centre">
                                  <span className="capitalize">{type}</span>
                                  <span>{count}</span>
                                </div>
                                <Progress value={(count / alerts.length) * 100} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Alerts by Severity</h3>
                          <div className="space-y-4">
                            {Object.entries(getAlertsBySeverity()).map(([severity, count]) => (
                              <div key={severity} className="space-y-2">
                                <div className="flex justify-between items-centre">
                                  <span className="capitalize">{severity}</span>
                                  <span>{count}</span>
                                </div>
                                <Progress 
                                  value={(count / alerts.length) * 100} 
                                  className={`h-2 ${
                                    severity === 'low' ? 'bg-blue-100' : 
                                    severity === 'medium' ? 'bg-amber-100' : 
                                    'bg-red-100'
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Alerts Tab */}
                <TabsContent value="alerts" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search alerts..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Select 
                        value={filterOptions.dateRange}
                        onValueChange={(value) => setFilterOptions({...filterOptions, dateRange: value})}
                      >
                        <SelectTrigger className="w-[130px]">
                          <Calendar className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">Past Week</SelectItem>
                          <SelectItem value="month">Past Month</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={filterOptions.studentId}
                        onValueChange={(value) => setFilterOptions({...filterOptions, studentId: value})}
                      >
                        <SelectTrigger className="w-[150px]">
                          <User className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Student" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Students</SelectItem>
                          {students.map(student => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={filterOptions.alertType}
                        onValueChange={(value) => setFilterOptions({...filterOptions, alertType: value})}
                      >
                        <SelectTrigger className="w-[150px]">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Alert Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="emotional">Emotional</SelectItem>
                          <SelectItem value="behavioural">Behavioural</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="attendance">Attendance</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={filterOptions.severity}
                        onValueChange={(value) => setFilterOptions({...filterOptions, severity: value})}
                      >
                        <SelectTrigger className="w-[130px]">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severities</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={filterOptions.status}
                        onValueChange={(value) => setFilterOptions({...filterOptions, status: value})}
                      >
                        <SelectTrigger className="w-[130px]">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Alert List</CardTitle>
                      <CardDescription>
                        Alerts for concerning patterns in student behaviour
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredAlerts().length > 0 ? (
                            getFilteredAlerts().map(alert => (
                              <TableRow key={alert.id}>
                                <TableCell>
                                  <div className="font-medium">{getStudentById(alert.studentId).name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {getStudentById(alert.studentId).year}, {getStudentById(alert.studentId).class}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-centre">
                                    {getAlertTypeIcon(alert.type)}
                                    <span className="ml-2 capitalize">{alert.type}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{alert.description}</TableCell>
                                <TableCell>
                                  <div>{formatDate(alert.date)}</div>
                                  <div className="text-sm text-muted-foreground">{alert.time}</div>
                                </TableCell>
                                <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                                <TableCell>{getStatusBadge(alert.status)}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Select 
                                      value={alert.status}
                                      onValueChange={(value) => handleUpdateAlertStatus(alert.id, value)}
                                    >
                                      <SelectTrigger className="h-8 w-[110px]">
                                        <SelectValue placeholder="Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleDeleteAlert(alert.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-centre py-4">
                                No alerts found matching the current filters.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Alert Details</CardTitle>
                      <CardDescription>
                        Select an alert to view detailed information and patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-centre py-8">
                        <p className="text-muted-foreground">
                          Click on an alert to view detailed information, including identified patterns and recommendations.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* ABCC Chart Tab */}
                <TabsContent value="abcc" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create ABCC Record</CardTitle>
                        <CardDescription>
                          Document behaviour using the Antecedent-Behaviour-Consequence-Communication framework
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="student-select">Student *</Label>
                              <Select 
                                value={newAbccRecord.studentId}
                                onValueChange={(value) => setNewAbccRecord({...newAbccRecord, studentId: value})}
                              >
                                <SelectTrigger id="student-select">
                                  <SelectValue placeholder="Select student" />
                                </SelectTrigger>
                                <SelectContent>
                                  {students.map(student => (
                                    <SelectItem key={student.id} value={student.id}>
                                      {student.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="intensity-select">Intensity</Label>
                              <Select 
                                value={newAbccRecord.intensity}
                                onValueChange={(value) => setNewAbccRecord({...newAbccRecord, intensity: value})}
                              >
                                <SelectTrigger id="intensity-select">
                                  <SelectValue placeholder="Select intensity" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="date-input">Date</Label>
                              <Input 
                                id="date-input"
                                type="date"
                                value={newAbccRecord.date}
                                onChange={(e) => setNewAbccRecord({...newAbccRecord, date: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="time-input">Time</Label>
                              <Input 
                                id="time-input"
                                type="time"
                                value={newAbccRecord.time}
                                onChange={(e) => setNewAbccRecord({...newAbccRecord, time: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="duration-input">Duration</Label>
                              <Input 
                                id="duration-input"
                                placeholder="e.g., 5 minutes"
                                value={newAbccRecord.duration}
                                onChange={(e) => setNewAbccRecord({...newAbccRecord, duration: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="setting-input">Setting</Label>
                            <Input 
                              id="setting-input"
                              placeholder="Where did the behaviour occur?"
                              value={newAbccRecord.setting}
                              onChange={(e) => setNewAbccRecord({...newAbccRecord, setting: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="antecedent-input">Antecedent *</Label>
                            <Textarea 
                              id="antecedent-input"
                              placeholder="What happened immediately before the behaviour?"
                              value={newAbccRecord.antecedent}
                              onChange={(e) => setNewAbccRecord({...newAbccRecord, antecedent: e.target.value})}
                              className="min-h-[80px]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="behaviour-input">Behaviour *</Label>
                            <Textarea 
                              id="behaviour-input"
                              placeholder="What did the student do or say?"
                              value={newAbccRecord.behaviour}
                              onChange={(e) => setNewAbccRecord({...newAbccRecord, behaviour: e.target.value})}
                              className="min-h-[80px]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="consequence-input">Consequence *</Label>
                            <Textarea 
                              id="consequence-input"
                              placeholder="What happened immediately after the behaviour?"
                              value={newAbccRecord.consequence}
                              onChange={(e) => setNewAbccRecord({...newAbccRecord, consequence: e.target.value})}
                              className="min-h-[80px]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="communication-input">Communication</Label>
                            <Textarea 
                              id="communication-input"
                              placeholder="How was the situation communicated with the student?"
                              value={newAbccRecord.communication}
                              onChange={(e) => setNewAbccRecord({...newAbccRecord, communication: e.target.value})}
                              className="min-h-[80px]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="notes-input">Notes</Label>
                            <Textarea 
                              id="notes-input"
                              placeholder="Additional observations or context"
                              value={newAbccRecord.notes}
                              onChange={(e) => setNewAbccRecord({...newAbccRecord, notes: e.target.value})}
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={handleCreateAbccRecord}
                          disabled={isLoading}
                          className="w-full"
                        >
                          {isLoading ? "Creating..." : "Create ABCC Record"}
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>About ABCC Charts</CardTitle>
                        <CardDescription>
                          Understanding the ABCC framework for behaviour analysis
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">What is an ABCC Chart?</h3>
                          <p>
                            The ABCC Chart is an evidence-based tool used in educational psychology to document and analyse behaviour patterns. It helps identify triggers, understand behaviors, and develop effective interventions.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">A - Antecedent</h4>
                            <p className="text-sm">
                              What happened immediately before the behaviour? This includes environmental factors, interactions, demands, or changes that may have triggered the behaviour.
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium">B - Behaviour</h4>
                            <p className="text-sm">
                              The specific, observable behaviour that occurred. Describe what the student did or said in objective, measurable terms.
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium">C - Consequence</h4>
                            <p className="text-sm">
                              What happened immediately after the behaviour? This includes responses from teachers, peers, or changes in the environment that may reinforce or discourage the behaviour.
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium">C - Communication</h4>
                            <p className="text-sm">
                              How the situation was communicated with the student. This includes discussions, feedback, or strategies used to address the behaviour.
                            </p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Benefits of ABCC Charts</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Identifies patterns and triggers of behaviour</li>
                            <li>Provides objective documentation for team meetings</li>
                            <li>Helps develop targeted, evidence-based interventions</li>
                            <li>Measures effectiveness of behaviour support strategies</li>
                            <li>Facilitates communication between school and home</li>
                          </ul>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Best Practices</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Record observations as soon as possible after the event</li>
                            <li>Be specific and objective in your descriptions</li>
                            <li>Focus on observable behaviors rather than interpretations</li>
                            <li>Document multiple instances to identify patterns</li>
                            <li>Review records regularly to inform intervention planning</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle>ABCC Records</CardTitle>
                        <CardDescription>
                          View and analyse behaviour documentation
                        </CardDescription>
                      </div>
                      <div className="flex items-centre space-x-2">
                        <div className="relative w-[250px]">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search records..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        
                        <Select 
                          value={filterOptions.studentId}
                          onValueChange={(value) => setFilterOptions({...filterOptions, studentId: value})}
                        >
                          <SelectTrigger className="w-[150px]">
                            <User className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Student" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Students</SelectItem>
                            {students.map(student => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          value={filterOptions.dateRange}
                          onValueChange={(value) => setFilterOptions({...filterOptions, dateRange: value})}
                        >
                          <SelectTrigger className="w-[130px]">
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Date Range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">Past Week</SelectItem>
                            <SelectItem value="month">Past Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[600px]">
                        <div className="space-y-6">
                          {getFilteredAbccRecords().length > 0 ? (
                            getFilteredAbccRecords().map(record => (
                              <Card key={record.id} className="border-l-4" style={{ 
                                borderLeftColor: record.intensity === 'low' ? '#3B82F6' : 
                                                record.intensity === 'medium' ? '#F59E0B' :
                                                '#EF4444'
                              }}>
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="flex items-centre">
                                        <User className="h-5 w-5 mr-2" />
                                        {getStudentById(record.studentId).name}
                                      </CardTitle>
                                      <CardDescription>
                                        {formatDate(record.date)} at {record.time} • {record.setting}
                                      </CardDescription>
                                    </div>
                                    <div className="flex items-centre space-x-2">
                                      {getIntensityBadge(record.intensity)}
                                      {record.duration && (
                                        <Badge variant="outline" className="flex items-centre">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {record.duration}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="pb-2">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <h4 className="font-medium flex items-centre">
                                        <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2">A</span>
                                        Antecedent
                                      </h4>
                                      <p className="text-sm">{record.antecedent}</p>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <h4 className="font-medium flex items-centre">
                                        <span className="bg-purple-100 text-purple-800 p-1 rounded-full mr-2">B</span>
                                        Behaviour
                                      </h4>
                                      <p className="text-sm">{record.behaviour}</p>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <h4 className="font-medium flex items-centre">
                                        <span className="bg-amber-100 text-amber-800 p-1 rounded-full mr-2">C</span>
                                        Consequence
                                      </h4>
                                      <p className="text-sm">{record.consequence}</p>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <h4 className="font-medium flex items-centre">
                                        <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">C</span>
                                        Communication
                                      </h4>
                                      <p className="text-sm">{record.communication || "Not recorded"}</p>
                                    </div>
                                  </div>
                                  
                                  {record.notes && (
                                    <div className="mt-4 pt-4 border-t">
                                      <h4 className="font-medium">Notes</h4>
                                      <p className="text-sm">{record.notes}</p>
                                    </div>
                                  )}
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteAbccRecord(record.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))
                          ) : (
                            <div className="text-centre py-8">
                              <p className="text-muted-foreground">
                                No ABCC records found matching the current filters.
                              </p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Students Tab */}
                <TabsContent value="students" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search students..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Student List</CardTitle>
                      <CardDescription>
                        Students being monitored for behavioural patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Year/Class</TableHead>
                            <TableHead>Support Plan</TableHead>
                            <TableHead>Areas of Concern</TableHead>
                            <TableHead>Active Alerts</TableHead>
                            <TableHead>ABCC Records</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students
                            .filter(student => {
                              if (!searchQuery) return true;
                              const query = searchQuery.toLowerCase();
                              return (
                                student.name.toLowerCase().includes(query) ||
                                student.year.toLowerCase().includes(query) ||
                                student.class.toLowerCase().includes(query) ||
                                student.supportPlan.toLowerCase().includes(query) ||
                                student.concerns.some(concern => concern.toLowerCase().includes(query))
                              );
                            })
                            .map(student => (
                              <TableRow key={student.id}>
                                <TableCell>
                                  <div className="font-medium">{student.name}</div>
                                </TableCell>
                                <TableCell>
                                  {student.year}, {student.class}
                                </TableCell>
                                <TableCell>
                                  {student.supportPlan === "None" ? (
                                    <span className="text-muted-foreground">None</span>
                                  ) : (
                                    <Badge variant="outline">{student.supportPlan}</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap">
                                    {student.concerns.length > 0 ? (
                                      getStudentConcernBadges(student.concerns)
                                    ) : (
                                      <span className="text-muted-foreground">None</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getStudentAlertCount(student.id) > 0 ? "default" : "outline"}>
                                    {getStudentAlertCount(student.id)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {getStudentAbccCount(student.id)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        setFilterOptions({
                                          ...filterOptions,
                                          studentId: student.id
                                        });
                                        setActiveTab("abcc");
                                      }}
                                    >
                                      Add ABCC
                                    </Button>
                                    
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      onClick={() => handleGenerateReport(student.id)}
                                    >
                                      <LineChart className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Profile</CardTitle>
                      <CardDescription>
                        Select a student to view detailed information and behaviour patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedStudent ? (
                        <div className="space-y-6">
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div>
                              <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                              <p className="text-muted-foreground">
                                {selectedStudent.year}, {selectedStudent.class}
                              </p>
                              
                              <div className="mt-4 space-y-2">
                                <div className="flex items-centre">
                                  <span className="font-medium w-32">Support Plan:</span>
                                  {selectedStudent.supportPlan === "None" ? (
                                    <span className="text-muted-foreground">None</span>
                                  ) : (
                                    <Badge variant="outline">{selectedStudent.supportPlan}</Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-centre">
                                  <span className="font-medium w-32">Areas of Concern:</span>
                                  <div className="flex flex-wrap">
                                    {selectedStudent.concerns.length > 0 ? (
                                      getStudentConcernBadges(selectedStudent.concerns)
                                    ) : (
                                      <span className="text-muted-foreground">None</span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-centre">
                                  <span className="font-medium w-32">Active Alerts:</span>
                                  <Badge variant={getStudentAlertCount(selectedStudent.id) > 0 ? "default" : "outline"}>
                                    {getStudentAlertCount(selectedStudent.id)}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-centre">
                                  <span className="font-medium w-32">ABCC Records:</span>
                                  <Badge variant="outline">
                                    {getStudentAbccCount(selectedStudent.id)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2">
                              <Button 
                                onClick={() => {
                                  setNewAbccRecord({
                                    ...newAbccRecord,
                                    studentId: selectedStudent.id
                                  });
                                  setActiveTab("abcc");
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Create ABCC Record
                              </Button>
                              
                              <Button 
                                variant="outline"
                                onClick={() => handleGenerateReport(selectedStudent.id)}
                              >
                                <LineChart className="mr-2 h-4 w-4" />
                                Generate Report
                              </Button>
                              
                              <Button variant="outline">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share with Team
                              </Button>
                              
                              <Button variant="outline">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Contact Parent/Guardian
                              </Button>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Recent Alerts</h3>
                            <div className="space-y-4">
                              {alerts
                                .filter(alert => alert.studentId === selectedStudent.id)
                                .sort((a, b) => {
                                  const dateA = new Date(`${a.date}T${a.time}`);
                                  const dateB = new Date(`${b.date}T${b.time}`);
                                  return dateB - dateA;
                                })
                                .slice(0, 3)
                                .map(alert => (
                                  <div key={alert.id} className="flex items-start space-x-4 p-2 rounded-md hover:bg-grey-50">
                                    <div className="mt-0.5">
                                      {getAlertTypeIcon(alert.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-centre justify-between">
                                        <p className="font-medium capitalize">{alert.type} Alert</p>
                                        <div className="flex items-centre space-x-2">
                                          {getStatusBadge(alert.status)}
                                          {getSeverityBadge(alert.severity)}
                                        </div>
                                      </div>
                                      <p className="text-sm">{alert.description}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDate(alert.date)} at {alert.time}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              
                              {alerts.filter(alert => alert.studentId === selectedStudent.id).length === 0 && (
                                <p className="text-muted-foreground text-centre py-4">
                                  No alerts recorded for this student.
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Recent ABCC Records</h3>
                            <div className="space-y-4">
                              {abccRecords
                                .filter(record => record.studentId === selectedStudent.id)
                                .sort((a, b) => {
                                  const dateA = new Date(`${a.date}T${a.time}`);
                                  const dateB = new Date(`${b.date}T${b.time}`);
                                  return dateB - dateA;
                                })
                                .slice(0, 3)
                                .map(record => (
                                  <Card key={record.id} className="border-l-4" style={{ 
                                    borderLeftColor: record.intensity === 'low' ? '#3B82F6' : 
                                                    record.intensity === 'medium' ? '#F59E0B' :
                                                    '#EF4444'
                                  }}>
                                    <CardHeader className="pb-2">
                                      <div className="flex justify-between items-start">
                                        <CardDescription>
                                          {formatDate(record.date)} at {record.time} • {record.setting}
                                        </CardDescription>
                                        <div className="flex items-centre space-x-2">
                                          {getIntensityBadge(record.intensity)}
                                          {record.duration && (
                                            <Badge variant="outline" className="flex items-centre">
                                              <Clock className="h-3 w-3 mr-1" />
                                              {record.duration}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <h4 className="font-medium flex items-centre">
                                            <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2">A</span>
                                            Antecedent
                                          </h4>
                                          <p className="text-sm">{record.antecedent}</p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <h4 className="font-medium flex items-centre">
                                            <span className="bg-purple-100 text-purple-800 p-1 rounded-full mr-2">B</span>
                                            Behaviour
                                          </h4>
                                          <p className="text-sm">{record.behaviour}</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              
                              {abccRecords.filter(record => record.studentId === selectedStudent.id).length === 0 && (
                                <p className="text-muted-foreground text-centre py-4">
                                  No ABCC records for this student.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-centre py-8">
                          <p className="text-muted-foreground">
                            Select a student from the list to view their profile and behaviour patterns.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Alert Settings</CardTitle>
                      <CardDescription>
                        Configure when and how alerts are generated
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Alert Thresholds</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-centre">
                                <Label htmlFor="emotional-threshold">Emotional Concerns</Label>
                                <span className="text-sm">{alertSettings.emotionalThreshold}</span>
                              </div>
                              <Slider 
                                id="emotional-threshold"
                                min={1}
                                max={5}
                                step={1}
                                value={[alertSettings.emotionalThreshold]}
                                onValueChange={(value) => setAlertSettings({...alertSettings, emotionalThreshold: value[0]})}
                              />
                              <p className="text-sm text-muted-foreground">
                                Number of emotional incidents before generating an alert
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-centre">
                                <Label htmlFor="behavioural-threshold">Behavioural Concerns</Label>
                                <span className="text-sm">{alertSettings.behavioralThreshold}</span>
                              </div>
                              <Slider 
                                id="behavioural-threshold"
                                min={1}
                                max={5}
                                step={1}
                                value={[alertSettings.behavioralThreshold]}
                                onValueChange={(value) => setAlertSettings({...alertSettings, behavioralThreshold: value[0]})}
                              />
                              <p className="text-sm text-muted-foreground">
                                Number of behavioural incidents before generating an alert
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-centre">
                                <Label htmlFor="academic-threshold">Academic Concerns</Label>
                                <span className="text-sm">{alertSettings.academicThreshold}</span>
                              </div>
                              <Slider 
                                id="academic-threshold"
                                min={1}
                                max={5}
                                step={1}
                                value={[alertSettings.academicThreshold]}
                                onValueChange={(value) => setAlertSettings({...alertSettings, academicThreshold: value[0]})}
                              />
                              <p className="text-sm text-muted-foreground">
                                Number of academic concerns before generating an alert
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-centre">
                                <Label htmlFor="attendance-threshold">Attendance Concerns</Label>
                                <span className="text-sm">{alertSettings.attendanceThreshold}</span>
                              </div>
                              <Slider 
                                id="attendance-threshold"
                                min={1}
                                max={5}
                                step={1}
                                value={[alertSettings.attendanceThreshold]}
                                onValueChange={(value) => setAlertSettings({...alertSettings, attendanceThreshold: value[0]})}
                              />
                              <p className="text-sm text-muted-foreground">
                                Number of absences before generating an alert
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Notification Methods</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-centre space-x-2">
                                  <Switch 
                                    id="email-notifications" 
                                    checked={alertSettings.notificationMethods.includes("email")}
                                    onCheckedChange={(checked) => {
                                      setAlertSettings(prev => {
                                        const updated = { ...prev };
                                        if (checked) {
                                          updated.notificationMethods = [...updated.notificationMethods, "email"];
                                        } else {
                                          updated.notificationMethods = updated.notificationMethods.filter(m => m !== "email");
                                        }
                                        return updated;
                                      });
                                    }}
                                  />
                                  <Label htmlFor="email-notifications" className="flex items-centre">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email Notifications
                                  </Label>
                                </div>
                                
                                <div className="flex items-centre space-x-2">
                                  <Switch 
                                    id="dashboard-notifications" 
                                    checked={alertSettings.notificationMethods.includes("dashboard")}
                                    onCheckedChange={(checked) => {
                                      setAlertSettings(prev => {
                                        const updated = { ...prev };
                                        if (checked) {
                                          updated.notificationMethods = [...updated.notificationMethods, "dashboard"];
                                        } else {
                                          updated.notificationMethods = updated.notificationMethods.filter(m => m !== "dashboard");
                                        }
                                        return updated;
                                      });
                                    }}
                                  />
                                  <Label htmlFor="dashboard-notifications" className="flex items-centre">
                                    <Bell className="h-4 w-4 mr-2" />
                                    Dashboard Notifications
                                  </Label>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="alert-frequency">Alert Frequency</Label>
                              <Select 
                                value={alertSettings.alertFrequency}
                                onValueChange={(value) => setAlertSettings({...alertSettings, alertFrequency: value})}
                              >
                                <SelectTrigger id="alert-frequency">
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="immediate">Immediate</SelectItem>
                                  <SelectItem value="daily">Daily Summary</SelectItem>
                                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-sm text-muted-foreground">
                                How often you want to receive alert notifications
                              </p>
                            </div>
                            
                            <div className="flex items-centre space-x-2">
                              <Switch 
                                id="auto-generate-reports" 
                                checked={alertSettings.autoGenerateReports}
                                onCheckedChange={(checked) => {
                                  setAlertSettings({...alertSettings, autoGenerateReports: checked});
                                }}
                              />
                              <div>
                                <Label htmlFor="auto-generate-reports">Auto-generate Reports</Label>
                                <p className="text-sm text-muted-foreground">
                                  Automatically generate behaviour pattern reports for students with multiple alerts
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleSaveSettings}
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Settings"}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Management</CardTitle>
                      <CardDescription>
                        Export and manage alert and ABCC data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button variant="outline" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Export Alert Data (CSV)
                          </Button>
                          
                          <Button variant="outline" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Export ABCC Records (CSV)
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button variant="outline" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Generate Comprehensive Report
                          </Button>
                          
                          <Button variant="outline" className="w-full">
                            <Settings className="mr-2 h-4 w-4" />
                            Data Retention Settings
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/special-needs')}>
            Back to Special Needs Support
          </Button>
          <Button onClick={() => router.push('/special-needs/emotional-regulation')}>
            Emotional Regulation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TeacherAlertSystem;
