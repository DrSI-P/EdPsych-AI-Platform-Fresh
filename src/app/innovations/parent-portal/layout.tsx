import React from 'react';

export const metadata = {
  title: 'Parent Portal | EdPsych Connect',
  description: 'Stay connected with your child\'s educational journey through our comprehensive parent engagement system.',
};

export default function ParentPortalLayout({
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
