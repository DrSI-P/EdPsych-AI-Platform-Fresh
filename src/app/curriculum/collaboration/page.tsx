'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { CalendarIcon, Clock, MessageSquare, Plus, Trash2, Users } from "lucide-react";

// Define interfaces for data structures
interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface Collaborator {
  id: string;
  userId: string;
  projectId: string;
  role: string;
  user: User;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: User;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  dueDate?: string;
  assignedTo?: User;
}

interface Plan {
  id: string;
  title: string;
  description: string;
  tasks: any[];
}

interface CollaborationData {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  collaborators: any[];
  comments: any[];
  plan: Plan;
}

export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [collaborationData, setCollaborationData] = useState<CollaborationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedToId: '',
    dueDate: null as Date | null,
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  // Simulated user data
  const currentUser = {
    id: 'user-1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'EDUCATOR'
  };
  
  // Check if current user can edit
  const canEdit = collaborationData?.collaborators.some(
    c => c.userId === currentUser.id && ['owner', 'editor'].includes(c.role)
  ) || false;
  
  // Fetch collaboration data
  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulated API response
        const data: CollaborationData = {
          id: 'collab-1',
          title: 'Year 6 Science Curriculum Planning',
          description: 'Collaborative planning for the Year 6 science curriculum, focusing on practical experiments and cross-curricular connections.',
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-05-10T14:45:00Z',
          createdBy: {
            id: 'user-2',
            name: 'Alex Johnson',
            email: 'alex.johnson@example.com',
            image: '/images/avatars/alex.jpg'
          },
          collaborators: [
            {
              id: 'collab-1',
              userId: 'user-1',
              projectId: 'collab-1',
              role: 'editor',
              user: {
                id: 'user-1',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                image: '/images/avatars/jane.jpg'
              }
            },
            {
              id: 'collab-2',
              userId: 'user-2',
              projectId: 'collab-1',
              role: 'owner',
              user: {
                id: 'user-2',
                name: 'Alex Johnson',
                email: 'alex.johnson@example.com',
                image: '/images/avatars/alex.jpg'
              }
            },
            {
              id: 'collab-3',
              userId: 'user-3',
              projectId: 'collab-1',
              role: 'viewer',
              user: {
                id: 'user-3',
                name: 'Sam Taylor',
                email: 'sam.taylor@example.com',
                image: '/images/avatars/sam.jpg'
              }
            }
          ],
          comments: [
            {
              id: 'comment-1',
              content: 'I\'ve added some resources for the electricity unit in the shared folder.',
              createdAt: '2025-05-08T09:15:00Z',
              author: {
                id: 'user-2',
                name: 'Alex Johnson',
                email: 'alex.johnson@example.com',
                image: '/images/avatars/alex.jpg'
              }
            },
            {
              id: 'comment-2',
              content: 'The practical experiment for the water cycle looks great! I\'ve made some minor adjustments to make it more accessible.',
              createdAt: '2025-05-09T14:30:00Z',
              author: {
                id: 'user-1',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                image: '/images/avatars/jane.jpg'
              }
            }
          ],
          plan: {
            id: 'plan-1',
            title: 'Term 3 Science Plan',
            description: 'Detailed planning for Term 3 science units, including electricity, forces, and the water cycle.',
            tasks: [
              {
                id: 'task-1',
                title: 'Finalize electricity unit practical experiments',
                description: 'Select and test 3-4 practical experiments for the electricity unit that demonstrate key concepts.',
                status: 'completed',
                assignedTo: {
                  id: 'user-2',
                  name: 'Alex Johnson',
                  email: 'alex.johnson@example.com',
                  image: '/images/avatars/alex.jpg'
                }
              },
              {
                id: 'task-2',
                title: 'Create differentiated worksheets for forces unit',
                description: 'Develop three levels of worksheets to support different ability levels in the forces unit.',
                status: 'pending',
                dueDate: '2025-05-20T00:00:00Z',
                assignedTo: {
                  id: 'user-1',
                  name: 'Jane Smith',
                  email: 'jane.smith@example.com',
                  image: '/images/avatars/jane.jpg'
                }
              },
              {
                id: 'task-3',
                title: 'Source video resources for water cycle',
                description: 'Find appropriate video resources that clearly explain the water cycle for Year 6 students.',
                status: 'pending',
                dueDate: '2025-05-15T00:00:00Z',
                assignedTo: {
                  id: 'user-3',
                  name: 'Sam Taylor',
                  email: 'sam.taylor@example.com',
                  image: '/images/avatars/sam.jpg'
                }
              }
            ]
          }
        };
        
        setCollaborationData(data);
      } catch (err) {
        setError('Failed to load collaboration data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle adding a new comment
  const handleAddComment = () => {
    if (!newComment.trim() || !collaborationData) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      }
    };
    
    setCollaborationData({
      ...collaborationData,
      comments: [...collaborationData.comments, comment]
    });
    
    setNewComment('');
    
    // In a real app, this would send to an API
  };
  
  // Handle adding a new task
  const handleAddTask = () => {
    if (!newTask.title.trim() || !collaborationData) return;
    
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: 'pending',
      dueDate: newTask.dueDate ? newTask.dueDate.toISOString() : undefined,
      assignedTo: newTask.assignedToId ? 
        collaborationData.collaborators.find(c => c.userId === newTask.assignedToId)?.user : 
        undefined
    };
    
    const updatedPlan = {
      ...collaborationData.plan,
      tasks: [...collaborationData.plan.tasks, task]
    };
    
    setCollaborationData({
      ...collaborationData,
      plan: updatedPlan
    });
    
    setNewTask({
      title: '',
      description: '',
      assignedToId: '',
      dueDate: null
    });
    
    setIsAddingTask(false);
    
    // In a real app, this would send to an API
  };
  
  // Handle updating task status
  const handleUpdateTaskStatus = (taskId: string, status: 'pending' | 'completed') => {
    if (!collaborationData) return;
    
    const updatedTasks = collaborationData.plan.tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    );
    
    const updatedPlan = {
      ...collaborationData.plan,
      tasks: updatedTasks
    };
    
    setCollaborationData({
      ...collaborationData,
      plan: updatedPlan
    });
    
    // In a real app, this would send to an API
  };
  
  // Handle deleting a task
  const handleDeleteTask = (taskId: string) => {
    if (!collaborationData) return;
    
    const updatedTasks = collaborationData.plan.tasks.filter(task => task.id !== taskId);
    
    const updatedPlan = {
      ...collaborationData.plan,
      tasks: updatedTasks
    };
    
    setCollaborationData({
      ...collaborationData,
      plan: updatedPlan
    });
    
    // In a real app, this would send to an API
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  
  if (!collaborationData) {
    return <div>No collaboration data found</div>;
  }
  
  const { title, description, createdBy, collaborators, comments, plan } = collaborationData;
  const tasks = plan.tasks;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
        <div className="flex items-center mt-4">
          <div className="flex -space-x-2 mr-4">
            {collaborators.slice(0, 3).map(collaborator => (
              <Avatar key={collaborator.id} className="border-2 border-background">
                <AvatarImage src={collaborator.user.image} alt={collaborator.user.name} />
                <AvatarFallback>{collaborator.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {collaborators.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                +{collaborators.length - 3}
              </div>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            Created by {createdBy.name} · {new Date(collaborationData.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>Key information about this collaboration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p>{description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comments[comments.length - 1]?.author.image} alt={comments[comments.length - 1]?.author.name} />
                            <AvatarFallback>{comments[comments.length - 1]?.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <div className="font-medium">{comments[comments.length - 1]?.author.name}</div>
                          <p className="text-sm">{comments[comments.length - 1]?.content}</p>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(comments[comments.length - 1]?.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={tasks.find(t => t.status === 'completed')?.assignedTo?.image} alt={tasks.find(t => t.status === 'completed')?.assignedTo?.name} />
                            <AvatarFallback>{tasks.find(t => t.status === 'completed')?.assignedTo?.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <div className="font-medium">{tasks.find(t => t.status === 'completed')?.assignedTo?.name}</div>
                          <p className="text-sm">Completed task: {tasks.find(t => t.status === 'completed')?.title}</p>
                          <div className="text-xs text-muted-foreground mt-1">
                            Recently
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Collaborators</CardTitle>
                <CardDescription>People working on this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collaborators.map(collaborator => (
                    <div key={collaborator.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={collaborator.user.image} alt={collaborator.user.name} />
                          <AvatarFallback>{collaborator.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{collaborator.user.name}</div>
                          <div className="text-xs text-muted-foreground">{collaborator.user.email}</div>
                        </div>
                      </div>
                      <Badge variant={
                        collaborator.role === 'owner' ? 'default' :
                        collaborator.role === 'editor' ? 'secondary' :
                        'outline'
                      }>
                        {collaborator.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="discussion">
          <Card>
            <CardHeader>
              <CardTitle>Discussion</CardTitle>
              <CardDescription>Collaborate and share ideas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {comments.map(comment => (
                  <div key={comment.id} className="flex items-start">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={comment.author.image} alt={comment.author.name} />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{comment.author.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <p className="mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <div className="flex items-start">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-2"
                      />
                      <Button onClick={handleAddComment}>Post Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Track and manage project tasks</CardDescription>
              </div>
              {canEdit && (
                <Button onClick={() => setIsAddingTask(true)} size="sm">
                  <Plus className="mr-1 h-4 w-4" /> Add Task
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tasks yet. Add a task to get started.
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium mb-2">Pending Tasks</h3>
                    <div className="space-y-2">
                      {tasks.filter(task => task.status === 'pending').map(task => (
                        <Card key={task.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    onChange={() => handleUpdateTaskStatus(task.id, 'completed')}
                                  />
                                  <h4 className="font-medium">{task.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                  {task.assignedTo && (
                                    <div className="flex items-center mr-4">
                                      <Users className="mr-1 h-3 w-3" />
                                      {task.assignedTo.name}
                                    </div>
                                  )}
                                  {task.dueDate && (
                                    <div className="flex items-center">
                                      <Clock className="mr-1 h-3 w-3" />
                                      Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {canEdit && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <h3 className="font-medium mb-2 mt-6">Completed Tasks</h3>
                    <div className="space-y-2">
                      {tasks.filter(task => task.status === 'completed').map(task => (
                        <Card key={task.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked
                                    onChange={() => handleUpdateTaskStatus(task.id, 'pending')}
                                  />
                                  <h4 className="font-medium line-through text-muted-foreground">{task.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                  {task.assignedTo && (
                                    <div className="flex items-center mr-4">
                                      <Users className="mr-1 h-3 w-3" />
                                      {task.assignedTo.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {canEdit && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {isAddingTask && (
            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="task-title">Title</Label>
                    <Input
                      id="task-title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Task title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Task description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-assignee">Assign To</Label>
                    <Select
                      value={newTask.assignedToId}
                      onValueChange={(value) => setNewTask({...newTask, assignedToId: value})}
                    >
                      <SelectTrigger id="task-assignee">
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                      <SelectContent>
                        {collaborators.map(collaborator => (
                          <SelectItem key={collaborator.userId} value={collaborator.userId}>
                            {collaborator.user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="task-due-date">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          id="task-due-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTask.dueDate ? format(newTask.dueDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newTask.dueDate || undefined}
                          onSelect={(date) => setNewTask({...newTask, dueDate: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingTask(false)}>Cancel</Button>
                  <Button onClick={handleAddTask}>Add Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
