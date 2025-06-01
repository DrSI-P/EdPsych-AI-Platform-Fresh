'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Users, Calendar, CheckCircle } from 'lucide-react';
import { getUserGroupProjects } from '@/lib/collaborative-learning/api';
import { GroupProject, ProjectStatus, ProjectRole } from '@/lib/collaborative-learning/types';
import { CreateProjectDialog } from './create-project-dialog';
import { ProjectTaskList } from './project-task-list';
import { ProjectMilestoneTimeline } from './project-milestone-timeline';

/**
 * Group Projects Dashboard Component
 * 
 * Displays a user's group projects, tasks, and milestones,
 * and provides tools to create new projects and manage existing ones.
 */
export function GroupProjectsDashboard() {
  const [projects, setProjects] = useState<GroupProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  // Mock user ID - in a real implementation, this would come from authentication
  const userId = 'current-user-id';
  
  // Fetch user's group projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getUserGroupProjects(userId);
        setProjects(data);
        setError(null);
      } catch (err) {
        setError('Failed to load group projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [userId]);
  
  // Handle creating a new project
  const handleCreateProject = (newProject: GroupProject) => {
    setProjects([...projects, newProject]);
    setShowCreateDialog(false);
  };
  
  // Filter projects by status
  const activeProjects = projects.filter(p => 
    p.status === ProjectStatus.PLANNING || p.status === ProjectStatus.IN_PROGRESS
  );
  
  const completedProjects = projects.filter(p => 
    p.status === ProjectStatus.COMPLETED
  );
  
  // Filter projects by role
  const leadProjects = projects.filter(p => 
    p.members.some(m => m.userId === userId && m.role === ProjectRole.LEADER)
  );
  
  return (
    <div className="space-y-8">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Group Projects</h2>
          <p className="text-muted-foreground">Collaborate with peers on curriculum-aligned projects</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading group projects...</p>
        </div>
      )}
      
      {/* Main content */}
      {!loading && (
        <>
          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Your Projects
              </CardTitle>
              <CardDescription>
                Group projects you're participating in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="active">Active Projects</TabsTrigger>
                  <TabsTrigger value="lead">Projects You Lead</TabsTrigger>
                  <TabsTrigger value="completed">Completed Projects</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active">
                  {activeProjects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>You don't have any active projects</p>
                      <Button 
                        variant="link" 
                        onClick={() => setShowCreateDialog(true)}
                      >
                        Create a project
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeProjects.map(project => (
                        <ProjectCard 
                          key={project.id} 
                          project={project} 
                          currentUserId={userId} 
                          onSelect={() => setSelectedProject(project.id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="lead">
                  {leadProjects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>You're not leading any projects</p>
                      <Button 
                        variant="link" 
                        onClick={() => setShowCreateDialog(true)}
                      >
                        Create a project to lead
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {leadProjects.map(project => (
                        <ProjectCard 
                          key={project.id} 
                          project={project} 
                          currentUserId={userId} 
                          onSelect={() => setSelectedProject(project.id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed">
                  {completedProjects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>You don't have any completed projects</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {completedProjects.map(project => (
                        <ProjectCard 
                          key={project.id} 
                          project={project} 
                          currentUserId={userId} 
                          onSelect={() => setSelectedProject(project.id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Selected Project Details */}
          {selectedProject && (
            <ProjectDetails 
              projectId={selectedProject} 
              projects={projects}
              currentUserId={userId}
            />
          )}
          
          {/* Project Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Project Resources
              </CardTitle>
              <CardDescription>
                Resources to help with group projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Project Planning Guide</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Step-by-step guide to planning effective group projects
                    </p>
                    <Badge>Planning</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Team Collaboration Tips</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Strategies for effective teamwork and communication
                    </p>
                    <Badge>Teamwork</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Project Presentation Templates</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Templates for creating impressive project presentations
                    </p>
                    <Badge>Presentation</Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="ml-auto">
                View all resources
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
      
      {/* Dialogs */}
      {showCreateDialog && (
        <CreateProjectDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreateProject={handleCreateProject}
          userId={userId}
        />
      )}
    </div>
  );
}

/**
 * Project Card Component
 * 
 * Displays information about a group project
 */
function ProjectCard({ project, currentUserId, onSelect }) {
  const userMember = project.members.find(m => m.userId === currentUserId);
  const userRole = userMember?.role || 'Unknown';
  
  // Calculate progress
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Format dates
  const startDate = new Date(project.startDate).toLocaleDateString();
  const endDate = new Date(project.endDate).toLocaleDateString();
  
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${getStatusColor(project.status)}`}></div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold">{project.title}</h3>
            <p className="text-sm text-muted-foreground">{project.subject} - {project.keyStage}</p>
          </div>
          <Badge>{project.status.replace('-', ' ')}</Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Your Role:</span>
            <span className="font-medium capitalize">{userRole}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Team Size:</span>
            <span className="font-medium">{project.members.length} members</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Timeline:</span>
            <span className="font-medium">{startDate} - {endDate}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress:</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <Button onClick={onSelect} className="w-full">
          View Project Details
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Project Details Component
 * 
 * Displays detailed information about a selected project
 */
function ProjectDetails({ projectId, projects, currentUserId }) {
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.subject} - {project.keyStage}</CardDescription>
          </div>
          <Badge>{project.status.replace('-', ' ')}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Curriculum Objectives</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {project.curriculumObjectives.map((objective, index) => (
                    <li key={index} className="text-muted-foreground">{objective}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Criteria</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {project.assessmentCriteria.map((criterion, index) => (
                    <li key={index} className="text-muted-foreground">{criterion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <ProjectTaskList 
              tasks={project.tasks} 
              projectId={project.id}
              currentUserId={currentUserId}
            />
          </TabsContent>
          
          <TabsContent value="milestones">
            <ProjectMilestoneTimeline 
              milestones={project.milestones}
              projectId={project.id}
            />
          </TabsContent>
          
          <TabsContent value="team">
            <div className="space-y-4">
              {project.members.map(member => {
                // In a real implementation, we would fetch user details
                const memberName = member.userId === currentUserId ? 'You' : `Team Member ${member.userId.slice(0, 4)}`;
                const memberInitials = member.userId === currentUserId ? 'YO' : `T${member.userId.slice(0, 1)}`;
                
                return (
                  <div key={member.id} className="flex items-center gap-4 p-4 border rounded-md">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/avatars/${member.userId}.png`} alt={memberName} />
                      <AvatarFallback>{memberInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{memberName}</div>
                      <div className="text-sm text-muted-foreground capitalize">{member.role}</div>
                    </div>
                    {member.contributionScore !== undefined && (
                      <div className="ml-auto flex items-center">
                        <span className="text-sm font-medium mr-2">Contribution:</span>
                        <Badge variant="outline">{member.contributionScore}%</Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button variant="outline" className="mr-2">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
        <Button>
          <CheckCircle className="mr-2 h-4 w-4" />
          Submit Deliverable
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Helper function to get color based on project status
 */
function getStatusColor(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.PLANNING:
      return 'bg-blue-500';
    case ProjectStatus.IN_PROGRESS:
      return 'bg-amber-500';
    case ProjectStatus.REVIEW:
      return 'bg-purple-500';
    case ProjectStatus.COMPLETED:
      return 'bg-green-500';
    case ProjectStatus.ARCHIVED:
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
}
