import React from 'react';

export const metadata = {
  title: 'Educator Dashboard | EdPsych Connect',
  description: 'Manage your classroom, track student progress, and plan your curriculum with our comprehensive educator dashboard.',
};

export default function EducatorDashboardLayout({
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
