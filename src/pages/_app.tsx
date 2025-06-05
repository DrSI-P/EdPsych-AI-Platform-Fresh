import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/enhanced-theme-provider';
import { TenantProvider } from '@/lib/enhanced-tenant-context';
import { PrismaProvider } from '@/lib/prisma-provider';
import { DebugModeIndicator, TenantErrorFallback } from '@/lib/enhanced-tenant-context';
import { Analytics } from '@/components/analytics';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';

// Enhanced error fallback component for global error handling
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  // Log the error to console for debugging
  console.error('Application error:', error);
  
  return (
    <div role="alert" className="error-boundary-fallback" style={{
      padding: '20px',
      margin: '20px',
      border: '1px solid #f56565',
      borderRadius: '5px',
      backgroundColor: '#fff5f5',
      color: '#c53030'
    }}>
      <h2 style={{ marginBottom: '10px' }}>Something went wrong</h2>
      <div style={{
        backgroundColor: '#edf2f7',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        overflowX: 'auto'
      }}>
        <p><strong>Error:</strong> {error.message}</p>
        {error.stack && (
          <details>
            <summary style={{ cursor: 'pointer', marginTop: '10px' }}>View technical details</summary>
            <pre style={{ marginTop: '10px', fontSize: '12px' }}>{error.stack}</pre>
          </details>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={resetErrorBoundary}
          style={{
            backgroundColor: '#4299e1',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            backgroundColor: '#48bb78',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Go to homepage
        </a>
      </div>
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
