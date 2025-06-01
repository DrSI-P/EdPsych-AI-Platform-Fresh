import React from 'react';

export const metadata = {
  title: 'Personalized Learning Pathways | EdPsych Connect',
  description: 'Experience AI-driven, adaptive learning journeys that evolve with each learner, creating truly personalized educational experiences based on individual needs, interests, and goals.',
};

export default function PersonalizedLearningPathwaysLayout({
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
