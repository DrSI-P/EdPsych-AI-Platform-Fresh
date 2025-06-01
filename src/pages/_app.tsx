import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/enhanced-theme-provider';
import { TenantProvider } from '@/lib/enhanced-tenant-context';
import { SupabaseProvider } from '@/lib/supabase-provider';
import { DebugModeIndicator, TenantErrorFallback } from '@/lib/enhanced-tenant-context';
import { Analytics } from '@/components/analytics';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <SupabaseProvider>
        <TenantProvider>
          <ThemeProvider>
            <TenantErrorFallback>
              <DebugModeIndicator />
              <Analytics />
              <Component {...pageProps} />
            </TenantErrorFallback>
          </ThemeProvider>
        </TenantProvider>
      </SupabaseProvider>
    </SessionProvider>
  );
}
