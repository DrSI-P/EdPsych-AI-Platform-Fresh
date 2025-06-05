import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/enhanced-theme-provider';
import { TenantProvider } from '@/lib/enhanced-tenant-context';
import { PrismaProvider } from '@/lib/prisma-provider';
import { DebugModeIndicator, TenantErrorFallback } from '@/lib/enhanced-tenant-context';
import { Analytics } from '@/components/analytics';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';

// Error fallback component for global error handling
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert" className="error-boundary-fallback">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary} className="btn-primary">
        Try again
      </button>
    </div>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SessionProvider session={session}>
        <PrismaProvider>
          <TenantProvider>
            <ThemeProvider>
              <TenantErrorFallback>
                <DebugModeIndicator />
                <Analytics />
                <Component {...pageProps} />
              </TenantErrorFallback>
            </ThemeProvider>
          </TenantProvider>
        </PrismaProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
