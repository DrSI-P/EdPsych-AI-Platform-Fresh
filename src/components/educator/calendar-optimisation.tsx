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
import { useAIService } from '@/lib/ai/ai-service';

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
          'Your meeting schedule appears to be efficiently managed'
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
  
  // Custom event styling
  const eventStyleGetter = (event) => {
    const type = event.type;
    const backgroundColor = activityTypes[type as keyof typeof activityTypes]?.color || '#3174ad';
    
    const style = {
      backgroundColor,
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: 'none',
      display: 'block'
    };
    
    return {
      style
    };
  };
  
  // Custom toolbar component
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };
    
    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };
    
    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };
    
    const label = () => {
      const date = toolbar.date;
      return (
        <span className="text-lg font-semibold">
          {moment(date).format('MMMM YYYY')}
        </span>
      );
    };
    
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToBack}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNext}>
            Next
          </Button>
        </div>
        
        <div className="text-center">
          {label()}
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={calendarView} onValueChange={setCalendarView}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={() => setIsOptimizeDialogOpen(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Optimize
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setIsAnalyticsDialogOpen(true)}>
            <BarChart4 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`calendar-optimization ${className}`}>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Calendar Optimization</CardTitle>
              <CardDescription>
                Efficiently manage and optimize your educational activities
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setFilters({
                  types: Object.keys(activityTypes),
                  priorities: Object.keys(priorityLevels),
                  showPast: false
                })}
              >
                Reset
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Activity Type Filters */}
              <div>
                <h4 className="text-xs font-medium mb-2">Activity Types</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activityTypes).map(([key, { label, color, icon }]) => (
                    <Badge
                      key={key}
                      variant={filters.types.includes(key) ? "default" : "outline"}
                      className="cursor-pointer"
                      style={{
                        backgroundColor: filters.types.includes(key) ? color : 'transparent',
                        borderColor: color,
                        color: filters.types.includes(key) ? 'white' : undefined
                      }}
                      onClick={() => handleFilterTypeToggle(key)}
                    >
                      <span className="mr-1">{icon}</span>
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Priority Filters */}
              <div>
                <h4 className="text-xs font-medium mb-2">Priority Levels</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(priorityLevels).map(([key, { label, color }]) => (
                    <Badge
                      key={key}
                      variant={filters.priorities.includes(key) ? "default" : "outline"}
                      className="cursor-pointer"
                      style={{
                        backgroundColor: filters.priorities.includes(key) ? color : 'transparent',
                        borderColor: color,
                        color: filters.priorities.includes(key) ? 'white' : undefined
                      }}
                      onClick={() => handleFilterPriorityToggle(key)}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Other Filters */}
              <div>
                <h4 className="text-xs font-medium mb-2">Other Filters</h4>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="showPast" 
                    checked={filters.showPast} 
                    onChange={handleTogglePastEvents}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="showPast" className="ml-2 text-sm font-normal">
                    Show past events
                  </Label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Calendar */}
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={filteredActivities}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={['day', 'week', 'month', 'agenda']}
              view={calendarView as any}
              onView={(view) => setCalendarView(view)}
              selectable
              onSelectEvent={handleSelectActivity}
              onSelectSlot={handleSelectSlot}
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: CustomToolbar
              }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Activity Details Card (when activity is selected) */}
      {selectedActivity && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: activityTypes[selectedActivity.type as keyof typeof activityTypes]?.color }}
                />
                <CardTitle>{selectedActivity.title}</CardTitle>
              </div>
              <Badge 
                style={{
                  backgroundColor: priorityLevels[selectedActivity.priority as keyof typeof priorityLevels]?.color
                }}
              >
                {priorityLevels[selectedActivity.priority as keyof typeof priorityLevels]?.label} Priority
              </Badge>
            </div>
            <CardDescription>
              {activityTypes[selectedActivity.type as keyof typeof activityTypes]?.label}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {moment(selectedActivity.start).format('dddd, MMMM D, YYYY')}
                  </span>
                </div>
                
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {moment(selectedActivity.start).format('h:mm A')} - {moment(selectedActivity.end).format('h:mm A')}
                  </span>
                </div>
                
                {selectedActivity.location && (
                  <div className="flex items-start mb-2">
                    <span className="h-4 w-4 mr-2 text-muted-foreground">📍</span>
                    <span>{selectedActivity.location}</span>
                  </div>
                )}
                
                {selectedActivity.recurring && (
                  <div className="flex items-center mb-2">
                    <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Recurring activity</span>
                  </div>
                )}
              </div>
              
              <div>
                {selectedActivity.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedActivity.description}</p>
                  </div>
                )}
                
                {selectedActivity.participants && selectedActivity.participants.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Participants</h4>
                    <ul className="text-sm text-muted-foreground">
                      {selectedActivity.participants.map((participant: string, index: number) => (
                        <li key={index}>{participant}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedActivity(null)}>
              Close
            </Button>
            <Button variant="outline" size="sm" onClick={handleDuplicateActivity}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm" onClick={handleEditActivity}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Add Activity Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogDescription>
              Create a new activity in your calendar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={activityForm.title}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={activityForm.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(activityTypes).map(([key, { label, icon }]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center">
                        <span className="mr-2">{icon}</span>
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={activityForm.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLevels).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start" className="text-right">
                Start
              </Label>
              <Input
                id="start"
                name="start"
                type="datetime-local"
                value={moment(activityForm.start).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => setActivityForm(prev => ({
                  ...prev,
                  start: new Date(e.target.value)
                }))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end" className="text-right">
                End
              </Label>
              <Input
                id="end"
                name="end"
                type="datetime-local"
                value={moment(activityForm.end).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => setActivityForm(prev => ({
                  ...prev,
                  end: new Date(e.target.value)
                }))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={activityForm.location}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={activityForm.description}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Label htmlFor="recurring">Recurring</Label>
              </div>
              <div className="col-span-3 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  name="recurring"
                  checked={activityForm.recurring}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="recurring" className="font-normal">
                  This is a recurring activity
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveActivity}>Save Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Activity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>
              Make changes to your activity.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                name="title"
                value={activityForm.title}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select
                value={activityForm.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(activityTypes).map(([key, { label, icon }]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center">
                        <span className="mr-2">{icon}</span>
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-priority" className="text-right">
                Priority
              </Label>
              <Select
                value={activityForm.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLevels).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-start" className="text-right">
                Start
              </Label>
              <Input
                id="edit-start"
                name="start"
                type="datetime-local"
                value={moment(activityForm.start).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => setActivityForm(prev => ({
                  ...prev,
                  start: new Date(e.target.value)
                }))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-end" className="text-right">
                End
              </Label>
              <Input
                id="edit-end"
                name="end"
                type="datetime-local"
                value={moment(activityForm.end).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => setActivityForm(prev => ({
                  ...prev,
                  end: new Date(e.target.value)
                }))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right">
                Location
              </Label>
              <Input
                id="edit-location"
                name="location"
                value={activityForm.location}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={activityForm.description}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Label htmlFor="edit-recurring">Recurring</Label>
              </div>
              <div className="col-span-3 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-recurring"
                  name="recurring"
                  checked={activityForm.recurring}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-recurring" className="font-normal">
                  This is a recurring activity
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveActivity}>Update Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="py-4">
              <p className="font-medium">{selectedActivity.title}</p>
              <p className="text-sm text-muted-foreground">
                {moment(selectedActivity.start).format('dddd, MMMM D, YYYY')} at {moment(selectedActivity.start).format('h:mm A')}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteActivity}>
              Delete Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Optimize Calendar Dialog */}
      <Dialog open={isOptimizeDialogOpen} onOpenChange={setIsOptimizeDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Optimize Your Calendar</DialogTitle>
            <DialogDescription>
              Let AI help you optimize your schedule for better productivity and well-being.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <Label htmlFor="optimization-focus" className="mb-2 block">
                Optimization Focus
              </Label>
              <Select
                value={optimizationFocus}
                onValueChange={setOptimizationFocus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select optimization focus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balance">Balanced Schedule</SelectItem>
                  <SelectItem value="efficiency">Maximum Efficiency</SelectItem>
                  <SelectItem value="teaching">Teaching Quality</SelectItem>
                  <SelectItem value="well-being">Educator Well-being</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                {optimizationFocus === 'balance' && 'Create a well-balanced schedule with appropriate time for all activity types.'}
                {optimizationFocus === 'efficiency' && 'Optimize for maximum productivity and efficient use of time.'}
                {optimizationFocus === 'teaching' && 'Prioritize teaching quality by optimizing preparation and delivery time.'}
                {optimizationFocus === 'well-being' && 'Focus on sustainable workload and preventing burnout.'}
              </p>
            </div>
            
            {optimizationSuggestions.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Optimization Suggestions</h3>
                
                {optimizationSuggestions.map(suggestion => (
                  <Card key={suggestion.id}>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{suggestion.title}</CardTitle>
                        <Badge variant="outline">
                          {suggestion.type === 'reschedule' && 'Reschedule'}
                          {suggestion.type === 'break' && 'Add Break'}
                          {suggestion.type === 'batch' && 'Batch Activities'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm">{suggestion.description}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Impact:</strong> {suggestion.impact}
                      </p>
                    </CardContent>
                    <CardFooter className="py-3 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => handleApplySuggestion(suggestion)}
                      >
                        Apply
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setOptimizationSuggestions(prev =>
                          prev.filter(s => s.id !== suggestion.id)
                        )}
                      >
                        Dismiss
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                {isOptimizing ? (
                  <div className="flex flex-col items-center">
                    <Spinner size="lg" className="mb-4" />
                    <p>Analyzing your calendar and generating optimization suggestions...</p>
                  </div>
                ) : (
                  <div>
                    <p className="mb-4">Click the button below to generate optimization suggestions.</p>
                    <Button onClick={handleOptimizeCalendar}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Suggestions
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOptimizeDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Calendar Analytics</DialogTitle>
            <DialogDescription>
              Insights and analysis of your calendar activities.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {analyticsData ? (
              <Tabs defaultValue="distribution">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="distribution">Time Distribution</TabsTrigger>
                  <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>
                
                <TabsContent value="distribution" className="py-4">
                  <h3 className="text-sm font-medium mb-4">Activity Time Distribution</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(analyticsData.timeDistribution).map(([type, percentage]) => (
                      <div key={type}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: activityTypes[type as keyof typeof activityTypes]?.color }}
                            />
                            <span className="text-sm">
                              {activityTypes[type as keyof typeof activityTypes]?.label}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: activityTypes[type as keyof typeof activityTypes]?.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="trends" className="py-4">
                  <h3 className="text-sm font-medium mb-4">Weekly Activity Trends</h3>
                  
                  <div className="space-y-6">
                    {Object.entries(analyticsData.weeklyTrends).map(([day, activities]) => (
                      <div key={day}>
                        <h4 className="text-sm font-medium mb-2 capitalize">{day}</h4>
                        <div className="flex items-center h-8">
                          {Object.entries(activities).map(([type, hours]) => (
                            hours > 0 && (
                              <div 
                                key={type}
                                style={{
                                  width: `${(hours / 12) * 100}%`,
                                  backgroundColor: activityTypes[type as keyof typeof activityTypes]?.color
                                }}
                                className="h-full first:rounded-l-md last:rounded-r-md flex items-center justify-center text-white text-xs"
                                title={`${activityTypes[type as keyof typeof activityTypes]?.label}: ${hours} hours`}
                              >
                                {hours > 1 && activityTypes[type as keyof typeof activityTypes]?.icon}
                              </div>
                            )
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">8:00</span>
                          <span className="text-xs text-muted-foreground">12:00</span>
                          <span className="text-xs text-muted-foreground">16:00</span>
                          <span className="text-xs text-muted-foreground">20:00</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="insights" className="py-4">
                  <h3 className="text-sm font-medium mb-4">Calendar Insights</h3>
                  
                  <div className="space-y-3">
                    {analyticsData.insights.map((insight, index) => (
                      <div key={index} className="flex items-start">
                        <div className="mt-0.5 mr-2 text-primary">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <p className="text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                {isLoadingAnalytics ? (
                  <div className="flex flex-col items-center">
                    <Spinner size="lg" className="mb-4" />
                    <p>Analyzing your calendar data...</p>
                  </div>
                ) : (
                  <div>
                    <p className="mb-4">Click the button below to generate calendar analytics.</p>
                    <Button onClick={handleLoadAnalytics}>
                      <BarChart4 className="h-4 w-4 mr-2" />
                      Generate Analytics
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAnalyticsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
