import React from 'react';

export const metadata = {
  title: 'AI-Powered Assessment | EdPsych Connect',
  description: 'Experience intelligent assessment that adapts to your responses, provides personalized feedback, and builds a comprehensive understanding of your knowledge and skills.',
};

export default function AIPoweredAssessmentLayout({
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
