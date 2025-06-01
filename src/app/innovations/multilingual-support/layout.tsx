import React from 'react';

export const metadata = {
  title: 'Multilingual Support | EdPsych Connect',
  description: 'Breaking language barriers in education with comprehensive multilingual capabilities that ensure every learner can access quality education in their preferred language.',
};

export default function MultilingualSupportLayout({
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
