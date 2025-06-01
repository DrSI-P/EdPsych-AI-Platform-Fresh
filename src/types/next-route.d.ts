import { NextRequest } from 'next/server';

// Define custom type for route parameters to fix Next.js type generation issues
declare module 'next/dist/server/future/route-modules/app-route/module' {
  interface RouteParams {
    params: Record<string, string>;
  }

  interface RouteContext {
    params: RouteParams['params'];
  }

  interface AppRouteHandlerFnContext {
    params: RouteParams['params'];
  }
}
