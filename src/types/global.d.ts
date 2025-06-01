// Global type declarations to help TypeScript recognize module paths

declare module '@/lib/auth/auth-options' {
  import { NextAuthOptions } from 'next-auth';
  const authOptions: NextAuthOptions;
  export { authOptions };
}

declare module '@/lib/db/prisma' {
  import { PrismaClient } from '@prisma/client';
  const prisma: PrismaClient;
  export default prisma;
}

declare module '@/lib/ai/ai-service' {
  export const aiService: {
    evaluateOpenEndedAnswer: (params: {
      question: string;
      expectedAnswer: string;
      studentAnswer: string;
      maxScore: number;
    }) => Promise<{
      score: number;
      feedback: string;
    }>;
    // Add other methods as needed
  };
}
