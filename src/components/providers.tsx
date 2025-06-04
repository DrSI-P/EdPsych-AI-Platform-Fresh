'use client';

import { SessionProvider } from 'next-auth/react';
import { EnhancedThemeProvider } from '@/components/enhanced-theme-provider';
import { TenantProvider } from '@/lib/tenant-context';
import { SupabaseProvider } from '@/lib/supabase-provider';
import { AvatarProvider } from '@/components/avatar/AvatarProvider';
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
            <AvatarProvider>
              <Analytics />
              {children}
            </AvatarProvider>
          </EnhancedThemeProvider>
        </TenantProvider>
      </SupabaseProvider>
    </SessionProvider>
  );
}

