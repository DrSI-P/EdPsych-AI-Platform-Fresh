import { authOptions } from '@/lib/auth/auth-options';
import NextAuth from 'next-auth/next';

// This is the recommended way to set up NextAuth.js in Next.js 13+ App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };