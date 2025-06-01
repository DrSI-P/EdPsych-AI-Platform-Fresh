import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/enhanced-theme-provider';
import { TenantProvider } from '@/lib/tenant-context';
import { SupabaseProvider } from '@/lib/supabase-provider';
import { Analytics } from '@/components/analytics';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <SupabaseProvider>
        <TenantProvider>
          <ThemeProvider>
            <Analytics />
            <Component {...pageProps} />
          </ThemeProvider>
        </TenantProvider>
      </SupabaseProvider>
    </SessionProvider>
  );
}
