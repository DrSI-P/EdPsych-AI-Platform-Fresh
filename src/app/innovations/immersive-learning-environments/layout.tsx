import React from 'react';

export const metadata = {
  title: 'Immersive Learning Environments | EdPsych Connect',
  description: 'Experience multisensory, deeply engaging learning spaces that transport students to different worlds, time periods, and scales for unparalleled educational experiences.',
};

export default function ImmersiveLearningEnvironmentsLayout({
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
