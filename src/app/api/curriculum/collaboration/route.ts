import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/prisma';

// Define interfaces for type safety
interface CollaboratorRole {
  role: 'editor' | 'viewer';
}

interface CollaborationAction {
  action: 'add_collaborator' | 'remove_collaborator' | 'add_comment' | 'delete_comment' | 'add_task' | 'update_task' | 'delete_task';
  planId: string;
  userId?: string;
  role?: 'editor' | 'viewer';
  email?: string;
  content?: string;
  taskId?: string;
  status?: string;
  dueDate?: string;
  title?: string;
  description?: string;
  assignedToId?: string;
}

// This API route handles collaboration features for curriculum planning
// It enables teacher-TA collaboration with role-based permissions

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to access collaboration data' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const planId = searchParams.get('planId');
    
    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Check if user has access to this plan
    const userAccess = await prisma.curriculumPlanCollaborator.findFirst({
      where: {
        OR: [
          { userId: session.user.id, planId },
          {
            plan: {
              user: {
                id: session.user.id
              },
              id: planId
            }
          }
        ]
      },
    });

    if (!userAccess && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have access to this curriculum plan' },
        { status: 403 }
      );
    }

    // Get collaborators for the plan
    const collaborators = await prisma.curriculumPlanCollaborator.findMany({
      where: { planId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });

    // Get comments for the plan
    const comments = await prisma.curriculumPlanComment.findMany({
      where: { planId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Get tasks for the plan
    const tasks = await prisma.curriculumPlanTask.findMany({
      where: { planId },
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Get plan details including author
    const plan = await prisma.curriculumPlan.findUnique({
      where: { id: planId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Curriculum plan not found' },
        { status: 404 }
      );
    }

    // Determine user's role in this plan
    let userRole = 'viewer';
    if (plan.userId === session.user.id) {
      userRole = 'owner';
    } else {
      const collaborator = collaborators.find(c => c.user.id === session.user.id);
      if (collaborator) {
        userRole = collaborator.role;
      }
    }

    return NextResponse.json({
      plan,
      collaborators,
      comments,
      tasks,
      userRole,
    });
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error fetching collaboration data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collaboration data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to manage collaborators' },
        { status: 401 }
      );
    }

    const body = await req.json() as CollaborationAction;
    const { action, planId, userId, role, email, content, taskId, status, dueDate, title, description, assignedToId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Check if user is the plan owner or has editor rights
    const plan = await prisma.curriculumPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Curriculum plan not found' },
        { status: 404 }
      );
    }

    const isOwner = plan.userId === session.user.id;
    
    if (!isOwner && session.user.role !== 'ADMIN') {
      const userAccess = await prisma.curriculumPlanCollaborator.findFirst({
        where: {
          userId: session.user.id,
          planId,
          role: 'editor',
        },
      });

      if (!userAccess) {
        return NextResponse.json(
          { error: 'You do not have permission to manage this curriculum plan' },
          { status: 403 }
        );
      }
    }

    // Handle different collaboration actions
    switch (action) {
      case 'add_collaborator': {
        if (!email && !userId) {
          return NextResponse.json(
            { error: 'Email or user ID is required' },
            { status: 400 }
          );
        }

        if (!role || !['editor', 'viewer'].includes(role)) {
          return NextResponse.json(
            { error: 'Valid role is required (editor or viewer)' },
            { status: 400 }
          );
        }

        let targetUser;
        
        if (userId) {
          targetUser = await prisma.user.findUnique({
            where: { id: userId },
          });
        } else if (email) {
          targetUser = await prisma.user.findUnique({
            where: { email },
          });
        }

        if (!targetUser) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Check if already a collaborator
        const existingCollaborator = await prisma.curriculumPlanCollaborator.findFirst({
          where: {
            userId: targetUser.id,
            planId,
          },
        });

        if (existingCollaborator) {
          // Update role if different
          if (existingCollaborator.role !== role) {
            const updatedCollaborator = await prisma.curriculumPlanCollaborator.update({
              where: { id: existingCollaborator.id },
              data: { role },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            });
            return NextResponse.json({ collaborator: updatedCollaborator, updated: true });
          }
          return NextResponse.json(
            { error: 'User is already a collaborator', collaborator: existingCollaborator },
            { status: 409 }
          );
        }

        // Add new collaborator
        const collaborator = await prisma.curriculumPlanCollaborator.create({
          data: {
            role,
            plan: {
              connect: { id: planId },
            },
            user: {
              connect: { id: targetUser.id },
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        });

        return NextResponse.json({ collaborator }, { status: 201 });
      }

      case 'remove_collaborator': {
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          );
        }

        const collaborator = await prisma.curriculumPlanCollaborator.findFirst({
          where: {
            userId,
            planId,
          },
        });

        if (!collaborator) {
          return NextResponse.json(
            { error: 'Collaborator not found' },
            { status: 404 }
          );
        }

        await prisma.curriculumPlanCollaborator.delete({
          where: { id: collaborator.id },
        });

        return NextResponse.json({ success: true });
      }

      case 'add_comment': {
        if (!content) {
          return NextResponse.json(
            { error: 'Comment content is required' },
            { status: 400 }
          );
        }

        const comment = await prisma.curriculumPlanComment.create({
          data: {
            content,
            plan: {
              connect: { id: planId },
            },
            user: {
              connect: { id: session.user.id },
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

        return NextResponse.json({ comment }, { status: 201 });
      }

      case 'delete_comment': {
        if (!taskId) {
          return NextResponse.json(
            { error: 'Comment ID is required' },
            { status: 400 }
          );
        }

        const comment = await prisma.curriculumPlanComment.findUnique({
          where: { id: taskId },
        });

        if (!comment) {
          return NextResponse.json(
            { error: 'Comment not found' },
            { status: 404 }
          );
        }

        // Only comment author or plan owner can delete
        if (comment.userId !== session.user.id && plan.userId !== session.user.id && session.user.role !== 'ADMIN') {
          return NextResponse.json(
            { error: 'You do not have permission to delete this comment' },
            { status: 403 }
          );
        }

        await prisma.curriculumPlanComment.delete({
          where: { id: taskId },
        });

        return NextResponse.json({ success: true });
      }

      case 'add_task': {
        if (!title || !description) {
          return NextResponse.json(
            { error: 'Task title and description are required' },
            { status: 400 }
          );
        }

        const task = await prisma.curriculumPlanTask.create({
          data: {
            title,
            description,
            status: status || 'pending',
            dueDate: dueDate ? new Date(dueDate) : null,
            plan: {
              connect: { id: planId },
            },
            createdBy: {
              connect: { id: session.user.id },
            },
            ...(assignedToId && {
              assignedTo: {
                connect: { id: assignedToId },
              },
            }),
          },
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return NextResponse.json({ task }, { status: 201 });
      }

      case 'update_task': {
        if (!taskId) {
          return NextResponse.json(
            { error: 'Task ID is required' },
            { status: 400 }
          );
        }

        const task = await prisma.curriculumPlanTask.findUnique({
          where: { id: taskId },
        });

        if (!task) {
          return NextResponse.json(
            { error: 'Task not found' },
            { status: 404 }
          );
        }

        const updatedTask = await prisma.curriculumPlanTask.update({
          where: { id: taskId },
          data: {
            ...(title && { title }),
            ...(description && { description }),
            ...(status && { status }),
            ...(dueDate && { dueDate: new Date(dueDate) }),
            ...(assignedToId && {
              assignedTo: {
                connect: { id: assignedToId },
              },
            }),
          },
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return NextResponse.json({ task: updatedTask });
      }

      case 'delete_task': {
        if (!taskId) {
          return NextResponse.json(
            { error: 'Task ID is required' },
            { status: 400 }
          );
        }

        const task = await prisma.curriculumPlanTask.findUnique({
          where: { id: taskId },
        });

        if (!task) {
          return NextResponse.json(
            { error: 'Task not found' },
            { status: 404 }
          );
        }

        // Only task creator, assignee, or plan owner can delete
        if (
          task.creatorId !== session.user.id &&
          task.assignedToId !== session.user.id &&
          plan.userId !== session.user.id &&
          session.user.role !== 'ADMIN'
        ) {
          return NextResponse.json(
            { error: 'You do not have permission to delete this task' },
            { status: 403 }
          );
        }

        await prisma.curriculumPlanTask.delete({
          where: { id: taskId },
        });

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error managing collaboration:', error);
    return NextResponse.json(
      { error: 'Failed to manage collaboration' },
      { status: 500 }
    );
  }
}
