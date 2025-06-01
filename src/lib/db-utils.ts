import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { validateAndSanitizeUser, validateAndSanitizeProfile } from '@/lib/validation';

const prisma = new PrismaClient();

/**
 * EdPsych-AI-Education-Platform Database Utilities
 * Provides safe database operations with validation, error handling, and educational context awareness
 */

// Error types for better error handling
export enum DatabaseErrorType {
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE = 'DUPLICATE',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  CONNECTION = 'CONNECTION',
  UNKNOWN = 'UNKNOWN'
}

// Custom database error class
export class DatabaseError extends Error {
  type: DatabaseErrorType;
  details?: any;

  constructor(message: string, type: DatabaseErrorType, details?) {
    super(message);
    this.name = 'DatabaseError';
    this.type = type;
    this.details = details;
  }
}

/**
 * Safe database operation wrapper with error handling
 * @param operation Function that performs database operation
 * @returns Result of the operation
 */
export async function safeDbOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error('Database operation error:', error);
    
    // Determine error type based on Prisma error codes
    if (error.code === 'P2025') {
      throw new DatabaseError('Record not found', DatabaseErrorType.NOT_FOUND, error);
    } else if (error.code === 'P2002') {
      throw new DatabaseError('Duplicate record', DatabaseErrorType.DUPLICATE, error);
    } else if (error.code === 'P2000') {
      throw new DatabaseError('Validation error', DatabaseErrorType.VALIDATION, error);
    } else if (error.code?.startsWith('P1')) {
      throw new DatabaseError('Database connection error', DatabaseErrorType.CONNECTION, error);
    } else {
      throw new DatabaseError('Database operation failed', DatabaseErrorType.UNKNOWN, error);
    }
  }
}

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Search parameters interface
 */
export interface SearchParams {
  query?: string;
  fields?: string[];
  filters?: Record<string, any>;
}

/**
 * Paginated result interface
 */
export interface PaginatedResult<T> {
  data: any[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
    hasMore: boolean;
  };
}

/**
 * Generic function to get paginated results with search capabilities
 * @param model Prisma model name
 * @param paginationParams Pagination parameters
 * @param searchParams Search parameters
 * @returns Paginated results
 */
export async function getPaginatedResults<T>(
  model: string,
  paginationParams: PaginationParams = {},
  searchParams: SearchParams = {}
): Promise<PaginatedResult<T>> {
  const { page = 1, pageSize = 10, orderBy = 'createdAt', orderDirection = 'desc' } = paginationParams;
  const { query, fields = [], filters = {} } = searchParams;
  
  // Calculate skip value for pagination
  const skip = (page - 1) * pageSize;
  
  // Build where clause for search
  const where = { ...filters };
  
  // Add search query if provided
  if (query && fields.length > 0) {
    where.OR = fields.map(field => ({
      [field]: {
        contains: query,
        mode: 'insensitive'
      }
    }));
  }
  
  // Get total count
  const total = await safeDbOperation(() => 
    prisma[model].count({ where })
  );
  
  // Get paginated data
  const data = await safeDbOperation(() => 
    prisma[model].findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        [orderBy]: orderDirection
      }
    })
  );
  
  // Calculate pagination metadata
  const pageCount = Math.ceil(total / pageSize);
  const hasMore = page < pageCount;
  
  return {
    data: data as T[],
    pagination: {
      total,
      page,
      pageSize,
      pageCount,
      hasMore
    }
  };
}

/**
 * Bulk operation interface
 */
export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: any[];
}

/**
 * Perform bulk create operation with validation
 * @param model Prisma model name
 * @param data Array of data objects to create
 * @param validator Optional validation function
 * @returns Bulk operation result
 */
export async function bulkCreate(model: string, data: any[], validator?: (item: any) => any
): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  // Process each item
  for (const item of data) {
    try {
      // Validate if validator provided
      const validatedItem = validator ? validator(item) : item;
      
      // Create record
      await prisma[model].create({
        data: validatedItem
      });
      
      result.success++;
    } catch (error) {
      result.failed++;
      result.errors.push({
        item,
        error: error.message
      });
    }
  }
  
  return result;
}

/**
 * Perform bulk update operation with validation
 * @param model Prisma model name
 * @param data Array of data objects with id and update data
 * @param validator Optional validation function
 * @returns Bulk operation result
 */
export async function bulkUpdate(
  model: string,
  data: { id: string; data: any }[],
  validator?: (item: any) => any
): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  // Process each item
  for (const item of data) {
    try {
      // Validate if validator provided
      const validatedData = validator ? validator(item.data) : item.data;
      
      // Update record
      await prisma[model].update({
        where: { id: item.id },
        data: validatedData
      });
      
      result.success++;
    } catch (error) {
      result.failed++;
      result.errors.push({
        item,
        error: error.message
      });
    }
  }
  
  return result;
}

/**
 * Perform bulk delete operation
 * @param model Prisma model name
 * @param ids Array of record IDs to delete
 * @returns Bulk operation result
 */
export async function bulkDelete(model: string, ids: string[]): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  // Process each ID
  for (const id of ids) {
    try {
      // Delete record
      await prisma[model].delete({
        where: { id }
      });
      
      result.success++;
    } catch (error) {
      result.failed++;
      result.errors.push({
        id,
        error: error.message
      });
    }
  }
  
  return result;
}

/**
 * Educational data retrieval functions
 */

/**
 * Get student learning profile with all related data
 * @param studentId Student ID
 * @returns Complete student learning profile
 */
export async function getStudentLearningProfile(studentId: string) {
  return safeDbOperation(async () => {
    const student = await prisma.user.findUnique({
      where: { id: studentId, role: 'STUDENT' },
      include: {
        profile: {
          include: {
            learningPreferences: true,
            emotionalProfile: true
          }
        },
        assessmentResults: {
          include: {
            assessment: true,
            answers: true
          }
        }
      }
    });
    
    if (!student) {
      throw new DatabaseError('Student not found', DatabaseErrorType.NOT_FOUND);
    }
    
    // Get SEMH assessments
    const semhAssessments = await prisma.semhAssessment.findMany({
      where: { student: { id: studentId } },
      include: {
        areas: true,
        assessor: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    
    // Get biofeedback sessions
    const biofeedbackSessions = await prisma.biofeedbackSession.findMany({
      where: { student: { id: studentId } },
      include: {
        facilitator: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    
    // Get emotional pattern records
    const emotionalPatternRecords = await prisma.emotionalPatternRecord.findMany({
      where: { student: { id: studentId } },
      include: {
        patterns: true,
        recorder: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    
    // Get parent-teacher communications
    const communications = await prisma.parentTeacherCommunication.findMany({
      where: { student: { id: studentId } },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        teacher: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    
    // Remove sensitive data
    const { password, ...userWithoutPassword } = student;
    
    // Return complete profile
    return {
      ...userWithoutPassword,
      semhAssessments,
      biofeedbackSessions,
      emotionalPatternRecords,
      communications
    };
  });
}
