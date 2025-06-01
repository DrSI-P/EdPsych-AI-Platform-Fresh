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
  const handleInputChange = (e) => {
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
  const handleSubmit = (e) => {
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
  const handleStatusChange = (id, newStatus) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, status: newStatus } : activity
    ));
  };

  // Get category name by ID
  const getCategoryName = (id) => {
    const category = cpdCategories.find(cat => cat.id === id);
    return category ? category.name : "";
  };

  // Get category colour by ID
  const getCategoryColor = (id) => {
    const category = cpdCategories.find(cat => cat.id === id);
    return category ? category.color : "#cccccc";
  };

  // Get standard code by ID
  const getStandardCode = (id) => {
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
    </div>
  );
}
