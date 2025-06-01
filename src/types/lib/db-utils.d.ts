declare module '@/lib/db-utils' {
  export enum DatabaseErrorType {
    NOT_FOUND = 'NOT_FOUND',
    DUPLICATE = 'DUPLICATE',
    VALIDATION = 'VALIDATION',
    PERMISSION = 'PERMISSION',
    CONNECTION = 'CONNECTION',
    UNKNOWN = 'UNKNOWN'
  }

  export class DatabaseError extends Error {
    type: DatabaseErrorType;
    details?: any;
    constructor(message: string, type: DatabaseErrorType, details?: any);
  }

  export function safeDbOperation<T>(operation: () => Promise<T>): Promise<T>;
  
  export interface PaginationParams {
    page?: number;
    pageSize?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }

  export interface SearchParams {
    query?: string;
    fields?: string[];
    filters?: Record<string, any>;
  }

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

  export function getPaginatedResults<T>(
    model: string,
    paginationParams?: PaginationParams,
    searchParams?: SearchParams
  ): Promise<PaginatedResult<T>>;

  export interface BulkOperationResult {
    success: number;
    failed: number;
    errors: any[];
  }

  export function bulkCreate(model: string, data: any[], validator?: (item: any) => any): Promise<BulkOperationResult>;
  export function bulkUpdate(model: string, data: { id: string; data: any }[], validator?: (item: any) => any): Promise<BulkOperationResult>;
  export function bulkDelete(model: string, ids: string[]): Promise<BulkOperationResult>;
  export function getStudentLearningProfile(studentId: string): Promise<any>;
}
