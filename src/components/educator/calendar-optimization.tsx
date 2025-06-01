'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  BookOpen, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  AlertCircle, 
  CheckCircle2, 
  BarChart4, 
  Settings, 
  Plus,
  Trash2,
  Edit,
  Copy,
  RefreshCw,
  ArrowUpDown,
  Filter
} from 'lucide-react';
// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Activity types with their colors and icons
const activityTypes = {
  teaching: { 
    label: 'Teaching', 
    color: '#4f46e5', 
    icon: <BookOpen className="h-4 w-4" />,
    description: 'Classroom instruction and direct student engagement'
  },
  preparation: { 
    label: 'Preparation', 
    color: '#8b5cf6', 
    icon: <FileText className="h-4 w-4" />,
    description: 'Lesson planning and material preparation'
  },
  administrative: { 
    label: 'Administrative', 
    color: '#ec4899', 
    icon: <Briefcase className="h-4 w-4" />,
    description: 'Paperwork, documentation, and administrative tasks'
  },
  meeting: { 
    label: 'Meeting', 
    color: '#f59e0b', 
    icon: <Users className="h-4 w-4" />,
    description: 'Staff meetings, parent conferences, and collaborative sessions'
  },
  professional: { 
    label: 'Professional Development', 
    color: '#10b981', 
    icon: <GraduationCap className="h-4 w-4" />,
    description: 'Training, workshops, and professional growth activities'
  }
};

// Priority levels with their colors
const priorityLevels = {
  high: { label: 'High', color: '#ef4444' },
  medium: { label: 'Medium', color: '#f59e0b' },
  low: { label: 'Low', color: '#10b981' }
};

// Sample activities for demonstration
const sampleActivities = [
  {
    id: '1',
    title: 'Year 5 Mathematics',
    start: moment().hour(9).minute(0).toDate(),
    end: moment().hour(10).minute(0).toDate(),
    type: 'teaching',
    priority: 'high',
    location: 'Room 101',
    description: 'Fractions and decimals lesson',
    recurring: false,
    participants: ['All Year 5 students']
  },
  {
    id: '2',
    title: 'Lesson Planning',
    start: moment().hour(11).minute(0).toDate(),
    end: moment().hour(12).minute(0).toDate(),
    type: 'preparation',
    priority: 'medium',
    location: 'Staff Room',
    description: 'Prepare next week\'s science lessons',
    recurring: false,
    participants: []
  },
  {
    id: '3',
    title: 'Staff Meeting',
    start: moment().hour(15).minute(30).toDate(),
    end: moment().hour(16).minute(30).toDate(),
    type: 'meeting',
    priority: 'medium',
    location: 'Conference Room',
    description: 'Weekly staff catch-up and planning',
    recurring: true,
    participants: ['All teaching staff']
  },
  {
    id: '4',
    title: 'Progress Reports',
    start: moment().add(1, 'days').hour(13).minute(0).toDate(),
    end: moment().add(1, 'days').hour(15).minute(0).toDate(),
    type: 'administrative',
    priority: 'high',
    location: 'Office',
    description: 'Complete end-of-term progress reports',
    recurring: false,
    participants: []
  },
  {
    id: '5',
    title: 'Inclusive Teaching Workshop',
    start: moment().add(2, 'days').hour(9).minute(0).toDate(),
    end: moment().add(2, 'days').hour(12).minute(0).toDate(),
    type: 'professional',
    priority: 'medium',
    location: 'Training Center',
    description: 'Professional development on inclusive teaching strategies',
    recurring: false,
    participants: ['All teaching staff']
  }
];
import { useAIService } from '@/lib/ai/ai-service';
interface CalendarOptimizationProps {
  className?: string;
}

export function CalendarOptimization({ className = '' }: CalendarOptimizationProps) {
  const { toast } = useToast();
  const aiService = useAIService();
  
  // State for activities
  const [activities, setActivities] = useState<any[]>(sampleActivities);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isOptimizeDialogOpen, setIsOptimizeDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  
  // State for new/edited activity
  const [activityForm, setActivityForm] = useState({
    id: '',
    title: '',
    start: new Date(),
    end: new Date(),
    type: 'teaching',
    priority: 'medium',
    location: '',
    description: '',
    recurring: false,
    participants: [] as string[]
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    types: Object.keys(activityTypes),
    priorities: Object.keys(priorityLevels),
    showPast: false
  });
  
  // State for optimization
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationFocus, setOptimizationFocus] = useState('balance');
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<any[]>([]);
  
  // State for analytics
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  
  // Calendar view state
  const [calendarView, setCalendarView] = useState('week');
// Apply filters to activities
  const filteredActivities = activities.filter(activity => {
    // Filter by type
    if (!filters.types.includes(activity.type)) return false;
    
    // Filter by priority
    if (!filters.priorities.includes(activity.priority)) return false;
    
    // Filter past events if not showing past
    if (!filters.showPast && new Date(activity.end) < new Date()) return false;
    
    return true;
  });
  
  // Handle activity selection
  const handleSelectActivity = (event) => {
    setSelectedActivity(event);
  };
  
  // Handle adding new activity slot
  const handleSelectSlot = ({ start, end }: { start: Date, end: Date }) => {
    setActivityForm({
      id: '',
      title: '',
      start,
      end,
      type: 'teaching',
      priority: 'medium',
      location: '',
      description: '',
      recurring: false,
      participants: []
    });
    setIsAddDialogOpen(true);
  };
  
  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setActivityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setActivityForm(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setActivityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle filter changes
  const handleFilterTypeToggle = (type: string) => {
    setFilters(prev => {
      if (prev.types.includes(type)) {
        return {
          ...prev,
          types: prev.types.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          types: [...prev.types, type]
        };
      }
    });
  };
  
  const handleFilterPriorityToggle = (priority: string) => {
    setFilters(prev => {
      if (prev.priorities.includes(priority)) {
        return {
          ...prev,
          priorities: prev.priorities.filter(p => p !== priority)
        };
      } else {
        return {
          ...prev,
          priorities: [...prev.priorities, priority]
        };
      }
    });
  };
  
  const handleTogglePastEvents = () => {
    setFilters(prev => ({
      ...prev,
      showPast: !prev.showPast
    }));
  };
// Save new activity
  const handleSaveActivity = () => {
    if (!activityForm.title) {
      toast({
        title: "Title required",
        description: "Please provide a title for the activity.",
        variant: "destructive"
      });
      return;
    }
    
    const newActivity = {
      ...activityForm,
      id: activityForm.id || `activity-${Date.now()}`
    };
    
    if (activityForm.id) {
      // Update existing activity
      setActivities(prev => prev.map(activity => 
        activity.id === activityForm.id ? newActivity : activity
      ));
      
      toast({
        title: "Activity updated",
        description: `"${newActivity.title}" has been updated.`
      });
    } else {
      // Add new activity
      setActivities(prev => [...prev, newActivity]);
      
      toast({
        title: "Activity added",
        description: `"${newActivity.title}" has been added to your calendar.`
      });
    }
    
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };
  
  // Edit activity
  const handleEditActivity = () => {
    if (!selectedActivity) return;
    
    setActivityForm({
      id: selectedActivity.id,
      title: selectedActivity.title,
      start: selectedActivity.start,
      end: selectedActivity.end,
      type: selectedActivity.type,
      priority: selectedActivity.priority,
      location: selectedActivity.location || '',
      description: selectedActivity.description || '',
      recurring: selectedActivity.recurring || false,
      participants: selectedActivity.participants || []
    });
    
    setIsEditDialogOpen(true);
    setSelectedActivity(null);
  };
  
  // Delete activity
  const handleDeleteActivity = () => {
    if (!selectedActivity) return;
    
    setActivities(prev => prev.filter(activity => activity.id !== selectedActivity.id));
    
    toast({
      title: "Activity deleted",
      description: `"${selectedActivity.title}" has been removed from your calendar.`
    });
    
    setIsDeleteDialogOpen(false);
    setSelectedActivity(null);
  };
  
  // Duplicate activity
  const handleDuplicateActivity = () => {
    if (!selectedActivity) return;
    
    const duplicatedActivity = {
      ...selectedActivity,
      id: `activity-${Date.now()}`,
      title: `${selectedActivity.title} (Copy)`,
      start: new Date(selectedActivity.start.getTime() + 24 * 60 * 60 * 1000), // Next day
      end: new Date(selectedActivity.end.getTime() + 24 * 60 * 60 * 1000) // Next day
    };
    
    setActivities(prev => [...prev, duplicatedActivity]);
    
    toast({
      title: "Activity duplicated",
      description: `"${duplicatedActivity.title}" has been added to your calendar.`
    });
    
    setSelectedActivity(null);
  };
// Optimize calendar
  const handleOptimizeCalendar = async () => {
    setIsOptimizing(true);
    
    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate the optimization process
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate optimization suggestions based on focus
      const suggestions = generateOptimizationSuggestions(optimizationFocus);
      setOptimizationSuggestions(suggestions);
      
      toast({
        title: "Calendar optimized",
        description: `${suggestions.length} suggestions generated based on your preferences.`
      });
    } catch (error) {
      console.error('Error optimizing calendar:', error);
      toast({
        title: "Optimization failed",
        description: "There was a problem optimizing your calendar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // Generate mock optimization suggestions
  const generateOptimizationSuggestions = (focus: string) => {
    const suggestions = [];
    
    if (focus === 'balance' || focus === 'efficiency') {
      suggestions.push({
        id: 'sug-1',
        type: 'reschedule',
        title: 'Reschedule administrative tasks',
        description: 'Group administrative tasks together on Thursday afternoon to reduce context switching.',
        impact: 'Could save approximately 45 minutes per week',
        activities: ['4']
      });
    }
    
    if (focus === 'balance' || focus === 'well-being') {
      suggestions.push({
        id: 'sug-2',
        type: 'break',
        title: 'Add recovery breaks',
        description: 'Schedule 15-minute breaks after intensive teaching sessions to maintain energy levels.',
        impact: 'May improve teaching quality and reduce end-of-day fatigue',
        activities: ['1']
      });
    }
    
    if (focus === 'efficiency' || focus === 'teaching') {
      suggestions.push({
        id: 'sug-3',
        type: 'batch',
        title: 'Batch lesson planning',
        description: 'Consolidate lesson planning into a single 2-hour block rather than multiple shorter sessions.',
        impact: 'Could increase planning efficiency by approximately 20%',
        activities: ['2']
      });
    }
    
    return suggestions;
  };
  
  // Apply optimization suggestion
  const handleApplySuggestion = (suggestion) => {
    // In a real implementation, this would update the activities based on the suggestion
    // For now, we'll just show a toast
    
    toast({
      title: "Suggestion applied",
      description: `"${suggestion.title}" has been applied to your calendar.`
    });
    
    // Remove the suggestion from the list
    setOptimizationSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };
  
  // Load analytics data
  const handleLoadAnalytics = async () => {
    setIsLoadingAnalytics(true);
    
    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate the analytics data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock analytics data
      const data = {
        timeDistribution: {
          teaching: 40,
          preparation: 20,
          administrative: 15,
          meeting: 15,
          professional: 10
        },
        weeklyTrends: {
          monday: { teaching: 8, preparation: 2, administrative: 1, meeting: 1, professional: 0 },
          tuesday: { teaching: 7, preparation: 3, administrative: 2, meeting: 0, professional: 0 },
          wednesday: { teaching: 6, preparation: 2, administrative: 1, meeting: 2, professional: 1 },
          thursday: { teaching: 8, preparation: 1, administrative: 2, meeting: 1, professional: 0 },
          friday: { teaching: 6, preparation: 2, administrative: 1, meeting: 1, professional: 2 }
        },
        insights: [
          'You spend 15% more time on administrative tasks than the average educator',
          'Your teaching time is well-distributed throughout the week',
          'Consider allocating more time for preparation on Thursdays',
          'Your professional development activities are concentrated on Fridays'
        ]
      };
      
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Analytics failed",
        description: "There was a problem loading your calendar analytics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Event style getter for calendar
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: activityTypes[event.type as keyof typeof activityTypes]?.color || '#4f46e5',
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: '0',
      display: 'block'
    };
    return { style };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calendar Optimization</h2>
          <p className="text-muted-foreground">
            Manage your schedule efficiently with AI-powered optimization.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsOptimizeDialogOpen(true)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Optimize Schedule
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAnalyticsDialogOpen(true)}
          >
            <BarChart4 className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
          
          <Button 
            size="sm"
            onClick={() => {
              setActivityForm({
                id: '',
                title: '',
                start: new Date(),
                end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
                type: 'teaching',
                priority: 'medium',
                location: '',
                description: '',
                recurring: false,
                participants: []
              });
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Activity
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Activity Type Filters */}
            <div>
              <h3 className="text-sm font-medium mb-2">Activity Types</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(activityTypes).map(([key, { label, color }]) => (
                  <Badge 
                    key={key}
                    variant={filters.types.includes(key) ? "default" : "outline"}
                    style={{ 
                      backgroundColor: filters.types.includes(key) ? color : 'transparent',
                      color: filters.types.includes(key) ? 'white' : 'inherit',
                      borderColor: color,
                      opacity: filters.types.includes(key) ? 1 : 0.7
                    }}
                    className="cursor-pointer"
                    onClick={() => handleFilterTypeToggle(key)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Priority Filters */}
            <div>
              <h3 className="text-sm font-medium mb-2">Priority Levels</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(priorityLevels).map(([key, { label, color }]) => (
                  <Badge 
                    key={key}
                    variant={filters.priorities.includes(key) ? "default" : "outline"}
                    style={{ 
                      backgroundColor: filters.priorities.includes(key) ? color : 'transparent',
                      color: filters.priorities.includes(key) ? 'white' : 'inherit',
                      borderColor: color,
                      opacity: filters.priorities.includes(key) ? 1 : 0.7
                    }}
                    className="cursor-pointer"
                    onClick={() => handleFilterPriorityToggle(key)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Other Filters */}
            <div>
              <h3 className="text-sm font-medium mb-2">Other Filters</h3>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="showPast" 
                  checked={filters.showPast} 
                  onChange={handleTogglePastEvents}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="showPast" className="text-sm">Show past events</label>
              </div>
            </div>
            
            {/* Calendar View */}
            <div>
              <h3 className="text-sm font-medium mb-2">Calendar View</h3>
              <Select value={calendarView} onValueChange={setCalendarView}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="agenda">Agenda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Calendar */}
        <Card className="lg:col-span-3">
          <CardContent className="pt-6">
            <Calendar
              localizer={localizer}
              events={filteredActivities}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              eventPropGetter={eventStyleGetter}
              view={calendarView as any}
              onView={(view) => setCalendarView(view)}
              onSelectEvent={handleSelectActivity}
              onSelectSlot={handleSelectSlot}
              selectable
              popup
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Details Dialog */}
      {selectedActivity && (
        <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedActivity.title}</DialogTitle>
              <DialogDescription>
                <div className="flex items-center mt-2">
                  <Badge 
                    style={{ 
                      backgroundColor: activityTypes[selectedActivity.type as keyof typeof activityTypes]?.color 
                    }}
                  >
                    {activityTypes[selectedActivity.type as keyof typeof activityTypes]?.label}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="ml-2"
                    style={{ 
                      borderColor: priorityLevels[selectedActivity.priority as keyof typeof priorityLevels]?.color,
                      color: priorityLevels[selectedActivity.priority as keyof typeof priorityLevels]?.color
                    }}
                  >
                    {priorityLevels[selectedActivity.priority as keyof typeof priorityLevels]?.label} Priority
                  </Badge>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {moment(selectedActivity.start).format('ddd, MMM D, YYYY')}
                </span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {moment(selectedActivity.start).format('h:mm A')} - {moment(selectedActivity.end).format('h:mm A')}
                </span>
              </div>
              
              {selectedActivity.location && (
                <div className="flex items-start">
                  <div className="h-4 w-4 mr-2 text-muted-foreground">📍</div>
                  <span>{selectedActivity.location}</span>
                </div>
              )}
              
              {selectedActivity.description && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedActivity.description}</p>
                </div>
              )}
              
              {selectedActivity.participants && selectedActivity.participants.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-1">Participants</h4>
                  <ul className="text-sm text-muted-foreground">
                    {selectedActivity.participants.map((participant: string, index: number) => (
                      <li key={index}>{participant}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedActivity.recurring && (
                <div className="flex items-center pt-2">
                  <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Recurring event</span>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsDeleteDialogOpen(true);
                    setSelectedActivity(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDuplicateActivity}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </Button>
              </div>
              <Button 
                size="sm"
                onClick={handleEditActivity}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add/Edit Activity Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activityForm.id ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
            <DialogDescription>
              {activityForm.id 
                ? 'Update the details of this activity in your calendar.' 
                : 'Add a new activity to your calendar.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title"
                value={activityForm.title} 
                onChange={handleFormChange}
                placeholder="Activity title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select 
                  value={activityForm.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityTypes).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select 
                  value={activityForm.priority} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityLevels).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location"
                value={activityForm.location} 
                onChange={handleFormChange}
                placeholder="Activity location"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                value={activityForm.description} 
                onChange={handleFormChange}
                placeholder="Activity description"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="recurring" 
                name="recurring"
                checked={activityForm.recurring} 
                onChange={handleCheckboxChange}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="recurring" className="text-sm">Recurring event</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveActivity}>
              {activityForm.id ? 'Update' : 'Add'} Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteActivity}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Optimize Dialog */}
      <Dialog open={isOptimizeDialogOpen} onOpenChange={setIsOptimizeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Optimize Your Calendar</DialogTitle>
            <DialogDescription>
              Let AI help you optimize your schedule based on your preferences.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Optimization Focus</Label>
              <Select 
                value={optimizationFocus} 
                onValueChange={setOptimizationFocus}
                disabled={isOptimizing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select focus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balance">Work-Life Balance</SelectItem>
                  <SelectItem value="efficiency">Maximum Efficiency</SelectItem>
                  <SelectItem value="teaching">Teaching Quality</SelectItem>
                  <SelectItem value="well-being">Well-being</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {optimizationSuggestions.length > 0 ? (
              <div className="space-y-3 mt-4">
                <h3 className="text-sm font-medium">Optimization Suggestions</h3>
                {optimizationSuggestions.map(suggestion => (
                  <Card key={suggestion.id}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">{suggestion.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                      <p className="text-sm font-medium mt-2">{suggestion.impact}</p>
                    </CardContent>
                    <CardFooter className="py-2">
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleApplySuggestion(suggestion)}
                      >
                        Apply Suggestion
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                {isOptimizing ? (
                  <>
                    <Spinner className="h-8 w-8 mb-4" />
                    <p className="text-center text-muted-foreground">
                      Analyzing your calendar and generating optimization suggestions...
                    </p>
                  </>
                ) : (
                  <>
                    <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      Select your optimization focus and click the button below to get AI-powered suggestions.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOptimizeDialogOpen(false)}
              disabled={isOptimizing}
            >
              Close
            </Button>
            {optimizationSuggestions.length === 0 && (
              <Button 
                onClick={handleOptimizeCalendar}
                disabled={isOptimizing}
              >
                {isOptimizing && <Spinner className="mr-2 h-4 w-4" />}
                {isOptimizing ? 'Optimizing...' : 'Optimize Calendar'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Calendar Analytics</DialogTitle>
            <DialogDescription>
              Insights and statistics about your calendar activities.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {analyticsData ? (
              <Tabs defaultValue="distribution">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="distribution">Time Distribution</TabsTrigger>
                  <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>
                
                <TabsContent value="distribution" className="space-y-4">
                  <h3 className="text-sm font-medium">How You Spend Your Time</h3>
                  <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                    {/* In a real implementation, this would be a chart */}
                    <div className="text-center">
                      <p className="text-muted-foreground">Time Distribution Chart</p>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {Object.entries(analyticsData.timeDistribution).map(([key, value]) => (
                          <Badge 
                            key={key}
                            style={{ 
                              backgroundColor: activityTypes[key as keyof typeof activityTypes]?.color 
                            }}
                          >
                            {activityTypes[key as keyof typeof activityTypes]?.label}: {value}%
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="trends" className="space-y-4">
                  <h3 className="text-sm font-medium">Weekly Activity Patterns</h3>
                  <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                    {/* In a real implementation, this would be a chart */}
                    <div className="text-center">
                      <p className="text-muted-foreground">Weekly Trends Chart</p>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {Object.keys(analyticsData.weeklyTrends).map((day) => (
                          <Badge key={day} variant="outline">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="insights" className="space-y-4">
                  <h3 className="text-sm font-medium">AI-Generated Insights</h3>
                  <div className="space-y-3">
                    {analyticsData.insights.map((insight: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <div className="mr-2 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                {isLoadingAnalytics ? (
                  <>
                    <Spinner className="h-8 w-8 mb-4" />
                    <p className="text-center text-muted-foreground">
                      Analyzing your calendar data...
                    </p>
                  </>
                ) : (
                  <>
                    <BarChart4 className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      Click the button below to generate analytics based on your calendar data.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAnalyticsDialogOpen(false)}
              disabled={isLoadingAnalytics}
            >
              Close
            </Button>
            {!analyticsData && !isLoadingAnalytics && (
              <Button 
                onClick={handleLoadAnalytics}
                disabled={isLoadingAnalytics}
              >
                Generate Analytics
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
