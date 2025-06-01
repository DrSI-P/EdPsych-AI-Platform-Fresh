import React from 'react';

export const metadata = {
  title: 'Meet Our Team | EdPsych Connect',
  description: 'Meet the passionate minds behind EdPsych Connect, dedicated to transforming education through educational psychology and cutting-edge technology.',
};

export default function TeamLayout({
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
