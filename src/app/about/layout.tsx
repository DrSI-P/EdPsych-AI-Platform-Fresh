import React from 'react';

export const metadata = {
  title: 'About Us | EdPsych Connect',
  description: 'Learn about EdPsych Connect, our mission, vision, and the team behind our educational psychology platform.',
};

export default function AboutLayout({
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
