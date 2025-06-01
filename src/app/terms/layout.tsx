import React from 'react';

export const metadata = {
  title: 'Terms of Service | EdPsych Connect',
  description: 'Read the Terms of Service for EdPsych Connect, outlining the rules and guidelines for using our educational platform.',
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {children}
    </section>
  );
}
