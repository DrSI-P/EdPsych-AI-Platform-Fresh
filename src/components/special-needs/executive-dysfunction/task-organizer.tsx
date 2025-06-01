'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Star, 
  GripVertical, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Brain,
  ListChecks,
  Timer,
  Layers
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  steps: any[];
  timeEstimate: number; // in minutes
  visualReminder?: string;
  tags: any[];
  isExpanded: boolean;
}

interface TaskStep {
  id: string;
  description: string;
  completed: boolean;
}

interface TaskOrganizerProps {
  userId?: string;
  initialTasks?: Task[];
  onTasksChange?: (tasks: any[]) => void;
  className?: string;
}

export default function TaskOrganizer({
  userId,
  initialTasks,
  onTasksChange,
  className
}: TaskOrganizerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    steps: [],
    timeEstimate: 30,
    tags: [],
    isExpanded: false
  });
  const [newStep, setNewStep] = useState('');
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [sortBy, setSortBy] = useState('dueDate');
  const [useVisualCues, setUseVisualCues] = useState(true);
  
  // Load tasks from API if userId is provided
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);
  
  // Notify parent component when tasks change
  useEffect(() => {
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);
  
  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/special-needs/executive-dysfunction/tasks?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load your tasks. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const saveTasks = async (updatedTasks: any[]) => {
    if (!userId) return;
    
    try {
      await fetch('/api/special-needs/executive-dysfunction/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          tasks: updatedTasks
        }),
      });
    } catch (error) {
      console.error('Error saving tasks:', error);
      toast({
        title: "Error",
        description: "Failed to save your tasks. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddTask = () => {
    if (!newTask.title) {
      toast({
        title: "Task title required",
        description: "Please enter a title for your task.",
        variant: "destructive"
      });
      return;
    }
    
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title || '',
      description: newTask.description || '',
      dueDate: newTask.dueDate || '',
      priority: newTask.priority as 'low' | 'medium' | 'high' || 'medium',
      status: newTask.status as 'todo' | 'in-progress' | 'done' || 'todo',
      steps: newTask.steps || [],
      timeEstimate: newTask.timeEstimate || 30,
      visualReminder: newTask.visualReminder,
      tags: newTask.tags || [],
      isExpanded: false
    };
    
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'todo',
      steps: [],
      timeEstimate: 30,
      tags: [],
      isExpanded: false
    });
    setIsCreatingTask(false);
    
    toast({
      title: "Task added",
      description: "Your new task has been added successfully.",
    });
  };
  
  const handleAddStep = () => {
    if (!newStep) return;
    
    const step: TaskStep = {
      id: `step-${Date.now()}`,
      description: newStep,
      completed: false
    };
    
    setNewTask({
      ...newTask,
      steps: [...(newTask.steps || []), step]
    });
    
    setNewStep('');
  };
  
  const handleRemoveStep = (stepId: string) => {
    setNewTask({
      ...newTask,
      steps: (newTask.steps || []).filter(step => step.id !== stepId)
    });
  };
  
  const handleAddTag = () => {
    if (!newTag || (newTask.tags || []).includes(newTag)) return;
    
    setNewTask({
      ...newTask,
      tags: [...(newTask.tags || []), newTag]
    });
    
    setNewTag('');
  };
  
  const handleRemoveTag = (tag: string) => {
    setNewTask({
      ...newTask,
      tags: (newTask.tags || []).filter(t => t !== tag)
    });
  };
  
  const handleUpdateTask = (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    setNewTask(taskToUpdate);
    setEditingTaskId(taskId);
    setIsCreatingTask(true);
  };
  
  const handleSaveUpdatedTask = () => {
    if (!editingTaskId) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === editingTaskId 
        ? { ...newTask, id: editingTaskId } as Task
        : task
    );
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    setEditingTaskId(null);
    setIsCreatingTask(false);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'todo',
      steps: [],
      timeEstimate: 30,
      tags: [],
      isExpanded: false
    });
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };
  
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully.",
    });
  };
  
  const handleToggleTaskExpansion = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, isExpanded: !task.isExpanded }
        : task
    );
    
    setTasks(updatedTasks);
  };
  
  const handleToggleStepCompletion = (taskId: string, stepId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSteps = task.steps.map(step => 
          step.id === stepId 
            ? { ...step, completed: !step.completed }
            : step
        );
        
        return { ...task, steps: updatedSteps };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };
  
  const handleUpdateTaskStatus = (taskId: string, status: 'todo' | 'in-progress' | 'done') => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, status }
        : task
    );
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    if (status === 'done') {
      toast({
        title: "Task completed",
        description: "Well done! You've completed this task.",
      });
    }
  };
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTasks(items);
    saveTasks(items);
  };
  
  const filteredTasks = tasks.filter(task => {
    if (!showCompletedTasks && task.status === 'done') return false;
    
    if (activeTab === 'all') return true;
    if (activeTab === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return task.dueDate === today;
    }
    if (activeTab === 'upcoming') {
      const today = new Date().toISOString().split('T')[0];
      return task.dueDate > today;
    }
    if (activeTab === 'overdue') {
      const today = new Date().toISOString().split('T')[0];
      return task.dueDate < today && task.status !== 'done';
    }
    if (activeTab === 'high-priority') {
      return task.priority === 'high';
    }
    
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === 'status') {
      const statusOrder = { todo: 0, 'in-progress': 1, done: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return 0;
  });
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-50 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'todo': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'todo': return <ListChecks className="h-4 w-4" />;
      default: return <ListChecks className="h-4 w-4" />;
    }
  };
  
  const calculateTaskProgress = (task: Task) => {
    if (task.steps.length === 0) return 0;
    const completedSteps = task.steps.filter(step => step.completed).length;
    return Math.round((completedSteps / task.steps.length) * 100);
  };
  
  const formatTimeEstimate = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };
  
  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };
  
  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-centre justify-between">
            <div className="flex items-centre gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Executive Function Task Organizer
            </div>
            <Button 
              size="sm" 
              onClick={() => setIsCreatingTask(!isCreatingTask)}
              className="flex items-centre gap-1"
            >
              {isCreatingTask ? (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Task
                </>
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Organise tasks with visual cues and step-by-step breakdowns
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isCreatingTask && (
            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {editingTaskId ? 'Edit Task' : 'Create New Task'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input 
                    id="task-title"
                    placeholder="Enter task title"
                    value={newTask.title || ''}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea 
                    id="task-description"
                    placeholder="Enter task description"
                    value={newTask.description || ''}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-due-date">Due Date</Label>
                    <Input 
                      id="task-due-date"
                      type="date"
                      value={newTask.dueDate || ''}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select 
                      value={newTask.priority || 'medium'}
                      onValueChange={(value) => setNewTask({...newTask, priority: value as 'low' | 'medium' | 'high'})}
                    >
                      <SelectTrigger id="task-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="task-status">Status</Label>
                    <Select 
                      value={newTask.status || 'todo'}
                      onValueChange={(value) => setNewTask({...newTask, status: value as 'todo' | 'in-progress' | 'done'})}
                    >
                      <SelectTrigger id="task-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="task-time-estimate">Time Estimate (minutes)</Label>
                  <Input 
                    id="task-time-estimate"
                    type="number"
                    min="5"
                    step="5"
                    value={newTask.timeEstimate || 30}
                    onChange={(e) => setNewTask({...newTask, timeEstimate: parseInt(e.target.value)})}
                  />
                </div>
                
                {useVisualCues && (
                  <div className="space-y-2">
                    <Label htmlFor="task-visual-reminder">Visual Reminder (image URL)</Label>
                    <Input 
                      id="task-visual-reminder"
                      placeholder="Enter image URL for visual reminder"
                      value={newTask.visualReminder || ''}
                      onChange={(e) => setNewTask({...newTask, visualReminder: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Task Steps</Label>
                  <div className="flex items-centre gap-2">
                    <Input 
                      placeholder="Add a step"
                      value={newStep}
                      onChange={(e) => setNewStep(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddStep();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddStep}
                      className="shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {(newTask.steps || []).length > 0 && (
                    <div className="mt-2 space-y-2">
                      {(newTask.steps || []).map((step, index) => (
                        <div key={step.id} className="flex items-centre justify-between bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                          <div className="flex items-centre gap-2">
                            <span className="text-sm font-medium text-slate-500">{index + 1}.</span>
                            <span>{step.description}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveStep(step.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex items-centre gap-2">
                    <Input 
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddTag}
                      className="shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {(newTask.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(newTask.tags || []).map((tag) => (
                        <Badge key={tag} variant="outline" className="flex items-centre gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreatingTask(false);
                    setEditingTaskId(null);
                    setNewTask({
                      title: '',
                      description: '',
                      dueDate: '',
                      priority: 'medium',
                      status: 'todo',
                      steps: [],
                      timeEstimate: 30,
                      tags: [],
                      isExpanded: false
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={editingTaskId ? handleSaveUpdatedTask : handleAddTask}
                >
                  {editingTaskId ? 'Update Task' : 'Add Task'}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="flex flex-col md:flex-row md:items-centre justify-between gap-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
                <TabsTrigger value="high-priority">High Priority</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex flex-col md:flex-row gap-4 md:items-centre">
              <div className="flex items-centre space-x-2">
                <Checkbox 
                  id="show-completed" 
                  checked={showCompletedTasks}
                  onCheckedChange={(checked) => setShowCompletedTasks(checked as boolean)}
                />
                <Label htmlFor="show-completed">Show completed tasks</Label>
              </div>
              
              <div className="flex items-centre space-x-2">
                <Label htmlFor="sort-by">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-by" className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-centre space-x-2">
                <Switch 
                  id="visual-cues" 
                  checked={useVisualCues}
                  onCheckedChange={setUseVisualCues}
                />
                <Label htmlFor="visual-cues">Visual cues</Label>
              </div>
            </div>
          </div>
          
          {sortedTasks.length === 0 ? (
            <div className="text-centre py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-centre justify-centre mb-3">
                <ListChecks className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium">No tasks found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab !== 'all' 
                  ? `No tasks match the "${activeTab}" filter.` 
                  : "You don't have any tasks yet. Click 'Add Task' to create one."}
              </p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {sortedTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border rounded-lg overflow-hidden ${
                              task.status === 'done' ? 'bg-slate-50 dark:bg-slate-900/50 opacity-70' : ''
                            }`}
                          >
                            <div className="flex items-centre p-3">
                              <div 
                                {...provided.dragHandleProps}
                                className="mr-3 cursor-grab"
                              >
                                <GripVertical className="h-5 w-5 text-slate-400" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-centre justify-between">
                                  <div className="flex items-centre gap-2">
                                    <Checkbox 
                                      checked={task.status === 'done'}
                                      onCheckedChange={(checked) => {
                                        handleUpdateTaskStatus(
                                          task.id, 
                                          checked ? 'done' : 'todo'
                                        );
                                      }}
                                    />
                                    <span className={`font-medium ${task.status === 'done' ? 'line-through text-slate-500' : ''}`}>
                                      {task.title}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-centre gap-2">
                                    {task.dueDate && (
                                      <Badge 
                                        variant="outline" 
                                        className={`flex items-centre gap-1 ${
                                          isOverdue(task.dueDate) && task.status !== 'done' 
                                            ? 'bg-red-50 text-red-700 border-red-200' 
                                            : 'bg-slate-50 text-slate-700 border-slate-200'
                                        }`}
                                      >
                                        <Calendar className="h-3 w-3" />
                                        {new Date(task.dueDate).toLocaleDateString()}
                                      </Badge>
                                    )}
                                    
                                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                      {task.priority}
                                    </Badge>
                                    
                                    <Badge variant="outline" className={getStatusColor(task.status)}>
                                      <div className="flex items-centre gap-1">
                                        {getStatusIcon(task.status)}
                                        <span className="capitalize">{task.status.replace('-', ' ')}</span>
                                      </div>
                                    </Badge>
                                    
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleToggleTaskExpansion(task.id)}
                                    >
                                      {task.isExpanded ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {task.isExpanded && (
                              <div className="px-3 pb-3 pt-0 border-t">
                                <div className="mt-3 space-y-4">
                                  {task.description && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Description</h4>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {task.description}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {task.steps.length > 0 && (
                                    <div>
                                      <div className="flex items-centre justify-between mb-2">
                                        <h4 className="text-sm font-medium">Steps</h4>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                          {calculateTaskProgress(task)}% complete
                                        </Badge>
                                      </div>
                                      
                                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-3">
                                        <div 
                                          className="bg-blue-600 h-1.5 rounded-full" 
                                          style={{ width: `${calculateTaskProgress(task)}%` }}
                                        ></div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        {task.steps.map((step) => (
                                          <div key={step.id} className="flex items-centre gap-2">
                                            <Checkbox 
                                              checked={step.completed}
                                              onCheckedChange={() => handleToggleStepCompletion(task.id, step.id)}
                                            />
                                            <span className={step.completed ? 'line-through text-slate-500' : ''}>
                                              {step.description}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="flex flex-wrap gap-2">
                                    {task.timeEstimate && (
                                      <Badge variant="outline" className="flex items-centre gap-1 bg-purple-50 text-purple-700 border-purple-200">
                                        <Timer className="h-3 w-3" />
                                        {formatTimeEstimate(task.timeEstimate)}
                                      </Badge>
                                    )}
                                    
                                    {task.tags.map((tag) => (
                                      <Badge key={tag} variant="outline">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  
                                  {useVisualCues && task.visualReminder && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Visual Reminder</h4>
                                      <div className="rounded-md overflow-hidden border">
                                        <img 
                                          src={task.visualReminder} 
                                          alt="Visual reminder" 
                                          className="w-full h-auto max-h-40 object-cover"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="flex justify-end gap-2 pt-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => handleUpdateTask(task.id)}
                                      className="flex items-centre gap-1"
                                    >
                                      <Edit className="h-3 w-3" />
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm" 
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="flex items-centre gap-1"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-centre text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 mr-1" /> 
            Drag and drop to reorder tasks
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsCreatingTask(true)}
            className="flex items-centre gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
