import React from 'react';
import { Metadata } from 'next';
import ParentTeacherCommunication from '@/components/special-needs/parent-teacher-communication/parent-teacher-communication';

export const metadata: Metadata = {
  title: 'Parent-Teacher-Student Emotional Communication | EdPsych Connect',
  description: 'Collaborate on emotional wellbeing through secure, structured communication channels for parents, teachers, and students.',
};

export default function ParentTeacherCommunicationPage(): React.ReactNode {
  return (
    <div className="container mx-auto py-6">
      <ParentTeacherCommunication />
    </div>
  );
}
