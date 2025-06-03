import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
