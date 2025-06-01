'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Home, 
  PlusCircle, 
  School, 
  Target, 
  User 
} from 'lucide-react';
import { SharedGoal, GoalUpdate, CommunicationRole } from '@/lib/communication/types';
import { CommunicationService } from '@/lib/communication/communicationService';

interface SharedGoalTrackerProps {
  studentId: string;
  studentName: string;
  userId: string;
  userRole: CommunicationRole;
}

export const SharedGoalTracker: React.FC<SharedGoalTrackerProps> = ({
  studentId,
  studentName,
  userId,
  userRole
}) => {
  const [goals, setGoals] = useState<SharedGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SharedGoal | null>(null);
  const [updateContent, setUpdateContent] = useState('');
  const [newProgress, setNewProgress] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  
  const communicationService = new CommunicationService();
  
  // Fetch goals on component mount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        // In a real implementation, this would fetch goals from the API
        // For now, we'll use mock data
        const mockGoals: SharedGoal[] = [
          {
            id: 'goal1',
            studentId,
            studentName,
            title: 'Improve reading comprehension',
            description: 'Work on understanding complex texts and answering inference questions',
            category: 'academic',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            createdById: 'teacher1',
            createdByRole: CommunicationRole.TEACHER,
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            status: 'in_progress',
            progress: 35,
            homeActions: [
              'Read for 20 minutes daily with discussion',
              'Complete weekly comprehension exercises',
              'Use reading journal to note unfamiliar words'
            ],
            schoolActions: [
              'Guided reading sessions twice weekly',
              'Comprehension strategy instruction',
              'Regular progress monitoring'
            ],
            updates: [
              {
                id: 'update1',
                goalId: 'goal1',
                content: 'Started guided reading sessions. Initial assessment complete.',
                updatedById: 'teacher1',
                updatedByRole: CommunicationRole.TEACHER,
                updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                newProgress: 15
              },
              {
                id: 'update2',
                goalId: 'goal1',
                content: 'Reading journal started at home. Completed first week of daily reading.',
                updatedById: 'parent1',
                updatedByRole: CommunicationRole.PARENT,
                updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                newProgress: 25
              },
              {
                id: 'update3',
                goalId: 'goal1',
                content: 'Showing improvement in literal comprehension questions. Still working on inference.',
                updatedById: 'teacher1',
                updatedByRole: CommunicationRole.TEACHER,
                updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                newProgress: 35
              }
            ],
            isArchived: false
          },
          {
            id: 'goal2',
            studentId,
            studentName,
            title: 'Develop social skills during group work',
            description: 'Focus on turn-taking, active listening, and contributing appropriately in group settings',
            category: 'social',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            createdById: 'senco1',
            createdByRole: CommunicationRole.SENCO,
            targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
            status: 'in_progress',
            progress: 60,
            homeActions: [
              'Practise turn-taking during family games',
              'Discuss social scenarios and appropriate responses',
              'Arrange playdates to practise skills'
            ],
            schoolActions: [
              'Structured group activities with clear roles',
              'Social skills coaching before group work',
              'Regular feedback and reinforcement'
            ],
            updates: [
              {
                id: 'update4',
                goalId: 'goal2',
                content: 'Initial assessment complete. Starting with structured group activities.',
                updatedById: 'senco1',
                updatedByRole: CommunicationRole.SENCO,
                updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
                newProgress: 10
              },
              {
                id: 'update5',
                goalId: 'goal2',
                content: 'Had two successful playdates this week. Practicing turn-taking at home.',
                updatedById: 'parent1',
                updatedByRole: CommunicationRole.PARENT,
                updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
                newProgress: 30
              },
              {
                id: 'update6',
                goalId: 'goal2',
                content: 'Showing significant improvement in group work. Actively participating and taking turns.',
                updatedById: 'teacher1',
                updatedByRole: CommunicationRole.TEACHER,
                updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
                newProgress: 60
              }
            ],
            isArchived: false
          }
        ];
        
        setGoals(mockGoals);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching goals:', error);
        setIsLoading(false);
      }
    };
    
    fetchGoals();
  }, [studentId]);
  
  // Create a new goal
  const handleCreateGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const newGoal = await communicationService.createSharedGoal({
        studentId,
        studentName,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as any,
        createdById: userId,
        createdByRole: userRole,
        targetDate: formData.get('targetDate') ? new Date(formData.get('targetDate') as string) : undefined,
        homeActions: (formData.get('homeActions') as string).split('\n').filter(action => action.trim() !== ''),
        schoolActions: (formData.get('schoolActions') as string).split('\n').filter(action => action.trim() !== '')
      });
      
      // In a real implementation, this would add the new goal to the state
      // For now, we'll just close the dialogue
      setIsCreatingGoal(false);
      
      // Mock adding the goal to the state
      const mockNewGoal: SharedGoal = {
        id: `goal${goals.length + 1}`,
        studentId,
        studentName,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as any,
        createdAt: new Date(),
        createdById: userId,
        createdByRole: userRole,
        targetDate: formData.get('targetDate') ? new Date(formData.get('targetDate') as string) : undefined,
        status: 'not_started',
        progress: 0,
        homeActions: (formData.get('homeActions') as string).split('\n').filter(action => action.trim() !== ''),
        schoolActions: (formData.get('schoolActions') as string).split('\n').filter(action => action.trim() !== ''),
        updates: [],
        isArchived: false
      };
      
      setGoals([...goals, mockNewGoal]);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };
  
  // Add an update to a goal
  const handleAddUpdate = async () => {
    if (!selectedGoal || !updateContent) return;
    
    try {
      await communicationService.updateGoalProgress(selectedGoal.id, {
        content: updateContent,
        updatedById: userId,
        updatedByRole: userRole,
        newProgress: newProgress !== null ? newProgress : undefined
      });
      
      // In a real implementation, this would update the goal in the state
      // For now, we'll just update it manually
      const updatedGoals = goals.map(goal => {
        if (goal.id === selectedGoal.id) {
          const newUpdate: GoalUpdate = {
            id: `update${Date.now()}`,
            goalId: selectedGoal.id,
            content: updateContent,
            updatedById: userId,
            updatedByRole: userRole,
            updatedAt: new Date(),
            newProgress: newProgress !== null ? newProgress : undefined
          };
          
          return {
            ...goal,
            updates: [...goal.updates, newUpdate],
            progress: newProgress !== null ? newProgress : goal.progress,
            status: newProgress === 100 ? 'completed' : goal.status
          };
        }
        return goal;
      });
      
      setGoals(updatedGoals);
      setUpdateContent('');
      setNewProgress(null);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Error adding update:', error);
    }
  };
  
  // Filter goals based on status
  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return !goal.isArchived;
    if (filter === 'active') return !goal.isArchived && goal.status !== 'completed';
    if (filter === 'completed') return !goal.isArchived && goal.status === 'completed';
    return true;
  });
  
  // Get badge colour based on category
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'academic':
        return <Badge className="bg-blue-500">Academic</Badge>;
      case 'behavioural':
        return <Badge className="bg-purple-500">Behavioural</Badge>;
      case 'social':
        return <Badge className="bg-green-500">Social</Badge>;
      case 'emotional':
        return <Badge className="bg-amber-500">Emotional</Badge>;
      default:
        return <Badge>Other</Badge>;
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  // Get role icon
  const getRoleIcon = (role: CommunicationRole) => {
    switch (role) {
      case CommunicationRole.TEACHER:
        return <School className="h-4 w-4 mr-1" />;
      case CommunicationRole.PARENT:
        return <Home className="h-4 w-4 mr-1" />;
      case CommunicationRole.SENCO:
        return <User className="h-4 w-4 mr-1" />;
      default:
        return <User className="h-4 w-4 mr-1" />;
    }
  };
  
  // Get role name
  const getRoleName = (role: CommunicationRole) => {
    switch (role) {
      case CommunicationRole.TEACHER:
        return 'Teacher';
      case CommunicationRole.PARENT:
        return 'Parent';
      case CommunicationRole.SENCO:
        return 'SENCO';
      case CommunicationRole.ADMINISTRATOR:
        return 'Administrator';
      case CommunicationRole.EDUCATIONAL_PSYCHOLOGIST:
        return 'Educational Psychologist';
      case CommunicationRole.STUDENT:
        return 'Student';
      default:
        return role;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-centre justify-centre p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading goals...</span>
      </div>
    );
  }
  
  return (
    <div className="shared-goal-tracker">
      <div className="flex justify-between items-centre mb-6">
        <div>
          <h2 className="text-2xl font-bold">Shared Goals</h2>
          <p className="text-muted-foreground">
            Track and collaborate on goals for {studentName}
          </p>
        </div>
        
        <div className="flex items-centre gap-4">
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter goals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Goals</SelectItem>
              <SelectItem value="active">Active Goals</SelectItem>
              <SelectItem value="completed">Completed Goals</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isCreatingGoal} onOpenChange={setIsCreatingGoal}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Shared Goal</DialogTitle>
                <DialogDescription>
                  Create a new goal to collaborate on with parents and teachers.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateGoal}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-centre gap-4">
                    <label htmlFor="title" className="text-right font-medium">
                      Title
                    </label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Goal title"
                      className="col-span-3"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-centre gap-4">
                    <label htmlFor="category" className="text-right font-medium">
                      Category
                    </label>
                    <Select name="category" defaultValue="academic">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="behavioural">Behavioural</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="emotional">Emotional</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-centre gap-4">
                    <label htmlFor="description" className="text-right font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Detailed description of the goal"
                      className="col-span-3"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-centre gap-4">
                    <label htmlFor="targetDate" className="text-right font-medium">
                      Target Date
                    </label>
                    <Input
                      id="targetDate"
                      name="targetDate"
                      type="date"
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label htmlFor="homeActions" className="text-right font-medium pt-2">
                      Home Actions
                    </label>
                    <Textarea
                      id="homeActions"
                      name="homeActions"
                      placeholder="List actions to be taken at home (one per line)"
                      className="col-span-3"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label htmlFor="schoolActions" className="text-right font-medium pt-2">
                      School Actions
                    </label>
                    <Textarea
                      id="schoolActions"
                      name="schoolActions"
                      placeholder="List actions to be taken at school (one per line)"
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreatingGoal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Goal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {filteredGoals.length === 0 ? (
        <div className="flex flex-col items-centre justify-centre p-12 border rounded-lg bg-muted/50">
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No goals found</h3>
          <p className="text-muted-foreground text-centre max-w-md mb-6">
            {filter === 'all' 
              ? "No goals have been created yet. Create a new goal to start collaborating."
              : filter === 'active'
                ? "No active goals found. All goals may be completed or you can create a new goal."
                : "No completed goals found. Keep working on your active goals!"}
          </p>
          <Button onClick={() => setIsCreatingGoal(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create First Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => (
            <Card key={goal.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{goal.title}</CardTitle>
                    <CardDescription className="flex items-centre mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created {formatDate(goal.createdAt)}
                      {goal.targetDate && (
                        <>
                          <span className="mx-1">•</span>
                          <Target className="h-4 w-4 mr-1" />
                          Target: {formatDate(goal.targetDate)}
                        </>
                      )}
                    </CardDescription>
                  </div>
                  {getCategoryBadge(goal.category)}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="mb-4">{goal.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between items-centre mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                
                <Tabs defaultValue="updates">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="updates">Updates</TabsTrigger>
                    <TabsTrigger value="home">Home Actions</TabsTrigger>
                    <TabsTrigger value="school">School Actions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="updates" className="max-h-48 overflow-y-auto">
                    {goal.updates.length === 0 ? (
                      <p className="text-centre text-muted-foreground py-4">
                        No updates yet. Add the first update below.
                      </p>
                    ) : (
                      <div className="space-y-3 py-2">
                        {goal.updates.map((update) => (
                          <div key={update.id} className="border-l-2 border-primary pl-4 py-1">
                            <div className="flex items-centre text-sm text-muted-foreground mb-1">
                              {getRoleIcon(update.updatedByRole)}
                              <span>{getRoleName(update.updatedByRole)}</span>
                              <span className="mx-1">•</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatDate(update.createdAt)}</span>
                              {update.newProgress !== undefined && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span>{update.newProgress}%</span>
                                </>
                              )}
                            </div>
                            <p>{update.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="home">
                    <ul className="list-disc pl-5 space-y-1 py-2">
                      {goal.homeActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </TabsContent>
                  
                  <TabsContent value="school">
                    <ul className="list-disc pl-5 space-y-1 py-2">
                      {goal.schoolActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-centre">
                  {goal.status === 'completed' ? (
                    <Badge variant="outline" className="border-green-500 text-green-500 flex items-centre">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  ) : goal.status === 'in_progress' ? (
                    <Badge variant="outline" className="border-blue-500 text-blue-500">
                      In Progress
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Started</Badge>
                  )}
                </div>
                
                <Dialog open={selectedGoal?.id === goal.id} onOpenChange={(open) => {
                  if (!open) setSelectedGoal(null);
                  else setSelectedGoal(goal);
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setSelectedGoal(goal)}>
                      Add Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Update to Goal</DialogTitle>
                      <DialogDescription>
                        Share progress, observations, or next steps for this goal.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div>
                        <label htmlFor="updateContent" className="block font-medium mb-2">
                          Update
                        </label>
                        <Textarea
                          id="updateContent"
                          placeholder="Share your observations, progress, or next steps..."
                          value={updateContent}
                          onChange={(e) => setUpdateContent(e.target.value)}
                          className="min-h-[100px]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newProgress" className="block font-medium mb-2">
                          Update Progress (Optional)
                        </label>
                        <div className="flex items-centre gap-4">
                          <Input
                            id="newProgress"
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={newProgress !== null ? newProgress : goal.progress}
                            onChange={(e) => setNewProgress(parseInt(e.target.value))}
                            className="flex-1"
                          />
                          <span className="w-12 text-centre">
                            {newProgress !== null ? newProgress : goal.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSelectedGoal(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddUpdate} disabled={!updateContent}>
                        Add Update
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedGoalTracker;
