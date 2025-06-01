import React from 'react';

export const metadata = {
  title: 'Biofeedback Learning System | EdPsych Connect',
  description: 'Experience our revolutionary learning environment that adapts to your physiological and emotional state in real-time, optimising conditions for maximum comprehension and retention.',
};

export default function BiofeedbackLearningLayout({
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
