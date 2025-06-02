'use client';

import { SessionProvider } from 'next-auth/react';
import { EnhancedThemeProvider } from '@/components/enhanced-theme-provider';
import { TenantProvider } from '@/lib/tenant-context';
import { SupabaseProvider } from '@/lib/supabase-provider';
import { Analytics } from '@/components/analytics';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SupabaseProvider>
        <TenantProvider>
          <EnhancedThemeProvider>
            <Analytics />
            {children}
          </EnhancedThemeProvider>
        </TenantProvider>
      </SupabaseProvider>
    </SessionProvider>
  );
}

