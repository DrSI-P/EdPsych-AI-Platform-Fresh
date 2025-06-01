/**
 * API functions for the Collaborative Learning Tools
 * Handles interactions with backend services for peer learning, group projects, and forums
 */

import { 
  PeerLearningPartnership, 
  PeerLearningSession, 
  PeerFeedback,
  StudentResource,
  GroupProject,
  ProjectTask,
  ProjectMember,
  ForumTopic,
  ForumPost,
  ProjectStatus,
  TaskStatus,
  PeerLearningStatus
} from './types';

/**
 * Peer Learning API Functions
 */

// Get all peer learning partnerships for a user
export async function getUserPeerPartnerships(userId: string): Promise<PeerLearningPartnership[]> {
  try {
    const response = await fetch(`/api/collaborative-learning/peer-learning/partnerships?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch peer partnerships');
    return await response.json();
  } catch (error) {
    console.error('Error fetching peer partnerships:', error);
    return [];
  }
}

// Create a new peer learning partnership
export async function createPeerPartnership(partnership: Omit<PeerLearningPartnership, 'id' | 'createdAt' | 'updatedAt' | 'sessions' | 'feedback'>): Promise<PeerLearningPartnership> {
  try {
    const response = await fetch('/api/collaborative-learning/peer-learning/partnerships', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partnership),
    });
    
    if (!response.ok) throw new Error('Failed to create peer partnership');
    return await response.json();
  } catch (error) {
    console.error('Error creating peer partnership:', error);
    throw error;
  }
}

// Update a peer learning partnership
export async function updatePeerPartnership(id: string, updates: Partial<PeerLearningPartnership>): Promise<PeerLearningPartnership> {
  try {
    const response = await fetch(`/api/collaborative-learning/peer-learning/partnerships/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) throw new Error('Failed to update peer partnership');
    return await response.json();
  } catch (error) {
    console.error('Error updating peer partnership:', error);
    throw error;
  }
}

// Schedule a peer learning session
export async function schedulePeerSession(session: Omit<PeerLearningSession, 'id' | 'actualStart' | 'actualEnd' | 'status'>): Promise<PeerLearningSession> {
  try {
    const response = await fetch('/api/collaborative-learning/peer-learning/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...session,
        status: 'scheduled'
      }),
    });
    
    if (!response.ok) throw new Error('Failed to schedule peer session');
    return await response.json();
  } catch (error) {
    console.error('Error scheduling peer session:', error);
    throw error;
  }
}

// Submit feedback for a peer learning partnership or session
export async function submitPeerFeedback(feedback: Omit<PeerFeedback, 'id' | 'createdAt'>): Promise<PeerFeedback> {
  try {
    const response = await fetch('/api/collaborative-learning/peer-learning/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });
    
    if (!response.ok) throw new Error('Failed to submit peer feedback');
    return await response.json();
  } catch (error) {
    console.error('Error submitting peer feedback:', error);
    throw error;
  }
}

// Create a student resource
export async function createStudentResource(resource: Omit<StudentResource, 'id' | 'createdAt' | 'updatedAt' | 'reviews' | 'averageRating' | 'approved' | 'approvedBy' | 'approvedAt'>): Promise<StudentResource> {
  try {
    const response = await fetch('/api/collaborative-learning/student-resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resource),
    });
    
    if (!response.ok) throw new Error('Failed to create student resource');
    return await response.json();
  } catch (error) {
    console.error('Error creating student resource:', error);
    throw error;
  }
}

// Get student resources by filters
export async function getStudentResources(filters: {
  subject?: string;
  keyStage?: string;
  approved?: boolean;
  creatorId?: string;
  tags?: string[];
}): Promise<StudentResource[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.subject) queryParams.append('subject', filters.subject);
    if (filters.keyStage) queryParams.append('keyStage', filters.keyStage);
    if (filters.approved !== undefined) queryParams.append('approved', filters.approved.toString());
    if (filters.creatorId) queryParams.append('creatorId', filters.creatorId);
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => queryParams.append('tags', tag));
    }
    
    const response = await fetch(`/api/collaborative-learning/student-resources?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch student resources');
    return await response.json();
  } catch (error) {
    console.error('Error fetching student resources:', error);
    return [];
  }
}

/**
 * Group Project API Functions
 */

// Create a new group project
export async function createGroupProject(project: Omit<GroupProject, 'id' | 'createdAt' | 'updatedAt' | 'members' | 'tasks' | 'resources' | 'discussions' | 'milestones'>): Promise<GroupProject> {
  try {
    const response = await fetch('/api/collaborative-learning/group-projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    
    if (!response.ok) throw new Error('Failed to create group project');
    return await response.json();
  } catch (error) {
    console.error('Error creating group project:', error);
    throw error;
  }
}

// Get group projects for a user
export async function getUserGroupProjects(userId: string): Promise<GroupProject[]> {
  try {
    const response = await fetch(`/api/collaborative-learning/group-projects?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch group projects');
    return await response.json();
  } catch (error) {
    console.error('Error fetching group projects:', error);
    return [];
  }
}

// Get a specific group project by ID
export async function getGroupProject(projectId: string): Promise<GroupProject> {
  try {
    const response = await fetch(`/api/collaborative-learning/group-projects/${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch group project');
    return await response.json();
  } catch (error) {
    console.error('Error fetching group project:', error);
    throw error;
  }
}

// Add a member to a group project
export async function addProjectMember(projectId: string, member: Omit<ProjectMember, 'id' | 'projectId' | 'joinedAt' | 'contributionScore'>): Promise<ProjectMember> {
  try {
    const response = await fetch(`/api/collaborative-learning/group-projects/${projectId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    });
    
    if (!response.ok) throw new Error('Failed to add project member');
    return await response.json();
  } catch (error) {
    console.error('Error adding project member:', error);
    throw error;
  }
}

// Create a task in a group project
export async function createProjectTask(projectId: string, task: Omit<ProjectTask, 'id' | 'projectId' | 'completedAt' | 'comments'>): Promise<ProjectTask> {
  try {
    const response = await fetch(`/api/collaborative-learning/group-projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    
    if (!response.ok) throw new Error('Failed to create project task');
    return await response.json();
  } catch (error) {
    console.error('Error creating project task:', error);
    throw error;
  }
}

// Update a task status
export async function updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<ProjectTask> {
  try {
    const response = await fetch(`/api/collaborative-learning/group-projects/${projectId}/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) throw new Error('Failed to update task status');
    return await response.json();
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
}

/**
 * Discussion Forum API Functions
 */

// Create a new forum topic
export async function createForumTopic(topic: Omit<ForumTopic, 'id' | 'createdAt' | 'updatedAt' | 'lastPostAt' | 'postCount' | 'viewCount' | 'isPinned' | 'isLocked'>): Promise<ForumTopic> {
  try {
    const response = await fetch('/api/collaborative-learning/forum/topics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(topic),
    });
    
    if (!response.ok) throw new Error('Failed to create forum topic');
    return await response.json();
  } catch (error) {
    console.error('Error creating forum topic:', error);
    throw error;
  }
}

// Get forum topics with optional filters
export async function getForumTopics(filters: {
  category?: string;
  subject?: string;
  keyStage?: string;
  tags?: string[];
  userId?: string;
}): Promise<ForumTopic[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.subject) queryParams.append('subject', filters.subject);
    if (filters.keyStage) queryParams.append('keyStage', filters.keyStage);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => queryParams.append('tags', tag));
    }
    
    const response = await fetch(`/api/collaborative-learning/forum/topics?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch forum topics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching forum topics:', error);
    return [];
  }
}

// Create a forum post (reply)
export async function createForumPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'isEdited' | 'reactions' | 'isAcceptedAnswer' | 'isHidden' | 'hiddenReason' | 'hiddenBy' | 'reports'>): Promise<ForumPost> {
  try {
    const response = await fetch('/api/collaborative-learning/forum/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    
    if (!response.ok) throw new Error('Failed to create forum post');
    return await response.json();
  } catch (error) {
    console.error('Error creating forum post:', error);
    throw error;
  }
}

// Get posts for a specific topic
export async function getTopicPosts(topicId: string): Promise<ForumPost[]> {
  try {
    const response = await fetch(`/api/collaborative-learning/forum/topics/${topicId}/posts`);
    if (!response.ok) throw new Error('Failed to fetch topic posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching topic posts:', error);
    return [];
  }
}

// Add a reaction to a post
export async function addPostReaction(postId: string, userId: string, reactionType: string): Promise<ForumPost> {
  try {
    const response = await fetch(`/api/collaborative-learning/forum/posts/${postId}/reactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type: reactionType,
      }),
    });
    
    if (!response.ok) throw new Error('Failed to add post reaction');
    return await response.json();
  } catch (error) {
    console.error('Error adding post reaction:', error);
    throw error;
  }
}

// Report a post
export async function reportPost(postId: string, report: {
  reportedBy: string;
  reason: string;
  details: string;
}): Promise<ForumPost> {
  try {
    const response = await fetch(`/api/collaborative-learning/forum/posts/${postId}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    });
    
    if (!response.ok) throw new Error('Failed to report post');
    return await response.json();
  } catch (error) {
    console.error('Error reporting post:', error);
    throw error;
  }
}

/**
 * Notification API Functions
 */

// Get user's collaboration notifications
export async function getUserCollaborationNotifications(userId: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/collaborative-learning/notifications?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<any> {
  try {
    const response = await fetch(`/api/collaborative-learning/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
    
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return await response.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}
