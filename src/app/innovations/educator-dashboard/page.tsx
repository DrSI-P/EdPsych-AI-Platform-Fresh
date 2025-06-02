import React from 'react';
import { Metadata } from 'next';
import DashboardWrapper from './wrapper';

// Metadata for the page
export const metadata: Metadata = {
  title: 'Educator Dashboard | EdPsych Connect',
  description: 'Manage your classroom, track student progress, and plan your curriculum',
};

// Main page component - server component
export default function EducatorDashboardPage() {
  return <DashboardWrapper />;
}
