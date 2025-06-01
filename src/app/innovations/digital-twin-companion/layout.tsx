import React from 'react';

export const metadata = {
  title: 'Digital Twin Learning Companion | EdPsych Connect',
  description: 'Meet your personalized AI learning companion that evolves with you, understands your unique learning profile, and provides tailored guidance throughout your educational journey.',
};

export default function DigitalTwinLayout({
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
