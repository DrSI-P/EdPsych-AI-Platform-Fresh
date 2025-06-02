import React from 'react';
import { Metadata } from 'next';
import WebinarWrapper from './wrapper';

export const metadata: Metadata = {
  title: 'Professional Development Webinars | EdPsych Connect',
  description: 'Access and register for professional development webinars for educators and educational psychologists.',
};

export default function WebinarPage() {
  return (
    <div className="min-h-screen bg-background">
      <WebinarWrapper />
    </div>
  );
}
