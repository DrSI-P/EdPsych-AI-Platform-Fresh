import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { FloatingAvatar } from '@/components/avatar/FloatingAvatar';
import { VoiceAccessibilityProvider, FloatingVoiceControls } from '@/components/accessibility';
import '@/styles/globals.css';
import '@/styles/mobile-fixes.css';

export const metadata: Metadata = {
  title: 'EdPsych Connect',
  description: 'Educational Psychology Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <VoiceAccessibilityProvider>
          <Providers>
            {children}
            <FloatingAvatar />
            <FloatingVoiceControls />
          </Providers>
        </VoiceAccessibilityProvider>
      </body>
    </html>
  );
}
