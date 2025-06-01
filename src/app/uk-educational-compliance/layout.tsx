import React from 'react';

export const metadata = {
  title: 'UK Educational Compliance | EdPsych Connect',
  description: 'Ensure alignment with UK Department for Education standards and curriculum requirements.',
};

export default function UKEducationalComplianceLayout({
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
