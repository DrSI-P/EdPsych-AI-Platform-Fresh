import React from 'react';

export const metadata = {
  title: 'Student Dashboard | EdPsych Connect',
  description: 'Track your progress, manage assignments, and set learning goals with our comprehensive student dashboard.',
};

export default function StudentDashboardLayout({
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
