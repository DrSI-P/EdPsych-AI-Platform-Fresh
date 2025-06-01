import { db } from './db';

// Check if a model exists on the Prisma client
function modelExists(modelName: string): boolean {
  return !!(db as any)[modelName];
}

// Mock data provider for development
export const dbWrapper = {
  // Generic function to safely access a model
  async safeModelAccess<T>(
    modelName: string,
    operation: string,
    mockData: T,
    callback: () => Promise<T>
  ): Promise<T> {
    // In development, if the model doesn't exist, return mock data
    if (process.env.NODE_ENV !== 'production' && !modelExists(modelName)) {
      console.log(`Development mode: Model ${modelName} not found, returning mock data for ${operation}`);
      return mockData;
    }
    
    try {
      return await callback();
    } catch (error) {
      // If we're in development and get a database error, return mock data
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Database error in ${operation}:`, error);
        console.log(`Development mode: Returning mock data for ${operation}`);
        return mockData;
      }
      throw error;
    }
  },

  // Curriculum Content operations
  curriculumContent: {
    findUnique: async (args: any) => {
      const contentId = args.where?.id || 'mock-id';
      return dbWrapper.safeModelAccess(
        'curriculumContent',
        'findUnique',
        {
          id: contentId,
          metadata: {
            id: contentId,
            title: 'Mock Content',
            description: 'This is mock content for development',
            keyStage: 'ks2',
            subject: 'Mathematics',
            topics: ['Mock Topic'],
            learningObjectives: ['Mock Objective'],
            keywords: ['mock'],
            difficultyLevel: 'core',
            contentType: 'explanation',
            contentFormat: 'text',
            estimatedDuration: 30,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system',
            updatedBy: 'system',
            version: 1,
            status: 'draft',
            region: 'england'
          },
          variants: [],
          feedback: [],
          analytics: null,
          defaultVariantId: null
        },
        async () => {
          return await (db as any).curriculumContent.findUnique(args);
        }
      );
    },
    
    update: async (args: any) => {
      const contentId = args.where?.id || 'mock-id';
      return dbWrapper.safeModelAccess(
        'curriculumContent',
        'update',
        {
          id: contentId,
          metadata: {
            ...args.data.metadata,
            id: contentId
          },
          variants: [],
          defaultVariantId: args.data.defaultVariantId || null
        },
        async () => {
          return await (db as any).curriculumContent.update(args);
        }
      );
    },
    
    create: async (args: any) => {
      return dbWrapper.safeModelAccess(
        'curriculumContent',
        'create',
        {
          id: 'new-mock-id',
          ...args.data,
          variants: []
        },
        async () => {
          return await (db as any).curriculumContent.create(args);
        }
      );
    },
    
    count: async (args: any) => {
      return dbWrapper.safeModelAccess(
        'curriculumContent',
        'count',
        0,
        async () => {
          return await (db as any).curriculumContent.count(args);
        }
      );
    },
    
    findMany: async (args: any) => {
      return dbWrapper.safeModelAccess(
        'curriculumContent',
        'findMany',
        [],
        async () => {
          return await (db as any).curriculumContent.findMany(args);
        }
      );
    }
  },
  
  // Content Variant operations
  contentVariant: {
    update: async (args: any) => {
      const variantId = args.where?.id || 'mock-variant-id';
      return dbWrapper.safeModelAccess(
        'contentVariant',
        'update',
        {
          id: variantId,
          ...args.data,
          contentId: args.data.contentId || 'mock-content-id'
        },
        async () => {
          return await (db as any).contentVariant.update(args);
        }
      );
    },
    
    create: async (args: any) => {
      return dbWrapper.safeModelAccess(
        'contentVariant',
        'create',
        {
          id: 'new-mock-variant-id',
          ...args.data
        },
        async () => {
          return await (db as any).contentVariant.create(args);
        }
      );
    },
    
    findMany: async (args: any) => {
      return dbWrapper.safeModelAccess(
        'contentVariant',
        'findMany',
        [],
        async () => {
          return await (db as any).contentVariant.findMany(args);
        }
      );
    }
  },
  
  // Content Change Record operations
  contentChangeRecord: {
    create: async (args: any) => {
      return dbWrapper.safeModelAccess(
        'contentChangeRecord',
        'create',
        {
          id: 'new-mock-record-id',
          ...args.data
        },
        async () => {
          return await (db as any).contentChangeRecord.create(args);
        }
      );
    }
  }
};