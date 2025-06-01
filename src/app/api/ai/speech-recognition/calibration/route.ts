import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    const { userId, calibrationData } = data;
    
    // Verify the user has permission to save this data
    if (session.user.id !== userId && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Save calibration data to the database
    const speechCalibration = await prisma.speechCalibration.create({
      data: {
        userId,
        calibrationData: JSON.stringify(calibrationData),
        createdAt: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      calibrationId: speechCalibration.id
    });
    
  } catch (error) {
    console.error('Error saving speech calibration data:', error);
    return NextResponse.json({ error: 'Failed to save calibration data' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || session.user.id;
    
    // Verify the user has permission to access this data
    if (session.user.id !== userId && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Get the latest calibration data for the user
    const latestCalibration = await prisma.speechCalibration.findFirst({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (!latestCalibration) {
      return NextResponse.json({
        success: true,
        hasCalibration: false,
        message: 'No calibration data found for this user'
      });
    }
    
    return NextResponse.json({
      success: true,
      hasCalibration: true,
      calibrationData: JSON.parse(latestCalibration.calibrationData),
      calibrationId: latestCalibration.id,
      createdAt: latestCalibration.createdAt
    });
    
  } catch (error) {
    console.error('Error retrieving speech calibration data:', error);
    return NextResponse.json({ error: 'Failed to retrieve calibration data' }, { status: 500 });
  }
}
