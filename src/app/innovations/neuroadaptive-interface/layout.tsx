import React from 'react';

export const metadata = {
  title: 'Neuroadaptive Interface | EdPsych Connect',
  description: 'Experience our revolutionary neuroadaptive interface that adapts in real-time to your cognitive state, optimising learning and reducing cognitive fatigue.',
};

export default function NeuroadaptiveLayout({
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
