import React from 'react';

export const metadata = {
  title: 'Contact Us | EdPsych Connect',
  description: 'Get in touch with the EdPsych Connect team for support, information, or partnership inquiries.',
};

export default function ContactLayout({
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
