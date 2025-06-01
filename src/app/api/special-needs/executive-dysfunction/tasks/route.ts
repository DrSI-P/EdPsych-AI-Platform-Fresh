import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';
import { getAIService } from '@/lib/ai/ai-service';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || session.user.id;
    
    // Check if the user has permission to access this data
    if (userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user's tasks
    const tasks = await (prisma as any).executiveFunctionTask.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      tasks: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate || '',
        priority: task.priority,
        status: task.status,
        steps: (task as any).steps || [],
        timeEstimate: (task as any).timeEstimate || 0,
        visualReminder: (task as any).visualReminder || '',
        tags: (task as any).tags || [],
        isExpanded: false
      }))
    });
    
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    const { userId, tasks } = data;
    
    // Check if the user has permission to modify this data
    if (userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete existing tasks for this user
    await (prisma as any).executiveFunctionTask.deleteMany({
      where: {
        userId: userId
      }
    });
    
    // Create new tasks
    const createdTasks = await Promise.all(
      tasks.map(async (task) => {
        return (prisma as any).executiveFunctionTask.create({
          data: {
            id: task.id,
            userId: userId,
            title: task.title,
            description: task.description || '',
            dueDate: task.dueDate || null,
            priority: task.priority,
            status: task.status,
            steps: task.steps,
            timeEstimate: task.timeEstimate,
            visualReminder: task.visualReminder || '',
            tags: task.tags || []
          }
        });
      })
    );
    
    return NextResponse.json({
      success: true,
      tasks: createdTasks
    });
    
  } catch (error) {
    console.error('Error saving tasks:', error);
    return NextResponse.json({ error: 'Failed to save tasks' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    const { taskId, updates } = data;
    
    // Get the task to check ownership
    const task = await (prisma as any).executiveFunctionTask.findUnique({
      where: {
        id: taskId
      }
    });
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Check if the user has permission to modify this task
    if (task.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Update the task
    const updatedTask = await (prisma as any).executiveFunctionTask.update({
      where: {
        id: taskId
      },
      data: updates
    });
    
    return NextResponse.json({
      success: true,
      task: updatedTask
    });
    
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');
    
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }
    
    // Get the task to check ownership
    const task = await (prisma as any).executiveFunctionTask.findUnique({
      where: {
        id: taskId
      }
    });
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Check if the user has permission to delete this task
    if (task.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete the task
    await (prisma as any).executiveFunctionTask.delete({
      where: {
        id: taskId
      }
    });
    
    return NextResponse.json({
      success: true
    });
    
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
