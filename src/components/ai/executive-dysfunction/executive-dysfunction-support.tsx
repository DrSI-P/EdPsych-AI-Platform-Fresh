'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  Calendar, 
  BrainCircuit, 
  AlertCircle, 
  Bell, 
  Layers, 
  Sparkles,
  BookOpen,
  TimerReset,
  Hourglass,
  Lightbulb,
  Zap,
  Clipboard,
  CheckSquare,
  PanelLeft,
  PanelRight,
  Pause,
  Play,
  RefreshCw
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ExecutiveDysfunctionSupportProps {
  userId?: string;
  initialData?;
  className?: string;
}

export default function ExecutiveDysfunctionSupport({
  userId,
  initialData,
  className
}: ExecutiveDysfunctionSupportProps) {
  const [activeTab, setActiveTab] = useState('task-management');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    complexity: 50,
    steps: []
  });
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25); // minutes
  const [timerRemaining, setTimerRemaining] = useState(25 * 60); // seconds
  const [breakMode, setBreakMode] = useState(false);
  const [settings, setSettings] = useState({
    useVisualSupports: true,
    useAudioReminders: true,
    useTimerBreakdown: true,
    useAutomaticBreaks: true,
    useTaskBreakdown: true,
    complexityThreshold: 60,
    reminderFrequency: 'medium',
    interfaceComplexity: 'standard'
  });
  
  // Load user data and tasks
  useEffect(() => {
    if (initialData) {
      setUserData(initialData.userData || null);
      setTasks(initialData.tasks || []);
      return;
    }
    
    if (userId) {
      fetchUserData();
    }
  }, [userId, initialData]);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(prev => prev - 1);
      }, 1000);
    } else if (timerRemaining === 0) {
      setTimerActive(false);
      if (!breakMode) {
        toast({
          title: "Time's up!",
          description: settings.useAutomaticBreaks ? "Time for a short break." : "Your focused work time is complete.",
        });
        
        if (settings.useAutomaticBreaks) {
          setBreakMode(true);
          setTimerRemaining(5 * 60); // 5 minute break
          setTimerActive(true);
        }
      } else {
        toast({
          title: "Break complete",
          description: "Ready to start another focused work session?",
        });
        setBreakMode(false);
        setTimerRemaining(timerDuration * 60);
      }
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timerRemaining, breakMode, settings.useAutomaticBreaks, timerDuration]);
  
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ai/executive-dysfunction/user-data?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data.userData);
        setTasks(data.tasks || []);
        
        // Update settings based on user preferences if available
        if (data.settings) {
          setSettings(prev => ({
            ...prev,
            ...data.settings
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTask = async () => {
    if (!newTask.title) {
      toast({
        title: "Task title required",
        description: "Please provide a title for your task.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // If task complexity is above threshold and task breakdown is enabled,
      // generate steps automatically
      const taskWithSteps = { ...newTask };
      
      if (settings.useTaskBreakdown && newTask.complexity >= settings.complexityThreshold && newTask.steps.length === 0) {
        const breakdownResponse = await fetch('/api/ai/executive-dysfunction/task-breakdown', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            task: newTask,
            userProfile: userData?.profile || null
          }),
        });
        
        if (breakdownResponse.ok) {
          const breakdownData = await breakdownResponse.json();
          taskWithSteps.steps = breakdownData.steps;
        }
      }
      
      const response = await fetch('/api/ai/executive-dysfunction/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          task: taskWithSteps
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks([...tasks, data.task]);
        setNewTask({
          title: '',
          description: '',
          dueDate: '',
          priority: 'medium',
          complexity: 50,
          steps: []
        });
        
        toast({
          title: "Task added",
          description: "Your task has been successfully added.",
        });
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTaskComplete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/ai/executive-dysfunction/tasks/${taskId}/complete`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, completed: true } : task
        ));
        
        toast({
          title: "Task completed",
          description: "Well done! You've completed this task.",
        });
      }
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleStepComplete = async (taskId: string, stepIndex: number) => {
    try {
      const response = await fetch(`/api/ai/executive-dysfunction/tasks/${taskId}/steps/${stepIndex}/complete`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        setTasks(tasks.map(task => {
          if (task.id === taskId) {
            const updatedSteps = [...task.steps];
            updatedSteps[stepIndex] = {
              ...updatedSteps[stepIndex],
              completed: true
            };
            return { ...task, steps: updatedSteps };
          }
          return task;
        }));
      }
    } catch (error) {
      console.error('Error completing step:', error);
      toast({
        title: "Error",
        description: "Failed to update step status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleTimerStart = () => {
    setTimerActive(true);
  };
  
  const handleTimerPause = () => {
    setTimerActive(false);
  };
  
  const handleTimerReset = () => {
    setTimerActive(false);
    setTimerRemaining(timerDuration * 60);
    setBreakMode(false);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };
  
  const getTaskPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Priority Not Set';
    }
  };
  
  const calculateTaskProgress = (task) => {
    if (!task.steps || task.steps.length === 0) return task.completed ? 100 : 0;
    
    const completedSteps = task.steps.filter((step) => step.completed).length;
    return Math.round((completedSteps / task.steps.length) * 100);
  };
  
  const renderTaskManagement = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>
              Break down complex tasks into manageable steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input 
                id="task-title" 
                placeholder="Enter task title" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-description">Description (Optional)</Label>
              <Input 
                id="task-description" 
                placeholder="Enter task description" 
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-due-date">Due Date (Optional)</Label>
              <Input 
                id="task-due-date" 
                type="date" 
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex space-x-2">
                <Button 
                  variant={newTask.priority === 'low' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setNewTask({...newTask, priority: 'low'})}
                >
                  Low
                </Button>
                <Button 
                  variant={newTask.priority === 'medium' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setNewTask({...newTask, priority: 'medium'})}
                >
                  Medium
                </Button>
                <Button 
                  variant={newTask.priority === 'high' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setNewTask({...newTask, priority: 'high'})}
                >
                  High
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-centre justify-between">
                <Label>Task Complexity</Label>
                <span className="text-sm text-muted-foreground">{newTask.complexity}%</span>
              </div>
              <Slider 
                value={[newTask.complexity]} 
                min={10} 
                max={100} 
                step={10}
                onValueChange={(value) => setNewTask({...newTask, complexity: value[0]})}
              />
              <p className="text-xs text-muted-foreground">
                {newTask.complexity < 30 ? 'Simple task, minimal steps required' : 
                 newTask.complexity < 70 ? 'Moderate complexity, may benefit from breakdown' : 
                 'Complex task, automatic breakdown recommended'}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleAddTask} 
              disabled={isLoading || !newTask.title}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ListTodo className="mr-2 h-4 w-4" />
                  Add Task
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Tasks</h3>
          
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-centre text-muted-foreground">
                <ListTodo className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No tasks added yet. Add your first task above.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id} className={task.completed ? 'opacity-60' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex items-centre justify-between">
                      <CardTitle className="text-lg flex items-centre">
                        <div className="flex-shrink-0 mr-2">
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <div 
                              className="h-5 w-5 rounded-full border-2 border-grey-300 cursor-pointer"
                              onClick={() => handleTaskComplete(task.id)}
                            />
                          )}
                        </div>
                        <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                          {task.title}
                        </span>
                      </CardTitle>
                      <Badge variant="outline" className={getTaskPriorityColor(task.priority)}>
                        {getTaskPriorityLabel(task.priority)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {task.description && (
                        <p className="mt-1">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <div className="flex items-centre mt-2 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  
                  {task.steps && task.steps.length > 0 && (
                    <CardContent className="pt-0">
                      <div className="mt-2">
                        <div className="flex items-centre justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {calculateTaskProgress(task)}%
                          </span>
                        </div>
                        <Progress value={calculateTaskProgress(task)} className="h-2" />
                      </div>
                      
                      <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value="steps">
                          <AccordionTrigger className="text-sm">
                            Task Steps ({task.steps.filter((step) => step.completed).length}/{task.steps.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 mt-2">
                              {task.steps.map((step, index: number) => (
                                <div 
                                  key={index} 
                                  className="flex items-start p-2 rounded-md bg-slate-50 dark:bg-slate-900"
                                >
                                  <div className="flex-shrink-0 mt-0.5 mr-2">
                                    {step.completed ? (
                                      <CheckSquare className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <div 
                                        className="h-4 w-4 rounded border border-grey-300 cursor-pointer"
                                        onClick={() => handleStepComplete(task.id, index)}
                                      />
                                    )}
                                  </div>
                                  <div className={step.completed ? 'line-through text-muted-foreground' : ''}>
                                    <p className="text-sm">{step.description}</p>
                                    {step.estimatedTime && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Est. time: {step.estimatedTime}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderTimeManagement = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Focus Timer</CardTitle>
            <CardDescription>
              Use the Pomodoro technique to maintain focus and manage time effectively
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-centre justify-centre">
              <div className={`text-5xl font-bold mb-4 ${breakMode ? 'text-green-500' : ''}`}>
                {formatTime(timerRemaining)}
              </div>
              
              <div className="text-centre mb-6">
                <Badge variant="outline" className={breakMode ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                  {breakMode ? 'Break Time' : 'Focus Time'}
                </Badge>
              </div>
              
              <div className="flex space-x-2 mb-6">
                {!timerActive ? (
                  <Button onClick={handleTimerStart} className="flex items-centre">
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={handleTimerPause} variant="outline" className="flex items-centre">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                )}
                <Button onClick={handleTimerReset} variant="outline" className="flex items-centre">
                  <TimerReset className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
              
              {settings.useTimerBreakdown && (
                <div className="w-full max-w-md">
                  <div className="space-y-2">
                    <div className="flex items-centre justify-between">
                      <Label>Focus Duration (minutes)</Label>
                      <span className="text-sm text-muted-foreground">{timerDuration} min</span>
                    </div>
                    <Slider 
                      value={[timerDuration]} 
                      min={5} 
                      max={60} 
                      step={5}
                      onValueChange={(value) => {
                        setTimerDuration(value[0]);
                        if (!timerActive) {
                          setTimerRemaining(value[0] * 60);
                        }
                      }}
                      disabled={timerActive}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2 flex items-centre">
                <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                Focus Tips
              </h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Clear your workspace of distractions before starting</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Set a specific goal for each focus session</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Take short breaks between focus sessions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Use the break time to stretch or move around</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Daily Schedule</CardTitle>
            <CardDescription>
              Visualise your day to manage time effectively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would be replaced with an actual calendar/schedule component */}
              <div className="text-centre p-6 border border-dashed rounded-md">
                <Calendar className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Daily schedule visualisation coming soon
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderWorkingMemory = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Working Memory Support</CardTitle>
            <CardDescription>
              Tools to help manage and strengthen working memory
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2 flex items-centre">
                <BrainCircuit className="h-4 w-4 mr-2 text-purple-500" />
                Working Memory Strategies
              </h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Break information into smaller chunks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Use visualisation techniques to remember information</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Create acronyms or mnemonics for complex information</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Use external aids like notes or digital reminders</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <Label>Memory Notes</Label>
              <div className="border rounded-md p-4 min-h-[200px]">
                <textarea 
                  className="w-full h-full min-h-[180px] bg-transparent resize-none focus:outline-none" 
                  placeholder="Use this space to jot down important information you need to remember..."
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                Save Notes
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Visual Reminders</CardTitle>
            <CardDescription>
              Create visual cues to support memory and task completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would be replaced with an actual visual reminder component */}
              <div className="text-centre p-6 border border-dashed rounded-md">
                <Layers className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Visual reminder creation tools coming soon
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderEmotionalRegulation = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Emotional Regulation Tools</CardTitle>
            <CardDescription>
              Strategies to help manage emotions and reduce anxiety
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2 flex items-centre text-blue-700 dark:text-blue-300">
                <Sparkles className="h-4 w-4 mr-2" />
                Calming Techniques
              </h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Deep Breathing</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Breathe in for 4 counts, hold for 4, exhale for 6
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <div>
                    <span className="font-medium">5-4-3-2-1 Grounding</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Progressive Muscle Relaxation</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tense and then relax each muscle group in your body
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2 flex items-centre text-purple-700 dark:text-purple-300">
                <Zap className="h-4 w-4 mr-2" />
                Emotional Awareness
              </h4>
              <div className="space-y-4">
                <p className="text-sm">
                  Recognising your emotional state is the first step to regulation.
                  How are you feeling right now?
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" className="h-auto py-2">
                    😊 Calm
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto py-2">
                    😟 Anxious
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto py-2">
                    😠 Frustrated
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto py-2">
                    😔 Overwhelmed
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2 flex items-centre text-green-700 dark:text-green-300">
                <Lightbulb className="h-4 w-4 mr-2" />
                Coping Strategies
              </h4>
              <div className="space-y-2">
                <p className="text-sm">
                  When feeling overwhelmed with a task:
                </p>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Break the task into smaller steps</li>
                  <li>Take a short break and return with fresh perspective</li>
                  <li>Ask for help or clarification</li>
                  <li>Use positive self-talk: "I can handle this one step at a time"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Support Settings</CardTitle>
            <CardDescription>
              Customise executive function support tools to meet your needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <Label>Use Visual Supports</Label>
                <p className="text-sm text-muted-foreground">
                  Display visual cues and reminders
                </p>
              </div>
              <Switch 
                checked={settings.useVisualSupports}
                onCheckedChange={(checked) => setSettings({...settings, useVisualSupports: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <Label>Use Audio Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Play audio alerts for important reminders
                </p>
              </div>
              <Switch 
                checked={settings.useAudioReminders}
                onCheckedChange={(checked) => setSettings({...settings, useAudioReminders: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <Label>Use Timer Breakdown</Label>
                <p className="text-sm text-muted-foreground">
                  Allow customization of focus timer durations
                </p>
              </div>
              <Switch 
                checked={settings.useTimerBreakdown}
                onCheckedChange={(checked) => setSettings({...settings, useTimerBreakdown: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <Label>Use Automatic Breaks</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start break timer after focus session
                </p>
              </div>
              <Switch 
                checked={settings.useAutomaticBreaks}
                onCheckedChange={(checked) => setSettings({...settings, useAutomaticBreaks: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-centre justify-between">
              <div className="space-y-0.5">
                <Label>Use Task Breakdown</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically break complex tasks into steps
                </p>
              </div>
              <Switch 
                checked={settings.useTaskBreakdown}
                onCheckedChange={(checked) => setSettings({...settings, useTaskBreakdown: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-centre justify-between">
                <Label>Complexity Threshold for Auto-Breakdown</Label>
                <span className="text-sm text-muted-foreground">{settings.complexityThreshold}%</span>
              </div>
              <Slider 
                value={[settings.complexityThreshold]} 
                min={30} 
                max={90} 
                step={10}
                onValueChange={(value) => setSettings({...settings, complexityThreshold: value[0]})}
                disabled={!settings.useTaskBreakdown}
              />
              <p className="text-xs text-muted-foreground">
                Tasks with complexity above this threshold will be automatically broken down
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Reminder Frequency</Label>
              <div className="flex space-x-2">
                <Button 
                  variant={settings.reminderFrequency === 'low' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSettings({...settings, reminderFrequency: 'low'})}
                >
                  Low
                </Button>
                <Button 
                  variant={settings.reminderFrequency === 'medium' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSettings({...settings, reminderFrequency: 'medium'})}
                >
                  Medium
                </Button>
                <Button 
                  variant={settings.reminderFrequency === 'high' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSettings({...settings, reminderFrequency: 'high'})}
                >
                  High
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                How often to display reminders and check-ins
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Interface Complexity</Label>
              <div className="flex space-x-2">
                <Button 
                  variant={settings.interfaceComplexity === 'simplified' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSettings({...settings, interfaceComplexity: 'simplified'})}
                  className="flex items-centre"
                >
                  <PanelLeft className="h-4 w-4 mr-2" />
                  Simplified
                </Button>
                <Button 
                  variant={settings.interfaceComplexity === 'standard' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSettings({...settings, interfaceComplexity: 'standard'})}
                >
                  Standard
                </Button>
                <Button 
                  variant={settings.interfaceComplexity === 'detailed' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSettings({...settings, interfaceComplexity: 'detailed'})}
                  className="flex items-centre"
                >
                  <PanelRight className="h-4 w-4 mr-2" />
                  Detailed
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Adjust the amount of information and options displayed
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-centre justify-between">
            <div className="flex items-centre gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Executive Function Support
            </div>
            {userData && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={userData.image} alt={userData.name} />
                <AvatarFallback>{userData.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            )}
          </CardTitle>
          <CardDescription>
            Tools to help with planning, organisation, time management, and emotional regulation
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="task-management" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
              <TabsTrigger value="task-management" className="flex items-centre gap-1">
                <ListTodo className="h-4 w-4" />
                <span className="hidden md:inline">Task Management</span>
                <span className="md:hidden">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="time-management" className="flex items-centre gap-1">
                <Clock className="h-4 w-4" />
                <span className="hidden md:inline">Time Management</span>
                <span className="md:hidden">Time</span>
              </TabsTrigger>
              <TabsTrigger value="working-memory" className="flex items-centre gap-1">
                <BrainCircuit className="h-4 w-4" />
                <span className="hidden md:inline">Working Memory</span>
                <span className="md:hidden">Memory</span>
              </TabsTrigger>
              <TabsTrigger value="emotional-regulation" className="flex items-centre gap-1">
                <Sparkles className="h-4 w-4" />
                <span className="hidden md:inline">Emotional Regulation</span>
                <span className="md:hidden">Emotions</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-centre gap-1">
                <Layers className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="task-management">
              {renderTaskManagement()}
            </TabsContent>
            
            <TabsContent value="time-management">
              {renderTimeManagement()}
            </TabsContent>
            
            <TabsContent value="working-memory">
              {renderWorkingMemory()}
            </TabsContent>
            
            <TabsContent value="emotional-regulation">
              {renderEmotionalRegulation()}
            </TabsContent>
            
            <TabsContent value="settings">
              {renderSettings()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
