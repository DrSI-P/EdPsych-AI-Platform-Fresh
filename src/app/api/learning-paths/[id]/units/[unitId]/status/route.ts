import { NextResponse } from 'next/server';
import { 
  TopicStatus,
  LearningPath
} from '@/lib/learning-path/types';

/**
 * API route handler for updating a unit's status
 * 
 * This endpoint updates the status and progress of a specific unit within a learning path.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; unitId: string } }
) {
  try {
    const { id: pathId, unitId } = params;
    const { status, progress } = await request.json();
    
    if (!pathId || !unitId) {
      return NextResponse.json(
        { error: 'Missing required parameters: pathId and unitId' },
        { status: 400 }
      );
    }
    
    if (status === undefined || progress === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: status and progress' },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would:
    // 1. Fetch the learning path from the database
    // 2. Update the specific unit's status and progress
    // 3. Recalculate the overall path progress
    // 4. Save the updated path to the database
    
    // For now, we'll create a mock response
    
    // Mock fetch the learning path
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/learning-paths/${pathId}`);
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch learning path' },
        { status: 500 }
      );
    }
    
    const learningPath: LearningPath = await response.json();
    
    // Update the unit
    const updatedUnits = learningPath.units.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          status: status as TopicStatus,
          progress,
          startedAt: status === TopicStatus.IN_PROGRESS && !unit.startedAt ? new Date() : unit.startedAt,
          completedAt: status === TopicStatus.COMPLETED ? new Date() : unit.completedAt
        };
      }
      return unit;
    });
    
    // Recalculate overall progress
    const completedUnits = updatedUnits.filter(
      unit => unit.status === TopicStatus.COMPLETED || unit.status === TopicStatus.MASTERED
    ).length;
    
    const inProgressUnits = updatedUnits.filter(
      unit => unit.status === TopicStatus.IN_PROGRESS
    );
    
    const inProgressContribution = inProgressUnits.reduce(
      (sum, unit) => sum + (unit.progress / 100) / updatedUnits.length,
      0
    );
    
    const overallProgress = Math.round(
      ((completedUnits / updatedUnits.length) + inProgressContribution) * 100
    );
    
    // Create updated path
    const updatedPath: LearningPath = {
      ...learningPath,
      units: updatedUnits,
      overallProgress,
      updatedAt: new Date()
    };
    
    return NextResponse.json(updatedPath);
  } catch (error) {
    console.error('Error updating unit status:', error);
    return NextResponse.json(
      { error: 'Failed to update unit status' },
      { status: 500 }
    );
  }
}
